<template>
  <view class="container">
    <view class="header">
      <text class="main-title">景点门票</text>
      <text class="subtitle">探索泉州特色景点</text>
    </view>

    <view class="ticket-list">
      <view
        class="ticket-card"
        v-for="item in ticketList"
        :key="item.id"
        @click="goTicketDetail(item.id)"
      >
        <view class="image-container">
          <image
            class="ticket-image"
            :src="item.scenicVO.carouselImagesList[0]"
            mode="aspectFill"
            @error="handleImageError"
          >
            <view
              class="image-placeholder"
              v-if="!item.scenicVO.carouselImagesList[0]"
            >
              <u-icon name="photo" size="48" color="#CCCCCC"></u-icon>
              <text>暂无图片</text>
            </view>
          </image>
        </view>

        <view class="content">
          <view class="info">
            <text class="scenic-name">{{ item.scenicVO.scenicName }}</text>
            <view class="address">
              <u-icon name="map" size="28" color="#666666"></u-icon>
              <text>{{ item.scenicVO.address }}</text>
            </view>
          </view>

          <view class="details">
            <view class="tags">
              <u-tag
                v-for="tag in item.scenicVO.tagList"
                :key="tag"
                :text="tag"
                mode="light"
                type="warning"
                size="mini"
              />
            </view>

            <view class="price-section">
              <text class="price-label">门票价格</text>
              <text class="price" :class="{ free: item.price === 0 }">
                {{ item.price === 0 ? "免费" : `¥${item.price}` }}
              </text>
            </view>

            <view class="status-info">
              <text class="time"
                >开放时间：{{ item.scenicVO.openingHours }}</text
              >
              <text class="stock" :class="{ 'sold-out': item.stock === 0 }">
                {{ item.stock === 0 ? "已售罄" : `剩余 ${item.stock} 张` }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import ticketScenicApi from "@/apis/ticket-scenic.js";

const ticketList = ref([]);

const init = async () => {
  try {
    const { code, data } = await ticketScenicApi.listTicketScenicByPage();
    ticketList.value = data.records;
  } catch (error) {
    console.error("获取门票列表失败:", error);
  }
};

const handleImageError = (e) => {
  console.log("图片加载失败:", e);
};

const goTicketDetail = (id) => {
  uni.navigateTo({
    url: `/subpkg_index/ticket/ticketDetail?id=${id}`,
  });
};

onLoad(() => {
  init();
});
</script>

<style lang="scss" scoped>
.container {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 32rpx;

  .main-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.ticket-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);

  &:active {
    transform: scale(0.98);
  }

  .image-container {
    height: 320rpx;
    position: relative;

    .ticket-image {
      width: 100%;
      height: 100%;

      .image-placeholder {
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 24rpx;
      }
    }
  }

  .content {
    padding: 24rpx;

    .info {
      margin-bottom: 16rpx;

      .scenic-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
        display: block;
      }

      .address {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #666;
      }
    }

    .details {
      .tags {
        display: flex;
        gap: 12rpx;
        margin-bottom: 16rpx;
        flex-wrap: wrap;
      }

      .price-section {
        display: flex;
        align-items: baseline;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .price-label {
          font-size: 24rpx;
          color: #666;
        }

        .price {
          font-size: 36rpx;
          font-weight: 600;
          color: #ff6b6b;

          &.free {
            color: #52c41a;
          }
        }
      }

      .status-info {
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        color: #666;

        .time {
          flex: 1;
        }

        .stock {
          color: #52c41a;

          &.sold-out {
            color: #ff4d4f;
          }
        }
      }
    }
  }
}
</style>
