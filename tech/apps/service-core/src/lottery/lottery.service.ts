import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CardEntity } from '../common/entities/card.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CardRarity } from '../common/enums';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LotteryService {
    constructor(
        @Inject('GENERATION_CLIENT') private readonly generatorClient: ClientProxy,
        @InjectRepository(CardEntity) private readonly cardRepo: Repository<CardEntity>,
    ) {}

    async spinLottery(userId: number): Promise<CardEntity> {
        console.log('i m here')
        const rarity = this.getRandomRarity([70, 25, 4, 1]);
        console.log(rarity);
        const cardData = await lastValueFrom(this.generatorClient.send({ cmd: 'generate-card' }, { userId, rarity }));
        console.log(cardData);
        return this.cardRepo.save({
            name: cardData.name,
            rarity: cardData.rarity,
            imagePath: cardData.imagePath,
            ownerId: userId,
            status: 'available',
            createdAt: new Date(),
            updatedAt: new Date(),
            owner: null,
        });
    }

    private getRandomRarity(weights: number[]): string {
        const total = weights.reduce((a, b) => a + b, 0);
        const rand = Math.random() * total;
        let sum = 0;
        const rarities = ['common', 'rare', 'epic', 'legendary'];
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (rand <= sum) return rarities[i];
        }
    }
}
