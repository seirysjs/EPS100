import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Transfer } from './transfer.entity';
import { Blueprint } from 'src/blueprints/blueprint.entity';
import { Client } from 'src/clients/client.entity';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { ClientsService } from 'src/clients/clients.service';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { TransferItemsService } from 'src/transfer-items/transfer-items.service';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transfer,
      Blueprint,
      Client,
      TransferItem,
      WarehouseItem,
      Order,
    ]),
  ],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    BlueprintsService,
    ClientsService,
    TransferItemsService,
    OrdersService,
    WarehouseItemsService,
  ],
  exports: [TypeOrmModule],
})
export class TransfersModule {}
