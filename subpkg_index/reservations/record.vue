<template>
  <view class="reservation-page">
    <!-- 有预约记录时显示列表 -->
    <template v-if="reservationsList && reservationsList.length > 0">
      <view
        class="reservation-card"
        v-for="item in reservationsList"
        :key="item.id"
      >
        <!-- 景点信息区 -->
        <view class="scenic-info">
          <view class="scenic-main">
            <text class="scenic-name">{{
              item.reservationsVO.scenicVO.scenicName
            }}</text>
            <view class="scenic-address">
              <text class="iconfont icon-location">📍</text>
              <text>{{ item.reservationsVO.scenicVO.address }}</text>
            </view>
          </view>
          <view class="scenic-date">
            <text
              >游玩日期:
              {{ formatDate(item.reservationsVO.openDateTime) }}</text
            >
          </view>
        </view>

        <!-- 游客信息区 -->
        <view class="travelers-section">
          <text class="section-title">游客信息</text>
          <view
            class="traveler-item"
            v-for="(traveler, index) in item.travelerList"
            :key="index"
          >
            <view class="info-row">
              <view class="info-cell">
                <text class="label">姓名</text>
                <text class="value">{{ traveler.fullName }}</text>
              </view>
              <view class="info-cell">
                <text class="label">身份证号</text>
                <text class="value">{{ traveler.idNumber }}</text>
              </view>
              <view class="info-cell">
                <text class="label">手机号</text>
                <text class="value">{{ traveler.phoneNumber }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部区域：预约时间和取消按钮 -->
        <view class="card-footer">
          <view class="booking-time">
            <text>预约时间: {{ formatDateTime(item.createTime) }}</text>
          </view>
          <!-- 添加取消预约按钮 -->
          <view class="action-buttons">
            <button
              class="cancel-btn"
              @tap="handleCancel(item.reservationsVO.id)"
            >
              取消预约
            </button>
          </view>
        </view>
      </view>
    </template>

    <!-- 无预约记录时显示空状态 -->
    <view v-else class="empty-state">
      <image
        src="/static/images/empty.png"
        mode="aspectFit"
        class="empty-image"
      />
      <text class="empty-text">暂无预约记录</text>
      <button class="go-reserve-btn" @tap="goToReserve">去预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import reservationsTravelersApi from "@/apis/reservationsTravelers.js";
const reservationsList = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${formatDate(dateStr)} ${String(date.getHours()).padStart(
    2,
    "0"
  )}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const getReservationsList = async () => {
  try {
    const { data: res } =
      await reservationsTravelersApi.listReservationsTimeByUserId();
    console.log(res);
    reservationsList.value = res || [];
    console.log("@@", reservationsList.value);
  } catch (error) {
    uni.showToast({
      title: "获取预约记录失败",
      icon: "none",
    });
  }
};

// 取消预约
const handleCancel = (reservationsId) => {
  uni.showModal({
    title: "提示",
    content: "确定要取消此预约吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({
            title: "取消中...",
          });

          await reservationsTravelersApi.deleteReservationsTime(reservationsId);

          uni.showToast({
            title: "取消成功",
            icon: "success",
          });

          // 刷新预约列表
          getReservationsList();
        } catch (error) {
          uni.showToast({
            title: "取消失败",
            icon: "none",
          });
        } finally {
          uni.hideLoading();
        }
      }
    },
  });
};

// 跳转到预约页面
const goToReserve = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};

onMounted(() => {
  getReservationsList();
});
</script>

<style lang="scss">
.reservation-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20rpx;
}

.reservation-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
}

.scenic-info {
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;

  .scenic-main {
    margin-bottom: 16rpx;
  }

  .scenic-name {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .scenic-address {
    font-size: 26rpx;
    color: #666;
    margin-top: 10rpx;
    display: flex;
    align-items: center;

    .icon-location {
      margin-right: 6rpx;
      font-size: 24rpx;
    }
  }

  .scenic-date {
    font-size: 26rpx;
    color: #666;
    background: #f8f9fa;
    padding: 8rpx 24rpx;
    border-radius: 30rpx;
    display: inline-block;
  }
}

.travelers-section {
  .section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }

  .traveler-item {
    background: #f8f9fa;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  .info-cell {
    flex: 1;
    min-width: 200rpx;

    .label {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
      display: block;
    }

    .value {
      font-size: 28rpx;
      color: #333;
      display: block;
    }
  }
}

.card-footer {
  margin-top: 30rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .booking-time {
    font-size: 24rpx;
    color: #999;
  }

  .action-buttons {
    .cancel-btn {
      font-size: 26rpx;
      color: #fff;
      background: #2b85ff;
      padding: 12rpx 32rpx;
      border-radius: 30rpx;
      border: none;
      min-width: 160rpx;
      margin: 0;
      line-height: 1.5;

      &:active {
        opacity: 0.9;
      }
    }
  }
}

// 添加空状态样式
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
    margin-bottom: 40rpx;
  }

  .go-reserve-btn {
    font-size: 28rpx;
    color: #fff;
    background: #2b85ff;
    padding: 20rpx 60rpx;
    border-radius: 40rpx;
    border: none;

    &:active {
      opacity: 0.9;
    }
  }
}
</style>
