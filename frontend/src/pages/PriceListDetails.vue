<template>
  <div class="container">
    <h1 class="is-size-3">Kainoraščio ({{ form.price_list_id }}) "{{ form.name }}" informacija</h1>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'priceList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
        <div class="control">
          <router-link
            :to="{ name: 'priceListEdit', params: { id: this.id } }"
            class="button is-link"
            >Koreguoti</router-link
          >
        </div>
      </div>
    </div>

  <div class="field">
    
    <div class="control">
      <div class="field is-grouped">
        <div class="control">
          <label class="label" for='form.price_list_date'>Kainoraščio data:</label>
          <input disabled class="input" :class="errors.price_list_date && 'is-danger'" type="datetime-local" v-model="price_list_date">
        </div>
        <div class="control">
          <label class="label" for='form.note'>Papildomas aprašas:</label>
          <input disabled type="text" :class="errors.note && 'is-danger'" class="input" v-model="form.note">
        </div>
        <div class="control" style="margin-top: 10px; margin-left: 20px;">
          <input disabled type="checkbox" v-model="form.enabled" />&nbsp;<label for="checkbox"><b>Įgalintas<br>(Užsakymai/Sąskaitos)</b></label>
        </div>
      </div>
    </div>
    <br>

  <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
    <tab name="Kainoraštis">
      <div class="block">
        <h3 class="is-size-4">Kainoraštis</h3>
      </div>
      <div class="control">
        <table class="table is-fullwidth">
            <thead>
              <tr><th colspan="6"></th></tr>
              <tr>
                <th><label>Klasė</label></th>
                <th><label>Bloko savikaina<br>(4.8m3)&nbsp;-&nbsp;(Eur)</label></th>
                <th><label>Gaminio savikaina<br>(1m3)&nbsp;-&nbsp;(Eur)</label></th>
                <th><label>Antkainis (%)</label></th>
                <th><label>Produkto kaina<br>(1m3)&nbsp;-&nbsp;(Eur)</label></th>
                <th><label>Bloko kaina<br>(4.8m3)&nbsp;-&nbsp;(Eur)</label></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(price, index) in form.prices" v-bind:key="index">
                <td>
                  <div class="tag">{{ price.product_class.name }}</div>
                </td>
                <td>
                  <div class="tag">{{ roundNumberScaleTwo((price.amount * 100)/(100 + parseFloat(price.markup)) * 4.8) }}</div>
                </td>
                <td>
                  <div class="tag">{{ roundNumberScaleTwo((price.amount * 100)/(100 + parseFloat(price.markup))) }}</div>
                </td>
                <td>
                  <div class="tag">{{ price.markup }}</div>
                </td>
                <td>
                  <div class="tag">{{ price.amount }}</div>
                </td>
                <td>
                  <div class="tag">{{ roundNumberScaleTwo(price.amount * 4.8) }}</div>
                </td>                
              </tr>            
            </tbody>
        </table>
      </div>
    </tab>
    <tab name="Užsakymai">
      <div class="block">
        <h3 class="is-size-4">Užsakymai</h3>
      </div>
          <div class="block">
      <data-table :rowsPerPage="10" :list="orders" @dataSlice="data => this.data = data">
       <template #head>
        <tr>
          <th>Užsakymo Nr.</th>
          <th>Klientas</th>
          <th>Užsakymo būklė</th>
          <th>Produktai</th>
          <th>Dydis (m3)</th>
          <th>Veiksmai</th>
        </tr></template>
        <template #body>
        <tr v-for="order in data" v-bind:key="order.order_id">
          <td><router-link
          :to="{ name: 'orderDetails', params: { id: order.order_id } }"
          class="tag is-light is-info"
          >{{ order.order_id }}</router-link
        ></td>
          <td>{{ order.client.name }}</td>
          <td>{{ ltOrderStatus(order.status) }}</td>
          <td><div class="tag">{{ mapOrderItemsByBlueprints(order) }}</div></td>
          <td><span class="tag is-light">{{ roundNumber(totalVolumeOrderItems(order.order_item_fulfills) + totalVolumeOrderItems(order.order_items)) }}</span></td>
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
      </template></data-table>
  <br>
    </div>
    </tab>
    <tab name="Sąskaitos">
<div class="block">
      <h3 class="is-size-4">Sąskaitos</h3>
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
            <th><div style="text-align: right;"><label>Mokėjimai (Eur)</label></div></th>           
            <th><label>Sąskaitos suma (Eur)</label></th>
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

            <td><div style="text-align: right;"><div class="tag">{{ bill.bill_items.length }}</div></div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(totalVolumeOrderItems(bill.bill_items)*
                    1000,
                ) / 1000
              }}</span>
            </td>
            <td>
              <div style="text-align: right;">
              <span class="tag" 
              :class="{
                'is-danger': 
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
              </div>
            </td>
            <td>
              <span class="tag is-success is-light">
              {{ amountProductBillItemsTotal(bill) }}
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
  </div>
    <br><br>
  </div>
</template>

<script>
import { fetchPriceList, fetchProductClasses, fetchOrdersByPriceList, fetchBillsByPriceList, } from '@/lib/api';
import { 
  dateToLocaleString, 
  dateToLocaleDateString,
  roundNumberScaleTwo, 
  ltOrderStatus, 
  totalVolumeOrderItems, 
  roundNumber, 
  mapOrderItemsByBlueprints,
  totalAmountPayments,
  amountProductBillItemsTotal,
  } from '@/lib/ui';

export default {
  name: 'PriceListDetails',
  props: {
    id: String,
  },
  data() {
    return {
      form: {
        name: "",
        note: "",
        price_list_id: "",
        price_list_date: null,
        enabled: true,
        prices: [],
      },
      orders: [],
      bills: [],
      price_list_date: null,
      product_classes: [],
      errors: {},
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductClasses().then((res) => {
        this.product_classes = res.data;
      });
      fetchPriceList(this.id).then(res => {
        this.form = res.data;
        this.price_list_date = dateToLocaleString(res.data.price_list_date);
      });
      fetchOrdersByPriceList(this.id).then(res => {
        this.orders = res.data;
      });
      fetchBillsByPriceList(this.id).then(res => {
        this.bills = res.data;
      });
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    totalAmountPayments(payments) {
      return totalAmountPayments(payments);
    },

    amountProductBillItemsTotal(bill) {
      return amountProductBillItemsTotal(bill);
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

    mapOrderItemsByBlueprints(orderItems) {
      return mapOrderItemsByBlueprints(orderItems).length;
    },

    roundNumberScaleTwo(floatNumber) {
      return roundNumberScaleTwo(floatNumber);
    },

  },
};
</script>

