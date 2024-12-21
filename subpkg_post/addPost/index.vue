<template>
  <view class="add-post">
    <!-- 标题输入 -->
    <view class="title-section">
      <input
        class="title-input"
        v-model="postForm.title"
        placeholder="请输入标题..."
        maxlength="50"
      />
      <text class="word-count">{{ postForm.title.length }}/50</text>
    </view>

    <!-- 内容输入区域 -->
    <view class="content-section">
      <textarea
        class="post-content"
        v-model="postForm.content"
        placeholder="分享你的旅行故事..."
        :maxlength="2000"
        auto-height
      />
      <text class="word-count">{{ postForm.content.length }}/2000</text>
    </view>

    <!-- 图片上传区域 -->
    <view class="image-section">
      <view class="section-title">添加图片</view>
      <u-upload
        action="http://localhost:8101/api/file/upload"
        :file-list="fileList"
        @on-success="successUpload"
      ></u-upload>
      <!-- <view class="image-list">
        <view
          class="image-item"
          v-for="(image, index) in postForm.covers"
          :key="index"
        >
          <image :src="image" mode="aspectFill" />
          <text class="delete-btn" @tap.stop="removeImage(index)">×</text>
        </view>
        <view
          class="upload-btn"
          @tap="chooseImage"
          v-if="postForm.covers.length < 9"
        >
          <text class="iconfont icon-camera"></text>
          <text class="tip">{{ postForm.covers.length }}/9</text>
        </view>
      </view> -->
    </view>

    <!-- 标签编辑区域 -->
    <view class="tags-section">
      <view class="section-title">添加标签</view>
      <view class="tag-list">
        <view
          class="tag-item"
          v-for="(tag, index) in postForm.tags"
          :key="index"
        >
          <text class="tag-text">#{{ tag }}</text>
          <text class="delete-tag" @tap="removeTag(index)">×</text>
        </view>
        <view class="add-tag" @tap="showAddTagInput">
          <text class="iconfont icon-add"></text>
          <text>添加标签</text>
        </view>
      </view>
      <!-- 添加标签输入框 -->
      <view class="tag-input-wrapper" v-if="showTagInput">
        <input
          class="tag-input"
          v-model="newTag"
          placeholder="输入标签名称"
          @blur="handleAddTag"
          @confirm="handleAddTag"
          maxlength="20"
        />
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="submit-section">
      <button
        class="submit-btn"
        :disabled="!isFormValid"
        @tap="onSubmitPostForm"
      >
        发布
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import postApi from "@/apis/post";
const fileList = ref([]);
const postForm = ref({
  title: "",
  content: "",
  covers: [],
  tags: [],
});

const showTagInput = ref(false);
const newTag = ref("");

// 表单验证
const isFormValid = computed(() => {
  return (
    postForm.value.title.trim() &&
    postForm.value.content.trim() &&
    postForm.value.covers.length > 0 // 添加图片验证
  );
});

const successUpload = ({ data }) => {
  console.log("上传成功");
  console.log(data);
  postForm.value.covers.push(data);
};

// 选择图片
// const chooseImage = async () => {
//   try {
//     const res = await uni.chooseImage({
//       count: 9 - postForm.value.covers.length,
//       sizeType: ["compressed"],
//       sourceType: ["album", "camera"],
//     });

//     // 显示上传中提示
//     uni.showLoading({
//       title: "上传中...",
//     });

//     // 上传每张图
//     for (let filePath of res.tempFilePaths) {
//       const [error, uploadRes] = await uni.uploadFile({
//         url: "http://localhost:8101/api/file/upload",
//         filePath: filePath,
//         name: "file",
//         header: {
//           Authorization: uni.getStorageSync("token"),
//         },
//       });

//       if (!error) {
//         const result = JSON.parse(uploadRes.data);
//         if (result.code === 0) {
//           postForm.value.covers.push(result.data);
//         }
//       }
//     }

//     uni.hideLoading();
//   } catch (error) {
//     uni.hideLoading();
//     uni.showToast({
//       title: "上传失败",
//       icon: "none",
//     });
//   }
// };

// 删除图片
const removeImage = (index) => {
  postForm.value.covers.splice(index, 1);
};

// 显示添加标签输入框
const showAddTagInput = () => {
  showTagInput.value = true;
  nextTick(() => {
    // 自动聚焦输入框
    uni
      .createSelectorQuery()
      .select(".tag-input")
      .node()
      .exec((res) => {
        res[0]?.focus();
      });
  });
};

// 添加标签
const handleAddTag = () => {
  if (newTag.value.trim()) {
    if (postForm.value.tags.length >= 5) {
      uni.showToast({
        title: "最多添加5个标签",
        icon: "none",
      });
      return;
    }
    postForm.value.tags.push(newTag.value.trim());
    newTag.value = "";
  }
  showTagInput.value = false;
};

// 删除标签
const removeTag = (index) => {
  postForm.value.tags.splice(index, 1);
};

// 提交表单
const onSubmitPostForm = async () => {
  // 标题和内容验证
  if (!postForm.value.title.trim()) {
    return uni.showToast({
      title: "请输入标题",
      icon: "none",
    });
  }

  if (!postForm.value.content.trim()) {
    return uni.showToast({
      title: "请输入内容",
      icon: "none",
    });
  }

  // 图片验证
  if (postForm.value.covers.length === 0) {
    return uni.showToast({
      title: "请至少上传一张图片",
      icon: "none",
    });
  }

  uni.showLoading({
    title: "发布中...",
  });

  try {
    const { code, data } = await postApi.add(postForm.value);

    if (code === 0) {
      uni.showToast({
        title: "发布成功",
        icon: "success",
      });
      uni.switchTab({
        url: "/pages/post/index",
      });
      // 延迟返回，确保提示显示完整
      // setTimeout(() => {
      //   // 返回到社区页面并刷新数据
      //   uni.switchTab({
      //     url: "/pages/post/index",
      //     success: () => {
      //       // 延迟一下再获取页面实例，确保页面已经加载完成
      //       setTimeout(() => {
      //         const pages = getCurrentPages();
      //         // 获取当前页面实例（此时应该是社区页面）
      //         const currentPage = pages[pages.length - 1];
      //         if (currentPage && currentPage.$vm.getPostList) {
      //           currentPage.$vm.getPostList();
      //         }
      //       }, 500); // 延迟500ms等待页面加载
      //     },
      //   });
      // }, 1500);
    } else {
      throw new Error("发布失败");
    }
  } catch (error) {
    uni.showToast({
      title: error.message || "发布失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};
</script>

<style lang="scss" scoped>
.add-post {
  min-height: 100vh;
  background-color: #fff;
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.title-section {
  position: relative;
  margin-bottom: 30rpx;

  .title-input {
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    border-bottom: 1rpx solid #eee;
    padding: 20rpx 0;
  }
}

.content-section {
  position: relative;
  margin-bottom: 40rpx;

  .post-content {
    width: 100%;
    min-height: 300rpx;
    font-size: 28rpx;
    line-height: 1.6;
    padding: 20rpx 0;
    color: #333;
  }
}

.word-count {
  position: absolute;
  right: 0;
  bottom: -30rpx;
  font-size: 24rpx;
  color: #999;
}

.image-section {
  margin-bottom: 40rpx;

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  .image-item {
    position: relative;
    width: 210rpx;
    height: 210rpx;
    border-radius: 12rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }

    .delete-btn {
      position: absolute;
      top: 6rpx;
      right: 6rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 36rpx;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border-radius: 50%;
      font-size: 32rpx;
    }
  }

  .upload-btn {
    width: 210rpx;
    height: 210rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;

    .icon-camera {
      font-size: 48rpx;
      margin-bottom: 10rpx;
    }

    .tip {
      font-size: 24rpx;
    }
  }
}

.tags-section {
  margin-bottom: 60rpx;

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  .tag-item {
    display: flex;
    align-items: center;
    padding: 12rpx 20rpx;
    background-color: #f5f5f5;
    border-radius: 30rpx;

    .tag-text {
      font-size: 26rpx;
      color: #666;
    }

    .delete-tag {
      margin-left: 10rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .add-tag {
    display: flex;
    align-items: center;
    padding: 12rpx 20rpx;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    color: #666;
    font-size: 26rpx;

    .icon-add {
      margin-right: 8rpx;
      font-size: 28rpx;
    }
  }

  .tag-input-wrapper {
    margin-top: 20rpx;

    .tag-input {
      width: 100%;
      height: 80rpx;
      background-color: #f5f5f5;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
  }
}

.submit-section {
  padding: 0 40rpx;

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #0066ff 0%, #2b85ff 100%);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;

    &:disabled {
      opacity: 0.5;
    }

    &:active {
      opacity: 0.9;
    }
  }
}
</style>
