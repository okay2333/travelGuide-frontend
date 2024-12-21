<template>
  <view class="container">
    <view class="header">
      <view class="main-title">VR 景点导览</view>
      <view class="subtitle">探索精彩景点，体验沉浸式游览</view>
    </view>

    <view class="tour-list">
      <view
        class="tour-card"
        v-for="item in vrTourList"
        :key="item.id"
        @click="goVRDetail(item.id)"
      >
        <view class="image-wrapper">
          <img :src="item.cover" mode="aspectFill" alt="VR Tour Cover" />
          <view class="location">
            <text class="icon">📍</text>
            {{ item.location }}
          </view>
        </view>
        <view class="content">
          <text class="name">{{ item.name }}</text>
          <view class="action">
            <text class="explore">探索</text>
            <text class="arrow">→</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import vrTourApi from "@/apis/vrtour";

const vrTourList = ref([]);

const fetchVRTours = async () => {
  try {
    const response = await vrTourApi.listVRTourByPage({
      current: 1,
      pageSize: 10,
    });
    vrTourList.value = response.data.records;
  } catch (error) {
    console.error("Failed to fetch VR tours:", error);
  }
};

const goVRDetail = (id) => {
  uni.navigateTo({
    url: `/subpkg_virtual/detail/index?id=${id}`,
  });
};

onMounted(() => {
  fetchVRTours();
});
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 32rpx 24rpx;
}

.header {
  margin-bottom: 40rpx;
  padding: 0 10rpx;

  .main-title {
    font-size: 44rpx;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: #666666;
  }
}

.tour-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.tour-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 360rpx;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .location {
      position: absolute;
      left: 20rpx;
      bottom: 20rpx;
      background: rgba(0, 0, 0, 0.6);
      padding: 8rpx 16rpx;
      border-radius: 100rpx;
      font-size: 24rpx;
      color: #ffffff;
      display: flex;
      align-items: center;

      .icon {
        margin-right: 6rpx;
        font-size: 24rpx;
      }
    }
  }

  .content {
    padding: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      font-size: 32rpx;
      font-weight: 500;
      color: #1a1a1a;
    }

    .action {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .explore {
        font-size: 28rpx;
        color: #3b7cff;
      }

      .arrow {
        color: #3b7cff;
        font-size: 28rpx;
      }
    }
  }
}
</style>
