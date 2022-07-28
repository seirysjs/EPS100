<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Sandelio turinys</h1>
    </div>

    <div class="block">
      <table class="table is-fullwidth">
        <tr>
          <th>Klasė</th>
          <th><div style="text-align: center;">Blokai<br>(vnt.&nbsp;+&nbsp;m3)<br><span class="tag is-light is-warning">Džiovinami</span></div></th>
          <th><div style="text-align: center;">Blokai<br>(vnt.&nbsp;+&nbsp;m3)<br><span class="tag is-light is-success">Eilėje</span></div></th>
          <th><div style="text-align: center;">Blokai<br>(vnt.&nbsp;+&nbsp;m3)<br><span class="tag is-light is-danger">Deficitas</span></div></th>
          <th><div style="text-align: center;">Produktai<br>(m3)<br><span class="tag is-light is-danger">Deficitas</span></div></th>
          <th><div style="text-align: center;">Produktai<br>(m3)</div></th>
          <th><div style="text-align: center;">Klasės suminis<br>(m3)</div></th>
          <th><div style="text-align: center;">Užsakymai<br>(m3)</div></th>
          <th>Veiksmai</th>
        </tr>
        <tr
          v-for="productClass in productClasses"
          v-bind:key="productClass.product_class_id"
        >
          <td>
            <div class="tag">
              {{ productClass.name }}
            </div>
          </td>
          <td>
            <div style="text-align: center; position: absolute;">
            <div class="tag">
              x{{ productClass.blocksDrying }}
            </div>
            &nbsp;
            <div class="tag is-light is-warning">
              {{ roundNumber(productClass.blocksDrying*4.8) }}
            </div>
            </div>
          </td>
          <td>
            <div style="text-align: center; position: absolute;">
            <div class="tag">
              x{{ productClass.blocksQueue }}
            </div>
            &nbsp;
            <div class="tag is-light is-success">
              {{ roundNumber(productClass.blocksQueue*4.8) }}
            </div>
            </div>
          </td>
          <td>
            <div style="text-align: center; position: absolute;">
            <div class="tag">
              x{{ 
              (roundNumber(productClass.classBlueprintVolumeLack - productClass.blocksQueue*4.8 - productClass.blocksDrying*4.8) > 0) ? 
              ((roundNumber(roundNumber(productClass.classBlueprintVolumeLack - productClass.blocksQueue*4.8 - productClass.blocksDrying*4.8) - (roundNumber(productClass.classBlueprintVolumeLack - productClass.blocksQueue*4.8 - productClass.blocksDrying*4.8) % 4.8)) / 4.8) + ((roundNumber(productClass.classBlueprintVolumeLack - productClass.blocksQueue*4.8 - productClass.blocksDrying*4.8) % 4.8) > 0 ? 1 : 0)) : 0
              }}
            </div>
            &nbsp;
            <div class="tag is-light is-danger">
              {{ (roundNumber(productClass.classBlueprintVolumeLack - productClass.blocksQueue*4.8  - productClass.blocksDrying*4.8) > 0) ? roundNumber(productClass.classBlueprintVolumeLack - productClass.blocksQueue*4.8  - productClass.blocksDrying*4.8) : 0 }}
            </div>
            </div>
          </td>
          <td>
            <div style="text-align: center;">
            <div class="tag is-light is-danger">
              {{ (roundNumber(productClass.classBlueprintVolumeLack) > 0 ? roundNumber(productClass.classBlueprintVolumeLack) : 0) }}
            </div>
            </div>
          </td>
          <td>
            <div style="text-align: center;">
            <span class="tag is-light is-success">{{
              productClass.volumeWarehouseItems
            }}</span>
            </div>
          </td>
          <td>
            <div style="text-align: center;">
            <span
              class="tag"
              :class="{
                'is-danger': 
                  productClass.classFulfilled == 'false' &&
                  productClass.classBlueprintVolumeLack > roundNumber(productClass.blocksQueue*4.8),
                'is-warning': 
                  productClass.classFulfilled == 'both' && 
                  productClass.classBlueprintVolumeLack > roundNumber(productClass.blocksQueue*4.8),
                'is-warning is-light':
                  productClass.classFulfilled == 'null',
                'is-success':
                  productClass.classFulfilled == 'true' || 
                  productClass.classBlueprintVolumeLack <= roundNumber(productClass.blocksQueue*4.8),
              }"
            >
              {{ productClass.volumeTotal }}
            </span>
            </div>
          </td>
          <td>
            <div style="text-align: center;">
            <span class="tag is-light is-danger">{{
              productClass.volumeOrderItems
            }}</span>
            </div>
          </td>
          <td>
            <div class="control">
              <router-link
                :to="{
                  name: 'inventoryClassBlueprintsList',
                  params: { id: productClass.product_class_id },
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
import { fetchWIPOrderItemsByBlueprint, fetchWarehouseItemsByBlueprint, fetchProductClasses, fetchBlocksByClassDrying, fetchBlocksByClassQueue, fetchWarehouseItemsByClass, fetchOrderItemsWIPByClass } from '@/lib/api';
import {
  countInvWarehouseItemVolume,
  countInvOrderItemVolume,
  countInvTotalItemVolume,
  totalVolumeOrderItems,
  roundNumber
} from '@/lib/ui';

export default {
  name: 'InventoryClassList',
  data() {
    return {
      productClasses: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductClasses().then((res) => {
        this.productClasses = res.data;
        if (this.productClasses.length == 0) return;
        
        for (let productClassIndex = 0; productClassIndex < this.productClasses.length; productClassIndex++) {
          this.productClasses[productClassIndex].blocksDrying = 0;
          this.productClasses[productClassIndex].blocksQueue = 0;
          this.productClasses[productClassIndex].volumeWarehouseItems = 0;
          this.productClasses[productClassIndex].volumeOrderItems = 0;
          this.productClasses[productClassIndex].volumeTotal = 0;
          this.productClasses[productClassIndex].classFulfilled = "null";
          this.productClasses[productClassIndex].classBlueprintVolumeLack = 0;

          fetchBlocksByClassDrying(this.productClasses[productClassIndex].product_class_id).then((res) => {
            const blocksDrying = res.data;
            this.productClasses[productClassIndex].blocksDrying = blocksDrying.length;
          });

          fetchBlocksByClassQueue(this.productClasses[productClassIndex].product_class_id).then((res) => {
            const blocksQueue = res.data;
            this.productClasses[productClassIndex].blocksQueue = blocksQueue.length;
          });

          fetchWarehouseItemsByClass(this.productClasses[productClassIndex].product_class_id).then((res) => {
            const warehouseItems = res.data;
            let volumeWarehouseItems = 0;

            for (let warehouseItemIndex = 0; warehouseItemIndex < warehouseItems.length; warehouseItemIndex++) {
              const warehouseItem = warehouseItems[warehouseItemIndex];
              volumeWarehouseItems += countInvWarehouseItemVolume(warehouseItem);
              
              fetchWarehouseItemsByBlueprint(warehouseItem.blueprint.blueprint_id).then((res) => {
                const blueprintWarehouseInvItemsVolume = totalVolumeOrderItems(res.data);

                fetchWIPOrderItemsByBlueprint(warehouseItem.blueprint.blueprint_id).then((res) => {
              
                const blueprintItemsInWipOrdersVolume = totalVolumeOrderItems(res.data);
                
                if (blueprintItemsInWipOrdersVolume == 0) return;

                if (blueprintWarehouseInvItemsVolume >= blueprintItemsInWipOrdersVolume) {
                  if (this.productClasses[productClassIndex].classFulfilled == "null")
                  this.productClasses[productClassIndex].classFulfilled = "true";

                  if (this.productClasses[productClassIndex].classFulfilled == "false")
                  this.productClasses[productClassIndex].classFulfilled = "both";
                  return;
                }
                
                if (this.productClasses[productClassIndex].classFulfilled == "null")
                this.productClasses[productClassIndex].classFulfilled = "false";

                if (this.productClasses[productClassIndex].classFulfilled == "true")
                this.productClasses[productClassIndex].classFulfilled = "both";

                this.productClasses[productClassIndex].classBlueprintVolumeLack += roundNumber((blueprintItemsInWipOrdersVolume - blueprintWarehouseInvItemsVolume));
                })
              })
            }

            this.productClasses[productClassIndex].volumeWarehouseItems = Math.round((volumeWarehouseItems) * 1000) / 1000;
            
            fetchOrderItemsWIPByClass(this.productClasses[productClassIndex].product_class_id).then((res) => {
              const orderItems = res.data;
              let volumeOrderItems = 0;

              for (let orderItemIndex = 0; orderItemIndex < orderItems.length; orderItemIndex++) {
                const orderItem = orderItems[orderItemIndex];
                volumeOrderItems += countInvWarehouseItemVolume(orderItem);
                fetchWarehouseItemsByBlueprint(orderItem.blueprint_id).then((res) => {
                  const warehouseItems = res.data;
                  if (warehouseItems.length != 0) return;
                  if (this.productClasses[productClassIndex].classFulfilled == "null")
                  this.productClasses[productClassIndex].classFulfilled = "false";

                  if (this.productClasses[productClassIndex].classFulfilled == "true")
                  this.productClasses[productClassIndex].classFulfilled = "both"; 

                  this.productClasses[productClassIndex].classBlueprintVolumeLack += roundNumber(countInvWarehouseItemVolume(orderItem));
                });
              }

              this.productClasses[productClassIndex].volumeOrderItems = Math.round((volumeOrderItems) * 1000) / 1000;

              this.productClasses[productClassIndex].volumeTotal = Math.round((this.productClasses[productClassIndex].volumeWarehouseItems + this.productClasses[productClassIndex].blocksQueue*4.8 - this.productClasses[productClassIndex].volumeOrderItems) * 1000) / 1000;
            });
          });
        }
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

    roundNumber(numberValue) {
      return roundNumber(numberValue);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

