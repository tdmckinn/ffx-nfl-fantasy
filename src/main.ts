import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import VueApollo from 'vue-apollo'

import App from './App.vue'
import Modal from './components/globals/Modal.vue'
import PlayerModal from './components/player/PlayerModal.vue'
import router from './router'
import store from './store'

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql'
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// Install the vue plugin
Vue.use(VueApollo)

sync(store, router)

Vue.config.productionTip = false

// register global components
Vue.component('nfx-modal', Modal)
Vue.component('player-modal', PlayerModal)

Vue.config.ignoredElements = ['nfx-counter']

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  router,
  provide: apolloProvider.provide(),
  store,
  render: h => h(App)
})
