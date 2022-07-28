<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Produktai ({{ product_class.name }} - {{ product_class.days_to_dry }}D)</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'productClassList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
      </div>
    </div>

<tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
        <tab name="Produktai">
    <div class="block">
      <h1 class="is-size-4">Produktai</h1>
       <data-table :rowsPerPage="10" :list="blueprints" @dataSlice="data => this.data = data">
  <template #head>
        <tr>
          <th>Produkto Nr.</th>
          <th>Produkto klasė</th>
          <th>X (mm) - Y (mm) - Z (mm)</th>
          <th>Vnt. (m3)</th>
          <th>Veiksmai</th>
        </tr>
        </template>

  <template #body>
        <tr v-for="(blueprint, index) in data" v-bind:key="index">
          <td>
            <div class="control">
              <router-link
                :to="{
                  name: 'productDetails',
                  params: { id: blueprint.blueprint_id },
                }"
                class="tag is-link is-light"
                >{{ blueprint.blueprint_id }}</router-link
              >
            </div>
            </td>
          <td><div class="tag">{{ blueprint.product_class.name }}</div></td>
          <td>
            &nbsp;
            <div class="tag">{{ blueprint.product_size.x_mm }}</div>&nbsp;x&nbsp;
            <div class="tag">{{ blueprint.product_size.y_mm }}</div>&nbsp;x&nbsp;
            <div class="tag">{{ blueprint.product_size.z_mm }}</div>
          </td>
          <td>
            <span class="tag is-light">{{
              countVolumeBlueprint(blueprint)
            }}</span>
          </td>
          <td>
            <div class="control">
              <router-link
                :to="{
                  name: 'productDetails',
                  params: { id: blueprint.blueprint_id },
                }"
                class="button is-light"
                >Praplesti</router-link
              >
            </div>
          </td>
        </tr>
      </template>
</data-table>
  <br>
    </div>
    </tab>
        
        <tab name="Blokai">
    <div class="block">
      <h1 class="is-size-4">Blokai (Eilėje)</h1>
<data-table :rowsPerPage="5" :list="blocksQueue" @dataSlice="data => this.dataQueue = data">
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
    <tr v-for="block in dataQueue" v-bind:key="block.block_id">
      <td>
        <router-link
          :to="{ name: 'blockDetails', params: { id: block.block_id } }"
          class="tag is-light is-info"
          >{{ block.block_id }}</router-link
        >
      </td>
      <td><div class="tag">{{ block.product_class.name }}</div></td>
      <td>
        {{ dateToLocaleDateString(block.drying_started_at) }}
      </td>
      <td>
        {{ dateToLocaleDateString(block.drying_ends_at) }}
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
            :to="{ name: 'blockEdit', params: { id: block.block_id } }"
            class="button is-light"
            >Koreguoti</router-link
            >
          </div>
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
    </div>

  <div class="block">
<h1 class="is-size-4">Blokai (Džiovinami)</h1>
<data-table :rowsPerPage="5" :list="blocksDrying" @dataSlice="data => this.dataDrying = data">
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
    <tr v-for="block in dataDrying" v-bind:key="block.block_id">
      <td>
        <router-link
          :to="{ name: 'blockDetails', params: { id: block.block_id } }"
          class="tag is-light is-info"
          >{{ block.block_id }}</router-link
        >
      </td>
      <td><div class="tag">{{ block.product_class.name }}</div></td>
      <td>
        {{ dateToLocaleDateString(block.drying_started_at) }}
      </td>
      <td>
        {{ dateToLocaleDateString(block.drying_ends_at) }}
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
            :to="{ name: 'blockEdit', params: { id: block.block_id } }"
            class="button is-light"
            >Koreguoti</router-link
            >
          </div>
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
    </div>
</tab>
    </tabs>
  </div>
</template>

<script>
import { fetchProductClass, fetchBlueprintsByClass, fetchBlocksByClassDrying, fetchBlocksByClassQueue } from '@/lib/api';
import { countVolumeBlueprint, sortBlueprintsByActualSizes, dateToLocaleDateString, ltBlockStatus } from '@/lib/ui';

export default {
  name: 'ProductClassDetailsList',
  props: {
    id: String
  },
  data() {
    return {
      product_class: {
        name: ""
      },
      blueprints: [],
      blocksDrying: [],
      blocksQueue: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductClass(this.id).then((res) => {
        this.product_class = res.data;
      });
      fetchBlueprintsByClass(this.id).then((res) => {
        this.blueprints = sortBlueprintsByActualSizes(res.data).reverse();
      });
      fetchBlocksByClassDrying(this.id).then((res) => {
        this.blocksDrying = res.data.reverse();
      });
      fetchBlocksByClassQueue(this.id).then((res) => {
        this.blocksQueue = res.data.reverse();
      });
    },

    ltBlockStatus(status) {
      return ltBlockStatus(status);
    },

    countVolumeBlueprint(orders) {
      return countVolumeBlueprint(orders);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

  },
};
</script>

