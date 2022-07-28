<template>
  <div class="container">
    <h1 class="is-size-3">Bloko Nr.{{block.block_id}} pjovimo darbai</h1>

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
        <tr v-for="(cut, index) in cuts" v-bind:key="index">
          <td>{{ cut.product_class }}</td>
          <td>
            <div class="select">
            <select
              @change="onChangeBlueprint(index)"
              v-model="cut.blueprint_id"
            >
              <option value="0" selected>Pasirinkti</option>
              <option
                v-for="(blueprint, index) in blueprints"
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
                    <b>Iš viso: </b><span class="tag is-light">{{ volume }}</span>&nbsp;<b>(m3)</b>
                  </div>
                  <div class="control">
                    <button @click="addCut()" class="button is-primary">+</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
    </table>
    <div class="field is-grouped is-grouped-left">
        <div class="control"><a href="#" class="button is-light" @click="routerGoBack()">Atšaukti</a></div>
        <div class="control">
          <button class="button is-link" @click="postForm()">Registruoti pjovimą</button>
        </div>
      </div>
    <br><br>
  </div>
</template>

<script>
import { fetchBlock, fetchBlueprintsByClass, fetchBlueprint, processBlock } from '@/lib/api';
import { sortBlueprintsByActualSizes } from '@/lib/ui';

export default {
  name: 'BlockProcess',
  props: {
    id: String,
  },
  data() {
    return {
      block: {},
      blueprints: [],
      cuts: [],
      volume: 0,
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchBlock(this.id).then((res) => {
        this.block = res.data;

        fetchBlueprintsByClass(this.block.product_class_id).then((res) => {
          this.blueprints = sortBlueprintsByActualSizes(res.data);
          this.addCut();
        });
      });
    },

    addCut() {
      this.cuts.push({
        block_id: this.block.block_id,
        product_class: this.block.product_class.name,
        blueprint_id: 0,
        quantity: 0,
        quantityM3: 0,
        step: 0.001,
      });
    },

    removeCut(index) {
      if (this.cuts.length > 1) this.cuts.splice(index, 1);
    },

    getTotalVolume() {
      let volume = 0;
      for (let productRowIndex = 0; productRowIndex < this.cuts.length; productRowIndex++) {
        const productRow = this.cuts[productRowIndex];
        volume += productRow.quantityM3;
      }
      this.volume = Math.round(volume * 1000) / 1000;
    },

    onChangeBlueprint(index) {
      const cut = this.cuts[index];

      if (this.cuts[index].blueprint_id != 0)
      fetchBlueprint(cut.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.cuts[index].step = m3;
        this.cuts[index].quantityM3 = Math.round(this.cuts[index].quantity * this.cuts[index].step * 1000) / 1000;
        this.getTotalVolume();
      });

      if (this.cuts[index].blueprint_id == 0)
      {
        this.cuts[index].step = 0.001;
        this.cuts[index].quantityM3 = Math.round(this.cuts[index].quantity * this.cuts[index].step * 1000) / 1000;
        this.getTotalVolume();
      }
    },

    onChangeQuantity(index) {
      const cut = this.cuts[index];

      if (this.cuts[index].blueprint_id != 0)
      fetchBlueprint(cut.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.cuts[index].quantityM3 =
          Math.round(m3 * cut.quantity * 1000) / 1000;
        this.getTotalVolume();
      });

      if(this.cuts[index].blueprint_id == 0)
      this.cuts[index].quantityM3 = Math.round(this.cuts[index].quantity * 0.001 * 1000) / 1000;

      this.getTotalVolume();

    },

    onChangeQuantityM3(index) {
      const cut = this.cuts[index];

      if (this.cuts[index].blueprint_id != 0)
      fetchBlueprint(cut.blueprint_id).then((res) => {
        const blueprint = res.data;
        const m3 =
          (blueprint.product_size.x_mm *
            blueprint.product_size.y_mm *
            blueprint.product_size.z_mm) /
          1_000_000_000;

        this.cuts[index].quantity =
          Math.round((cut.quantityM3 / m3) * 1000) / 1000;
        this.getTotalVolume();
      });

      if(this.cuts[index].blueprint_id == 0)
      this.cuts[index].quantity = Math.round(this.cuts[index].quantityM3 / 0.001 * 1000) / 1000;

      this.getTotalVolume();

    },

    postForm() {
      processBlock(this.id, this.cuts)
        .then(res => {
          const content = res;
          if (content.data.block)
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

