import { OrderItemsService } from './order-items.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { OrderItemsController } from './order-items.controller';
import { OrderItemFulfill } from './order-item-fulfill.entity';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { TransferItemsService } from 'src/transfer-items/transfer-items.service';
import { BillItem } from 'src/bill-items/bill-item.entity';
import { BillItemsService } from 'src/bill-items/bill-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderItem,
      OrderItemFulfill,
      TransferItem,
      BillItem,
    ]),
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, TransferItemsService, BillItemsService],
  exports: [TypeOrmModule],
})
export class OrderItemsModule {}
