import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.sessions, { nullable: false })
  user: User;

  @Index({ unique: true })
  @Column()
  refreshToken: string;

  @Column({ nullable: true })
  firstIp?: string;

  @Column({ nullable: true })
  lastIp?: string;

  @Column({ nullable: true })
  firstUserAgent?: string;

  @Column({ nullable: true })
  lastUserAgent?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('datetime', { nullable: true })
  expiresAt?: Date;
}
