<template>
  <view class="feedback-list">
    <!-- 反馈列表 -->
    <view class="list-content">
      <view class="feedback-item" v-for="item in feedbackList" :key="item.id">
        <view class="item-header">
          <text class="title">{{ item.title }}</text>
          <text
            class="status"
            :class="item.status === '1' ? 'resolved' : 'pending'"
          >
            {{ item.status === "1" ? "已处理" : "待处理" }}
          </text>
        </view>

        <view class="content">{{ item.content }}</view>

        <view class="info">
          <view class="contact">
            <text>联系人：{{ item.fullName }}</text>
            <text>电话：{{ item.phoneNumber }}</text>
          </view>
          <text class="time">{{ formatDate(item.createTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="feedbackList.length === 0">
      <image
        src="/static/images/empty.png"
        mode="aspectFit"
        class="empty-image"
      />
      <text class="empty-text">暂无反馈记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import feedbackApi from "@/apis/feedback";

const feedbackList = ref([]);

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

// 获取反馈列表
const getFeedbackList = async () => {
  try {
    const { data } = await feedbackApi.listMyFeedback();
    feedbackList.value = data || [];
  } catch (error) {
    uni.showToast({
      title: "获取反馈列表失败",
      icon: "none",
    });
  }
};

onMounted(() => {
  getFeedbackList();
});
</script>

<style lang="scss" scoped>
.feedback-list {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 20rpx;
}

.feedback-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }

    .status {
      font-size: 24rpx;
      padding: 4rpx 16rpx;
      border-radius: 20rpx;

      &.pending {
        color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
      }

      &.resolved {
        color: #52c41a;
        background: rgba(82, 196, 26, 0.1);
      }
    }
  }

  .content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.5;
    margin-bottom: 16rpx;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 24rpx;
    color: #999;

    .contact {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
    }

    .time {
      font-size: 24rpx;
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
