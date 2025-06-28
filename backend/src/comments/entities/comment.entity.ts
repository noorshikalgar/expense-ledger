import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 1024,
    type: 'varchar',
  })
  comment: string;

  @Column({ default: false })
  is_edited: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.comments, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
