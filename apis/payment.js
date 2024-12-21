import { uniFetch } from './uni-fetch';
export default {
  addPayment(paymentAddRequest) {
    return uniFetch.post('/payment/add', paymentAddRequest);
  },
  updatePayment(paymentUpdateRequest) {
    return uniFetch.post('/payment/update', paymentUpdateRequest);
  }
};
