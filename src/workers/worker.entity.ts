import { IsNotEmpty } from 'class-validator';
import { BlockCut } from 'src/blocks/block-cut.entity';
import { BlockMultiCut } from 'src/blocks/block-multi-cut.entity';
import { Block } from 'src/blocks/block.entity';
import { Transfer } from 'src/transfers/transfer.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'workers' })
export class Worker {
  @PrimaryGeneratedColumn()
  worker_id: number;

  @IsNotEmpty()
  @Column('varchar')
  name: string;

  @Column('bool', { default: true })
  enabled: boolean;

  @OneToMany(() => Block, (block: Block) => block.worker)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  blocks: Block[];

  @OneToMany(() => BlockCut, (blockCut: BlockCut) => blockCut.worker)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  block_cuts: BlockCut[];

  @OneToMany(
    () => BlockMultiCut,
    (blockMultiCut: BlockMultiCut) => blockMultiCut.worker,
  )
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  block_multi_cuts: BlockMultiCut[];

  @OneToMany(
    () => WarehouseItem,
    (warehouseItem: WarehouseItem) => warehouseItem.worker,
  )
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  warehouse_items: WarehouseItem[];

  @OneToMany(() => Transfer, (transfer: Transfer) => transfer.worker)
  @JoinColumn({
    name: 'worker_id',
    referencedColumnName: 'worker_id',
  })
  transfers: Transfer[];
}
