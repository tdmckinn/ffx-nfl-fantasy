import BaseService from './BaseService'
import Weather from '../../data/weather.json'

class FantasyService extends BaseService {
  async getDraftRankings() {
    const { data } = await this.get('players')
    return data.DraftRankings
  }

  async getPlayers() {
    const { data } = await this.get('players')
    return data.Players
  }

  async getPlayerResearch() {
    const { data } = await this.get('research')
    return data.Players
  }

  getWeather() {
    return Weather
  }
}

export default new FantasyService()
