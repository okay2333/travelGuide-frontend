import { uniFetch } from './uni-fetch';
export default {
  listTicketScenicByPage() {
    return uniFetch.post('/ticketScenic/list/page', {
      current: 1,
      pageSize: 10
    });
  },
  getTicketScenicVOByIdApi(id) {
    return uniFetch.get('/ticketScenic/get/vo', {
      id
    });
  },
  add(post) {
    return uniFetch.post('/post/add', post);
  },
  testadd() {
    return uniFetch.post('/post/add', {
      content: 'ceshi1',
      tags: [12],
      title: 'ceshi01'
    });
  }
};