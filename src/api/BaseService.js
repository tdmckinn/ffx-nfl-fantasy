/* eslint-disable prefer-template */
import axios from 'axios'

export default class BaseService {
  constructor() {
    this.api = '/api/'
  }

  request(serviceName = '') {
    let res = null
    if (serviceName) {
      res = axios.get(this.api + serviceName)
    } else {
      alert('Service name is required')
    }
    return res
  }
}
