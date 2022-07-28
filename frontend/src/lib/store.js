import router from '@/router/index';
import { defineStore } from 'pinia';
import { loginAuth } from '@/lib/api';

const getUser = () => JSON.parse(localStorage.getItem("user"));

export const session = defineStore('session', {
  state: () => ({ 
    user: getUser(), 
  }),
  actions: {
    login(data) {
      return loginAuth(data).then(
        response => {
          this.user = JSON.stringify(response.data.access_token)
          localStorage.setItem("user", this.user);
          router.push({ name: "home" });
          return Promise.resolve(response);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },

    logout() {
      localStorage.removeItem("user");
      this.user = null;
    },

  },
});
