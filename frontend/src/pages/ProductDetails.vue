<template>
  <div class="container">
    <h1 class="is-size-3">Produkto <span v-if="blueprint.product_class.name != ''">({{blueprint.product_class.name}} - {{blueprint.product_size.x_mm}}x{{blueprint.product_size.y_mm}}x{{blueprint.product_size.z_mm}})</span> įrašai</h1>
    <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Grįžti</a></div><br>
            <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
        <tab name="Užsakymai">
            <h1 class="is-size-3">Užsakymai</h1>
            <data-table :rowsPerPage="10" :list="orderItems" @dataSlice="data => this['data' + 'Order'] = data">
  <template #head>
      <tr>
        <th>Užsakymo Nr.</th>
        <th>Užsakymo kodas</th>
        <th>Užsakymo būklė</th>
        <th>Kiekis (vnt.)</th>
        <th>Produktas</th>
        <th>Kiekis (m3)</th>
        <th>Pristatymo data</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
        <tr v-for="order in dataOrder" v-bind:key="order.order_id">
          <td><div class="control">
              <router-link
                :to="{
                  name: 'orderDetails',
                  params: { id: order.order_id },
                }"
                class="tag is-link is-light"
                >{{ order.order_id }}</router-link
              >
            </div></td>
          <td>{{ order.number }}</td>
          <td>{{ ltOrderStatus(order.status) }}</td>
          <td><span class="tag is-light">x{{ order.count }}</span></td>
          <td><div class="field is-grouped"><div class="control"><div class="tag">{{ order.blueprint.product_class.name }}</div><br><div class="tag">{{ order.blueprint.product_size.x_mm }}</div>x<div class="tag">{{ order.blueprint.product_size.y_mm }}</div>x<div class="tag">{{ order.blueprint.product_size.z_mm }}</div></div></div></td>
          <td><span class="tag is-light is-danger">{{ countInvWarehouseItemVolume(order) }}</span></td>
          <td>{{ dateToLocaleDateString( order.delivery_date) }}</td>
          <td><div class="control">
              <router-link
                :to="{ name: 'orderDetails', params: { id: order.order_id } }"
                class="button is-light"
                >Praplesti</router-link
              >
            </div></td>
        </tr>
    </template>
</data-table>
</tab>
<tab name="Inventorius">
    <h1 class="is-size-3">Likučiai</h1>
    <data-table :rowsPerPage="10" :list="warehouseItems" @dataSlice="data => this['data' + 'Inv'] = data">
  <template #head>
      <tr>
        <th>Darbuotojas</th>
        <th>Bloko Nr.</th>
        <th>Kiekis (vnt.)</th>
        <th>Klasė</th>
        <th>Matmenys (mm)</th>
        <th>Kiekis (m3)</th>
        <th>Registruotas pjovimas</th>
      </tr>
      </template>

  <template #body>
      <tr v-for="warehouseItem in dataInv" v-bind:key="warehouseItem.warehouse_item_id">
        <td>{{warehouseItem.worker.name}}</td>
        <td><div class="tag">{{warehouseItem.block_id ? warehouseItem.block_id : "Grupė Nr. " + warehouseItem.block_multi_cut_id}}</div></td>
        <td><span class="tag is-light">x{{warehouseItem.count}}</span></td>
        <td><div class="tag">{{warehouseItem.blueprint.product_class.name}}</div></td>
        <td><div class="tag">{{warehouseItem.blueprint.product_size.x_mm}}</div>&nbsp;x&nbsp;<div class="tag">{{warehouseItem.blueprint.product_size.y_mm}}</div>&nbsp;x&nbsp;<div class="tag">{{warehouseItem.blueprint.product_size.z_mm}}</div></td>
        <td><span class="tag is-light is-success">{{countInvWarehouseItemVolume(warehouseItem)}}</span></td>
        <td>{{dateToLocaleDateString(warehouseItem.created_at)}}</td>
      </tr>
</template>
</data-table>
</tab>
</tabs>
  </div>
</template>

<script>
import { fetchBlueprint, fetchWarehouseItemsByBlueprint, fetchOrderItemsWithFulfillsByBlueprint, fetchOrder } from '@/lib/api';
import { countInvWarehouseItemVolume, dateToLocaleDateString, ltOrderStatus } from '@/lib/ui';

export default {
  name: 'ProductDetails',
  props: {
    id: String
  },
  data() {
    return {
      blueprint: {
        product_class: {
          name: "",
        },
        product_size: {
          x_mm: "",
          y_mm: "",
          z_mm: "",
        },
      },
      orders: [],
      orderItemsWithFulfills: [],
      orderItems: [],
      warehouseItems: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchBlueprint(this.id).then((res) => {
        this.blueprint = res.data;
        fetchOrderItemsWithFulfillsByBlueprint(this.id).then((res) => {
        this.orders = res.data;
        const size = Object.keys(this.orders).length;
        let index = 1;
          for (const [order_id, blueprints] of Object.entries(this.orders)) {
            fetchOrder(order_id).then((res) => {
              const order = res.data;
              this.orderItemsWithFulfills.push({
                order_id: order.order_id,
                number: order.number,
                status: order.status,
                delivery_date: order.delivery_date,
                blueprint_id: this.id,
                blueprint: this.blueprint,
                count: blueprints[this.id],
              });
              this.orderItemsWithFulfills.sort((a, b) => {
                if (a.order_id > b.order_id) return -1;
                if (a.order_id < b.order_id) return 1;
                return 0;
              });
              if (index < size) index++;
            if (index != size || size == 0) return;
            this.orderItems = this.orderItemsWithFulfills;
            });
          }
        });
      });
      
      fetchWarehouseItemsByBlueprint(this.id).then((res) => {
        this.warehouseItems = res.data;
      });
    },
    countInvWarehouseItemVolume(orders) {
      return countInvWarehouseItemVolume(orders);
    },
    ltOrderStatus(status) {
      return ltOrderStatus(status);
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

