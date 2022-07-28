import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import DataTable from "@/partials/DataTable.vue";
import { Tabs, Tab } from 'vue3-tabs-component';
import { createPinia } from 'pinia';

const pinia = createPinia();

createApp(App)
.use(pinia)
.use(router)
.component('data-table', DataTable)
.component('tabs', Tabs)
.component('tab', Tab)
.mount('#app');
