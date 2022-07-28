<template>
  <div class="container">
   <div class="block">
          <h1 class="is-size-3">Klientas {{ client.name }}</h1>
    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
      <div class="control">
                <router-link
                  :to="{ name: 'clientList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
        <div class="control">
              <router-link
                :to="{
                  name: 'clientEdit',
                  params: { id: this.id },
                }"
                class="button is-link"
                >Redaguoti</router-link
              >
        </div>
    </div>
    </div>
  </div>         
<tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
        <tab name="Informacija">
          <h3 class="is-size-3">Informacija</h3>
  <table class="table">
  <tr>
    <th>Pavadinimas</th>
    <th>Tel. Nr.</th>
    <th>El. Paštas</th>
    <th>Adresas</th>
  </tr>
  <tr>
    <td>{{ client.name }}</td>
    <td>{{ client.phone }}</td>
    <td>{{ client.email }}</td>
    <td>{{ client.address }} {{ client.postal_code }}, {{ client.city }}, {{ client.country }}</td>
  </tr>
  </table>
  <table class="table">
  <tr>
    <th>Įmonės kodas</th>
    <th>PVM mokėtojo kodas</th>
    <th>Banko pavadinimas</th>
    <th>Banko sąskaitos Nr</th>
  </tr>
  <tr>
    <td>{{ client.company_code }}</td>
    <td>{{ client.vat_code }}</td>
    <td>{{ client.banks_name }}</td>
    <td>{{ client.account_number }}</td>
  </tr>
  </table><br>
        </tab>
        <tab name="Užsakymai">
          <h3 class="is-size-3">Užsakymai:</h3>
          <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
            <tab name="Vykdomi">
          <div v-if="ordersInWIP.length != 0">
      <h3 class="is-size-4">Vykdomi užsakymai:</h3>
<data-table :rowsPerPage="10" :list="ordersInWIP" @dataSlice="data => this['data' + 'Wip'] = data">
  <template #head>
      <tr>
        <th>Užsakymo Nr.</th>
        <th>Užsakymo būklė</th>
        <th>Produktai</th>
        <th>Dydis (m3)</th>
        <th>Pristatymo data</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
        <tr v-for="order in dataWip" v-bind:key="order.order_id">
          <td><router-link
          :to="{ name: 'orderDetails', params: { id: order.order_id } }"
          class="tag is-light is-info"
          >{{ order.order_id }}</router-link
        ></td>
          <td>{{ ltOrderStatus(order.status) }}</td>
          <td><div class="tag">{{ mapOrderItemsByBlueprints(order) }}</div></td>
          <td><span class="tag is-light">{{ roundNumber(totalVolumeOrderItems(order.order_item_fulfills) + totalVolumeOrderItems(order.order_items)) }}</span></td>
          <td>{{ dateToLocaleDateString(order.delivery_date) }}</td>
          <td>
            <div class="field is-grouped">
              <div class="control">
                <router-link
                  :to="{
                    name: 'orderDetails',
                    params: { id: order.order_id },
                  }"
                  class="button is-light"
                  >Praplesti</router-link
                >
              </div>
            </div>
          </td>
        </tr>
</template>
</data-table>
    </div>
    </tab>
    <tab name="Eilėje">
           <div v-if="ordersInQueue.length != 0">
  <h3 class="is-size-4">Užsakymai eilėje:</h3>
<data-table :rowsPerPage="10" :list="ordersInQueue" @dataSlice="data => this['data' + 'Queue'] = data">
  <template #head>
      <tr>
        <th>Užsakymo Nr.</th>
        <th>Užsakymo būklė</th>
        <th>Produktai</th>
        <th>Dydis (m3)</th>
        <th>Pristatymo data</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
        <tr v-for="order in dataQueue" v-bind:key="order.order_id">
          <td><router-link
          :to="{ name: 'orderDetails', params: { id: order.order_id } }"
          class="tag is-light is-info"
          >{{ order.order_id }}</router-link
        ></td>
          <td>{{ ltOrderStatus(order.status) }}</td>
          <td><div class="tag">{{ mapOrderItemsByBlueprints(order) }}</div></td>
          <td><span class="tag is-light">{{ roundNumber(totalVolumeOrderItems(order.order_item_fulfills) + totalVolumeOrderItems(order.order_items)) }}</span></td>
          <td>{{ dateToLocaleDateString(order.delivery_date) }}</td>
          <td>
            <div class="field is-grouped">
              <div class="control">
                <router-link
                  :to="{
                    name: 'orderDetails',
                    params: { id: order.order_id },
                  }"
                  class="button is-light"
                  >Praplesti</router-link
                >
              </div>
            </div>
          </td>
        </tr>
</template>
</data-table>
    </div>
        </tab>
        <tab name="Visi">
          <h3 class="is-size-4">Visi užsakymai:</h3>
<data-table :rowsPerPage="10" :list="ordersAll" @dataSlice="data => this['data' + 'All'] = data">
  <template #head>
      <tr>
        <th>Užsakymo Nr.</th>
        <th>Užsakymo būklė</th>
        <th>Produktai</th>
        <th>Dydis (m3)</th>
        <th>Pristatymo data</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
        <tr v-for="order in dataAll" v-bind:key="order.order_id">
          <td><router-link
          :to="{ name: 'orderDetails', params: { id: order.order_id } }"
          class="tag is-light is-info"
          >{{ order.order_id }}</router-link
        ></td>
          <td>{{ ltOrderStatus(order.status) }}</td>
          <td><div class="tag">{{ mapOrderItemsByBlueprints(order) }}</div></td>
          <td><span class="tag is-light">{{ roundNumber(totalVolumeOrderItems(order.order_item_fulfills) + totalVolumeOrderItems(order.order_items)) }}</span></td>
          <td>{{ dateToLocaleDateString(order.delivery_date) }}</td>
          <td>
            <div class="field is-grouped">
              <div class="control">
                <router-link
                  :to="{
                    name: 'orderDetails',
                    params: { id: order.order_id },
                  }"
                  class="button is-light"
                  >Praplesti</router-link
                >
              </div>
            </div>
          </td>
        </tr>
</template>
</data-table>
</tab>
</tabs>
        </tab>
         <tab name="Sąskaitos">
          <div class="block">
      <h3 class="is-size-3">Sąskaitos</h3>
    </div>

    <div class="block">
      <data-table :rowsPerPage="10" :list="bills" @dataSlice="data => this['data' + 'Bills'] = data">
  <template #head>
          <tr>
            <th><label>Užsakymo&nbsp;Nr.,<br>Sąskaitos&nbsp;Nr.</label></th>
            <th><label>Klientas</label></th>
            <th><label>Dok. data</label></th>
            <th><label>Produktai</label></th>
            <th><label>Kiekis<br>(m3)</label></th>
            <th><label>Sąskaitos suma (Eur)</label></th> 
            <th><label>Mokėjimai (Eur)</label></th>   
            <th><label>Mokėjimų likutis<br>(Eur)</label></th>         
            <th><label>Veiksmai</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="bill in dataBills" v-bind:key="bill.bill_id">
            <td><router-link
          :to="{ name: 'orderDetails', params: { id: bill.order.order_id } }"
          class="tag is-light is-info"
          >{{ bill.order.order_id }}</router-link
        >
         - <router-link
          :to="{ name: 'orderBillDetails', params: { id: bill.bill_id } }"
          class="tag is-light is-primary"
          >{{ bill.bill_id }}</router-link
        ></td>
            <td>{{ bill.order.client.name }}</td>

            <td>{{ dateToLocaleDateString(bill.bill_date) }}</td>

            <td><div class="tag">{{ bill.bill_items.length }}</div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(totalVolumeOrderItems(bill.bill_items)*
                    1000,
                ) / 1000
              }}</span>
            </td>
            <td>
              <div style="text-align: right;">
              <span class="tag is-success is-light">
              {{ amountProductBillItemsTotal(bill) }}
              </span>
              </div>
            </td>
            <td>
              <span class="tag" 
              :class="{
                'is-danger is-light': 
                  totalAmountPayments(bill.bill_payments) == 0 && amountProductBillItemsTotal(bill) > 0,
                'is-warning': 
                  totalAmountPayments(bill.bill_payments) > 0 && totalAmountPayments(bill.bill_payments) < amountProductBillItemsTotal(bill),
                'is-warning is-light':
                  totalAmountPayments(bill.bill_payments) == 0 && amountProductBillItemsTotal(bill) == 0,
                'is-success':
                  totalAmountPayments(bill.bill_payments) >= amountProductBillItemsTotal(bill),
              }">
              {{ totalAmountPayments(bill.bill_payments) }}
              </span>
            </td>
            <td>
              <span class="tag" 
              :class="{
                'is-danger': 
                  totalAmountPayments(bill.bill_payments) == 0 && amountProductBillItemsTotal(bill) > 0,
                'is-warning': 
                  (totalAmountPayments(bill.bill_payments) > 0 && totalAmountPayments(bill.bill_payments) < amountProductBillItemsTotal(bill)) || totalAmountPayments(bill.bill_payments) > amountProductBillItemsTotal(bill),
                'is-warning is-light':
                  totalAmountPayments(bill.bill_payments) == 0 && amountProductBillItemsTotal(bill) == 0,
                'is-success is-light':
                  totalAmountPayments(bill.bill_payments) >= amountProductBillItemsTotal(bill),
              }">
              {{ roundNumberScaleTwo(amountProductBillItemsTotal(bill) - totalAmountPayments(bill.bill_payments)) }}
              </span>
            </td>
            <td>
              <div class="field is-grouped">
                <div class="control">
                  <router-link
                    :to="{ name: 'orderBillDetails', params: { id: bill.bill_id } }"
                    class="button is-light"
                    >Praplesti</router-link
                  >
                </div>
                <div class="control">
                  <button class="button is-light" @click="billing(bill.bill_id)">
                    Nuoroda
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </template>
</data-table>
    </div>
          </tab>
        </tabs>
    
<br>
  </div>
</template>

<script>
import { fetchBillsByClient, fetchClient, fetchOrdersByClientOpen, fetchOrdersByClientWIP } from '@/lib/api';
import { totalAmountPayments, roundNumberScaleTwo, amountProductBillItemsTotal, dateToLocaleDateString, totalVolumeOrderItems, roundNumber, mapOrderItemsByBlueprints, ltOrderStatus } from '@/lib/ui';

export default {
  name: 'ClientDetails',
  props: {
    id: String,
  },
  data() {
    return {
      client: {
        name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        orders: [],
        company_code: "",
        vat_code: "",
        banks_name: "",
        account_number: "",
      },
      ordersAll: [],
      ordersInQueue: [],
      ordersInWIP: [],
      bills: [],
    };
  },

  created() {
    this.load();
  },

    methods: {
    load() {
      fetchClient(this.id).then((res) => {
        this.client = res.data;
        this.ordersAll = this.client.orders.reverse();
        fetchBillsByClient(this.id).then((res) => {
        this.bills = res.data;
        });
      });
      fetchOrdersByClientOpen(this.id).then((res) => {
        this.ordersInQueue = res.data;
      });
      fetchOrdersByClientWIP(this.id).then((res) => {
        this.ordersInWIP = res.data;
      });
    },

    billing(bill_id) {
      window.open(
        'http://' +
          window.location.hostname +
          ':3000/api/bills/' +
          bill_id +
          '/billing',
      );
    },

    mapOrderItemsByBlueprints(order) {
        return mapOrderItemsByBlueprints(order).length;
    },
    
    dateToLocaleDateString(date) {
        return dateToLocaleDateString(date);
    },

    totalVolumeOrderItems(orderItems) {
        return totalVolumeOrderItems(orderItems);
    },

    ltOrderStatus(status) {
      return ltOrderStatus(status);
    },

    roundNumber(numberValue) {
        return roundNumber(numberValue);
    },

    totalAmountPayments(payments) {
      return totalAmountPayments(payments);
    },

    roundNumberScaleTwo(floatValue) {
      return roundNumberScaleTwo(floatValue);
    },

    amountProductBillItemsTotal(bill) {
      return amountProductBillItemsTotal(bill);
    },

  },
};
</script>

