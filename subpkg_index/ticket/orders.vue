<template>
  <view class="container">
    <view class="card">
      <view class="title">
        <span>九仙山风景区</span>
      </view>
      <hr />
      <view class="num">
        <view class="num_text">门票</view>
        <view>
          <u-number-box v-model="value" @change="valChange" size="32"></u-number-box>
        </view>
      </view>
      <hr />
      <view class="price">
        <view class="price_text">单价</view>
        <view class="price_num">￥76</view>
      </view>
    </view>
    <view class="bottom">
      <view class="price">实付￥300</view>
      <view class="buy">
        <u-button type="primary" shape="circle" @click="goOrders(ticket.id)">立即支付</u-button>
      </view>
    </view>
  </view>
</template>

<script setup></script>

<style>
.container {
  background-color: #04ccfe;
  height: 100vh;
  display: flex; /* 使用 flex布局解决外边距塌陷 */
  align-items: flex-start; /* 防止子元素被拉伸 */
  position: relative;
  .card {
    background-color: #ffffff;
    margin: 50rpx auto;
    width: 95%;
    border-radius: 5px;
    .title {
      margin: 30rpx;
      font-size: 38rpx;
      font-weight: 600;
    }
    .num {
      display: flex;
      margin: 30rpx;
      justify-content: space-between;
      .num_text {
        font-size: 32rpx;
      }
    }
    .price {
      display: flex;
      margin: 30rpx;
      justify-content: space-between;
      .price_text {
        font-size: 32rpx;
      }
      .price_num {
        font-size: 32rpx;
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    line-height: 80rpx;
    .price {
      font-weight: 600;
      font-size: 36rpx;
    }
  }
}
</style>
