<script setup>
import { ref, reactive, computed } from 'vue';
const loginForm = ref({
  userAccount: 'alice',
  userPassword: '12345678'
});
// 获取生命周期
import { onLoad } from '@dcloudio/uni-app';
// 待跳转的页面路径
const redirectURL = ref('');
// 获取页面跳转方式
const routeType = ref('');
onLoad((query) => {
  console.log('生命周期中获取的', query);
  redirectURL.value = query.redirectURL;
  routeType.value = query.routeType;
});
import userApi from '@/apis/user';
const onSubmitLoginForm = async () => {
  const { code, data } = await userApi.login(loginForm.value);
  const tokenValue = data.tokenInfo.tokenValue;
  uni.setStorageSync('tokenValue', tokenValue);
  // 登录失败
  if (code !== 0) {
    alert('登录失败！');
  } else {
    // uni.switchTab({
    //   url: 'pages/post/index'
    // });
    uni.switchTab({
      url: '/pages/post/index'
    });
  }
  console.log('登录后的结果code:', code);
  console.log('登录后的结果data:', data);
};
</script>

<template>
  <view class="login-container">
    <u-form :model="loginForm" ref="form1">
      <u-form-item label="账号" prop="userAccount"><u-input v-model="loginForm.userAccount" /></u-form-item>
      <u-form-item label="密码" prop="userPassword"><u-input v-model="loginForm.userPassword" /></u-form-item>
      <u-button @click="onSubmitLoginForm">登录</u-button>
    </u-form>
  </view>
</template>

<style lang="scss" scoped>
// @import './index.scss';
</style>
