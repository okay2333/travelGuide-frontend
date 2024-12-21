<template>
  <view class="profile-edit">
    <!-- 头像编辑 -->
    <view class="edit-item avatar-item" @tap="chooseAvatar">
      <text class="label">头像</text>
      <view class="avatar-wrapper">
        <image :src="formData.avatarUrl" mode="aspectFill" class="avatar" />
        <text class="tip">点击更换</text>
      </view>
      <text class="iconfont icon-arrow-right"></text>
    </view>

    <!-- 用户名编辑 -->
    <view class="edit-item">
      <text class="label">用户名</text>
      <input
        type="text"
        v-model="formData.username"
        placeholder="请输入用户名"
        class="input"
      />
    </view>

    <!-- 个人简介编辑 -->
    <view class="edit-item">
      <text class="label">个人简介</text>
      <textarea
        v-model="formData.desc"
        placeholder="介绍一下自己吧"
        class="textarea"
        :maxlength="100"
      />
      <text class="word-count">{{ formData.desc.length }}/100</text>
    </view>

    <!-- 保存按钮 -->
    <view class="btn-wrapper">
      <button class="save-btn" @tap="handleSave">保存修改</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import userApi from "@/apis/user";

const formData = ref({
  username: "",
  avatarUrl: "",
  desc: "",
});

// 获取用户信息
const getUserInfo = async () => {
  try {
    const { data } = await userApi.getLoginUser();
    formData.value = {
      username: data.userName || "",
      avatarUrl: data.userAvatar || "/static/images/default-avatar.png",
      desc: data.userProfile || "",
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
    uni.showToast({
      title: "获取用户信息失败",
      icon: "none",
    });
  }
};

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      // 限制图片大小（例如：2MB）

      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (res.tempFiles[0].size > maxSize) {
        return uni.showToast({
          title: "图片大小不能超过2MB",
          icon: "none",
        });
      }
      formData.value.avatarUrl = res.tempFilePaths[0];
    },
    fail: (error) => {
      console.error("选择图片失败:", error);
      uni.showToast({
        title: "选择图片失败",
        icon: "none",
      });
    },
  });
};

// 保存修改
const handleSave = async () => {
  try {
    // 表单验证
    if (!formData.value.username.trim()) {
      return uni.showToast({
        title: "请输入用户名",
        icon: "none",
      });
    }

    // 这里需要先上传头像，获取URL
    let avatarUrl = formData.value.avatarUrl;
    if (!avatarUrl.startsWith("http")) {
      // 显示上传中提示
      uni.showLoading({
        title: "上传头像中...",
      });

      try {
        // 创建上传任务
        const [error, res] = await uni.uploadFile({
          url: "http://localhost:8101/api/file/upload",
          filePath: avatarUrl,
          name: "file",
          header: {
            Authorization: uni.getStorageSync("token"),
          },
        });

        // 隐藏loading
        uni.hideLoading();

        // if (error || res.statusCode !== 200) {
        //   throw new Error("头像上传失败");
        // }

        // 解析上传结果
        const uploadRes = JSON.parse(res.data);
        if (uploadRes.code !== 0) {
          throw new Error(uploadRes.message || "头像上传失败");
        }
        avatarUrl = uploadRes.data; // 直接使用返回的图片URL
      } catch (uploadError) {
        uni.hideLoading();
        throw new Error("头像上传失败");
      }
    }

    // 更新用户信息
    await userApi.updateMyUser({
      userName: formData.value.username,
      userAvatar: avatarUrl,
      userProfile: formData.value.desc,
    });

    uni.showToast({
      title: "保存成功",
      icon: "success",
    });

    // 刷新上一页的用户信息
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.$vm.getLoginUser) {
      prevPage.$vm.getLoginUser();
    }

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error("保存失败:", error);
    uni.showToast({
      title: error.message || "保存失败",
      icon: "none",
    });
  }
};

onMounted(() => {
  getUserInfo();
});
</script>

<style lang="scss" scoped>
.profile-edit {
  min-height: 100vh;
  background-color: #f8f9fb;
  padding: 20rpx;
}

.edit-item {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;

  .label {
    font-size: 28rpx;
    color: #333;
    width: 140rpx;
  }

  .input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }

  .textarea {
    flex: 1;
    height: 160rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
  }

  .word-count {
    position: absolute;
    right: 40rpx;
    bottom: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.avatar-item {
  .avatar-wrapper {
    flex: 1;
    display: flex;
    align-items: center;

    .avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .tip {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.btn-wrapper {
  margin-top: 60rpx;
  padding: 0 40rpx;

  .save-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #0066ff 0%, #2b85ff 100%);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;

    &:active {
      opacity: 0.9;
    }
  }
}
</style>
