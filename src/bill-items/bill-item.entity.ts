import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Bill } from 'src/bills/bill.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'bill_items' })
export class BillItem {
  @PrimaryGeneratedColumn()
  bill_item_id: number;

  @Column('int')
  bill_id: number;

  @Column('int')
  blueprint_id: number;

  @Column('int')
  count: number;

  @ManyToOne(() => Blueprint, (blueprint: Blueprint) => blueprint.bill_items)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  blueprint: Blueprint;

  @ManyToOne(() => Bill, (bill: Bill) => bill.bill_items)
  @JoinColumn({
    name: 'bill_id',
    referencedColumnName: 'bill_id',
  })
  bill: Bill;
}
