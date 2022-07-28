import { Body, Controller, Delete, Get, Param, Post, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Block } from 'src/blocks/block.entity';
import { BlocksService } from 'src/blocks/blocks.service';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { Worker } from './worker.entity';
import { WorkersService } from './workers.service';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService,
    private readonly blockService: BlocksService,
    private readonly warehouseItemsService: WarehouseItemsService
    ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(@Body() formData: any, @Param('id') id: number): Promise<object> {
    const content = {
      errors: [],
    }
    const validation = await this.workersService.validation(formData);
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }
    const worker = new Worker()
    worker.name = formData.name;
    await this.workersService.update(id, worker);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async create(@Body() worker: Worker): Promise<object> {
    const content = {
      errors: [],
    }
    const validation = await this.workersService.validation(worker);
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }
    await this.workersService.create(worker);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Worker> {
    return await this.workersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Worker[]> {
    return await this.workersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.workersService.remove(id);
  }
}
