<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Produktų klasės</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'productList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
        <div class="control">
          <router-link :to="{ name: 'productNewClass' }" class="button is-link"
          >Pridėti produktų klasę</router-link
          >
        </div>
      </div>
    </div>

    <div class="block">
       <data-table :rowsPerPage="10" :list="productClasses" @dataSlice="data => this.data = data">
  <template #head>
        <tr>
          <th>Produkto klasė</th>
          <th>Džiovinimo terminas<br>(D.)</th>
          <th>Blokai (Džiovinami)<br>(vnt. + m3)</th>
          <th>Blokai (Eilėje)<br>(vnt. + m3)</th>
          <th>Produktai</th>
          <th>Veiksmai</th>
        </tr>
        </template>

  <template #body>
        <tr v-for="(product_class, index) in data" v-bind:key="index">
          <td><div class="tag">{{ product_class.name }}</div></td>
          <td><div class="tag">{{ product_class.days_to_dry }}</div></td>
          <td>
            <div class="tag">
              x{{ groupByKey(product_class.blocks, "drying") }}
            </div>
            &nbsp;
            <div class="tag is-light is-warning">
              {{ roundNumber(groupByKey(product_class.blocks, "drying")*4.8) }}
            </div>
          </td>
          <td>
            <div class="tag">
              x{{ groupByKey(product_class.blocks, "queue") }}
            </div>
            &nbsp;
            <div class="tag is-light is-success">
              {{ roundNumber(groupByKey(product_class.blocks, "queue")*4.8) }}
            </div>
          </td>
          <td><div class="tag">{{ product_class.blueprints.length }}</div></td>
          <td>
            <div class="control">
              <router-link
                :to="{
                  name: 'productClassDetailsList',
                  params: { id: product_class.product_class_id },
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
  </div>
</template>

<script>
import { fetchProductClasses } from '@/lib/api';
import { groupByKey, roundNumber } from '@/lib/ui';

export default {
  name: 'ProductClassList',
  data() {
    return {
      productClasses: [],
      blocksDrying: [],
      blocksQueue: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductClasses().then((res) => {
        this.productClasses = res.data.reverse();
      });
    },
    
    groupByKey(blocksInput = [], statusType = "drying") {
      const groupedBlocks = groupByKey(blocksInput, "status")[statusType];
      return (groupedBlocks) ? groupedBlocks.length : 0;
    },

    roundNumber(value) {
      return roundNumber(value);
    },

  },
};
</script>

