import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('recurrings')
export class Recurring {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column('decimal')
  amount: number;

  @Column('date')
  start_date: string;

  @Column('date')
  end_date: string;

  @Column({ type: 'enum', enum: ['weekly', 'daily', 'monthly', 'quarterly', 'yearly'] })
  recurring: 'weekly' | 'daily' | 'monthly' | 'quarterly' | 'yearly';

  @Column('int')
  pause_period: number;

  @OneToMany(() => Transaction, (transaction) => transaction.id)
  transactions: Transaction[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
