import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { Transport } from './transport.entity';

@Injectable()
export class TransportsService {
  constructor(
    @InjectRepository(Transport)
    private readonly transportsRepository: Repository<Transport>,
  ) {}

  async validation(transport: Transport): Promise<ValidationError[]> {
    const validateTransport = new Transport();
    validateTransport.name = transport.name;
    validateTransport.number = transport.number;
    return await validate(validateTransport);
  }

  async create(transport: Transport): Promise<Transport> {
    return await this.transportsRepository.save(transport);
  }

  async findAll(): Promise<Transport[]> {
    return await this.transportsRepository.find({
      relations: ['orders'], order: { transport_id: "DESC" }
    });
  }

  async findOne(id: number): Promise<Transport> {
    return await this.transportsRepository.findOne(id, {
      relations: ['orders'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.transportsRepository.delete(id);
  }

  async removeTransports(transports: Transport[]): Promise<void> {
    for (let length = 0; length < transports.length; length++) {
      await this.transportsRepository.delete(transports[length].transport_id);
    }
    return;
  }

  async updateTransport(transportId: number, transportDto: Transport): Promise<Transport> {
    const transport = new Transport();
    transport.name = transportDto.name;
    transport.number = transportDto.number;
    await this.transportsRepository.update(transportId, transport);
    return await this.findOne(transportId);
  }
}
