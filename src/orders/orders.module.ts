import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Order } from './order.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Client } from 'src/clients/client.entity';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { ClientsService } from 'src/clients/clients.service';
import { OrderItem } from 'src/order-items/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { OrderItemFulfill } from 'src/order-items/order-item-fulfill.entity';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { TransferItemsService } from 'src/transfer-items/transfer-items.service';
import { Bill } from 'src/bills/bill.entity';
import { BillsService } from 'src/bills/bills.service';
import { BillItem } from 'src/bill-items/bill-item.entity';
import { BillItemsService } from 'src/bill-items/bill-items.service';
import { BillPayment } from 'src/bills/bill-payment.entity';
import { PriceList } from 'src/price-lists/price-list.entity';
import { PriceListsService } from 'src/price-lists/price-lists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PriceList,
      Order,
      Blueprint,
      Client,
      OrderItem,
      WarehouseItem,
      OrderItemFulfill,
      TransferItem,
      Bill,
      BillItem,
      BillPayment,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    PriceListsService,
    OrdersService,
    BlueprintsService,
    ClientsService,
    OrderItemsService,
    WarehouseItemsService,
    TransferItemsService,
    BillsService,
    BillItemsService,
  ],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
