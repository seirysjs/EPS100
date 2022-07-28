// UI

export const dateToLocaleDateString = (datetime) => {
  if (datetime)
  return new Date(datetime).toLocaleString('lt-LT').split(' ')[0];
};

export const dateToLocaleString = (datetime) => {
  if (datetime)
  return new Date(datetime).toLocaleString('lt-LT').split(' ').join('T');
};

export const countInvWarehouseItemVolume = warehouseItem => {
  const size = [warehouseItem.blueprint.product_size.x_mm, warehouseItem.blueprint.product_size.y_mm, warehouseItem.blueprint.product_size.z_mm];
  const count = warehouseItem.count;
  const volumeUnit = size[0] * size[1] * size[2];
  const mmVolumeTotal = volumeUnit * count;
  const mVolumeTotal = mmVolumeTotal / 1000000000;
  return Math.round((mVolumeTotal) * 1000) / 1000;
};

export const countInvOrderItemVolume = warehouseItem => {
  const size = [warehouseItem.blueprint.product_size.x_mm, warehouseItem.blueprint.product_size.y_mm, warehouseItem.blueprint.product_size.z_mm];
  const stackInOrder = warehouseItem.orderStack;
  const volumeUnit = size[0] * size[1] * size[2];
  const orderVolume = volumeUnit * stackInOrder / 1000000000;
  return Math.round((orderVolume) * 1000) / 1000;
};

export const countInvTotalItemVolume = warehouseItem => {
  const size = [warehouseItem.blueprint.product_size.x_mm, warehouseItem.blueprint.product_size.y_mm, warehouseItem.blueprint.product_size.z_mm];
  const count = warehouseItem.count;
  const stackInOrder = warehouseItem.orderStack;
  const volumeUnit = size[0] * size[1] * size[2];
  const mmVolumeTotal = volumeUnit * count;
  const mVolumeTotal = mmVolumeTotal / 1000000000;
  const orderVolume = volumeUnit * stackInOrder / 1000000000;
  return Math.round((mVolumeTotal - orderVolume) * 1000) / 1000;
};

export const countVolumeBlueprint = blueprint => {
  const size = [blueprint.product_size.x_mm, blueprint.product_size.y_mm, blueprint.product_size.z_mm];
  const mmVolumeUnit = size[0] * size[1] * size[2];
  const mVolumeUnit = mmVolumeUnit / 1000000000;
  return Math.round((mVolumeUnit) * 1000) / 1000;
}

export const ordersInQueueCount = orders => {
  let inQueue = 0;
  orders.forEach(order => {
    if (order.status == "open") inQueue++;
  });
  return inQueue;
};

export const ordersInWIPCount = orders => {
  let inQueue = 0;
  orders.forEach(order => {
    if (order.status == "wip") inQueue++;
  });
  return inQueue;
};

export const totalVolumeOrderItems = orderItems => {
  let volumeTotal = 0;
  if (!orderItems) return;
  if (!orderItems.length || orderItems.length == 0) return 0;
  for (let orderItemIndex = 0; orderItemIndex < orderItems.length; orderItemIndex++) {
    const orderItem = orderItems[orderItemIndex];
    const size = [orderItem.blueprint.product_size.x_mm, orderItem.blueprint.product_size.y_mm, orderItem.blueprint.product_size.z_mm];
    const count = orderItem.count;
    const volumeUnit = size[0] * size[1] * size[2];
    const mmVolumeTotal = volumeUnit * count;
    const mVolumeTotal = mmVolumeTotal / 1000000000;
    volumeTotal += mVolumeTotal;
  }
  
  return Math.round(volumeTotal * 1000) / 1000;
};

export const totalVolumeTransfers = transfers => {
  let volumeTotal = 0;
  if (!transfers) return;
  if (!transfers.length || transfers.length == 0) return 0;
  
  for (let transferIndex = 0; transferIndex < transfers.length; transferIndex++) {
    const transfer = transfers[transferIndex];
    volumeTotal += totalVolumeOrderItems(transfer.transfer_items);
  }
  
  return Math.round(volumeTotal * 1000) / 1000;
};

export const totalVolumeBills = bills => {
  let volumeTotal = 0;
  if (!bills) return;
  if (!bills.length || bills.length == 0) return 0;
  
  for (let billIndex = 0; billIndex < bills.length; billIndex++) {
    const bill = bills[billIndex];
    volumeTotal += totalVolumeOrderItems(bill.bill_items);
  }
  
  return Math.round(volumeTotal * 1000) / 1000;
};

export const roundNumber = (numberValue) => {
  numberValue = parseFloat(numberValue.toString())
  return Math.round(numberValue * 1000) / 1000;
};

export const mapOrderItemsByBlueprints = (order) => {
  const orderItems = order.order_items;
  const orderItemsFulfills = order.order_item_fulfills;
  const orderItemsMap = {};
  const allOrderItems = [];

  orderItems.forEach(orderItem => {
    if (!orderItemsMap[orderItem.blueprint_id]) {
      orderItemsMap[orderItem.blueprint_id] = {
        count: 0,
        blueprint: orderItem.blueprint,
      };
    }
    
    orderItemsMap[orderItem.blueprint_id].count += orderItem.count;
  });

  orderItemsFulfills.forEach(orderItem => {
    if (!orderItemsMap[orderItem.blueprint_id]) {
      orderItemsMap[orderItem.blueprint_id] = {
        count: 0,
        blueprint: orderItem.blueprint,
      };
    }
    
    orderItemsMap[orderItem.blueprint_id].count += orderItem.count;
  });

  for (const [blueprint_id, values] of Object.entries(orderItemsMap)) {
    allOrderItems.push({
      blueprint_id: blueprint_id,
      blueprint: orderItemsMap[blueprint_id].blueprint,
      count: orderItemsMap[blueprint_id].count,
      values: values,
    });
  }
  return allOrderItems;
};

export const mapOrderItemFulfillsByBlueprints = (orderItemsFulfills) => {
  const orderItemsMap = {};
  const mappedOrderItemsFulfills = [];

  orderItemsFulfills.forEach(orderItem => {
    if (!orderItemsMap[orderItem.blueprint_id]) {
      orderItemsMap[orderItem.blueprint_id] = {
        count: 0,
        blueprint: orderItem.blueprint,
        packs: orderItem?.packs,
      };
    }
    
    orderItemsMap[orderItem.blueprint_id].count += orderItem.count;
  });

  for (const [blueprint_id, values] of Object.entries(orderItemsMap)) {
    mappedOrderItemsFulfills.push({
      blueprint_id: blueprint_id,
      blueprint: orderItemsMap[blueprint_id].blueprint,
      count: orderItemsMap[blueprint_id].count,
      packs: orderItemsMap[blueprint_id].packs,
      values: values,
    });
  }
  return { 
    orderItemsMap: orderItemsMap,
    mappedOrderItemsFulfills: mappedOrderItemsFulfills,
  };
};

export const sortBlueprintsByClassNames = blueprints => {
  console.log(blueprints);
  blueprints.sort((a, b) => {
    const nameA = a.product_class.name;
    const nameB = b.product_class.name;

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });
  
  return blueprints;
};

export const sortBlueprintsByActualSizes = blueprints => {
  blueprints.sort((a, b) => a.product_size.z_mm - b.product_size.z_mm);
  blueprints.sort((a, b) => a.product_size.y_mm - b.product_size.y_mm);
  return blueprints;
};

export const sortInvBlueprintsByActualSizes = warehouseItems => {
  warehouseItems.sort((a, b) => a.blueprint.product_size.z_mm - b.blueprint.product_size.z_mm);
  warehouseItems.sort((a, b) => a.blueprint.product_size.y_mm - b.blueprint.product_size.y_mm);
  return warehouseItems;
};

export const ltBlockStatus = status => {
  const ltStatus = {
    drying: "Džiovinamas",
    queue: "Eilėje",
    wip: "Pjaustomas",
    done: "Baigtas",
    void: "Negaliojantis",
  };
  return ltStatus[status];
};

export const ltOrderStatus = status => {
  const ltStatus = {
    open: "Eilėje",
    wip: "Vykdomas",
    done: "Įvykdytas",
    void: "Negaliojantis",
  };
  return ltStatus[status];
};

export const ltEnabled = status => {
  const ltStatus = {
    true: "Aktyvus",
    false: "Paslėptas",
  };
  return ltStatus[status];
};

export const groupByKey = (array, key) => {
  return array.reduce(
    (hash, obj) => {
      if(obj[key] === undefined) return hash; 
      return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {}
  );
};

export const billPaymentsDue = (bill) => {
  const billDate = bill.bill_date;
  const orderDate = bill.order.delivery_date;
  const newDate = new Date();
  const daysPostponed = bill.days_postponed;

  const payDay = new Date(((new Date((billDate ? billDate : (orderDate ? orderDate : newDate)).toLocaleString('lt-LT', { year: 'numeric', month: 'numeric', day: 'numeric' }))).getTime() + daysPostponed * 86400000)).toLocaleString('lt-LT').split(' ')[0];
  return payDay;
};

export const totalAmountPayments = payments => {
  let paymentsTotalAmount = 0;
  if (!payments) return paymentsTotalAmount;
  if (!payments.length) return paymentsTotalAmount;
  if (payments.length == 0) return paymentsTotalAmount;

  for (let indexPayment = 0; indexPayment < payments.length; indexPayment++) {
    const payment = payments[indexPayment];
    paymentsTotalAmount += parseFloat(payment.amount.toString(10));
  }

  return roundNumber(paymentsTotalAmount);
};

export const totalAmountBills = bills => {
  let billsTotalPaymentAmount = 0;
  if (!bills) return billsTotalPaymentAmount;
  if (!bills.length) return billsTotalPaymentAmount;
  if (bills.length == 0) return billsTotalPaymentAmount;

  for (let indexBill = 0; indexBill < bills.length; indexBill++) {
    const bill = bills[indexBill];
    const payments = bill.bill_payments;
    
    const billPaymentsTotal = totalAmountPayments(payments);
    billsTotalPaymentAmount += roundNumber(billPaymentsTotal);
  }

  return  roundNumber(billsTotalPaymentAmount);
};

export const roundNumberScaleTwo = (numberValue) => {
  numberValue = parseFloat(numberValue.toString())
  return Math.round(numberValue * 100) / 100;
};

export const amountProductBillItemsTotal = (bill) => {
  let amountProductTotalPrice = 0;

  const billItems = bill.bill_items;
  const priceList = bill.price_list;
  
  if (!billItems || !priceList) return amountProductTotalPrice;
  if (billItems.length == 0 || priceList.prices.length == 0) return amountProductTotalPrice;

  for (let indexBillItem = 0; indexBillItem < billItems.length; indexBillItem++) {
    const billItem = billItems[indexBillItem];
    const blueprint = billItem.blueprint;
    const size = [blueprint.product_size.x_mm, blueprint.product_size.y_mm, blueprint.product_size.z_mm];
    const count = billItem.count;
    const mmVolumeUnit = size[0] * size[1] * size[2];
    const mVolumeUnit = mmVolumeUnit / 1000000000;
    const mVolumeProductTotal = mVolumeUnit * count;
    const productClassPrice = priceList.prices.find(price => price.product_class_id == blueprint.product_class_id);
    const amountCostTotal = productClassPrice.amount * mVolumeProductTotal;    
    amountProductTotalPrice += amountCostTotal;
  }
    
  return Math.round(((amountProductTotalPrice*21/100)+(amountProductTotalPrice)) * 100) / 100;
};

export const amountProductOrderBillsItemsTotal = bills => {
  if (!bills) return 0;
  if (bills.length == 0) return 0;
  
  let amountOrderBillsTotal = 0;

  for (let indexBill = 0; indexBill < bills.length; indexBill++) {
    const bill = bills[indexBill];
    amountOrderBillsTotal += amountProductBillItemsTotal(bill);
  }

  return amountOrderBillsTotal;
};
