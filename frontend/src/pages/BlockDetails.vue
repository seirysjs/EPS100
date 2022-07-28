<template>
  <div class="container">
    <h1 class="is-size-3">Blokas Nr. {{ (block.block_id) ? block.block_id : "" }}</h1>
    <br>
<div class="block has-background-light p-5">
      <div class="field is-grouped is-grouped-left">
        <div class="control">
                <router-link
                  :to="{ name: 'blockList' }"
                  class="button is-light"
                  >Grįžti</router-link
                >
              </div>
        <div class="control">
              <router-link
                :to="{ name: 'blockEdit', params: { id: ((block.block_id) ? (block.block_id) : (0)) } }"
                class="button is-link"
                >Koreguoti</router-link
              >
            </div>
            <div class="control">
                <router-link
                  :to="{ name: 'blockProcess', params: { id: ((block.block_id) ? (block.block_id) : (0)) } }"
                  class="button is-link"
                  v-if="block.status != 'done'"
                  >Pjaustyti</router-link
                >
              </div>
            </div>
          </div>
  <div class="block">
               <tabs :options="{ useUrlFragment: false }" nav-class="field is-grouped is-grouped-left" nav-item-class="control" nav-item-link-class="button is-light">
        <tab name="Informacija">
    <table class="table">
      <tbody>
        <tr>
          <td>Bloko Nr.:</td>
          <td><div class="tag">{{ (block.block_id) ? block.block_id : "" }}</div></td>
        </tr>
        <tr>
          <td>Bloko markė:</td>
          <td><div class="tag">{{ (block.product_class) ? block.product_class.name : "" }}</div></td>
        </tr>
        <tr>
          <td>Džiovinimo pradžia:</td>
          <td>{{ (block.drying_started_at) ? dateToLocaleDateString(block.drying_started_at) : "" }}</td>
        </tr>
        <tr>
          <td>Džiovinimo Pabaiga:</td>
          <td>{{ (block.drying_ends_at) ? dateToLocaleDateString(block.drying_ends_at) : "" }}</td>
        </tr>
        <tr>
        <td>Būsena:</td>
        <td><span class="tag is-light" :class="{
                'is-danger': 
                  block.status == 'void',
                'is-warning':
                  block.status == 'drying' || block.status == 'wip',
                'is-success':
                  block.status == 'queue',
                }">{{ (block.status) ? ltBlockStatus(block.status) : "" }}</span></td>
        </tr>
        <tr>
          <td>Darbuotojas:</td>
          <td>{{ (block.worker) ? block.worker.name : "" }}</td>
        </tr>
      </tbody>
    </table>
  </tab>
        <tab name="Pjovimo darbai" v-if="blockCuts.length != 0">
    <div class="block">
      <h3 class="is-size-4">Išpjauti produktai</h3>
    </div>

    <div class="block">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th><label>Klasė</label></th>
            <th><label>Dydis</label></th>
            <th><label>Kiekis</label></th>
            <th><label>Kiekis (m3)</label></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(productRow, index) in blockCuts" v-bind:key="index">
            <td><div class="tag">{{ productRow.blueprint.product_class.name }}</div></td>
            <td>
              <div class="tag">{{ productRow.blueprint.product_size.x_mm }}</div>x<div class="tag">{{
                productRow.blueprint.product_size.y_mm
              }}</div>x<div class="tag">{{ productRow.blueprint.product_size.z_mm }}</div>
            </td>
            <td>x<div class="tag">{{ productRow.count }}</div></td>
            <td>
              <span class="tag is-light">{{
                Math.round(
                  countVolumeBlueprint(productRow.blueprint) *
                    productRow.count *
                    1000,
                ) / 1000
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      </tab>
    </tabs>
    </div>
  </div>
</template>

<script>
import { fetchBlock, fetchBlockCutsByBlock } from '@/lib/api';
import { dateToLocaleDateString, countVolumeBlueprint, ltBlockStatus } from '@/lib/ui';

export default {
  name: 'BlockDetails',
  props: {
    id: String,
  },
  data() {
    return {
      block: {},
      blockCuts: []
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {

      fetchBlock(this.id).then((res) => {
        this.block = res.data;
      });
      fetchBlockCutsByBlock(this.id).then((res) => {
        this.blockCuts = res.data;
      });
    },

    ltBlockStatus(status) {
      return ltBlockStatus(status);
    },

    dateToLocaleDateString(datetime) {
      return dateToLocaleDateString(datetime);
    },

    countVolumeBlueprint(productRow) {
      return countVolumeBlueprint(productRow);
    },

  },
};
</script>
