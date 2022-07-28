<template>
  <div class="container">
    <h1 class="is-size-3">Transporto ({{ form.number }}) informacija</h1>
    <table class="table">
      <div class="field is-grouped is-grouped-right">
    
  </div>
  <div class="field is-grouped is-grouped-left">
    <div class="control">
 <label class="label" for="name">Valstyb. Nr.:</label>
      <div class="control">
    <input class="input" :class="errors.number && 'is-danger'" type="text" v-model="form.number" disabled>
    </div>
    </div>
    <div class="control">
      <label class="label" for="name">Markė:</label>
      <div class="control">
    <input class="input" :class="errors.name && 'is-danger'" type="text" v-model="form.name" disabled>
    </div>
    </div>
  </div>
  <div class="control">
    <div class="control">
                <router-link
                  :to="{ name: 'transportList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
  </div>
</table>
<div class="block">
      <h3 class="is-size-4">Priskirti važtaraščiai</h3>
    </div>
<data-table :rowsPerPage="10" :list="transfers" @dataSlice="data => this.data = data">
  <template #head>
      <tr>
        <th><label>Užsakymo Nr.</label></th>
        <th><label>Klientas</label></th>
        <th><label>VAZ&nbsp;Nr.</label></th>
        <th><label>Pristatymo&nbsp;data</label></th>
        <th><label>Transportas</label></th>
        <th><label>Vairuotojas</label></th>
        <th><label>Produktai</label></th>
        <th><label>Kiekis (m3)</label></th>
        <th><label>Veiksmai</label></th>
      </tr>
       </template>

  <template #body>
      <tr v-for="transfer in data" v-bind:key="transfer.transfer_id">
        <td><router-link
          :to="{ name: 'orderDetails', params: { id: transfer.order.order_id } }"
          class="tag is-light is-info"
          >{{ transfer.order.order_id }}</router-link
        ></td>
        <td>{{ transfer.order.client.name }}</td>
        <td>{{ transfer.vaz_number }}</td>
        <td>{{ transfer.invoice_date ? dateToLocaleDateString(transfer.invoice_date) : dateToLocaleDateString(transfer.order.delivery_date) }}</td>
        <td>{{ transfer?.transport?.name }} {{ transfer?.transport?.number }}</td>
        <td>{{ transfer?.worker?.name }}</td>
        <td><div class="tag">{{ transfer?.transfer_items?.length }}</div></td>
        <td>
          <span class="tag is-light">{{
            Math.round(totalVolumeOrderItems(transfer.transfer_items)*
                1000,
            ) / 1000
          }}</span>
        </td>
        <td>
          <button class="button is-light" @click="invoice(transfer.transfer_id)">
            Nuoroda
          </button>
        </td>
      </tr>
    </template>
</data-table>
  <br>
  </div>
</template>

<script>
import { fetchTransfersByTransport, fetchTransport } from '@/lib/api';
import { totalVolumeOrderItems, dateToLocaleDateString } from '@/lib/ui';

export default {
  name: 'TransportDetails',
  props: {
    id: String
  },
  data() {
    return {
      form: {
        name: "",
        number: ""
      },
      errors: {},
      transfers: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchTransport(this.id).then(res => {
        this.form = res.data;
      });
      fetchTransfersByTransport(this.id).then((res) => {
        this.transfers = res.data;
      });
    },

    invoice(transfer_id) {
      window.open(
        'http://' +
          window.location.hostname +
          ':3000/api/transfers/' +
          transfer_id +
          '/invoice',
      );
    },

    totalVolumeOrderItems(orderItems) {
      return totalVolumeOrderItems(orderItems);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
      errors.forEach(error => labels[error.property] = error.constraints);
      this.errors = labels;
    },

  },
};
</script>

