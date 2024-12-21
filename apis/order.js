import { uniFetch } from './uni-fetch';
export default {
  add(preOrder) {
    return uniFetch.post('/orders/add', preOrder);
  },
  updateOrders(orderEditRequest) {
    return uniFetch.post('/orders/update', orderEditRequest);
  },
  listMyOrdersVOByPage(){
    return uniFetch.post('/orders/list/page/my/vo');
  },
  getUserOrdersCount(){
    return uniFetch.get('/orders/count');
  }
};
