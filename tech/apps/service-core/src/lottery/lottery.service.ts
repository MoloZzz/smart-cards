import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CardEntity } from '../common/entities/card.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CardRarity } from '../common/enums';

@Injectable()
export class LotteryService {
    constructor(
        @Inject('GENERATOR_SERVICE') private readonly generatorClient: ClientProxy,
        private readonly cardRepo: Repository<CardEntity>,
    ) {}

    async spinLottery(userId: number): Promise<CardEntity> {
        const rarity = this.getRandomRarity([60, 25, 10, 5]);

        const cardData = await this.generatorClient.send({ cmd: 'generate_card' }, { userId, rarity }).toPromise();

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
        const rarities = CardRarity;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (rand <= sum) return rarities[i];
        }
    }
}
