import { Blueprint } from 'src/blueprints/blueprint.entity';
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

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @Column('int')
  order_id: number;

  @Column('int')
  blueprint_id: number;

  @Column('int')
  count: number;

  @ManyToOne(() => Blueprint, (blueprint: Blueprint) => blueprint.order_items)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  blueprint: Blueprint;

  @ManyToOne(() => Order, (order: Order) => order.order_items)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  order: Order;
}
