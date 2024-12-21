<template>
  <view class="order-list">
    <view
      class="order-card"
      v-for="order in orderList"
      :key="order.id"
      @tap="goToOrderDetail(order.id)"
    >
      <!-- 景点信息 -->
      <view class="scenic-info">
        <image
          class="scenic-image"
          :src="order.ticketVO.scenicVO.carouselImagesList[0]"
          mode="aspectFill"
        />
        <view class="scenic-details">
          <text class="scenic-name">{{
            order.ticketVO.scenicVO.scenicName
          }}</text>
          <text class="scenic-address">
            <text class="iconfont icon-location">📍</text>
            {{ order.ticketVO.scenicVO.address }}
          </text>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="order-info">
        <view class="info-row">
          <text class="label">游玩日期</text>
          <text class="value">{{
            formatDate(order.ticketVO.openDateTime)
          }}</text>
        </view>
        <view class="info-row">
          <text class="label">购买数量</text>
          <text class="value">{{ order.quantity }}张</text>
        </view>
        <view class="info-row">
          <text class="label">订单状态</text>
          <text
            class="value status"
            :class="order.orderStatus === 1 ? 'paid' : 'unpaid'"
          >
            {{ order.orderStatus === 1 ? "已支付" : "待支付" }}
          </text>
        </view>
        <view class="info-row">
          <text class="label">下单时间</text>
          <text class="value">{{ formatDateTime(order.purchaseDate) }}</text>
        </view>
      </view>

      <!-- 价格信息 -->
      <view class="price-section">
        <text class="total-label">总价</text>
        <text class="price">¥{{ order.totalPrice }}</text>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section" v-if="order.orderStatus === 0">
        <button class="pay-btn" @tap.stop="goToPay(order)">立即支付</button>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="orderList.length === 0">
      <image
        src="/static/images/empty.png"
        mode="aspectFit"
        class="empty-image"
      />
      <text class="empty-text">暂无订单记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import orderApi from "@/apis/order";

const orderList = ref([]);

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${formatDate(dateStr)} ${String(date.getHours()).padStart(
    2,
    "0"
  )}:${String(date.getMinutes()).padStart(2, "0")}`;
};

// 获取订单列表
const getOrderList = async () => {
  try {
    const { code, data } = await orderApi.listMyOrdersVOByPage();
    if (code === 0) {
      orderList.value = data;
    }
  } catch (error) {
    uni.showToast({
      title: "获取订单列表失败",
      icon: "none",
    });
  }
};

// 跳转到订单详情
const goToOrderDetail = (orderId) => {
  uni.navigateTo({
    url: `/subpkg_index/ticket/orderDetails?id=${orderId}`,
  });
};

// 跳转到支付页面
const goToPay = (order) => {
  uni.navigateTo({
    url: `/subpkg_index/ticket/payment?orderId=${order.id}&totalPrice=${order.totalPrice}`,
  });
};

onMounted(() => {
  getOrderList();
});
</script>

<style lang="scss" scoped>
.order-list {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 20rpx;
}

.order-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .scenic-info {
    display: flex;
    margin-bottom: 30rpx;

    .scenic-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    .scenic-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .scenic-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }

      .scenic-address {
        font-size: 26rpx;
        color: #666;
        display: flex;
        align-items: center;

        .icon-location {
          margin-right: 8rpx;
          font-size: 24rpx;
        }
      }
    }
  }

  .order-info {
    border-top: 2rpx solid #f5f5f5;
    padding-top: 20rpx;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .label {
        font-size: 26rpx;
        color: #666;
      }

      .value {
        font-size: 26rpx;
        color: #333;

        &.status {
          &.paid {
            color: #2b85ff;
          }
          &.unpaid {
            color: #ff9800;
          }
        }
      }
    }
  }

  .price-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 2rpx solid #f5f5f5;

    .total-label {
      font-size: 26rpx;
      color: #666;
      margin-right: 20rpx;
    }

    .price {
      font-size: 36rpx;
      font-weight: 600;
      color: #2b85ff;
    }
  }

  .action-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 20rpx;

    .pay-btn {
      background: #2b85ff;
      color: #ffffff;
      font-size: 26rpx;
      padding: 12rpx 40rpx;
      border-radius: 30rpx;
      border: none;
      min-width: 160rpx;
      margin: 0;

      &:active {
        opacity: 0.9;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 40rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
