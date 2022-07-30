import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Worker } from 'src/workers/worker.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { IsNumber } from 'class-validator';
import { Block } from './block.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { BlockMultiCut } from './block-multi-cut.entity';

export type BlockStatusType = 'drying' | 'queue' | 'wip' | 'done' | 'void';

@Entity({ name: 'block_cuts' })
export class BlockCut {
  @IsNumber()
  @PrimaryGeneratedColumn()
  block_cut_id: number;

  @Column('int', { default: null })
  block_multi_cut_id: number;

  @Column('int', { default: null })
  block_id: number;

  @IsNumber()
  @Column('int')
  worker_id: number;

  @IsNumber()
  @Column('int')
  blueprint_id: number;

  @Column('int')
  count: number;

  @Column('datetime')
  created_at: Date;

  @ManyToOne(
    () => Blueprint,
    (blueprint: Blueprint) => blueprint.warehouse_items,
  )
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  blueprint: Blueprint;

  @ManyToOne(
    () => BlockMultiCut,
    (blockMultiCut: BlockMultiCut) => blockMultiCut.block_cuts,
  )
  @JoinColumn({
    name: 'block_multi_cut_id',
    referencedColumnName: 'block_multi_cut_id',
  })
  block_multi_cut: BlockMultiCut;

  @ManyToOne(() => Worker, (worker: Worker) => worker.blocks)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  worker: Worker;

  @OneToOne(() => WarehouseItem, (warehouseItem) => warehouseItem.block_cut)
  warehouse_item: WarehouseItem;

  @ManyToOne(() => Block, (block: Block) => block.warehouse_items)
  @JoinColumn({
    name: 'block_id',
    referencedColumnName: 'block_id',
  })
  block: Block;
}
