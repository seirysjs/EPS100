import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Block } from 'src/blocks/block.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Price } from 'src/prices/price.entity';

@Entity({ name: 'product_classes' })
export class ProductClass {
  @PrimaryGeneratedColumn()
  product_class_id: number;

  @Column('varchar')
  name: string;

  @Column('int')
  days_to_dry: number;

  @OneToMany(() => Block, (block: Block) => block.product_class)
  @JoinColumn({
    name: 'product_class_id',
    referencedColumnName: 'product_class_id',
  })
  blocks: Block[];

  @OneToMany(() => Blueprint, (blueprint: Blueprint) => blueprint.product_class)
  @JoinColumn({
    name: 'product_class_id',
    referencedColumnName: 'product_class_id',
  })
  blueprints: Blueprint[];

  @OneToMany(() => Price, (price: Price) => price.product_class)
  @JoinColumn({
    name: 'product_class_id',
    referencedColumnName: 'product_class_id',
  })
  prices: Price[];
}
