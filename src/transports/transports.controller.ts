import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Transport } from './transport.entity';
import { TransportsService } from './transports.service';

@Controller('transports')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async create(@Body() transport: Transport): Promise<object> {
    const content = {
      errors: [],
    }
    const validation = await this.transportsService.validation(transport);
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }
    await this.transportsService.create(transport);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Transport[]> {
    return await this.transportsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Transport> {
    return await this.transportsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(@Body() transport: Transport, @Param('id') id: number): Promise<object> {
    const content = {
      errors: [],
    }
    const validation = await this.transportsService.validation(transport);
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }
    await this.transportsService.updateTransport(id, transport);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.transportsService.remove(id);
  }
}
