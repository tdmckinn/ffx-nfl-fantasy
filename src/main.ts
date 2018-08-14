// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App.vue'
import Modal from './components/globals/Modal.vue'
import PlayerModal from './components/player/PlayerModal.vue'
import router from './router'
import store from './store'

sync(store, router)

Vue.config.productionTip = false

// register global components
Vue.component('modal', Modal)
Vue.component('playerModal', PlayerModal)

Vue.config.ignoredElements = [
  'ffx-counter'
]

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
