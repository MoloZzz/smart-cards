import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { LotteryController } from './lottery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../common/entities/card.entity';

@Module({
    providers: [LotteryService],
    imports: [
        TypeOrmModule.forFeature([CardEntity]),
        RmqModule.register({
            name: 'GENERATION_CLIENT',
            queueName: 'RABBIT_MQ_GENERATOR_QUEUE',
        }),
    ],
    controllers: [LotteryController],
})
export class LotteryModule {}
