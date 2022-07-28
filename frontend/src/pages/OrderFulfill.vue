<template>
  <div class="container">
    <h1 class="is-size-3">Užsakymo produktų užpildymas</h1>
<table class="table">
   <tr><td>
<div class="field is-grouped">
  <div class="control">
          <label class="label" for="order_id">Užsakymo Nr.:</label>
          <input class="input" :class="errors.order_id && 'is-danger'" type="number" v-model="form.order_id" disabled>
        </div>
        <div class="control">
      <label class="label" for='client_id'>Klientas</label>
    <div class="control select" :class="errors.client_id && 'is-danger'">
      <select
              v-model="form.client_id"
              @change="onChangeClient()"
              disabled
            >
              <option value="0" selected>Pasirinkti</option>
              <option
                v-for="(client, index) in clients"
                v-bind:key="index"
                :value="client.client_id"
              >
                {{ client.name }} 
              </option>
            </select>
    </div>
    </div>
    <div class="control">
      <label class="label" for='form.status'>Būsena</label>
    <div class="control select">
      
      <select v-model='form.status' disabled >
          <option value='open'>Eilėje</option>
          <option value='wip'>Vykdomas</option>
          <option value='done'>Įvykdytas</option>
          <option value='void'>Negaliojantis</option>
      </select>
    </div>
    </div>
    <div class="control">
    <br>
      <div class="field is-grouped">
        <div v-if="status !='done'" class="control">
          &nbsp;&nbsp;<input class="button is-danger" type='submit' @click="postForm('completeOrder')" value='Įvykdyti'/>
        </div>
        <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Grįžti</a></div>
      </div>
      
    </div>
  </div>
  </td></tr>
<tr><td>
<table class="table is-fullwidth">
      <thead>
        <tr>
          <th><label>Klasė</label></th>
          <th><label>Dydis</label></th>
          <th><label>Kiekis (vnt.)</label></th>
          <th><label>Kiekis (m3)</label></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(productRow, index) in productRows" v-bind:key="index">
          <td>
            <div class="select" :class="errors['product_' + productRow.blueprint_id] && 'is-danger'">
            <select
              @change="onChangeProductClass(index)"
              v-model="productRow.product_class_id"
              disabled
            >
              <option value="0" selected>Pasirinkti</option>
              <option
                v-for="(product_class, index) in product_classes"
                v-bind:key="index"
                :value="product_class.product_class_id"
              >
                {{ product_class.name }}
              </option>
            </select>
            </div>
          </td>
          <td>
            <div class="select" :class="errors['product_' + productRow.blueprint_id] && 'is-danger'">
            <select
              @change="onChangeBlueprint(index)"
              v-model="productRow.blueprint_id"
              disabled
            >
              <option value="0" selected>Pasirinkti</option>
              <option
                v-for="(blueprint, index) in productRow.blueprints"
                v-bind:key="index"
                :value="blueprint.blueprint_id"
              >
                {{ blueprint.product_size.x_mm }} x
                {{ blueprint.product_size.y_mm }} x
                {{ blueprint.product_size.z_mm }}
              </option>
            </select>
            </div>
          </td>
          <td>
            <input
            :disabled="status == 'done'"
              v-model="productRow.quantity"
              @change="onChangeQuantity(index)"
              class="input"
              type="number"
              :class="errors['product_' + productRow.blueprint_id] && 'is-danger'"
              step="1"
              min="0"
              :max="productRow.max"
            />
          </td>
          <td>
            <input
            :disabled="status == 'done'"
              v-model="productRow.quantityM3"
              @change="onChangeQuantityM3(index)"
              class="input"
              type="number"
              :class="errors['product_' + productRow.blueprint_id] && 'is-danger'"
              min="0"
              :step="productRow.step"
              :max="productRow.maxm3"
            />
          </td>
        </tr>
            <tr>
              <td colspan="4">
                <div class="field is-grouped is-grouped-right">
                  <div class="control" style="margin-top: 10px;">
                    <b>Iš viso: </b><span class="tag is-light">{{ volume }}</span>&nbsp;<b>(m3)</b>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
    </table>
</td></tr>
</table>
   <br>
  </div>
</template>

<script>
import { fetchTransports, fetchOrder, fetchBlueprintsByClass, fetchProductClasses, fetchClients, fetchBlueprint, fulfillOrder, fetchClient } from '@/lib/api';
import { dateToLocaleString } from '@/lib/ui';

export default {
  name: 'OrderFulfill',
  props: {
    id: String,
  },
  data() {
    return {
      product_classes: [],
      productRows: [],
      clients: [],
      status: "",
      client: {},
      form: {
        order_id: "",
        client_id: 0,
        status: "open",
      },
      volume: 0,
      done: false,
      errors:{}
    };
  },

  created() {
    this.load();
  },

  methods: {
    addProductRow(orderItem) {
      const productRow = {
        order_item_id: 0,
        product_class_id: 0,
        blueprints: [],
        blueprint_id: 0,
        quantity: 0,
        quantityM3: 0,
        step: 0.001,
        max: 1,
      }
      if (!orderItem)
      return this.productRows.push(productRow);
      productRow.product_class_id = orderItem.blueprint.product_class_id;
      productRow.blueprint_id = orderItem.blueprint_id;
      productRow.order_item_id = orderItem.order_item_id;
      productRow.quantity = orderItem.count;
      productRow.max = orderItem.count;
      fetchBlueprintsByClass(productRow.product_class_id).then((res) => {
        productRow.blueprints = res.data;
        fetchBlueprint(productRow.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        productRow.step = m3;
        productRow.quantityM3 = Math.round(productRow.quantity * m3 * 1000) / 1000;
        productRow.maxm3 = productRow.quantityM3;

        this.productRows.push(productRow);
        if (this.productRows.length >= this.form.order_items.length)
        this.done = true;
        this.getTotalVolume();
        });
      });
    },

    load() {
      fetchTransports().then((res) => {
        this.transports = res.data;
      });
      fetchProductClasses().then((res) => {
        this.product_classes = res.data;
      });
      fetchClients().then((res) => {
        this.clients = res.data;
      });
      fetchOrder(this.id).then((res) => {
        this.form = res.data;
        this.onChangeClient();
        this.status = this.form.status;
        this.form.delivery_date = dateToLocaleString(res.data.delivery_date);
        if (this.form.order_items.length == 0 && this.status != "done")
        this.addProductRow();
        this.form.order_items.forEach(orderItem => this.addProductRow(orderItem));
      });
    },

    checkProductRowCountMax() {
      const errors = [];
      for (let productRowIndex = 0; productRowIndex < this.productRows.length; productRowIndex++) {
        if ((this.productRows[productRowIndex].quantity > this.productRows[productRowIndex].max) || (this.productRows[productRowIndex].quantity < 0))
        errors.push({
          property: 'product_' + this.productRows[productRowIndex].blueprint_id,
          constraints: 'product_' + this.productRows[productRowIndex].blueprint_id,
        });
      }
      return errors
    },

    removeProductRow(index) {
      if (this.form.status == "done") return;
      if (this.productRows.length > 1) this.productRows.splice(index, 1);
    },

    getTotalVolume() {
      let volume = 0;
      for (let productRowIndex = 0; productRowIndex < this.productRows.length; productRowIndex++) {
        const productRow = this.productRows[productRowIndex];
        volume += productRow.quantityM3;
      }
      this.volume = Math.round(volume * 1000) / 1000; // this.volume = ..
    },

    onChangeClient() {
      fetchClient(this.form.client_id).then((res) => {
        this.client = res.data;
      });
    },

    onChangeProductClass(index) {
      fetchBlueprintsByClass(this.productRows[index].product_class_id).then((res) => {
        const blueprints = res.data;
        this.productRows[index].blueprints = blueprints;
        if (this.productRows[index].product_class_id != 0) return;
        this.productRows[index].blueprint_id = 0;
        this.onChangeBlueprint(index);
      });
      this.productRows[index].blueprint_id = 0;
      this.onChangeBlueprint(index);
    },

    onChangeBlueprint(index) {
      const productRow = this.productRows[index];

      if (this.productRows[index].blueprint_id != 0)
      fetchBlueprint(productRow.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.productRows[index].step = m3;
        this.productRows[index].quantityM3 = Math.round(this.productRows[index].quantity * this.productRows[index].step * 1000) / 1000;
        this.getTotalVolume();
      });

      if (this.productRows[index].blueprint_id == 0)
      {
        this.productRows[index].step = 0.001;
        this.productRows[index].quantityM3 = Math.round(this.productRows[index].quantity * this.productRows[index].step * 1000) / 1000;
        this.getTotalVolume();
      }
    },

    onChangeQuantity(index) {
      const productRow = this.productRows[index];

      if (this.productRows[index].blueprint_id != 0)
      fetchBlueprint(productRow.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.productRows[index].quantityM3 =
          Math.round(m3 * productRow.quantity * 1000) / 1000;
        this.getTotalVolume();
      });

      if(this.productRows[index].blueprint_id == 0)
      this.productRows[index].quantityM3 = Math.round(productRow.quantity * 0.001 * 1000) / 1000;
      this.getTotalVolume();
    },

    onChangeQuantityM3(index) {
      const productRow = this.productRows[index];

      if (this.productRows[index].blueprint_id != 0)
      fetchBlueprint(productRow.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.productRows[index].quantity =
          Math.round((productRow.quantityM3 / m3) * 1000) / 1000;
        this.getTotalVolume();
      });

      if(this.productRows[index].blueprint_id == 0)
      this.productRows[index].quantity = Math.round(productRow.quantityM3 / 0.001 * 1000) / 1000;
      this.getTotalVolume();
    },

   parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
      errors.forEach(error => labels[error.property] = error.constraints);
      this.errors = labels;
    },

    postForm() {
      this.form.completeOrder = true;
      this.form.productRows = this.productRows;
      if (this.checkProductRowCountMax().length > 0) this.parseErrors(this.checkProductRowCountMax());
      if (this.checkProductRowCountMax().length == 0)
      fulfillOrder(this.id, this.form)
        .then(res => {
          const content = res.data;
          this.parseErrors(content.errors);
          if (content.errors.length != 0) return;
          this.$router.push({ name: 'orderDetails', params: { id: this.id } });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

