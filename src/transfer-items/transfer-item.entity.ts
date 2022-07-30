import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Transfer } from 'src/transfers/transfer.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'transfer_items' })
export class TransferItem {
  @PrimaryGeneratedColumn()
  transfer_item_id: number;

  @Column('int')
  transfer_id: number;

  @Column('int')
  blueprint_id: number;

  @Column('int')
  count: number;

  @Column('varchar', { default: '' })
  packs: string;

  @ManyToOne(
    () => Blueprint,
    (blueprint: Blueprint) => blueprint.transfer_items,
  )
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  blueprint: Blueprint;

  @ManyToOne(() => Transfer, (transfer: Transfer) => transfer.transfer_items)
  @JoinColumn({
    name: 'transfer_id',
    referencedColumnName: 'transfer_id',
  })
  transfer: Transfer;
}
