<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Darbuotojai</h1>
    </div>

    <div class="block has-background-light p-5">
      <router-link
        :to="{
          name: 'workerNew',
        }"
        class="button is-link"
        >Naujas darbuotojas</router-link
      >
    </div>

    <div class="block">
       <data-table :rowsPerPage="10" :list="workers" @dataSlice="data => this.data = data">
  <template #head>
        <tr>
          <th>Darbuotojo Nr.</th>
          <th>Vardas</th>
          <th>Veiksmai</th>
        </tr>
        </template>

  <template #body>
        <tr v-for="worker in data" v-bind:key="worker.worker_id">
          <td><router-link
          :to="{ name: 'workerDetails', params: { id: worker.worker_id } }"
          class="tag is-light is-info"
          >{{ worker.worker_id }}</router-link
        ></td>
          <td>{{ worker.name }}</td>
          <td>
            <div class="field is-grouped">
              <div class="control">
                <router-link
                  :to="{ name: 'workerEdit', params: { id: worker.worker_id } }"
                  class="button is-light"
                  >Koreguoti</router-link
                >
              </div>
              <div class="control">
                <router-link
                  :to="{
                    name: 'workerDetails',
                    params: { id: worker.worker_id },
                  }"
                  class="button is-light"
                  >Darbai</router-link
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
import { fetchWorkers } from '@/lib/api';

export default {
  name: 'WorkerList',
  data() {
    return {
      workers: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchWorkers().then((res) => {
        this.workers = res.data;
      });
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

