<template>
  <view class="container">
    <view class="wrap">
      <u-swiper :list="list" height="500"></u-swiper>
    </view>
    <view class="info">
      <view class="title">{{ ticket.scenicName }}</view>
      <view class="tag" v-for="tag in ticket.tagList">
        <u-tag :text="tag" mode="light" type="warning" />
      </view>
      <view class="openTime">开放时间 {{ ticket.openingHours }}</view>
      <view class="phone">联系电话：{{ ticket.contactNumber }}</view>
      <view class="address">{{ ticket.address }}</view>
    </view>
    <view class="bottom">
      <view class="price">标准票￥{{ ticket.price }}</view>
      <view class="buy">
        <!-- <u-button type="primary" shape="circle" @click="goOrders(ticket.id)">立即购买</u-button> -->
        <u-button type="primary" shape="circle" @click="orderPopupshow = true"
          >立即购买</u-button
        >
      </view>
    </view>
    <!-- 确认订单弹窗 -->
    <u-popup v-model="orderPopupshow" mode="bottom">
      <view class="popup-container">
        <view class="item">
          <view class="item-cover">
            <img
              src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/duolamei.jpg"
              width="70"
              alt=""
            />
          </view>
          <view class="item-price">
            <view class="price">单价：￥{{ ticket.price }}</view>
            <u-number-box v-model="Numvalue" :min="1" size="32"></u-number-box>
          </view>
        </view>
        <view class="price">
          <button @click="onPay">立即支付￥{{ computeTotal }}</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import confirmOrder from "@/subpkg_index/ticket/component/confirmOrder.vue";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import ticketScenicApi from "@/apis/ticket-scenic.js";
import orderApi from "@/apis/order.js";
const orderPopupshow = ref(false);
const show = ref(false);
const list = ref([
  {
    image: "https://cdn.uviewui.com/uview/swiper/1.jpg",
    title: "昨夜星辰昨夜风，画楼西畔桂堂东",
  },
  {
    image: "https://cdn.uviewui.com/uview/swiper/2.jpg",
    title: "身无彩凤双飞翼，心有灵犀一点通",
  },
  {
    image: "https://cdn.uviewui.com/uview/swiper/3.jpg",
    title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
  },
]);

const ticket = ref({
  address: "",
  price: "",
});

const Numvalue = ref(1);
const computeTotal = computed(() => {
  return Numvalue.value * ticket.value.price;
});

const preOrder = ref({
  quantity: 1,
  ticketScenicId: "",
  totalPrice: "",
});

// 支付
const onPay = async () => {
  preOrder.value.quantity = Numvalue.value;
  preOrder.value.ticketScenicId = ticket.value.id;
  preOrder.value.totalPrice = computeTotal.value;
  console.log(preOrder.value);
  const res = await orderApi.add(preOrder.value);
  console.log("订单", res);

  uni.navigateTo({
    url: `/subpkg_index/ticket/payment?id=${res.data.id}&orderId=${res.data.orderId}`,
  });
};
const init = async (id) => {
  console.log(id);
  const { code, data } = await ticketScenicApi.getTicketScenicVOByIdApi(id);
  console.log(data);
  ticket.value = data;
  list.value = ticket.value.coverList;
};

const goOrders = (id) => {
  uni.navigateTo({
    url: `/subpkg_index/ticket/orders?id=${id}`,
  });
};

onLoad((option) => {
  init(option.id);
});
</script>

<style lang="scss">
.container {
  position: relative;
  height: 95vh;
  .info {
    margin: 30rpx;
    .title {
      font-weight: 600;
      font-size: 36rpx;
      margin: 20rpx 0;
    }
    .openTime {
      margin: 20rpx 0;
      font-size: 32rpx;
    }
    .phone {
      margin: 20rpx 0;
      font-size: 32rpx;
    }
  }
  .bottom {
    position: absolute;
    left: 0; /* 确保从左侧开始 */
    right: 0; /* 确保到达右侧 */
    padding: 0 30rpx; /* 添加一些内边距 */
    bottom: 30rpx;
    display: flex;
    justify-content: space-between;
    line-height: 80rpx;
    .price {
      font-weight: 600;
      color: royalblue;
      font-size: 36rpx;
    }
    .buy {
    }
  }
}
.popup-container {
  .item {
    margin: 30rpx;
    display: flex;
    .item-cover {
      margin-right: 30rpx;
    }
    .item-price {
      .price {
        color: orangered;
        margin: 20rpx 0;
      }
    }
  }
  .price {
  }
}
</style>
