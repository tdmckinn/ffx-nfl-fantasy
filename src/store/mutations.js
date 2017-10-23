/* eslint-disable no-param-reassign */
export default {
  SET_USER: (state, user) => {
    state.user = user
    window.localStorage.setItem('FFX_AUTH_TOKEN', 'X12_ASFF_13349FSF')
    window.localStorage.setItem('FFX_USER', JSON.stringify(user))
  },
  SET_PLAYERS: (state, players) => {
    state.players = players
  },
  UPDATE_PLAYER_TEAM: (state, player) => {
    state.myTeam.push(player)
  },
  SET_WEATHER_FORECAST: (state, gameWeather) => {
    state.gameInfo = gameWeather
  }
}
