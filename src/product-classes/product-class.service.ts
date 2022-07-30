import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductClass } from './product-class.entity';

@Injectable()
export class ProductClassService {
  constructor(
    @InjectRepository(ProductClass)
    private readonly productClassRepository: Repository<ProductClass>,
  ) {}

  async create(productClass: ProductClass): Promise<ProductClass> {
    return await this.productClassRepository.save(productClass);
  }

  async findAll(): Promise<ProductClass[]> {
    return this.productClassRepository.find({
      relations: [
        'blueprints',
        'blueprints.product_size',
        'blueprints.warehouse_items',
        'blueprints.order_items',
        'blueprints.transfer_items',
        'blocks',
        'blocks.warehouse_items',
        'blocks.block_cut',
      ],
    });
  }

  async findOne(id: number): Promise<ProductClass> {
    return await this.productClassRepository.findOne(id, {
      relations: [
        'blueprints',
        'blueprints.product_size',
        'blueprints.warehouse_items',
        'blueprints.order_items',
        'blueprints.transfer_items',
        'blocks',
        'blocks.warehouse_items',
        'blocks.block_cut',
      ],
    });
  }

  async findByName(name: string): Promise<ProductClass[]> {
    return await this.productClassRepository.find({
      relations: [
        'blueprints',
        'blueprints.product_size',
        'blueprints.warehouse_items',
        'blueprints.order_items',
        'blueprints.transfer_items',
        'blocks',
        'blocks.warehouse_items',
        'blocks.block_cut',
      ],
      where: { name: name },
    });
  }

  async remove(id: number): Promise<void> {
    await this.productClassRepository.delete(id);
  }

  async removeProductClasses(productClass: ProductClass[]): Promise<void> {
    for (let length = 0; length < productClass.length; length++) {
      await this.productClassRepository.delete(
        productClass[length].product_class_id,
      );
    }
    return;
  }

  async buildProductClassSelectOptions(selectedId: number): Promise<string[]> {
    const productClasses = await this.productClassRepository.find();
    const content = [];
    for (
      let productClass = 0;
      productClass < productClasses.length;
      productClass++
    ) {
      const productClassObj = productClasses[productClass];
      const htmlObj = { ...productClassObj, selected: null };
      if (productClassObj.product_class_id == selectedId)
        htmlObj.selected = `selected`;
      content.push(htmlObj);
    }
    return content;
  }

  async update(id: number, productClass: ProductClass): Promise<ProductClass> {
    await this.productClassRepository.update(id, productClass);
    return await this.findOne(id);
  }
}
