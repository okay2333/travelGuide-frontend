<template>
  <view class="">
    <h3>门票</h3>
    <view class="list" v-for="item in ticketList">
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
            <view class="tag" v-for="minItem in item.tagList">
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
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import ticketScenicApi from '@/apis/ticket-scenic.js';
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
    url: `/subpkg_index/ticket/ticketDetail?id=${id}`
  });
};
</script>

<style lang="scss">
.ticketList {
  display: flex;
  margin: 30rpx;
  .cover {
    .ticketImg {
      width: 240rpx;
      height: 240rpx;
      border-radius: 15px;
    }
  }
  .info {
    position: relative; /* 设置容器为相对定位 */
    flex: 1;
    margin-left: 20rpx;
    .title {
      font-weight: 600;
      font-size: 32rpx;
    }
    .address {
      margin-top: 10rpx;
      font-weight: 200;
      font-size: 22rpx;
    }
    .bottomInfo {
      position: absolute; /* 绝对定位 */
      bottom: 30rpx; /* 移动到容器底部 */
      display: flex;
      justify-content: space-between;
      width: 100%; /* 根据需要设置宽度 */
      .price {
        font-size: 36rpx;
        color: blue;
      }
    }
  }
}
</style>
