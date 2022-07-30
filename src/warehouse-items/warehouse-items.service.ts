import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseItem } from './warehouse-item.entity';

@Injectable()
export class WarehouseItemsService {
  constructor(
    @InjectRepository(WarehouseItem)
    private readonly warehouseItemsRepository: Repository<WarehouseItem>,
  ) {}

  async create(warehouseItem: WarehouseItem): Promise<WarehouseItem> {
    return await this.warehouseItemsRepository.save(warehouseItem);
  }

  async findAll(): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async findAllByWorker(id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { worker_id: id },
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async findAllByBlock(id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { block_id: id },
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async findAllByBlueprint(id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: id },
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async findAllByClass(id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint: { product_class_id: id } },
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<WarehouseItem> {
    return await this.warehouseItemsRepository.findOne(id, {
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
    });
  }

  async remove(id: number): Promise<void> {
    await this.warehouseItemsRepository.delete(id);
  }

  async removeWarehouseItems(warehouseItems: WarehouseItem[]): Promise<void> {
    for (let length = 0; length < warehouseItems.length; length++) {
      await this.warehouseItemsRepository.delete(
        warehouseItems[length].warehouse_item_id,
      );
    }
    return;
  }

  async forWorker(id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { worker_id: id },
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async forBlueprint(id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: id },
      order: { warehouse_item_id: 'DESC' },
    });
  }

  async updateWarehouseItemEntry(
    id: number,
    warehouseItem: WarehouseItem,
  ): Promise<WarehouseItem> {
    const warehouseItemEntry = {
      blueprint_id: warehouseItem.blueprint_id,
      block_id: warehouseItem.block_id,
      worker_id: warehouseItem.worker_id,
      created_at: warehouseItem.created_at,
      count: warehouseItem.count,
    };
    await this.warehouseItemsRepository.update(id, warehouseItemEntry);
    return await this.findOne(id);
  }

  async substractBluerprintItem(
    blueprintId: number,
    substractAmount: any,
  ): Promise<WarehouseItem[]> {
    if (substractAmount < 0) substractAmount = substractAmount * -1;
    const warehouseItems = await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: blueprintId },
    });
    for (
      let blueprintItemEntry = 0;
      blueprintItemEntry < warehouseItems.length;
      blueprintItemEntry++
    ) {
      if (substractAmount == 0) continue;
      const itemEntry = warehouseItems[blueprintItemEntry];
      if (itemEntry.count <= substractAmount) {
        substractAmount -= itemEntry.count;
        await this.remove(itemEntry.warehouse_item_id);
        continue;
      }
      itemEntry.count -= substractAmount;
      substractAmount = 0;
      await this.updateWarehouseItemEntry(
        itemEntry.warehouse_item_id,
        itemEntry,
      );
    }
    return await this.warehouseItemsRepository.find({
      relations: [
        'worker',
        'block',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: blueprintId },
      order: { warehouse_item_id: 'DESC' },
    });
  }
}
