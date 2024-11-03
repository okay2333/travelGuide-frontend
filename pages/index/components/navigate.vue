<template>
  <view class="menu">
    <view class="menu_item" @click="goReserve">
      <view class="item-icon">
        <svg class="icon" aria-hidden="true" :font-size="30" color="#f5f5f5">
          <use xlink:href="#icon-simiao"></use>
        </svg>
      </view>
      <view class="item-title">景区预约</view>
    </view>
    <view class="menu_item" @click="goTicket">
      <view class="item-icon">
        <svg class="icon" aria-hidden="true" :font-size="30" color="#f5f5f5">
          <use xlink:href="#icon-menpiao"></use>
        </svg>
      </view>
      <view class="item-title">门票购买</view>
    </view>
    <view class="menu_item">
      <view class="item-icon">
        <svg class="icon" aria-hidden="true" :font-size="30" color="#f5f5f5">
          <use xlink:href="#icon-vr-m"></use>
        </svg>
      </view>
      <view class="item-title">云游景区</view>
    </view>
    <view class="menu_item">
      <view class="item-icon">
        <svg class="icon" aria-hidden="true" :font-size="30" color="#f5f5f5">
          <use xlink:href="#icon-system-user"></use>
        </svg>
      </view>
      <view class="item-title">行程定制</view>
    </view>
  </view>
</template>

<script setup>
const goReserve = () => {
  uni.navigateTo({
    url: '/subpkg_index/reservations/index'
  });
};

const goTicket = () => {
  uni.navigateTo({
    url: '/subpkg_index/ticket/ticketList'
  });
};
</script>

<style lang="scss">
.menu {
  display: flex;
  justify-content: space-between;
  gap: 50rpx;
  .menu_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .item-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 15px;
      text-align: center;
      font-size: 65rpx;
    }
    &:nth-child(1) .item-icon {
      background-color: #25b0f3;
    }
    &:nth-child(2) .item-icon {
      background-color: #f39c12;
    }
    &:nth-child(3) .item-icon {
      background-color: #e74c3c;
    }
    &:nth-child(4) .item-icon {
      background-color: #2ecc71;
    }
    .item-title {
      margin-top: 10rpx;
    }
  }
}
</style>
