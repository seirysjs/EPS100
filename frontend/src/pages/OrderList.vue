<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Užsakymai</h1>
    </div>

    <div class="block has-background-light p-5">
      <router-link :to="{ name: 'orderNew' }" class="button is-link"
        >Naujas užsakymas</router-link
      >
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
          <th>Sąskaitų suma</th>
          <th>Mokėjimų suma</th>
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
          <td><span class="tag is-light" :class="{
                'is-danger': 
                  order.status == 'void',
                'is-warning':
                  order.status == 'wip',
                'is-success':
                  order.status == 'done',
                }">{{ ltOrderStatus(order.status) }}</span></td>
          <td><div class="tag">{{ mapOrderItemsByBlueprints(order) }}</div></td>
          <td><span class="tag is-light">{{ roundNumber(totalVolumeOrderItems(order.order_item_fulfills) + totalVolumeOrderItems(order.order_items)) }}</span></td>
          <td><span class="tag is-light">{{ amountProductOrderBillsItemsTotal(order.bills) }}</span></td>
          <td><span class="tag" :class="{
                'is-danger is-light': 
                  totalAmountBills(order.bills) == 0 && amountProductOrderBillsItemsTotal(order.bills) > 0,
                'is-warning': 
                  totalAmountBills(order.bills) > 0 && totalAmountBills(order.bills) < amountProductOrderBillsItemsTotal(order.bills),
                'is-warning is-light':
                  totalAmountBills(order.bills) == 0 && amountProductOrderBillsItemsTotal(order.bills) == 0,
                'is-success':
                  totalAmountBills(order.bills) >= amountProductOrderBillsItemsTotal(order.bills),
              }">{{ totalAmountBills(order.bills) }}</span></td>
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
  </div>
</template>

<script>
import { fetchOrders, fetchBillsByOrder } from '@/lib/api';
import { totalAmountBills, totalVolumeOrderItems, roundNumber, mapOrderItemsByBlueprints, ltOrderStatus, amountProductOrderBillsItemsTotal, } from '@/lib/ui';

export default {
  name: 'OrderList',
  data() {
    return {
      orders: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchOrders().then((res) => {
        this.orders = res.data;
        for (let indexOrder = 0; indexOrder < this.orders.length; indexOrder++) {
          const order = this.orders[indexOrder];
          fetchBillsByOrder(order.order_id).then(res => {
            this.orders[indexOrder].bills = res.data;
          });
        }
      });
    },

    totalVolumeOrderItems(orderItems) {
        return totalVolumeOrderItems(orderItems);
    },

    mapOrderItemsByBlueprints(order) {
        return mapOrderItemsByBlueprints(order).length;
    },

    ltOrderStatus(status) {
      return ltOrderStatus(status);
    },

    totalAmountBills(bills) {
      return totalAmountBills(bills);
    },

    amountProductOrderBillsItemsTotal(bills) {
      return amountProductOrderBillsItemsTotal(bills);
    },

    roundNumber(numberValue) {
        return roundNumber(numberValue);
    },
    
    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

