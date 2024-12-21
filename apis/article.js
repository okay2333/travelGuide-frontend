import { uniFetch } from './uni-fetch';

export default {
  /**
   * 创建文章（仅管理员）
   * @param {Object} articleAddRequest - 文章添加请求参数
   * @returns {Promise}
   */
  addArticle(articleAddRequest) {
    console.log('添加文章请求参数', articleAddRequest);
    return uniFetch.post('/article/add', articleAddRequest);
  },

  /**
   * 删除文章（仅管理员）
   * @param {Object} deleteRequest - 删除请求参数
   * @returns {Promise}
   */
  deleteArticle(deleteRequest) {
    console.log('删除文章请求参数', deleteRequest);
    return uniFetch.post('/article/delete', deleteRequest);
  },

  /**
   * 更新文章（仅管理员）
   * @param {Object} articleUpdateRequest - 文章更新请求参数
   * @returns {Promise}
   */
  updateArticle(articleUpdateRequest) {
    console.log('更新文章请求参数', articleUpdateRequest);
    return uniFetch.post('/article/update', articleUpdateRequest);
  },

  /**
   * 根据ID获取文章
   * @param {number} id - 文章ID
   * @returns {Promise}
   */
  getArticleVOById(id) {
    console.log('获取文章ID', id);
    return uniFetch.get('/article/get/vo', { id });
  },

  /**
   * 分页获取文章列表（仅管理员）
   * @param {Object} articleQueryRequest - 文章查询请求参数
   * @returns {Promise}
   */
  listArticleByPage(articleQueryRequest) {
    console.log('分页获取文章请求参数', articleQueryRequest);
    return uniFetch.post('/article/list/page', articleQueryRequest);
  }
};