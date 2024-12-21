<template>
  <view class="feedback-container">
    <!-- 添加顶部操作栏 -->
    <view class="header">
      <text class="title">意见反馈</text>
      <view class="record-btn" @tap="goFeedbackList">
        <text>反馈记录</text>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <!-- 标题输入 -->
      <view class="form-item">
        <text class="label">反馈标题</text>
        <input
          class="input"
          v-model="feedbackForm.title"
          placeholder="请输入反馈标题"
          maxlength="50"
        />
        <text class="word-count">{{ feedbackForm.title.length }}/50</text>
      </view>

      <!-- 反馈内容 -->
      <view class="form-item">
        <text class="label">反馈内容</text>
        <textarea
          class="textarea"
          v-model="feedbackForm.content"
          placeholder="请详细描述您的问题或建议..."
          maxlength="500"
          auto-height
        />
        <text class="word-count">{{ feedbackForm.content.length }}/500</text>
      </view>

      <!-- 联系人姓名 -->
      <view class="form-item">
        <text class="label">联系人</text>
        <input
          class="input"
          v-model="feedbackForm.fullName"
          placeholder="请输入您的姓名"
          maxlength="20"
        />
      </view>

      <!-- 联系电话 -->
      <view class="form-item">
        <text class="label">联系电话</text>
        <input
          class="input"
          v-model="feedbackForm.phoneNumber"
          type="number"
          placeholder="请输入您的联系电话"
          maxlength="11"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" :disabled="!isFormValid" @tap="submitFeedback">
        提交反馈
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import feedbackApi from "@/apis/feedback";

const feedbackForm = ref({
  title: "",
  content: "",
  fullName: "",
  phoneNumber: "",
});

// 表单验证
const isFormValid = computed(() => {
  const { title, content, fullName, phoneNumber } = feedbackForm.value;
  return (
    title.trim() &&
    content.trim() &&
    fullName.trim() &&
    /^1[3-9]\d{9}$/.test(phoneNumber)
  );
});

// 提交反馈
const submitFeedback = async () => {
  // 表单校验
  if (!feedbackForm.value.title.trim()) {
    return uni.showToast({
      title: "请输入反馈标题",
      icon: "none",
    });
  }

  if (!feedbackForm.value.content.trim()) {
    return uni.showToast({
      title: "请输入反馈内容",
      icon: "none",
    });
  }

  if (!feedbackForm.value.fullName.trim()) {
    return uni.showToast({
      title: "请��入联系人姓名",
      icon: "none",
    });
  }

  if (!feedbackForm.value.phoneNumber) {
    return uni.showToast({
      title: "请输入联系电话",
      icon: "none",
    });
  }

  if (!/^1[3-9]\d{9}$/.test(feedbackForm.value.phoneNumber)) {
    return uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
    });
  }

  try {
    uni.showLoading({
      title: "提交中...",
    });

    // 构造提交的数据，确保与后端 FeedBackAddRequest 格式一致
    const feedbackData = {
      title: feedbackForm.value.title.trim(),
      content: feedbackForm.value.content.trim(),
      fullName: feedbackForm.value.fullName.trim(),
      phoneNumber: feedbackForm.value.phoneNumber.trim(),
    };

    const { code, message } = await feedbackApi.add(feedbackData);

    if (code === 0) {
      uni.showToast({
        title: "提交成功",
        icon: "success",
      });

      // 清空表单
      feedbackForm.value = {
        title: "",
        content: "",
        fullName: "",
        phoneNumber: "",
      };

      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      throw new Error(message || "提交失败");
    }
  } catch (error) {
    uni.showToast({
      title: error.message || "提交失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};

// 跳转到反馈列表
const goFeedbackList = () => {
  uni.navigateTo({
    url: "/subpkg_my/feedback/list",
  });
};
</script>

<style lang="scss" scoped>
.feedback-container {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 20rpx;

  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .record-btn {
    padding: 12rpx 24rpx;
    background: rgba(0, 102, 255, 0.1);
    border-radius: 30rpx;

    text {
      font-size: 26rpx;
      color: #0066ff;
    }
  }
}

.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .form-item {
    position: relative;
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 16rpx;
      display: block;
    }

    .input {
      width: 100%;
      height: 80rpx;
      background-color: #f8f9fb;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
    }

    .textarea {
      width: 100%;
      min-height: 240rpx;
      background-color: #f8f9fb;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
    }

    .word-count {
      position: absolute;
      right: 0;
      bottom: -30rpx;
      font-size: 24rpx;
      color: #999;
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
