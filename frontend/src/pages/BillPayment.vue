<template>
  <div class="container">
    <h1 class="is-size-3">Naujo mokėjimo forma</h1>
    <table class="table">
      <div class="field">
        <div class="control">
          <label class="label" for='product_class'>Suma (Eur):</label>
          <input class="input" :class="errors.amount && 'is-danger'" type="number" step="0.01" min="0" v-model="form.amount">
        </div>
        <div class="control">
          <label class="label" for='product_class'>Mokėjimo data:</label>
          <input class="input" :class="errors.payment_date && 'is-danger'" type="datetime-local" v-model="form.payment_date">
        </div>
        <div class="control">
          <label class="label" for='product_class'>Pastaba:</label>
          <input class="input" :class="errors.note && 'is-danger'" type="text" v-model="form.note">
        </div>
      </div>
  <div class="field is-grouped is-grouped-right">
    <div class="control">
      <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
    </div>
    <div class="control">
      <input class="button is-link" @click="postForm()" type='submit' value='Pridėti'/>
    </div>
  </div>
</table>
  </div>
</template>

<script>
import { createBillPayment } from '@/lib/api';
import { dateToLocaleString } from '@/lib/ui';

export default {
  name: 'BillPayment',
  props: {
    id: String,
  },
  data() {
    return {
      form: {
        note: "",
        amount: 0,
        payment_date: null,
        bill_id: 0,
      },
      errors: {}
    };
  },

    created() {
    this.load();
  },

  methods: {
    load() {
      this.form.bill_id = this.id;
      this.form.payment_date = dateToLocaleString(new Date());
    },
    parseErrors(errors) {
      if (!errors.length) return;
      const labels = {};
      if (errors.length != 0)
      errors.forEach(error => labels[error.property] = error.constraints);
      this.errors = labels;
    },
    postForm() {
      createBillPayment(this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "orderBillDetails", params: { id: this.id } });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
    
  },
};
</script>
