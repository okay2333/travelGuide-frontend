import { uniFetch } from './uni-fetch';

export default {
  // 添加反馈
  add(feedbackAddRequest) {
    return uniFetch.post('/feedback/add', feedbackAddRequest);
  },


  // 根据 id 获取反馈详情
  getById(id) {
    return uniFetch.get('/feedback/get/vo', { id });
  },

  // 分页获取反馈列表
  listByPage(feedbackQueryRequest) {
    return uniFetch.post('/feedback/list/page/vo', feedbackQueryRequest);
  },

  // 获取当前用户的反馈列表
  listMyFeedback() {
    return uniFetch.post('/feedback/list/my/page/vo');
  }
};
