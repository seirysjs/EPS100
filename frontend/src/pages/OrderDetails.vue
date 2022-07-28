<template>
  <div class="container">
<div class="block">
      <h1 class="is-size-3">Užsakymo Nr. {{ form.order_id }} informacija</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'orderList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
        <div class="control">
          <router-link
            :to="{ name: 'orderEdit', params: { id: this.id } }"
            class="button is-link"
            >Koreguoti</router-link
          >
        </div>
        
        <div class="control">
          <router-link
            :to="{ name: 'orderInvoice', params: { id: this.id } }"
            class="button is-link"
            >Suformuoti važtaraštį</router-link
          >
        </div>
        <div v-if="form.status !='done'" class="control">
          <router-link
            :to="{ name: 'orderFulfill', params: { id: this.id } }"
            class="button is-danger"
            >Įvykdyti</router-link
          >
        </div>
      </div>
    </div>

    <div class="block">
      <div class="field is-grouped">
        <div class="control">
          <label class="label" for="client_id">Klientas</label>
          <div class="control select" :class="errors.client_id && 'is-danger'">
            <select v-model="form.client_id" disabled>
              <option value="0" selected>Pasirinkti</option>
              <option
                v-for="(client, index) in clients"
                v-bind:key="index"
                :value="client.client_id"
              >
                {{ client.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <label class="label" for="form.status">Būsena</label>
          <div class="control select">
            <select v-model="form.status" disabled>
              <option value="open">Eilėje</option>
              <option value="wip">Vykdomas</option>
              <option value="done">Įvykdytas</option>
              <option value="void">Negaliojantis</option>
            </select>
          </div>
        </div>
        <div class="control">
            <label class="label" for='drying_started_at'>Pristatymo data:</label>
          <input class="input" :class="errors.delivery_date && 'is-danger'" type="datetime-local" v-model="form.delivery_date" disabled>
          </div>
        <div class="control">
          <label class="label" for="form.transport_id">Transportas</label>
          <div
            class="control select"
            :class="errors.transport_id && 'is-danger'"
          >
            <select v-model="form.transport_id" disabled>
              <option value="" selected>Pasirinkti</option>
              <option
                v-for="(transport, index) in transports"
                v-bind:key="index"
                :value="transport.transport_id"
              >
                {{ transport.number }} {{ transport.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
    <tab name="Važtaraščiai" v-if="transfers.length > 0">
    <div class="block">
      <h3 class="is-size-4">Važtaraščiai</h3>
    </div>

    <div class="block">
      <data-table :rowsPerPage="5" :list="transfers" @dataSlice="data => this['data' + 'Transfers'] = data">
  <template #head>
          <tr>
            <th><label>Važtaraščio&nbsp;Nr.</label></th>
            <th><label>VAZ Nr.</label></th>
            <th><label>Pristatymo data</label></th>
            <th><label>Transportas</label></th>
            <th><label>Vairuotojas</label></th>
            <th><label>Produktai</label></th>
            <th><label>Kiekis (m3)</label></th>
            <th><label>Veiksmai</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="transfer in dataTransfers" v-bind:key="transfer.transfer_id">
            <td><div class="tag">{{ transfer.transfer_id }}</div></td>
            <td>{{ transfer.vaz_number }}</td>
            <td>{{ transfer.invoice_date ? dateToLocaleDateString(transfer.invoice_date) : dateToLocaleDateString(transfer.order.delivery_date) }}</td>
            <td>{{ transfer?.transport?.name }} {{ transfer?.transport?.number }}</td>
            <td>{{ transfer?.worker?.name }}</td>
            <td><div class="tag">{{ transfer?.transfer_items?.length }}</div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(totalVolumeOrderItems(transfer.transfer_items)*
                    1000,
                ) / 1000
              }}</span>
            </td>
            <td>
              <div class="field is-grouped">
                <div class="control">
                  <router-link
                    :to="{ name: 'orderInvoiceEdit', params: { id: transfer.transfer_id } }"
                    class="button is-light"
                    >Redaguoti</router-link
                  >
                </div>
                <div class="control">
                  <button class="button is-light" @click="invoice(transfer.transfer_id)">
                    Nuoroda
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5"></td>
            <td colspan="2">
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <h3><b>Iš viso:&nbsp;</b><span class="tag is-light">{{ totalVolumeTransfers(transfers) }}</span><b>&nbsp;(m3)</b> </h3>
                </div>
              </div> 
            </td>
          </tr>
        </template>
</data-table>
    </div>
    </tab>

<tab name="Produktai">
    <div v-if="productRows.length > 0">
    <div class="block">
      <h3 class="is-size-4">Produktai (Neužpildyta)</h3>
    </div>

    <div class="block">
<data-table :rowsPerPage="5" :list="productRows" @dataSlice="data => this['data' + 'Rows'] = data">
  <template #head>
          <tr>
            <th><label>Klasė</label></th>
            <th><label>Dydis</label></th>
            <th><label>Kiekis</label></th>
            <th><label>Kiekis (m3)</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="(productRow, index) in dataRows" v-bind:key="index">
            <td><div class="tag">{{ productRow.blueprint.product_class.name }}</div></td>
            <td>
              <div class="tag">{{ productRow.blueprint.product_size.x_mm }}</div>x<div class="tag">{{
                productRow.blueprint.product_size.y_mm
              }}</div>x<div class="tag">{{ productRow.blueprint.product_size.z_mm }}</div>
            </td>
            <td>x<div class="tag">{{ productRow.count }}</div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(
                  countVolumeBlueprint(productRow.blueprint) *
                    productRow.count *
                    1000,
                ) / 1000
              }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td>
              <div class="field">
                <div class="control">
                  <h3><b>Iš viso: </b><span class="tag is-light">{{ totalVolumeOrderItems(form.order_items) }}</span>&nbsp;<b>(m3)</b> </h3>
                </div>
              </div> 
            </td>
          </tr>
        </template>
</data-table>
    </div>
    </div>

    <div v-if="orderItemFulfills.length > 0">
    <div class="block">
      <h3 class="is-size-4">Produktai (Įvykdyta)</h3>
    </div>

    <div class="block">
      <data-table :rowsPerPage="5" :list="orderItemFulfills" @dataSlice="data => this['data' + 'Fulfilled'] = data">
  <template #head>
          <tr>
            <th><label>Klasė</label></th>
            <th><label>Dydis</label></th>
            <th><label>Įrašo data</label></th>
            <th><label>Kiekis</label></th>
            <th><label>Kiekis (m3)</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="(productRow, index) in dataFulfilled" v-bind:key="index">
            <td><div class="tag">{{ productRow.blueprint.product_class.name }}</div></td>
            <td>
              <div class="tag">{{ productRow.blueprint.product_size.x_mm }}</div>x<div class="tag">{{
                productRow.blueprint.product_size.y_mm
              }}</div>x<div class="tag">{{ productRow.blueprint.product_size.z_mm }}</div>
            </td>
            <td>{{ dateToLocaleDateString(productRow.fulfilled_date) }}</td>
            <td>x<div class="tag">{{ productRow.count }}</div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(
                  countVolumeBlueprint(productRow.blueprint) *
                    productRow.count *
                    1000,
                ) / 1000
              }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td>
              <div class="field">
                <div class="control">
                  <h3><b>Iš viso: </b><span class="tag is-light">{{ totalVolumeOrderItems(form.order_item_fulfills) }}</span>&nbsp;<b>(m3)</b> </h3>
                </div>
              </div> 
            </td>
          </tr>
      </template>
</data-table>
    </div>
    </div>

    <div v-if="orderItemFulfills.length == 0 && productRows.length == 0"><h3 class="is-size-4">Produktų sąrašas tuščias.</h3></div>
</tab>

<tab name="Sąskaitos">
    <div class="block">
      <h3 class="is-size-4">Sąskaitos</h3>
    </div>
    <div class="field is-grouped">
      <div class="control">
          <router-link
            :to="{ name: 'orderBill', params: { id: this.id } }"
            class="button is-link"
            >Suformuoti sąskaitą</router-link
          >
      </div><br>
      <div class="control">
                  <button class="button is-light" @click="preOrderBilling(this.id)">
                    Išankstinė sąskaita
                  </button>
      </div>
    </div>
    
    <div class="field is-grouped">
<div class="control">
                  <h3><b>Užsakymo suma:&nbsp;</b><span class="tag is-success is-light">
              {{ amountProductOrderBillsItemsTotal(bills) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
    </div>
    <div class="control">
                  <h3><b>Mokėjimų suma:&nbsp;</b><span class="tag" 
              :class="{
                'is-danger': 
                  totalAmountBills(bills) == 0 && amountProductOrderBillsItemsTotal(bills) > 0,
                'is-warning': 
                  totalAmountBills(bills) > 0 && totalAmountBills(bills) < amountProductOrderBillsItemsTotal(bills),
                'is-warning is-light':
                  totalAmountBills(bills) == 0 && amountProductOrderBillsItemsTotal(bills) == 0,
                'is-success':
                  totalAmountBills(bills) >= amountProductOrderBillsItemsTotal(bills),
              }">
              {{ totalAmountBills(bills) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
    </div>
    <div class="control">
                  <h3><b>Mokėjimų likutis:&nbsp;</b><span class="tag" 
              :class="{
                'is-danger': 
                  totalAmountBills(bills) == 0 && amountProductOrderBillsItemsTotal(bills) > 0,
                'is-warning': 
                  (totalAmountBills(bills) > 0 && totalAmountBills(bills) < amountProductOrderBillsItemsTotal(bills)) || totalAmountBills(bills) > amountProductOrderBillsItemsTotal(bills),
                'is-warning is-light':
                  totalAmountBills(bills) == 0 && amountProductOrderBillsItemsTotal(bills) == 0,
                'is-success':
                  totalAmountBills(bills) >= amountProductOrderBillsItemsTotal(bills),
              }">
              {{ roundNumberScaleTwo(amountProductOrderBillsItemsTotal(bills) - totalAmountBills(bills)) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
    </div><br>
    </div>
    <div class="block">
      <data-table :rowsPerPage="5" :list="bills" @dataSlice="data => this['data' + 'Bills'] = data">
  <template #head>
          <tr>
            <th><label>Sąskaitos&nbsp;Nr.</label></th>
            <th><label>Dokumento data</label></th>
            <th><label>Produktai</label></th>
            <th><label>Kiekis (m3)</label></th>
            <th><label>Mokėjimai (Eur)</label></th>
            <th><label>Suma (Eur)</label></th>
            <th><label>Veiksmai</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="bill in dataBills" v-bind:key="bill.bill_id">
            <td><div class="control">
              <router-link
                :to="{
                  name: 'orderBillDetails',
                  params: { id: bill.bill_id },
                }"
                class="tag is-link is-light"
                >{{ bill.bill_id }}</router-link
              >
            </div></td>
            <td>{{ bill.bill_date ? dateToLocaleDateString(bill.bill_date) : dateToLocaleDateString(bill.order.delivery_date) }}</td>
            <td><div class="tag">{{ bill.bill_items?.length }}</div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(totalVolumeOrderItems(bill.bill_items)*
                    1000,
                ) / 1000
              }}</span>
            </td>
            <td><span class="tag is-light">
              {{ totalAmountPayments(bill.bill_payments) }}
              </span></td>
            <td><span class="tag is-light">
              {{ amountProductBillItemsTotal(bill) }}
              </span></td>
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
          <tr>
            <td colspan="2"></td>
            <td colspan="2">
              <div class="field is-grouped is-grouped-left">
                <div class="control">
                  <h3><b>Iš viso:&nbsp;</b><span class="tag is-light">{{ totalVolumeBills(bills) }}</span><b>&nbsp;(m3)</b> </h3>
                </div>
              </div> 
            </td>
            <td>
              <div class="field is-grouped is-grouped-left">
                <div class="control">
                  <h3><b>Iš viso:&nbsp;</b><span class="tag is-light">{{ totalAmountBills(bills) }}</span><b>&nbsp;(Eur)</b> </h3>
                </div>
              </div> 
            </td>
            <td>
              <div class="field is-grouped is-grouped-left">
                <div class="control">
                  <h3><b>Iš viso:&nbsp;</b><span class="tag is-light">{{ amountProductOrderBillsItemsTotal(bills) }}</span><b>&nbsp;(Eur)</b> </h3>
                </div>
              </div> 
            </td>
          </tr>
        </template>
</data-table>
    </div>
    </tab>
</tabs>

  </div>
</template>

<script>
import {
  fetchTransports,
  fetchOrder,
  fetchClients,
  fetchTransfersByOrder,
  fetchBillsByOrder,
} from '@/lib/api';
import { roundNumberScaleTwo, amountProductBillItemsTotal, amountProductOrderBillsItemsTotal, totalAmountBills, totalAmountPayments, countVolumeBlueprint, dateToLocaleString, totalVolumeOrderItems, totalVolumeTransfers, totalVolumeBills, dateToLocaleDateString } from '@/lib/ui';

export default {
  name: 'OrderDetails',
  props: {
    id: String,
  },
  data() {
    return {
      productRows: [],
      orderItemFulfills: [],
      transfers: [],
      bills: [],
      clients: [],
      transports: [],
      form: {
        client_id: 0,
        status: 'open',
        transport_id: '',
      },
      errors: {},
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchTransports().then((res) => {
        this.transports = res.data;
      });
      fetchClients().then((res) => {
        this.clients = res.data;
      });
      fetchOrder(this.id).then((res) => {
        this.form = res.data;
        this.form.delivery_date = dateToLocaleString(res.data.delivery_date);
        this.productRows = this.form.order_items;
        this.orderItemFulfills = this.form.order_item_fulfills.reverse();
      });
      fetchTransfersByOrder(this.id).then((res) => {
        this.transfers = res.data;
      });
      fetchBillsByOrder(this.id).then((res) => {
        this.bills = res.data;
      });
    },

    invoice(transfer_id) {
      window.open(
        'http://' +
          window.location.hostname +
          ':3000/api/transfers/' +
          transfer_id +
          '/invoice',
      );
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

    preOrderBilling(order_id) {
      window.open(
        'http://' +
          window.location.hostname +
          ':3000/api/orders/' +
          order_id +
          '/billing',
      );
    },

    countVolumeBlueprint(productRow) {
      return countVolumeBlueprint(productRow);
    },

    roundNumberScaleTwo(floatNumber) {
      return roundNumberScaleTwo(floatNumber);
    },


    totalVolumeOrderItems(orderItems) {
      return totalVolumeOrderItems(orderItems);
    },

    totalVolumeTransfers(transfers) {
      return totalVolumeTransfers(transfers);
    },

    amountProductOrderBillsItemsTotal(bills) {
      return amountProductOrderBillsItemsTotal(bills);
    },

    amountProductBillItemsTotal(bills) {
      return amountProductBillItemsTotal(bills);
    },

    totalVolumeBills(bills) {
      return totalVolumeBills(bills);
    },

    totalAmountBills(bills) {
      return totalAmountBills(bills);
    },

    totalAmountPayments(payments) {
      return totalAmountPayments(payments);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

  },
};
</script>

