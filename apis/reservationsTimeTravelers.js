import { uniFetch } from './uni-fetch';
export default {
  addApi(value) {
    console.log('api获取的值', value);
    return uniFetch.post('/reservationsTimeTravelers/add', value);
  }
};
