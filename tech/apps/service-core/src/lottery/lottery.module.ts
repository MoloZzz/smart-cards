import { forwardRef, Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../common/entities/card.entity';
import { CardModule } from '../card/card.module';

@Module({
    providers: [LotteryService],
    imports: [forwardRef(() => CardModule)],
    controllers: [LotteryController],
})
export class LotteryModule {}
