import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { serializeUser } from 'passport';
import { Repository } from 'typeorm';
import { ProductSize } from './product-size.entity';

@Injectable()
export class ProductSizesService {
  constructor(
    @InjectRepository(ProductSize)
    private readonly productSizesRepository: Repository<ProductSize>,
  ) {}

  async create(productSizes: ProductSize): Promise<ProductSize> {
    return await this.productSizesRepository.save(productSizes);
  }

  async findAll(): Promise<ProductSize[]> {
    return await this.productSizesRepository.find({
      relations: ['blueprints', 'blueprints.product_size', 'blueprints.warehouse_items', 'blueprints.order_items', 'blueprints.order_items.order', 'blueprints.order_items.order.transfers', 'blueprints.order_items.order.transfers.transfer_items', 'blueprints.transfer_items', 'blueprints.transfer_items.transfer', 'blueprints.transfer_items.transfer.order'],
    });
  }

  async findOne(id: number): Promise<ProductSize> {
    return await this.productSizesRepository.findOne(id, {
      relations: ['blueprints', 'blueprints.product_size', 'blueprints.warehouse_items', 'blueprints.order_items', 'blueprints.order_items.order', 'blueprints.order_items.order.transfers', 'blueprints.order_items.order.transfers.transfer_items', 'blueprints.transfer_items', 'blueprints.transfer_items.transfer', 'blueprints.transfer_items.transfer.order'],
    });
  }

  async findBySize(productSize: ProductSize): Promise<ProductSize[]> {
    return await this.productSizesRepository.find({
      relations: ['blueprints', 'blueprints.product_class', 'blueprints.warehouse_items', 'blueprints.order_items', 'blueprints.order_items.order', 'blueprints.order_items.order.transfers', 'blueprints.order_items.order.transfers.transfer_items', 'blueprints.transfer_items', 'blueprints.transfer_items.transfer', 'blueprints.transfer_items.transfer.order'],
      where: { 
        x_mm: productSize.x_mm,
        y_mm: productSize.y_mm,
        z_mm: productSize.z_mm,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.productSizesRepository.delete(id);
  }

  async update(id: number, productSize: ProductSize): Promise<ProductSize> {
    await this.productSizesRepository.update(id, productSize);
    return await this.findOne(id);
  }
  
  async removeProductSizes(productSizes: ProductSize[]): Promise<void> {
    for (let length = 0; length < productSizes.length; length++) {
      await this.productSizesRepository.delete(
        productSizes[length].product_size_id,
      );
    }
    return;
  }

}
