<template>
  <view class="container">
    <u-swiper :list="list" height="500" style="border-radius: 40px"></u-swiper>
    <view class="card">
      <navigateVue />
      <!--  <view class="menu">
        <view class="menu_item">
          <view class="item-icon">
            <svg class="icon" aria-hidden="true" :font-size="30" color="#f5f5f5">
              <use xlink:href="#icon-simiao"></use>
            </svg>
          </view>
          <view class="item-title">景区预约</view>
        </view>
        <view class="menu_item" @click="goReserve">预约</view>
        <view class="menu_item">VR</view>
        <view class="menu_item">定制</view>
      </view> -->
    </view>
    <!-- 官方推荐 （攻略）-->
    <h3>官方推荐</h3>
    <view class="official-recommend">
      <view class="rectangle"></view>
      <view class="squares">
        <view class="square"></view>
        <view class="square"></view>
      </view>
    </view>

    <!-- 本地推荐 （门票）-->
    <h3>本地推荐</h3>
    <view class="local-recommend">
      <view class="item">Item 1</view>
      <view class="item">Item 2</view>
      <view class="item">Item 3</view>
    </view>
  </view>
</template>

<script setup>
import navigateVue from './components/navigate.vue';
let list = [
  {
    image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
    title: '昨夜星辰昨夜风，画楼西畔桂堂东'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
    title: '身无彩凤双飞翼，心有灵犀一点通'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
    title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
  }
];
const goReserve = () => {
  uni.navigateTo({
    url: '/subpkg_index/reservations/index'
  });
};
</script>

<style lang="scss">
.container {
  .card {
    margin: 10px auto;
    padding: 20rpx;
    width: 95%;
    border-radius: 5px;
  }
  .official-recommend {
    width: 90%;
    margin: 10px auto;
    display: flex;
    align-items: center; /* 垂直居中对齐 */
    .rectangle {
      height: 420rpx; /* 长方形的宽度 */
      width: 300rpx; /* 长方形的高度 */
      background-color: black; /* 背景颜色 */
      margin-right: 20rpx; /* 间距 */
      border-radius: 5px;
    }
    .squares {
      display: flex;
      flex-direction: column; /* 垂直排列 */
      .square {
        width: 350rpx; /* 正方形的宽度和高度 */
        height: 200rpx;
        background-color: lightcoral; /* 背景颜色 */
        // margin-bottom: 10px; /* 间距 */
        margin: 5px 0;
        border-radius: 5px;
      }
    }
  }
  .local-recommend {
    margin: 10px auto;
    width: 95%; /* 外部盒子的宽度 */
    overflow-x: scroll; /* 允许水平滚动 */
    white-space: nowrap; /* 防止换行 */
    .item {
      display: inline-block;
      width: 300rpx; /* 内部盒子的宽度 */
      height: 250rpx; /* 内部盒子的高度 */
      background-color: beige;
      margin: 0 10rpx;
      border-radius: 5%;
    }
  }
}
</style>
