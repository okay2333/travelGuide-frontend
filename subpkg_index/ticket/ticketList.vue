<template>
  <view class="container">
    <h3 class="title" style="text-align: center">门票</h3>
    <view class="list" v-for="item in ticketList" :key="item.id">
      <view class="ticketList" @click="goTicketDetail(item.id)">
        <view class="cover">
          <img class="ticketImg" :src="item.coverList[0]" alt="" />
        </view>
        <view class="info">
          <view class="title">
            <span>{{ item.scenicName }}</span>
          </view>
          <view class="address">{{ item.address }}</view>
          <view class="bottomInfo">
            <view class="tag" v-for="minItem in item.tagList" :key="minItem">
              <u-tag :text="minItem" mode="light" type="warning" />
            </view>
            <view class="price">￥{{ item.price }}</view>
          </view>
        </view>
      </view>
      <u-divider />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import ticketScenicApi from "@/apis/ticket-scenic.js";

const ticketList = ref();

const init = async () => {
  const { code, data } = await ticketScenicApi.listTicketScenicByPage();
  ticketList.value = data.records;
  console.log(ticketList.value);
};

onLoad(() => {
  init();
});

const goTicketDetail = (id) => {
  uni.navigateTo({
    url: `/subpkg_index/ticket/ticketDetail?id=${id}`,
  });
};
</script>

<style lang="scss">
$primary-color: #007aff; // 改成更现代的蓝色
$secondary-color: #f0f0f0; // 背景色
$font-size-title: 32rpx;
$font-size-address: 24rpx;
$font-size-price: 36rpx;
$font-size-tag: 20rpx;
$margin-base: 20rpx;
$image-size: 200rpx;
$border-radius: 15px;
$divider-color: #eaeaea;

.container {
  background-color: $secondary-color;
  padding: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
  // text-align: center;
}

.list {
  margin-top: 20rpx;
}

.ticketList {
  display: flex;
  background-color: white;
  border-radius: $border-radius;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20rpx;
  padding: 15rpx;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  }

  .cover {
    .ticketImg {
      width: $image-size;
      height: $image-size;
      border-radius: $border-radius;
      object-fit: cover;
    }
  }

  .info {
    flex: 1;
    margin-left: 15rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: $font-size-title;
      font-weight: 600;
      color: #333;
    }

    .address {
      margin-top: 10rpx;
      font-size: $font-size-address;
      color: #888;
      line-height: 1.4;
    }

    .bottomInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;

      .tag {
        margin-right: 10rpx;
        font-size: $font-size-tag;
      }

      .price {
        font-size: $font-size-price;
        color: $primary-color;
        font-weight: bold;
      }
    }
  }
}

u-divider {
  margin: 15rpx 0;
  border-top: 1rpx solid $divider-color;
}
</style>
