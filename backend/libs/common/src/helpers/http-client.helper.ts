import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HTTPClient {
  instance: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    const MILLISECONDS = 1000;
    const SECONDS = 60;

    const defaultConfig = {
      timeout: SECONDS * MILLISECONDS,
      paramsSerializer: (params: any) => {
        const searchParams = new URLSearchParams();
        for (const key in params) {
          if (params.hasOwnProperty(key) && params[key] !== undefined) {
            searchParams.append(key, params[key]);
          }
        }
        return searchParams.toString();
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
