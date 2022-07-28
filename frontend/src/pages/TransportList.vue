<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Transportas</h1>
    </div>
    <div class="block has-background-light p-5">
      <router-link
                :to="{
                  name: 'transportNew'
                }"
                class="button is-link"
                >Nauja transporto priemonė</router-link
              >
    </div>
    
    <div class="block">
       <data-table :rowsPerPage="10" :list="transports" @dataSlice="data => this.data = data">
  <template #head>
      <tr>
        <th>Valstyb. Nr.</th>
        <th>Markė</th>
        <th>Veiksmai</th>
      </tr>
      </template>

  <template #body>
      <tr v-for="transport in data" v-bind:key="transport.transport_id">
        <td>{{ transport.number }}</td>
        <td>{{ transport.name }}</td>
        <td>
          <div class="field is-grouped">
            <div class="control">
              <router-link
                :to="{ name: 'transportEdit', params: { id: transport.transport_id } }"
                class="button is-light"
                >Koreguoti</router-link
              >
            </div>
            <div class="control">
              <router-link
                :to="{
                  name: 'transportDetails',
                  params: { id: transport.transport_id },
                }"
                class="button is-light"
                >Praplesti</router-link
              >
            </div>
          </div>
        </td>
      </tr>
      </template>
</data-table>
  <br>
    </div>

    <table class="table"></table>
  </div>
</template>

<script>
import { fetchTransports } from '@/lib/api';

export default {
  name: 'TransportList',
  data() {
    return {
      transports: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchTransports().then((res) => {
        this.transports = res.data;
      });
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

