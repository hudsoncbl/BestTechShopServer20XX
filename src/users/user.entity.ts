import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { UserProfile } from '../profiles/user-profile.entity';
import { Order } from '../orders/order.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  // 🔹 OneToOne → Profile
  @OneToOne(() => UserProfile, (p) => p.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  profile: UserProfile;

  // 🔹 OneToMany → Orders
  @OneToMany(() => Order, (o) => o.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
