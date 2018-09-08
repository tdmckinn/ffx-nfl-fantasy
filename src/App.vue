<template>
  <div id="app" class="nfx-app app">
    <nfx-header :isLoggedInUser="isLoggedInUser"></nfx-header>
    <main v-if="isLoggedInUser" class="nfx-app__main container is-fluid">
      <router-view></router-view>
    </main>
    <main v-if="!isLoggedInUser" class="nfx-app__main--login">
      <nfx-login></nfx-login>
    </main>
    <nfx-footer>
      <section class="nfx-music">
        <audio id="nfx-music__audio" :src="nfxThemeMusic" width="300" height="32"></audio>
        <div class="nfx-music__player">
          <svg v-if="!isThemeplaying" class="nfx-music__icon" @click="onPlayClick(true)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          <svg v-if="isThemeplaying" class="nfx-music__icon" @click="onPlayClick(false)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 6h12v12H6z"/>
          </svg>
        </div>
      </section>
      <nfx-counter></nfx-counter>
    </nfx-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AuthService from './api/AuthService'
import { NfxHeader, NfxFooter, NfxLogin } from './components'

const auth = new AuthService()
const { authenticated, authNotifier } = auth

const nfxThemeMusic = require('./assets/nfx_theme.mp3')

export default Vue.extend({
  name: 'app',
  components: {
    NfxHeader,
    NfxFooter,
    NfxLogin
  },
  data() {
    authNotifier.on('authChange', authState => {
      (this as any).authenticated = (authState.authenticated as any)
    })

    return {
      nfxThemeMusic,
      isThemeplaying: false,
      auth,
      authenticated
    }
  },
  computed: {
    isLoggedInUser() {
      return (this as any).$store.state.user.isLoggedIn
    }
  },
  methods: {
    onPlayClick(isPlay) {
      const audioPlayer = document.getElementById('nfx-music__audio') as HTMLAudioElement
      if (isPlay) {
        audioPlayer.play()
        this.isThemeplaying = !this.isThemeplaying
      } else {
        audioPlayer.pause()
        this.isThemeplaying = !this.isThemeplaying
      }
    }
  }
})
</script>

<style lang="scss">
@import './vars';
@import '~bulma';

.nfx {
  &-app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    font-size: 1.255rem;
    line-height: 30px;
    line-height: 1.875rem;

    &__main {
      padding-top: 100px;
      padding-left: 10px;
      padding-right: 10px;
      flex: 1;

      &--login {
        background-image: url('./assets/sandro-schuh-143183.jpg');
        background-position: center;
        background-size: cover;
        min-height: 900px;
      }
    }

    a.navbar-item:hover,
    a.navbar-item.is-active,
    .navbar-link:hover,
    .navbar-link.is-active {
      background-color: #fafafa;
      color: $orange;
    }
  }

  &__divider {
    display: block;
    margin: .5rem 0;
    border-bottom: 1px solid $divider-color;
  }
}

.nfx-music {
  audio:not([controls]) {
    display: none !important;
  }

  &__player {
    position: relative;
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.nfx-music__icon {
  width: 38px;
  height: 38px;
}

.divider {
  border-top: 0.1rem solid #f0f1f4;
  height: 0.1rem;
  margin: 1rem 0;
}
</style>
