import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blueprint } from './blueprint.entity';

@Injectable()
export class BlueprintsService {
  constructor(
    @InjectRepository(Blueprint)
    private readonly blueprintsRepository: Repository<Blueprint>,
  ) {}

  async create(blueprint: Blueprint): Promise<Blueprint> {
    return await this.blueprintsRepository.save(blueprint);
  }

  async findAll(): Promise<Blueprint[]> {
    return await this.blueprintsRepository.find({
      relations: [
        'product_class',
        'product_size', 
        'warehouse_items',
        'order_items',
        'order_item_fulfills', 
        'block_cuts',
        'transfer_items',
      ], order: { blueprint_id: "DESC" }
    });
  }

  async findOne(id: number): Promise<Blueprint> {
    return await this.blueprintsRepository.findOne(id, {
      relations: [
        'product_class',
        'product_size', 
        'warehouse_items',
        'order_items',
        'order_item_fulfills', 
        'block_cuts',
        'transfer_items',
      ] });
  }

  async findAllByProductClass(id: number): Promise<Blueprint[]> {
    return await this.blueprintsRepository.find({ where: { product_class_id: id }, relations: [
      'product_class',
      'product_size', 
      'warehouse_items',
      'order_items',
      'order_item_fulfills', 
      'block_cuts',
      'transfer_items',
    ] });
  }

  async findAllByProductSize(id: number): Promise<Blueprint[]> {
    return await this.blueprintsRepository.find({ where: { product_size_id: id }, relations: [
      'product_class',
      'product_size', 
      'warehouse_items',
      'order_items',
      'order_item_fulfills', 
      'block_cuts',
      'transfer_items',
    ] });
  }

  async findByProductClassAndSize(classId: number, sizeId: number): Promise<Blueprint[]> {
    return await this.blueprintsRepository.find({ where: { product_class_id: classId, product_size_id: sizeId }, relations: [
      'product_class',
      'product_size', 
      'warehouse_items',
      'order_items',
      'order_item_fulfills', 
      'block_cuts',
      'transfer_items',
    ] });
  }

  async remove(id: number): Promise<void> {
    await this.blueprintsRepository.delete(id);
  }

  async removeBlueprints(blueprints: Blueprint[]): Promise<void> {
    for (let length = 0; length < blueprints.length; length++) {
      await this.blueprintsRepository.delete(blueprints[length].blueprint_id);
    }
    return;
  }

  async updateBlueprint(id: number, blueprint: Blueprint): Promise<object> {
    return await this.blueprintsRepository.update(id, blueprint);
  }
}
