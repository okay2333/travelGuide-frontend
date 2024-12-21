<template>
  <view class="payment-container">
    <!-- 顶部金额展示区 -->
    <view class="amount-section">
      <text class="currency">¥</text>
      <text class="amount">{{ totalPrice }}</text>
    </view>

    <!-- 支付方式选择区 -->
    <view class="payment-methods">
      <text class="section-title">选择支付方式</text>

      <!-- 微信支付选项 -->
      <view class="payment-option" @click="selectPayment('wechat')">
        <view class="payment-option-left">
          <image
            class="payment-icon"
            src="/static/images/wechat-pay.png"
          ></image>
          <text class="payment-name">微信支付</text>
        </view>
        <view class="payment-option-right">
          <radio :checked="selectedPayment === 'wechat'" color="#07c160" />
          <!-- <radio :checked="selectedPayment === 'wechat'" color="#07c160" /> -->
        </view>
      </view>

      <!-- 支付宝选项 -->
      <!-- <view class="payment-option" @click="selectPayment('alipay')">
        <view class="payment-option-left">
          <image class="payment-icon" src="/static/images/alipay.png"></image>
          <text class="payment-name">支付宝支付</text>
        </view>
        <view class="payment-option-right">
          <radio :checked="selectedPayment === 'alipay'" color="#1677ff" />
        </view>
      </view> -->
    </view>

    <!-- 订单信息区 -->
    <view class="order-info">
      <text class="section-title">订单信息</text>
      <view class="info-item">
        <text class="info-label">订单编号</text>
        <text class="info-value">{{ orderId }}</text>
      </view>
    </view>

    <!-- 底部支付按钮 -->
    <view class="bottom-button-container">
      <button class="pay-button" @click="onSuccess">立即支付</button>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import paymentApi from "@/apis/payment.js";
import orderApi from "@/apis/order.js";

const selectedPayment = ref("wechat");
const id = ref();
const orderId = ref();
const orderEditRequest = ref({});
const totalPrice = ref(0);
const selectPayment = (type) => {
  selectedPayment.value = type;
};

const onSuccess = async () => {
  try {
    uni.showLoading({ title: "支付处理中..." });
    orderEditRequest.value.orderStatus = 1;
    console.log("点击��付", orderEditRequest.value);
    const res = await orderApi.updateOrders(orderEditRequest.value);
    const res1 = await paymentApi.updatePayment({
      orderId: orderId.value,
      paymentStatus: 1,
    });
    uni.hideLoading();
    uni.showToast({
      title: "支付成功",
      icon: "success",
      duration: 2000,
    });

    setTimeout(() => {
      uni.navigateTo({
        url: `/subpkg_index/ticket/orderDetails?id=${orderId.value}`,
      });
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: "支付失败",
      icon: "error",
    });
  }
};

const onFail = () => {
  uni.showToast({
    title: "支付已取消",
    icon: "none",
  });
};
// 创建支付实例
const init = async () => {
  await paymentApi.addPayment({
    orderId: orderId.value,
    paymentMethod: selectedPayment.value,
    paymentAmount: totalPrice.value,
    paymentStatus: 0,
  });
};
onLoad((option) => {
  orderId.value = option.orderId;
  orderEditRequest.value.id = option.orderId;
  totalPrice.value = option.totalPrice;
  init();
});
</script>

<style lang="scss" scoped>
.payment-container {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 20rpx;
}

.amount-section {
  background: linear-gradient(135deg, #1677ff, #1677ff);
  padding: 60rpx 40rpx;
  border-radius: 20rpx;
  text-align: center;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.2);

  .currency {
    color: #ffffff;
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .amount {
    color: #ffffff;
    font-size: 80rpx;
    font-weight: 500;
  }
}

.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.payment-methods {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.payment-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .payment-option-left {
    display: flex;
    align-items: center;
  }

  .payment-icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }

  .payment-name {
    font-size: 28rpx;
    color: #333;
  }
}

.order-info {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 120rpx;

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;

    .info-label {
      color: #666;
      font-size: 28rpx;
    }

    .info-value {
      color: #333;
      font-size: 28rpx;
    }
  }
}

.bottom-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.pay-button {
  background-color: #1677ff;
  color: #ffffff;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: 500;
  height: 90rpx;
  line-height: 90rpx;
  border: none;
  width: 100%;

  &:active {
    background-color: #1677ff;
  }
}
</style>
