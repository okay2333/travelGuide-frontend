<template>
  <view class="container">
    <!-- 顶部用户信息区域 -->
    <view class="user-info">
      <view class="avatar-box">
        <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill" />
      </view>
      <view class="info-content">
        <text class="username">{{ userInfo.username }}</text>
        <text class="user-desc">{{ userInfo.desc }}</text>
      </view>
    </view>

    <!-- 数据统计区域 -->
    <view class="stats-box">
      <view class="stat-item">
        <text class="num">{{ stats.trips }}</text>
        <text class="label">行程预约</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.tickets }}</text>
        <text class="label">购票记录</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.favorites }}</text>
        <text class="label">收藏攻略</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-group">
        <view
          class="menu-item"
          @tap="navigateTo('/subpkg_index/reservations/record')"
        >
          <view class="item-left">
            <text class="iconfont icon-calendar"></text>
            <text class="title">我的预约</text>
          </view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view
          class="menu-item"
          @tap="navigateTo('/subpkg_index/ticket/orderList')"
        >
          <view class="item-left">
            <text class="iconfont icon-ticket"></text>
            <text class="title">购票记录</text>
          </view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @tap="navigateTo('/subpkg_my/favorites/index')">
          <view class="item-left">
            <text class="iconfont icon-star"></text>
            <text class="title">我的收藏</text>
          </view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" @tap="navigateTo('/subpkg_my/profile/edit')">
          <view class="item-left">
            <text class="iconfont icon-edit"></text>
            <text class="title">修改个人信息</text>
          </view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
        <view class="menu-item" @tap="navigateTo('/subpkg_my/feedback/list')">
          <view class="item-left">
            <text class="iconfont icon-feedback"></text>
            <text class="title">我的反馈</text>
          </view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import userApi from "@/apis/user";
import orderApi from "@/apis/order";
import reservationsTravelersApi from "@/apis/reservationsTravelers";
import postFavourApi from "@/apis/post-favour";

// 用户信息
const userInfo = ref({
  username: "",
  avatarUrl: "",
  desc: "",
});

// 统计数据
const stats = ref({
  trips: 0, // 预约数量
  tickets: 0, // 订单数量
  favorites: 0, // 收藏数量（暂时保持0）
});

// 获取统计数据
const getStats = async () => {
  try {
    // 获取预约数量
    const { data: tripsCount } =
      await reservationsTravelersApi.getUserReservationsCount();
    // 获取订单数量
    const { data: ticketsCount } = await orderApi.getUserOrdersCount();
    // 获取收藏数量
    const { data: favourCount } = await postFavourApi.count();

    stats.value = {
      trips: tripsCount || 0,
      tickets: ticketsCount || 0,
      favorites: favourCount || 0,
    };
  } catch (error) {
    console.error("获取统计数据失败:", error);
    uni.showToast({
      title: "获取统计数据失败",
      icon: "none",
    });
  }
};

// 获取登录用户信��
const getLoginUser = async () => {
  try {
    const { data } = await userApi.getLoginUser();
    userInfo.value = {
      username: data.userName || "未登录",
      avatarUrl: data.userAvatar || "/static/images/default-avatar.png",
      desc: data.userProfile || "开启您的旅行之旅",
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
    uni.showToast({
      title: "获取用户信息失败",
      icon: "none",
    });
  }
};

// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({ url });
};

onMounted(async () => {
  await getLoginUser();
  await getStats();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.user-info {
  position: relative;
  padding: 40rpx 30rpx 100rpx;
  background: linear-gradient(135deg, #0066ff 0%, #2b85ff 100%);
  display: flex;
  align-items: center;

  .avatar-box {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    overflow: hidden;

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .info-content {
    margin-left: 24rpx;
    color: #fff;

    .username {
      font-size: 36rpx;
      font-weight: 600;
      margin-bottom: 16rpx;
      display: block;
    }

    .user-desc {
      font-size: 24rpx;
      opacity: 0.8;
      display: block;
      line-height: 1.4;
      max-width: 400rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.stats-box {
  position: relative;
  margin: -70rpx 20rpx 0;
  padding: 30rpx 0;
  background-color: #fff;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  z-index: 1;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx 0;

    .num {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.menu-list {
  margin: 30rpx 20rpx;

  .menu-group {
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
  }

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-left {
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 40rpx;
        color: #2b85ff;
        margin-right: 20rpx;
      }

      .title {
        font-size: 28rpx;
        color: #333;
      }
    }

    .icon-arrow-right {
      font-size: 32rpx;
      color: #999;
    }
  }
}
</style>
