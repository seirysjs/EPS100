<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Produktai ({{ product_size.x_mm }}x{{ product_size.y_mm }}x{{ product_size.z_mm }})</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'productSizesList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
      </div>
    </div>
    <div class="block">
      <h1 class="is-size-4">Produktai</h1>
       <data-table :rowsPerPage="10" :list="blueprints" @dataSlice="data => this.data = data">
  <template #head>
        <tr>
          <th>Produkto Nr.</th>
          <th>Produkto klasė</th>
          <th>X (mm)</th>
          <th>Y (mm)</th>
          <th>Z (mm)</th>
          <th>Vnt. (m3)</th>
          <th>Veiksmai</th>
        </tr>
        </template>

  <template #body>
        <tr v-for="(blueprint, index) in data" v-bind:key="index">
          <td><div class="control">
              <router-link
                :to="{
                  name: 'productDetails',
                  params: { id: blueprint.blueprint_id },
                }"
                class="tag is-link is-light"
                >{{ blueprint.blueprint_id }}</router-link
              >
            </div></td>
          <td><div class="tag">{{ blueprint.product_class.name }}</div></td>
          <td><div class="tag">{{ blueprint.product_size.x_mm }}</div></td>
          <td><div class="tag">{{ blueprint.product_size.y_mm }}</div></td>
          <td><div class="tag">{{ blueprint.product_size.z_mm }}</div></td>
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
  </div>
</template>

<script>
import { fetchProductSize, fetchBlueprintsBySize } from '@/lib/api';
import { countVolumeBlueprint, sortBlueprintsByActualSizes } from '@/lib/ui';

export default {
  name: 'ProductSizeDetailsList',
  props: {
    id: String
  },
  data() {
    return {
      product_size: {
        x_mm: "",
        y_mm: "",
        z_mm: "",
      },
      blueprints: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductSize(this.id).then((res) => {
        this.product_size = res.data;
      });
      fetchBlueprintsBySize(this.id).then((res) => {
        this.blueprints = sortBlueprintsByActualSizes(res.data).reverse();
      });
    },
    countVolumeBlueprint(orders) {
      return countVolumeBlueprint(orders);
    },

  },
};
</script>

