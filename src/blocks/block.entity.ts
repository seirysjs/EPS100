import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ProductClass } from 'src/product-classes/product-class.entity';
import { Worker } from 'src/workers/worker.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BlockCut } from './block-cut.entity';
import { BlockMultiCut } from './block-multi-cut.entity';

export type BlockStatusType = 'drying' | 'queue' | 'wip' | 'done' | 'void';

@Entity({ name: 'blocks' })
export class Block {
  @IsNumber()
  @PrimaryGeneratedColumn()
  block_id: number;

  @IsNumber()
  @Column('int')
  worker_id: number;

  @IsNumber()
  @Column('int')
  product_class_id: number;

  @Column('int', { default: null })
  block_multi_cut_id: number;

  @IsDate()
  @IsNotEmpty()
  @Column('datetime')
  drying_started_at: Date;

  @IsDate()
  @IsNotEmpty()
  @Column('datetime')
  drying_ends_at: Date;

  @IsString()
  @Column({
    type: 'enum',
    enum: ['drying', 'queue', 'wip', 'done', 'void'],
  })
  status: BlockStatusType;

  @ManyToOne(
    () => ProductClass,
    (productClass: ProductClass) => productClass.blocks,
  )
  @JoinColumn({
    name: 'product_class_id',
    referencedColumnName: 'product_class_id',
  })
  product_class: ProductClass;

  @ManyToOne(() => Worker, (worker: Worker) => worker.blocks)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  worker: Worker;

  @ManyToOne(
    () => BlockMultiCut,
    (blockMultiCut: BlockMultiCut) => blockMultiCut.blocks,
  )
  @JoinColumn({
    name: 'block_multi_cut_id',
    referencedColumnName: 'block_multi_cut_id',
  })
  block_multi_cut: BlockMultiCut;

  @OneToMany(
    () => WarehouseItem,
    (warehouseItem: WarehouseItem) => warehouseItem.block,
  )
  @JoinColumn({
    name: 'block_id',
    referencedColumnName: 'block_id',
  })
  warehouse_items: WarehouseItem[];

  @OneToMany(() => BlockCut, (blockCut: BlockCut) => blockCut.block)
  @JoinColumn({
    name: 'block_id',
    referencedColumnName: 'block_id',
  })
  block_cut: BlockCut[];
}
