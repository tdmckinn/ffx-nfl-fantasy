export default {
  SET_USER: (state, user) => {
    state.user = user
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
