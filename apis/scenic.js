import { uniFetch } from './uni-fetch';

export default {
  /**
   * 创建景区
   * @param {Object} scenicAddRequest - 景区添加请求参数
   * @returns {Promise}
   */
  addScenic(scenicAddRequest) {
    console.log('添加景区请求参数', scenicAddRequest);
    return uniFetch.post('/scenic/add', scenicAddRequest);
  },

  /**
   * 删除景区（仅管理员）
   * @param {Object} deleteRequest - 删除请求参数
   * @returns {Promise}
   */
  deleteScenic(deleteRequest) {
    console.log('删除景区请求参数', deleteRequest);
    return uniFetch.post('/scenic/delete', deleteRequest);
  },

  /**
   * 更新景区（仅管理员）
   * @param {Object} scenicUpdateRequest - 景区更新请求参数
   * @returns {Promise}
   */
  updateScenic(scenicUpdateRequest) {
    console.log('更新景区请求参数', scenicUpdateRequest);
    return uniFetch.post('/scenic/update', scenicUpdateRequest);
  },

  /**
   * 根据ID获取景区（VO）
   * @param {number} id - 景区ID
   * @returns {Promise}
   */
  getScenicVOById(id) {
    console.log('获取景区ID', id);
    return uniFetch.get('/scenic/get/vo', { params: { id } });
  },

  /**
   * 根据ID获取景区
   * @param {number} id - 景区ID
   * @returns {Promise}
   */
  getScenicById(id) {
    console.log('获取景区ID', id);
    return uniFetch.get('/scenic/get', { params: { id } });
  },

  /**
   * 分页获取景区列表
   * @param {Object} scenicQueryRequest - 景区查询请求参数
   * @returns {Promise}
   */
  listScenicByPage(scenicQueryRequest) {
    console.log('分页获取景区请求参数', scenicQueryRequest);
    return uniFetch.post('/scenic/list/page', scenicQueryRequest);
  },

  /**
   * 分页获取景区列表（封装类）
   * @param {Object} scenicQueryRequest - 景区查询请求参数
   * @returns {Promise}
   */
  listScenicVOByPage(scenicQueryRequest) {
    console.log('分页获取景区请求参数', scenicQueryRequest);
    return uniFetch.post('/scenic/list/page/vo', scenicQueryRequest);
  }
};