<template>
  <view class="container">
    <text class="title">支付页面</text>
    <button @click="onSuccess">支付成功</button>
    <button @click="onFail">支付失败</button>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import orderApi from "@/apis/order.js";
const onSuccess = async () => {
  orderEditRequest.value.orderStatus = 1;
  console.log("@@@", orderEditRequest.value);
  const res = await orderApi.updateOrders(orderEditRequest.value);
  console.log("更新获取的数据", res);

  uni.navigateTo({
    url: `/subpkg_index/ticket/orderDetails?id=${orderId.value}`,
  });
};
const onFail = () => {};
const id = ref();
const orderId = ref();
const orderEditRequest = ref({});
onLoad((option) => {
  id.value = option.id;
  orderId.value = option.orderId;
  orderEditRequest.value.id = option.id;
  orderEditRequest.value.orderId = option.orderId;
});
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
