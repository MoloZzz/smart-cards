import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuctionEntity } from './auction.entity';
import { CardEntity } from './card.entity';

@Entity('wallet_transactions')
export class WalletTransactionEntity {
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
    @ManyToOne(() => UserEntity, (user) => user.sentTransactions, { nullable: true })
    sender: UserEntity | null;

    @ManyToOne(() => UserEntity, (user) => user.receivedTransactions, { nullable: true })
    receiver: UserEntity | null;

    @ManyToOne(() => AuctionEntity, (auction) => auction.id, { nullable: true })
    relatedAuction: AuctionEntity | null;

    @ManyToOne(() => CardEntity, (card) => card.id, { nullable: true })
    relatedCard: CardEntity | null;
}
