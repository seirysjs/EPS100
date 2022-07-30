import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { BillPayment } from './bill-payment.entity';
import { Bill } from './bill.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
    @InjectRepository(BillPayment)
    private readonly billPaymentsRepository: Repository<BillPayment>,
  ) {}

  async create(bill: Bill): Promise<Bill> {
    return await this.billsRepository.save(bill);
  }

  async createBillPayment(billPayment: BillPayment): Promise<BillPayment> {
    return await this.billPaymentsRepository.save(billPayment);
  }

  async validationBillPayment(
    billPayment: BillPayment,
  ): Promise<ValidationError[]> {
    const validateBillPayment = new BillPayment();
    validateBillPayment.bill_id = parseInt(billPayment.bill_id.toString(10));
    validateBillPayment.amount = parseFloat(billPayment.amount.toString(10));
    validateBillPayment.note = billPayment.note;
    validateBillPayment.payment_date = billPayment.payment_date
      ? new Date(billPayment.payment_date)
      : null;
    const result = await validate(validateBillPayment);
    return result;
  }

  async updateBillPayment(
    id: number,
    billPayment: BillPayment,
  ): Promise<BillPayment> {
    const billPaymentEntry = {
      bill_id: billPayment.bill_id,
      payment_date: billPayment.payment_date,
      amount: billPayment.amount,
      note: billPayment.note,
    };
    await this.billPaymentsRepository.update(id, billPaymentEntry);
    return await this.billPaymentsRepository.findOne(id, {
      relations: [
        'bill',
        'bill.order',
        'bill.order.client',
        'bill.bill_items',
        'bill.bill_items.blueprint',
        'bill.bill_items.blueprint.product_class',
        'bill.bill_items.blueprint.product_size',
        'bill.bill_payments',
        'bill.price_list',
        'bill.price_list.prices',
      ],
    });
  }

  async getBillPaymentsByBill(id: number): Promise<BillPayment[]> {
    return this.billPaymentsRepository.find({
      relations: [
        'bill',
        'bill.order',
        'bill.order.client',
        'bill.bill_items',
        'bill.bill_items.blueprint',
        'bill.bill_items.blueprint.product_class',
        'bill.bill_items.blueprint.product_size',
        'bill.bill_payments',
        'bill.price_list',
        'bill.price_list.prices',
      ],
      where: { bill_id: id },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillPaymentsByOrder(id: number): Promise<BillPayment[]> {
    return this.billPaymentsRepository.find({
      relations: [
        'bill',
        'bill.order',
        'bill.order.client',
        'bill.bill_items',
        'bill.bill_items.blueprint',
        'bill.bill_items.blueprint.product_class',
        'bill.bill_items.blueprint.product_size',
        'bill.bill_payments',
        'bill.price_list',
        'bill.price_list.prices',
      ],
      where: { bill: { order_id: id } },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillPaymentsByClient(id: number): Promise<BillPayment[]> {
    return this.billPaymentsRepository.find({
      relations: [
        'bill',
        'bill.order',
        'bill.order.client',
        'bill.bill_items',
        'bill.bill_items.blueprint',
        'bill.bill_items.blueprint.product_class',
        'bill.bill_items.blueprint.product_size',
        'bill.bill_payments',
        'bill.price_list',
        'bill.price_list.prices',
      ],
      where: { bill: { order: { client_id: id } } },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillPayment(id: number): Promise<BillPayment> {
    return this.billPaymentsRepository.findOne(id, {
      relations: [
        'bill',
        'bill.order',
        'bill.order.client',
        'bill.bill_items',
        'bill.bill_items.blueprint',
        'bill.bill_items.blueprint.product_class',
        'bill.bill_items.blueprint.product_size',
        'bill.bill_payments',
        'bill.price_list',
        'bill.price_list.prices',
      ],
    });
  }

  async findAll(): Promise<Bill[]> {
    return this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      order: { bill_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Bill> {
    return await this.billsRepository.findOne(id, {
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
    });
  }

  async getBillsInQueue(client_id: number): Promise<Bill[]> {
    return await this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      where: { order: { status: 'open', client_id: client_id } },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillsInWIP(client_id: number): Promise<Bill[]> {
    return await this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      where: { order: { status: 'wip', client_id: client_id } },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillsInDone(client_id: number): Promise<Bill[]> {
    return await this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      where: { order: { status: 'done', client_id: client_id } },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillsForClient(client_id: number): Promise<Bill[]> {
    return await this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      where: { order: { client_id: client_id } },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillsByPriceList(price_list_id: number): Promise<Bill[]> {
    return await this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      where: { price_list_id: price_list_id },
      order: { bill_id: 'DESC' },
    });
  }

  async getBillsByOrder(order_id: number): Promise<Bill[]> {
    const bills = await this.billsRepository.find({
      relations: [
        'order',
        'order.order_items',
        'order.client',
        'order.transport',
        'bill_items',
        'bill_items.blueprint',
        'bill_items.blueprint.product_class',
        'bill_items.blueprint.product_size',
        'bill_payments',
        'price_list',
        'price_list.prices',
      ],
      where: { order_id: order_id },
      order: { bill_id: 'DESC' },
    });
    return bills;
  }

  async remove(id: number): Promise<void> {
    await this.billsRepository.delete(id);
  }

  async removeBills(bills: Bill[]): Promise<void> {
    for (let length = 0; length < bills.length; length++) {
      await this.billsRepository.delete(bills[length].bill_id);
    }
    return;
  }

  async updateBill(id: number, bill: Bill): Promise<object> {
    const billEntry = {
      order_id: bill.order_id,
      price_list_id: bill.price_list_id,
      bill_date: bill.bill_date,
      days_postponed: bill.days_postponed,
      note: bill.note,
    };
    return await this.billsRepository.update(id, billEntry);
  }

  async getLastBillId(): Promise<number> {
    const bill = await this.billsRepository.findOne({
      order: { bill_id: 'DESC' },
    });
    if (bill) return bill.bill_id;
    return 0;
  }
}
