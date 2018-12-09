<template>
  <div class="nfx-overlay" v-bind:class="{ 'is-active' :isSidebarOpen }">
    <aside class="nfx-sidebar__menu">
      <p class="menu-label">
        General
      </p>
      <ul class="menu-list">
        <li router-link v-for="({ name, route }, index) in navBarItems"  :key="index">
          <router-link class="navbar-item" :to="route" @click.native="SIDEBAR_TOGGLE">
            {{name}}
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'

import { INavItem } from './NfxHeader.vue'

export default Vue.extend({
  name: 'nfx-sidebar',
  props: {
    navBarItems: {
      type: Array as () => INavItem[]
    }
  },
  computed: mapState([
    'isSidebarOpen'
  ]),
  methods: {
    ...mapMutations([
        'SIDEBAR_TOGGLE',
    ])
  }
})
</script>

<style lang="scss" scoped>
  .nfx-overlay {
    display: none;
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: opacity 0.3s;

    &.is-active {
      display: block;
    }
  }

  .nfx-sidebar__menu {
    position: fixed;
    left: 0px;
    z-index: 1100;
    width: 300px;
    height: 100%;
    transition: all 0.5s;
    transform: translate3d(0, 0px, 0px);
    background: white;
    padding-top: 15px;
    padding-left: 6px;
  }
</style>
