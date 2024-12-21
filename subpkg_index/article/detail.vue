<template>
  <view class="article-detail">
    <!-- 标题区域 -->
    <view class="header">
      <text class="title">{{ article.title }}</text>
      <view class="meta">
        <text class="time">{{ formatDate(article.createTime) }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <rich-text :nodes="article.content"></rich-text>
    </view>

    <!-- 底部区域 -->
    <view class="footer">
      <text class="update-time"
        >最后更新: {{ formatDate(article.updateTime) }}</text
      >
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import articleApi from "@/apis/article";

const article = ref({});

// 日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

// 获取文章详情
const getArticleDetail = async (id) => {
  try {
    const { data } = await articleApi.getArticleVOById(id);
    article.value = data;
  } catch (error) {
    uni.showToast({
      title: "获取文章详情失败",
      icon: "none",
    });
  }
};

// 页面加载时获取参数
onLoad((options) => {
  if (options.id) {
    getArticleDetail(options.id);
  }
});
</script>

<style lang="scss" scoped>
.article-detail {
  padding: 30rpx;
  background-color: #fff;
  min-height: 100vh;

  .header {
    margin-bottom: 40rpx;
    padding-bottom: 30rpx;
    border-bottom: 2rpx solid #eee;

    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      line-height: 1.4;
      margin-bottom: 20rpx;
      display: block;
    }

    .meta {
      display: flex;
      align-items: center;

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .content {
    font-size: 30rpx;
    line-height: 1.8;
    color: #333;

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: 20rpx 0;
    }

    :deep(p) {
      margin: 20rpx 0;
    }

    :deep(strong) {
      font-weight: bold;
    }

    :deep(a) {
      color: #0066cc;
      text-decoration: none;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 40rpx;
      margin: 20rpx 0;
    }

    :deep(li) {
      margin: 10rpx 0;
    }

    :deep(blockquote) {
      margin: 20rpx 0;
      padding: 20rpx;
      background: #f5f5f5;
      border-left: 8rpx solid #ddd;
      color: #666;
    }
  }

  .footer {
    margin-top: 60rpx;
    padding-top: 30rpx;
    border-top: 2rpx solid #eee;

    .update-time {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
