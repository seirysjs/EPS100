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
import { TransferItem } from './transfer-item.entity';
import { TransferItemsService } from './transfer-items.service';

@Controller('transfer-items')
export class TransferItemsController {
  constructor(private readonly transferItemsService: TransferItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() transferItem: TransferItem): Promise<TransferItem> {
    return await this.transferItemsService.create(transferItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<TransferItem[]> {
    return await this.transferItemsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TransferItem> {
    return await this.transferItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-blueprint/:id')
  async findAllByBlueprint(@Param('id') id: number): Promise<TransferItem[]> {
    return await this.transferItemsService.findAllByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-transfer/:id')
  async findAllByTransfer(@Param('id') id: number): Promise<TransferItem[]> {
    return await this.transferItemsService.findAllForTransfer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id/wip')
  async findAllWIPTransferByClass(
    @Param('id') id: number,
  ): Promise<TransferItem[]> {
    return await this.transferItemsService.findAllWIPTransferByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findAllByClass(@Param('id') id: number): Promise<TransferItem[]> {
    return await this.transferItemsService.findAllByClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wip-by-blueprint/:id')
  async findAllWIPTransferByBlueprint(
    @Param('id') id: number,
  ): Promise<TransferItem[]> {
    return await this.transferItemsService.findAllWIPTransferByBlueprint(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(
    @Body() transferItem: TransferItem,
    @Param('id') id: number,
  ): Promise<TransferItem> {
    await this.transferItemsService.updateTransferItem(id, transferItem);
    return await this.transferItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.transferItemsService.remove(id);
  }
}
