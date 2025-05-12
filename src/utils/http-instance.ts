import axios from 'axios';
import { USER_AGENT } from './constants';

export const oapiHttpInstance = axios.create();

oapiHttpInstance.interceptors.request.use(
  (request) => {
    if (request.headers) {
      request.headers['User-Agent'] = USER_AGENT;
    }
    return request;
  },
  undefined,
  { synchronous: true },
);

oapiHttpInstance.interceptors.response.use((response) => response.data);
