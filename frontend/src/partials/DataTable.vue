<template>
  <div class="container">

<div>
    <VueTailwindPagination
      :current="currentPage"
      :total="total"
      :per-page="perPage"
      @page-changed="onPageClick($event)"
    />
</div>
    <table class="table is-fullwidth">
      <thead>
        <slot name="head" :list="list"></slot>
      </thead>
      <tbody>
        <slot name="body" :list="list"></slot>
      </tbody>
    </table>

    <VueTailwindPagination
      style="margin-top: -15px;"
      :current="currentPage"
      :total="total"
      :per-page="perPage"
      v-if="data.length == perPage"
      @page-changed="onPageClick($event)"
    />
<br>
<br>
  </div>
</template>

<script>
import "@ocrv/vue-tailwind-pagination/dist/style.css";
import VueTailwindPagination from "@ocrv/vue-tailwind-pagination";

export default {
  components: {
    VueTailwindPagination,
  },
  name: 'DataTable',
  props: ['list', 'rowsPerPage'],
  computed: {
    propChange() {
      return this.list;
    }
  },
  watch: {
    list: function() {
      this.updateList();
    },
    rowsPerPage: function() {
      this.perPage = this.rowsPerPage;
      this.updateList();
    },
  },
  emits: ['dataSlice'],

  data() {
    return {
      currentPage: 1,
      perPage: this.rowsPerPage,
      total: this.list.length,
      data: [],
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      if (!this.perPage) this.perPage = 10;
      if (!this.total) this.total = 0;
      if (!this.data) this.data = [];
      this.data = this.list.slice(0, this.perPage)
      this.$emit('dataSlice', this.data);
    },
    onPageClick(event) {
      this.currentPage = event;
      this.data = this.list.slice(this.perPage*(event-1), this.perPage*event);
      this.$emit('dataSlice', this.data);
    },
    updateList() {
      this.total = this.list.length;
      this.data = this.list.slice(this.perPage*(this.currentPage-1), this.perPage*this.currentPage);
      this.$emit('dataSlice', this.data);
    },
  }
};
</script>
