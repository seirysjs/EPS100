import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './worker.entity';
import { BlocksService } from 'src/blocks/blocks.service';
import { Block } from 'src/blocks/block.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { BlockCut } from 'src/blocks/block-cut.entity';
import { BlockMultiCut } from 'src/blocks/block-multi-cut.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Worker,
      Block,
      BlockCut,
      WarehouseItem,
      BlockMultiCut,
    ]),
  ],
  controllers: [WorkersController],
  providers: [WorkersService, BlocksService, WarehouseItemsService],
  exports: [TypeOrmModule],
})
export class WorkersModule {}
