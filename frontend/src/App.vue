<template>
  <div>
    <div>
      <TopMenu v-if="store.user" />
      <router-view />
    </div>
  </div>
</template>

<script>
import { session } from '@/lib/store';
import { http } from "@/lib/api";

import TopMenu from '@/partials/TopMenu.vue';

export default {
  name: 'App',
  data() {
    return {};
  },

  components: {
    TopMenu,
  },

  created() {
    this.load();
  },

  setup() {
    const store = session();

    return {
      store,
    }
  },

  methods: {
    load() {
      const userStore = this.store;
      const userRouter = this.$router;

      http.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
      if (error.response.status === 401) {
        userStore.user = null;
        userRouter.push({ name: "login" });
      }
      return Promise.reject(error)
      });
    }
  }
};
</script>
