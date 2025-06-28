import { UUID } from 'crypto';
import { Account } from 'src/accounts/entities/account.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { File } from 'src/files/entities/file.entity';
import { Upi } from 'src/upis/entities/upi.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Nature, Type } from '../models/transaction.model';
import { Exclude } from 'class-transformer';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'SET NULL', // or 'SET NULL'
  })
  owner: User;

  @Column({ type: 'enum', enum: Nature })
  nature: Nature;

  @Column({ type: 'enum', enum: Type })
  type: Type;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true, // Needed for SET NULL
    onDelete: 'SET NULL', // or 'CASCADE'
  })
  category: Category;

  @Column()
  description: string;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @ManyToOne(() => Card, (card) => card.account, {
    nullable: true, // Needed for SET NULL
    onDelete: 'SET NULL', // or 'CASCADE'
  })
  card: Card;

  @ManyToOne(() => Upi, (upi) => upi.account, {
    nullable: true, // Needed for SET NULL
    onDelete: 'SET NULL', // or 'CASCADE'
  })
  upi: Upi;

  @ManyToMany(() => User, {
    nullable: true, // Needed for SET NULL
    onDelete: 'SET NULL', // or 'CASCADE'
  })
  @JoinTable()
  split_users: User[];

  @ManyToMany(() => File, (file) => file.transaction, {
    nullable: true, // Needed for SET NULL
    onDelete: 'SET NULL', // or 'CASCADE'
  })
  @JoinTable()
  files: File[];

  @ManyToMany(() => Comment, (comment) => comment.transaction, {
    nullable: true, // Needed for SET NULL
    onDelete: 'SET NULL', // or 'CASCADE'
  })
  @JoinTable()
  comments: Comment[];

  @Column({ type: 'timestamp' })
  transaction_date: Date;

  @Column({ default: false })
  is_paid: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
