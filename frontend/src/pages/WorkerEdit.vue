<template>
  <div class="container">
    <h1 class="is-size-3">Naujo darbuotojo forma</h1>
    <table class="table">
  <div class="field">
  <label class="label" for="name">Darbuotojas:</label>
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
import { fetchWorker, updateWorker } from '@/lib/api';

export default {
  name: 'WorkerEdit',
  props: {
    id: String
  },
  data() {
    return {
      blocks: [],
      form: {
        name: "",
      },
      errors: {}
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchWorker(this.id).then(res => {
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
      updateWorker(this.id, this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "workerList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

