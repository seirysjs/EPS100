import { BillItemsService } from './bill-items.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillItem } from './bill-item.entity';
import { BillItemsController } from './bill-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BillItem])],
  controllers: [BillItemsController],
  providers: [BillItemsService],
  exports: [TypeOrmModule],
})
export class BillItemsModule {}
