import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { Repository } from 'typeorm';
import { Transfer } from './transfer.entity';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transfersRepository: Repository<Transfer>,
  ) {}

  async create(transfer: Transfer): Promise<Transfer> {
    return await this.transfersRepository.save(transfer);
  }

  async findAll(): Promise<Transfer[]> {
    return this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ], 
      order: { transfer_id: "DESC" }
    });
  }

  async findOne(id: number): Promise<Transfer> {
    return await this.transfersRepository.findOne(id, {
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
    });
  }

  async getTransfersInQueue(client_id: number): Promise<Transfer[]> {
    return await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { client_id: client_id, status: 'open' },
      order: { transfer_id: "DESC" }
    });
  }

  async getTransfersInWIP(client_id: number): Promise<Transfer[]> {
    return await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { client_id: client_id, status: 'wip' },
      order: { transfer_id: "DESC" }
    });
  }

  async getTransfersForClient(client_id: number): Promise<Transfer[]> {
    return await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { client_id: client_id},
      order: { transfer_id: "DESC" }
    });
  }

  async getTransfersForWorker(worker_id: number): Promise<Transfer[]> {
    return await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { worker_id: worker_id},
      order: { transfer_id: "DESC" }
    });
  }

  async getTransfersByOrder(order_id: number): Promise<Transfer[]> {
    const transfers = await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { order_id: order_id},
      order: { transfer_id: "DESC" }
    });
    return transfers;
  }

  async getTransfersByStatus(status: string): Promise<Transfer[]> {
    return await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { status: status},
      order: { transfer_id: "DESC" }
    });
  }

  async getTransfersByTransport(id: number): Promise<Transfer[]> {
    return await this.transfersRepository.find({
      relations: [
        'transport',
        'worker',
        'order',
        'order.order_items',
        'order.order_items.blueprint',
        'order.order_items.blueprint.product_class',
        'order.order_items.blueprint.product_size',
        'order.client',
        'order.transport',
        'transfer_items',
        'transfer_items.blueprint',
        'transfer_items.blueprint.product_class',
        'transfer_items.blueprint.product_size',
      ],
      where: { transport_id: id},
      order: { transfer_id: "DESC" }
    });
  }

  async remove(id: number): Promise<void> {
    await this.transfersRepository.delete(id);
  }

  async removeTransfers(transfers: Transfer[]): Promise<void> {
    for (let length = 0; length < transfers.length; length++) {
      await this.transfersRepository.delete(transfers[length].transfer_id);
    }
    return;
  }

  async updateTransfer(id: number, transfer: Transfer): Promise<object> {
    const transferEntry = {
      order_id: transfer.order_id,
      status: transfer.status,
      vaz_number: transfer.vaz_number,
      invoice_date: transfer.invoice_date,
      transport_id: transfer.transport_id,
      worker_id: transfer.worker_id,
      unloading_address: transfer.unloading_address,
      unloading_city: transfer.unloading_city,
      unloading_country: transfer.unloading_country,
      unloading_postal_code: transfer.unloading_postal_code,
      unloading_date: transfer.unloading_date,
      unloading_phone_number: transfer.unloading_phone_number,
      loading_address: transfer.loading_address,
      loading_city: transfer.loading_city,
      loading_country: transfer.loading_country,
      loading_postal_code: transfer.loading_postal_code,
      loading_date: transfer.loading_date,
    };
    return await this.transfersRepository.update(id, transferEntry);
  }

  async getLastTransferId(): Promise<number> {
    const transfer = (
      await this.transfersRepository.findOne({ order: { transfer_id: 'DESC' } })
    );
    if (transfer) return transfer.transfer_id;
    return 0;
  }
}
