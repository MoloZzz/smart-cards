import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { RmqModule } from '@app/common/rmq/rmq.module';

@Module({
    providers: [LotteryService],
    imports: [
        RmqModule.register({
            name: 'GENERATOR_SERVICE',
            queueName: 'RABBIT_MQ_GENERATION_QUEUE',
        }),
    ],
})
export class LotteryModule {}
