import pika
import json
import os
import uuid
from diffusers import StableDiffusionPipeline
import torch
from accelerate import Accelerator
import logging
import time
from dotenv import load_dotenv

# Налаштування логування
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CardGenerator:
    def __init__(self):
        load_dotenv()  # Завантажує змінні з .env у os.environ
        logger.info("Loaded environment variables from .env")

        self.accelerator = Accelerator()
        logger.info("Initializing Accelerator for Stable Diffusion")

        # Налаштування Stable Diffusion з оптимізацією через Accelerator
        self.pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            use_safetensors=True,
            variant="fp16" if torch.cuda.is_available() else None
        )
        self.pipe = self.accelerator.prepare(self.pipe)  # Оптимізація pipeline

        if torch.cuda.is_available():
            logger.info("Using GPU for Stable Diffusion with Accelerator")
        else:
            logger.warning("No GPU detected, using CPU with Accelerator. Generation will be slower.")

        # Налаштування RabbitMQ з обробкою з’єднання
        self.connection = None
        self.channel = None
        self.connect_to_rabbitmq()

    def connect_to_rabbitmq(self):
        if self.connection and not self.connection.is_closed:
            return
        try:
            rabbitmq_host = os.getenv('RABBITMQ_HOST', 'localhost')
            rabbitmq_port = int(os.getenv('RABBITMQ_PORT', 5672))
            generator_queue = os.getenv('RABBITMQ_GENERATOR_QUEUE', 'RABBIT_MQ_GENERATOR_QUEUE')
            core_queue = os.getenv('RABBITMQ_CORE_QUEUE', 'RABBIT_MQ_CORE_QUEUE')

            self.connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, rabbitmq_port))
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue=generator_queue, durable=True)
            self.channel.queue_declare(queue=core_queue, durable=True)
            logger.info(f"Connected to RabbitMQ at {rabbitmq_host}:{rabbitmq_port}")
        except pika.exceptions.AMQPConnectionError as error:
            logger.error(f"Failed to connect to RabbitMQ: {error}")
            raise

    def generate_name(self, rarity: str) -> str:
        prefixes = {'common': 'Common', 'epic': 'Epic', 'legendary': 'Legendary', 'rare': 'Rare'}
        items = ['Sword', 'Axe', 'Shield']
        prefix = prefixes.get(rarity, 'Common')
        item = items[int(uuid.uuid4().int % len(items))]
        return f"{prefix} {item} of Eternity"

    def generate_image(self, rarity: str) -> str:
        start_time = time.time()
        prompt_template = os.getenv('GENERATION_PROMPT')
        negative_prompt = os.getenv('GENERATION_NEGATIVE_PROMPT')
        
        image = self.pipe(
            prompt_template,
            negative_prompt=negative_prompt,
            num_inference_steps=10,
            guidance_scale=7.0,
            height=512,
            width=512,
        ).images[0]
        
        os.makedirs('./storage/cards', exist_ok=True)
        image_path = f"./storage/cards/{rarity}_{uuid.uuid4()}.jpg"
        image.save(image_path)
        end_time = time.time()
        logger.info(f"Generated image in {end_time - start_time:.2f} seconds")
        return image_path

    def callback(self, ch, method, properties, body):
        try:
            if self.channel.is_closed:
                self.connect_to_rabbitmq()

            logger.debug(f"Received raw message: {body.decode()}")
            payload = json.loads(body.decode())
            data = payload.get('data', {})
            cmd = payload.get('pattern', {}).get('cmd')

            if cmd != 'generate-card':
                logger.warning(f"Unexpected command or format: {cmd or 'None'}")
                ch.basic_nack(delivery_tag=method.delivery_tag)
                return

            user_id = data.get('userId')
            rarity = data.get('rarity')

            if not user_id or not rarity:
                logger.error(f"Missing required fields: userId or rarity. Payload: {payload}")
                ch.basic_nack(delivery_tag=method.delivery_tag)
                return

            logger.info(f"Received generate-card request: userId={user_id}, rarity={rarity}")
            name = self.generate_name(rarity)
            image_path = self.generate_image(rarity)

            response = {
                'cmd': 'card_generated',
                'data': {
                    'name': name,
                    'rarity': rarity,
                    'imagePath': image_path
                }
            }
            ch.basic_publish(
                exchange='',
                routing_key='card_generated',
                body=json.dumps(response),
                properties=pika.BasicProperties(
                    correlation_id=properties.correlation_id
                )
            )
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON: {e}. Message: {body.decode()}")
            ch.basic_nack(delivery_tag=method.delivery_tag)
        except pika.exceptions.ChannelClosed as e:
            logger.error(f"Channel closed during processing: {e}. Reconnecting...")
            self.connect_to_rabbitmq()
            ch.basic_nack(delivery_tag=method.delivery_tag)
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag)

    def start(self):
        try:
            self.channel.basic_consume(queue='RABBIT_MQ_GENERATOR_QUEUE', on_message_callback=self.callback)
            logger.info("Service-Generator started. Waiting for messages on RABBIT_MQ_GENERATOR_QUEUE...")
            self.channel.start_consuming()
        except KeyboardInterrupt:
            logger.info("Service-Generator stopped by user")
        except Exception as e:
            logger.error(f"Service-Generator stopped due to error: {e}")
            self.reconnect()

    def reconnect(self):
        max_attempts = 5
        attempt = 0
        while attempt < max_attempts:
            try:
                self.connect_to_rabbitmq()
                logger.info("Reconnected to RabbitMQ at localhost:5672")
                self.start()
                break
            except pika.exceptions.AMQPConnectionError as e:
                attempt += 1
                logger.error(f"Reconnection attempt {attempt}/{max_attempts} failed: {e}")
                time.sleep(5)
        if attempt >= max_attempts:
            logger.error("Failed to reconnect to RabbitMQ after maximum attempts")
            raise Exception("Unable to reconnect to RabbitMQ")

if __name__ == "__main__":
    generator = CardGenerator()
    generator.start()