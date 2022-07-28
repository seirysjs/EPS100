import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { BillItem } from 'src/bill-items/bill-item.entity';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { Repository } from 'typeorm';
import { OrderItemFulfill } from './order-item-fulfill.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemFulfill)
    private readonly orderItemFulfillsRepository: Repository<OrderItemFulfill>,
    @InjectRepository(TransferItem)
    private readonly transferItemsRepository: Repository<TransferItem>,
    @InjectRepository(BillItem)
    private readonly billItemsRepository: Repository<BillItem>,
  ) {}

  async validation(orderItem: OrderItem): Promise<ValidationError[]> {
    const validateOrderItem = new OrderItem();
    validateOrderItem.order_id = orderItem.order_id;
    validateOrderItem.blueprint_id = orderItem.blueprint_id;
    validateOrderItem.count = orderItem.count;
    const result = await validate(validateOrderItem);
    return result;
  }

  async create(orderItem: OrderItem): Promise<OrderItem> {
    return await this.orderItemsRepository.save(orderItem);
  }
  
  async fulfillOrderItem(orderItemFulfill: OrderItemFulfill): Promise<OrderItemFulfill> {
    orderItemFulfill.fulfilled_date = new Date();
    return await this.orderItemFulfillsRepository.save(orderItemFulfill);
  }

  async substractOrderItems(orderItemsFulfillCounts): Promise<object> {
    for (const [orderItemId, fulfillAmount] of Object.entries(orderItemsFulfillCounts)) {
      if (fulfillAmount == 0) continue;
      const order_item_id = parseInt(orderItemId);
      const orderItem = await this.findOne(order_item_id);
      orderItem.count += parseInt(fulfillAmount.toString());
      
      const orderItemFulfill = new OrderItemFulfill();
      orderItemFulfill.order_id = orderItem.order_id;
      orderItemFulfill.blueprint_id = orderItem.blueprint_id;
      orderItemFulfill.count = parseInt(fulfillAmount.toString()) * (-1);
      await this.fulfillOrderItem(orderItemFulfill);

      if (orderItem.count > 0)
      await this.updateOrderItem(orderItem.order_item_id, orderItem);
      
      if (orderItem.count == 0)
      await this.remove(orderItem.order_item_id);
    }
    return orderItemsFulfillCounts;
  }

  async findAll(): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], order: { order_item_id: "DESC" }
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    return await this.orderItemsRepository.findOne(id, {
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.orderItemsRepository.delete(id);
  }

  async removeOrderItems(orderItems: OrderItem[]): Promise<void> {
    for (let length = 0; length < orderItems.length; length++) {
      await this.orderItemsRepository.delete(orderItems[length].order_item_id);
    }
    return;
  }

  async createOrderItems(orderItems: OrderItem[]): Promise<void> {
    for (let length = 0; length < orderItems.length; length++) {
      await this.orderItemsRepository.save(orderItems[length]);
    }
    return;
  }

  async updateOrderItem(orderItemId: number, orderItem: OrderItem): Promise<object> {
    return await this.orderItemsRepository.update(orderItemId, orderItem);
  }

  async findAllForOrder(orderId: number): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { order_id: orderId }, order: { order_item_id: "DESC" }
    });
  }

  async findAllFulfilledByOrder(orderId: number): Promise<object> {
    const orderItemFulfills = await this.orderItemFulfillsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { order_id: orderId }, order: { order_item_fulfill_id: "DESC" }
    });
    const transferItems = await this.transferItemsRepository.find({
      relations: ['transfer', 'transfer.order', 'transfer.order.order_items', 'transfer.order.client', 'transfer.order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { transfer: { order_id: orderId } }, order: { transfer_item_id: "DESC" }
    }); 

    const sortedByBlueprint = {};

    for (let orderItemFulfillIndex = 0; orderItemFulfillIndex < orderItemFulfills.length; orderItemFulfillIndex++) {
      const orderItemFulfill = orderItemFulfills[orderItemFulfillIndex];
      if (!sortedByBlueprint[orderItemFulfill.blueprint_id]) sortedByBlueprint[orderItemFulfill.blueprint_id] = { count: 0, orderItemFulfills: [] };
      sortedByBlueprint[orderItemFulfill.blueprint_id].count += orderItemFulfill.count;
      sortedByBlueprint[orderItemFulfill.blueprint_id].orderItemFulfills.push(orderItemFulfill);
    }

    for (let transferItemIndex = 0; transferItemIndex < transferItems.length; transferItemIndex++) {
      const transferItem = transferItems[transferItemIndex];
      if (!sortedByBlueprint[transferItem.blueprint_id]) continue;

      sortedByBlueprint[transferItem.blueprint_id].count -= transferItem.count;

      if (sortedByBlueprint[transferItem.blueprint_id].count <= 0)
      sortedByBlueprint[transferItem.blueprint_id] = undefined;
    }
    
    return sortedByBlueprint;
  }

  async findAllForBillByOrder(orderId: number): Promise<object> {
    const orderItemFulfills = await this.orderItemFulfillsRepository.find({
      relations: ['order', 'order.bills', 'order.bills.bill_items', 'order.order_items', 'order.order_item_fulfills', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { order_id: orderId }, order: { order_item_fulfill_id: "DESC" }
    });
    const billItems = await this.billItemsRepository.find({
      relations: ['bill', 'bill.order', 'bill.order.order_items', 'bill.order.order_item_fulfills', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { bill: { order_id: orderId } }, order: { bill_item_id: "DESC" }
    }); 

    const sortedByBlueprint = {};

    for (let orderItemFulfillIndex = 0; orderItemFulfillIndex < orderItemFulfills.length; orderItemFulfillIndex++) {
      const orderItemFulfill = orderItemFulfills[orderItemFulfillIndex];
      if (!sortedByBlueprint[orderItemFulfill.blueprint_id]) sortedByBlueprint[orderItemFulfill.blueprint_id] = { count: 0, orderItemFulfills: [] };
      sortedByBlueprint[orderItemFulfill.blueprint_id].count += orderItemFulfill.count;
      sortedByBlueprint[orderItemFulfill.blueprint_id].orderItemFulfills.push(orderItemFulfill);
    }

    for (let billItemIndex = 0; billItemIndex < billItems.length; billItemIndex++) {
      const billItem = billItems[billItemIndex];
      if (!sortedByBlueprint[billItem.blueprint_id]) continue;

      sortedByBlueprint[billItem.blueprint_id].count -= billItem.count;

      if (sortedByBlueprint[billItem.blueprint_id].count <= 0)
      sortedByBlueprint[billItem.blueprint_id] = undefined;
    }
    
    return sortedByBlueprint;
  }

  async findAllFulfilledByOrderItem(orderItemId: number): Promise<OrderItemFulfill[]> {
    const orderItem = await this.orderItemsRepository.findOne(orderItemId);
    return await this.orderItemFulfillsRepository.find({
      relations: [
        'order', 
        'order.order_items', 
        'order.client', 
        'order.transport', 
        'blueprint', 
        'blueprint.product_class', 
        'blueprint.product_size'
      ], where: { order_id: orderItem.order_id, blueprint_id: orderItem.blueprint_id }, order: { order_item_fulfill_id: "DESC" }
    });
  }

  async findAllOrderItemsWithFulfillsByBlueprint(blueprintId: number): Promise<object> {
    const orderItems = await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { blueprint_id: blueprintId }, order: { order_item_id: "DESC" }
    });
    const orderItemFulfills = await this.orderItemFulfillsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { blueprint_id: blueprintId }, order: { order_item_fulfill_id: "DESC" }
    });
    const sortByOrderIds = {};
    orderItems.forEach(orderItem => {
      if (!sortByOrderIds[orderItem.order_id]) sortByOrderIds[orderItem.order_id] = {};
      if (!sortByOrderIds[orderItem.order_id][orderItem.blueprint_id]) sortByOrderIds[orderItem.order_id][orderItem.blueprint_id] = 0;
      sortByOrderIds[orderItem.order_id][orderItem.blueprint_id] += orderItem.count;
    });
    orderItemFulfills.forEach(orderItem => {
      if (!sortByOrderIds[orderItem.order_id]) sortByOrderIds[orderItem.order_id] = {};
      if (!sortByOrderIds[orderItem.order_id][orderItem.blueprint_id]) sortByOrderIds[orderItem.order_id][orderItem.blueprint_id] = 0;
      sortByOrderIds[orderItem.order_id][orderItem.blueprint_id] += orderItem.count;
    });
    return sortByOrderIds;
  }

  async findAllinWIP(): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: [
        'order', 
        'order.order_items', 
        'order.client', 
        'order.transport', 
        'blueprint', 
        'blueprint.product_class', 
        'blueprint.product_size'
      ], where: { "order": { status: "wip" } }, order: { order_item_id: "DESC" }
    });
  }

  async findAllByBlueprint(blueprintId: number): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { blueprint_id: blueprintId }, order: { order_item_id: "DESC" }
    });
  }

  async findAllWIPByBlueprint(blueprintId: number): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { blueprint_id: blueprintId, order: { status: "wip" } }, order: { order_item_id: "DESC" }
    });
  }

  async findAllByClass(productClassId: number): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { 'blueprint': { product_class_id: productClassId } }, order: { order_item_id: "DESC" }
    });
  }

  async findAllWIPByClass(productClassId: number): Promise<OrderItem[]> {
    return await this.orderItemsRepository.find({
      relations: ['order', 'order.order_items', 'order.client', 'order.transport', 'blueprint', 'blueprint.product_class', 'blueprint.product_size'], where: { 'blueprint': { product_class_id: productClassId }, 'order': { status: 'wip' } }, order: { order_item_id: "DESC" }
    });
  }
}
