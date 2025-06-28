import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('emis')
export class Emi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column('decimal')
  amount: number;

  @Column('decimal')
  emi: number;

  @Column()
  months: string;

  @Column({ type: 'enum', enum: ['new', 'existing'] })
  type: 'new' | 'existing';

  @Column('date')
  start_date: string;

  @Column('date')
  end_date: string;

  @Column('decimal')
  interest: number;

  @Column({ default: false })
  is_completed: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.id)
  transactions: Transaction[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
