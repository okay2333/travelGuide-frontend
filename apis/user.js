import { uniFetch } from './uni-fetch';
export default {
  login(loginForm) {
    console.log('获取的loginForm值', loginForm);
    return uniFetch.post('/user/login', loginForm);
  },
  logOutApi() {
    return uniFetch.post('/user/logout');
  },
  testLogin() {
    console.log('测试登录');
    return uniFetch.post('/user/login', { userAccount: 'alice', userPassword: '12345678' });
  }
};
