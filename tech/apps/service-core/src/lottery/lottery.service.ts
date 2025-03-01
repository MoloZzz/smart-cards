import { Inject, Injectable } from '@nestjs/common';
import { CardRarity, RarityWeights } from '../common/enums';
import { CardService } from '../card/card.service';
import { CardEntity } from '../common/entities/card.entity';

@Injectable()
export class LotteryService {
    constructor(@Inject(CardService) private readonly cardService: CardService) {}

    async spinLottery(userId: number): Promise<CardEntity> {
        //TODO: замінити console.log на логування.
        const rarity = this.getRandomRarity();
        console.log(`Spinning lottery for userId=${userId}, rarity=${rarity}`);
        const card = await this.cardService.sendRequestToGenerateCard(rarity, userId);
        console.log(`Generated card: ${JSON.stringify(card)}`);
        return card;
    }

    private getRandomRarity(): CardRarity {
        const rarities = [
            { rarity: CardRarity.Common, weight: RarityWeights.Common },
            { rarity: CardRarity.Rare, weight: RarityWeights.Rare },
            { rarity: CardRarity.Epic, weight: RarityWeights.Epic },
            { rarity: CardRarity.Legendary, weight: RarityWeights.Legendary },
        ];
        const totalWeight = rarities.reduce((sum, item) => sum + item.weight, 0);
        const rand = Math.random() * totalWeight;
        let cumulativeWeight = 0;

        for (const item of rarities) {
            cumulativeWeight += item.weight;
            if (rand <= cumulativeWeight) {
                return item.rarity;
            }
        }
        // Не впевнений що це вірний підхід, треба буде це перевірити
        throw new Error('Unexpected error in random rarity selection');
    }
}
