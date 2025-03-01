import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from '../common/entities/card.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CardRarity } from '../common/enums';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity) private readonly cardRepo: Repository<CardEntity>,
        @Inject('GENERATION_CLIENT') private readonly generatorClient: ClientProxy,
    ) {}

    public async sendRequestToGenerateCard(rarity: CardRarity, userId: number): Promise<CardEntity> {
        //TODO: замінити console.log і змінити цю функцію(краще service-generator змінити), так як вона не працює,
        //Тому що некоректна взаємодія з чергою. Наразі сервіс отримує дані через одну команду, а повертає через іншу.
        console.log(`Sending generate-card request for userId=${userId}, rarity=${rarity}`);
        try {
            const response = await lastValueFrom(this.generatorClient.send({ cmd: 'generate-card' }, { userId, rarity }));
            const cardData = response.data;
            console.log(`Received card data: ${JSON.stringify(cardData)}`);
            const card = this.cardRepo.create({
                name: cardData.name,
                rarity: cardData.rarity,
                imagePath: cardData.imagePath,
                ownerId: userId,
                status: 'available',
                createdAt: new Date(),
                updatedAt: new Date(),
                owner: null,
            });
            return await this.save(card);
        } catch (error) {
            console.error(`Error generating card: ${error.message}`);
            throw new Error('Failed to generate card');
        }
    }

    private async save(cardData: CardEntity): Promise<CardEntity> {
        return await this.cardRepo.save(cardData);
    }
}
