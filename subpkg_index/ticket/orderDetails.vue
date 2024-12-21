<template>
  <view class="order-detail">
    <!-- 顶部状态区 -->
    <view class="status-section">
      <view class="status-icon">
        <uni-icons type="checkmarkempty" size="50" color="#07c160"></uni-icons>
      </view>
      <text class="status-text">订单已完成</text>
    </view>

    <!-- 门票信息区 -->
    <view class="ticket-card">
      <view class="ticket-info">
        <text class="scenic-name">{{ orderDetails.scenicAreaName }}</text>
        <view class="ticket-meta">
          <text class="date"
            >使用日期：{{ orderDetails.useDate || "2024-12-05" }}</text
          >
          <text class="quantity">数量：{{ orderDetails.quantity || 1 }}张</text>
        </view>
      </view>
    </view>

    <!-- 核销码区域 -->
    <view class="qr-section">
      <text class="section-title">电子凭证</text>
      <view class="qr-wrapper">
        <image :src="orderDetails.qrCode" class="qr-code" mode="aspectFit" />
      </view>
      <p class="qr-tip">请向工作人员出示此二维码</p>
    </view>

    <!-- 订单信息区 -->
    <view class="order-info-card">
      <text class="section-title">订单信息</text>
      <view class="info-item">
        <text class="label">订单编号</text>
        <text class="value">{{ orderDetails.orderId }}</text>
      </view>
      <view class="info-item">
        <text class="label">下单时间</text>
        <text class="value">{{
          orderDetails.createTime || "2024-12-04 15:30:00"
        }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付方式</text>
        <text class="value">{{
          orderDetails.paymentMethod || "微信支付"
        }}</text>
      </view>
    </view>

    <!-- 底部按钮区 -->
    <view class="bottom-actions">
      <button class="action-btn outline" @click="contactService">
        联系客服
      </button>
      <button class="action-btn primary" @click="goBack">返回首页</button>
    </view>
  </view>
</template>

<script setup>
import qrcodeverificationApi from "@/apis/qrcodeverification.js";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const orderId = ref();
const orderDetails = ref({});

const init = async (orderId) => {
  try {
    uni.showLoading({ title: "加载中..." });
    const res = await qrcodeverificationApi.getQrcodeverificationVOByOrderId(
      orderId
    );
    orderDetails.value = res.data;
  } catch (error) {
    uni.showToast({
      title: "获取订单详情失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};

const contactService = () => {
  // 实现联系客服逻辑
  uni.showToast({
    title: "正在接入客服...",
    icon: "none",
  });
};

const goBack = () => {
  uni.navigateBack();
};

onLoad((options) => {
  orderId.value = options.id;
  init(orderId.value);
});
</script>

<style lang="scss" scoped>
.order-detail {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
}

.status-section {
  background: linear-gradient(135deg, #07c160, #05a753);
  padding: 60rpx 40rpx;
  text-align: center;

  .status-icon {
    margin-bottom: 20rpx;
  }

  .status-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 500;
  }
}

.ticket-card {
  margin: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .scenic-image {
    width: 100%;
    height: 300rpx;
  }

  .ticket-info {
    padding: 30rpx;

    .scenic-name {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 20rpx;
    }

    .ticket-meta {
      display: flex;
      justify-content: space-between;
      color: #666;
      font-size: 26rpx;
    }
  }
}

.qr-section {
  margin: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 30rpx;
  }

  .qr-wrapper {
    padding: 40rpx;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
  }

  .qr-code {
    width: 400rpx;
    height: 400rpx;
  }

  .qr-tip {
    font-size: 24rpx;
    color: #999;
  }
}

.order-info-card {
  margin: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 30rpx;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    font-size: 26rpx;

    .label {
      color: #666;
    }

    .value {
      color: #333;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .action-btn {
    flex: 1;
    margin: 0 15rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;

    &.outline {
      background-color: #ffffff;
      color: #07c160;
      border: 2rpx solid #07c160;
    }

    &.primary {
      background-color: #07c160;
      color: #ffffff;
    }
  }
}

.section-title {
  font-weight: 500;
  display: block;
}
</style>
