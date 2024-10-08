import { uniFetch } from './uni-fetch';
export default {
  doPostFavourApi(PostFavourAddRequest) {
    return uniFetch.post('/post_favour/', PostFavourAddRequest);
  },
  listMyFavourPostByPageApi(postQueryRequest) {
    return uniFetch.post('/post_favour/my/list/page', postQueryRequest);
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
  }
};
