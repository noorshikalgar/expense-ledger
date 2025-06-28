import { Exclude, Expose } from 'class-transformer';
import { Account } from 'src/accounts/entities/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('upis')
export class Upi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  upi: string;

  @ManyToOne(() => Account, (account) => account.upis)
  @Expose({ groups: ['upi.detail'] }) // Expose user only for 'post.detail' group
  @Exclude({ toPlainOnly: true })
  account: Account;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  constructor(partial: Partial<Upi>) {
    Object.assign(this, partial);
  }
}
