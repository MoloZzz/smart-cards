import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Auction } from './auction.entity';
import { Card } from './card.entity';

@Entity('wallet_transactions')
export class WalletTransaction {
    @PrimaryGeneratedColumn({ type: 'int', name: 'transaction_id' })
    id: number;

    @Column({ type: 'int', name: 'sender_id', nullable: true })
    senderId: number | null;

    @Column({ type: 'int', name: 'receiver_id', nullable: true })
    receiverId: number | null;

    @Column({ type: 'decimal', name: 'amount', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ['purchase', 'sale', 'lottery', 'transfer'], default: 'transfer' })
    type: string;

    @Column({ type: 'int', name: 'related_auction_id', nullable: true })
    relatedAuctionId: number | null;

    @Column({ type: 'int', name: 'related_card_id', nullable: true })
    relatedCardId: number | null;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Зв’язки
    @ManyToOne(() => User, (user) => user.sentTransactions, { nullable: true })
    sender: User | null;

    @ManyToOne(() => User, (user) => user.receivedTransactions, { nullable: true })
    receiver: User | null;

    @ManyToOne(() => Auction, (auction) => auction.id, { nullable: true })
    relatedAuction: Auction | null;

    @ManyToOne(() => Card, (card) => card.id, { nullable: true })
    relatedCard: Card | null;
}
