import { WarehouseItemsService } from './warehouse-items.service';
import { WarehouseItem } from './warehouse-item.entity';
import { WarehouseItemsController } from './warehouse-items.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { WorkersService } from 'src/workers/workers.service';
import { Worker } from 'src/workers/worker.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { OrderItemFulfill } from 'src/order-items/order-item-fulfill.entity';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { TransferItemsService } from 'src/transfer-items/transfer-items.service';
import { BillItemsService } from 'src/bill-items/bill-items.service';
import { BillItem } from 'src/bill-items/bill-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseItem,
      Blueprint,
      Worker,
      OrderItem,
      OrderItemFulfill,
      TransferItem,
      BillItem,
    ]),
  ],
  controllers: [WarehouseItemsController],
  providers: [
    WarehouseItemsService,
    BlueprintsService,
    WorkersService,
    OrderItemsService,
    TransferItemsService,
    BillItemsService,
  ],
  exports: [TypeOrmModule],
})
export class WarehouseItemsModule {}
