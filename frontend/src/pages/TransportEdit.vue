<template>
  <div class="container">
    <h1 class="is-size-3">Transporto redagavimo forma</h1>
    <table class="table">
  <div class="field">
  <label class="label" for="name">Valstyb. Nr.:</label>
      <div class="control">
    <input class="input" :class="errors.number && 'is-danger'" type="text" v-model="form.number">
    </div>
      <label class="label" for="name">Markė:</label>
      <div class="control">
    <input class="input" :class="errors.name && 'is-danger'" type="text" v-model="form.name">
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
import { updateTransport, fetchTransport } from '@/lib/api';

export default {
  name: 'TransportEdit',
  props: {
    id: String
  },
  data() {
    return {
      form: {
        name: "",
        number: ""
      },
      errors: {}
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchTransport(this.id).then(res => {
        this.form = res.data;
      })
    },
    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
      errors.forEach(error => labels[error.property] = error.constraints);
      this.errors = labels;
    },
    postForm() {
      updateTransport(this.id, this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "transportList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

