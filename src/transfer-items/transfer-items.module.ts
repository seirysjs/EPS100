import { TransferItemsService } from './transfer-items.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferItem } from './transfer-item.entity';
import { TransferItemsController } from './transfer-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransferItem])],
  controllers: [TransferItemsController],
  providers: [TransferItemsService],
  exports: [TypeOrmModule],
})
export class TransferItemsModule {}
