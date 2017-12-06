/* eslint-disable class-methods-use-this */

import BaseService from './BaseService'
import Weather from '../../data/weather.json'

class FantasyService extends BaseService {
  async getDraftRankings() {
    const { data } = await this.request('draft-rankings')
    return data.DraftRankings
  }

  async getPlayers() {
    const { data } = await this.request('players')
    return data.Players
  }

  getWeather() {
    return Weather
  }
}

export default new FantasyService()
