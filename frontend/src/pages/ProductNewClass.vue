<template>
  <div class="container">
    <h1 class="is-size-3">Naujos produkto klasės forma</h1>
    <table class="table">
      <div class="field">
        <div class="control">
          <label class="label" for='product_class'>Markė:</label>
          <input class="input" :class="errors.name && 'is-danger'" type="text" v-model="form.name">
        </div>
        <div class="control">
          <label class="label" for='product_class'>Džiovinimo terminas (D):</label>
          <input class="input" :class="errors.days_to_dry && 'is-danger'" type="number" step="1" min="0" v-model="form.days_to_dry">
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
import { createProductClass } from '@/lib/api';

export default {
  name: 'ProductNewClass',
  data() {
    return {
      form: {
        name: "",
        days_to_dry: 0,
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
      createProductClass(this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "productClassList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

