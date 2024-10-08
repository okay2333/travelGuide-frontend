<template>
  <view>
    <button style="border-radius: 50%; width: 50px; height: 50px; border: none; background-color: red; position: fixed; right: 0" @click="publishPost">发布文章</button>
    <div class="post-container" v-if="!isLoading">
      <div class="postList" v-for="(item, index) in postList">
        <img class="cover" src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/duolamei.jpg" alt="" @click="goPost(item.id)" />
        <h3>{{ item.title }}</h3>
        <span>点赞数：{{ item.favourNum }}</span>
        <span @click="doPostFavour(item.id)">
          <u-icon name="heart-fill" color="#2979ff" size="50" v-if="isFavour(item.id)"></u-icon>
          <u-icon name="heart" color="#2979ff" size="50" v-else></u-icon>
          {{ item.thumbNum }}
        </span>
      </div>
    </div>
  </view>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import postApi from '@/apis/post';
import postFavourApi from '@/apis/post-favour';
const isLoading = ref(true);

const postList = ref(); // 文章列表
const postQueryRequest = ref({}); // 我的收藏帖子列表查询条件
const favourList = ref(); // 我的收藏列表

const init = async () => {
  const { code, data } = await postApi.list();
  postList.value = data?.records;
  // 获取点赞列表
  const { data: favourData } = await postFavourApi.listMyFavourPostByPageApi(postQueryRequest);
  favourList.value = favourData?.records;
  // 数据获取完成后，设置加载状态为 false
  isLoading.value = false;
};

const isFavour = (postId) => {
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
onMounted(() => {
  init();
});
</script>

<style lang="scss">
.post-container {
  display: flex;
  flex-wrap: wrap;
  .postList {
    width: 50%;
    height: width;
    .cover {
      width: 100%;
      height: width;
    }
  }
}
.addPost {
  border: 50%;
}
</style>
