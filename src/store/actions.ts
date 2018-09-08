import { FantasyService } from '../api'

export default {
  AUTHENTICATE_USER: ({ commit }, { email }) => {
    // fake ajax
    commit('SET_USER', {
      id: '2',
      firstName: 'Tim',
      lastName: 'Banks',
      email,
      wins: 5,
      loses: 500,
      isLoggedIn: true
    })
  },
  GET_PLAYERS: ({ commit }) => {
    FantasyService.getPlayers().then((data) => {
      commit('SET_PLAYERS', data)
    })
  },
  GET_DRAFT_RANKINGS: ({ commit }) => {
    FantasyService.getDraftRankings().then((data) => {
      commit('SET_DRAFT_RANKINGS', data)
    })
  },
  GET_WEATHER: ({ commit }) => {
    const gameWeatherInfo = FantasyService.getWeather()
    commit('SET_WEATHER_FORECAST', gameWeatherInfo)
  },
  ADD_PLAYER: ({ commit }, player) => {
    commit('ADD_TEAM_MEMBER', {...player })
  },
  REMOVE_PLAYER: ({ commit }, player) => {
    commit('REMOVE_TEAM_MEMBER', {...player })
  }
}
