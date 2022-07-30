import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { BillItem } from './bill-item.entity';

@Injectable()
export class BillItemsService {
  constructor(
    @InjectRepository(BillItem)
    private readonly billItemsRepository: Repository<BillItem>,
  ) {}

  async validation(billItem: BillItem): Promise<ValidationError[]> {
    const validateBillItem = new BillItem();
    validateBillItem.bill_id = billItem.bill_id;
    validateBillItem.blueprint_id = billItem.blueprint_id;
    validateBillItem.count = billItem.count;
    const result = await validate(validateBillItem);
    return result;
  }

  async create(billItem: BillItem): Promise<BillItem> {
    return await this.billItemsRepository.save(billItem);
  }

  async findAll(): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.order',
        'bill.order.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      order: { bill_item_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<BillItem> {
    return await this.billItemsRepository.findOne(id, {
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
    });
  }

  async remove(id: number): Promise<void> {
    await this.billItemsRepository.delete(id);
  }

  async removeBillItems(billItems: BillItem[]): Promise<void> {
    for (let length = 0; length < billItems.length; length++) {
      await this.billItemsRepository.delete(billItems[length].bill_item_id);
    }
    return;
  }

  async createBillItems(billItems: BillItem[]): Promise<void> {
    for (let length = 0; length < billItems.length; length++) {
      await this.billItemsRepository.save(billItems[length]);
    }
    return;
  }

  async updateBillItem(
    billItemId: number,
    billItem: BillItem,
  ): Promise<object> {
    return await this.billItemsRepository.update(billItemId, billItem);
  }

  async findAllForBill(billId: number): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { bill_id: billId },
      order: { bill_item_id: 'DESC' },
    });
  }

  async findAllinWIPBill(): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { bill: { status: 'wip' } },
      order: { bill_item_id: 'DESC' },
    });
  }

  async findAllByBlueprint(blueprintId: number): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: blueprintId },
      order: { bill_item_id: 'DESC' },
    });
  }

  async findAllWIPBillByBlueprint(blueprintId: number): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint_id: blueprintId, bill: { status: 'wip' } },
      order: { bill_item_id: 'DESC' },
    });
  }

  async findAllByClass(productClassId: number): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: { blueprint: { product_class_id: productClassId } },
      order: { bill_item_id: 'DESC' },
    });
  }

  async findAllWIPBillByClass(productClassId: number): Promise<BillItem[]> {
    return await this.billItemsRepository.find({
      relations: [
        'bill',
        'bill.bill_items',
        'bill.client',
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
      ],
      where: {
        blueprint: { product_class_id: productClassId },
        bill: { status: 'wip' },
      },
      order: { bill_item_id: 'DESC' },
    });
  }
}
