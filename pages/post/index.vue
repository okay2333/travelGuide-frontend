<template>
  <button style="border-radius: 50%; width: 50px; height: 50px; border: none; background-color: red; position: fixed; right: 0" @click="publishPost">发布文章</button>
  <view class="post-container" v-if="!isLoading">
    <view class="list">
      <template v-for="item in columns[0].items">
        <view class="post-item">
          <view v-if="item.tag == 'left'" class="item-cover"><img :src="item.coverList[0]" class="cover" @click="goPost(item.id)" /></view>
          <view class="info">
            <view class="info-title"><h5>售价的</h5></view>
            <view class="info-user">
              <img class="avatar" src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/duolamei.jpg" alt="" />
              <span>Alice</span>
              <span @click="doPostFavour(item.id)">
                <u-icon name="heart-fill" color="#2979ff" size="50" v-if="isFavour(item.id)"></u-icon>
                <u-icon name="heart" color="#2979ff" size="50" v-else></u-icon>
                {{ item.favourNum }}
              </span>
            </view>
          </view>
        </view>
      </template>
    </view>
    <view class="list">
      <template v-for="item in columns[1].items">
        <view class="post-item">
          <view v-if="item.tag == 'right'" class="item-cover"><img :src="item.coverList[0]" class="cover" /></view>
          <view class="info">
            <view class="info-title"><h5>售价的</h5></view>
            <view class="info-user">
              <img class="avatar" src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/duolamei.jpg" alt="" />
              <span>Alice</span>
              <u-icon name="heart"></u-icon>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import postFavourApi from '@/apis/post-favour';
const columns = ref([{ items: [] }, { items: [] }]);
const isLoading = ref(true);
const postQueryRequest = ref({}); // 我的收藏帖子列表查询条件
const favourList = ref(); // 我的收藏列表
const leftHeight = ref(0);
const rightHeight = ref(1);

import postApi from '@/apis/post';
const postList = ref(); // 文章列表
const init = async () => {
  const { code, data } = await postApi.list();
  postList.value = data?.records;
  // 获取点赞列表
  const { data: favourData } = await postFavourApi.listMyFavourPostByPageApi(postQueryRequest);
  favourList.value = favourData?.records;
  // 数据获取完成后，设置加载状态为 false
  isLoading.value = false;
};
const loadData = () => {
  postList.value.forEach((item, i) => {
    const type = Math.random() * 10 > 5 ? 1 : 0;
    let tag = '';
    if (leftHeight.value > rightHeight.value) {
      tag = 'right';
      rightHeight.value += 280;
      if (type === 1) {
        leftHeight.value -= 30;
      }
    } else {
      tag = 'left';
      leftHeight.value += 280;
      if (type === 1) {
        rightHeight.value -= 30;
      }
    }
    if (tag === 'left') {
      columns.value[0].items.push({ ...item, tag, type });
    } else {
      columns.value[1].items.push({ ...item, tag, type });
    }
  });
};

const isFavour = (postId) => {
  console.log('???', favourList);
  return favourList.value.some((item) => item.id === postId);
};

// 收藏功能
const PostFavourAddRequest = ref({});

const doPostFavour = async (postId) => {
  PostFavourAddRequest.value.postId = postId;
  await postFavourApi.doPostFavourApi(PostFavourAddRequest.value);
};

// 跳转登录页
const publishPost = () => {
  uni.navigateTo({
    url: '/subpkg_post/addPost/index'
  });
};

const goPost = (id) => {
  uni.navigateTo({
    url: `/subpkg_post/postDetail/index?id=${id}`
  });
};
onMounted(async () => {
  await init();
  loadData();
});
</script>

<style scoped lang="scss">
.post-container {
  display: flex;
  padding: 0 8rpx;
  flex-direction: row;
  background-color: #f8f8f8;
  height: 100vh;
  .list {
    width: 50%;
    display: flex;
    flex-direction: column;
    margin: 8rpx;
    background-color: #f8f8f8;
    .post-item {
      background-color: #cccccc;
      border-radius: 8rpx;
      margin: 8rpx 0;
      .item-cover {
        .cover {
          width: 100%;
        }
      }
      .info {
        width: 100%;
        margin: 0 0 0 8rpx;
        .info-title {
          margin: 10rpx;
        }
        .info-user {
          margin: 0 10rpx 10rpx 10rpx;
          display: flex;
          align-items: center;
          .avatar {
            width: 32rpx;
            height: 32rpx;
            border-radius: 50%;
          }
          span {
            margin-left: 8rpx;
            font-size: 20rpx;
          }
        }
      }
    }
  }
}
</style>