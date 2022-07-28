<template>
  <nav
    v-if="store.user"
    class="navbar is-info block"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-menu is-active">
      <div class="navbar-start">
        <router-link :to="{ name: 'workerList' }" class="navbar-item"
          >Darbuotojai</router-link
        >

        <router-link :to="{ name: 'productList' }" class="navbar-item"
          >Produktai</router-link
        >

        <router-link :to="{ name: 'blockList' }" class="navbar-item"
          >Blokai</router-link
        >

        <router-link :to="{ name: 'inventoryClassList' }" class="navbar-item"
          >Likučiai</router-link
        >

        <router-link :to="{ name: 'orderList' }" class="navbar-item"
          >Užsakymai</router-link
        >

        <router-link :to="{ name: 'clientList' }" class="navbar-item"
          >Klientai</router-link
        >

        <router-link :to="{ name: 'transportList' }" class="navbar-item"
          >Transportas</router-link
        >

        <router-link :to="{ name: 'pricesList' }" class="navbar-item"
          >Kainoraščiai</router-link
        >

        <router-link :to="{ name: 'orderBillList' }" class="navbar-item"
          >Sąskaitos</router-link
        >

        <router-link :to="{ name: 'orderInvoiceList' }" class="navbar-item"
          >Važtaraščiai</router-link
        >
        
        <a class="navbar-item" @click="this.store.logout()" href="#">&nbsp;Atsijungti&nbsp;</a>

      </div>
    </div>
    
  </nav>
</template>

<script>
import { session } from '@/lib/store';

export default {
  name: 'TopMenu',
  data() {
    return {};
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
    load() {},
  }
};
</script>
