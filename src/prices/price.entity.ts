import { IsDefined, IsNumber } from 'class-validator';
import { PriceList } from 'src/price-lists/price-list.entity';
import { ProductClass } from 'src/product-classes/product-class.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'prices' })
export class Price {
  @PrimaryGeneratedColumn()
  price_id: number;

  @IsDefined()
  @Column('int')
  price_list_id: number;

  @IsDefined()
  @Column('int')
  product_class_id: number;

  @IsNumber()
  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  amount: number;

  @IsNumber()
  @Column('decimal', { precision: 6, scale: 2, default: 20 })
  markup: number;

  @ManyToOne(
    () => ProductClass,
    (productClass: ProductClass) => productClass.prices,
  )
  @JoinColumn({
    name: 'product_class_id',
    referencedColumnName: 'product_class_id',
  })
  product_class: ProductClass;

  @ManyToOne(() => PriceList, (priceList: PriceList) => priceList.prices)
  @JoinColumn({
    name: 'price_list_id',
    referencedColumnName: 'price_list_id',
  })
  price_list: PriceList;
}
