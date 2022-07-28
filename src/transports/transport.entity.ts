import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/orders/order.entity';
import { Transfer } from 'src/transfers/transfer.entity';
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

@Entity({ name: 'transports' })
export class Transport {
  @PrimaryGeneratedColumn()
  transport_id: number;

  @IsNotEmpty()
  @Column('varchar', { default: "" })
  number: string;

  @IsNotEmpty()
  @Column('varchar', { default: "" })
  name: string;

  @Column('int', { default: 0 })
  inventory_size_m3: number;

  @OneToMany(() => Order, (order: Order) => order.transport)
  @JoinColumn({
    name: 'transport_id',
    referencedColumnName: 'transport_id',
  })
  orders: Order[];

  @OneToMany(() => Transfer, (transfer: Transfer) => transfer.transport)
  @JoinColumn({
    name: 'transport_id',
    referencedColumnName: 'transport_id',
  })
  transfers: Transfer[];
}
