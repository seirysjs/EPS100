import { PriceListsService } from './price-lists.service';
import { PriceListsController } from './price-lists.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { PriceList } from './price-list.entity';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { BillsService } from 'src/bills/bills.service';
import { Bill } from 'src/bills/bill.entity';
import { Price } from 'src/prices/price.entity';
import { PricesService } from 'src/prices/prices.service';
import { BillPayment } from 'src/bills/bill-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PriceList, Price, Bill, Order, BillPayment]),
  ],
  controllers: [PriceListsController],
  providers: [PriceListsService, PricesService, OrdersService, BillsService],
  exports: [TypeOrmModule],
})
export class PriceListsModule {}
