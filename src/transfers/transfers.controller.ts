import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransferItem } from 'src/transfer-items/transfer-item.entity';
import { TransferItemsService } from 'src/transfer-items/transfer-items.service';
import { Transfer, TransferStatusType } from './transfer.entity';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(
    private readonly transfersService: TransfersService,
    private readonly transferItemsService: TransferItemsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newTransferFormPost(@Body() formData: any): Promise<object> {
    const content = {
      errors: [],
    };
    const order_id = formData.order_id;
    const status: TransferStatusType = 'open';
    const transfer_id = formData.transfer_id;
    const vaz_number = formData.vaz_number;
    const invoice_date = formData.invoice_date;
    const transport_id = formData.transport_id;
    const worker_id = formData.worker_id;
    const unloading_address = formData.unloading_address;
    const unloading_city = formData.unloading_city;
    const unloading_country = formData.unloading_country;
    const unloading_postal_code = formData.unloading_postal_code;
    const unloading_date = formData.unloading_date;
    const unloading_phone_number = formData.unloading_phone_number;
    const loading_address = formData.loading_address;
    const loading_city = formData.loading_city;
    const loading_country = formData.loading_country;
    const loading_postal_code = formData.loading_postal_code;
    const loading_date = formData.loading_date;
    const transfer_items = formData.productRows;

    if (!order_id || order_id == 0) {
      content.errors = [
        { property: 'order_id', constraints: ['order_id must be selected!'] },
      ];
      return content;
    }

    if (transfer_items.length == 0) return content;

    let transfer_quantity = 0;
    for (
      let transferItemIndex = 0;
      transferItemIndex < transfer_items.length;
      transferItemIndex++
    ) {
      const transfer_item = transfer_items[transferItemIndex];
      transfer_quantity += transfer_item.quantityM3;
    }
    if (transfer_quantity == 0) return content;

    const transferId = (
      await this.transfersService.create(
        ((
          order_id,
          status,
          transfer_id,
          vaz_number,
          invoice_date,
          transport_id,
          worker_id,
          unloading_address,
          unloading_city,
          unloading_country,
          unloading_postal_code,
          unloading_date,
          unloading_phone_number,
          loading_address,
          loading_city,
          loading_country,
          loading_postal_code,
          loading_date,
        ) => {
          const transfer = new Transfer();
          transfer.order_id = order_id;
          transfer.status = status;
          transfer.transfer_id = transfer_id;
          transfer.vaz_number = vaz_number;
          transfer.invoice_date = invoice_date;
          transfer.transport_id = transport_id;
          transfer.worker_id = worker_id;
          transfer.unloading_address = unloading_address;
          transfer.unloading_city = unloading_city;
          transfer.unloading_country = unloading_country;
          transfer.unloading_postal_code = unloading_postal_code;
          transfer.unloading_date = unloading_date;
          transfer.unloading_phone_number = unloading_phone_number;
          transfer.loading_address = loading_address;
          transfer.loading_city = loading_city;
          transfer.loading_country = loading_country;
          transfer.loading_postal_code = loading_postal_code;
          transfer.loading_date = loading_date;
          return transfer;
        })(
          order_id,
          status,
          transfer_id,
          vaz_number,
          invoice_date,
          transport_id,
          worker_id,
          unloading_address,
          unloading_city,
          unloading_country,
          unloading_postal_code,
          unloading_date,
          unloading_phone_number,
          loading_address,
          loading_city,
          loading_country,
          loading_postal_code,
          loading_date,
        ),
      )
    ).transfer_id;
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      const packs = formData.productRows[productRow].packs;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const transferItem = new TransferItem();
      transferItem.transfer_id = transferId;
      transferItem.blueprint_id = blueprintId;
      transferItem.packs = packs;
      transferItem.count = partsCount;
      await this.transferItemsService.create(transferItem);
    }
    return content;
  }

  @Render('orders/invoice')
  @Get(':id/invoice')
  async showTransportInvoice(@Param('id') transferId: number): Promise<object> {
    const transfer = await this.transfersService.findOne(transferId);
    const content = {
      transfer: transfer,
      order: transfer.order,
    };
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async editTransferFormPost(
    @Param('id') transferId: number,
    @Body() formData: any,
  ): Promise<object> {
    const content = {
      errors: [],
    };
    const order_id = formData.order_id;
    const status: TransferStatusType = 'open';
    const vaz_number = formData.vaz_number;
    const invoice_date = formData.invoice_date;
    const transport_id = formData.transport_id;
    const worker_id = formData.worker_id;
    const unloading_address = formData.unloading_address;
    const unloading_city = formData.unloading_city;
    const unloading_country = formData.unloading_country;
    const unloading_postal_code = formData.unloading_postal_code;
    const unloading_date = formData.unloading_date;
    const unloading_phone_number = formData.unloading_phone_number;
    const loading_address = formData.loading_address;
    const loading_city = formData.loading_city;
    const loading_country = formData.loading_country;
    const loading_postal_code = formData.loading_postal_code;
    const loading_date = formData.loading_date;

    if (!order_id && status) {
      content.errors = ['order_id must be selected!'];
      return content;
    }
    const transfer = await this.transfersService.findOne(transferId);
    const transferItems = [];
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      const packs = formData.productRows[productRow].packs;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const transferItem = new TransferItem();
      transferItem.transfer_id = transfer.transfer_id;
      transferItem.blueprint_id = blueprintId;
      transferItem.count = partsCount;
      transferItem.packs = packs;
      transferItems.push(transferItem);
    }
    transfer.order_id = order_id;
    transfer.status = status;
    transfer.vaz_number = vaz_number;
    transfer.invoice_date = invoice_date;
    transfer.transport_id = transport_id;
    transfer.worker_id = worker_id;
    transfer.unloading_address = unloading_address;
    transfer.unloading_city = unloading_city;
    transfer.unloading_country = unloading_country;
    transfer.unloading_postal_code = unloading_postal_code;
    transfer.unloading_date = unloading_date;
    transfer.unloading_phone_number = unloading_phone_number;
    transfer.loading_address = loading_address;
    transfer.loading_city = loading_city;
    transfer.loading_country = loading_country;
    transfer.loading_postal_code = loading_postal_code;
    transfer.loading_date = loading_date;

    await this.transferItemsService.removeTransferItems(
      transfer.transfer_items,
    );
    await this.transferItemsService.createTransferItems(transferItems);
    await this.transfersService.updateTransfer(transferId, transfer);

    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() Transfer: Transfer): Promise<Transfer> {
    return await this.transfersService.create(Transfer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewTransfer(): Promise<number> {
    return (await this.transfersService.getLastTransferId()) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Transfer[]> {
    const transfers = await this.transfersService.findAll();
    return transfers;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Transfer> {
    return await this.transfersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.transfersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-status/:status')
  async getTransfersByStatus(
    @Param('status') status: string,
  ): Promise<Transfer[]> {
    return await this.transfersService.getTransfersByStatus(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id')
  async getTransfersByClient(@Param('id') id: number): Promise<Transfer[]> {
    return await this.transfersService.getTransfersForClient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-worker/:id')
  async getTransfersForWorker(@Param('id') id: number): Promise<Transfer[]> {
    return await this.transfersService.getTransfersForWorker(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id')
  async getTransfersByOrder(@Param('id') id: number): Promise<Transfer[]> {
    return await this.transfersService.getTransfersByOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id/open')
  async getTransfersInQueue(@Param('id') id: number): Promise<Transfer[]> {
    return await this.transfersService.getTransfersInQueue(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id/wip')
  async getTransfersInWIP(@Param('id') id: number): Promise<Transfer[]> {
    return await this.transfersService.getTransfersInWIP(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-transport/:id')
  async getTransfersByTransport(@Param('id') id: number): Promise<Transfer[]> {
    return await this.transfersService.getTransfersByTransport(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewInvoice(): Promise<number> {
    return (await this.transfersService.getLastTransferId()) + 1;
  }
}
