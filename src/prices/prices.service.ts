import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { Price } from './price.entity';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private readonly pricesRepository: Repository<Price>,
  ) {}

  async validation(price: Price): Promise<ValidationError[]> {
    const validatePrice = new Price();
    validatePrice.price_list_id = price.price_list_id;
    validatePrice.product_class_id = price.product_class_id;
    validatePrice.amount = price.amount;
    validatePrice.markup = price.markup;
    const result = await validate(validatePrice);
    return result;
  }

  async create(price: Price): Promise<Price> {
    return await this.pricesRepository.save(price);
  }

  async findAll(): Promise<Price[]> {
    return await this.pricesRepository.find({
      relations: [
        'product_class',
        'product_class.blueprints',
        'product_class.blueprints.product_size',
        'price_list', 
        'price_list.bills', 
        'price_list.bills.bill_items',
        'price_list.orders', 
        'price_list.orders.order_item_fulfills'], 
        order: { price_id: "DESC" }
    });
  }

  async findOne(id: number): Promise<Price> {
    return await this.pricesRepository.findOne(id, {
      relations: [
        'product_class',
        'product_class.blueprints',
        'product_class.blueprints.product_size',
        'price_list', 
        'price_list.bills', 
        'price_list.bills.bill_items',
        'price_list.orders', 
        'price_list.orders.order_item_fulfills'], 
        order: { price_id: "DESC" }
    });
  }

  async remove(id: number): Promise<void> {
    await this.pricesRepository.delete(id);
  }

  async removePrices(prices: Price[]): Promise<void> {
    for (let length = 0; length < prices.length; length++) {
      await this.pricesRepository.delete(prices[length].price_id);
    }
    return;
  }

  async createPrices(prices: Price[]): Promise<void> {
    for (let length = 0; length < prices.length; length++) {
      await this.pricesRepository.save(prices[length]);
    }
    return;
  }

  async updatePrice(priceId: number, price: Price): Promise<object> {
    return await this.pricesRepository.update(priceId, price);
  }

  async findAllForPriceList(priceListId: number): Promise<Price[]> {
    return await this.pricesRepository.find({
      relations: [
        'product_class',
        'product_class.blueprints',
        'product_class.blueprints.product_size',
        'price_list', 
        'price_list.bills', 
        'price_list.bills.bill_items',
        'price_list.orders', 
        'price_list.orders.order_item_fulfills'], 
      where: { price_list_id: priceListId }, 
      order: { price_id: "DESC" }
    });
  }

  async findAllforBill(billId: number): Promise<Price[]> {
    return await this.pricesRepository.find({
      relations: [
        'product_class',
        'product_class.blueprints',
        'product_class.blueprints.product_size',
        'price_list', 
        'price_list.bills', 
        'price_list.bills.bill_items',
        'price_list.orders', 
        'price_list.orders.order_item_fulfills'], 
      where: { price_list: { bill: { bill_id: billId } } }, 
      order: { price_id: "DESC" }
    });
  }

  async findAllforOrder(orderId: number): Promise<Price[]> {
    return await this.pricesRepository.find({
      relations: [
        'product_class',
        'product_class.blueprints',
        'product_class.blueprints.product_size',
        'price_list', 
        'price_list.bills', 
        'price_list.bills.bill_items',
        'price_list.orders', 
        'price_list.orders.order_item_fulfills'], 
      where: { price_list: { order: { order_id: orderId } } }, 
      order: { price_id: "DESC" }
    });
  }

  async findAllforClass(productClassId: number): Promise<Price[]> {
    return await this.pricesRepository.find({
      relations: [
        'product_class',
        'product_class.blueprints',
        'product_class.blueprints.product_size',
        'price_list', 
        'price_list.bills', 
        'price_list.bills.bill_items',
        'price_list.orders', 
        'price_list.orders.order_item_fulfills'], 
      where: { product_class_id: productClassId }, 
      order: { price_id: "DESC" }
    });
  }
}
