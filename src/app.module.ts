import { TransferItemsModule } from './transfer-items/transfer-items.module';
import { TransferItemsService } from './transfer-items/transfer-items.service';
import { TransferItemsController } from './transfer-items/transfer-items.controller';
import { TransfersModule } from './transfers/transfers.module';
import { TransfersService } from './transfers/transfers.service';
import { TransfersController } from './transfers/transfers.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ProductSizesModule } from './product-sizes/product-sizes.module';
import { ProductClassModule } from './product-classes/product-class.module';
import { ProductClassController } from './product-classes/product-class.controller';
import { WorkersModule } from './workers/workers.module';
import { WarehouseItemsModule } from './warehouse-items/warehouse-items.module';
import { WarehouseItemsController } from './warehouse-items/warehouse-items.controller';
import { TransportsModule } from './transports/transports.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrderItemsController } from './order-items/order-items.controller';
import { ClientsModule } from './clients/clients.module';
import { BlueprintsModule } from './blueprints/blueprints.module';
import { BlueprintsService } from './blueprints/blueprints.service';
import { BlueprintsController } from './blueprints/blueprints.controller';
import { BlocksModule } from './blocks/blocks.module';
import { BlocksService, TasksService } from './blocks/blocks.service';
import { BlocksController } from './blocks/blocks.controller';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsController } from './clients/clients.controller';
import { OrdersController } from './orders/orders.controller';
import { TransportsController } from './transports/transports.controller';
import { WorkersController } from './workers/workers.controller';
import { WarehouseItemsService } from './warehouse-items/warehouse-items.service';
import { WorkersService } from './workers/workers.service';
import { TransportsService } from './transports/transports.service';
import { OrderItemsService } from './order-items/order-items.service';
import { OrdersService } from './orders/orders.service';
import { ClientsService } from './clients/clients.service';

import * as config from '../ormconfig-migrations';
import { ProductSizesController } from './product-sizes/product-sizes.controller';
import { ProductClassService } from './product-classes/product-class.service';
import { ProductSizesService } from './product-sizes/product-sizes.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BillsModule } from './bills/bills.module';
import { BillItemsModule } from './bill-items/bill-items.module';
import { BillItemsController } from './bill-items/bill-items.controller';
import { BillsController } from './bills/bills.controller';
import { BillsService } from './bills/bills.service';
import { BillItemsService } from './bill-items/bill-items.service';
import { PricesService } from './prices/prices.service';
import { PriceListsService } from './price-lists/price-lists.service';
import { PriceListsController } from './price-lists/price-lists.controller';
import { PricesController } from './prices/prices.controller';
import { PriceListsModule } from './price-lists/price-lists.module';
import { PricesModule } from './prices/prices.module';
const connectionOptions = (): TypeOrmModuleOptions => config;

@Module({
  imports: [
    PriceListsModule,
    PricesModule,
    BillsModule,
    BillItemsModule,
    TransferItemsModule,
    TransfersModule,
    AuthModule,
    UsersModule,
    ProductSizesModule,
    ProductClassModule,
    WorkersModule,
    WarehouseItemsModule,
    TransportsModule,
    OrdersModule,
    OrderItemsModule,
    ClientsModule,
    BlueprintsModule,
    BlocksModule,
    TypeOrmModule.forRoot(connectionOptions()),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    PriceListsController,
    PricesController,
    BillsController,
    BillItemsController,
    TransferItemsController,
    TransfersController,
    ProductClassController,
    ProductSizesController,
    WorkersController,
    WarehouseItemsController,
    TransportsController,
    OrdersController,
    OrderItemsController,
    ClientsController,
    BlueprintsController,
    BlocksController,
    AppController,
  ],
  providers: [
    PricesService,
    PriceListsService,
    BillsService,
    BillItemsService,
    TransferItemsService,
    TransfersService,
    JwtService,
    AuthService,
    UsersService,
    ProductClassService,
    ProductSizesService,
    WarehouseItemsService,
    WorkersService,
    TransportsService,
    OrderItemsService,
    OrdersService,
    ClientsService,
    BlueprintsService,
    BlocksService,
    AppService,
    TasksService,
  ],
})
export class AppModule { }
