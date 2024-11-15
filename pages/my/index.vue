<template>
  <view class="container">
    <view class="header">
      <image class="avatar" :src="userInfo.avatarUrl" />
      <text class="username">{{ userInfo.username }}</text>
    </view>
    <view class="details">
      <view class="item" @click="goToSettings">
        <text class="item-label">设置</text>
        <image class="icon" src="/static/icons/arrow-right.png" />
      </view>
      <view class="item" @click="goToOrders">
        <text class="item-label">我的订单</text>
        <image class="icon" src="/static/icons/arrow-right.png" />
      </view>
      <view class="item" @click="logout">
        <text class="item-label">退出登录</text>
        <image class="icon" src="/static/icons/arrow-right.png" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

// 用户信息，模拟从后台获取
const userInfo = ref({
  username: "张三",
  avatarUrl: "https://example.com/avatar.jpg", // 默认头像
});

// 更换头像函数（模拟）
const changeAvatar = () => {
  // 在这里可以添加逻辑来调用文件上传功能
  console.log("更换头像");
  userInfo.value.avatarUrl = "https://example.com/new-avatar.jpg"; // 更换为新头像
};

// 跳转到设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: "/pages/settings/settings",
  });
};

// 跳转到订单页面
const goToOrders = () => {
  uni.navigateTo({
    url: "/pages/orders/orders",
  });
};

// 退出登录
const logout = () => {
  // 清除用户信息、token等，模拟退出
  console.log("退出登录");
  uni.clearStorageSync();
  uni.reLaunch({
    url: "/pages/login/login",
  });
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.username {
  font-size: 28rpx;
  font-weight: bold;
}

.details {
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 24rpx;
}

.icon {
  width: 30rpx;
  height: 30rpx;
}
</style>
s
