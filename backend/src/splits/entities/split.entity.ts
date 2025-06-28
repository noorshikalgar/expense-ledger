import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('splits')
export class Split {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column()
  title: string;

  @Column('decimal')
  amount: number;

  @Column('decimal')
  split_amount: number;

  @ManyToMany(() => User)
  split_users: User[];

  @ManyToMany(() => Transaction)
  transactions: Transaction[];

  @Column({ type: 'enum', enum: ['pending', 'partial', 'complete'] })
  status: 'pending' | 'partial' | 'complete';

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
