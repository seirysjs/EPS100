import { PricesService } from './prices.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './price.entity';
import { PricesController } from './prices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Price])],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [TypeOrmModule],
})
export class PricesModule {}
