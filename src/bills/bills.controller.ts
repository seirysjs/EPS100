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
import { BillItem } from 'src/bill-items/bill-item.entity';
import { BillItemsService } from 'src/bill-items/bill-items.service';
import { Bill } from './bill.entity';
import { BillsService } from './bills.service';
import { BillPayment } from './bill-payment.entity';
import { PriceListsService } from 'src/price-lists/price-lists.service';

@Controller('bills')
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly priceListsService: PriceListsService,
    private readonly billItemsService: BillItemsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newBillFormPost(@Body() formData: any): Promise<object> {
    const content = {
      errors: [],
    };
    const order_id = formData.order_id;
    const price_list_id = formData.price_list_id;
    const bill_id = formData.bill_id;
    const bill_date = formData.bill_date;
    const days_postponed = formData.days_postponed;
    const note = formData.note;
    const bill_items = formData.productRows;

    if (!order_id || order_id == 0) {
      content.errors = [
        { property: 'order_id', constraints: ['order_id must be selected!'] },
      ];
      return content;
    }

    if (bill_items.length == 0) return content;

    let bill_quantity = 0;
    for (
      let billItemIndex = 0;
      billItemIndex < bill_items.length;
      billItemIndex++
    ) {
      const bill_item = bill_items[billItemIndex];
      bill_quantity += bill_item.quantityM3;
    }
    if (bill_quantity == 0) return content;

    const billId = (
      await this.billsService.create(
        ((
          order_id,
          price_list_id,
          bill_id,
          bill_date,
          days_postponed,
          note,
        ) => {
          const bill = new Bill();
          bill.order_id = order_id;
          bill.price_list_id = price_list_id;
          bill.bill_id = bill_id;
          bill.bill_date = bill_date;
          bill.days_postponed = days_postponed;
          bill.note = note;
          return bill;
        })(order_id, price_list_id, bill_id, bill_date, days_postponed, note),
      )
    ).bill_id;
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const billItem = new BillItem();
      billItem.bill_id = billId;
      billItem.blueprint_id = blueprintId;
      billItem.count = partsCount;
      await this.billItemsService.create(billItem);
    }
    return content;
  }

  @Render('orders/billing')
  @Get(':id/billing')
  async showTransportInvoice(@Param('id') billId: number): Promise<object> {
    const bill = await this.billsService.findOne(billId);
    const priceList = await this.priceListsService.findOne(bill.price_list_id);
    const content = {
      priceList: priceList,
      billing: bill,
      order: bill.order,
    };
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment/:id/')
  async updateBillPaymentPost(
    @Param('id') billPaymentId: number,
    @Body() formData: any,
  ): Promise<object> {
    const content = {
      errors: [],
    };
    const billPaymentValidation = await this.billsService.validationBillPayment(
      formData,
    );
    if (billPaymentValidation.length != 0)
      return { errors: billPaymentValidation };

    await this.billsService.updateBillPayment(billPaymentId, formData);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/payment')
  async createBillPaymentPost(@Body() formData: BillPayment): Promise<object> {
    const content = {
      errors: [],
    };

    const billPaymentValidation = await this.billsService.validationBillPayment(
      formData,
    );
    if (billPaymentValidation.length != 0)
      return { errors: billPaymentValidation };

    await this.billsService.createBillPayment(formData);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async editBillFormPost(
    @Param('id') billId: number,
    @Body() formData: any,
  ): Promise<object> {
    const content = {
      errors: [],
    };
    const order_id = formData.order_id;
    const price_list_id = formData.price_list_id;
    const bill_date = formData.bill_date;
    const days_postponed = formData.days_postponed;
    const note = formData.note;

    if (!order_id) {
      content.errors = [
        { property: 'order_id', constraints: ['order_id must be selected!'] },
      ];
      return content;
    }
    const bill = await this.billsService.findOne(billId);
    const billItems = [];
    for (
      let productRow = 0;
      productRow < formData.productRows.length;
      productRow++
    ) {
      const blueprintId = formData.productRows[productRow].blueprint_id;
      const partsCount = formData.productRows[productRow].quantity;
      if (!blueprintId || !partsCount || blueprintId == 0) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      const billItem = new BillItem();
      billItem.bill_id = bill.bill_id;
      billItem.blueprint_id = blueprintId;
      billItem.count = partsCount;
      billItems.push(billItem);
    }
    bill.order_id = order_id;
    bill.price_list_id = price_list_id;
    bill.bill_date = bill_date;
    bill.days_postponed = days_postponed;
    bill.note = note;

    await this.billItemsService.removeBillItems(bill.bill_items);
    await this.billItemsService.createBillItems(billItems);
    await this.billsService.updateBill(billId, bill);

    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() Bill: Bill): Promise<Bill> {
    return await this.billsService.create(Bill);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewBill(): Promise<number> {
    return (await this.billsService.getLastBillId()) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Bill[]> {
    const bills = await this.billsService.findAll();
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Bill> {
    return await this.billsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.billsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-price-list/:id')
  async getBillsByPriceList(@Param('id') id: number): Promise<Bill[]> {
    return await this.billsService.getBillsByPriceList(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id')
  async getBillsByClient(@Param('id') id: number): Promise<Bill[]> {
    return await this.billsService.getBillsForClient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id')
  async getBillsByOrder(@Param('id') id: number): Promise<Bill[]> {
    return await this.billsService.getBillsByOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id/open')
  async getBillsInQueue(@Param('id') id: number): Promise<Bill[]> {
    return await this.billsService.getBillsInQueue(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id/wip')
  async getBillsInWIP(@Param('id') id: number): Promise<Bill[]> {
    return await this.billsService.getBillsInWIP(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-client/:id/done')
  async getBillsInDone(@Param('id') id: number): Promise<Bill[]> {
    return await this.billsService.getBillsInDone(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewInvoice(): Promise<number> {
    return (await this.billsService.getLastBillId()) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment/:id')
  async getBillPayment(@Param('id') id: number): Promise<BillPayment> {
    const billPayment = await this.billsService.getBillPayment(id);
    return billPayment;
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments-by-bill/:id')
  async getBillPaymentsByBill(@Param('id') id: number): Promise<BillPayment[]> {
    const billPayments = await this.billsService.getBillPaymentsByBill(id);
    return billPayments;
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments-by-order/:id')
  async getBillPaymentsByOrder(
    @Param('id') id: number,
  ): Promise<BillPayment[]> {
    const billPayments = await this.billsService.getBillPaymentsByOrder(id);
    return billPayments;
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments-by-client/:id')
  async getBillPaymentsByClient(
    @Param('id') id: number,
  ): Promise<BillPayment[]> {
    const billPayments = await this.billsService.getBillPaymentsByClient(id);
    return billPayments;
  }
}
