<template>
  <div class="container">
    <h1 class="is-size-3">Naujas produkto šablonas</h1>

    <table class="table">
      <div class="field">
        <label class="label" for='product_class'>Markė:</label>
        <div class="control">
          <div class="select" :class="errors.product_class_id && 'is-danger'">
        <select v-model='form.product_class_id'>
              <option
            v-for="productClass in productClasses"
            v-bind:key="productClass.product_class_id"
            v-bind:value="productClass.product_class_id"
          >
            {{productClass.name}}
          </option>
          </select>
        </div>
        </div>
      </div>
      <div class="field">
        <label class="label" for='product_size'>Matmenys:</label>
        <div class="control">
          <div class="select" :class="errors.product_size_id && 'is-danger'">
             <select v-model='form.product_size_id'>
              <option
            v-for="productSize in productSizes"
            v-bind:key="productSize.product_size_id"
            v-bind:value="productSize.product_size_id"
          >
            {{productSize.x_mm}}x{{productSize.y_mm}}x{{productSize.z_mm}}
          </option>
          </select>
        </div>
        </div>
      </div>
  <div class="field is-grouped is-grouped-right">
      <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
    <div class="control">
      <input class="button is-link" @click="postForm()" type='submit' value='Išsaugoti'/>
    </div>
  </div>
</table>
  </div>
</template>

<script>
import { createBlueprint, fetchProductClasses, fetchProductSizes } from '@/lib/api';

export default {
  name: 'ProductNew',
  data() {
    return {
      productClasses: [],
      productSizes: [],
      form: {
        product_class_id: "",
        product_size_id: "",
      },
      errors: {}
    };
  },

    created() {
    this.load();
  },

  methods: {
    load() {
      fetchProductClasses().then((res) => {
        this.productClasses = res.data;
      });
      fetchProductSizes().then((res) => {
        this.productSizes = res.data;
      });
    },
    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
      errors.forEach(error => labels[error.property] = error.constraints);
      this.errors = labels;
    },
    postForm() {
      createBlueprint(this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "productList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

