import { Account } from 'src/accounts/entities/account.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Split } from 'src/splits/entities/split.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  mobile: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default: false})
  is_deleted: boolean;

  @OneToMany(() => Account, (account) => account.owner)
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.owner)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.owner)
  transactions: Transaction[];

  @OneToMany(() => Split, (split) => split.owner)
  splits: Split[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Notification, (notification) => notification.owner)
  notifications: Notification[]
}
