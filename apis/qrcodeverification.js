  import { uniFetch } from './uni-fetch';
  export default {
    getQrcodeverificationVOByOrderId(orderId) {
      return uniFetch.get('/qrcodeverification/get/vo/byorderId', {orderId});
    }
  };
