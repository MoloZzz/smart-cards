import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../common/entities/card.entity';

@Module({
  controllers: [CardController],
  imports: [TypeOrmModule.forFeature([CardEntity]),],
  providers: [CardService]
})
export class CardModule {}
