<template>
  <div class="container">
<div class="block">
      <h1 class="is-size-3">Sąskaitos Nr. {{ this.id }} informacija</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'orderBillList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
        <div class="control">
          <router-link
            :to="{ name: 'orderBillEdit', params: { id: this.id } }"
            class="button is-link"
            >Koreguoti</router-link
          >
        </div>
        <div class="control">
          <button class="button is-link" @click="billing(this.id)">
            Nuoroda
          </button>
        </div>
      </div>
    </div>

    <div class="block">
      <div class="field is-grouped">
        <div class="control">
          <label class="label" for="client_id">Klientas</label>
          <div class="control select" :class="errors.client_id && 'is-danger'">
            <select v-model="form.order.client_id" disabled>
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
            <label class="label" for='drying_started_at'>Dokumento data:</label>
          <input class="input" :class="errors.bill_date && 'is-danger'" type="datetime-local" v-model="form.bill_date" disabled>
          </div>
          <div class="control">
            <label class="label" for='drying_started_at'>Mokėjimo terminas:</label>
          <input class="input" :class="errors.payment_due && 'is-danger'" type="text" v-model="payment_due" disabled>
          </div>
        <div class="control">
          <label class="label" for="form.note">Pastaba</label>
          <input class="input" type="text" v-model="form.note" disabled>
        </div>
      </div>
    </div>

    <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
 
<tab name="Produktai">
    <div class="block">
      <h3 class="is-size-4">Produktai</h3>
    </div>

    <div class="block">
<data-table :rowsPerPage="10" :list="productRows" @dataSlice="data => this['data' + 'Rows'] = data">
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
                  <h3><b>Iš viso </b><span class="tag is-light">{{ totalVolumeOrderItems(form.bill_items) }}</span>&nbsp;<b>(m3)</b> </h3>
                </div>
              </div> 
            </td>
          </tr>
        </template>
</data-table>
    </div>

    <div v-if="productRows.length == 0"><h3 class="is-size-4">Produktų sąrašas tuščias.</h3></div>
</tab>

<tab name="Mokėjimai">
    <div class="block">
      <h3 class="is-size-4">Mokėjimai</h3>
    </div>
    <div class="field">
          <div class="control">
            <router-link
                :to="{ name: 'billPayment', params: { id: this.id } }"
                class="button is-link"
                >Pridėti sąskaitos mokėjimą</router-link
              >
          </div>
    </div>
    <div class="field is-grouped">
    <div class="control">
                  <h3><b>Sąskaitos suma:&nbsp;</b><span class="tag is-success is-light">
              {{ amountProductBillItemsTotal(form) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
    </div>
    <div class="control">
                  <h3><b>Mokėjimų suma:&nbsp;</b><span class="tag" 
              :class="{
                'is-danger': 
                  totalAmountPayments(billPayments) == 0 && amountProductBillItemsTotal(form) > 0,
                'is-warning': 
                  totalAmountPayments(billPayments) > 0 && totalAmountPayments(billPayments) < amountProductBillItemsTotal(form),
                'is-warning is-light':
                  totalAmountPayments(billPayments) == 0 && amountProductBillItemsTotal(form) == 0,
                'is-success':
                  totalAmountPayments(billPayments) >= amountProductBillItemsTotal(form),
              }">
              {{ totalAmountPayments(billPayments) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
    </div>
    <div class="control">
                  <h3><b>Mokėjimų likutis:&nbsp;</b><span class="tag" 
              :class="{
                'is-danger': 
                  totalAmountPayments(billPayments) == 0 && amountProductBillItemsTotal(form) > 0,
                'is-warning': 
                  (totalAmountPayments(billPayments) > 0 && totalAmountPayments(billPayments) < amountProductBillItemsTotal(form)) || totalAmountPayments(billPayments) > amountProductBillItemsTotal(form),
                'is-warning is-light':
                  totalAmountPayments(billPayments) == 0 && amountProductBillItemsTotal(form) == 0,
                'is-success':
                  totalAmountPayments(billPayments) >= amountProductBillItemsTotal(form),
              }">
              {{ roundNumberScaleTwo(amountProductBillItemsTotal(form) - totalAmountPayments(billPayments)) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
    </div><br>
    </div>
    
    <div class="block">
      <data-table :rowsPerPage="5" :list="billPayments" @dataSlice="data => this['data' + 'BillPayments'] = data">
  <template #head>
          <tr>
            <th><label>Mokėjimo&nbsp;Nr.</label></th>
            <th><label>SF Nr.</label></th>
            <th><label>Pastaba</label></th>
            <th><label>Įrašo data</label></th>
            <th><label>Mokėjimo&nbsp;suma</label></th>
            <th><label>Veiksmai</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="billPayment in dataBillPayments" v-bind:key="billPayment.bill_payment_id">
            <td>
              <router-link
              :to="{ name: 'billPaymentEdit', params: { id: billPayment.bill_payment_id } }"
              class="tag is-light is-info"
              >{{ billPayment.bill_payment_id }}</router-link>
            </td>
            <td><span class="tag is-light">{{ billPayment.bill_id }}</span></td>
            <td>{{ billPayment.note }}</td>
            <td>{{ dateToLocaleDateString(billPayment.payment_date) }}</td>
            <td><span class="tag is-light">{{ billPayment.amount }}</span></td>
            <td>
              <div class="field is-grouped">
                <div class="control">
                  <router-link
                    :to="{ name: 'billPaymentEdit', params: { id: billPayment.bill_payment_id } }"
                    class="button is-light"
                    >Redaguoti</router-link
                  >
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <div class="field">
                <div class="control">
                  <h3><b>Iš viso&nbsp;</b><span class="tag" 
              :class="{
                'is-danger': 
                  totalAmountPayments(billPayments) == 0 && amountProductBillItemsTotal(form) > 0,
                'is-warning': 
                  totalAmountPayments(billPayments) > 0 && totalAmountPayments(billPayments) < amountProductBillItemsTotal(form),
                'is-warning is-light':
                  totalAmountPayments(billPayments) == 0 && amountProductBillItemsTotal(form) == 0,
                'is-success':
                  totalAmountPayments(billPayments) >= amountProductBillItemsTotal(form),
              }">
              {{ totalAmountPayments(billPayments) }}
              </span><b>&nbsp;(Eur)<br></b> </h3>
                </div>
                <br>
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
  fetchBill,
  fetchClients,
  fetchBillPaymentsByBill,
} from '@/lib/api';
import { roundNumberScaleTwo, amountProductBillItemsTotal, billPaymentsDue, countVolumeBlueprint, dateToLocaleString, totalVolumeOrderItems, totalAmountPayments, dateToLocaleDateString } from '@/lib/ui';

export default {
  name: 'OrderBillDetails',
  props: {
    id: String,
  },
  data() {
    return {
      productRows: [],
      clients: [],
      form: {
        order: { 
          order_id: 0,
          client_id: 0,
          delivery_date: null, 
        },
        bill_date: null,
        note: "",
      },
      errors: {},
      payment_due: "",
      billPayments: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchClients().then((res) => {
        this.clients = res.data;
      });
      fetchBill(this.id).then((res) => {
        this.form = res.data;
        this.form.bill_date = dateToLocaleString(res.data.bill_date ? res.data.bill_date : res.data.order.delivery_date);
        this.productRows = this.form.bill_items;
        this.payment_due = `${billPaymentsDue(res.data)} (${this.form.days_postponed}D)`;
        fetchBillPaymentsByBill(this.id).then(res => {
          this.billPayments = res.data;
        });
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

    roundNumberScaleTwo(floatValue) {
      return roundNumberScaleTwo(floatValue);
    },

    countVolumeBlueprint(productRow) {
      return countVolumeBlueprint(productRow);
    },

    totalVolumeOrderItems(orderItems) {
      return totalVolumeOrderItems(orderItems);
    },
    
    amountProductBillItemsTotal(bill) {
      return amountProductBillItemsTotal(bill);
    },

    totalAmountPayments(payments) {
      return totalAmountPayments(payments);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

