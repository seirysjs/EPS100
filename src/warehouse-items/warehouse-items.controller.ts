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
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { WarehouseItem } from './warehouse-item.entity';
import { WarehouseItemsService } from './warehouse-items.service';

@Controller('warehouse-items')
export class WarehouseItemsController {
  constructor(
    private readonly warehouseItemsService: WarehouseItemsService,
    private readonly orderItemsService: OrderItemsService,
    private readonly blueprintsService: BlueprintsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('inventory/by-class/:id')
  async stackWarehouseItemsByClass(@Param('id') id: number): Promise<object> {
    const warehouseItems = await this.warehouseItemsService.findAllByClass(id);
    const stackedBlueprintsQty = {};
    const stackedOrderQty = {};
    const stackedWarehouseItems = [];
    const orderItems = await this.orderItemsService.findAllWIPByClass(id);

    warehouseItems.forEach((warehouseItem) => {
      if (!stackedBlueprintsQty[warehouseItem.blueprint_id])
        stackedBlueprintsQty[warehouseItem.blueprint_id] = 0;
      stackedBlueprintsQty[warehouseItem.blueprint_id] += warehouseItem.count;
    });
    orderItems.forEach((orderItem) => {
      if (!stackedOrderQty[orderItem.blueprint_id])
        stackedOrderQty[orderItem.blueprint_id] = 0;
      if (!stackedBlueprintsQty[orderItem.blueprint_id])
        stackedBlueprintsQty[orderItem.blueprint_id] = 0;
      stackedOrderQty[orderItem.blueprint_id] += orderItem.count;
    });
    for (const [blueprint_id, qty] of Object.entries(stackedBlueprintsQty)) {
      const blueprint = await this.blueprintsService.findOne(
        parseInt(blueprint_id),
      );
      stackedWarehouseItems.push({
        blueprint: blueprint,
        count: qty,
        orderStack: stackedOrderQty[blueprint_id]
          ? stackedOrderQty[blueprint_id]
          : '0',
      });
    }
    return stackedWarehouseItems;
  }

  @UseGuards(JwtAuthGuard)
  @Get('inventory')
  async stackWarehouseItemsByBlueprint(): Promise<object> {
    const warehouseItems = await this.warehouseItemsService.findAll();
    const stackedBlueprintsQty = {};
    const stackedOrderQty = {};
    const stackedWarehouseItems = [];
    const orderItems = await this.orderItemsService.findAllinWIP();

    warehouseItems.forEach((warehouseItem) => {
      if (!stackedBlueprintsQty[warehouseItem.blueprint_id])
        stackedBlueprintsQty[warehouseItem.blueprint_id] = 0;
      stackedBlueprintsQty[warehouseItem.blueprint_id] += warehouseItem.count;
    });
    orderItems.forEach((orderItem) => {
      if (!stackedOrderQty[orderItem.blueprint_id])
        stackedOrderQty[orderItem.blueprint_id] = 0;
      if (!stackedBlueprintsQty[orderItem.blueprint_id])
        stackedBlueprintsQty[orderItem.blueprint_id] = 0;
      stackedOrderQty[orderItem.blueprint_id] += orderItem.count;
    });
    for (const [blueprint_id, qty] of Object.entries(stackedBlueprintsQty)) {
      const blueprint = await this.blueprintsService.findOne(
        parseInt(blueprint_id),
      );
      stackedWarehouseItems.push({
        blueprint: blueprint,
        count: qty,
        orderStack: stackedOrderQty[blueprint_id]
          ? stackedOrderQty[blueprint_id]
          : '0',
      });
    }
    return stackedWarehouseItems;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/blueprint')
  async findByWarehouseItemBlueprint(
    @Param('id') id: number,
  ): Promise<WarehouseItem[]> {
    const warehouseItem = await this.warehouseItemsService.findOne(id);
    const warehouseItems = await this.warehouseItemsService.findAllByBlueprint(
      warehouseItem.blueprint_id,
    );
    return warehouseItems;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() warehouseItem: WarehouseItem): Promise<WarehouseItem> {
    return await this.warehouseItemsService.create(warehouseItem);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(
    @Body() warehouseItem: WarehouseItem,
    @Param('id') id: number,
  ): Promise<WarehouseItem> {
    return await this.warehouseItemsService.updateWarehouseItemEntry(
      id,
      warehouseItem,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<WarehouseItem> {
    return await this.warehouseItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-worker/:id')
  async findAllByWorker(@Param('id') id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsService.findAllByWorker(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-block/:id')
  async findAllByBlock(@Param('id') id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsService.findAllByBlock(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-blueprint/:id')
  async findAllByBlueprint(@Param('id') id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsService.findAllByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findAllByClass(@Param('id') id: number): Promise<WarehouseItem[]> {
    return await this.warehouseItemsService.findAllByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.warehouseItemsService.remove(id);
  }
}
