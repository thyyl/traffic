import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';
import qs from 'qs';

export class HTTPClient {
  instance: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    const MILLISECONDS = 1000;
    const SECONDS = 60;

    const defaultConfig = {
      timeout: SECONDS * MILLISECONDS,
      paramsSerializer: (params: any) => {
        return qs.stringify(params, { arrayFormat: 'brackets' });
      }
    };
    this.instance = axios.create({
      ...defaultConfig,
      ...config
    });
    return this;
  }

  getHeaders() {
    return this.instance.defaults.headers;
  }

  setHeaders(headers = {}) {
    const newHeaders = Object.assign(
      {},
      this.instance.defaults.headers.common,
      headers
    );
    Object.assign(this.instance.defaults.headers, { common: newHeaders });
    return this;
  }

  clearHeaders() {
    Object.assign(this.instance.defaults, { headers: {} });
    return this;
  }
}
