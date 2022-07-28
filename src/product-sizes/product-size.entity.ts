import { Blueprint } from 'src/blueprints/blueprint.entity';
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

@Entity({ name: 'product_sizes' })
export class ProductSize {
  @PrimaryGeneratedColumn()
  product_size_id: number;

  @Column('int')
  x_mm: number;

  @Column('int')
  y_mm: number;

  @Column('int')
  z_mm: number;

  @OneToMany(() => Blueprint, (blueprint: Blueprint) => blueprint.product_size)
  @JoinColumn({
    name: 'product_size_id',
    referencedColumnName: 'product_size_id',
  })
  blueprints: Blueprint[];
}
