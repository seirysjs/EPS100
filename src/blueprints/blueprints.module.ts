import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductClass } from 'src/product-classes/product-class.entity';
import { ProductClassService } from 'src/product-classes/product-class.service';
import { ProductSize } from 'src/product-sizes/product-size.entity';
import { ProductSizesService } from 'src/product-sizes/product-sizes.service';
import { Blueprint } from './blueprint.entity';
import { BlueprintsController } from './blueprints.controller';
import { BlueprintsService } from './blueprints.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blueprint, ProductClass, ProductSize])],
  controllers: [BlueprintsController],
  providers: [BlueprintsService, ProductClassService, ProductSizesService],
  exports: [TypeOrmModule],
})
export class BlueprintsModule {}
