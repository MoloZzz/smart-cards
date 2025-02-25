import pika
import json
import os
import time
import uuid
from diffusers import StableDiffusionPipeline
import torch
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CardGenerator:
    def __init__(self):
        # Налаштування Stable Diffusion
        self.pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
        if torch.cuda.is_available():
            self.pipe = self.pipe.to("cuda")

        # Налаштування RabbitMQ
        try:
            self.connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', 5672))
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue='RABBIT_MQ_GENERATOR_QUEUE', durable=True)
            self.channel.queue_declare(queue='card_generated', durable=True)
            logger.info("Connected to RabbitMQ at localhost:5672")
        except pika.exceptions.AMQPConnectionError as error:
            logger.error(f"Failed to connect to RabbitMQ: {error}")
            raise

    def generate_name(self, rarity):
        prefixes = {'common': 'Common', 'epic': 'Epic', 'legendary': 'Legendary', 'rare': 'Rare'}
        items = ['Sword', 'Axe', 'Shield']
        prefix = prefixes.get(rarity, 'Common')
        item = items[int(uuid.uuid4().int % len(items))]
        return f"{prefix} {item} of Eternity"

    def generate_image(self, rarity):
        prompt = f"{rarity} fantasy card, detailed, vibrant colors"
        image = self.pipe(prompt).images[0]
        os.makedirs('./storage/cards', exist_ok=True)
        image_path = f"./storage/cards/{rarity}_{int(time.time())}.jpg"
        image.save(image_path)
        return image_path

    def callback(self, ch, method, properties, body):
        try:
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
                'name': name,
                'rarity': rarity,
                'imagePath': image_path
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
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag)

    def start(self):
        self.channel.basic_consume(queue='RABBIT_MQ_GENERATOR_QUEUE', on_message_callback=self.callback)
        logger.info("Service-Generator started. Waiting for messages on RABBIT_MQ_GENERATOR_QUEUE...")
        self.channel.start_consuming()

if __name__ == "__main__":
    generator = CardGenerator()
    generator.start()