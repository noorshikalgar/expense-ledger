import { Card } from 'src/cards/entities/card.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Upi } from 'src/upis/entities/upi.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal')
  balance: number;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @ManyToOne(() => User, (user) => user.accounts)
  owner: User;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];

  @OneToMany(() => Upi, (upi) => upi.account)
  upis: Upi[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
