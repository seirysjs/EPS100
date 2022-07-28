<template>
  <div class="container">
    <h1 class="is-size-3">Bloko ({{form.block_id}}) redagavimo forma</h1>
    <div style="width: 380px;">
      <div class="field">
      <label class="label" for="block_id">Bloko Nr.:</label>
        <div class="control">
          <input class="input" :class="errors.block_id && 'is-danger'" type="number" v-model="form.block_id"  disabled="true">
        </div>
      </div>
        <div class="field">
        <label class="label" for='product_class_id'>Pasirinkite bloko markę:</label>
          <div class="control">
          <div class="select" :class="errors.product_class_id && 'is-danger'">
            <select v-model='form.product_class_id'>
              <option
            v-for="productClass in productClasses"
            v-bind:key="productClass.product_class_id"
            v-bind:value="productClass.product_class_id"
          >
            {{productClass.name}} - {{productClass.days_to_dry}}
          </option>
          </select>
          </div>
          </div>
        </div>
        <div class="field">
        <label class="label" for='block_size'>Bloko dydis:</label>
        <div class="control">
        <div class="select">
        <select>
        <option value="1" selected>4m X 1.2m X 1m (4.8m3)</option>
        </select>
        </div>
        </div>
        </div>
        <div class="field">
        <label class="label" for='drying_started_at'>Džiovinimo pradžia:</label>
          <div class="control">
          <input class="input" :class="errors.drying_started_at && 'is-danger'" type="datetime-local" v-model="form.drying_started_at">
          </div>
        </div>
        <div class="field">
        <label class="label" for='drying_ends_at'>Džiovinimo pabaiga:</label>
          <div class="control">
          <input class="input" :class="errors.drying_ends_at && 'is-danger'" type="datetime-local" v-model="form.drying_ends_at">
          </div>
        </div>
        <div class="field">
        <label class="label" for='status'>Būsena:</label>
        <div class="control">
        <div class="select" :class="errors.status && 'is-danger'">
        <select v-model='form.status' name='status'>
              <option
            v-for="status in states"
            v-bind:key="status.id"
            v-bind:value="status.value"
          >
            {{ status.name }}
          </option>
            </select>
        </div>
        </div>
        </div>
        <div class="field">
        <label class="label" for='status'>Darbuotojas:</label>
        <div class="control">
        <div class="select" :class="errors.worker_id && 'is-danger'">
        <select v-model='form.worker_id'>
        <option
            v-for="worker in workers"
            v-bind:key="worker.worker_id"
            v-bind:value="worker.worker_id"
          >
            {{worker.name}}
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
      </div>
  </div>
</template>

<script>
import { fetchBlock, fetchProductClasses, fetchWorkers, updateBlock } from '@/lib/api';
import { dateToLocaleString } from '@/lib/ui';

export default {
  name: 'BlockEdit',
  props: {
    id: String
  },
  data() {
    return {
      form: {
        block_id: 0,
        product_class_id: "",
        drying_started_at: "",
        drying_ends_at: "",
        status: "",
        worker_id: ""
      },
      errors: {},
      blockQueueId: null,
      productClasses: [],
      workers: [],
      states: [
        {
          id: 0,
          name: "Džiovinamas",
          value: "drying",
        },
        {
          id: 1,
          name: "Eilėje",
          value: "queue",
        },
        {
          id: 2,
          name: "Pjaustomas",
          value: "wip",
        },
        {
          id: 3,
          name: "Baigtas",
          value: "done",
        },
        {
          id: 4,
          name: "Negaliojantis",
          value: "void",
        },
      ],
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
      fetchWorkers().then((res) => {
        this.workers = res.data;
      });
      fetchBlock(this.id).then((res) => {
        this.form.block_id = res.data.block_id;
        this.form.product_class_id = res.data.product_class_id;
        this.form.drying_started_at = dateToLocaleString(res.data.drying_started_at);
        this.form.drying_ends_at = dateToLocaleString(res.data.drying_ends_at);
        this.form.status = res.data.status;
        this.form.worker_id = res.data.worker_id;
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
      updateBlock(this.id, this.form)
        .then(res => {
          const content = res.data;
          this.parseErrors(content.errors);
          if (content.errors.length == 0)
          this.$router.push({ name: 'blockDetails', params: { id: this.id } });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
    
  },
};
</script>
