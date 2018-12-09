// import { FantasyService } from '../api'

export default {
  USER_AUTHENTICATED: ({ commit }, { id, email, isLoggedIn, fullName }) => {
    // fake ajax
    commit('SET_USER', {
      id,
      email,
      wins: 5,
      loses: 500,
      fullName,
      isLoggedIn
    })
  },
  GET_WEATHER: ({ _commit }: any) => {
    console.log(_commit)
    // const gameWeatherInfo = FantasyService.getWeather()
    // commit('SET_WEATHER_FORECAST', gameWeatherInfo)
  }
}
