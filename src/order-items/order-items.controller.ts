import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderItemFulfill } from './order-item-fulfill.entity';
import { OrderItem } from './order-item.entity';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() orderItem: OrderItem): Promise<OrderItem> {
    return await this.orderItemsService.create(orderItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<OrderItem[]> {
    return await this.orderItemsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<OrderItem> {
    return await this.orderItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-blueprint/:id')
  async findAllByBlueprint(@Param('id') id: number): Promise<OrderItem[]> {
    return await this.orderItemsService.findAllByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id/fulfilled')
  async findAllFulfilledByOrder(@Param('id') id: number): Promise<object> {
    return await this.orderItemsService.findAllFulfilledByOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order-item/:id/fulfilled')
  async findAllFulfilledByOrderItem(
    @Param('id') id: number,
  ): Promise<OrderItemFulfill[]> {
    return await this.orderItemsService.findAllFulfilledByOrderItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id/for-bill')
  async findAllForBillByOrder(@Param('id') id: number): Promise<object> {
    return await this.orderItemsService.findAllForBillByOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-blueprint/:id/with-fulfills')
  async findAllOrderItemsWithFulfillsByBlueprint(
    @Param('id') id: number,
  ): Promise<object> {
    return await this.orderItemsService.findAllOrderItemsWithFulfillsByBlueprint(
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id')
  async findAllByOrder(@Param('id') id: number): Promise<OrderItem[]> {
    return await this.orderItemsService.findAllForOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id/wip')
  async findAllWIPByClass(@Param('id') id: number): Promise<OrderItem[]> {
    return await this.orderItemsService.findAllWIPByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findAllByClass(@Param('id') id: number): Promise<OrderItem[]> {
    return await this.orderItemsService.findAllByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wip-by-blueprint/:id')
  async findAllWIPByBlueprint(@Param('id') id: number): Promise<OrderItem[]> {
    return await this.orderItemsService.findAllWIPByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(
    @Body() orderItem: OrderItem,
    @Param('id') id: number,
  ): Promise<OrderItem> {
    await this.orderItemsService.updateOrderItem(id, orderItem);
    return await this.orderItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.orderItemsService.remove(id);
  }
}
