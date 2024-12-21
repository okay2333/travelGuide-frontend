import { uniFetch } from './uni-fetch';
export default {
  addApi(value) {
    console.log('api获取的值', value);
    return uniFetch.post('/reservationsTravelers/add', value);
  },
  listReservationsTimeByUserId() {
    return uniFetch.post('/reservationsTravelers/list/page/byUserId' );
  },
  deleteReservationsTime(deleteRequest) {
    return uniFetch.post('/reservationsTravelers/delete', {id:deleteRequest});
  },
  getUserReservationsCount() {
    return uniFetch.get('/reservationsTravelers/count');
  },
};
