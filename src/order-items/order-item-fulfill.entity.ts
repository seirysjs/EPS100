import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Order } from 'src/orders/order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'order_item_fulfills' })
export class OrderItemFulfill {
  @PrimaryGeneratedColumn()
  order_item_fulfill_id: number;

  @Column('int')
  order_id: number;

  @Column('int')
  blueprint_id: number;

  @Column('int')
  count: number;

  @Column('datetime', { default: null })
  fulfilled_date: Date;

  @ManyToOne(
    () => Blueprint,
    (blueprint: Blueprint) => blueprint.order_item_fulfills,
  )
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  blueprint: Blueprint;

  @ManyToOne(() => Order, (order: Order) => order.order_item_fulfills)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  order: Order;
}
