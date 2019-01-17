import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App.vue'
import router from './router'
import store from './store'
import './registerGlobals'
import { apolloProvider, VueApollo } from './apollo'

Vue.use(VueApollo)

sync(store, router)

Vue.config.productionTip = false

// native web-component
Vue.config.ignoredElements = ['nfx-counter']

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#nfx-app',
  router,
  apolloProvider,
  store,
  render: h => h(App)
})
