<template>
  <div class="nfx-app app">
    <nfx-header :isLoggedInUser="isLoggedInUser"></nfx-header>
    <main v-if="isLoggedInUser" class="nfx-app__main container is-fluid">
      <router-view></router-view>
    </main>
    <main v-if="!isLoggedInUser" class="nfx-app__main--login">
      <!-- <nfx-login></nfx-login> -->
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
    <div v-if="isUserDraftLoading" class="nfx-loading--fullscreen">
      <h2 class="nfx-loading__header">NFX FANTASY</h2>
      <div>Loading Draft Please Wait...</div>
      <nfx-svg-loading></nfx-svg-loading>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import netlifyIdentity from 'netlify-identity-widget'

import { NfxHeader, NfxFooter, NfxLogin, NfxSvgLoading } from './components'

const nfxThemeMusic = require('./assets/nfx_theme.mp3')

export default Vue.extend({
  name: 'app',
  components: {
    NfxHeader,
    NfxFooter,
    NfxLogin,
    NfxSvgLoading
  },
  data() {
    return {
      nfxThemeMusic,
      isThemeplaying: false
    }
  },
  computed: {
    ...mapState({
      isLoggedInUser: ({ user }) => user.isLoggedIn,
      isUserDraftLoading: ({ draftConfig }) => draftConfig.isUserDraftLoading
    } as any)
  },
  methods: {
    onPlayClick(isPlay) {
      const audioPlayer = document.getElementById(
        'nfx-music__audio'
      ) as HTMLAudioElement
      if (isPlay) {
        audioPlayer.play()
        this.isThemeplaying = !this.isThemeplaying
      } else {
        audioPlayer.pause()
        this.isThemeplaying = !this.isThemeplaying
      }
    }
  },
  mounted() {
    if (!this.isLoggedInUser) {
      netlifyIdentity.init({
        container: 'body'
      })

      netlifyIdentity.open('signup')

      netlifyIdentity.on('login', user => {
        this.$store.dispatch('USER_AUTHENTICATED', {
          email: user.email,
          id: user.id,
          isLoggedIn: true,
          fullName: user.user_metadata.full_name
        })
        netlifyIdentity.close()
      })
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
    margin: 0.5rem 0;
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

  &__icon {
    width: 38px;
    height: 38px;
  }
}

.nfx-loading {
  &--fullscreen {
    position: absolute;
    background-color: #1c2227;
    color: #fff;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1000000;
  }

  &__header {
    font-weight: bold;
    color: $orange;
  }
}
</style>
