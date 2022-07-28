import { ProductClassService } from './product-class.service';
import { ProductClassController } from './product-class.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductClass } from './product-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductClass])],
  controllers: [ProductClassController],
  providers: [ProductClassService],
  exports: [TypeOrmModule],
})
export class ProductClassModule {}
