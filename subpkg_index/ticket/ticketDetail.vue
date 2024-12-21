<template>
  <view class="container">
    <view class="swiper-container">
      <u-swiper :list="carouselList" height="400"></u-swiper>
    </view>

    <view class="content">
      <view class="info-card">
        <view class="header">
          <text class="title">{{ ticketData.scenicVO.scenicName }}</text>
          <view class="tags">
            <u-tag
              v-for="tag in ticketData.scenicVO.tagList"
              :key="tag"
              :text="tag"
              mode="light"
              type="warning"
              size="mini"
              class="tag-item"
            />
          </view>
        </view>

        <view class="details">
          <view class="detail-item">
            <u-icon name="clock" size="28"></u-icon>
            <text>开放时间：{{ ticketData.scenicVO.openingHours }}</text>
          </view>
          <view class="detail-item">
            <u-icon name="phone" size="28"></u-icon>
            <text>联系电话：{{ ticketData.scenicVO.contactNumber }}</text>
          </view>
          <view class="detail-item">
            <u-icon name="map" size="28"></u-icon>
            <text>{{ ticketData.scenicVO.address }}</text>
          </view>
          <view class="detail-item description">
            <text>{{ ticketData.scenicVO.details }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="price-container">
        <text class="currency">￥</text>
        <text class="price">{{ ticketData.price }}</text>
        <text class="stock">库存: {{ ticketData.stock }}张</text>
      </view>
      <view class="button-container">
        <u-button
          type="primary"
          shape="circle"
          @click="orderPopupshow = true"
          class="buy-button"
          >立即购买</u-button
        >
      </view>
    </view>

    <!-- 购买弹窗 -->
    <u-popup v-model="orderPopupshow" mode="bottom" border-radius="16">
      <view class="order-popup">
        <view class="popup-header">
          <text class="popup-title">确认订单</text>
          <u-icon name="close" @click="orderPopupshow = false"></u-icon>
        </view>

        <view class="ticket-item">
          <image
            class="ticket-image"
            :src="carouselList[0]?.image"
            mode="aspectFill"
          />
          <view class="ticket-info">
            <text class="ticket-name">{{
              ticketData.scenicVO.scenicName
            }}</text>
            <view class="price-selector">
              <text class="unit-price">￥{{ ticketData.price }}/张</text>
              <u-number-box
                v-model="Numvalue"
                :min="1"
                :max="ticketData.stock"
                size="32"
                class="quantity-selector"
              ></u-number-box>
            </view>
          </view>
        </view>

        <view class="total-section">
          <text class="total-label">总计</text>
          <text class="total-price">￥{{ computeTotal }}</text>
        </view>

        <view class="submit-section">
          <u-button
            type="primary"
            shape="circle"
            @click="onPay"
            class="submit-button"
            >确认支付</u-button
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import ticketScenicApi from "@/apis/ticket-scenic.js";
import orderApi from "@/apis/order.js";

const orderPopupshow = ref(false);
const Numvalue = ref(1);
const ticketData = ref({
  id: "",
  scenicId: "",
  price: 0,
  stock: 0,
  openDateTime: "",
  scenicVO: {
    id: "",
    scenicName: "",
    openingHours: "",
    contactNumber: "",
    address: "",
    details: "",
    type: 0,
    carouselImagesList: [],
    tagList: [],
  },
});

const carouselList = computed(() => {
  return ticketData.value.scenicVO.carouselImagesList.map((img) => ({
    image: img,
    title: ticketData.value.scenicVO.scenicName,
  }));
});

const computeTotal = computed(() => {
  return Numvalue.value * ticketData.value.price;
});

const preOrder = ref({
  quantity: 1,
  ticketScenicId: "",
  totalPrice: "",
});

const onPay = async () => {
  preOrder.value.quantity = Numvalue.value;
  preOrder.value.ticketId = ticketData.value.id;
  preOrder.value.totalPrice = computeTotal.value;

  try {
    const res = await orderApi.add(preOrder.value);
    uni.navigateTo({
      url: `/subpkg_index/ticket/payment?orderId=${res.data.id}&totalPrice=${res.data.totalPrice}`,
    });
  } catch (error) {
    uni.showToast({
      title: "创建订单失败",
      icon: "none",
    });
  }
};

const init = async (id) => {
  try {
    const { data } = await ticketScenicApi.getTicketScenicVOByIdApi(id);
    ticketData.value = data;
  } catch (error) {
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  }
};

onLoad((option) => {
  init(option.id);
});
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.swiper-container {
  width: 100%;
  background-color: #fff;
}

.content {
  padding: 20rpx;
}

.info-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .header {
    margin-bottom: 30rpx;

    .title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;

      .tag-item {
        margin-right: 12rpx;
      }
    }
  }

  .details {
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      color: #666;
      font-size: 28rpx;

      .u-icon {
        margin-right: 16rpx;
      }

      &.description {
        line-height: 1.6;
        color: #999;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .price-container {
    display: flex;
    align-items: baseline;

    .currency {
      font-size: 28rpx;
      color: #ff6b6b;
    }
    .price {
      font-size: 48rpx;
      font-weight: 600;
      color: #ff6b6b;
      margin-right: 16rpx;
    }
    .stock {
      font-size: 24rpx;
      color: #999;
    }
  }

  .buy-button {
    min-width: 240rpx;
  }
}

.order-popup {
  background-color: #fff;
  padding: 30rpx;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .popup-title {
      font-size: 32rpx;
      font-weight: 600;
    }
  }

  .ticket-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 2rpx solid #f5f5f5;

    .ticket-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .ticket-info {
      flex: 1;

      .ticket-name {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }

      .price-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .unit-price {
          color: #ff6b6b;
          font-size: 32rpx;
        }
      }
    }
  }

  .total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;

    .total-label {
      font-size: 28rpx;
      color: #666;
    }

    .total-price {
      font-size: 36rpx;
      font-weight: 600;
      color: #ff6b6b;
    }
  }

  .submit-section {
    margin-top: 30rpx;

    .submit-button {
      width: 100%;
    }
  }
}
</style>
