import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  activePage: '',
  user: {
    isLoggedIn: false,
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    wins: 0,
    loses: 0,
    favoriteTeam: ''
  },
  players: [],
  myTeam: [],
  rankings: [],
  gameInfo: []
}

if (localStorage.getItem('FFX_USER')) {
  state.user = JSON.parse(localStorage.getItem('FFX_USER'))
}

const core = {
  actions,
  mutations,
  getters
}
export default new Vuex.Store({
  state,
  ...core
})
