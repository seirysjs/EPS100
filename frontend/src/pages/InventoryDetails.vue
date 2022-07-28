<template>
  <div class="container">
    <h1 class="is-size-3">Produkto <span v-if="blueprint.product_class.name != ''">({{blueprint.product_class.name}} - {{blueprint.product_size.x_mm}}x{{blueprint.product_size.y_mm}}x{{blueprint.product_size.z_mm}})</span> įrašų suvestinė</h1>
    <br>
    <div class="control">
                <router-link
                  :to="{ name: 'inventoryClassBlueprintsList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
<br>

    <tabs v-if="(orderItems.length != 0) || (warehouseItems.length != 0)" :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
        <tab name="Užsakymai" v-if="orderItems.length != 0">
            <h1 class="is-size-3">Užsakymai (Vykdomi)</h1>
            <data-table :rowsPerPage="10" :list="orderItems" @dataSlice="data => this['data' + 'Orders'] = data">
  <template #head>
      <tr>
        <th>Užsakymo Nr.</th>
        <th>Užsakymo kodas</th>
        <th>Transportas</th>
        <th>Kiekis (vnt.)</th>
        <th>Produktas</th>
        <th>Kiekis (m3)</th>
        <th>Pristatymo data</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
        <tr v-for="orderItem in dataOrders" v-bind:key="orderItem.order_item_id">
          <td><router-link
          :to="{ name: 'orderDetails', params: { id: orderItem.order.order_id } }"
          class="tag is-light is-info"
          >{{ orderItem.order.order_id }}</router-link
        ></td>
          <td>{{ orderItem.order.number }}</td>
          <td>{{ orderItem.order?.transport?.name }} {{ orderItem.order?.transport?.number }}</td>
          <td><span class="tag is-light">x{{ orderItem.count }}</span></td>
          <td><div class="tag">{{ orderItem.blueprint.product_class.name }}</div><br><div class="field is-grouped"><div class="control"><div class="tag">{{ orderItem.blueprint.product_size.x_mm }}</div>x<div class="tag">{{ orderItem.blueprint.product_size.y_mm }}</div>x<div class="tag">{{ orderItem.blueprint.product_size.z_mm }}</div></div></div></td>
          <td>&nbsp;<span class="tag is-light is-danger">{{ countInvWarehouseItemVolume(orderItem) }}</span></td>
          <td>{{ dateToLocaleDateString(orderItem.order.delivery_date) }}</td>
          <td>
            <div class="field is-grouped">
            <div class="control">
              <router-link
                :to="{ name: 'orderDetails', params: { id: orderItem.order.order_id } }"
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
<tab name="Inventorius" v-if="warehouseItems.length != 0">
<h1 class="is-size-3">Sandelio inventorius</h1>
    <data-table :rowsPerPage="10" :list="warehouseItems" @dataSlice="data => this['data' + 'Inv'] = data">
  <template #head>
      <tr>
        <th>Darbuotojas</th>
        <th>Bloko Nr.</th>
        <th>Kiekis (vnt.)</th>
        <th>Klasė</th>
        <th>Dydis (mm)</th>
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
        <td><div class="tag">{{warehouseItem.blueprint.product_size.x_mm}}</div>x<div class="tag">{{warehouseItem.blueprint.product_size.y_mm}}</div>x<div class="tag">{{warehouseItem.blueprint.product_size.z_mm}}</div></td>
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
import { fetchBlueprint, fetchWarehouseItemsByBlueprint, fetchWIPOrderItemsByBlueprint } from '@/lib/api';
import { countInvWarehouseItemVolume, dateToLocaleDateString } from '@/lib/ui';

export default {
  name: 'InventoryDetails',
  props: {
    id: String
  },
  data() {
    return {
      blueprint: {
        product_class: {
          product_class_id: this.id,
          name: "",
        },
        product_size: {
          x_mm: "",
          y_mm: "",
          z_mm: "",
        },
      },
      orderItems: [],
      warehouseItems: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchWIPOrderItemsByBlueprint(this.id).then((res) => {
        this.orderItems = res.data;
      });
      fetchWarehouseItemsByBlueprint(this.id).then((res) => {
        this.warehouseItems = res.data;
      });
      fetchBlueprint(this.id).then((res) => {
        this.blueprint = res.data;
      });
    },
    
    countInvWarehouseItemVolume(orders) {
      return countInvWarehouseItemVolume(orders);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

  },
};
</script>

