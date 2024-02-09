import axios from 'axios';

import { BASE_URL_API } from './Config';

class Axios {
  constructor() {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.axios = axios.create({
      baseURL: `${BASE_URL_API}/api/apps/`,
      headers: defaultHeaders,
      timeout: 5000,
    });
    this.init = this.init.bind(this);
  }
  getServerUrl() {
    return `${BASE_URL_API}`;
  }
  init(token) {
    if (token) {
      this.axios = axios.create({
        baseURL: `${BASE_URL_API}/api/apps/`,
        headers: { ...this.defaultHeaders, Authorization: `jwt ${token}` },
      });
    } else {
      this.axios = axios.create({
        baseURL: `${BASE_URL_API}/api/apps/`,
        headers: this.defaultHeaders,
      });
    }
  }

  getInstance() {
    return this.axios;
  }
}

export default new Axios();
