<template>
  <view class="detail_container">
    <view class="detail">
      <img class="cover" src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/duolamei.jpg" alt="" />
      <h3>{{ postDetail.title }}</h3>
      <h5>{{ postDetail.content }}</h5>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import postApi from '@/apis/post';
const postDetail = ref({});
// 初始化详情页
const init = async (id) => {
  const { code, data } = await postApi.detail(id);
  postDetail.value = data;
};
onLoad((option) => {
  init(option.id);
});
</script>

<style lang="scss">
.detail_container {
  .detail {
    .cover {
      width: 100%;
      height: width;
    }
  }
}
</style>
