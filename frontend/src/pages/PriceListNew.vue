<template>
  <div class="container">
    <h1 class="is-size-3">Naujo kainoraščio forma</h1>

  <div class="field">
    <div class="control">
      <div class="field is-grouped">
        <div class="control">
          <label class="label" for='form.status'>Pavadinimas:</label>
          <input type="text" :class="errors.name && 'is-danger'" class="input" v-model="form.name">
        </div>
        <div class="control">
          <label class="label" for='form.note'>Papildomas aprašas:</label>
          <input type="text" :class="errors.note && 'is-danger'" class="input" v-model="form.note">
        </div>
        <div class="control">
          <label class="label" for='form.price_list_date'>Kainoraščio data:</label>
          <input class="input" :class="errors.price_list_date && 'is-danger'" type="datetime-local" v-model="form.price_list_date">
        </div>
        <div class="control" style="margin-top: 10px; margin-left: 20px;">
          <input type="checkbox" v-model="form.enabled" />&nbsp;<label for="checkbox"><b>Įgalintas<br>(Užsakymai/Sąskaitos)</b></label>
        </div>
      </div>
    </div>
    <div class="control">
      <table class="table is-fullwidth">
            <thead>
              <tr>
                <th><label>Klasė</label></th>
                <th><label>Bloko savikaina<br>(4.8m3)&nbsp;-&nbsp;(Eur)</label></th>
                <th><label>Gaminio savikaina<br>(1m3)&nbsp;-&nbsp;(Eur)</label></th>
                <th><label>Antkainis (%)</label></th>
                <th><label>Produkto kaina<br>(1m3)&nbsp;-&nbsp;(Eur)</label></th>
                <th><label>Bloko kaina<br>(4.8m3)&nbsp;-&nbsp;(Eur)</label></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(price, index) in prices" v-bind:key="index">
                <td>
                  <div
                    class="select"
                  >
                    <select
                      v-model="price.product_class_id"
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
                  <input
                    
                    v-model="price.amountCostBlock"
                    @change="onChangeCostBlock(index)"
                    class="input"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td>
                  <input
                    
                    v-model="price.amountCost"
                    @change="onChangeCost(index)"
                    class="input"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td>
                  <input
                    
                    v-model="price.markup"
                    @change="onChangeMarkup(index)"
                    class="input"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td>
                  <input
                    
                    v-model="price.amountProduct"
                    @change="onChangeProduct(index)"
                    class="input"
                    type="number"
                    :class="
                      errors['product_class_' + price.product_class_id] &&
                      'is-danger'
                    "
                    min="0"
                    step="0.01"
                  />
                </td>
                <td>
                  <input
                    
                    v-model="price.amountProductBlock"
                    @change="onChangeProductBlock(index)"
                    class="input"
                    type="number"
                    :class="
                      errors['product_class_' + price.product_class_id] &&
                      'is-danger'
                    "
                    step="0.01"
                    min="0"
                  />
                </td>
              </tr>            
            </tbody>
          </table>
    </div>
  </div>
    
    <div class="field is-grouped is-grouped-left">
        <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
        <div class="control">
          <button class="button is-link" @click="postForm()">Suformuoti</button>
        </div>
      </div>
    <br><br>
  </div>
</template>

<script>
import { fetchProductClasses, createPriceList } from '@/lib/api';
import { dateToLocaleString, roundNumberScaleTwo, dateToLocaleDateString } from '@/lib/ui';

export default {
  name: 'PriceListNew',
  data() {
    return {
      form: {
        name: "",
        note: "",
        price_list_date: null,
        enabled: true,
      },
      product_classes: [],
      prices: [],
      errors: {},
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductClasses().then((res) => {
        this.product_classes = res.data;
        
        for (let indexProductClass = 0; indexProductClass < this.product_classes.length; indexProductClass++) {
          const productClass = this.product_classes[indexProductClass];

          this.addProductClassPriceRow({ product_class_id: productClass.product_class_id, });
        }
      });

      this.form.price_list_date = dateToLocaleString(new Date());
      this.form.name = `${dateToLocaleDateString(new Date())} Kainoraštis`;
    },

    addProductClassPriceRow(productClassPrice) {
      const productClassRow = {
        product_class_id: 0,
        amountCostBlock: 0,
        amountCost: 0,
        markup: 20,
        amountProduct: 0,
        amountProductBlock: 0,
      };

      productClassRow.product_class_id = productClassPrice.product_class_id ? productClassPrice.product_class_id : 0;
      productClassRow.amountCostBlock = productClassPrice.amountCostBlock ? productClassPrice.amountCostBlock : 0;
      productClassRow.amountCost = productClassPrice.amountCost ? productClassPrice.amountCost : 0;
      productClassRow.markup = productClassPrice.markup ? productClassPrice.markup : 20;
      productClassRow.amountProduct = productClassPrice.amountProduct ? productClassPrice.amountProduct : 0;
      productClassRow.amountProductBlock = productClassPrice.amountProductBlock ? productClassPrice.amountProductBlock : 0;

      this.prices.push(productClassRow);
    },

    onChangeCostBlock(index) {
      const productClassRow = this.prices[index];

      if (this.prices[index].product_class_id == 0) return;

      const amountCostBlock = productClassRow.amountCostBlock;
      const markup = productClassRow.markup;
      
      this.prices[index].amountCost = roundNumberScaleTwo(amountCostBlock / 4.8);
      const amountCost = roundNumberScaleTwo(amountCostBlock / 4.8);

      if (this.prices[index].amountCost == 0) return;

      this.prices[index].amountProduct = roundNumberScaleTwo(amountCost + amountCost*markup/100);
      this.prices[index].amountProductBlock = roundNumberScaleTwo((amountCost + amountCost*markup/100) * 4.8);
    },

    onChangeCost(index) {
      const productClassRow = this.prices[index];

      if (this.prices[index].product_class_id == 0) return;

      const amountCost = productClassRow.amountCost;
      const markup = productClassRow.markup;
      
      this.prices[index].amountCostBlock = roundNumberScaleTwo(amountCost * 4.8);
      this.prices[index].amountProduct = roundNumberScaleTwo(amountCost + amountCost*markup/100);
      this.prices[index].amountProductBlock = roundNumberScaleTwo((amountCost + amountCost*markup/100) * 4.8);
    },

    onChangeMarkup(index) {
      const productClassRow = this.prices[index];

      if (this.prices[index].product_class_id == 0) return;
      if (this.prices[index].amountCost == 0) return;

      const amountCost = productClassRow.amountCost;
      const markup = productClassRow.markup;
      
      this.prices[index].amountProduct = roundNumberScaleTwo(amountCost + amountCost*markup/100);
      this.prices[index].amountProductBlock = roundNumberScaleTwo((amountCost + amountCost*markup/100) * 4.8);
    },

    onChangeProduct(index) {
      const productClassRow = this.prices[index];

      if (this.prices[index].product_class_id == 0) return;
      

      const amountProduct = productClassRow.amountProduct;
      const amountCost = productClassRow.amountCost;

      this.prices[index].amountProductBlock = roundNumberScaleTwo(amountProduct * 4.8);
      if (this.prices[index].amountCost == 0) return;

      this.prices[index].markup = roundNumberScaleTwo((amountProduct - amountCost) * 100 / amountCost);
    },

    onChangeProductBlock(index) {
      const productClassRow = this.prices[index];

      if (this.prices[index].product_class_id == 0) return;
      if (this.prices[index].amountCost == 0) return;

      const amountProductBlock = productClassRow.amountProductBlock;
      const amountCost = productClassRow.amountCost;

      this.prices[index].amountProduct = roundNumberScaleTwo(amountProductBlock / 4.8);
      const amountProduct = roundNumberScaleTwo(amountProductBlock / 4.8);

      this.prices[index].markup = roundNumberScaleTwo(roundNumberScaleTwo(((amountProduct - amountCost) * 100 / amountCost) / 10) * 10);
    },

    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
        errors.forEach((error) => (labels[error.property] = error.constraints));
      this.errors = labels;
    },

    postForm() {
      this.form.prices = this.prices;
      createPriceList(this.form)
        .then(res => {
          const content = res.data;
          if (content.errors.length != 0) return this.parseErrors(content.errors);
          this.$router.push({ name: "pricesList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

