import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Card } from './card.entity';
import { Auction } from './auction.entity';
import { Bid } from './bid.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity('users')
export class User {
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
    @OneToMany(() => Card, (card) => card.owner)
    cards: Card[];

    @OneToMany(() => Auction, (auction) => auction.seller)
    auctionsAsSeller: Auction[];

    @OneToMany(() => Auction, (auction) => auction.winner)
    auctionsAsWinner: Auction[];

    @OneToMany(() => Bid, (bid) => bid.bidder)
    bids: Bid[];

    @OneToMany(() => WalletTransaction, (transaction) => transaction.sender)
    sentTransactions: WalletTransaction[];

    @OneToMany(() => WalletTransaction, (transaction) => transaction.receiver)
    receivedTransactions: WalletTransaction[];
}
