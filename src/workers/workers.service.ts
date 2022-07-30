import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { Worker } from './worker.entity';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}

  async validation(worker: Worker): Promise<ValidationError[]> {
    const validateWorker = new Worker();
    validateWorker.name = worker.name;
    return await validate(validateWorker);
  }

  async create(worker: Worker): Promise<Worker> {
    return await this.workerRepository.save(worker);
  }

  async findAll(): Promise<Worker[]> {
    return await this.workerRepository.find({
      relations: ['blocks', 'blocks.product_class', 'transfers'],
      order: { worker_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Worker> {
    return await this.workerRepository.findOne(id, {
      relations: ['blocks', 'blocks.product_class', 'transfers'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.workerRepository.delete(id);
  }

  async removeWorkers(worker: Worker[]): Promise<void> {
    for (let length = 0; length < worker.length; length++) {
      await this.workerRepository.delete(worker[length].worker_id);
    }
    return;
  }

  async update(id: number, worker: Worker): Promise<object> {
    return await this.workerRepository.update(id, worker);
  }
}
