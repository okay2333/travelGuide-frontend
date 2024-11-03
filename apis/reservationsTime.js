import { uniFetch } from './uni-fetch';
export default {
  list(reservationsId) {
    return uniFetch.post('/reservationsTime/list/page', {
      reservationsId
    });
  }
};
