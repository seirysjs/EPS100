<template>
  <div class="container">
    <h1 class="is-size-3">Naujo bloko ({{blockQueueId}}) forma</h1>
    <div style="width: 380px;">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
          <label class="label" for="block_id">Įveskite naujo bloko Nr.:</label>
          <input class="input" :class="errors.block_id && 'is-danger'" type="number" v-model="form.block_id" :placeholder="blockQueueId">
        </div>
        <div class="control">
          <label class="label" for='block_size'>Blokų kiekis:</label>
          <input class="input" :class="errors.count && 'is-danger'" type="number" v-model="form.count" step="1" min="1">
        </div>
      </div>
      
      <div class="field is-grouped is-grouped-left">
        <div class="control">
          <label class="label" for='product_class_id'>Pasirinkite bloko markę:</label>
          
          <div class="select" :class="errors.product_class_id && 'is-danger'">
            <select v-model='form.product_class_id' @change="onDryingChange()">
            <option value=0>Pasirinkti</option>
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
        <div class="control">
          <label class="label" for='block_size'>Bloko dydis:</label>
          <div class="select" :class="errors.block_size && 'is-danger'">
          <select v-model="form.block_size">
          <option value="1">4m X 1.2m X 1m (4.8m3)</option>
          </select>
          </div>
        </div>
      </div>

      <div class="field">
        
      </div>
        <div class="field">
        <label class="label" for='drying_started_at'>Džiovinimo pradžia:</label>
          <div class="control">
          <input class="input" :class="errors.drying_started_at && 'is-danger'" @change="onDryingChange()" type="datetime-local" v-model="form.drying_started_at">
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
        <option value=0>Pasirinkti</option>
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
        <option value=null>Pasirinkti</option>
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
import { fetchNewBlockId, fetchProductClasses, fetchProductClass, fetchWorkers, createBlock } from '@/lib/api';
import { dateToLocaleString } from '@/lib/ui';

export default {
  name: 'BlockNew',
  data() {
    return {
      form: {
        block_id: null,
        product_class_id: 0,
        block_size: 1,
        drying_started_at: "",
        drying_ends_at: "",
        status: "drying",
        worker_id: null,
        count: 1
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
      this.form.count = 1;
      this.form.drying_started_at = dateToLocaleString(Date.now());
      fetchProductClasses().then((res) => {
        this.productClasses = res.data;
      });
      fetchNewBlockId().then((res) => {
        this.blockQueueId = res.data;
        this.form.block_id = this.blockQueueId;
      });
      fetchWorkers().then((res) => {
        this.workers = res.data;
      });
    },
    onDryingChange() {
      if (!this.form.product_class_id) return;
      fetchProductClass(this.form.product_class_id).then((res) => {
        const productClass = res.data;
        const days_to_dry = productClass.days_to_dry;
        const newDryingEndDate = dateToLocaleString((new Date(this.form.drying_started_at).getTime() + days_to_dry * 86400000));
        this.form.drying_ends_at = newDryingEndDate;
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
      createBlock(this.form)
        .then(res => {
          const content = res;
          this.parseErrors(content.data.errors);
          if (content.data.errors.length == 0)
          this.$router.push({ name: "blockList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>

