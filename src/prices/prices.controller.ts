

import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Price } from './price.entity';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Price> {
    return await this.pricesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-bill/:id')
  async findAllByBlueprint(@Param('id') id: number): Promise<Price[]> {
    return await this.pricesService.findAllforBill(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id')
  async findAllByPriceList(@Param('id') id: number): Promise<Price[]> {
    return await this.pricesService.findAllforOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-price-list/:id')
  async findAllWIPPriceListByClass(@Param('id') id: number): Promise<Price[]> {
    return await this.pricesService.findAllForPriceList(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findAllByClass(@Param('id') id: number): Promise<Price[]> {
    return await this.pricesService.findAllforClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(@Body() price: Price, @Param('id') id: number): Promise<Price> {
    await this.pricesService.updatePrice(id, price);
    return await this.pricesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.pricesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() price: Price): Promise<Price> {
    return await this.pricesService.create(price);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Price[]> {
    return await this.pricesService.findAll();
  }
}
