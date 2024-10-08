<script setup>
import { ref, reactive, computed } from 'vue';
const postForm = ref({
  title: '',
  content: '',
  tags: [12]
});
// 获取生命周期
import { onLoad } from '@dcloudio/uni-app';

import postApi from '@/apis/post';
const onSubmitPostForm = async () => {
  const { code, data } = await postApi.add(postForm.value);
  // 登录失败
  if (code !== 0) {
    alert('添加失败！');
  } else {
    uni.navigateBack({
      delta: 2
    });
  }
  console.log('登录后的结果code:', code);
  console.log('登录后的结果data:', data);
};

// 上传图片
const action = ref();
const fileList = [];
</script>

<template>
  <view class="login-container">
    <u-form :model="postForm" ref="form1">
      <u-form-item prop="title"><u-input v-model="postForm.title" placeholder="请输入完整帖子标题" /></u-form-item>
      <u-form-item prop="content"><u-input v-model="postForm.content" placeholder="请输入正文" style="height: 100px" /></u-form-item>
      <u-upload :action="action" :file-list="fileList"></u-upload>
      <u-button @click="onSubmitPostForm">发布</u-button>
    </u-form>
  </view>
</template>

<style lang="scss" scoped>
// @import './index.scss';
</style>
