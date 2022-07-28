import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/orders/order.entity';
import {
  ManyToMany,
  JoinTable,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @IsNotEmpty()
  @Column('varchar')
  username: string;

  @IsNotEmpty()
  @Column('varchar')
  password: string;

  @Column('int', { default: 0 })
  last_login: Date;
}
