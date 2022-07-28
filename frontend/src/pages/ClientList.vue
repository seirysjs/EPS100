<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Klientai</h1>
    </div>

    <div class="block has-background-light p-5">
      <router-link :to="{ name: 'clientNew' }" class="button is-link"
        >Pridėti naują klientą</router-link
      >
    </div>

    <div class="block">
       <data-table :rowsPerPage="10" :list="clients" @dataSlice="data => this.data = data">
  <template #head>
        <tr>
          <th>Klientas</th>
          <th>Užsakymai <br> <span class="tag is-light">Eilėje</span></th>
          <th>Užsakymai <br> <span class="tag is-light is-warning">Vykdomi</span></th>
          <th>Užsakymai <br> <span class="tag is-light">Visi</span></th>
          <th>Veiksmai</th>
        </tr>
        </template>

  <template #body>
        <tr v-for="client in data" v-bind:key="client.client_id">
          <td>{{ client.name }}</td>
          <td><div class="tag">{{ ordersInQueueCount(client.orders) }}</div></td>
          <td><div class="tag is-light is-warning">{{ ordersInWIPCount(client.orders) }}</div></td>
          <td><div class="tag">{{ client.orders.length }}</div></td>
          <td>
            <div class="field is-grouped">
              <div class="control">
                <router-link
                  :to="{
                    name: 'clientDetails',
                    params: { id: client.client_id },
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
  </div>
</template>

<script>
import { fetchClients } from '@/lib/api';
import { ordersInQueueCount, ordersInWIPCount } from '@/lib/ui';

export default {
  name: 'ClientList',
  data() {
    return {
      clients: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchClients().then((res) => {
        this.clients = res.data;
      });
    },
    ordersInQueueCount(orders) {
      return ordersInQueueCount(orders);
    },
    ordersInWIPCount(orders) {
      return ordersInWIPCount(orders);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

