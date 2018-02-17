<template>
  <div id="app" class="app">
    <ffx-header :isLoggedInUser="isLoggedInUser"></ffx-header>
    <main v-if="isLoggedInUser" class="app__ffx-main view container is-fluid">
      <router-view></router-view>
    </main>
    <main v-if="!isLoggedInUser" class="app__ffx-main--login">
      <login></login>
    </main>
    <ffx-footer></ffx-footer>
  </div>
</template>

<script>
import FfxHeader from './components/Header.vue'
import FfxFooter from './components/Footer.vue'
import Login from './components/Login.vue'

export default {
  name: 'app',
  computed: {
    isLoggedInUser() {
      return this.$store.state.user.isLoggedIn
    }
  },
  components: {
    FfxHeader,
    FfxFooter,
    Login
  }
}
</script>

<style lang="scss">
@import "./vars";
@import "~bulma";

.app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-size: 1.255rem;
  line-height: 30px;
  line-height: 1.875rem;

  &__ffx-main {
    padding-top: 15px;

    &--login {
      background-image: url('./assets/sandro-schuh-143183.jpg');
      background-position: center;
      background-size: cover;
      min-height: 900px;
    }
  }
}

.view { flex: 1; }

.divider {
  border-top: .1rem solid #f0f1f4;
  height: .1rem;
  margin: 1rem 0;
}
</style>
