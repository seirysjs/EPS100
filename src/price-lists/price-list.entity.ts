
import { Order } from 'src/orders/order.entity';
import { Price } from 'src/prices/price.entity';
import { Bill } from 'src/bills/bill.entity';

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
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity({ name: 'price_lists' })
export class PriceList {
  @PrimaryGeneratedColumn()
  price_list_id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { default: "" })
  name: string;

  @Column('varchar', { default: "" })
  note: string;

  @IsDate()
  @Column('datetime', { default: null })
  price_list_date: Date;

  @Column('bool', { default: true })
  enabled: boolean;

  @OneToMany(() => Price, (price: Price) => price.price_list)
  @JoinColumn({
    name: 'price_list_id',
    referencedColumnName: 'price_list_id',
  })
  prices: Price[];

  @OneToMany(() => Order, (order: Order) => order.price_list)
  @JoinColumn({
    name: 'price_list_id',
    referencedColumnName: 'price_list_id',
  })
  orders: Order[];

  @OneToMany(() => Bill, (bill: Bill) => bill.price_list)
  @JoinColumn({
    name: 'price_list_id',
    referencedColumnName: 'price_list_id',
  })
  bills: Bill[];
}
