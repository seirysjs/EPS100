<template>
  <div class="container">
<div class="block">
      <h3 class="is-size-3">Važtaraščiai</h3>
    </div>

    <div class="block">
      <data-table :rowsPerPage="10" :list="transfers" @dataSlice="data => this['data' + 'Transfers'] = data">
  <template #head>
          <tr>
            <th><label>Užsakymo&nbsp;Nr.,<br>Važtaraščio&nbsp;Nr.</label></th>
            <th><label>VAZ Nr.</label></th>
            <th><label>Klientas</label></th>
            <th><label>Dok. data</label></th>
            <th><label>Produktai</label></th>
            <th><label>Kiekis<br>(m3)</label></th>            
            <th><label>Transportas</label></th>
            <th><label>Vairuotojas</label></th>
            <th><label>Veiksmai</label></th>
          </tr>
        </template>

  <template #body>
          <tr v-for="transfer in dataTransfers" v-bind:key="transfer.transfer_id">
            <td><router-link
          :to="{ name: 'orderDetails', params: { id: transfer.order.order_id } }"
          class="tag is-light is-info"
          >{{ transfer.order.order_id }}</router-link
        >
         - <router-link
          :to="{ name: 'orderInvoiceEdit', params: { id: transfer.transfer_id } }"
          class="tag is-light is-primary"
          >{{ transfer.transfer_id }}</router-link
        ></td>
            <td>{{ transfer.vaz_number }}</td>
            <td>{{ transfer.order.client.name }}</td>

            <td>{{ dateToLocaleDateString(transfer.invoice_date) }}</td>

            <td><div style="text-align: right;"><div class="tag">{{ transfer.transfer_items.length }}</div></div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(totalVolumeOrderItems(transfer.transfer_items)*
                    1000,
                ) / 1000
              }}</span>
            </td>

            <td>{{ transfer?.transport?.name }} {{ transfer?.transport?.number }}</td>
            <td>{{ transfer?.worker?.name }}</td>
            
            <td>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-light" @click="invoice(transfer.transfer_id)">
                    Nuoroda
                  </button>
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
import { fetchTransfers, } from '@/lib/api';
import { totalVolumeOrderItems, dateToLocaleDateString, } from '@/lib/ui';

export default {
  name: 'OrderInvoiceList',
  data() {
    return {
      transfers: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchTransfers().then((res) => {
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

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

