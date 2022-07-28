<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Grupinis blokų pjovimas</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
        <div v-if="form_part != 0" class="control">
          <button class="button is-light" @click="form_part -= 1">Grįžti</button>
        </div>
        <div v-if="form_part != 3" class="control">
          <button class="button is-link" @click="() => {
            if (product_class_id != 0 && form.worker_id != 0) form_part += 1;
            if (product_class_id == 0) errors.product_class_id = true;
            if (form.worker_id == 0) errors.worker_id = true;
          }">Tęsti</button>
        </div>
        <div v-if="form_part == 3" class="control">
          <button class="button is-danger" @click="postForm()">Įvykdyti</button>
        </div>
      </div>
    </div>

 
<div v-if="form_part == 0">
  <div class="block">
      <h3 class="is-size-4">Blokų klasės pasirinkimas</h3>
  </div>
  <div class="control">
          <label class="label" for='product_class_id'>Pasirinkite bloko markę:</label>
          
          <div class="select" :class="errors.product_class_id && 'is-danger'">
            <select v-model='product_class_id'>
            <option value=0>Pasirinkti</option>
              <option
            v-for="productClass in product_classes"
            v-bind:key="productClass.product_class_id"
            v-bind:value="productClass.product_class_id"
          >
            {{productClass.name}} - {{productClass.days_to_dry}}
          </option>
          </select>
    </div>  
  </div>
   <div class="field">
        <label class="label" for='status'>Darbuotojas:</label>
        <div class="control">
        <div class="select" :class="errors.worker_id && 'is-danger'">
        <select v-model='form.worker_id'>
        <option value=0>Pasirinkti</option>
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
</div>

<div v-if="form_part == 1">
  <div class="block">
      <h3 class="is-size-4">Blokų sugrupiavimas</h3>
    </div>
    <div class="control">
      <div class="field is-grouped">
        <div class="control">
          <div>
            <label class="label" for='indexSelectedBlocks'>Blokų sąrašas</label>
            <select
              v-model="indexSelectedBlocks"
              size="20"
              class="input"
              style="min-width: 420px; min-height: 540px;"
            >
              <option
                v-for="(block, index) in product_classes_map[product_class_id].blocks"
                v-bind:key="index"
                :value="index"
              >
                &nbsp;&nbsp;({{ block.block_id }})
                {{ block.product_class.name }} - 
                [{{ ltBlockStatus(block.status) }}] 
                {{ dateToLocaleDateString(block.drying_started_at) }} -
                {{ dateToLocaleDateString(block.drying_ends_at) }}&nbsp;&nbsp;&nbsp;
              </option>
            </select>
          </div>
        </div>
        <div class="control" style="margin: auto;">
          &nbsp;
          <button class="button is-light" @click="transferSelectedBlockToGroup()"> 🡒 </button>
          &nbsp;
          <br><br>
          &nbsp;
          <button class="button is-light" @click="transferSelectedBlockFromGroup()"> 🡐 </button>
          &nbsp;
        </div>
        <div class="control">
          <label class="label" for='indexSelectedBlocksGroup'>Pasirinkti blokai</label>
          <div>
            <select
              v-model="indexSelectedBlocksGroup"
              size="20"
              class="input"
              style="min-width: 420px; min-height: 540px;"
            >
              <option
                v-for="(block, index) in product_classes_map[product_class_id].blocksSelected"
                v-bind:key="index"
                :value="index"
              >
                &nbsp;&nbsp;({{ block.block_id }}) 
                {{ block.product_class.name }} - 
                [{{ ltBlockStatus(block.status) }}]
                {{ dateToLocaleDateString(block.drying_started_at) }} -
                {{ dateToLocaleDateString(block.drying_ends_at) }}&nbsp;&nbsp;&nbsp;
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>    
    <div class="control">
      <br>
  </div>
</div>


  <div v-if="form_part == 2">
  <div class="block">
      <h3 class="is-size-4">Produktų sąrašas</h3>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Klasė</th>
        <th>Dydis</th>
        <th>Kiekis (vnt.)</th>
        <th>Kiekis (m3)</th>
        <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cut, index) in product_classes_map[product_class_id].cuts" v-bind:key="index">
          <td>{{ cut.product_class }}</td>
          <td>
            <div class="select">
            <select
              @change="onChangeBlueprint(index)"
              v-model="cut.blueprint_id"
            >
              <option value="0" selected>Pasirinkti</option>
              <option
                v-for="(blueprint, index) in product_classes_map[product_class_id].blueprints"
                v-bind:key="index"
                :value="blueprint.blueprint_id"
              >
                {{ blueprint.product_size.x_mm }} x
                {{ blueprint.product_size.y_mm }} x
                {{ blueprint.product_size.z_mm }}
              </option>
            </select>
            </div>
          </td>
          <td>
            <input
              v-model="cut.quantity"
              @change="onChangeQuantity(index)"
              class="input"
              type="number"
              step="1"
              min="0"
            />
          </td>
          <td>
            <input
              v-model="cut.quantityM3"
              @change="onChangeQuantityM3(index)"
              class="input"
              type="number"
              min="0"
              :step="cut.step"
            />
          </td>
          <td>
              <button @click="removeCut(index)" class="button is-danger">
              X
            </button>
          </td>
        </tr>
            <tr>
              <td colspan="4">
                <div class="field is-grouped is-grouped-right">
                  <div class="control" style="margin-top: 10px;">
                    <b>Iš viso: </b><span class="tag is-light">{{ product_classes_map[product_class_id].volume }}</span>&nbsp;<b>(m3)</b>
                  </div>
                  <div class="control">
                    <button @click="addCut()" class="button is-primary">+</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
    </table>
    </div>

    <div v-if="form_part == 3">
    <div class="field is-grouped">
      <div class="control">
          <label class="label" for='product_class_id'>Blokų markė</label>
          
          <div class="select" :class="errors.product_class_id && 'is-danger'">
            <select disabled v-model='product_class_id'>
            <option value=0>Pasirinkti</option>
              <option
            v-for="productClass in product_classes"
            v-bind:key="productClass.product_class_id"
            v-bind:value="productClass.product_class_id"
          >
            {{productClass.name}} - {{productClass.days_to_dry}}
          </option>
          </select>
    </div>  
  </div>
  <div class="control">
        <label class="label" for='status'>Darbus atliko</label>
        <div class="control">
        <div class="select" :class="errors.worker_id && 'is-danger'">
        <select disabled v-model='form.worker_id'>
        <option value=0>Pasirinkti</option>
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
    </div>
      <div class="control">
        <div class="block">
          <h1 class="is-size-4">Pasirinkti blokai</h1>
        </div>
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Bloko Nr.</th>
              <th>Klasė</th>
              <th>Būsena</th>
              <th>Dydis (m3)</th>
              <th>Darbuotojas</th>
              <th>Džiovinimo pradžia</th>
              <th>Džiovinimo pabaiga</th>
            </tr>
          </thead>
          <tbody>
             <tr
                v-for="(block, index) in product_classes_map[product_class_id].blocksSelected"
                v-bind:key="index"
                :value="index"
              >
                <td>{{ block.block_id }}</td>
                <td>{{ block.product_class.name }}</td>
                <td>{{ ltBlockStatus(block.status) }}</td>
                <td>4.8</td>
                <td>{{ block.worker.name }}</td>
                <td>{{ dateToLocaleDateString(block.drying_started_at) }}</td>
                <td>{{ dateToLocaleDateString(block.drying_ends_at) }}</td>
              </tr>
          </tbody>
        </table>
      </div>
      <br>
      <div class="control">
        <div class="block">
          <h1 class="is-size-4">Pjovimo produktų sąrašas</h1>
        </div>
        <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Klasė</th>
          <th>Dydis</th>
          <th>Kiekis (vnt.)</th>
          <th>Kiekis (m3)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cut, index) in product_classes_map[product_class_id].cuts" v-bind:key="index">
          <td>{{ cut.product_class }}</td>
          <td>
                {{ cut.blueprint.product_size.x_mm }} x
                {{ cut.blueprint.product_size.y_mm }} x
                {{ cut.blueprint.product_size.z_mm }}
          </td>
          <td>
            {{ cut.quantity }}
          </td>
          <td>
            {{ cut.quantityM3 }}
          </td>
        </tr>
            <tr>
              <td colspan="4">
                <div class="field is-grouped is-grouped-right">
                  <div class="control" style="margin-top: 10px;">
                    <b>Iš viso: </b><span class="tag is-light">{{ product_classes_map[product_class_id].volume }}</span>&nbsp;<b>(m3)</b>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
    </table>
      </div>
    </div>

    <br><br>
  </div>
</template>

<script>
import { fetchWorkers, fetchProductClasses, fetchBlueprints, fetchBlueprint, fetchBlocksByStatus, createBlockMultiCut } from '@/lib/api';
import { dateToLocaleDateString, ltBlockStatus } from '@/lib/ui';

export default {
  name: 'BlockMultiCut',
  data() {
    return {
      product_classes: [],
      product_classes_map: {},
      product_class_id: 0,
      blocks: [],
      indexSelectedBlocks: 0,
      indexSelectedBlocksGroup: 0,
      blueprints: [],
      volume: 0,
      form_part: 0,
      errors: {},
      workers: [],
      form: {
        product_class_id: 0,
        worker_id: 0,
        blocks: [],
        cuts: [],
      },
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchWorkers().then((res) => {
        this.workers = res.data;
      });
      fetchBlocksByStatus("queue").then((res) => {
        this.blocks = res.data;
        fetchBlueprints().then((res) => {
          this.blueprints = res.data;
          fetchProductClasses().then((res) => {
            this.product_classes = res.data;

            this.product_classes.forEach(productClass => {
              if (!this.product_classes_map[productClass.product_class_id]) 
              this.product_classes_map[productClass.product_class_id] = {
                productClass: productClass,
                blocks: [],
                blueprints: [],

                blocksSelected: [],

                volume: 0,
                cuts: [{
                  product_class: productClass.name,
                  blueprint_id: 0,
                  blueprint: {},
                  quantity: 0,
                  quantityM3: 0,
                  step: 0.001,
                }],
              };

              this.product_classes_map[productClass.product_class_id].blocks = this.blocks.filter(block => block.product_class_id == productClass.product_class_id);
              this.product_classes_map[productClass.product_class_id].blueprints = this.blueprints.filter(blueprint => blueprint.product_class_id == productClass.product_class_id);
            });
          });
        });
      });
      
    },

    addCut() {
      this.product_classes_map[this.product_class_id].cuts.push({
        product_class: this.product_classes_map[this.product_class_id].productClass.name,
        blueprint_id: 0,
        blueprint: {},
        quantity: 0,
        quantityM3: 0,
        step: 0.001,
      });
    },

    removeCut(index) {
      if (this.product_classes_map[this.product_class_id].cuts.length > 1) this.product_classes_map[this.product_class_id].cuts.splice(index, 1);
    },

    getTotalVolume() {
      let volume = 0;
      for (let productRowIndex = 0; productRowIndex < this.product_classes_map[this.product_class_id].cuts.length; productRowIndex++) {
        const productRow = this.product_classes_map[this.product_class_id].cuts[productRowIndex];
        volume += productRow.quantityM3;
      }
      this.product_classes_map[this.product_class_id].volume = Math.round(volume * 1000) / 1000;
    },

    transferSelectedBlockToGroup() {
      if (!this.product_classes_map[this.product_class_id].blocks[this.indexSelectedBlocks]) 
      return;
      this.product_classes_map[this.product_class_id].blocksSelected.push(this.product_classes_map[this.product_class_id].blocks[this.indexSelectedBlocks]);
      this.product_classes_map[this.product_class_id].blocks.splice(this.indexSelectedBlocks, 1);
    }, 

    transferSelectedBlockFromGroup() {
      if (!this.product_classes_map[this.product_class_id].blocksSelected[this.indexSelectedBlocksGroup]) 
      return;
      this.product_classes_map[this.product_class_id].blocks.push(this.product_classes_map[this.product_class_id].blocksSelected[this.indexSelectedBlocksGroup]);
      this.product_classes_map[this.product_class_id].blocksSelected.splice(this.indexSelectedBlocksGroup, 1);
    },

    onChangeBlueprint(index) {
      const cut = this.product_classes_map[this.product_class_id].cuts[index];
      this.product_classes_map[this.product_class_id].cuts[index].blueprint = this.blueprints.find(blueprint => blueprint.blueprint_id == cut.blueprint_id);

      if (this.product_classes_map[this.product_class_id].cuts[index].blueprint_id != 0)
      fetchBlueprint(cut.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.product_classes_map[this.product_class_id].cuts[index].step = m3;
        this.product_classes_map[this.product_class_id].cuts[index].quantityM3 = Math.round(this.product_classes_map[this.product_class_id].cuts[index].quantity * this.product_classes_map[this.product_class_id].cuts[index].step * 1000) / 1000;
        this.getTotalVolume();
      });

      if (this.product_classes_map[this.product_class_id].cuts[index].blueprint_id == 0)
      {
        this.product_classes_map[this.product_class_id].cuts[index].step = 0.001;
        this.product_classes_map[this.product_class_id].cuts[index].quantityM3 = Math.round(this.product_classes_map[this.product_class_id].cuts[index].quantity * this.product_classes_map[this.product_class_id].cuts[index].step * 1000) / 1000;
        this.getTotalVolume();
      }
    },

    onChangeQuantity(index) {
      const cut = this.product_classes_map[this.product_class_id].cuts[index];

      if (this.product_classes_map[this.product_class_id].cuts[index].blueprint_id != 0)
      fetchBlueprint(cut.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.product_classes_map[this.product_class_id].cuts[index].quantityM3 =
          Math.round(m3 * cut.quantity * 1000) / 1000;
        this.getTotalVolume();
      });

      if(this.product_classes_map[this.product_class_id].cuts[index].blueprint_id == 0)
      this.product_classes_map[this.product_class_id].cuts[index].quantityM3 = Math.round(this.product_classes_map[this.product_class_id].cuts[index].quantity * 0.001 * 1000) / 1000;

      this.getTotalVolume();

    },

    onChangeQuantityM3(index) {
      const cut = this.product_classes_map[this.product_class_id].cuts[index];

      if (this.product_classes_map[this.product_class_id].cuts[index].blueprint_id != 0)
      fetchBlueprint(cut.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.product_classes_map[this.product_class_id].cuts[index].quantity =
          Math.round((cut.quantityM3 / m3) * 1000) / 1000;
        this.getTotalVolume();
      });

      if(this.product_classes_map[this.product_class_id].cuts[index].blueprint_id == 0)
      this.product_classes_map[this.product_class_id].cuts[index].quantity = Math.round(this.product_classes_map[this.product_class_id].cuts[index].quantityM3 / 0.001 * 1000) / 1000;

      this.getTotalVolume();

    },

    postForm() {
      this.form.product_class_id = this.product_class_id;
      this.form.blocks = this.product_classes_map[this.form.product_class_id].blocksSelected;
      this.form.cuts = this.product_classes_map[this.form.product_class_id].cuts;
      createBlockMultiCut(this.form)
        .then(res => {
          const content = res.data;
          if (content.errors != 0) return;
          this.$router.push({ name: "blockList" });
        })
        .catch(err => console.log("ERROR ", err));
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    ltBlockStatus(status) {
      return ltBlockStatus(status);
    },

    routerGoBack() {
      this.$router.back();
    },
  },
};
</script>
