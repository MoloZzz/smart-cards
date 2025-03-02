import { Controller } from '@nestjs/common';
import { CardService } from './card.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService){}

    @MessagePattern({ cmd: 'card-generated' })
    getEdratoForExternalSystem() {
        return this.cardService.saveGeneratedCard();
    }
}
