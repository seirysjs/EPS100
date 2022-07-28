<template>
  <div class="container">
    <h1 class="is-size-3">Naujas užsakymas</h1>
<table class="table">
  <tr><td>
<div class="field is-grouped">
  <div class="control">
          <label class="label" for="order_id">Užsakymo Nr.:</label>
          <input class="input" :class="errors.order_id && 'is-danger'" type="number" v-model="form.order_id">
        </div>
          <div class="control">
      <label class="label" for='client_id'>Klientas</label>
    <div class="control select" :class="errors.client_id && 'is-danger'">
      <select
              v-model="form.client_id"
              @change="onChangeClient()"
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
      
      <select v-model='form.status'>
          <option value='open'>Eilėje</option>
          <option value='wip'>Vykdomas</option>
          <option value='done'>Įvykdytas</option>
          <option value='void'>Negaliojantis</option>
      </select>
    </div>
    </div>
    <div class="control">
      <label class="label" for='client_id'>Kainoraštis</label>
    <div class="control select" :class="errors.price_list_id && 'is-danger'">
      <select
              v-model="form.price_list_id"
            >
              <option value="null" selected>Pasirinkti</option>
              <option
                v-for="(priceList, index) in priceLists"
                v-bind:key="index"
                :value="priceList.price_list_id"
              >
                ({{ priceList.price_list_id }}) {{ priceList.name }} 
              </option>
            </select>
    </div>
    </div>
  </div>
  </td></tr>
    <tr><td>
  <div class="field is-grouped">
    <div class="control">
            <label class="label" for='drying_started_at'>Pristatymo data:</label>
          <input class="input" :class="errors.delivery_date && 'is-danger'" type="datetime-local" v-model="form.delivery_date">
          </div>
     <div class="control">
      <label class="label" for='form.transport_id'>Transportas</label>
    <div class="control select" :class="errors.transport_id && 'is-danger'">
      <select
              v-model="form.transport_id"
            >
              <option value="" selected>Pasirinkti</option>
              <option
                v-for="(transport, index) in transports"
                v-bind:key="index"
                :value="transport.transport_id"
              >
                {{ transport.number }} {{ transport.name }} 
              </option>
            </select>
    </div>
  </div>
    <div class="control">
      <label class="label" for="city">Pastaba:</label>
      <input class="input" :class="errors.note && 'is-danger'" style="width: 240px;" type="text" v-model="form.note">
    </div>
  </div>

  </td></tr>
  <tr>
  <td>
  <div class="field">
  <div class="columns">
  <div class="column">
      <h3 class="is-size-4">* Iškrovimo vieta:</h3>
    <div class="field is-grouped">
    <div class="column">
      <label class="label" for="address">Gatvė:</label>
    <div class="control">
      <input class="input" :class="errors.address && 'is-danger'" style="width: 180px;" type="text" v-model="form.address" :placeholder="client.address">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Miestas:</label>
    <div class="control">
      <input class="input" :class="errors.city && 'is-danger'" style="width: 180px;" type="text" v-model="form.city" :placeholder="client.city">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Pašto kodas:</label>
    <div class="control">
      <input class="input" :class="errors.postal_code && 'is-danger'" style="width: 180px;" type="text" v-model="form.postal_code" :placeholder="client.postal_code">
    </div>
  </div>
  <div class="column">
    <label class="label" for="country">Šalis:</label>
    <div class="control">
      <input class="input" :class="errors.country && 'is-danger'" style="width: 180px;" type="text" v-model="form.country" :placeholder="client.country">
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </td>
</tr>
<tr>
  <td>
  <div class="field">
  <div class="columns">
  <div class="column">
      <h3 class="is-size-4">* Pakrovimo vieta:</h3>
    <div class="field is-grouped">
    <div class="column">
      <label class="label" for="address">Gatvė:</label>
    <div class="control">
      <input class="input" :class="errors.laddress && 'is-danger'" style="width: 180px;" type="text" v-model="form.laddress" placeholder="Žibilėlio g. 8">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Miestas:</label>
    <div class="control">
      <input class="input" :class="errors.lcity && 'is-danger'" style="width: 180px;" type="text" v-model="form.lcity" placeholder="Užventė">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Pašto kodas:</label>
    <div class="control">
      <input class="input" :class="errors.lpostal_code && 'is-danger'" style="width: 180px;" type="text" v-model="form.lpostal_code" placeholder="Mažeikių r.">
    </div>
  </div>
  <div class="column">
    <label class="label" for="country">Šalis:</label>
    <div class="control">
      <input class="input" :class="errors.lcountry && 'is-danger'" style="width: 180px;" type="text" v-model="form.lcountry" placeholder="Lietuva">
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </td>
</tr>
<tr><td>
<table class="table">
      <thead>
        <tr>
          <th><label>Klasė</label></th>
          <th><label>Dydis</label></th>
          <th><label>Kiekis</label></th>
          <th><label>Kiekis (m3)</label></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(productRow, index) in productRows" v-bind:key="index">
          <td>
            <div class="select">
            <select
              @change="onChangeProductClass(index)"
              v-model="productRow.product_class_id"
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
            <div class="select">
            <select
              @change="onChangeBlueprint(index)"
              v-model="productRow.blueprint_id"
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
              v-model="productRow.quantity"
              @change="onChangeQuantity(index)"
              class="input"
              type="number"
              step="1"
              min="0"
            />
          </td>
          <td>
            <input
              v-model="productRow.quantityM3"
              @change="onChangeQuantityM3(index)"
              class="input"
              type="number"
              min="0"
              :step="productRow.step"
            />
          </td>
          <td>
              <button @click="removeProductRow(index)" class="button is-danger">
              X
            </button>
          </td>
        </tr>
            <tr>
              <td colspan="4">
                <div class="field is-grouped is-grouped-right">
                  <div class="control" style="margin-top: 10px;">
                    <b>Iš viso: </b><span class="tag is-light">{{ volume }}</span>&nbsp;<b>(m3)</b>
                  </div>
                  <div class="control">
                    <button @click="addProductRow()" class="button is-primary">+</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
    </table>
  </td></tr>
</table>

  
    
    <div class="field is-grouped is-grouped-left">
        <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Grįžti</a></div>
        <div class="control">
          <button class="button is-link" @click="postForm()">Išsaugoti</button>
        </div>
      </div>
   
  </div>
</template>

<script>
import { fetchPriceListsEnabled, fetchTransports, fetchBlueprintsByClass, fetchProductClasses, fetchClients, fetchBlueprint, createOrder, fetchNewOrderId, fetchClient } from '@/lib/api';
import { sortBlueprintsByActualSizes } from '@/lib/ui';

export default {
  name: 'OrderNew',
  data() {
    return {
      product_classes: [],
      productRows: [],
      clients: [],
      transports: [],
      orderQueueId: "",
      client: {},
      form: {
        order_id: "",
        client_id: 0,
        status: "open",
        delivery_date: "",
        productRows: [],
        price_list_id: null,
        note: "",
        transport_id: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        laddress: "",
        lcity: "",
        lcountry: "",
        lpostal_code: "",
      },
      volume: 0,
      errors:{},
      priceLists: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    addProductRow() {
      this.productRows.push({
        product_class_id: 0,
        blueprints: [],
        blueprint_id: 0,
        quantity: 0,
        quantityM3: 0,
        step: 0.001,
      });
    },

    load() {
      fetchPriceListsEnabled().then(res => {
        this.priceLists = res.data;
      });
      fetchNewOrderId().then((res) => {
        this.orderQueueId = res.data;
        this.form.order_id = this.orderQueueId;
      });
      fetchTransports().then((res) => {
        this.transports = res.data;
      });
      fetchProductClasses().then((res) => {
        this.product_classes = res.data;
      });
      fetchClients().then((res) => {
        this.clients = res.data;
      });
      this.addProductRow();
    },

    removeProductRow(index) {
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
        const blueprints = sortBlueprintsByActualSizes(res.data);
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
      this.form.productRows = this.productRows;
      createOrder(this.form)
        .then(res => {
          const content = res.data;
          this.parseErrors(content.errors);
          if (content.errors.length == 0)
          this.$router.push({ name: "orderDetails", params: { id: this.form.order_id } });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

