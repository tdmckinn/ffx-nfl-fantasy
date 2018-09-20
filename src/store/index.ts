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
  gameInfo: [],
  isSidebarOpen: false,
  draftConfig: {
    isUserDrafting: false,
    isUserDraftLoading: false
  }
}

if (localStorage.getItem('gotrue.user')) {
  const { id, email, user_metadata } = JSON.parse(localStorage.getItem('gotrue.user') || '{}')
  state.user = {
      ...state.user,
      ...{
      id,
      email,
      isLoggedIn: true, // check expiration token
      fullName: user_metadata.full_name
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
