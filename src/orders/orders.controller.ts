import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { OrderItemFulfill } from 'src/order-items/order-item-fulfill.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { PriceListsService } from 'src/price-lists/price-lists.service';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly blueprintsService: BlueprintsService,
    private readonly priceListsService: PriceListsService,
    private readonly orderItemsService: OrderItemsService,
    private readonly warehouseItemsService: WarehouseItemsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newOrderFormPost(@Body() formData: any): Promise<object> {
    const content = {
      errors: [],
    };
    const clientId = formData['client_id'];
    const priceListId = formData.price_list_id;
    const status = formData['status'];
    const order_id = formData.order_id;
    const delivery_date = formData.delivery_date;
    const note = formData.note;
    const city = formData.city;
    const address = formData.address;
    const country = formData.country;
    const postal_code = formData.postal_code;
    const lcity = formData.lcity;
    const laddress = formData.laddress;
    const lcountry = formData.lcountry;
    const lpostal_code = formData.lpostal_code;
    const transportId = formData['transport_id'] ? formData.transport_id : null;
    if (!clientId || clientId == 0) {
      content.errors = [
        { property: 'client_id', constraints: ['client_id must be selected!'] },
      ];
      return content;
    }
    if (await this.ordersService.findOne(order_id)) {
      content.errors = [
        {
          property: 'order_id',
          constraints: {
            duplicate: `order_id DUPLICATE! Order ${order_id} already exists`,
          },
        },
      ];
      return content;
    }
    const orderId = (
      await this.ordersService.create(
        ((
          order_id,
          priceListId,
          clientId,
          status,
          delivery_date,
          note,
          transportId,
          address,
          city,
          country,
          postal_code,
          laddress,
          lcity,
          lcountry,
          lpostal_code,
        ) => {
          const order = new Order();
          order.order_id = order_id;
          order.price_list_id = priceListId;
          order.transport_id = transportId;
          order.client_id = clientId;
          order.delivery_date = delivery_date;
          order.note = note;
          order.status = status;
          order.address = address;
          order.city = city;
          order.country = country;
          order.postal_code = postal_code;
          order.laddress = laddress;
          order.lcity = lcity;
          order.lcountry = lcountry;
          order.lpostal_code = lpostal_code;
          return order;
        })(
          order_id,
          priceListId,
          clientId,
          status,
          delivery_date,
          note,
          transportId,
          address,
          city,
          country,
          postal_code,
          laddress,
          lcity,
          lcountry,
          lpostal_code,
        ),
      )
    ).order_id;
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const orderItem = new OrderItem();
      orderItem.order_id = orderId;
      orderItem.blueprint_id = blueprintId;
      orderItem.count = partsCount;
      await this.orderItemsService.create(orderItem);
    }
    return content;
  }

  @Render('orders/billing')
  @Get(':id/billing')
  async showBillingInvoice(@Param('id') orderId: number): Promise<object> {
    const order = await this.ordersService.findOne(orderId);

    const allItems = this.ordersService.mapOrderItemsByBlueprints(order);

    const billDate = new Date();
    const daysPostponedRaw = order.delivery_date
      ? Math.round(
          (new Date(
            order.delivery_date.toLocaleString('lt-LT', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }),
          ).getTime() -
            new Date(
              billDate.toLocaleString('lt-LT', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }),
            ).getTime()) /
            1000 /
            60 /
            60 /
            24,
        )
      : 0;
    const daysPostponed = daysPostponedRaw
      ? daysPostponedRaw -
        (daysPostponedRaw % 1) +
        (daysPostponedRaw % 1 > 0 ? 1 : 0)
      : 0;

    const billing = {
      bill_items: allItems,
      bill_date: billDate,
      days_postponed: daysPostponed,
      bill_id: order.order_id,
      note: order.note,
    };

    const priceList = await this.priceListsService.findOne(order.price_list_id);

    const content = {
      order: order,
      billing: billing,
      priceList: priceList,
    };
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/fulfill')
  async fulfillOrder(
    @Param('id') orderId: number,
    @Body() formData: any,
  ): Promise<object> {
    const content = {
      errors: [],
    };

    if (!formData.productRows || formData.productRows.length == 0) return;

    const orderItems = [];
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const orderItem = new OrderItem();
      orderItem.order_id = orderId;
      orderItem.blueprint_id = blueprintId;
      orderItem.order_item_id = formData.productRows[productRow].order_item_id;
      orderItem.count = partsCount;
      orderItems.push(orderItem);
    }

    if (formData.completeOrder) {
      const warehouseItems = await this.warehouseItemsService.findAll();
      const orderItemsStatus = this.ordersService.checkOrderItemsStatus(
        warehouseItems,
        orderItems,
      ); // todo
      if (orderItemsStatus.length != 0) {
        const blueprints = {};
        (await this.blueprintsService.findAll()).forEach((blueprint) => {
          if (!blueprints[blueprint.product_class_id])
            blueprints[blueprint.product_class_id] = {
              name: blueprint.product_class.name,
              blueprints: [],
            };
          blueprints[blueprint.product_class_id].blueprints.push(blueprint);
        });
        content.errors = orderItemsStatus;
        return content;
      }
      if (orderItemsStatus.length == 0) {
        const calculateEndStock = {};
        const orderItemsMapFulfillCounts = {};
        orderItems.forEach((orderItem) => {
          if (!calculateEndStock[orderItem.blueprint_id])
            calculateEndStock[orderItem.blueprint_id] = 0;
          calculateEndStock[orderItem.blueprint_id] -= orderItem.count;

          if (!orderItemsMapFulfillCounts[orderItem.order_item_id])
            orderItemsMapFulfillCounts[orderItem.order_item_id] = 0;
          orderItemsMapFulfillCounts[orderItem.order_item_id] -=
            orderItem.count;
        });
        for (const [blueprintId, stockCount] of Object.entries(
          calculateEndStock,
        )) {
          await this.warehouseItemsService.substractBluerprintItem(
            parseInt(blueprintId),
            stockCount,
          );
        }
        await this.orderItemsService.substractOrderItems(
          orderItemsMapFulfillCounts,
        );

        const order = await this.ordersService.findOne(orderId);
        if (order.order_items.length == 0) order.status = 'done';
        await this.ordersService.updateOrder(orderId, order);
      }
    }

    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async editOrderFormPost(
    @Param('id') orderId: number,
    @Body() formData: any,
  ): Promise<object> {
    const content = {
      errors: [],
    };
    const clientId = formData['client_id'];
    const priceListId = formData.price_list_id;
    const status = formData['status'];
    const note = formData.note;
    const delivery_date = formData.delivery_date;
    const city = formData.city;
    const address = formData.address;
    const country = formData.country;
    const postal_code = formData.postal_code;
    const lcity = formData.lcity;
    const laddress = formData.laddress;
    const lcountry = formData.lcountry;
    const lpostal_code = formData.lpostal_code;
    const transportId = formData.transport_id ? formData.transport_id : null;

    if (!clientId && status) {
      content.errors = ['client_id must be selected!'];
      return content;
    }
    const order = await this.ordersService.findOne(orderId);
    const orderItems = [];
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const orderItem = new OrderItem();
      orderItem.order_id = order.order_id;
      orderItem.blueprint_id = blueprintId;
      orderItem.count = partsCount;
      orderItems.push(orderItem);
    }
    order.status = status;
    order.client_id = clientId;
    order.price_list_id = priceListId;
    order.transport_id = transportId;
    order.delivery_date = delivery_date;
    order.note = note;
    order.address = address;
    order.city = city;
    order.country = country;
    order.postal_code = postal_code;
    order.laddress = laddress;
    order.lcity = lcity;
    order.lcountry = lcountry;
    order.lpostal_code = lpostal_code;

    await this.orderItemsService.removeOrderItems(order.order_items);
    await this.orderItemsService.createOrderItems(orderItems);
    await this.ordersService.updateOrder(orderId, order);

    if (formData.completeOrder) {
      const warehouseItems = await this.warehouseItemsService.findAll();
      const orderItemsStatus = this.ordersService.checkOrderItemsStatus(
        warehouseItems,
        orderItems,
      ); // todo
      if (orderItemsStatus.length != 0) {
        const blueprints = {};
        (await this.blueprintsService.findAll()).forEach((blueprint) => {
          if (!blueprints[blueprint.product_class_id])
            blueprints[blueprint.product_class_id] = {
              name: blueprint.product_class.name,
              blueprints: [],
            };
          blueprints[blueprint.product_class_id].blueprints.push(blueprint);
        });
        content.errors = orderItemsStatus;
        return content;
      }
      if (orderItemsStatus.length == 0) {
        const calculateEndStock = {};
        orderItems.forEach((orderItem) => {
          if (!calculateEndStock[orderItem.blueprint_id])
            calculateEndStock[orderItem.blueprint_id] = 0;
          calculateEndStock[orderItem.blueprint_id] -= orderItem.count;
        });
        for (const [blueprintId, stockCount] of Object.entries(
          calculateEndStock,
        )) {
          await this.warehouseItemsService.substractBluerprintItem(
            parseInt(blueprintId),
            stockCount,
          );

          const orderItemFulfill = new OrderItemFulfill();
          orderItemFulfill.order_id = orderId;
          orderItemFulfill.blueprint_id = parseInt(blueprintId);
          orderItemFulfill.count = parseInt(stockCount.toString()) * -1;

          await this.orderItemsService.fulfillOrderItem(orderItemFulfill);
        }

        const updatedOrder = await this.ordersService.findOne(orderId);
        await this.orderItemsService.removeOrderItems(updatedOrder.order_items);

        order.status = 'done';
        await this.ordersService.updateOrder(orderId, order);
      }
    }

    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() Order: Order): Promise<Order> {
    return await this.ordersService.create(Order);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewOrder(): Promise<number> {
    return (await this.ordersService.getLastOrderId()) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Order[]> {
    const orders = await this.ordersService.findAll();
    return orders;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/order-item-map')
  async orderItemsMap(@Param('id') id: number): Promise<object> {
    return this.ordersService.mapOrderItemsByBlueprints(
      await this.ordersService.findOne(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    return await this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.ordersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-status/:status')
  async getOrdersByStatus(@Param('status') status: string): Promise<Order[]> {
    return await this.ordersService.getOrdersByStatus(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id')
  async getOrdersByClient(@Param('id') id: number): Promise<Order[]> {
    return await this.ordersService.getOrdersForClient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-price-list/:id')
  async getOrdersByPriceList(@Param('id') id: number): Promise<Order[]> {
    return await this.ordersService.getOrdersByPriceList(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id/open')
  async getOrdersInQueue(@Param('id') id: number): Promise<Order[]> {
    return await this.ordersService.getOrdersInQueue(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id/wip')
  async getOrdersInWIP(@Param('id') id: number): Promise<Order[]> {
    return await this.ordersService.getOrdersInWIP(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-transport/:id')
  async getOrdersByTransport(@Param('id') id: number): Promise<Order[]> {
    return await this.ordersService.getOrdersByTransport(id);
  }
}
