export default {
  SET_USER: (state, user) => {
    state.user = user
    window.localStorage.setItem('NFX_AUTH_TOKEN', 'X12_ASFF_13349FSF')
    window.localStorage.setItem('NFX_USER', JSON.stringify(user))
  },
  SET_WEATHER_FORECAST: (state, gameWeather) => {
    state.gameInfo = gameWeather
  },
  SIDEBAR_TOGGLE: (state) => {
    state.isSidebarOpen = !state.isSidebarOpen
  },
  UPDATE_DRAFT_CONFIG(state, payload) {
    state.draftConfig = {
      ...payload
    }
  }
}
