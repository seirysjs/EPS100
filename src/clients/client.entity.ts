import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/orders/order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn()
  client_id: number;

  @IsNotEmpty()
  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @IsNotEmpty()
  @Column('varchar')
  address: string;

  @IsNotEmpty()
  @Column('varchar')
  city: string;

  @IsNotEmpty()
  @Column('varchar')
  country: string;

  @Column('varchar', { default: '' })
  postal_code: string;

  @IsNotEmpty()
  @Column('varchar', { default: '' })
  phone: string;

  @Column('varchar', { default: '' })
  company_code: string;

  @Column('varchar', { default: '' })
  vat_code: string;

  @Column('varchar', { default: '' })
  banks_name: string;

  @Column('varchar', { default: '' })
  account_number: string;

  @OneToMany(() => Order, (order: Order) => order.client)
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'client_id',
  })
  orders: Order[];
}
