import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../common/entities/card.entity';
import { RmqModule } from '@app/common/rmq/rmq.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CardEntity]),
        RmqModule.register({
            name: 'GENERATION_CLIENT',
            queueName: 'RABBIT_MQ_GENERATOR_QUEUE',
        }),
    ],
    controllers: [CardController],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule {}
