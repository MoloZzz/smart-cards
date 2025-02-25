import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('cards')
export class Card {
    @PrimaryGeneratedColumn({ type: 'int', name: 'card_id' })
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'enum', enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' })
    rarity: string;

    @Column({ type: 'varchar', name: 'image_path' })
    imagePath: string;

    @ManyToOne(() => User, (user) => user.cards)
    @Column({ type: 'int', name: 'owner_id' })
    ownerId: number;

    @Column({ type: 'enum', enum: ['available', 'in_auction', 'sold'], default: 'available' })
    status: string;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Зв’язки
    @ManyToOne(() => User, (user) => user.cards)
    owner: User;
}
