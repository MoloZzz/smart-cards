import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CardEntity } from './card.entity';
import { UserEntity } from './user.entity';
import { BidEntity } from './bid.entity';

@Entity('auctions')
export class AuctionEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'auction_id' })
    id: number;

    @Column({ type: 'int', name: 'card_id', unique: true })
    cardId: number;

    @Column({ type: 'int', name: 'seller_id' })
    sellerId: number;

    @Column({ type: 'decimal', name: 'start_price', precision: 15, scale: 2 })
    startPrice: number;

    @Column({ type: 'decimal', name: 'current_price', precision: 15, scale: 2, nullable: true })
    currentPrice: number | null;

    @Column({ type: 'timestamp', name: 'start_time' })
    startTime: Date;

    @Column({ type: 'timestamp', name: 'end_time' })
    endTime: Date;

    @Column({ type: 'enum', enum: ['active', 'closed', 'cancelled'], default: 'active' })
    status: string;

    @Column({ type: 'int', name: 'winner_id', nullable: true })
    winnerId: number | null;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Зв’язки
    @ManyToOne(() => CardEntity, (card) => card.id)
    card: CardEntity;

    @ManyToOne(() => UserEntity, (user) => user.auctionsAsSeller)
    seller: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.auctionsAsWinner, { nullable: true })
    winner: UserEntity | null;

    @OneToMany(() => BidEntity, (bid) => bid.auction)
    bids: BidEntity[];
}
