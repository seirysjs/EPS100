<template>
<div class="container">
  <br>
  <div style="margin-left: 32px;">
    <div class="block">
      <h1 class="is-size-3">Prisijungimas</h1>
    </div>
    <form v-on:submit.prevent="onSubmit">
    <div class="field ">
      <label>Vartotojas:</label>
        <div class="control">
          <input
          type="text"
          name="username"
          class="input"
          style="width: 200px;"
          placeholder="Your username..."
          v-model="form.username"
        />
        </div>
        <label>Slaptažodis:</label>
        <div class="control">
          <input
          type="password"
          name="password"
          class="input"
          style="width: 200px;"
          placeholder="Password"
          v-model="form.password"
        />
        </div>
      </div>
        <div class="field is-grouped is-grouped-left">
          <div class="control">
            <input class="button is-link" type='submit' @click="postForm()" value='Prisijungti'/>
          </div>
        </div>
    </form>
  </div>  
</div>
</template>

<script>
import { session  } from '@/lib/store';

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
    };
  },

  setup() {
    const store = session();

    return {
      store,
    }
  },

  created() {
    this.load(); 
  },

  methods: {
    load() {
      if (this.store.user && this.store.user != "null") this.$router.push({ name: "home" });
    },

    postForm() {
      this.store.login(this.form);
    }
  }
}
</script>