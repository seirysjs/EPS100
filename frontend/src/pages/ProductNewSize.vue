<template>
  <div class="container">
    <h1 class="is-size-3">Naujų produkto matmenų forma</h1>
    <table class="table">
      <div class="field">
        <div class="control">
          <label class="label" for='product_class'>Matmuo X (mm):</label>
          <input class="input" :class="errors.x_mm && 'is-danger'" type="number" step="1" min="0" v-model="form.x_mm">
        </div>
        <div class="control">
          <label class="label" for='product_class'>Matmuo Y (mm):</label>
          <input class="input" :class="errors.y_mm && 'is-danger'" type="number" step="1" min="0" v-model="form.y_mm">
        </div>
        <div class="control">
          <label class="label" for='product_class'>Matmuo Z (mm):</label>
          <input class="input" :class="errors.z_mm && 'is-danger'" type="number" step="1" min="0" v-model="form.z_mm">
        </div>
      </div>
  <div class="field is-grouped is-grouped-right">
      <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
    <div class="control">
      <input class="button is-link" @click="postForm()" type='submit' value='Pridėti'/>
    </div>
  </div>
</table>
  </div>
</template>

<script>
import { createProductSize } from '@/lib/api';

export default {
  name: 'ProductNewSize',
  data() {
    return {
      form: {
        x_mm: 0,
        y_mm: 0,
        z_mm: 0,
      },
      errors: {}
    };
  },

    created() {
    this.load();
  },

  methods: {
    load() {},
    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
      errors.forEach(error => labels[error.property] = error.constraints);
      this.errors = labels;
    },
    postForm() {
      createProductSize(this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "productSizesList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

