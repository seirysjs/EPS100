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
import { Price } from 'src/prices/price.entity';
import { PricesService } from 'src/prices/prices.service';
import { PriceList } from './price-list.entity';
import { PriceListsService } from './price-lists.service';

@Controller('price-lists')
export class PriceListsController {
  constructor(
    private readonly priceListsService: PriceListsService,
    private readonly pricesService: PricesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newPriceListFormPost(@Body() formData: any): Promise<object> {
    const content = {
      errors: [],
    };
    const name = formData.name;
    const enabled = formData.enabled;
    const price_list_date = formData.price_list_date;
    const note = formData.note;
    const prices = formData.prices;

    const validationPriceList = await this.priceListsService.validation(
      formData,
    );
    if (validationPriceList.length != 0) return { errors: validationPriceList };

    if (prices.length == 0) return {};

    const priceListId = (
      await this.priceListsService.create(
        ((name, enabled, price_list_date, note) => {
          const priceList = new PriceList();
          priceList.name = name;
          priceList.enabled = enabled;
          priceList.price_list_date = price_list_date;
          priceList.note = note;
          return priceList;
        })(name, enabled, price_list_date, note),
      )
    ).price_list_id;

    for (let productRow = 0; productRow < prices.length; productRow++) {
      const productClassId = prices[productRow].product_class_id;
      const amount = prices[productRow].amountProduct;
      const markup = prices[productRow].markup;

      const price = new Price();
      price.price_list_id = priceListId;
      price.product_class_id = productClassId;
      price.amount = amount;
      price.markup = markup;
      const validatePrice = await this.pricesService.validation(price);

      if (validatePrice.length != 0)
        validatePrice.forEach((error) => {
          error.property = `product_class_${productClassId}`;
          content.errors.push(error);
        });

      if (validatePrice.length == 0) await this.pricesService.create(price);
    }

    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async editPriceListFormPost(
    @Param('id') priceListId: number,
    @Body() formData: any,
  ): Promise<object> {
    const content = {
      errors: [],
    };
    const priceListDate = formData.price_list_date;
    const name = formData.name;
    const enabled = formData.enabled;
    const note = formData.note;

    const validationPriceList = await this.priceListsService.validation(
      formData,
    );
    if (validationPriceList.length != 0) return { errors: validationPriceList };

    const priceList = await this.priceListsService.findOne(priceListId);
    const prices = [];
    for (
      let productRow = 0;
      productRow < formData.prices.length;
      productRow++
    ) {
      const productClassId = formData.prices[productRow].product_class_id;
      const markup = formData.prices[productRow].markup;
      const amount = formData.prices[productRow].amountProduct;

      const price = new Price();
      price.price_list_id = priceListId;
      price.product_class_id = productClassId;
      price.amount = amount;
      price.markup = markup;

      const validatePrice = await this.pricesService.validation(price);

      if (validatePrice.length != 0)
        validatePrice.forEach((error) => {
          error.property = `product_class_${productClassId}`;
          content.errors.push(error);
        });

      if (validatePrice.length == 0) prices.push(price);
    }

    if (content.errors.length != 0) return content;

    priceList.price_list_date = priceListDate;
    priceList.name = name;
    priceList.enabled = enabled;
    priceList.note = note;

    await this.pricesService.removePrices(priceList.prices);

    if (prices.length != 0) await this.pricesService.createPrices(prices);

    await this.priceListsService.updatePriceList(priceListId, priceList);

    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() PriceList: PriceList): Promise<PriceList> {
    return await this.priceListsService.create(PriceList);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewPriceList(): Promise<number> {
    return (await this.priceListsService.getLastPriceListId()) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Get('enabled')
  async getPriceListsEnabled(): Promise<PriceList[]> {
    return await this.priceListsService.getPriceListsEnabled();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<PriceList[]> {
    const priceLists = await this.priceListsService.findAll();
    return priceLists;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PriceList> {
    return await this.priceListsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.priceListsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-bill/:id')
  async getPriceListsByClient(@Param('id') id: number): Promise<PriceList[]> {
    return await this.priceListsService.getPriceListForBill(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-order/:id')
  async getPriceListsByOrder(@Param('id') id: number): Promise<PriceList[]> {
    return await this.priceListsService.getPriceListForOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-price/:id')
  async getPriceListsInQueue(@Param('id') id: number): Promise<PriceList[]> {
    return await this.priceListsService.getPriceListsWithPrice(id);
  }
}
