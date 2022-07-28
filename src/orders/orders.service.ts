import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { OrderItem } from 'src/order-items/order-item.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    return await this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ], 
      order: { order_id: "DESC" }
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.ordersRepository.findOne(id, {
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ],
    });
  }

  async getOrdersInQueue(client_id: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ],
      where: { client_id: client_id, status: 'open' },
      order: { order_id: "DESC" }
    });
  }

  async getOrdersInWIP(client_id: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ],
      where: { client_id: client_id, status: 'wip' },
      order: { order_id: "DESC" }
    });
  }

  async getOrdersForClient(client_id: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ],
      where: { client_id: client_id},
      order: { order_id: "DESC" }
    });
  }

  async getOrdersByPriceList(priceListId: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: [
        'client',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'bills',
        'bills.bill_items',
        'bills.bill_items.blueprint',
        'bills.bill_items.blueprint.product_class',
        'bills.bill_items.blueprint.product_size',
        'bills',
      ],
      where: { price_list_id: priceListId},
      order: { order_id: "DESC" }
    });
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ],
      where: { status: status},
      order: { order_id: "DESC" }
    });
  }

  async getOrdersByTransport(id: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: [
        'client',
        'transport',
        'order_items',
        'order_items.blueprint',
        'order_items.blueprint.product_class',
        'order_items.blueprint.product_size',
        'order_item_fulfills',
        'order_item_fulfills.blueprint',
        'order_item_fulfills.blueprint.product_class',
        'order_item_fulfills.blueprint.product_size',
        'transfers',
        'transfers.transfer_items',
        'transfers.transfer_items.blueprint',
        'transfers.transfer_items.blueprint.product_class',
        'transfers.transfer_items.blueprint.product_size',
        'bills',
      ],
      where: { transport_id: id},
      order: { order_id: "DESC" }
    });
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async removeOrders(orders: Order[]): Promise<void> {
    for (let length = 0; length < orders.length; length++) {
      await this.ordersRepository.delete(orders[length].order_id);
    }
    return;
  }

  async updateOrder(id: number, order: Order): Promise<object> {
    const orderEntry = {
      client_id: order.client_id,
      price_list_id: order.price_list_id,
      status: order.status,
      delivery_date: order.delivery_date,
      transport_id: order.transport_id,
      note: order.note,
      address: order.address,
      city: order.city,
      country: order.country,
      postal_code: order.postal_code,
      laddress: order.laddress,
      lcity: order.lcity,
      lcountry: order.lcountry,
      lpostal_code: order.lpostal_code
    };
    return await this.ordersRepository.update(id, orderEntry);
  }

  checkOrderItemsStatus(warehouseItems: WarehouseItem[], orderItems: OrderItem[]) {
    const stackedWarehouseItemsQty = {};
    const errors = [];

    warehouseItems.forEach(warehouseItem => {
      if (!stackedWarehouseItemsQty[warehouseItem.blueprint_id]) 
      stackedWarehouseItemsQty[warehouseItem.blueprint_id] = 0;
      stackedWarehouseItemsQty[warehouseItem.blueprint_id] += warehouseItem.count;
    });
    orderItems.forEach(orderItem => {
      if (!stackedWarehouseItemsQty[orderItem.blueprint_id]) 
      stackedWarehouseItemsQty[orderItem.blueprint_id] = 0;
      stackedWarehouseItemsQty[orderItem.blueprint_id] -= orderItem.count;
    });
    for (const [blueprint_id, qty] of Object.entries(stackedWarehouseItemsQty)) {
      if (qty < 0) {
        errors.push({
          property: "product_" + blueprint_id,
          constraints: {"quantity": "not enough"}
        });
      }
    }
    return errors;
  }

  mapOrderItemsByBlueprints(order: Order): object {
    const orderItems = order.order_items;
    const orderItemsFulfills = order.order_item_fulfills;
    const orderItemsMap = {};
    const allOrderItems = [];

    orderItems.forEach(orderItem => {
      if (!orderItemsMap[orderItem.blueprint_id]) {
        orderItemsMap[orderItem.blueprint_id] = {
          count: 0,
          blueprint: orderItem.blueprint,
        };
      }
      
      orderItemsMap[orderItem.blueprint_id].count += orderItem.count;
    });

    orderItemsFulfills.forEach(orderItem => {
      if (!orderItemsMap[orderItem.blueprint_id]) {
        orderItemsMap[orderItem.blueprint_id] = {
          count: 0,
          blueprint: orderItem.blueprint,
        };
      }
      
      orderItemsMap[orderItem.blueprint_id].count += orderItem.count;
    });

    for (const [blueprint_id, values] of Object.entries(orderItemsMap)) {
      allOrderItems.push({
        blueprint_id: blueprint_id,
        blueprint: orderItemsMap[blueprint_id].blueprint,
        count: orderItemsMap[blueprint_id].count,
      });
    }
    return allOrderItems;
  }

  async getLastOrderId(): Promise<number> {
    const order = (
      await this.ordersRepository.findOne({ order: { order_id: 'DESC' } })
    );
    if (order) return order.order_id;
    return 0;
  }
}
