import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Bill } from './bill.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Client } from 'src/clients/client.entity';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { ClientsService } from 'src/clients/clients.service';
import { BillItem } from 'src/bill-items/bill-item.entity';
import { BillItemsService } from 'src/bill-items/bill-items.service';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { BillPayment } from './bill-payment.entity';
import { PriceListsService } from 'src/price-lists/price-lists.service';
import { PriceList } from 'src/price-lists/price-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      Blueprint,
      Client,
      BillItem,
      WarehouseItem,
      Order,
      BillPayment,
      PriceList,
    ]),
  ],
  controllers: [BillsController],
  providers: [
    BillsService,
    BlueprintsService,
    ClientsService,
    BillItemsService,
    OrdersService,
    WarehouseItemsService,
    PriceListsService,
  ],
  exports: [TypeOrmModule],
})
export class BillsModule {}
