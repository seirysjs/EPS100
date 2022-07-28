<template>
  <div class="container">
    <h1 class="is-size-3">Kliento redagavimo forma</h1>
    <div style="width: 600px;">
    <table class="table">
<tr>
  <td>
    <div class="field is-grouped is-grouped-left">
  <div class="columns">
    <div class="column">
    <label class="label">Užsakovas:</label>
    <div class="field is-grouped">
  <div class="column">
    <label class="label" for="name">Pavadinimas:</label>
    <div class="control">
      <input class="input" :class="errors.name && 'is-danger'" style="width: 250px;" type="text" v-model="form.name">
    </div>
  </div>
  <div class="column">
    <label class="label" for="phone">El. Paštas:</label>
    <div class="control">
      <input class="input" :class="errors.email && 'is-danger'" style="width: 250px;" type="text" v-model="form.email">
    </div>
  </div>
  <div class="column">
    <label class="label" for="phone">Tel. Nr.:</label>
    <div class="control">
      <input class="input" :class="errors.phone && 'is-danger'" style="width: 180px;" type="text" v-model="form.phone">
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
    <label class="label">Adresas:</label>
    <div class="field is-grouped">
    <div class="column">
      <label class="label" for="address">Gatvė:</label>
    <div class="control">
      <input class="input" :class="errors.address && 'is-danger'" style="width: 180px;" type="text" v-model="form.address">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Miestas:</label>
    <div class="control">
      <input class="input" :class="errors.city && 'is-danger'" style="width: 180px;" type="text" v-model="form.city">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Pašto kodas:</label>
    <div class="control">
      <input class="input" :class="errors.postal_code && 'is-danger'" style="width: 180px;" type="text" v-model="form.postal_code">
    </div>
  </div>
  <div class="column">
    <label class="label" for="country">Šalis:</label>
    <div class="control">
      <input class="input" :class="errors.country && 'is-danger'" style="width: 180px;" type="text" v-model="form.country">
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
    <label class="label">Sąskaita:</label>
    <div class="field is-grouped">
    <div class="column">
      <label class="label" for="address">Įmonės kodas:</label>
    <div class="control">
      <input class="input" :class="errors.company_code && 'is-danger'" style="width: 180px;" type="text" v-model="form.company_code">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">PVM mokėtojo kodas:</label>
    <div class="control">
      <input class="input" :class="errors.vat_code && 'is-danger'" style="width: 180px;" type="text" v-model="form.vat_code">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Banko pavadinimas:</label>
    <div class="control">
      <input class="input" :class="errors.banks_name && 'is-danger'" style="width: 180px;" type="text" v-model="form.banks_name">
    </div>
  </div>
  <div class="column">
    <label class="label" for="city">Banko sąskaitos Nr:</label>
    <div class="control">
      <input class="input" :class="errors.account_number && 'is-danger'" style="width: 180px;" type="text" v-model="form.account_number">
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </td>
</tr>
</table>
  <br><br>
  <div class="field is-grouped is-grouped-left">
    <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
    <div class="control">
      <input class="button is-link" @click="postForm()" type='submit' value='Išsaugoti'/>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import { fetchClient, updateClient } from '@/lib/api';

export default {
  name: 'ClientEdit',
  props: {
    id: String
  },
  data() {
    return {
      blocks: [],
      form: {
        name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        company_code: "",
        vat_code: "",
        banks_name: "",
        account_number: "",
      },
      errors: {}
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchClient(this.id).then((res) => {
        this.form = res.data;
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
      updateClient(this.id, this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "clientDetails", params: { id: this.id } });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },

  },
};
</script>

