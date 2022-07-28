<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Sandelio turinys ({{ productClass.name }})</h1>
    </div>

    <div class="block">
      <div class="control">
                <router-link
                  :to="{ name: 'inventoryClassList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>

      <table class="table is-fullwidth">
        <tr>
          <th>Klasė</th>
          <th>Kiekis (vnt.)</th>
          <th>Sandelys (m3)</th>
          <th>Suminis (m3)</th>
          <th>Užsakymai (m3)</th>
          <th>Veiksmai</th>
        </tr>
        <tr
          v-for="warehouseItem in warehouseItems"
          v-bind:key="warehouseItem.warehouse_item_id"
        >
          <td>
            <div class="tag">
              {{ warehouseItem.blueprint.product_class.name }}
            </div>
            <div class="has-text-grey-light is-size-7">
              {{ warehouseItem.blueprint.product_size.x_mm }} x
              {{ warehouseItem.blueprint.product_size.y_mm }} x
              {{ warehouseItem.blueprint.product_size.z_mm }}
            </div>
          </td>
          <td>x<div class="tag">{{ warehouseItem.count }}</div></td>
          <td>
            <span class="tag is-light is-success">{{
              countInvWarehouseItemVolume(warehouseItem)
            }}</span>
          </td>
          <td>
            <span
              class="tag"
              :class="{
                'is-danger': countInvTotalItemVolume(warehouseItem) < 0,
                'is-success':
                  warehouseItem.orderStack >= 0 &&
                  countInvTotalItemVolume(warehouseItem) >= 0,
                'is-warning is-light':
                  warehouseItem.orderStack == 0 &&
                  countInvTotalItemVolume(warehouseItem) >= 0,
              }"
            >
              {{ countInvTotalItemVolume(warehouseItem) }}
            </span>
          </td>
          <td>
            <span class="tag is-light is-danger">{{
              countInvOrderItemVolume(warehouseItem)
            }}</span>
          </td>
          <td>
            <div class="control">
              <router-link
                :to="{
                  name: 'inventoryDetails',
                  params: { id: warehouseItem.blueprint.blueprint_id },
                }"
                class="button is-light"
                >Praplesti</router-link
              >
            </div>
          </td>
        </tr>
      </table>
    </div>
    <br>
  </div>
</template>

<script>
import { fetchClassInventory, fetchProductClass } from '@/lib/api';
import {
  countInvWarehouseItemVolume,
  countInvOrderItemVolume,
  countInvTotalItemVolume,
  sortInvBlueprintsByActualSizes,
} from '@/lib/ui';

export default {
  name: 'InventoryClassBlueprintsList',
  props: {
    id: String,
  },
  data() {
    return {
      productClass: {},
      warehouseItems: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchClassInventory(this.id).then((res) => {
        this.warehouseItems = sortInvBlueprintsByActualSizes(res.data);
      });
      fetchProductClass(this.id).then((res) => {
        this.productClass = res.data;
      });
    },
    
    countInvWarehouseItemVolume(warehouseItem) {
      return countInvWarehouseItemVolume(warehouseItem);
    },

    countInvOrderItemVolume(warehouseItem) {
      return countInvOrderItemVolume(warehouseItem);
    },

    countInvTotalItemVolume(warehouseItem) {
      return countInvTotalItemVolume(warehouseItem);
    },

  },
};
</script>

