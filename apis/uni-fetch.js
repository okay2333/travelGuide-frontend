// 导入安装好的 uni-app-fetch 模块
import { createUniFetch } from 'uni-app-fetch';

// 配置符合自身业务的请求对象
export const uniFetch = createUniFetch({
  loading: { title: '正在加载...' },
  baseURL: 'http://localhost:8101/api',
  withCredentials: true,
  intercept: {
    // 请求拦截器
    request(options) {
      // 后续补充实际逻辑
      // 全局公共头部信息
      const defaultHeaders = {
        satoken: uni.getStorageSync('tokenValue')
      };
      // 自定义头信息token
      options.header = Object.assign({}, defaultHeaders, options.header);
      return options;
    },
    // 响应拦截器
    response(res) {
      console.log('响应拦截器的东西', res);
      const { data } = res;
      if (data.code === 40100) {
        uni.reLaunch({
          url: '/pages/login/index'
        });
      }
      // 后续补充实际逻辑
      return data;
    }
  }
});
