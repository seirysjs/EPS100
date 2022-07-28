const envNodeJs = process.env.NODE_ENV;

const config = {
  type: 'mysql' as any,
  host: (envNodeJs == "production") ? process.env.MYSQL_HOST : 'localhost',
  port: (envNodeJs == "production") ? process.env.MYSQL_PORT : 3306,
  username: (envNodeJs == "production") ? process.env.MYSQL_USER : 'root',
  password: (envNodeJs == "production") ? process.env.MYSQL_PASSWORD : '',
  database: (envNodeJs == "production") ? process.env.MYSQL_DATABASE : 'putu_sandelys',
  entities: [],
  migrations: ['dist/src/migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migration',
  },
  synchronize: false,
  migrationsRun: true
};

import { User } from "src/users/user.entity";
import { Block } from 'src/blocks/block.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Client } from 'src/clients/client.entity';
import { Order } from 'src/orders/order.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { Transport } from 'src/transports/transport.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { Worker } from 'src/workers/worker.entity';
import { ProductClass } from 'src/product-classes/product-class.entity';
import { ProductSize } from 'src/product-sizes/product-size.entity';
import { BlockCut } from "src/blocks/block-cut.entity";
import { Transfer } from "src/transfers/transfer.entity";
import { TransferItem } from "src/transfer-items/transfer-item.entity";
import { OrderItemFulfill } from "src/order-items/order-item-fulfill.entity";
import { Bill } from "src/bills/bill.entity";
import { BillItem } from "src/bill-items/bill-item.entity";
import { BillPayment } from "src/bills/bill-payment.entity";
import { PriceList } from "src/price-lists/price-list.entity";
import { Price } from "src/prices/price.entity";
import { BlockMultiCut } from "src/blocks/block-multi-cut.entity";

config.entities = [
  PriceList,
  Price,
  Bill,
  BillItem,
  BillPayment,
  User,
  Block,
  BlockCut,
  BlockMultiCut,
  Blueprint,
  Client,
  Order,
  OrderItem,
  OrderItemFulfill,
  Transport,
  Transfer,
  TransferItem,
  WarehouseItem,
  Worker,
  ProductClass,
  ProductSize,
];

export = config;
