import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AuctionEntity } from './auction.entity';
import { UserEntity } from './user.entity';

@Entity('bids')
export class BidEntity {
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
    @ManyToOne(() => AuctionEntity, (auction) => auction.bids)
    auction: AuctionEntity;

    @ManyToOne(() => UserEntity, (user) => user.bids)
    bidder: UserEntity;
}
