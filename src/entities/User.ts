import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Generated,
  Index,
} from 'typeorm';

import { Session } from './Session';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column()
  uuid: string;

  @Index({ unique: true })
  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @OneToMany(type => Session, session => session.user, { cascade: true })
  sessions: Session[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
