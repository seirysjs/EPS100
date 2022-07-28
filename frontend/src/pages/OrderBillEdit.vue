<template>
  <div class="container">
    <h1 class="is-size-3">Sąskaitos koregavimas</h1>
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
                  class="button is-link"
                  type="submit"
                  @click="postForm('completeOrder')"
                  value="Išsaugoti"
                />
              </div>

                <div class="control" style="margin-left: 2px"><a href="#" class="button is-light" @click="routerGoBack()">Grįžti</a></div>
            </div></div>
            <div class="field is-grouped">
            <div class="control">
              <label class="label" for="bill_id">Sąskaitos Nr.:</label>
              <input
                class="input"
                style="width: 180px"
                :class="errors.bill_id && 'is-danger'"
                :placeholder="bill_id"
                type="number"
                v-model="form.bill_id"
                disabled
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
                    :class="errors.bill_date && 'is-danger'"
                    
                    type="datetime-local"
                    v-model="form.bill_date"
                  />
                </div>
              </div>
              <div class="column is-one-quarter">
                <div class="control">
                  <label class="label" for="loading_date"
                    >Sąskaitos terminas (D):</label
                  >
                  <input
                    class="input"
                    :class="errors.days_postponed && 'is-danger'"
                    
                    type="number"
                    step="1"
                    min="0"
                    v-model="form.days_postponed"
                  />
                </div>
              </div>
              <div class="column is-one-quarter">
                <div class="control">
                  <label class="label" for="loading_date"
                    >Pastaba:</label
                  >
                  <input
                    class="input"
                    :class="errors.note && 'is-danger'"
                    
                    type="text"
                    v-model="form.note"
                  />
                </div>
              </div>
              <div class="column is-one-quarter">
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
                  class="button is-link"
                  type="submit"
                  @click="postForm('completeOrder')"
                  value="Išsaugoti"
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
  fetchBlueprintsByClass,
  fetchProductClasses,
  fetchClients,
  fetchBlueprint,
  updateBill,
  fetchClient,
  fetchOrderItemsForBillByOrder,
  fetchOrder,
  fetchBill,
  fetchPriceListsEnabled,
} from "@/lib/api";
import { dateToLocaleString, mapOrderItemFulfillsByBlueprints } from "@/lib/ui";

export default {
  name: "OrderBillEdit",
  props: {
    id: String,
  },
  data() {
    return {
      bill_id: "",
      product_classes: [],
      fulfilledProducts: [],
      transports: [],
      workers: [],
      worker_id: null,
      productRows: [],
      clients: [],
      status: "",
      client: {},
      form: {
        order_id: 0,
        client_id: 0,
        status: "open",
        bill_date: "",
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
      priceLists: [],
      errors: {},
      bill_items: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
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
      productRow.max = orderItem.max;
      productRow.packs = orderItem.packs;
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
          this.getTotalVolume();

          if ((this.productRows.length != Object.keys(this.fulfilledProducts).length))
          return;

          this.done = true;
          this.addFreeProductRows();
        });
      });
    },

    addFreeProductRows() {
      if (!this.done) return;

          for (const [blueprint_id, content] of Object.entries(
            this.fulfilledProductsFree
          )) {
            const orderItemFulfills = content.orderItemFulfills;
            if (!this.productRows.find(row => row.blueprint_id == blueprint_id))
            fetchBlueprint(blueprint_id).then((res) => {
              const blueprint = res.data;
              const count = 0;
              const maxCount = this.fulfilledProductsFree[blueprint_id].count;
              const orderItem = {
                product_class_id: blueprint.product_class_id,
                blueprint_id: blueprint_id,
                blueprint: blueprint,
                count: count,
                max: maxCount,
                orderItemFulfills: orderItemFulfills,
              };

              this.addProductRow(orderItem);
            });
          }
        this.done = false;
    },

    load() {
      fetchPriceListsEnabled().then(res => this.priceLists = res.data);
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


        fetchBill(this.id).then((res) => {
          this.bill = res.data;

        fetchOrder(this.bill.order_id).then((res) => {
        this.form = res.data;
        this.form.price_list_id = this.bill.price_list_id;

        this.form.order_id = this.bill.order_id;
        this.form.bill_id = this.bill.bill_id;
        this.form.bill_date = dateToLocaleString(this.bill.bill_date);
        this.form.note = this.bill.note;
        this.form.days_postponed = this.bill.days_postponed;

        this.onChangeClient();

        fetchOrderItemsForBillByOrder(this.bill.order_id).then((res) => {
          this.fulfilledProductsFree = res.data;
          this.fulfilledProducts = mapOrderItemFulfillsByBlueprints(this.bill.bill_items).orderItemsMap;

          if (Object.keys(this.fulfilledProducts).length == 0) {
            this.done = true;
            this.addFreeProductRows();
          }
          
          for (const [blueprint_id, content] of Object.entries(
            this.fulfilledProducts
          )) {
            const orderItemFulfills = content.orderItemFulfills;
            fetchBlueprint(blueprint_id).then((res) => {
              const blueprint = res.data;
              const packs = this.fulfilledProducts[blueprint_id].packs;
              const count = this.fulfilledProducts[blueprint_id].count;
              const maxCount = (this.fulfilledProducts[blueprint_id].count + (this.fulfilledProductsFree[blueprint_id] ? this.fulfilledProductsFree[blueprint_id].count : 0));
              const orderItem = {
                product_class_id: blueprint.product_class_id,
                blueprint_id: blueprint_id,
                blueprint: blueprint,
                count: count,
                packs: packs,
                max: maxCount,
                orderItemFulfills: orderItemFulfills,
              };
              this.addProductRow(orderItem);
            });
          }
        });

        });
        
      });
    },

    removeProductRow(index) {
      if (this.productRows.length > 1) this.productRows.splice(index, 1);
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

    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
        errors.forEach((error) => (labels[error.property] = error.constraints));
      this.errors = labels;
    },

    postForm() {
      this.form.order_id = this.bill.order_id;
      this.form.completeOrder = true;
      this.form.productRows = this.productRows;
      if (this.checkProductRowCountMax().length > 0) this.parseErrors(this.checkProductRowCountMax());
      if (this.checkProductRowCountMax().length == 0)
      updateBill(this.id, this.form)
        .then((res) => {
          const content = res.data;
          this.parseErrors(content.errors);
          if (content.errors.length != 0) return;
          this.$router.push({ name: "orderBillDetails", params: { id: this.id } });
        })
        .catch((err) => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

