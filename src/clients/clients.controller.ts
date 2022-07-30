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
import { Client } from './client.entity';
import { ClientsService } from './clients.service';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('new')
  async create(@Body() client: Client): Promise<object> {
    const validation = await this.clientsService.validation(client);
    const content = {
      errors: [],
    };
    if (validation.length == 0) await this.clientsService.create(client);
    content.errors = validation;
    return content;
  }

  @Get()
  async findAll(): Promise<object> {
    const clients = await this.clientsService.findAll();
    return clients;
  }

  @Get('new')
  async showNewClientForm(): Promise<object> {
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getClient(@Param('id') id: number): Promise<Client> {
    const client = await this.clientsService.findOne(id);
    return client;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(
    @Body() client: Client,
    @Param('id') id: number,
  ): Promise<object> {
    const validation = await this.clientsService.validation(client);
    const content = {
      errors: [],
    };
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }

    await this.clientsService.updateClient(id, client);
    return content;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.clientsService.remove(id);
  }
}
