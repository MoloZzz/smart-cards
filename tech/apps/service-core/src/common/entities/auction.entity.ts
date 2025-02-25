import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Card } from './card.entity';
import { User } from './user.entity';
import { Bid } from './bid.entity';

@Entity('auctions')
export class Auction {
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
    @ManyToOne(() => Card, (card) => card.id)
    card: Card;

    @ManyToOne(() => User, (user) => user.auctionsAsSeller)
    seller: User;

    @ManyToOne(() => User, (user) => user.auctionsAsWinner, { nullable: true })
    winner: User | null;

    @OneToMany(() => Bid, (bid) => bid.auction)
    bids: Bid[];
}
