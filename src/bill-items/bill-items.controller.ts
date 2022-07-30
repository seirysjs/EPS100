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
import { BillItem } from './bill-item.entity';
import { BillItemsService } from './bill-items.service';

@Controller('bill-items')
export class BillItemsController {
  constructor(private readonly billItemsService: BillItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() billItem: BillItem): Promise<BillItem> {
    return await this.billItemsService.create(billItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<BillItem[]> {
    return await this.billItemsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BillItem> {
    return await this.billItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-blueprint/:id')
  async findAllByBlueprint(@Param('id') id: number): Promise<BillItem[]> {
    return await this.billItemsService.findAllByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-bill/:id')
  async findAllByBill(@Param('id') id: number): Promise<BillItem[]> {
    return await this.billItemsService.findAllForBill(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id/wip')
  async findAllWIPBillByClass(@Param('id') id: number): Promise<BillItem[]> {
    return await this.billItemsService.findAllWIPBillByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findAllByClass(@Param('id') id: number): Promise<BillItem[]> {
    return await this.billItemsService.findAllByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wip-by-blueprint/:id')
  async findAllWIPBillByBlueprint(
    @Param('id') id: number,
  ): Promise<BillItem[]> {
    return await this.billItemsService.findAllWIPBillByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(
    @Body() billItem: BillItem,
    @Param('id') id: number,
  ): Promise<BillItem> {
    await this.billItemsService.updateBillItem(id, billItem);
    return await this.billItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.billItemsService.remove(id);
  }
}
