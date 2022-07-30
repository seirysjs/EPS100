import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async validation(client: Client): Promise<ValidationError[]> {
    const validateClient = new Client();
    validateClient.name = client.name;
    validateClient.phone = client.phone;
    validateClient.address = client.address;
    validateClient.city = client.city;
    validateClient.country = client.country;
    validateClient.company_code = client.company_code;
    validateClient.vat_code = client.vat_code;
    validateClient.banks_name = client.banks_name;
    validateClient.account_number = client.account_number;
    const result = await validate(validateClient);
    return result;
  }

  async create(client: Client): Promise<Client> {
    return await this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      relations: [
        'orders',
        'orders.order_items',
        'orders.order_items.blueprint',
        'orders.order_items.blueprint.product_size',
        'orders.order_items.blueprint.product_class',
        'orders.order_item_fulfills',
        'orders.order_item_fulfills.blueprint',
        'orders.order_item_fulfills.blueprint.product_size',
        'orders.order_item_fulfills.blueprint.product_class',
        'orders.transport',
      ],
      order: { client_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Client> {
    return await this.clientsRepository.findOne(id, {
      relations: [
        'orders',
        'orders.order_items',
        'orders.order_items.blueprint',
        'orders.order_items.blueprint.product_size',
        'orders.order_items.blueprint.product_class',
        'orders.order_item_fulfills',
        'orders.order_item_fulfills.blueprint',
        'orders.order_item_fulfills.blueprint.product_size',
        'orders.order_item_fulfills.blueprint.product_class',
        'orders.transport',
      ],
    });
  }

  async remove(id: number): Promise<void> {
    await this.clientsRepository.delete(id);
  }

  async removeClients(clients: Client[]): Promise<void> {
    for (let length = 0; length < clients.length; length++) {
      await this.clientsRepository.delete(clients[length].client_id);
    }
    return;
  }

  async updateClient(clientId: number, clientDto: Client): Promise<object> {
    const client = new Client();
    client.name = clientDto.name;
    client.address = clientDto.address;
    client.email = clientDto.email;
    client.postal_code = clientDto.postal_code;
    client.city = clientDto.city;
    client.country = clientDto.country;
    client.phone = clientDto.phone;
    client.company_code = clientDto.company_code;
    client.vat_code = clientDto.vat_code;
    client.banks_name = clientDto.banks_name;
    client.account_number = clientDto.account_number;
    return await this.clientsRepository.update(clientId, client);
  }
}
