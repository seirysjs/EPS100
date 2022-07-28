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

import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Bill } from './bill.entity';

@Entity({ name: 'bill_payments' })
export class BillPayment {
  @PrimaryGeneratedColumn()
  bill_payment_id: number;

  @IsNumber()
  @Column('int')
  bill_id: number;

  @IsNumber()
  @Column("decimal", { precision: 8, scale: 2, default: 0 })
  amount: number;

  @IsDate()
  @Column('datetime', { default: null })
  payment_date: Date;

  @Column("varchar")
  note: string;

  @ManyToOne(() => Bill, (bill: Bill) => bill.bill_payments)
  @JoinColumn({
    name: 'bill_id',
    referencedColumnName: 'bill_id',
  })
  bill: Bill;
}
