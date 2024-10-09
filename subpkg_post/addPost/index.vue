<script setup>
import { ref, reactive, computed } from 'vue';
const postForm = ref({
  title: '',
  content: '',
  covers: [],
  tags: ['est proident Excepteur laboris pariatur', 'fugiat dolor dolor esse adipisicing']
});
// 获取生命周期
import { onLoad } from '@dcloudio/uni-app';

import postApi from '@/apis/post';
const onSubmitPostForm = async () => {
  const { code, data } = await postApi.add(postForm.value);
  console.log(fileList.value);
  // 登录失败
  if (code !== 0) {
    alert('添加失败！');
  } else {
    // uni.navigateBack({
    //   delta: 2
    // });
  }

  console.log('登录后的结果code:', code);
  console.log('登录后的结果data:', data);
};

// 上传图片
const action = ref();
const fileList = ref([]);
const successUpload = ({ data }) => {
  console.log('上传成功');
  console.log(data);
  postForm.value.covers.push(data);
};
</script>

<template>
  <view class="login-container">
    <u-form :model="postForm" ref="form1">
      <u-form-item prop="title"><u-input v-model="postForm.title" placeholder="请输入完整帖子标题" /></u-form-item>
      <u-form-item prop="content"><u-input v-model="postForm.content" placeholder="请输入正文" style="height: 100px" /></u-form-item>
      <u-upload action="http://localhost:8101/api/file/upload" :file-list="fileList" @on-success="successUpload"></u-upload>
      <u-button @click="onSubmitPostForm">发布</u-button>
    </u-form>
  </view>
</template>

<style lang="scss" scoped>
// @import './index.scss';
</style>
