<template>
  <view class="container">
    <u-swiper
      :list="list"
      height="500"
      :border-radius="20"
      :autoplay="true"
      :interval="3000"
    ></u-swiper>

    <view class="card">
      <navigateVue />
    </view>

    <!-- 官方推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">官方推荐</text>
        <text class="section-more" @tap="goArticleList">更多 ></text>
      </view>

      <view class="official-recommend">
        <view class="featured-article" @click="goArticle(articles[0].id)">
          <image :src="articles[0]?.cover" mode="aspectFill"></image>
          <view class="article-overlay">
            <text class="article-title">{{ articles[0]?.title }}</text>
          </view>
        </view>

        <view class="article-list">
          <view
            class="article-item"
            v-for="(article, index) in articles.slice(1, 3)"
            :key="article.id"
            @click="goArticle(article.id)"
          >
            <image :src="article.cover" mode="aspectFill"></image>
            <view class="article-overlay">
              <text class="article-title">{{ article.title }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 本地推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">本地推荐</text>
        <text class="section-more" @tap="goTicketList">更多 ></text>
      </view>

      <scroll-view class="ticket-scroll" scroll-x>
        <view class="ticket-list">
          <view
            class="ticket-item"
            v-for="ticket in tickets"
            :key="ticket.id"
            @click="goTicket(ticket.id)"
          >
            <image
              :src="ticket.scenicVO.carouselImagesList[0]"
              mode="aspectFill"
            ></image>
            <view class="ticket-info">
              <text class="ticket-name">{{ ticket.scenicVO.scenicName }}</text>
              <view class="ticket-price">
                <text class="price-symbol">¥</text>
                <text class="price-value">{{ ticket.price }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import navigateVue from "./components/navigate.vue";
import articleApi from "@/apis/article";
import ticketApi from "@/apis/ticket-scenic";

const articles = ref([]);
const tickets = ref([]);

const list = ref([
  {
    image:
      "https://se-feed-bucket.bj.bcebos.com/map_x_day_sup/1a8f033044ac6c3afeb41f09ad54905e-ss2.jpg",
    title: "昨夜星辰昨夜风，画楼西畔桂堂东",
  },
  // ... 其他轮播图数据
]);

onMounted(async () => {
  // 获取文章列表
  const { data: articleData } = await articleApi.listArticleByPage();
  articles.value = articleData.records;

  // 获取门票列表
  const { data: ticketData } = await ticketApi.listTicketScenicByPage();
  tickets.value = ticketData.records;
});

const goArticle = (id) => {
  uni.navigateTo({
    url: `/subpkg_index/article/detail?id=${id}`,
  });
};

const goTicket = (id) => {
  uni.navigateTo({
    url: `/subpkg_index/ticket/ticketDetail?id=${id}`,
  });
};

// 跳转到攻略列表页面
const goArticleList = () => {
  uni.navigateTo({
    url: "/subpkg_index/article/list",
  });
};

// 跳转到门票列表页面
const goTicketList = () => {
  uni.navigateTo({
    url: "/subpkg_index/ticket/ticketList",
  });
};
</script>

<style lang="scss">
.container {
  background-color: #f5f5f5;
  min-height: 100vh;

  .card {
    margin: 20rpx;
    padding: 30rpx;
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .section {
    margin: 30rpx 20rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      padding: 0 10rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .section-more {
        font-size: 24rpx;
        color: #999;
        padding: 10rpx;
      }
    }
  }

  .official-recommend {
    display: flex;
    gap: 20rpx;

    .featured-article {
      flex: 1;
      height: 420rpx;
      position: relative;
      border-radius: 16rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .article-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .article-item {
        height: 200rpx;
        position: relative;
        border-radius: 16rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .article-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20rpx;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));

      .article-title {
        color: #fff;
        font-size: 28rpx;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }

  .ticket-scroll {
    width: 100%;

    .ticket-list {
      display: flex;
      padding: 10rpx;

      .ticket-item {
        flex-shrink: 0;
        width: 300rpx;
        margin-right: 20rpx;
        background: #fff;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

        image {
          width: 100%;
          height: 200rpx;
        }

        .ticket-info {
          padding: 16rpx;

          .ticket-name {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 8rpx;
          }

          .ticket-price {
            color: #ff6b6b;

            .price-symbol {
              font-size: 24rpx;
            }

            .price-value {
              font-size: 32rpx;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
