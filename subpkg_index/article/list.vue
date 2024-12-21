<template>
  <view class="article-list-container">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input
          type="text"
          v-model="searchKey"
          placeholder="搜索你感兴趣的旅行攻略"
          confirm-type="search"
          @input="handleSearch"
        />
        <text v-if="searchKey" class="clear-icon" @tap="clearSearch">×</text>
      </view>
    </view>

    <!-- 文章列表区域 -->
    <scroll-view
      class="article-scroll"
      scroll-y
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredArticles.length === 0">
        <image src="/static/images/empty.png" mode="aspectFit"></image>
        <text>暂无相关攻略内容</text>
        <text class="empty-desc">换个关键词试试吧~</text>
      </view>

      <!-- 文章列表 -->
      <view class="article-list">
        <view
          class="article-card"
          v-for="article in filteredArticles"
          :key="article?.id || index"
          @tap="goDetail(article?.id)"
          :style="{
            backgroundImage: article?.cover ? `url(${article.cover})` : '',
          }"
        >
          <view class="card-content">
            <view class="card-info">
              <text class="article-title">{{
                article?.title || "无标题"
              }}</text>
            </view>
            <view class="card-footer">
              <view class="publish-time">
                <text class="iconfont icon-time"></text>
                <text>{{ formatDate(article?.createTime) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-status" v-if="filteredArticles.length > 0">
        <text v-if="isLoading">正在加载更多...</text>
        <text v-else-if="!hasMore">已经到底啦 ~</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import articleApi from "@/apis/article";

const articles = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);
const isLoading = ref(false);
const isRefreshing = ref(false);
const searchKey = ref("");

// 前端搜索过滤
const filteredArticles = computed(() => {
  if (!searchKey.value) return articles.value;
  const keyword = searchKey.value.toLowerCase();
  return articles.value.filter((article) => {
    if (!article) return false;
    const title = article.title || "";
    const description = article.description || "";
    return (
      title.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword)
    );
  });
});

// 格式化数字
const formatNumber = (num) => {
  if (!num || isNaN(num)) return 0;
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num;
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ""; // 检查日期是否有效

  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 清空搜索
const clearSearch = () => {
  searchKey.value = "";
};

// 搜索处理
const handleSearch = () => {
  // 前端过滤，不需要调用API
};

// 获取文章列表
const getArticles = async (page = 1, refresh = false) => {
  if (isLoading.value || (!hasMore.value && !refresh)) return;

  isLoading.value = true;
  try {
    const { data } = await articleApi.listArticleByPage({
      current: page,
      size: pageSize.value,
    });

    if (refresh) {
      articles.value = data.records;
    } else {
      articles.value = [...articles.value, ...data.records];
    }

    hasMore.value = data.records.length === pageSize.value;
    currentPage.value = page;
  } catch (error) {
    console.error("获取文章列表失败:", error);
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !isLoading.value) {
    getArticles(currentPage.value + 1);
  }
};

// 下拉刷新
const onRefresh = async () => {
  isRefreshing.value = true;
  await getArticles(1, true);
};

// 跳转到详情页
const goDetail = (id) => {
  uni.navigateTo({
    url: `/subpkg_index/article/detail?id=${id}`,
  });
};

onMounted(() => {
  getArticles(1);
});
</script>

<style lang="scss" scoped>
.article-list-container {
  min-height: 100vh;
  background-color: #f8f9fb;
  display: flex;
  flex-direction: column;
}

.search-section {
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  .search-box {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 16rpx 24rpx;
    border-radius: 32rpx;

    .icon-search {
      font-size: 32rpx;
      color: #999;
      margin-right: 16rpx;
    }

    input {
      flex: 1;
      font-size: 28rpx;
      color: #333;

      &::placeholder {
        color: #999;
      }
    }

    .clear-icon {
      font-size: 36rpx;
      color: #999;
      padding: 0 10rpx;
    }
  }
}

.article-scroll {
  flex: 1;
  height: calc(100vh - 140rpx);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 40rpx;

  image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
  }

  text {
    color: #666;
    font-size: 28rpx;
  }

  .empty-desc {
    margin-top: 16rpx;
    color: #999;
    font-size: 24rpx;
  }
}

.article-list {
  padding: 20rpx 30rpx;
}

.article-card {
  margin-bottom: 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  height: 400rpx;
  position: relative;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60%;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
  }

  .card-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 30rpx;
    z-index: 1;
    color: #fff;
  }

  .card-info {
    margin-bottom: 16rpx;

    .article-title {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    font-size: 24rpx;

    .publish-time {
      display: flex;
      align-items: center;
      opacity: 0.9;

      .iconfont {
        margin-right: 8rpx;
        font-size: 24rpx;
      }
    }
  }
}

.loading-status {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}
</style>
