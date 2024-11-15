import { uniFetch } from './uni-fetch';
export default {
  add(preOrder) {
    return uniFetch.post('/orders/add', preOrder);
  },
  updateOrders(orderEditRequest) {
    return uniFetch.post('/orders/update', orderEditRequest);
  }
};
