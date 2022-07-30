import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { PriceList } from './price-list.entity';

@Injectable()
export class PriceListsService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListsRepository: Repository<PriceList>,
  ) {}

  async validation(priceList: PriceList): Promise<ValidationError[]> {
    const validatePriceList = new PriceList();
    validatePriceList.name = priceList.name;
    validatePriceList.enabled = priceList.enabled;
    validatePriceList.note = priceList.note;
    validatePriceList.price_list_date = new Date(priceList.price_list_date);
    const result = await validate(validatePriceList);
    console.log(result);
    return result;
  }

  async create(priceList: PriceList): Promise<PriceList> {
    return await this.priceListsRepository.save(priceList);
  }

  async findAll(): Promise<PriceList[]> {
    return this.priceListsRepository.find({
      relations: [
        'prices',
        'prices.product_class',
        'orders',
        'orders.order_item_fulfills',
        'orders.client',
        'bills',
        'bills.bill_items',
        'bills.bill_payments',
      ],
      order: { price_list_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PriceList> {
    return await this.priceListsRepository.findOne(id, {
      relations: [
        'prices',
        'prices.product_class',
        'orders',
        'orders.order_item_fulfills',
        'orders.client',
        'bills',
        'bills.bill_items',
        'bills.bill_payments',
      ],
    });
  }

  async getPriceListForBill(billId: number): Promise<PriceList[]> {
    return await this.priceListsRepository.find({
      relations: [
        'prices',
        'prices.product_class',
        'orders',
        'orders.order_item_fulfills',
        'orders.client',
        'bills',
        'bills.bill_items',
        'bills.bill_payments',
      ],
      order: { price_list_id: 'DESC' },
      where: { bill: { bill_id: billId } },
    });
  }

  async getPriceListForOrder(orderId: number): Promise<PriceList[]> {
    return await this.priceListsRepository.find({
      relations: [
        'prices',
        'prices.product_class',
        'orders',
        'orders.order_item_fulfills',
        'orders.client',
        'bills',
        'bills.bill_items',
        'bills.bill_payments',
      ],
      order: { price_list_id: 'DESC' },
      where: { order: { order_id: orderId } },
    });
  }

  async getPriceListsWithPrice(priceId: number): Promise<PriceList[]> {
    return await this.priceListsRepository.find({
      relations: [
        'prices',
        'prices.product_class',
        'orders',
        'orders.order_item_fulfills',
        'orders.client',
        'bills',
        'bills.bill_items',
        'bills.bill_payments',
      ],
      order: { price_list_id: 'DESC' },
      where: { price: { price_id: priceId } },
    });
  }

  async getPriceListsEnabled(): Promise<PriceList[]> {
    return await this.priceListsRepository.find({
      relations: [
        'prices',
        'prices.product_class',
        'orders',
        'orders.order_item_fulfills',
        'orders.client',
        'bills',
        'bills.bill_items',
        'bills.bill_payments',
      ],
      order: { price_list_id: 'DESC' },
      where: { enabled: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.priceListsRepository.delete(id);
  }

  async removePriceLists(priceLists: PriceList[]): Promise<void> {
    for (let length = 0; length < priceLists.length; length++) {
      await this.priceListsRepository.delete(priceLists[length].price_list_id);
    }
    return;
  }

  async updatePriceList(id: number, priceList: PriceList): Promise<object> {
    const priceListEntry = {
      name: priceList.name,
      enabled: priceList.enabled,
      price_list_date: priceList.price_list_date,
      note: priceList.note,
    };
    return await this.priceListsRepository.update(id, priceListEntry);
  }

  async getLastPriceListId(): Promise<number> {
    const priceList = await this.priceListsRepository.findOne({
      order: { price_list_id: 'DESC' },
    });
    if (priceList) return priceList.price_list_id;
    return 0;
  }
}
