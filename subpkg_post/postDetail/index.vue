<template>
  <view class="detail-container">
    <!-- 轮播图部分 -->
    <swiper
      class="swiper"
      circular
      :indicator-dots="true"
      :autoplay="true"
      interval="3000"
    >
      <swiper-item v-for="(item, index) in postDetail.coverList" :key="index">
        <image class="swiper-img" :src="item" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 文章内容部分 -->
    <view class="content-section">
      <text class="title">{{ postDetail.title }}</text>
      <text class="content">{{ postDetail.content }}</text>
    </view>

    <!-- 评论区部分 -->
    <view class="comment-section" :style="{ paddingBottom: '120rpx' }">
      <view class="comment-header">
        <text class="section-title">评论区</text>
        <text class="comment-count">{{ commentList.length }}条评论</text>
      </view>

      <!-- 评论列表 -->
      <view class="comment-list">
        <view
          class="comment-item"
          v-for="comment in commentList"
          :key="comment.id"
        >
          <view class="comment-user">
            <image
              class="avatar"
              :src="comment.user.userAvatar"
              mode="aspectFill"
            ></image>
            <view class="user-info">
              <text class="username">{{ comment.user.userName }}</text>
              <text class="time">{{ formatDate(comment.createTime) }}</text>
            </view>
          </view>
          <view class="comment-content">{{ comment.content }}</view>

          <!-- 回复按钮 -->
          <view class="comment-actions">
            <text class="reply-btn" @tap="showReplyInput(comment)">回复</text>
          </view>

          <!-- 回复列表 -->
          <view
            class="reply-list"
            v-if="comment.replies && comment.replies.length"
          >
            <view
              class="reply-item"
              v-for="reply in comment.replies"
              :key="reply.id"
            >
              <text class="reply-user">{{ reply.user.userName }}</text>
              <text class="reply-content">{{ reply.content }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 评论输入框 -->
      <view class="comment-input-section">
        <input
          class="comment-input"
          v-model="commentContent"
          placeholder="写下你的评论..."
          :focus="isInputFocus"
          @blur="handleInputBlur"
        />
        <button class="submit-btn" @tap="submitComment">发送</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import postApi from "@/apis/post";
import commentApi from "@/apis/comment";

const postDetail = ref({});
const commentList = ref([]);
const commentContent = ref("");
const isInputFocus = ref(false);
const currentPostId = ref("");
const replyToComment = ref(null);

// 初始化详情页
const init = async (id) => {
  currentPostId.value = id;
  const { code, data } = await postApi.detail(id);
  postDetail.value = data;
  await loadComments();
};

// 加载评论列表
const loadComments = async () => {
  try {
    const { code, data } = await commentApi.listCommentsByPostId(
      currentPostId.value
    );
    if (code === 0) {
      commentList.value = data;
    }
  } catch (error) {
    uni.showToast({
      title: "加载评论失败",
      icon: "none",
    });
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    uni.showToast({
      title: "请输入评论内容",
      icon: "none",
    });
    return;
  }

  try {
    const params = {
      postId: currentPostId.value,
      content: commentContent.value,
      parentId: replyToComment.value?.id || null,
    };

    const { code } = await commentApi.addComment(params);
    if (code === 0) {
      uni.showToast({
        title: "评论成功",
        icon: "success",
      });
      commentContent.value = "";
      replyToComment.value = null;
      await loadComments();
    }
  } catch (error) {
    uni.showToast({
      title: "评论失败",
      icon: "none",
    });
  }
};

// 显示回复输入框
const showReplyInput = (comment) => {
  replyToComment.value = comment;
  isInputFocus.value = true;
  // commentContent.value = `回复 @${comment.user.userName}: `;
  // commentContent.value = `回复 : `;
  commentContent.value = "";
};

// 处理输入框失焦
const handleInputBlur = () => {
  isInputFocus.value = false;
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${
    date.getMonth() + 1
  }月${date.getDate()}日 ${date.getHours()}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

onLoad((option) => {
  init(option.id);
});
</script>

<style lang="scss">
.detail-container {
  background-color: #f5f7fa;
  min-height: 100vh;

  .swiper {
    height: 500rpx;

    .swiper-img {
      width: 100%;
      height: 100%;
    }
  }

  .content-section {
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

    .title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .content {
      font-size: 30rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .comment-section {
    background-color: #fff;
    padding: 30rpx;

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .comment-count {
        font-size: 26rpx;
        color: #999;
      }
    }

    .comment-list {
      .comment-item {
        padding: 20rpx 0;
        border-bottom: 2rpx solid #f5f5f5;

        .comment-user {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;

          .avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            margin-right: 16rpx;
          }

          .user-info {
            .username {
              font-size: 28rpx;
              color: #333;
              font-weight: 500;
            }

            .time {
              font-size: 24rpx;
              color: #999;
              margin-left: 16rpx;
            }
          }
        }

        .comment-content {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin: 10rpx 0;
        }

        .comment-actions {
          margin-top: 16rpx;

          .reply-btn {
            font-size: 26rpx;
            color: #666;
            padding: 8rpx 20rpx;
          }
        }

        .reply-list {
          margin-top: 20rpx;
          background-color: #f8f9fa;
          padding: 20rpx;
          border-radius: 12rpx;

          .reply-item {
            margin-bottom: 16rpx;

            .reply-user {
              font-size: 26rpx;
              color: #666;
              font-weight: 500;
            }

            .reply-content {
              font-size: 26rpx;
              color: #333;
              margin-left: 10rpx;
            }
          }
        }
      }
    }

    .comment-input-section {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      border-top: 2rpx solid #eee;

      .comment-input {
        flex: 1;
        height: 72rpx;
        background-color: #f5f7fa;
        border-radius: 36rpx;
        padding: 0 30rpx;
        font-size: 28rpx;
        margin-right: 20rpx;
      }

      .submit-btn {
        width: 120rpx;
        height: 72rpx;
        background-color: #007aff;
        color: #fff;
        border-radius: 36rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
