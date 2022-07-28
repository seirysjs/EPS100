<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Darbuotojas "{{ worker.name }}" atlikti ir priskirti darbai</h1>
        <div class="control">
          <router-link
            :to="{ name: 'workerList' }"
            class="button is-light"
            >Grįžti</router-link
            >
          </div>
        </div>
        <div class="block">
          <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
            <tab name="Važtaraščiai" v-if="transfers.length != 0">
              <div class="block">
      <h3 class="is-size-4">Priskirti važtaraščiai:</h3>
    </div>
<data-table :rowsPerPage="10" :list="transfers" @dataSlice="data => this.data = data">
  <template #head>
      <tr>
        <th><label>Klientas</label></th>
        <th><label>Užsakymo&nbsp;Nr.,<br>Važtaraščio&nbsp;Nr.</label></th>
        <th><label>VAZ&nbsp;Nr.</label></th>
        <th><label>Pristatymo data</label></th>
        <th><label>Transportas,&nbsp;Vairuotojas</label></th>
        <th><label>Produktai</label></th>
        <th><label>Kiekis<br>(m3)</label></th>
        <th><label>Veiksmai</label></th>
      </tr>
       </template>

  <template #body>
      <tr v-for="transfer in data" v-bind:key="transfer.transfer_id">
        <td>{{ transfer.order.client.name }}</td>
        <td><router-link
          :to="{ name: 'orderDetails', params: { id: transfer.order.order_id } }"
          class="tag is-light is-info"
          >{{ transfer.order.order_id }}</router-link
        >
         - <router-link
          :to="{ name: 'orderInvoiceEdit', params: { id: transfer.transfer_id } }"
          class="tag is-light is-primary"
          >{{ transfer.transfer_id }}</router-link
        ></td>
        <td>{{ transfer.vaz_number ? transfer.vaz_number : "-" }}</td>
        <td>{{ transfer.invoice_date ? dateToLocaleDateString(transfer.invoice_date) : dateToLocaleDateString(transfer.order.delivery_date) }}</td>
        <td>{{ transfer?.transport?.name }} {{ transfer?.transport?.number }},<br>{{worker.name}}</td>
        <td><span class="tag is-light">{{ transfer?.transfer_items?.length }}</span></td>
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
    </template>
</data-table>
  </tab>
        <tab name="Blokų pjovimai" v-if="blockCuts.length != 0">
    <div class="block">
      <h3 class="is-size-4">Atlikti pjovimai:</h3>
    </div>
<data-table :rowsPerPage="15" :list="blockCuts" @dataSlice="data => this['data' + 'Cuts'] = data">
  <template #head>
      <tr>
        <th>Darbuotojas</th>
        <th>Bloko Nr.</th>
        <th>Klasė</th>
        <th>Dydis (mm)</th>
        <th>Kiekis (vnt.)</th>
        <th>Kiekis (m3)</th>
        <th>Registruotas pjovimas</th>
      </tr>
      </template>

  <template #body>
        <tr v-for="warehouseItem in dataCuts" v-bind:key="warehouseItem.warehouse_item_id">
          <td>{{ worker.name }}</td>
          <td><div class="tag">{{ warehouseItem.block_id ? warehouseItem.block_id : "Grupė Nr. " + warehouseItem.block_multi_cut_id }}</div></td>
          <td><div class="tag">{{ warehouseItem.blueprint.product_class.name }}</div></td>
          <td><div class="tag">{{ warehouseItem.blueprint.product_size.x_mm }}</div>x<div class="tag">{{ warehouseItem.blueprint.product_size.y_mm }}</div>x<div class="tag">{{ warehouseItem.blueprint.product_size.z_mm }}</div></td>
          <td><span class="tag is-light">x{{ warehouseItem.count }}</span></td>
          <td><span class="tag is-light">{{ countInvWarehouseItemVolume(warehouseItem) }}</span></td>
          <td>{{ dateToLocaleDateString(warehouseItem.created_at) }}</td>
        </tr>
    </template>
</data-table>
</tab>
        <tab name="Blokai">
    <div class="block">
      <h3 class="is-size-4">Priskirti blokai:</h3>
    </div>
    <data-table :rowsPerPage="10" :list="blocks" @dataSlice="data => this['data' + 'Blocks'] = data">
  <template #head>
      <tr>
        <th>Bloko Nr.</th>
        <th>Klasė</th>
        <th>Džiovinimo pradžia</th>
        <th>Džiovinimo pabaiga</th>
        <th>Būsena</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
      <tr v-for="block in dataBlocks" v-bind:key="block.block_id">
        <td><router-link
                :to="{ name: 'blockDetails', params: { id: block.block_id } }"
                class="tag is-light is-info"
                >{{ block.block_id }}</router-link
              >
        </td>
        <td><div class="tag">{{ block.product_class.name }}</div></td>
        <td>
          {{
            dateToLocaleDateString(block.drying_started_at)
          }}
        </td>
        <td>
          {{
            dateToLocaleDateString(block.drying_ends_at)
          }}
        </td>
        <td><span class="tag is-light" :class="{
                'is-danger': 
                  block.status == 'void',
                'is-warning':
                  block.status == 'drying' || block.status == 'wip',
                'is-success':
                  block.status == 'queue',
                }">{{ (block.status) ? ltBlockStatus(block.status) : "" }}</span></td>
        <td>
          <div class="field is-grouped">
            <div class="control">
              <router-link
                :to="{ name: 'blockDetails', params: { id: block.block_id } }"
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
    </div>
  </div>
</template>

<script>
import { fetchWorker, fetchTransfersByWorker, fetchBlockCutsByWorker } from '@/lib/api';
import { dateToLocaleDateString, countInvWarehouseItemVolume, totalVolumeOrderItems, ltBlockStatus } from '@/lib/ui';

export default {
  name: 'WorkerDetails',
  props: {
    id: String,
  },
  data() {
    return {
      worker: {
        name: "",
      },
      blocks: [],
      blockCuts: [],
      transfers: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchWorker(this.id).then((res) => {
        console.log(res);
        this.worker = res.data;
        this.blocks = this.worker.blocks.reverse();
        
        fetchBlockCutsByWorker(this.id).then((res) => {
          this.blockCuts = res.data.reverse();
        });
      
        fetchTransfersByWorker(this.id).then((res) => {
          this.transfers = res.data;
        });
      });
    },
    
    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    totalVolumeOrderItems(datetime) {
      return totalVolumeOrderItems(datetime);
    },

    ltBlockStatus(status) {
      return ltBlockStatus(status);
    },

    countInvWarehouseItemVolume(warehouseItem) {
      return countInvWarehouseItemVolume(warehouseItem);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

