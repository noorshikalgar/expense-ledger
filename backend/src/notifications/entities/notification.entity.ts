import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'owner' })
  owner: User;

  @Column({
    type: 'enum',
    enum: ['info', 'warning', 'alert', 'success'],
  })
  type: 'info' | 'warning' | 'alert' | 'success';

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High'],
  })
  priority: 'Low' | 'Medium' | 'High';

  @Column()
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
