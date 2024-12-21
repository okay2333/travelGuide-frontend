<template>
  <view class="favorites-list">
    <view
      class="favorite-card"
      v-for="post in favoriteList"
      :key="post.id"
      @tap="goToPost(post.id)"
    >
      <!-- 帖子封面 -->
      <view class="cover-section">
        <image class="cover-image" :src="post.coverList[0]" mode="aspectFill" />
      </view>

      <!-- 帖子内容 -->
      <view class="content-section">
        <text class="title">{{ post.title }}</text>
        <view class="info-row">
          <!-- 用户信息 -->
          <view class="user-info">
            <image
              class="avatar"
              :src="post.user.userAvatar"
              mode="aspectFill"
            />
            <text class="username">{{ post.user.userName }}</text>
          </view>
          <!-- 收藏时间 -->
          <text class="time">{{ formatDate(post.createTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="favoriteList.length === 0">
      <image
        src="/static/images/empty.png"
        mode="aspectFit"
        class="empty-image"
      />
      <text class="empty-text">暂无收藏内容</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import postFavourApi from "@/apis/post-favour";

const favoriteList = ref([]);

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 获取收藏列表
const getFavoriteList = async () => {
  try {
    const { data } = await postFavourApi.listMyFavourPostByPageApi({
      current: 1,
      pageSize: 10,
    });
    favoriteList.value = data.records || [];
  } catch (error) {
    uni.showToast({
      title: "获取收藏列表失败",
      icon: "none",
    });
  }
};

// 跳转到帖子详情
const goToPost = (postId) => {
  uni.navigateTo({
    url: `/subpkg_post/postDetail/index?id=${postId}`,
  });
};

onMounted(() => {
  getFavoriteList();
});
</script>

<style lang="scss" scoped>
.favorites-list {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 20rpx;
}

.favorite-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .cover-section {
    width: 100%;
    height: 360rpx;
    overflow: hidden;

    .cover-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;

      &:active {
        transform: scale(1.05);
      }
    }
  }

  .content-section {
    padding: 20rpx;

    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
      margin-bottom: 16rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .user-info {
        display: flex;
        align-items: center;

        .avatar {
          width: 48rpx;
          height: 48rpx;
          border-radius: 50%;
          margin-right: 12rpx;
        }

        .username {
          font-size: 26rpx;
          color: #666;
        }
      }

      .time {
        font-size: 24rpx;
        color: #999;
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
