<template>
  <view class="container">
    <text class="title">订单详情</text>
    <view class="order-info">
      <text>订单号: {{ orderDetails.orderId }}</text>
      <text>景区名称: {{ orderDetails.scenicAreaName }}</text>
      <image :src="scenicAreaImage" class="scenic-image" mode="aspectFill" />
      <image :src="orderDetails.qrCode" class="qr-code" mode="aspectFill" />
    </view>
    <button class="back-button" @click="goBack">返回</button>
  </view>
</template>

<script setup>
import qrcodeverificationApi from "@/apis/qrcodeverification.js";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
const orderId = ref();
const orderDetails = ref({});

const init = async (orderId) => {
  const res = await qrcodeverificationApi.getQrcodeverificationVOByOrderId(
    orderId
  );
  orderDetails.value = res.data;
};

onLoad((options) => {
  orderId.value = options.id;
  init(orderId.value);
});
</script>

<style scoped>
.container {
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.order-info {
  margin-bottom: 30px;
}

.scenic-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.qr-code {
  width: 150px;
  height: 150px;
  border-radius: 8px;
}

.back-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
