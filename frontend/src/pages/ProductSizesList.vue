<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Produktų matmenys</h1>
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
          <router-link :to="{ name: 'productNewSize' }" class="button is-link"
          >Pridėti produktų matmenis</router-link
          >
        </div>
      </div>
    </div>

    <div class="block">
       <data-table :rowsPerPage="10" :list="productSizes" @dataSlice="data => this.data = data">
  <template #head>
        <tr>
          <th>X (mm)</th>
          <th>Y (mm)</th>
          <th>Z (mm)</th>
          <th>Produktai</th>
          <th>Veiksmai</th>
        </tr>
        </template>

  <template #body>
        <tr v-for="(productSizes, index) in data" v-bind:key="index">
          <td><div class="tag">{{ productSizes.x_mm }}</div></td>
          <td><div class="tag">{{ productSizes.y_mm }}</div></td>
          <td><div class="tag">{{ productSizes.z_mm }}</div></td>
          <td><div class="tag">{{ productSizes.blueprints.length }}</div></td>
          <td>
            <div class="control">
              <router-link
                :to="{
                  name: 'productSizeDetailsList',
                  params: { id: productSizes.product_size_id },
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
import { fetchProductSizes } from '@/lib/api';

export default {
  name: 'ProductSizesList',
  data() {
    return {
      productSizes: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductSizes().then((res) => {
        this.productSizes = res.data.reverse();
      });
    },

  },
};
</script>

