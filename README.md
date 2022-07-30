# EPS100 Back-End
Application is based on ` Node.js ` + ` Nest.js `
<br>

The Project as well features `TypeORM` + `MySQL`

### Project Setup

```
npm i

npm run start:dev
```
------------------
### To-Do:
<br>

* Full Features List
* Screenshots
------------------

<table>

<thead>
<tr>
<th>
<h1> Repositories (Entities) </h1>
<br>

</th>
<th>
<h1> Services </h1>
<br>

</th>
<th>
<h1> Controllers </h1>
<br>

</th>
</tr>
</thead>

<tbody>
<tr>
<td> 

``` Javascript
                           
config.entities = [
  User,
  Worker,
  ProductClass,
  Block,
  ProductSize,
  Blueprint,
  BlockCut,
  BlockMultiCut, 
  WarehouseItem,
  Client,
  Order,
  OrderItem,
  OrderItemFulfill,
  Transport,
  Transfer,
  TransferItem,
  PriceList,
  Price,
  Bill,
  BillItem,
  BillPayment,
];

``` 

</td>
<td> 

``` Javascript
                                     
providers: [
    AppService,
    UsersService,
    JwtService,
    AuthService,
    TasksService,
    WorkersService,
    ProductClassService,
    BlocksService,
    ProductSizesService,
    BlueprintsService,
    WarehouseItemsService,
    ClientsService,
    OrdersService,
    OrderItemsService,
    TransportsService,
    TransfersService,
    TransferItemsService,
    PricesService,
    PriceListsService,
    BillsService,
    BillItemsService,
  ],

``` 

</td>
<td> 

``` Javascript



                                     
controllers: [
    AppController,
    WorkersController,
    ProductClassController,
    BlocksController,
    ProductSizesController,
    BlueprintsController,
    WarehouseItemsController,
    ClientsController,
    OrdersController,
    OrderItemsController,
    TransportsController,
    TransferItemsController,
    TransfersController,
    PriceListsController,
    PricesController,
    BillsController,
    BillItemsController,
  ],






``` 

</td>
</tr>
</tbody>

</table>

------------------
### Features
<br>

* Auto-Dry Blocks Every Hour - `TasksService` `Cron` Job - `@Cron('0 0 * * * *')`
------------------
### API Example (Vue.js)
<br>

``` Javascript

import axios from "axios";

export const http = axios.create({});

// -----------------------------------------------------------------------------
//
// Auth API
//
// -----------------------------------------------------------------------------

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return {
      Authorization: "Bearer " + user,
    };
  }
  return {};
};

export const loginAuth = (data) => {
  return http.post("/api/auth/login", data);
};

// -----------------------------------------------------------------------------
//
// Blocks API
//
// -----------------------------------------------------------------------------

export const fetchBlocks = () => {
  return http.get("/api/blocks", { headers: authHeader() });
};

export const fetchBlock = (id) => {
  return http.get("/api/blocks/" + id, { headers: authHeader() });
};

export const fetchNewBlockId = () => {
  return http.get("/api/blocks/new", { headers: authHeader() });
};

export const createBlock = (data) => {
  return http.post("/api/blocks/new", data, { headers: authHeader() });
};

export const createBlockMultiCut = (data) => {
  return http.post("/api/blocks/multi-cut", data, { headers: authHeader() });
};

export const updateBlock = (id, data) => {
  return http.post("/api/blocks/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const processBlock = (id, data) => {
  return http.post("/api/blocks/" + id + "/process", data, {
    headers: authHeader(),
  });
};

export const deleteBlock = (id) => {
  return http.delete("/api/blocks/" + id, { headers: authHeader() });
};

export const fetchBlocksByClass = (id) => {
  return http.get("/api/blocks/by-class/" + id, { headers: authHeader() });
};

export const fetchBlocksByClassDrying = (id) => {
  return http.get("/api/blocks/by-class-drying/" + id, {
    headers: authHeader(),
  });
};

export const fetchBlocksByClassQueue = (id) => {
  return http.get("/api/blocks/by-class-queue/" + id, {
    headers: authHeader(),
  });
};

export const fetchBlocksByWorker = (id) => {
  return http.get("/api/blocks/by-worker/" + id, { headers: authHeader() });
};

export const fetchBlocksByStatus = (status) => {
  return http.get("/api/blocks/by-status/" + status, { headers: authHeader() });
};

export const fetchBlockCutsByBlock = (id) => {
  return http.get("/api/blocks/cuts-by-block/" + id, { headers: authHeader() });
};

export const fetchBlockCutsByWorker = (id) => {
  return http.get("/api/blocks/cuts-by-worker/" + id, {
    headers: authHeader(),
  });
};

export const fetchBlockMultiCutsByBlock = (id) => {
  return http.get("/api/blocks/multi-cut-by-block/" + id, {
    headers: authHeader(),
  });
};

export const fetchBlockMultiCutsByWorker = (id) => {
  return http.get("/api/blocks/multi-cuts-by-worker/" + id, {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// Blueprints API
//
// -----------------------------------------------------------------------------

export const fetchBlueprints = () => {
  return http.get("/api/blueprints", { headers: authHeader() });
};

export const fetchBlueprint = (id) => {
  return http.get("/api/blueprints/" + id, { headers: authHeader() });
};

export const createBlueprint = (data) => {
  return http.post("/api/blueprints/new", data, { headers: authHeader() });
};

export const updateBlueprint = (id, data) => {
  return http.post("/api/blueprints/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteBlueprint = (id) => {
  return http.delete("/api/blueprints/" + id, { headers: authHeader() });
};

export const fetchBlueprintsByClass = (id) => {
  return http.get("/api/blueprints/by-class/" + id, { headers: authHeader() });
};

export const fetchBlueprintsBySize = (id) => {
  return http.get("/api/blueprints/by-size/" + id, { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Clients API
//
// -----------------------------------------------------------------------------

export const fetchClients = () => {
  return http.get("/api/clients", { headers: authHeader() });
};

export const fetchClient = (id) => {
  return http.get("/api/clients/" + id, { headers: authHeader() });
};

export const createClient = (data) => {
  return http.post("/api/clients/new", data, { headers: authHeader() });
};

export const updateClient = (id, data) => {
  return http.post("/api/clients/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteClient = (id) => {
  return http.delete("/api/clients/" + id, { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Order Items API
//
// -----------------------------------------------------------------------------

export const fetchOrderItems = () => {
  return http.get("/api/order-items", { headers: authHeader() });
};

export const fetchOrderItem = (id) => {
  return http.get("/api/order-items/" + id, { headers: authHeader() });
};

export const createOrderItem = (data) => {
  return http.post("/api/order-items/new", data, { headers: authHeader() });
};

export const updateOrderItem = (id, data) => {
  return http.post("/api/order-items/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteOrderItem = (id) => {
  return http.delete("/api/order-items/" + id, { headers: authHeader() });
};

export const fetchOrderItemsByBlueprint = (id) => {
  return http.get("/api/order-items/by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchWIPOrderItemsByBlueprint = (id) => {
  return http.get("/api/order-items/wip-by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchOrderItemsByOrder = (id) => {
  return http.get("/api/order-items/by-order/" + id, { headers: authHeader() });
};

export const fetchOrderItemFulfillsByOrder = (id) => {
  return http.get("/api/order-items/by-order/" + id + "/fulfilled", {
    headers: authHeader(),
  });
};

export const fetchOrderItemsForBillByOrder = (id) => {
  return http.get("/api/order-items/by-order/" + id + "/for-bill", {
    headers: authHeader(),
  });
};

export const fetchOrderItemFulfillsByOrderItem = (id) => {
  return http.get("/api/order-items/by-order-item/" + id + "/fulfilled", {
    headers: authHeader(),
  });
};

export const fetchOrderItemsWithFulfillsByBlueprint = (id) => {
  return http.get("/api/order-items/by-blueprint/" + id + "/with-fulfills", {
    headers: authHeader(),
  });
};

export const fetchOrderItemsByClass = (id) => {
  return http.get("/api/order-items/by-class/" + id, { headers: authHeader() });
};

export const fetchOrderItemsWIPByClass = (id) => {
  return http.get("/api/order-items/by-class/" + id + "/wip", {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// Orders API
//
// -----------------------------------------------------------------------------

export const fetchOrders = () => {
  return http.get("/api/orders", { headers: authHeader() });
};

export const fetchOrder = (id) => {
  return http.get("/api/orders/" + id, { headers: authHeader() });
};

export const fetchOrderItemMap = (id) => {
  return http.get("/api/orders/" + id + "/order-item-map", {
    headers: authHeader(),
  });
};

export const createOrder = (data) => {
  return http.post("/api/orders/new", data, { headers: authHeader() });
};

export const orderCreateInvoice = (id, data) => {
  return http.post("/api/orders/" + id + "/invoice", data, {
    headers: authHeader(),
  });
};

export const updateOrder = (id, data) => {
  return http.post("/api/orders/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const fulfillOrder = (id, data) => {
  return http.post("/api/orders/" + id + "/fulfill", data, {
    headers: authHeader(),
  });
};

export const deleteOrder = (id) => {
  return http.delete("/api/orders/" + id, { headers: authHeader() });
};

export const fetchOrdersByStatus = (status) => {
  return http.get("/api/orders/by-status/" + status, { headers: authHeader() });
};

export const fetchOrdersByPriceList = (id) => {
  return http.get("/api/orders/by-price-list/" + id, { headers: authHeader() });
};

export const fetchOrdersByClient = (id) => {
  return http.get("/api/orders/by-client/" + id, { headers: authHeader() });
};

export const fetchOrdersByClientOpen = (id) => {
  return http.get("/api/orders/by-client/" + id + "/open", {
    headers: authHeader(),
  });
};

export const fetchOrdersByClientWIP = (id) => {
  return http.get("/api/orders/by-client/" + id + "/wip", {
    headers: authHeader(),
  });
};

export const fetchOrdersByTransport = (id) => {
  return http.get("/api/orders/by-transport/" + id, { headers: authHeader() });
};

export const fetchNewOrderId = () => {
  return http.get("/api/orders/new", { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Product Classes API
//
// -----------------------------------------------------------------------------

export const fetchProductClasses = () => {
  return http.get("/api/product-classes", { headers: authHeader() });
};

export const fetchProductClass = (id) => {
  return http.get("/api/product-classes/" + id, { headers: authHeader() });
};

export const createProductClass = (data) => {
  return http.post("/api/product-classes/new", data, { headers: authHeader() });
};

export const updateProductClass = (id, data) => {
  return http.post("/api/product-classes/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteProductClass = (id) => {
  return http.delete("/api/product-classes/" + id, { headers: authHeader() });
};

export const fetchProductClassByName = (name) => {
  return http.get("/api/product-classes/by-name/" + name, {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// Product Sizes API
//
// -----------------------------------------------------------------------------

export const fetchProductSizes = () => {
  return http.get("/api/product-sizes", { headers: authHeader() });
};

export const fetchProductSize = (id) => {
  return http.get("/api/product-sizes/" + id, { headers: authHeader() });
};

export const createProductSize = (data) => {
  return http.post("/api/product-sizes/new", data, { headers: authHeader() });
};

export const updateProductSize = (id, data) => {
  return http.post("/api/product-sizes/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteProductSize = (id) => {
  return http.delete("/api/product-sizes/" + id, { headers: authHeader() });
};

export const fetchProductClassBySize = (size) => {
  return http.get("/api/product-sizes/by-size/" + size, {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// Transfers API
//
// -----------------------------------------------------------------------------

export const fetchTransfers = () => {
  return http.get("/api/transfers", { headers: authHeader() });
};

export const fetchTransferNewId = () => {
  return http.get("/api/transfers/new", { headers: authHeader() });
};

export const fetchTransfer = (id) => {
  return http.get("/api/transfers/" + id, { headers: authHeader() });
};

export const createTransfer = (data) => {
  return http.post("/api/transfers/new", data, { headers: authHeader() });
};

export const updateTransfer = (id, data) => {
  return http.post("/api/transfers/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteTransfer = (id) => {
  return http.delete("/api/transfers/" + id, { headers: authHeader() });
};

export const fetchTransfersByStatus = (status) => {
  return http.get("/api/transfers/by-status/" + status, {
    headers: authHeader(),
  });
};

export const fetchTransfersByClient = (id) => {
  return http.get("/api/transfers/by-client/" + id, { headers: authHeader() });
};

export const fetchTransfersByWorker = (id) => {
  return http.get("/api/transfers/by-worker/" + id, { headers: authHeader() });
};

export const fetchTransfersByOrder = (id) => {
  return http.get("/api/transfers/by-order/" + id, { headers: authHeader() });
};

export const fetchTransfersByClientOpen = (id) => {
  return http.get("/api/transfers/by-client/" + id + "/open", {
    headers: authHeader(),
  });
};

export const fetchTransfersByClientWIP = (id) => {
  return http.get("/api/transfers/by-client/" + id + "/wip", {
    headers: authHeader(),
  });
};

export const fetchTransfersByTransport = (id) => {
  return http.get("/api/transfers/by-transport/" + id, {
    headers: authHeader(),
  });
};

export const fetchNewTransferId = () => {
  return http.get("/api/transfers/new", { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Transfer Items API
//
// -----------------------------------------------------------------------------

export const fetchTransferItems = () => {
  return http.get("/api/transfer-items", { headers: authHeader() });
};

export const fetchTransferItem = (id) => {
  return http.get("/api/transfer-items/" + id, { headers: authHeader() });
};

export const createTransferItem = (data) => {
  return http.post("/api/transfer-items/new", data, { headers: authHeader() });
};

export const updateTransferItem = (id, data) => {
  return http.post("/api/transfer-items/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteTransferItem = (id) => {
  return http.delete("/api/transfer-items/" + id, { headers: authHeader() });
};

export const fetchTransferItemsByBlueprint = (id) => {
  return http.get("/api/transfer-items/by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchWIPTransferItemsByBlueprint = (id) => {
  return http.get("/api/transfer-items/wip-by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchTransferItemsByTransfer = (id) => {
  return http.get("/api/transfer-items/by-transfer/" + id, {
    headers: authHeader(),
  });
};

export const fetchTransferItemsByClass = (id) => {
  return http.get("/api/transfer-items/by-class/" + id, {
    headers: authHeader(),
  });
};

export const fetchTransferItemsWIPByClass = (id) => {
  return http.get("/api/transfer-items/by-class/" + id + "/wip", {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// Transports API
//
// -----------------------------------------------------------------------------

export const fetchTransports = () => {
  return http.get("/api/transports", { headers: authHeader() });
};

export const fetchTransport = (id) => {
  return http.get("/api/transports/" + id, { headers: authHeader() });
};

export const createTransport = (data) => {
  return http.post("/api/transports/new", data, { headers: authHeader() });
};

export const updateTransport = (id, data) => {
  return http.post("/api/transports/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteTransport = (id) => {
  return http.delete("/api/transports/" + id, { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Warehouse Items API
//
// -----------------------------------------------------------------------------

export const fetchInventory = () => {
  return http.get("/api/warehouse-items/inventory", { headers: authHeader() });
};

export const fetchClassInventory = (id) => {
  return http.get("/api/warehouse-items/inventory/by-class/" + id, {
    headers: authHeader(),
  });
};

export const fetchWarehouseItems = () => {
  return http.get("/api/warehouse-items", { headers: authHeader() });
};

export const fetchWarehouseItem = (id) => {
  return http.get("/api/warehouse-items/" + id, { headers: authHeader() });
};

export const createWarehouseItem = (data) => {
  return http.post("/api/warehouse-items/new", data, { headers: authHeader() });
};

export const updateWarehouseItem = (id, data) => {
  return http.post("/api/warehouse-items/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteWarehouseItem = (id) => {
  return http.delete("/api/warehouse-items/" + id, { headers: authHeader() });
};

export const fetchWarehouseItemsByWorker = (id) => {
  return http.get("/api/warehouse-items/by-worker/" + id, {
    headers: authHeader(),
  });
};

export const fetchWarehouseItemsByBlock = (id) => {
  return http.get("/api/warehouse-items/by-block/" + id, {
    headers: authHeader(),
  });
};

export const fetchWarehouseItemsByBlueprint = (id) => {
  return http.get("/api/warehouse-items/by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchWarehouseItemsByClass = (id) => {
  return http.get("/api/warehouse-items/by-class/" + id, {
    headers: authHeader(),
  });
};

export const fetchWHItemsByWHItemBlueprint = (id) => {
  return http.get("/api/warehouse-items/" + id + "/blueprint", {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// Workers API
//
// -----------------------------------------------------------------------------

export const fetchWorkers = () => {
  return http.get("/api/workers", { headers: authHeader() });
};

export const fetchWorker = (id) => {
  return http.get("/api/workers/" + id, { headers: authHeader() });
};

export const createWorker = (data) => {
  return http.post("/api/workers/new", data, { headers: authHeader() });
};

export const updateWorker = (id, data) => {
  return http.post("/api/workers/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteWorker = (id) => {
  return http.delete("/api/workers/" + id, { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Bills API
//
// -----------------------------------------------------------------------------

export const fetchBills = () => {
  return http.get("/api/bills", { headers: authHeader() });
};

export const fetchBillNewId = () => {
  return http.get("/api/bills/new", { headers: authHeader() });
};

export const fetchBill = (id) => {
  return http.get("/api/bills/" + id, { headers: authHeader() });
};

export const createBill = (data) => {
  return http.post("/api/bills/new", data, { headers: authHeader() });
};

export const updateBill = (id, data) => {
  return http.post("/api/bills/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteBill = (id) => {
  return http.delete("/api/bills/" + id, { headers: authHeader() });
};

export const fetchBillsByStatus = (status) => {
  return http.get("/api/bills/by-status/" + status, { headers: authHeader() });
};

export const fetchBillsByPriceList = (id) => {
  return http.get("/api/bills/by-price-list/" + id, { headers: authHeader() });
};

export const fetchBillsByClient = (id) => {
  return http.get("/api/bills/by-client/" + id, { headers: authHeader() });
};

export const fetchBillsByOrder = (id) => {
  return http.get("/api/bills/by-order/" + id, { headers: authHeader() });
};

export const fetchBillsByClientOrderOpen = (id) => {
  return http.get("/api/bills/by-client/" + id + "/open", {
    headers: authHeader(),
  });
};

export const fetchBillsByClientOrderWIP = (id) => {
  return http.get("/api/bills/by-client/" + id + "/wip", {
    headers: authHeader(),
  });
};

export const fetchBillsByClientOrderDone = (id) => {
  return http.get("/api/bills/by-client/" + id + "/done", {
    headers: authHeader(),
  });
};

export const fetchNewBillId = () => {
  return http.get("/api/bills/new", { headers: authHeader() });
};

export const fetchBillPayment = (id) => {
  return http.get("/api/bills/payment/" + id, { headers: authHeader() });
};

export const fetchBillPaymentsByBill = (id) => {
  return http.get("/api/bills/payments-by-bill/" + id, {
    headers: authHeader(),
  });
};

export const fetchBillPaymentsByOrder = (id) => {
  return http.get("/api/bills/payments-by-order/" + id, {
    headers: authHeader(),
  });
};

export const fetchBillPaymentsByClient = (id) => {
  return http.get("/api/bills/payments-by-client/" + id, {
    headers: authHeader(),
  });
};

export const createBillPayment = (data) => {
  return http.post("/api/bills/payment", data, { headers: authHeader() });
};

export const updateBillPayment = (id, data) => {
  return http.post("/api/bills/payment/" + id, data, { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Bill Items API
//
// -----------------------------------------------------------------------------

export const fetchBillItems = () => {
  return http.get("/api/bill-items", { headers: authHeader() });
};

export const fetchBillItem = (id) => {
  return http.get("/api/bill-items/" + id, { headers: authHeader() });
};

export const createBillItem = (data) => {
  return http.post("/api/bill-items/new", data, { headers: authHeader() });
};

export const updateBillItem = (id, data) => {
  return http.post("/api/bill-items/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deleteBillItem = (id) => {
  return http.delete("/api/bill-items/" + id, { headers: authHeader() });
};

export const fetchBillItemsByBlueprint = (id) => {
  return http.get("/api/bill-items/by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchWIPBillItemsByBlueprint = (id) => {
  return http.get("/api/bill-items/wip-by-blueprint/" + id, {
    headers: authHeader(),
  });
};

export const fetchBillItemsByBill = (id) => {
  return http.get("/api/bill-items/by-bill/" + id, { headers: authHeader() });
};

export const fetchBillItemsByClass = (id) => {
  return http.get("/api/bill-items/by-class/" + id, { headers: authHeader() });
};

export const fetchBillItemsWIPByClass = (id) => {
  return http.get("/api/bill-items/by-class/" + id + "/wip", {
    headers: authHeader(),
  });
};

// -----------------------------------------------------------------------------
//
// PriceLists API
//
// -----------------------------------------------------------------------------

export const fetchPriceLists = () => {
  return http.get("/api/price-lists", { headers: authHeader() });
};

export const fetchPriceListNewId = () => {
  return http.get("/api/price-lists/new", { headers: authHeader() });
};

export const fetchPriceList = (id) => {
  return http.get("/api/price-lists/" + id, { headers: authHeader() });
};

export const createPriceList = (data) => {
  return http.post("/api/price-lists/new", data, { headers: authHeader() });
};

export const updatePriceList = (id, data) => {
  return http.post("/api/price-lists/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deletePriceList = (id) => {
  return http.delete("/api/price-lists/" + id, { headers: authHeader() });
};

export const fetchPriceListsByBill = (id) => {
  return http.get("/api/price-lists/by-bill/" + id, { headers: authHeader() });
};

export const fetchPriceListsByOrder = (id) => {
  return http.get("/api/price-lists/by-order/" + id, { headers: authHeader() });
};

export const fetchPriceListsWithPrice = (id) => {
  return http.get("/api/price-lists/by-price/" + id, { headers: authHeader() });
};

export const fetchPriceListsEnabled = () => {
  return http.get("/api/price-lists/enabled/", { headers: authHeader() });
};

// -----------------------------------------------------------------------------
//
// Prices API
//
// -----------------------------------------------------------------------------

export const fetchPrices = () => {
  return http.get("/api/prices", { headers: authHeader() });
};

export const fetchPrice = (id) => {
  return http.get("/api/prices/" + id, { headers: authHeader() });
};

export const createPrice = (data) => {
  return http.post("/api/prices/new", data, { headers: authHeader() });
};

export const updatePrice = (id, data) => {
  return http.post("/api/prices/" + id + "/edit", data, {
    headers: authHeader(),
  });
};

export const deletePrice = (id) => {
  return http.delete("/api/prices/" + id, { headers: authHeader() });
};

export const fetchPricesByBill = (id) => {
  return http.get("/api/prices/by-bill/" + id, { headers: authHeader() });
};

export const fetchPricesByOrder = (id) => {
  return http.get("/api/prices/by-order/" + id, { headers: authHeader() });
};

export const fetchPricesByPriceList = (id) => {
  return http.get("/api/prices/by-price-list/" + id, { headers: authHeader() });
};


```
