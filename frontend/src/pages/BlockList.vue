<template>
  <div class="container">
    <div class="block">
      <h1 class="is-size-3">Blokai</h1>
    </div>

    <div class="block has-background-light p-5">
      <div class="field is-grouped">
        <div class="control">
          <router-link :to="{ name: 'blockNew' }" class="button is-link"
          >Pridėti naują bloką</router-link
          >
        </div>
        <div class="control"> 
          <router-link :to="{ name: 'blockMultiCut' }" class="button is-link"
          >Grupinis blokų pjovimas</router-link
          >
        </div>
      </div>
      
    </div>

    <div class="block">

<data-table :rowsPerPage="10" :list="blocks" @dataSlice="data => this.data = data">
  <template #head>
    <tr>
      <th>Bloko Nr.</th>
      <th>Klasė</th>
      <th>Džiovinimo pradžia</th>
      <th>Džiovinimo pabaiga</th>
      <th>Būsena</th>
      <th>Veiksmai</th>
    </tr>
  </template>

  <template #body>
    <tr v-for="block in data" v-bind:key="block.block_id">
      <td>
        <router-link
          :to="{ name: 'blockDetails', params: { id: block.block_id } }"
          class="tag is-light is-info"
          >{{ block.block_id }}</router-link
        >
      </td>
      <td><div class="tag">{{ block.product_class.name }}</div></td>
      <td>
        {{ dateToLocaleDateString(block.drying_started_at) }}
      </td>
      <td>
        {{ dateToLocaleDateString(block.drying_ends_at) }}
      </td>
      <td><span class="tag is-light" :class="{
                'is-danger': 
                  block.status == 'void',
                'is-warning':
                  block.status == 'drying' || block.status == 'wip',
                'is-success':
                  block.status == 'queue',
                }">{{ ltBlockStatus(block.status) }}</span></td>
      <td>
        <div class="field is-grouped">
          <div class="control">
            <router-link
            :to="{ name: 'blockDetails', params: { id: block.block_id } }"
            class="button is-light"
            >Praplesti</router-link
            >
          </div>
        </div>
      </td>
      </tr>
  </template>
</data-table>
<br>
    </div>
  </div>
</template>

<script>
import { fetchBlocks } from '@/lib/api';
import { dateToLocaleDateString, ltBlockStatus } from '@/lib/ui';

export default {
  name: 'BlockList',
  data() {
    return {
      blocks: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      fetchBlocks().then((res) => {
      this.blocks = res.data;
      });
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
