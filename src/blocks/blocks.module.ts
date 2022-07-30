import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillItem } from 'src/bill-items/bill-item.entity';
import { BillItemsService } from 'src/bill-items/bill-items.service';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { OrderItemFulfill } from 'src/order-items/order-item-fulfill.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { ProductClass } from 'src/product-classes/product-class.entity';
import { ProductClassService } from 'src/product-classes/product-class.service';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { TransferItemsService } from 'src/transfer-items/transfer-items.service';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { Worker } from 'src/workers/worker.entity';
import { WorkersService } from 'src/workers/workers.service';
import { BlockCut } from './block-cut.entity';
import { BlockMultiCut } from './block-multi-cut.entity';
import { Block } from './block.entity';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Block,
      BlockCut,
      BlockMultiCut,
      ProductClass,
      Worker,
      Blueprint,
      WarehouseItem,
      OrderItem,
      OrderItemFulfill,
      TransferItem,
      BillItem,
    ]),
  ],
  controllers: [BlocksController],
  providers: [
    BlocksService,
    ProductClassService,
    WorkersService,
    BlueprintsService,
    WarehouseItemsService,
    OrderItemsService,
    TransferItemsService,
    BillItemsService,
  ],
  exports: [TypeOrmModule],
})
export class BlocksModule {}
