import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IFile } from '@app/common';

@Entity('files', { comment: 'Мета дані файлів' })
@Unique(['fileKey'])
export class FileEntity implements IFile {
    @PrimaryGeneratedColumn('increment', { type: 'int', name: 'card_id', comment: 'Ідентифікатор в СУББ' })
    id: number;

    @Column({ type: 'varchar', comment: 'Ключ файлу' })
    fileKey: string;

    @Column({ type: 'varchar', comment: 'Оригінальна назва' })
    originalName: string;

    @Column({ type: 'varchar', comment: 'Повна оригінальна назва' })
    originalFullName: string;

    @Column({ type: 'varchar', nullable: true, comment: 'Формат файлу' })
    mimetype: string;

    @Column({ type: 'varchar', nullable: true, comment: 'Розширення файлу' })
    extension: string;

    @Column({ type: 'int', comment: 'Розмір файлу' })
    size: number;

    @CreateDateColumn({ type: 'timestamp', comment: 'Дата створення' })
    createdAt: Date;

    @Column({ type: 'int', select: false, nullable: true, comment: 'Користувач який створив' })
    createdUserId: number;
}
