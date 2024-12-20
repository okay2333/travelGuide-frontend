import { uniFetch } from './uni-fetch';
export default {
  listApi(parms) {
    return uniFetch.post('/reservations/list/page/vo',parms);
  },
  detail(id) {
    // return uniFetch.get(`/post/get/vo/`, { `1828346569544560641`});
    return uniFetch.get('/post/get/vo', {
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
  },
};
