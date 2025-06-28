import { fa } from '@faker-js/faker/.';
import { Account } from 'src/accounts/entities/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  card_name: string;

  @Column({ type: 'varchar', length: 4 })
  card_number: string;

  @Column({ type: 'enum', enum: ['debit', 'credit'] })
  type: 'debit' | 'credit';

  @Column('decimal', { nullable: true })
  balance: number;

  @Column('decimal', { nullable: true })
  credit_limit: number;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
