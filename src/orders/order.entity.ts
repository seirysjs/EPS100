import { Bill } from 'src/bills/bill.entity';
import { Client } from 'src/clients/client.entity';
import { OrderItemFulfill } from 'src/order-items/order-item-fulfill.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { PriceList } from 'src/price-lists/price-list.entity';
import { Transfer } from 'src/transfers/transfer.entity';
import { Transport } from 'src/transports/transport.entity';
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

export type OrderStatusType = 'open' | 'wip' | 'done' | 'void' ;

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column('varchar', { default: "" })
  number: string;

  @Column('int', { default: null })
  transport_id: number;

  @Column({
    type: 'enum',
    enum: ['open', 'wip', 'done', 'void'],
  })
  status: OrderStatusType;

  @Column('int')
  client_id: number;

  @Column('int', { default: null })
  price_list_id: number;

  @Column('varchar', { default: "" })
  address: string;

  @Column('varchar', { default: "" })
  city: string;

  @Column('varchar', { default: "" })
  country: string;

  @Column('varchar', { default: "" })
  postal_code: string;

  @Column('varchar', { default: "" })
  laddress: string;

  @Column('varchar', { default: "" })
  lcity: string;

  @Column('varchar', { default: "" })
  lcountry: string;

  @Column('varchar', { default: "" })
  lpostal_code: string;

  @Column('datetime', { default: null })
  delivery_date: Date;

  @Column('varchar', { default: "" })
  note: string;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  order_items: OrderItem[];

  @OneToMany(() => OrderItemFulfill, (orderItemFulfill: OrderItemFulfill) => orderItemFulfill.order)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  order_item_fulfills: OrderItemFulfill[];

  @ManyToOne(() => Client, (client: Client) => client.orders)
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'client_id',
  })
  client: Client;

  @ManyToOne(() => Transport, (transport: Transport) => transport.orders)
  @JoinColumn({
    name: 'transport_id',
    referencedColumnName: 'transport_id',
  })
  transport: Transport;

  @ManyToOne(() => PriceList, (priceList: PriceList) => priceList.orders)
  @JoinColumn({
    name: 'price_list_id',
    referencedColumnName: 'price_list_id',
  })
  price_list: PriceList;

  @OneToMany(() => Transfer, (transfer: Transfer) => transfer.order)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  transfers: Transfer[];

  @OneToMany(() => Bill, (bill: Bill) => bill.order)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  bills: Bill[];
}
