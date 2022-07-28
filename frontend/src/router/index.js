import { createRouter, createWebHashHistory } from 'vue-router';

import BlockEdit from '@/pages/BlockEdit';
import BlockList from '@/pages/BlockList';
import BlockProcess from '@/pages/BlockProcess';
import BlockMultiCut from '@/pages/BlockMultiCut';
import BlockNew from '@/pages/BlockNew';
import BlockDetails from '@/pages/BlockDetails';
import OrderList from '@/pages/OrderList';
import OrderNew from '@/pages/OrderNew';
import OrderEdit from '@/pages/OrderEdit';
import OrderBill from '@/pages/OrderBill';
import OrderBillEdit from '@/pages/OrderBillEdit'; 
import OrderBillList from '@/pages/OrderBillList';
import OrderBillDetails from '@/pages/OrderBillDetails';
import BillPayment from '@/pages/BillPayment';
import BillPaymentEdit from '@/pages/BillPaymentEdit';
import PricesList from '@/pages/PricesList';
import PriceListNew from '@/pages/PriceListNew';
import PriceListEdit from '@/pages/PriceListEdit';
import PriceListDetails from '@/pages/PriceListDetails';
import OrderInvoice from '@/pages/OrderInvoice';
import OrderInvoiceEdit from '@/pages/OrderInvoiceEdit';
import OrderInvoiceList from '@/pages/OrderInvoiceList';
import OrderFulfill from '@/pages/OrderFulfill';
import OrderDetails from '@/pages/OrderDetails';
import ClientList from '@/pages/ClientList';
import ClientEdit from '@/pages/ClientEdit';
import ClientDetails from '@/pages/ClientDetails';
import ClientNew from '@/pages/ClientNew';
import InventoryClassBlueprintsList from '@/pages/InventoryClassBlueprintsList';
import InventoryClassList from '@/pages/InventoryClassList';
import InventoryDetails from '@/pages/InventoryDetails';
import ProductDetails from '@/pages/ProductDetails';   
import ProductList from '@/pages/ProductList';
import ProductClassDetailsList from '@/pages/ProductClassDetailsList';
import ProductSizeDetailsList from '@/pages/ProductSizeDetailsList';
import ProductClassList from '@/pages/ProductClassList';
import ProductSizesList from '@/pages/ProductSizesList';
import ProductNew from '@/pages/ProductNew';
import ProductNewClass from '@/pages/ProductNewClass';
import ProductNewSize from '@/pages/ProductNewSize';
import WorkerList from '@/pages/WorkerList';
import WorkerEdit from '@/pages/WorkerEdit';
import WorkerNew from '@/pages/WorkerNew';
import WorkerDetails from '@/pages/WorkerDetails';
import TransportList from '@/pages/TransportList';
import TransportEdit from '@/pages/TransportEdit';
import TransportNew from '@/pages/TransportNew';
import TransportDetails from '@/pages/TransportDetails';
import Login from '@/pages/Login';

const routes = [
  {
    path: '/',
    component: Login,
    name: 'login',
  },
  {
    path: '/home',
    component: BlockList,
    name: 'home',
  },
  {
    path: '/blocks',
    component: BlockList,
    name: 'blockList',
  },
  {
    path: '/blocks/new',
    component: BlockNew,
    name: 'blockNew',
  },
  {
    path: '/blocks/:id/details',
    component: BlockDetails,
    name: 'blockDetails',
    props: true,
  },
  {
    path: '/blocks/:id/process',
    component: BlockProcess,
    name: 'blockProcess',
    props: true,
  },
  {
    path: '/blocks/multi-cut',
    component: BlockMultiCut,
    name: 'blockMultiCut',
  },
  {
    path: '/blocks/:id/edit',
    component: BlockEdit,
    name: 'blockEdit',
    props: true,
  },
  {
    path: '/orders',
    component: OrderList,
    name: 'orderList',
  },
  {
    path: '/orders/new',
    component: OrderNew,
    name: 'orderNew',
  },
  {
    path: '/orders/:id/edit',
    component: OrderEdit,
    name: 'orderEdit',
    props: true,
  },
  {
    path: '/orders/:id/bill',
    component: OrderBill,
    name: 'orderBill',
    props: true,
  },
  {
    path: '/bills/:id/edit',
    component: OrderBillEdit,
    name: 'orderBillEdit',
    props: true,
  },
  {
    path: '/bills/:id/details',
    component: OrderBillDetails,
    name: 'orderBillDetails',
    props: true,
  },
  {
    path: '/bills/:id/payment',
    component: BillPayment,
    name: 'billPayment',
    props: true,
  },
  {
    path: '/bills/payment/:id',
    component: BillPaymentEdit,
    name: 'billPaymentEdit',
    props: true,
  },
  {
    path: '/bills',
    component: OrderBillList,
    name: 'orderBillList',
  },
  {
    path: '/price-lists',
    component: PricesList,
    name: 'pricesList',
  },
  {
    path: '/price-lists/new',
    component: PriceListNew,
    name: 'priceListNew',
  },
  {
    path: '/price-lists/:id/edit',
    component: PriceListEdit,
    name: 'priceListEdit',
    props: true,
  },
  {
    path: '/price-lists/:id/details',
    component: PriceListDetails,
    name: 'priceListDetails',
    props: true,
  },
  {
    path: '/orders/:id/invoice',
    component: OrderInvoice,
    name: 'orderInvoice',
    props: true,
  },
  {
    path: '/transfers/:id/edit',
    component: OrderInvoiceEdit,
    name: 'orderInvoiceEdit',
    props: true,
  },
  {
    path: '/transfers',
    component: OrderInvoiceList,
    name: 'orderInvoiceList',
  },
  {
    path: '/orders/:id/fulfill',
    component: OrderFulfill,
    name: 'orderFulfill',
    props: true,
  },
  {
    path: '/orders/:id/details',
    component: OrderDetails,
    name: 'orderDetails',
    props: true,
  },
  {
    path: '/clients',
    component: ClientList,
    name: 'clientList',
  },
  {
    path: '/clients/new',
    component: ClientNew,
    name: 'clientNew',
  },
  {
    path: '/clients/:id/details',
    component: ClientDetails,
    name: 'clientDetails',
    props: true,
  },
  {
    path: '/clients/:id/edit',
    component: ClientEdit,
    name: 'clientEdit',
    props: true,
  },
  {
    path: '/inventory',
    component: InventoryClassList,
    name: 'inventoryClassList',
  },
  {
    path: '/inventory/:id/blueprints',
    component: InventoryClassBlueprintsList,
    name: 'inventoryClassBlueprintsList',
    props: true,
  },
  {
    path: '/inventory/:id/details',
    component: InventoryDetails,
    name: 'inventoryDetails',
    props: true,
  },
  {
    path: '/products',
    component: ProductList,
    name: 'productList',
  },
  {
    path: '/products/classes',
    component: ProductClassList,
    name: 'productClassList',
  },
  {
    path: '/products/sizes',
    component: ProductSizesList,
    name: 'productSizesList',
  },
  {
    path: '/products/new',
    component: ProductNew,
    name: 'productNew',
  },
  {
    path: '/products/new-class',
    component: ProductNewClass,
    name: 'productNewClass',
  },
  {
    path: '/products/new-size',
    component: ProductNewSize,
    name: 'productNewSize',
  },
  {
    path: '/products/:id/details',
    component: ProductDetails,
    name: 'productDetails',
    props: true,
  },
  {
    path: '/class/:id/details',
    component: ProductClassDetailsList,
    name: 'productClassDetailsList',
    props: true,
  },
  {
    path: '/size/:id/details',
    component: ProductSizeDetailsList,
    name: 'productSizeDetailsList',
    props: true,
  },
  {
    path: '/workers',
    component: WorkerList,
    name: 'workerList',
  },
  {
    path: '/workers/:id/edit',
    component: WorkerEdit,
    name: 'workerEdit',
    props: true
  },
  {
    path: '/workers/new',
    component: WorkerNew,
    name: 'workerNew',
  },
  {
    path: '/workers/:id/details',
    component: WorkerDetails,
    name: 'workerDetails',
    props: true
  },
  {
    path: '/transports',
    component: TransportList,
    name: 'transportList',
  },
  {
    path: '/transports/:id/edit',
    component: TransportEdit,
    name: 'transportEdit',
    props: true
  },
  {
    path: '/transports/new',
    component: TransportNew,
    name: 'transportNew',
  },
  {
    path: '/transports/:id/details',
    component: TransportDetails,
    name: 'transportDetails',
    props: true
  },
];

const router = createRouter({
  linkExactActiveClass: 'is-active',
  history: createWebHashHistory(),
  routes,
});

export default router;
