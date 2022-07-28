<template>
  <div class="container">
    <h1 class="is-size-3">Važtaraščio formavimas</h1>
    <table class="table is-fullwidth">
      <tr>
        <td>
          <div style="margin-top: 32px;">
            <div class="field is-grouped is-grouped-right" style="margin-bottom: -32px;">
            <div
              class="field is-grouped is-grouped-right"
              style="margin-bottom: -100%;"
            >
              <div class="control">
                &nbsp;&nbsp;<input
                  class="button is-danger"
                  type="submit"
                  @click="postForm('completeOrder')"
                  value="Suformuoti"
                />
              </div>
              
                <div class="control" style="margin-left: 2px"><a href="#" class="button is-light" @click="routerGoBack()">Grįžti</a></div>
            </div></div>
            <div class="field is-grouped">
            <div class="control">
              <label class="label" for="order_id">Važtaraščio Nr.:</label>
              <input
                class="input"
                style="width: 180px"
                :class="errors.transfer_id && 'is-danger'"
                :placeholder="transfer_id"
                type="number"
                v-model="form.transfer_id"
              />
            </div>

            <div class="control" style="margin-left: 5px">
              <label class="label" for="order_id">VAZ Nr.:</label>
              <input
                class="input"
                style="width: 180px"
                :class="errors.vaz_number && 'is-danger'"
                type="text"
                v-model="form.vaz_number"
              />
            </div>

            <div class="control" style="margin-left: 5px">
              <label class="label" for="client_id">Klientas</label>
              <div class="select" :class="errors.client_id && 'is-danger'">
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
            </div></div></div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="field">
            <div class="columns">
              <div class="column is-one-quarter">
                <div class="control">
                  <label class="label" for="loading_date"
                    >Pristatymo data:</label
                  >
                  <input
                    class="input"
                    :class="errors.invoice_date && 'is-danger'"
                    
                    type="datetime-local"
                    v-model="form.invoice_date"
                  />
                </div>
              </div>
              <div class="column is-one-quarter">
                <div class="control">
                  <label class="label" for="form.transport_id"
                    >Transportas</label
                  >
                  <div
                    class="control select"
                    :class="errors.transport_id && 'is-danger'"
                  >
                    <select
                      v-model="form.transport_id"
                      
                    >
                      <option value="null" selected>Pasirinkti</option>
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
              </div>
              <div class="column is-one-quarter">
                <div class="control">
                  <label class="label" for="worker_id">Vairuotojas</label>
                  <div
                    class="control select"
                    :class="errors.worker_id && 'is-danger'"
                  >
                    <select v-model="worker_id" >
                      <option value="null" selected>Pasirinkti</option>
                      <option
                        v-for="worker in workers"
                        v-bind:key="worker.worker_id"
                        :value="worker.worker_id"
                      >
                        {{ worker.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <h3 class="is-size-4">* Iškrovimas:</h3>
          <div class="field">
            <div class="columns">
              <div class="column">
                <div class="field is-grouped">
                  <div class="column">
                    <label class="label" for="address">Gatvė:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.unloading_address && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.unloading_address"
                        :placeholder="client.address"
                      />
                    </div>
                  </div>
                  <div class="column">
                    <label class="label" for="city">Miestas:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.unloading_city && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.unloading_city"
                        :placeholder="client.city"
                      />
                    </div>
                  </div>
                  <div class="column">
                    <label class="label" for="city">Pašto kodas:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.unloading_postal_code && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.unloading_postal_code"
                        :placeholder="client.postal_code"
                      />
                    </div>
                  </div>
                  <div class="column">
                    <label class="label" for="country">Šalis:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.unloading_country && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.unloading_country"
                        :placeholder="client.country"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-one-quarter">
                <div class="control" style="margin-left: 5px; margin-top: -20px; margin-bottom:10px;">
                  <label class="label" for="unloading_date"
                    >Iškrovimo data (VAZ):</label
                  >
                  <input
                    class="input"
                    :class="errors.unloading_date && 'is-danger'"
                    
                    type="datetime-local"
                    v-model="form.unloading_date"
                  />
                </div>
              </div>
              <div class="column">
                    <div class="control" style="margin-left: 5px; margin-top: -20px; margin-bottom:10px;">
                    <label class="label" for="city">Tel Nr. (VAZ):</label>
                      <input
                        class="input"
                        
                        :class="errors.unloading_phone_number && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.unloading_phone_number"
                        :placeholder="client.phone"
                      />
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
                <h3 class="is-size-4">* Pakrovimas:</h3>
                <div class="field is-grouped">
                  <div class="column">
                    <label class="label" for="address">Gatvė:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.loading_address && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.loading_address"
                        placeholder="Žibilėlio g. 8"
                      />
                    </div>
                  </div>
                  <div class="column">
                    <label class="label" for="city">Miestas:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.loading_city && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.loading_city"
                        placeholder="Užventė"
                      />
                    </div>
                  </div>
                  <div class="column">
                    <label class="label" for="city">Pašto kodas:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.loading_postal_code && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.loading_postal_code"
                        placeholder="Mažeikių r."
                      />
                    </div>
                  </div>
                  <div class="column">
                    <label class="label" for="country">Šalis:</label>
                    <div class="control">
                      <input
                        class="input"
                        
                        :class="errors.loading_country && 'is-danger'"
                        style="width: 180px"
                        type="text"
                        v-model="form.loading_country"
                        placeholder="Lietuva"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-one-quarter">
                <div class="control" style="margin-left: 5px; margin-top: -20px; margin-bottom:10px;">
                  <label class="label" for="drying_started_at"
                    >Pakrovimo data (VAZ):</label
                  >
                  <input
                    class="input"
                    :class="errors.loading_date && 'is-danger'"
                    
                    type="datetime-local"
                    v-model="form.loading_date"
                  />
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th><label>Klasė</label></th>
                <th><label>Dydis</label></th>
                <th><label>Kiekis (vnt.)</label></th>
                <th><label>Pakuočių skaičius (vnt.)</label></th>
                <th><label>Kiekis (m3)</label></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(productRow, index) in productRows" v-bind:key="index">
                <td>
                  <div
                    class="select"
                    :class="
                      errors['product_' + productRow.blueprint_id] &&
                      'is-danger'
                    "
                  >
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
                  <div
                    class="select"
                    :class="
                      errors['product_' + productRow.blueprint_id] &&
                      'is-danger'
                    "
                  >
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
                    
                    v-model="productRow.quantity"
                    @change="onChangeQuantity(index)"
                    class="input"
                    type="number"
                    :class="
                      errors['product_' + productRow.blueprint_id] &&
                      'is-danger'
                    "
                    step="1"
                    min="0"
                    :max="productRow.max"
                  />
                </td>
                <td>
                  <input
                    
                    v-model="productRow.packs"
                    class="input"
                    type="text"
                    :class="
                      errors['product_' + productRow.blueprint_id + '_packs'] &&
                      'is-danger'
                    "
                  />
                </td>
                <td>
                  <input
                    
                    v-model="productRow.quantityM3"
                    @change="onChangeQuantityM3(index)"
                    class="input"
                    type="number"
                    :class="
                      errors['product_' + productRow.blueprint_id] &&
                      'is-danger'
                    "
                    min="0"
                    :step="productRow.step"
                    :max="productRow.maxm3"
                  />
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <div class="field is-grouped is-grouped-right">
                    <div class="control" style="margin-top: 10px">
                      <b>Iš viso: </b
                      ><span class="tag is-light">{{ volume }}</span
                      >&nbsp;<b>(m3)</b>
                    </div>
                  </div>
                </td>
                <td></td>
              </tr>
              
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
                <td>
                  <div
              class="field is-grouped is-grouped-right"
            >
              <div class="control">
                <input
                  class="button is-danger"
                  type="submit"
                  @click="postForm('completeOrder')"
                  value="Suformuoti"
                />
              </div>

              <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Grįžti</a></div>
            </div>
                  
                </td>
              </tr>
    </table>
  </div>
</template>

<script>
import {
  fetchTransports,
  fetchWorkers,
  fetchOrder,
  fetchBlueprintsByClass,
  fetchProductClasses,
  fetchClients,
  fetchBlueprint,
  createTransfer,
  fetchClient,
  fetchOrderItemFulfillsByOrder,
  fetchTransferNewId,
} from "@/lib/api";
import { dateToLocaleString } from "@/lib/ui";

export default {
  name: "OrderInvoice",
  props: {
    id: String,
  },
  data() {
    return {
      transfer_id: "",
      product_classes: [],
      fulfilledProducts: [],
      transports: [],
      workers: [],
      worker_id: null,
      productRows: [],
      clients: [],
      client: {},
      form: {
        order_id: "",
        client_id: 0,
        status: "open",
        invoice_date: "",
        productRows: [],
        transport_id: null,
        unloading_address: "",
        unloading_city: "",
        unloading_country: "",
        unloading_postal_code: "",
        loading_address: "",
        loading_city: "",
        loading_country: "",
        loading_postal_code: "",
      },
      volume: 0,
      done: false,
      errors: {},
    };
  },

  created() {
    this.load();
  },

  methods: {
    addProductRow(orderItem) {
      const productRow = {
        product_class_id: 0,
        blueprints: [],
        blueprint_id: 0,
        quantity: 0,
        quantityM3: 0,
        packs: "",
        step: 0.001,
        max: 1,
      };
      if (!orderItem) return this.productRows.push(productRow);
      productRow.product_class_id = orderItem.blueprint.product_class_id;
      productRow.blueprint_id = orderItem.blueprint_id;
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
          productRow.quantityM3 =
            Math.round(productRow.quantity * m3 * 1000) / 1000;
          productRow.maxm3 = productRow.quantityM3;

          this.productRows.push(productRow);

          if (this.productRows.length >= this.fulfilledProducts.length)
            this.done = true;

          this.getTotalVolume();
        });
      });
    },

    load() {
      fetchTransports().then((res) => {
        this.transports = res.data;
      });
      fetchWorkers().then((res) => {
        this.workers = res.data;
      });
      fetchProductClasses().then((res) => {
        this.product_classes = res.data;
      });
      fetchClients().then((res) => {
        this.clients = res.data;
      });
      fetchOrder(this.id).then((res) => {
        this.form = res.data;

        fetchTransferNewId().then((res) => {
          this.transfer_id = res.data;
          this.form.transfer_id = this.transfer_id;
        });

        this.form.invoice_date = dateToLocaleString(this.form.delivery_date);
        this.form.unloading_address = this.form.address;
        this.form.unloading_city = this.form.city;
        this.form.unloading_country = this.form.country;
        this.form.unloading_postal_code = this.form.postal_code;
        this.form.loading_address = this.form.laddress;
        this.form.loading_city = this.form.lcity;
        this.form.loading_country = this.form.lcountry;
        this.form.loading_postal_code = this.form.lpostal_code;

        this.onChangeClient();

        fetchOrderItemFulfillsByOrder(this.id).then((res) => {
          this.fulfilledProducts = res.data;

          for (const [blueprint_id, content] of Object.entries(
            this.fulfilledProducts
          )) {
            const count = content.count;
            const orderItemFulfills = content.orderItemFulfills;
            fetchBlueprint(blueprint_id).then((res) => {
              const blueprint = res.data;
              const orderItem = {
                product_class_id: blueprint.product_class_id,
                blueprint_id: blueprint_id,
                blueprint: blueprint,
                count: count,
                orderItemFulfills: orderItemFulfills,
              };
              if (orderItem.count > 0) this.addProductRow(orderItem);
            });
          }
        });
      });
    },

    removeProductRow(index) {
      if (this.form.status == "done") return;
      if (this.productRows.length > 1) this.productRows.splice(index, 1);
    },

    getTotalVolume() {
      let volume = 0;
      for (
        let productRowIndex = 0;
        productRowIndex < this.productRows.length;
        productRowIndex++
      ) {
        const productRow = this.productRows[productRowIndex];
        volume += productRow.quantityM3;
      }
      this.volume = Math.round(volume * 1000) / 1000;
    },

    onChangeClient() {
      fetchClient(this.form.client_id).then((res) => {
        this.client = res.data;
      });
    },

    onChangeProductClass(index) {
      fetchBlueprintsByClass(this.productRows[index].product_class_id).then(
        (res) => {
          const blueprints = res.data;
          this.productRows[index].blueprints = blueprints;
          if (this.productRows[index].product_class_id != 0) return;
          this.productRows[index].blueprint_id = 0;
          this.onChangeBlueprint(index);
        }
      );
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
          this.productRows[index].quantityM3 =
            Math.round(
              this.productRows[index].quantity *
                this.productRows[index].step *
                1000
            ) / 1000;
          this.getTotalVolume();
        });

      if (this.productRows[index].blueprint_id == 0) {
        this.productRows[index].step = 0.001;
        this.productRows[index].quantityM3 =
          Math.round(
            this.productRows[index].quantity *
              this.productRows[index].step *
              1000
          ) / 1000;
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

      if (this.productRows[index].blueprint_id == 0)
        this.productRows[index].quantityM3 =
          Math.round(productRow.quantity * 0.001 * 1000) / 1000;
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

      if (this.productRows[index].blueprint_id == 0)
        this.productRows[index].quantity =
          Math.round((productRow.quantityM3 / 0.001) * 1000) / 1000;
      this.getTotalVolume();
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

    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
        errors.forEach((error) => (labels[error.property] = error.constraints));
      this.errors = labels;
    },

    postForm() {
      this.form.completeOrder = true;
      this.form.productRows = this.productRows;
      this.form.order_id = this.id;
      this.form.worker_id = this.worker_id;

      if (this.checkProductRowCountMax().length > 0) this.parseErrors(this.checkProductRowCountMax());
      if (this.checkProductRowCountMax().length == 0)
      createTransfer(this.form)
        .then((res) => {
          const content = res.data;
          this.parseErrors(content.errors);
          if (content.errors.length != 0) return;
          this.$router.push({ name: "orderDetails", params: { id: this.id } });
        })
        .catch((err) => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

