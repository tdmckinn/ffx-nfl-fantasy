<template>
  <header class="nfx-header">
    <nav class="navbar">
      <a role="button" class="navbar-burger" @click="SIDEBAR_TOGGLE"  aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      <div class="navbar-start">
        <router-link id="link-brand" class="navbar-item" to="/">
          <h1 class="nfx-brand__title title is-3">
           NFX Fantasy <span>{{year}}</span>
          </h1>
        </router-link>
      </div>
      <div v-if="isLoggedInUser" class="navbar-end navbar-menu">
         <router-link v-for="({ name, route }, index) in navBarItems" class="navbar-item" :to="route" :key="index">
           {{name}}
        </router-link>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="#">
            <img :src="helmentIcon"/>
          </a>
          <div class="navbar-dropdown is-boxed">
            <router-link class="navbar-item" to="/logout">
              Logout
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <nfx-sidebar :navBarItems="navBarItems" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { getYear } from 'date-fns'
import { mapMutations, mapState } from 'vuex'

import NfxSidebar from './NfxSidebar.vue'

const helmentIcon = require('../assets/defaultHelment.svg')

export interface INavItem {
  name: string
  route: string
}

export default Vue.extend({
  name: 'nfx-header',
  components: {
    NfxSidebar
  },
  props: {
    isLoggedInUser: Boolean
  },
  data() {
    return {
      helmentIcon,
      year: getYear(new Date()),
      navBarItems: [
        { name: 'My Team', route: '/team' },
        { name: 'Leagues', route: '/leagues' },
        // { name: 'Top Drafts', route: '/draft-rankings' },
        { name: 'Players', route: '/players' },
        { name: 'Highlights', route: '/highlights' },
        { name: 'Draft', route: '/draft' }
      ]
    }
  },
  computed: mapState(['isSidebarOpen']),
  methods: {
    ...mapMutations(['SIDEBAR_TOGGLE'])
  }
})
</script>

<style lang="scss" scoped>
@import '../vars';
.nfx-header {
  position: fixed;
  z-index: 1000;
  width: 100%;

  .navbar {
    box-shadow: 0 2px 3px $navShadow;
    padding: 10px 0;
    background-color: $primary;

    &-end {
      padding-right: 15px;
    }

    .navbar-item a,
    a.navbar-item {
      color: $orange;
      border-bottom: 1px solid $primary;

      &:hover {
        background: $primary;
        border-bottom: 1px solid $orange;
      }
    }

    &-link::after {
      border-color: white;
    }

    .navbar-item.has-dropdown:hover .navbar-link,
    .navbar-item.has-dropdown.is-active .navbar-link {
      background-color: $primary;
    }

    #link-brand {
      &:hover {
        background-color: $primary;
        border-bottom: 1px solid $primary;
      }
    }
  }

  .title {
    color: $orange;
  }

  .navbar-burger {
    position: absolute;
    left: 0;
    color: $orange;
  }

  @media (max-width: 768px) {
    .navbar {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
