import { uniFetch } from './uni-fetch';

export default {
  /**
   * 添加评论
   * @param {Object} commentAddRequest - 评论添加请求参数
   * @returns {Promise}
   */
  addComment(commentAddRequest) {
    console.log('添加评论请求参数', commentAddRequest);
    return uniFetch.post('/comment/add', commentAddRequest);
  },

  /**
   * 删除评论（仅管理员）
   * @param {Object} deleteRequest - 删除请求参数
   * @returns {Promise}
   */
  deleteComment(deleteRequest) {
    console.log('删除评论请求参数', deleteRequest);
    return uniFetch.post('/comment/delete', deleteRequest);
  },

  /**
   * 更新评论（仅管理员）
   * @param {Object} commentUpdateRequest - 评论更新请求参数
   * @returns {Promise}
   */
  updateComment(commentUpdateRequest) {
    console.log('更新评论请求参数', commentUpdateRequest);
    return uniFetch.post('/comment/update', commentUpdateRequest);
  },

  /**
   * 根据ID获取评论（VO）
   * @param {number} id - 评论ID
   * @returns {Promise}
   */
  getCommentVOById(id) {
    console.log('获取评论ID', id);
    return uniFetch.get('/comment/get/vo', { params: { id } });
  },

  /**
   * 查询帖子下的评论
   * @param {number} postId - 帖子ID
   * @returns {Promise}
   */
  listCommentsByPostId(postId) {
    console.log('获取帖子ID', postId);
    return uniFetch.get('/comment/list',  {postId});
  },

  /**
   * 分页获取评论列表（仅管理员）
   * @param {Object} commentQueryRequest - 评论查询请求参数
   * @returns {Promise}
   */
  listCommentByPage(commentQueryRequest) {
    console.log('分页获取评论请求参数', commentQueryRequest);
    return uniFetch.post('/comment/list/page', commentQueryRequest);
  }
};