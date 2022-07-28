import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Order])],
  controllers: [ClientsController],
  providers: [ClientsService, OrdersService],
  exports: [TypeOrmModule],
})
export class ClientsModule {}
