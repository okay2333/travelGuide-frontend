<template>
  <view class="container">
    <view class="card">
      <view class="item" @click="goVRDetail">
        <view class="cover">
          <img src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/cvoer-kaiyuan.jpeg" width="120" height="120" alt="" />
        </view>
        <view class="text">
          <view class="title">开元寺</view>
          <view class="detail">开元寺（Kaiyuan Temple）位于福建省泉州市鲤城区西街176号</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const goVRDetail = () => {
  uni.navigateTo({
    url: '/subpkg_virtual/detail/index'
  });
};
</script>

<style lang="scss">
.container {
  .card {
    background-color: #f2f2f2;
    // box-shadow: -10rpx 10rpx 15rpx rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    padding: 20rpx;
    width: 95%;
    border-radius: 5px;
    .item {
      display: flex;
    }
  }
}
</style>
