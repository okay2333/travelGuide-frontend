import { uniFetch } from './uni-fetch';

export default {
  /**
   * 创建VR Tour
   * @param {Object} vrTourAddRequest - VR Tour添加请求参数
   * @returns {Promise}
   */
  addVRTour(vrTourAddRequest) {
    console.log('添加VR Tour请求参数', vrTourAddRequest);
    return uniFetch.post('/vrtour/add', vrTourAddRequest);
  },

  /**
   * 删除VR Tour（仅管理员）
   * @param {Object} deleteRequest - 删除请求参数
   * @returns {Promise}
   */
  deleteVRTour(deleteRequest) {
    console.log('删除VR Tour请求参数', deleteRequest);
    return uniFetch.post('/vrtour/delete', deleteRequest);
  },

  /**
   * 更新VR Tour（仅管理员）
   * @param {Object} vrTourUpdateRequest - VR Tour更新请求参数
   * @returns {Promise}
   */
  updateVRTour(vrTourUpdateRequest) {
    console.log('更新VR Tour请求参数', vrTourUpdateRequest);
    return uniFetch.post('/vrtour/update', vrTourUpdateRequest);
  },

  /**
   * 根据ID获取VR Tour
   * @param {number} id - VR Tour ID
   * @returns {Promise}
   */
  getVRTourById(id) {
    console.log('获取VR Tour ID', id);
    return uniFetch.get('/vrtour/get', { id } );
  },

  /**
   * 分页获取VR Tour列表
   * @param {Object} vrTourQueryRequest - VR Tour查询请求参数
   * @returns {Promise}
   */
  listVRTourByPage(vrTourQueryRequest) {
    console.log('分页获取VR Tour请求参数', vrTourQueryRequest);
    return uniFetch.post('/vrtour/list/page', vrTourQueryRequest);
  }
};