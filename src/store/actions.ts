import { FantasyService } from '../api'

export default {
  AUTHENTICATE_USER: ({ commit }, { email }) => {
    // fake ajax
    commit('SET_USER', {
      id: 2,
      firstName: 'Tim',
      lastName: 'Banks',
      email,
      wins: 5,
      loses: 500,
      isLoggedIn: true
    })
  },
  GET_WEATHER: ({ commit }) => {
    const gameWeatherInfo = FantasyService.getWeather()
    commit('SET_WEATHER_FORECAST', gameWeatherInfo)
  }
}
