import pika
import json
import os
import time
from diffusers import StableDiffusionPipeline
import torch

class CardGenerator:
    def __init__(self):
        # Налаштування Stable Diffusion
        self.pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
        if torch.cuda.is_available():
            self.pipe = self.pipe.to("cuda")

        # Налаштування RabbitMQ
        self.connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='generate_card', durable=True)
        self.channel.queue_declare(queue='card_generated', durable=True)

    def generate_name(self, rarity):
        prefixes = {'epic': 'Epic', 'legendary': 'Legendary', 'rare': 'Rare'}
        items = ['Sword', 'Axe', 'Shield']
        prefix = prefixes.get(rarity, 'Common')
        item = items[int(time.time() % len(items))]
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
            payload = json.loads(body.decode())
            user_id = payload['userId']
            rarity = payload['rarity']

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
        except Exception as e:
            print(f"Error: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag)

    def start(self):
        self.channel.basic_consume(queue='generate_card', on_message_callback=self.callback)
        print("Service-Generator started. Waiting for messages...")
        self.channel.start_consuming()

if __name__ == "__main__":
    generator = CardGenerator()
    generator.start()