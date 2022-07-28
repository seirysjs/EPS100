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
import { Worker } from 'src/workers/worker.entity';
import { Block } from 'src/blocks/block.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { BlockCut } from 'src/blocks/block-cut.entity';
import { BlockMultiCut } from 'src/blocks/block-multi-cut.entity';

@Entity({ name: 'warehouse_items' })
export class WarehouseItem {
  @PrimaryGeneratedColumn()
  warehouse_item_id: number;

  @Column('int')
  blueprint_id: number;

  @Column('int', { default: null })
  block_id: number;

  @Column('int', { default: null })
  block_multi_cut_id: number;

  @Column('int')
  worker_id: number;

  @Column('int')
  count: number;

  @Column('datetime')
  created_at: Date;

  @ManyToOne(() => Worker, (worker: Worker) => worker.warehouse_items)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  worker: Worker;

  @ManyToOne(() => Block, (block: Block) => block.warehouse_items)
  @JoinColumn({
    name: 'block_id',
    referencedColumnName: 'block_id',
  })
  block: Block;

  @ManyToOne(() => BlockMultiCut, (blockMultiCut: BlockMultiCut) => blockMultiCut.warehouse_items)
  @JoinColumn({
    name: 'block_multi_cut_id',
    referencedColumnName: 'block_multi_cut_id',
  })
  block_multi_cut: BlockMultiCut;

  @ManyToOne(
    () => Blueprint,
    (blueprint: Blueprint) => blueprint.warehouse_items,
  )
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  blueprint: Blueprint;

  @Column('int')
  block_cut_id: number;

  @OneToOne(() => BlockCut, blockCut => blockCut.warehouse_item)
  @JoinColumn({
    name: 'block_cut_id',
    referencedColumnName: 'block_cut_id'
  })
  block_cut: BlockCut;
}
