export default {
  SET_USER: (state, user) => {
    state.user = user
    window.localStorage.setItem('FFX_AUTH_TOKEN', 'X12_ASFF_13349FSF')
    window.localStorage.setItem('FFX_USER', JSON.stringify(user))
  },
  SET_PLAYERS: (state, players) => {
    state.players = players
  },
  ADD_TEAM_MEMBER: (state, player) => {
    state.myTeam.push(player)
  },
  REMOVE_TEAM_MEMBER: (state, player) => {
    const index = state.myTeam.findIndex(item => item.playerId === player.playerId)
    state.myTeam.splice(index, 1)
  },
  SET_WEATHER_FORECAST: (state, gameWeather) => {
    state.gameInfo = gameWeather
  },
  SET_DRAFT_RANKINGS: (state, draftRankings) => {
    state.draftRankings = draftRankings
  }
}
