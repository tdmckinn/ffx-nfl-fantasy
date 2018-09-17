import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  activePage: '',
  user: {
    id: '',
    isLoggedIn: false,
    fullName: '',
    email: '',
    wins: 0,
    loses: 0,
    favoriteTeam: ''
  },
  players: [],
  myTeam: [],
  rankings: [],
  gameInfo: [],
  isSidebarOpen: false,
  draftConfig: {
    isUserDrafting: false,
    isUserDraftLoading: false
  }
}

if (localStorage.getItem('NFX_USER')) {
  state.user = JSON.parse(localStorage.getItem('NFX_USER') || '')
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
