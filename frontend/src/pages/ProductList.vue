<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Produktai</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
          <router-link :to="{ name: 'productClassList' }" class="button is-link"
          >Produktų klasės</router-link
          >
        </div>
        <div class="control">
          <router-link :to="{ name: 'productSizesList' }" class="button is-link"
          >Produktų matmenys</router-link
          >
        </div>
        <div class="control">
          <router-link :to="{ name: 'productNew' }" class="button is-link"
          >Pridėti naują produktą</router-link
          >
        </div>
      </div>
    </div>

    <div class="block">
      <h1 class="is-size-4">Visi produktai</h1>
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
  </div>
</template>

<script>
import { fetchBlueprints } from '@/lib/api';
import { countVolumeBlueprint, sortBlueprintsByActualSizes } from '@/lib/ui';

export default {
  name: 'ProductList',
  data() {
    return {
      blueprints: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchBlueprints().then((res) => {
        this.blueprints = (sortBlueprintsByActualSizes(res.data).reverse()).sort((a, b) => a.product_class_id - b.product_class_id).reverse();
      });
    },
    countVolumeBlueprint(orders) {
      return countVolumeBlueprint(orders);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

