<template>
  <view class="customization-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="title">智能行程规划</text>
    </view>

    <!-- 聊天记录区域 -->
    <scroll-view
      class="chat-container"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view class="message-list">
        <!-- AI默认欢迎消息 -->
        <view class="message ai-message">
          <view class="avatar">
            <image src="/static/images/ai-avatar.png"
          /></view>
          <view class="content-wrapper">
            <view class="content">
              <TypeWriter
                :text="welcomeMessage"
                :typing-speed="50"
                @typing-complete="onTypingComplete"
              />
            </view>
          </view>
        </view>

        <!-- 消息列表 -->
        <template v-for="(item, index) in messageList" :key="index">
          <!-- 普通消息 -->
          <view
            :class="[
              'message',
              item.type === 'user' ? 'user-message' : 'ai-message',
            ]"
          >
            <view class="avatar" v-if="item.type === 'ai'">
              <image src="/static/images/ai-avatar.png" />
            </view>
            <view class="content-wrapper">
              <view class="content">
                <TypeWriter
                  v-if="item.type === 'ai'"
                  :text="item.content"
                  :typing-speed="50"
                  @typing-complete="onTypingComplete"
                />
                <text v-else>{{ item.content }}</text>
              </view>
              <text class="time">{{ item.time }}</text>
            </view>
          </view>

          <!-- 在最后一条AI消息后显示提示词 -->
          <view
            v-if="
              index === messageList.length - 1 &&
              item.type === 'ai' &&
              followUps.length > 0 &&
              !isLoading
            "
            class="message ai-message"
          >
            <view class="avatar">
              <image src="/static/images/ai-avatar.png" />
            </view>
            <view class="content-wrapper">
              <view class="follow-ups">
                <view
                  v-for="(prompt, pIndex) in followUps"
                  :key="pIndex"
                  class="follow-up-item"
                  @tap="handleFollowUp(prompt)"
                >
                  {{ prompt }}
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 加载中状态 -->
        <view v-if="isLoading" class="message ai-message">
          <view class="avatar">
            <image src="/static/images/ai-avatar.png" />
          </view>
          <view class="content-wrapper">
            <view class="content loading">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-container">
      <textarea
        v-model="inputMessage"
        class="input-box"
        placeholder="请描述您的旅行需求..."
        :disable-default-padding="true"
        :cursor-spacing="10"
        :show-confirm-bar="false"
        @confirm="sendMessage"
      />
      <view
        class="send-btn"
        :class="{ disabled: !inputMessage.trim() || isLoading }"
        @tap="sendMessage"
      >
        <text class="icon">&#xe609;</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import TypeWriter from "./components/TypeWriter.vue";
import { sendMessageToCoze, createConversationId } from "@/utils/getCoze";

const welcomeMessage =
  "您好！我是您的专属旅行规划助手。请告诉我您想去哪里旅行，以及您的具体需求（如预算、天数、出行时间等），我会为您量身定制完美行程。";
const messageList = ref([]);
const inputMessage = ref("");
const scrollTop = ref(0);
const isLoading = ref(false);

// 添加会话ID
const conversationId = ref(createConversationId());

// 添加后续提示词相关的状态
const followUps = ref([]);

const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  // 清除之前的提示词
  followUps.value = [];

  // 添加用户消息
  messageList.value.push({
    type: "user",
    content: inputMessage.value,
    time: formatTime(),
  });

  const userMessage = inputMessage.value;
  inputMessage.value = "";
  scrollToBottom();

  isLoading.value = true;

  try {
    const response = await sendMessageToCoze(userMessage, conversationId.value);

    // 添加AI回复
    messageList.value.push({
      type: "ai",
      content: response.reply,
      time: formatTime(),
    });

    // 等待打字机效果完成后再显示提示词
    setTimeout(() => {
      followUps.value = response.followUps;
      scrollToBottom();
    }, response.reply.length * 50 + 500); // 根据文本长度和打字速度估算延迟时间
  } catch (error) {
    messageList.value.push({
      type: "ai",
      content: "抱歉，服务出现了一些问题，请稍后再试。",
      time: formatTime(),
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  setTimeout(() => {
    scrollTop.value = 9999999;
  }, 100);
};

const onTypingComplete = () => {
  scrollToBottom();
};

// 处理后续提示词点击
const handleFollowUp = (prompt) => {
  inputMessage.value = prompt;
  sendMessage();
};
</script>

<style lang="scss" scoped>
.customization-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fb;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  padding-top: var(--status-bar-height);

  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.chat-container {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.message-list {
  .message {
    display: flex;
    margin-bottom: 30rpx;
    padding: 0 20rpx;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .content-wrapper {
      max-width: 70%;
      margin-left: 20rpx;

      .content {
        padding: 20rpx;
        border-radius: 20rpx;
        font-size: 28rpx;
        line-height: 1.5;
        word-break: break-all;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
      }

      .time {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
        margin-left: 10rpx;
      }
    }
  }

  .user-message {
    flex-direction: row-reverse;

    .content-wrapper {
      margin-left: 0;
      margin-right: 0;

      .content {
        background: linear-gradient(135deg, #0066ff 0%, #2b85ff 100%);
        color: #fff;
      }

      .time {
        text-align: right;
        margin-right: 10rpx;
      }
    }
  }

  .ai-message {
    .content {
      background-color: #fff;
      color: #333;
    }
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;

  .dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background-color: #999;
    margin: 0 6rpx;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.input-container {
  padding: 16rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: flex-end;

  .input-box {
    flex: 1;
    min-height: 60rpx;
    max-height: 120rpx;
    padding: 12rpx 20rpx;
    border-radius: 30rpx;
    background-color: #f5f5f5;
    font-size: 26rpx;
    margin-right: 16rpx;
  }

  .send-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #0066ff 0%, #2b85ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    .icon {
      font-family: "iconfont";
      color: #fff;
      font-size: 32rpx;
    }

    &.disabled {
      background: #ccc;
      opacity: 0.7;
    }
  }
}

.follow-ups {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-top: 20rpx;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;

  .follow-up-item {
    padding: 16rpx 24rpx;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #333;
    transition: all 0.3s;

    &:active {
      background-color: #e8f0ff;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
