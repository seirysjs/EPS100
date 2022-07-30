import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(resolve('src/public'));
  app.setBaseViewsDir(resolve('src/views'));

  // helpers (functions tags passed in template)

  hbs.registerHelper('orderDeliveryDate', (datetimeFormat) =>
    datetimeFormat
      ? datetimeFormat.toLocaleString('lt-LT').split(' ')[0]
      : new Date().toLocaleString('lt-LT').split(' ')[0],
  );
  hbs.registerHelper('orderVazDate', (datetimeFormat) => {
    if (!datetimeFormat) return '';
    const dateArray = datetimeFormat
      .toLocaleString('lt-LT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
      .split(' ');
    dateArray.splice(3, 0, 'mėn.');
    dateArray.push('val.');
    return dateArray.join(' ');
  });

  hbs.registerHelper(
    'todayDate',
    () => new Date().toLocaleString('lt-LT').split(' ')[0],
  );
  hbs.registerHelper('indexPlus', (index) => index + 1);
  hbs.registerHelper('payDate', (content) => {
    const billDate = content.data.root.billing.bill_date;
    const orderDate = content.data.root.order.delivery_date;
    const newDate = new Date();
    const daysPostponed = content.data.root.billing.days_postponed;

    const payDay = new Date(
      new Date(
        (billDate ? billDate : orderDate ? orderDate : newDate).toLocaleString(
          'lt-LT',
          { year: 'numeric', month: 'numeric', day: 'numeric' },
        ),
      ).getTime() +
        daysPostponed * 86400000,
    )
      .toLocaleString('lt-LT')
      .split(' ')[0];
    return payDay;
  });

  hbs.registerHelper('countVolume', (warehouseItem) => {
    const size = [
      warehouseItem.blueprint.product_size.x_mm,
      warehouseItem.blueprint.product_size.y_mm,
      warehouseItem.blueprint.product_size.z_mm,
    ];
    const count = warehouseItem.count;
    const stackInOrder =
      warehouseItem.orderStack == 0 ? null : warehouseItem.orderStack;
    const volumeUnit = size[0] * size[1] * size[2];
    const mmVolumeTotal = volumeUnit * count;
    const mVolumeTotal = mmVolumeTotal / 1000000000;
    const orderVolume = (volumeUnit * stackInOrder) / 1000000000;
    return stackInOrder ? `${mVolumeTotal} (-${orderVolume})` : mVolumeTotal;
  });

  hbs.registerHelper('countVolumeTotal', (orderItems) => {
    let orderItemList = [];
    orderItems.forEach((orderItem) => {
      orderItemList.push(orderItem);
    });
    if (!orderItems?.length) orderItemList = [orderItems];
    let orderVolumeTotal = 0;
    for (let orderItem = 0; orderItem < orderItemList.length; orderItem++) {
      const warehouseItem = orderItemList[orderItem];
      const size = [
        warehouseItem.blueprint.product_size.x_mm,
        warehouseItem.blueprint.product_size.y_mm,
        warehouseItem.blueprint.product_size.z_mm,
      ];
      const count = warehouseItem.count;
      const volumeUnit = size[0] * size[1] * size[2];
      const mmVolumeTotal = volumeUnit * count;
      const mVolumeTotal = mmVolumeTotal / 1000000000;
      orderVolumeTotal += mVolumeTotal;
    }
    return Math.round(orderVolumeTotal * 1000) / 1000;
  });

  hbs.registerHelper('billItemClassPrice', (inputValue) => {
    const blueprint = inputValue.blockParams[0][0].blueprint;
    const priceList = inputValue.data.root.priceList;

    if (!blueprint || !priceList) return 0;
    if (priceList.prices.length == 0) return 0;

    const productClassPrice = priceList.prices.find(
      (price) => price.product_class_id == blueprint.product_class_id,
    );
    const amountCost = productClassPrice.amount;

    return Math.round(amountCost * 100) / 100;
  });

  hbs.registerHelper('billItemPrice', (inputValue) => {
    const blueprint = inputValue.blockParams[0][0].blueprint;
    const count = inputValue.blockParams[0][0].count;
    const priceList = inputValue.data.root.priceList;

    if (!blueprint || !count || !priceList) return 0;
    if (priceList.prices.length == 0) return 0;

    const size = [
      blueprint.product_size.x_mm,
      blueprint.product_size.y_mm,
      blueprint.product_size.z_mm,
    ];
    const mmVolumeUnit = size[0] * size[1] * size[2];
    const mVolumeUnit = mmVolumeUnit / 1000000000;
    const mVolumeProductTotal = mVolumeUnit * count;

    const productClassPrice = priceList.prices.find(
      (price) => price.product_class_id == blueprint.product_class_id,
    );
    const amountCostTotal = productClassPrice.amount * mVolumeProductTotal;
    return Math.round(amountCostTotal * 100) / 100;
  });

  hbs.registerHelper('billItemsTotalPrice', (inputValue) => {
    let amountProductTotalPrice = 0;
    const billItems = inputValue.data.root.billing.bill_items;
    const priceList = inputValue.data.root.priceList;

    if (!billItems || !priceList) return amountProductTotalPrice;
    if (billItems.length == 0 || priceList.prices.length == 0)
      return amountProductTotalPrice;

    for (
      let indexBillItem = 0;
      indexBillItem < billItems.length;
      indexBillItem++
    ) {
      const billItem = billItems[indexBillItem];
      const blueprint = billItem.blueprint;
      const size = [
        blueprint.product_size.x_mm,
        blueprint.product_size.y_mm,
        blueprint.product_size.z_mm,
      ];
      const count = billItem.count;
      const mmVolumeUnit = size[0] * size[1] * size[2];
      const mVolumeUnit = mmVolumeUnit / 1000000000;
      const mVolumeProductTotal = mVolumeUnit * count;
      const productClassPrice = priceList.prices.find(
        (price) => price.product_class_id == blueprint.product_class_id,
      );
      const amountCostTotal = productClassPrice.amount * mVolumeProductTotal;
      amountProductTotalPrice += amountCostTotal;
    }

    return Math.round(amountProductTotalPrice * 100) / 100;
  });

  hbs.registerHelper('billItemsTotalPriceVAT', (inputValue) => {
    let amountProductTotalPrice = 0;
    const billItems = inputValue.data.root.billing.bill_items;
    const priceList = inputValue.data.root.priceList;

    if (!billItems || !priceList) return amountProductTotalPrice;
    if (billItems.length == 0 || priceList.prices.length == 0)
      return amountProductTotalPrice;

    for (
      let indexBillItem = 0;
      indexBillItem < billItems.length;
      indexBillItem++
    ) {
      const billItem = billItems[indexBillItem];
      const blueprint = billItem.blueprint;
      const size = [
        blueprint.product_size.x_mm,
        blueprint.product_size.y_mm,
        blueprint.product_size.z_mm,
      ];
      const count = billItem.count;
      const mmVolumeUnit = size[0] * size[1] * size[2];
      const mVolumeUnit = mmVolumeUnit / 1000000000;
      const mVolumeProductTotal = mVolumeUnit * count;
      const productClassPrice = priceList.prices.find(
        (price) => price.product_class_id == blueprint.product_class_id,
      );
      const amountCostTotal = productClassPrice.amount * mVolumeProductTotal;
      amountProductTotalPrice += amountCostTotal;
    }

    return Math.round(((amountProductTotalPrice * 21) / 100) * 100) / 100;
  });

  hbs.registerHelper('billItemsTotalPriceWithVAT', (inputValue) => {
    let amountProductTotalPrice = 0;
    const billItems = inputValue.data.root.billing.bill_items;
    const priceList = inputValue.data.root.priceList;

    if (!billItems || !priceList) return amountProductTotalPrice;
    if (billItems.length == 0 || priceList.prices.length == 0)
      return amountProductTotalPrice;

    for (
      let indexBillItem = 0;
      indexBillItem < billItems.length;
      indexBillItem++
    ) {
      const billItem = billItems[indexBillItem];
      const blueprint = billItem.blueprint;
      const size = [
        blueprint.product_size.x_mm,
        blueprint.product_size.y_mm,
        blueprint.product_size.z_mm,
      ];
      const count = billItem.count;
      const mmVolumeUnit = size[0] * size[1] * size[2];
      const mVolumeUnit = mmVolumeUnit / 1000000000;
      const mVolumeProductTotal = mVolumeUnit * count;
      const productClassPrice = priceList.prices.find(
        (price) => price.product_class_id == blueprint.product_class_id,
      );
      const amountCostTotal = productClassPrice.amount * mVolumeProductTotal;
      amountProductTotalPrice += amountCostTotal;
    }

    return (
      Math.round(
        ((amountProductTotalPrice * 21) / 100 + amountProductTotalPrice) * 100,
      ) / 100
    );
  });

  hbs.registerHelper('floatAmountToWordsLt', (inputValue) => {
    const ltEurSingle = 'euras';
    const ltEurFirstDecimalWoOne = 'eurai';
    const ltEurSecondDecimalWRest = 'eurų';

    let amountProductTotalPrice = 0;
    const billItems = inputValue.data.root.billing.bill_items;
    const priceList = inputValue.data.root.priceList;

    if (!billItems || !priceList)
      return amountProductTotalPrice + ' ' + ltEurSecondDecimalWRest;
    if (billItems.length == 0 || priceList.prices.length == 0)
      return amountProductTotalPrice + ' ' + ltEurSecondDecimalWRest;

    for (
      let indexBillItem = 0;
      indexBillItem < billItems.length;
      indexBillItem++
    ) {
      const billItem = billItems[indexBillItem];
      const blueprint = billItem.blueprint;
      const size = [
        blueprint.product_size.x_mm,
        blueprint.product_size.y_mm,
        blueprint.product_size.z_mm,
      ];
      const count = billItem.count;
      const mmVolumeUnit = size[0] * size[1] * size[2];
      const mVolumeUnit = mmVolumeUnit / 1000000000;
      const mVolumeProductTotal = mVolumeUnit * count;
      const productClassPrice = priceList.prices.find(
        (price) => price.product_class_id == blueprint.product_class_id,
      );
      const amountCostTotal = productClassPrice.amount * mVolumeProductTotal;
      amountProductTotalPrice += amountCostTotal;
    }

    const totalAmountWithVAT =
      Math.round(
        ((amountProductTotalPrice * 21) / 100 + amountProductTotalPrice) * 100,
      ) / 100;

    const ltZero = 'nulis';

    const ltFirstDecimal = {
      '1': 'vienas',
      '2': 'du',
      '3': 'trys',
      '4': 'keturi',
      '5': 'penki',
      '6': 'šeši',
      '7': 'septyni',
      '8': 'aštuoni',
      '9': 'devyni',
    };

    const ltSecondDecimal = {
      '1': 'vienuolika',
      '2': 'dvylika',
      '3': 'trylika',
      '4': 'keturiolika',
      '5': 'penkiolika',
      '6': 'šešiolika',
      '7': 'septyniolika',
      '8': 'aštuoniolika',
      '9': 'devyniolika',
    };

    const ltDecimals = {
      '1': 'dešimt',
      '2': 'dvidešimt',
      '3': 'trisdešimt',
      '4': 'keturiasdešimt',
      '5': 'penkiasdešimt',
      '6': 'šešiasdešimt',
      '7': 'septyniasdešimt',
      '8': 'aštuoniasdešimt',
      '9': 'devyniasdešimt',
    };

    const ltHundreds = 'šimtai';
    const ltHundred = 'šimtas';

    const ltCommaSingleMultipliers = {
      '1': 'tūkstantis',
      '2': 'milijonas',
      '3': 'milijardas',
    };

    const ltCommaMultipliers = {
      '1': 'tūkstančiai',
      '2': 'milijonai',
      '3': 'milijardai',
    };

    const ltCommaSecondDecimalMultipliers = {
      '1': 'tūkstančių',
      '2': 'milijonų',
      '3': 'milijardų',
    };

    const totalAmountWithoutCentsReversedSplit = totalAmountWithVAT
      .toString()
      .split('.')[0]
      .split('')
      .reverse();
    const amountNumberDecimals = totalAmountWithoutCentsReversedSplit.length;
    const amountWords = [];
    const numberCommas =
      (amountNumberDecimals - (amountNumberDecimals % 3)) / 3 +
      (amountNumberDecimals % 3 > 0 ? 1 : 0);

    for (
      let indexCommaNumber = 0;
      indexCommaNumber < numberCommas;
      indexCommaNumber++
    ) {
      const hundreds = parseInt(
        totalAmountWithoutCentsReversedSplit[indexCommaNumber * 3 + 2],
      );
      const decimals = parseInt(
        totalAmountWithoutCentsReversedSplit[indexCommaNumber * 3 + 1],
      );
      const decimal = parseInt(
        totalAmountWithoutCentsReversedSplit[indexCommaNumber * 3],
      );

      const hundredsString = hundreds
        ? hundreds > 0
          ? hundreds > 1
            ? ltFirstDecimal[hundreds] + ' ' + ltHundreds
            : ltFirstDecimal[1] + ' ' + ltHundred
          : ''
        : '';
      const decimalsString = decimals
        ? decimals > 0
          ? decimals > 1
            ? ltDecimals[decimals]
            : decimal > 0
            ? ltSecondDecimal[decimal]
            : ltDecimals[1]
          : ''
        : '';
      const decimalString = decimal
        ? decimal > 0
          ? decimals != 1
            ? ltFirstDecimal[decimal] +
              ' ' +
              (decimal != 1
                ? indexCommaNumber == 0
                  ? ltEurFirstDecimalWoOne
                  : ''
                : indexCommaNumber == 0
                ? ltEurSingle
                : '')
            : indexCommaNumber == 0
            ? ltEurSecondDecimalWRest
            : ''
          : ''
        : indexCommaNumber == 0
        ? ltEurSecondDecimalWRest
        : '';
      const commaString =
        indexCommaNumber > 0
          ? decimals != 1
            ? decimal != 1
              ? decimal != 0
                ? ltCommaMultipliers[indexCommaNumber]
                : ltCommaSecondDecimalMultipliers[indexCommaNumber]
              : ltCommaSingleMultipliers[indexCommaNumber]
            : ltCommaSecondDecimalMultipliers[indexCommaNumber]
          : '';

      amountWords.unshift(
        hundredsString,
        decimalsString,
        decimalString,
        commaString,
      );
    }
    amountWords.join('').split('');

    if (amountWords.length == 0)
      amountWords.push(ltZero + ltEurSecondDecimalWRest);
    if (amountWords.length > 0)
      amountWords.push(
        totalAmountWithVAT.toString().split('.')[1]
          ? totalAmountWithVAT.toString().split('.')[1] + ' ct'
          : '0 ct',
      );

    const amountString = amountWords.join(' ');
    return amountString;
  });

  app.setViewEngine('hbs');

  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
