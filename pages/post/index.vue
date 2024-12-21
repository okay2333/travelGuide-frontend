<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import postFavourApi from "@/apis/post-favour";
const columns = ref([{ items: [] }, { items: [] }]);
const isLoading = ref(true);
const postQueryRequest = ref({}); // 我的收藏帖子列表查询条件
const favourList = ref(); // 我的收藏列表
const leftHeight = ref(0);
const rightHeight = ref(1);
import postApi from "@/apis/post";
const postList = ref([]);

// 获取帖子列表
const getPostList = async () => {
  try {
    const { code, data } = await postApi.list();
    if (code === 0) {
      postList.value = data.records;
      // 清空原有数据并重新加载
      columns.value = [{ items: [] }, { items: [] }];
      leftHeight.value = 0;
      rightHeight.value = 1;
      loadData(); // 重新加载数据到瀑布流
    }
  } catch (error) {
    console.error("获取帖子列表失败:", error);
  }
};

// 暴露方法给外部调用
defineExpose({
  getPostList,
});

const init = async () => {
  // 获取点赞列表
  const { data: favourData } = await postFavourApi.listMyFavourPostByPageApi(
    postQueryRequest
  );
  favourList.value = favourData?.records;
  console.log("favourList", favourList);

  // 数据获取完成后，设置加载状态为 false
  isLoading.value = false;
};
const loadData = () => {
  postList.value.forEach((item, i) => {
    const type = Math.random() * 10 > 5 ? 1 : 0;
    let tag = "";
    if (leftHeight.value > rightHeight.value) {
      tag = "right";
      rightHeight.value += 280;
      if (type === 1) {
        leftHeight.value -= 30;
      }
    } else {
      tag = "left";
      leftHeight.value += 280;
      if (type === 1) {
        rightHeight.value -= 30;
      }
    }
    if (tag === "left") {
      columns.value[0].items.push({ ...item, tag, type });
    } else {
      columns.value[1].items.push({ ...item, tag, type });
    }
  });
};

const isFavour = (postId) => {
  console.log("???", favourList);
  return favourList.value.some((item) => item.id === postId);
};

// 收藏功能
const PostFavourAddRequest = ref({});

const doPostFavour = async (postId) => {
  PostFavourAddRequest.value.postId = postId;
  await postFavourApi.doPostFavourApi(PostFavourAddRequest.value);
  // 更新 columns 中的点赞数
  columns.value.forEach((column) => {
    column.items.forEach((item) => {
      if (item.id === postId) {
        item.favourNum = isFavour(postId)
          ? item.favourNum - 1
          : item.favourNum + 1;
      }
    });
  });
  await init();
};

// 跳转登录页
const publishPost = () => {
  uni.navigateTo({
    url: "/subpkg_post/addPost/index",
  });
};

const goPost = (id) => {
  uni.navigateTo({
    url: `/subpkg_post/postDetail/index?id=${id}`,
  });
};
onShow(async () => {
  await init();
  getPostList();
});
</script>
<template>
  <button class="publish-btn" @click="publishPost">
    <u-icon name="plus" color="#fff" size="24"></u-icon>
  </button>

  <view class="post-container" v-if="!isLoading">
    <view
      class="list"
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
    >
      <view
        v-for="item in column.items"
        :key="item.id"
        class="post-item"
        :class="{
          'left-item': item.tag === 'left',
          'right-item': item.tag === 'right',
        }"
      >
        <view class="item-cover" @click="goPost(item.id)">
          <image :src="item.coverList[0]" class="cover" mode="widthFix" />
        </view>
        <view class="info">
          <view class="info-title">
            <text class="title-text">{{ item.title }}</text>
          </view>
          <view class="info-user">
            <view class="user-info">
              <image
                class="avatar"
                :src="item.user.userAvatar"
                mode="aspectFill"
              />
              <text class="username">{{ item.user.userName }}</text>
            </view>
            <view class="favour-info" @click.stop="doPostFavour(item.id)">
              <u-icon
                :name="isFavour(item.id) ? 'heart-fill' : 'heart'"
                :color="isFavour(item.id) ? '#ff6b6b' : '#999'"
                size="18"
              ></u-icon>
              <text class="favour-count">{{ item.favourNum || 0 }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.publish-btn {
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #0066ff, #2b85ff);
  border: none;
  box-shadow: 0 4rpx 16rpx rgba(0, 102, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.post-container {
  display: flex;
  padding: 16rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
  box-sizing: border-box;

  .list {
    flex: 1;
    margin: 0 8rpx;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .post-item {
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.98);
    }

    .item-cover {
      width: 100%;
      position: relative;
      overflow: hidden;

      .cover {
        width: 100%;
        display: block;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .info {
      padding: 16rpx;

      .info-title {
        margin-bottom: 12rpx;

        .title-text {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      .info-user {
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
            font-size: 24rpx;
            color: #666;
          }
        }

        .favour-info {
          display: flex;
          align-items: center;
          padding: 8rpx 16rpx;
          background-color: #f8f8f8;
          border-radius: 24rpx;

          .favour-count {
            font-size: 24rpx;
            color: #999;
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}

// Loading 状态
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f8f8;
}
</style>
