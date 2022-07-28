import { Order } from 'src/orders/order.entity';
import { BillItem } from 'src/bill-items/bill-item.entity';

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
import { BillPayment } from './bill-payment.entity';
import { PriceList } from 'src/price-lists/price-list.entity';

@Entity({ name: 'bills' })
export class Bill {
  @PrimaryGeneratedColumn()
  bill_id: number;

  @Column('int')
  order_id: number;

  @Column('int', { default: null })
  price_list_id: number;

  @Column('varchar', { default: "" })
  note: string;

  @Column('int', { default: 7 })
  days_postponed: number;

  @Column('datetime', { default: null })
  bill_date: Date;

  @OneToMany(() => BillItem, (billItem: BillItem) => billItem.bill)
  @JoinColumn({
    name: 'bill_id',
    referencedColumnName: 'bill_id',
  })
  bill_items: BillItem[];

  @ManyToOne(() => Order, (order: Order) => order.bills)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  order: Order;

  @ManyToOne(() => PriceList, (priceList: PriceList) => priceList.bills)
  @JoinColumn({
    name: 'price_list_id',
    referencedColumnName: 'price_list_id',
  })
  price_list: PriceList;

  @OneToMany(() => BillPayment, (billPayment: BillPayment) => billPayment.bill)
  @JoinColumn({
    name: 'bill_id',
    referencedColumnName: 'bill_id',
  })
  bill_payments: BillPayment[];
}
