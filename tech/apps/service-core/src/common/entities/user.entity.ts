import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CardEntity } from './card.entity';
import { AuctionEntity } from './auction.entity';
import { BidEntity } from './bid.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
    id: number;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', name: 'password_hash' })
    passwordHash: string;

    @Column({ type: 'varchar', name: 'wallet_address' })
    walletAddress: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    balance: number;

    @Column({ type: 'boolean', name: 'is_active', default: true })
    isActive: boolean;

    @Column({ type: 'smallint', name: 'failed_login_attempts', default: 0 })
    failedLoginAttempts: number;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', name: 'locked_date', nullable: true })
    lockedDate: Date | null;

    @Column({ type: 'timestamp', name: 'last_login_date', nullable: true })
    lastLoginDate: Date | null;

    // Зв’язки
    @OneToMany(() => CardEntity, (card) => card.owner)
    cards: CardEntity[];

    @OneToMany(() => AuctionEntity, (auction) => auction.seller)
    auctionsAsSeller: AuctionEntity[];

    @OneToMany(() => AuctionEntity, (auction) => auction.winner)
    auctionsAsWinner: AuctionEntity[];

    @OneToMany(() => BidEntity, (bid) => bid.bidder)
    bids: BidEntity[];

    @OneToMany(() => WalletTransactionEntity, (transaction) => transaction.sender)
    sentTransactions: WalletTransactionEntity[];

    @OneToMany(() => WalletTransactionEntity, (transaction) => transaction.receiver)
    receivedTransactions: WalletTransactionEntity[];
}
