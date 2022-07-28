<template>
  <div class="container">
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
  </div>
</template>

<script>
import { fetchBills, } from '@/lib/api';
import { roundNumber, roundNumberScaleTwo, totalVolumeOrderItems, dateToLocaleDateString, totalAmountPayments, amountProductBillItemsTotal } from '@/lib/ui';

export default {
  name: 'OrderBillList',
  data() {
    return {
      bills: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchBills().then((res) => {
        this.bills = res.data;
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

    totalVolumeOrderItems(orderItems) {
      return totalVolumeOrderItems(orderItems);
    },

    totalAmountPayments(payments) {
      return totalAmountPayments(payments);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    roundNumber(numberValue) {
      return roundNumber(numberValue);
    },

    roundNumberScaleTwo(floatValue) {
      return roundNumberScaleTwo(floatValue);
    },

    amountProductBillItemsTotal(bill) {
      return amountProductBillItemsTotal(bill);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

