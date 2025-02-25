import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { CardRarity } from '../enums';

@Entity('cards')
export class CardEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'card_id' })
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'enum', enum: CardRarity, default: 'common' })
    rarity: CardRarity;

    @Column({ type: 'varchar', name: 'image_path' })
    imagePath: string;

    @ManyToOne(() => UserEntity, (user) => user.cards)
    @Column({ type: 'int', name: 'owner_id' })
    ownerId: number;

    @Column({ type: 'enum', enum: ['available', 'in_auction', 'sold'], default: 'available' })
    status: string;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Зв’язки
    @ManyToOne(() => UserEntity, (user) => user.cards)
    owner: UserEntity;
}
