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
import { ProductClass } from 'src/product-classes/product-class.entity';
import { ProductSize } from 'src/product-sizes/product-size.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { BlockCut } from 'src/blocks/block-cut.entity';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { OrderItemFulfill } from 'src/order-items/order-item-fulfill.entity';
import { BillItem } from 'src/bill-items/bill-item.entity';

@Entity({ name: 'blueprints' })
export class Blueprint {
  @PrimaryGeneratedColumn()
  blueprint_id: number;

  @Column('int')
  product_class_id: number;

  @Column('int')
  product_size_id: number;

  @ManyToOne(
    () => ProductClass,
    (productClass: ProductClass) => productClass.blueprints,
  )
  @JoinColumn({
    name: 'product_class_id',
    referencedColumnName: 'product_class_id',
  })
  product_class: ProductClass;

  @ManyToOne(
    () => ProductSize,
    (productSize: ProductSize) => productSize.blueprints,
  )
  @JoinColumn({
    name: 'product_size_id',
    referencedColumnName: 'product_size_id',
  })
  product_size: ProductSize;

  @OneToMany(
    () => WarehouseItem,
    (warehouseItem: WarehouseItem) => warehouseItem.blueprint,
  )
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  warehouse_items: WarehouseItem[];

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.blueprint)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  order_items: OrderItem[];

  @OneToMany(() => OrderItemFulfill, (orderItemFulfill: OrderItemFulfill) => orderItemFulfill.blueprint)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  order_item_fulfills: OrderItemFulfill[];

  @OneToMany(() => BlockCut, (blockCut: BlockCut) => blockCut.blueprint)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  block_cuts: BlockCut[];

  @OneToMany(() => TransferItem, (transferItem: TransferItem) => transferItem.blueprint)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  transfer_items: TransferItem[];

  @OneToMany(() => BillItem, (billItem: BillItem) => billItem.blueprint)
  @JoinColumn({
    name: 'blueprint_id',
    referencedColumnName: 'blueprint_id',
  })
  bill_items: BillItem[];
}
