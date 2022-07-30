import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Worker } from 'src/workers/worker.entity';
import { IsNumber } from 'class-validator';
import { Block } from './block.entity';
import { BlockCut } from './block-cut.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';

@Entity({ name: 'block_multi_cuts' })
export class BlockMultiCut {
  @IsNumber()
  @PrimaryGeneratedColumn()
  block_multi_cut_id: number;

  @IsNumber()
  @Column('int')
  worker_id: number;

  @IsNumber()
  @Column('int')
  product_class_id: number;

  @Column('datetime')
  created_at: Date;

  @ManyToOne(() => Worker, (worker: Worker) => worker.block_multi_cuts)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  worker: Worker;

  @OneToMany(() => Block, (block: Block) => block.block_multi_cut)
  @JoinColumn({
    name: 'block_multi_cut_id',
    referencedColumnName: 'block_multi_cut_id',
  })
  blocks: Block[];

  @OneToMany(() => BlockCut, (blockCut: BlockCut) => blockCut.block_multi_cut)
  @JoinColumn({
    name: 'block_multi_cut_id',
    referencedColumnName: 'block_multi_cut_id',
  })
  block_cuts: BlockCut[];

  @OneToMany(
    () => WarehouseItem,
    (warehouseItem: WarehouseItem) => warehouseItem.block_multi_cut,
  )
  @JoinColumn({
    name: 'block_multi_cut_id',
    referencedColumnName: 'block_multi_cut_id',
  })
  warehouse_items: WarehouseItem[];
}
