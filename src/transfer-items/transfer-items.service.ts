import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { TransferItem } from './transfer-item.entity';

@Injectable()
export class TransferItemsService {
  constructor(
    @InjectRepository(TransferItem)
    private readonly transferItemsRepository: Repository<TransferItem>,
  ) {}

  async validation(transferItem: TransferItem): Promise<ValidationError[]> {
    const validateTransferItem = new TransferItem();
    validateTransferItem.transfer_id = transferItem.transfer_id;
    validateTransferItem.blueprint_id = transferItem.blueprint_id;
    validateTransferItem.count = transferItem.count;
    const result = await validate(validateTransferItem);
    return result;
  }

  async create(transferItem: TransferItem): Promise<TransferItem> {
    return await this.transferItemsRepository.save(transferItem);
  }

  async findAll(): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.order',
        'transfer.order.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      order: { transfer_item_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TransferItem> {
    return await this.transferItemsRepository.findOne(id, {
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
    });
  }

  async remove(id: number): Promise<void> {
    await this.transferItemsRepository.delete(id);
  }

  async removeTransferItems(transferItems: TransferItem[]): Promise<void> {
    for (let length = 0; length < transferItems.length; length++) {
      await this.transferItemsRepository.delete(
        transferItems[length].transfer_item_id,
      );
    }
    return;
  }

  async createTransferItems(transferItems: TransferItem[]): Promise<void> {
    for (let length = 0; length < transferItems.length; length++) {
      await this.transferItemsRepository.save(transferItems[length]);
    }
    return;
  }

  async updateTransferItem(
    transferItemId: number,
    transferItem: TransferItem,
  ): Promise<object> {
    return await this.transferItemsRepository.update(
      transferItemId,
      transferItem,
    );
  }

  async findAllForTransfer(transferId: number): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { transfer_id: transferId },
      order: { transfer_item_id: 'DESC' },
    });
  }

  async findAllinWIPTransfer(): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { transfer: { status: 'wip' } },
      order: { transfer_item_id: 'DESC' },
    });
  }

  async findAllByBlueprint(blueprintId: number): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: blueprintId },
      order: { transfer_item_id: 'DESC' },
    });
  }

  async findAllWIPTransferByBlueprint(
    blueprintId: number,
  ): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: blueprintId, transfer: { status: 'wip' } },
      order: { transfer_item_id: 'DESC' },
    });
  }

  async findAllByClass(productClassId: number): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint: { product_class_id: productClassId } },
      order: { transfer_item_id: 'DESC' },
    });
  }

  async findAllWIPTransferByClass(
    productClassId: number,
  ): Promise<TransferItem[]> {
    return await this.transferItemsRepository.find({
      relations: [
        'transfer',
        'transfer.transfer_items',
        'transfer.client',
        'transfer.transport',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: {
        blueprint: { product_class_id: productClassId },
        transfer: { status: 'wip' },
      },
      order: { transfer_item_id: 'DESC' },
    });
  }
}
