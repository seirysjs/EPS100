import { Order } from 'src/orders/order.entity';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { Transport } from 'src/transports/transport.entity';
import { Worker } from 'src/workers/worker.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export type TransferStatusType = 'open' | 'wip' | 'done' | 'void';

@Entity({ name: 'transfers' })
export class Transfer {
  @PrimaryGeneratedColumn()
  transfer_id: number;

  @Column('int')
  order_id: number;

  @Column('varchar', { default: '' })
  vaz_number: string;

  @Column('varchar', { default: '' })
  invoice_number: string;

  @Column({
    type: 'enum',
    enum: ['open', 'wip', 'done', 'void'],
  })
  status: TransferStatusType;

  @Column('datetime', { default: null })
  invoice_date: Date;

  @Column('int', { default: null })
  transport_id: number;

  @Column('int', { default: null })
  worker_id: number;

  @Column('varchar', { default: '' })
  loading_address: string;

  @Column('varchar', { default: '' })
  loading_city: string;

  @Column('varchar', { default: '' })
  loading_country: string;

  @Column('varchar', { default: '' })
  loading_postal_code: string;

  @Column('datetime', { default: null })
  loading_date: Date;

  @Column('varchar', { default: '' })
  unloading_address: string;

  @Column('varchar', { default: '' })
  unloading_city: string;

  @Column('varchar', { default: '' })
  unloading_country: string;

  @Column('varchar', { default: '' })
  unloading_postal_code: string;

  @Column('datetime', { default: null })
  unloading_date: Date;

  @Column('varchar', { default: '' })
  unloading_phone_number: string;

  @OneToMany(
    () => TransferItem,
    (transferItem: TransferItem) => transferItem.transfer,
  )
  @JoinColumn({
    name: 'transfer_id',
    referencedColumnName: 'transfer_id',
  })
  transfer_items: TransferItem[];

  @ManyToOne(() => Order, (order: Order) => order.transfers)
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'order_id',
  })
  order: Order;

  @ManyToOne(() => Transport, (transport: Transport) => transport.transfers)
  @JoinColumn({
    name: 'transport_id',
    referencedColumnName: 'transport_id',
  })
  transport: Transport;

  @ManyToOne(() => Worker, (worker: Worker) => worker.transfers)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  worker: Worker;
}
