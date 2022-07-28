<template>
  <div class="container">
<div class="block">
      <h3 class="is-size-3">Kainoraščiai</h3>
    </div>
    <div class="block has-background-light p-5">
      <router-link
                :to="{
                  name: 'priceListNew'
                }"
                class="button is-link"
                >Naujas kainoraštis</router-link
              >
    </div>

    <div class="block">
      <data-table :rowsPerPage="10" :list="priceLists" @dataSlice="data => this['data' + 'PriceLists'] = data">
  <template #head>
          <tr>
            <th><label>Kainoraščio<br>Nr.</label></th>
            <th><label>Pasirinkimų<br>sąraše</label></th>
            <th><label>Pavadinimas</label></th>
            <th><label>Papildomas aprašas</label></th>
            <th><label>Kainoraščio<br>data</label></th>
            <th><label>Užsakymai</label></th>
            <th><label>Veiksmai</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="priceList in dataPriceLists" v-bind:key="priceList.price_list_id">
            <td>
              <router-link
          :to="{ name: 'priceListDetails', params: { id: priceList.price_list_id } }"
          class="tag is-light is-info"
          >{{ priceList.price_list_id }}</router-link>
          </td>
            <td>{{ ltEnabled(priceList.enabled) }}</td>

            <td>{{ priceList.name }}</td>
            <td>{{ priceList.note }}</td>

            <td>{{ dateToLocaleDateString(priceList.price_list_date) }}</td>

            <td><div class="tag">{{ priceList.orders.length }}</div></td>

            <td>
              <div class="field is-grouped"> 
                <div class="control">
                  <router-link
                    :to="{ name: 'priceListDetails', params: { id: priceList.price_list_id } }"
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
  </div>
</template>

<script>
import { fetchPriceLists, } from '@/lib/api';
import { dateToLocaleDateString, ltEnabled } from '@/lib/ui';

export default {
  name: 'PricesList',
  data() {
    return {
      priceLists: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchPriceLists().then((res) => {
        this.priceLists = res.data;
      });
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    ltEnabled(enabled) {
      return ltEnabled(enabled);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

