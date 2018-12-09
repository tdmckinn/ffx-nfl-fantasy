/* eslint-disable prefer-template */
import axios from 'axios'

export default class BaseService {
  private readonly api: string = '/api/'

  get(serviceName: string) {
    return axios.get(this.api + serviceName)
  }
}
