import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auction } from './auction.entity';
import { User } from './user.entity';

@Entity('bids')
export class Bid {
    @PrimaryGeneratedColumn({ type: 'int', name: 'bid_id' })
    id: number;

    @Column({ type: 'int', name: 'auction_id' })
    auctionId: number;

    @Column({ type: 'int', name: 'bidder_id' })
    bidderId: number;

    @Column({ type: 'decimal', name: 'bid_amount', precision: 15, scale: 2 })
    bidAmount: number;

    @Column({ type: 'timestamp', name: 'bid_time', default: () => 'CURRENT_TIMESTAMP' })
    bidTime: Date;

    // Зв’язки
    @ManyToOne(() => Auction, (auction) => auction.bids)
    auction: Auction;

    @ManyToOne(() => User, (user) => user.bids)
    bidder: User;
}
