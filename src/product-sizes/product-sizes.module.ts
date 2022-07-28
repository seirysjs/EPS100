import { ProductSizesController } from './product-sizes.controller';
import { ProductSizesService } from './product-sizes.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSize } from './product-size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSize])],
  controllers: [ProductSizesController],
  providers: [ProductSizesService],
  exports: [TypeOrmModule],
})
export class ProductSizesModule {}
