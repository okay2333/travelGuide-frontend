<template>
  <view class="container">
    <view class="header">
      <text class="title">错峰出行，安全你我</text>
      <view class="record-btn" @click="goRecord">
        <u-icon name="calendar" size="28" color="#fff"></u-icon>
        <text>预约记录</text>
      </view>
    </view>

    <view class="booking-card">
      <!-- 1. 选择景区 -->
      <view class="section scenic-section" @click="openPopupScenic = true">
        <view class="section-title">
          <u-icon name="map" size="40" color="#2979ff"></u-icon>
          <text>选择景区</text>
        </view>
        <view class="section-content">
          <text
            :class="{ placeholder: Object.keys(selectedScenic).length === 0 }"
          >
            {{
              Object.keys(selectedScenic).length === 0
                ? "请选择景区"
                : selectedScenic.scenicName
            }}
          </text>
          <u-icon name="arrow-right" color="#999"></u-icon>
        </view>
      </view>

      <!-- 2. 预约日期 -->
      <view class="section date-section" @click="openPopupDate = true">
        <view class="section-title">
          <u-icon name="calendar-fill" size="40" color="#2979ff"></u-icon>
          <text>预约日期</text>
        </view>
        <view class="section-content">
          <text :class="{ placeholder: !selectedOpenDate }">
            {{ selectedOpenDate || "请选择日期" }}
          </text>
          <u-icon name="arrow-right" color="#999"></u-icon>
        </view>
      </view>

      <!-- 3. 游客人数 -->
      <view class="section visitor-section">
        <view class="section-title">
          <u-icon name="account" size="40" color="#2979ff"></u-icon>
          <text>预约人数</text>
        </view>
        <view class="section-content">
          <u-number-box
            v-model="visitorNum"
            :min="1"
            :max="10"
            :step="1"
            :input-width="120"
            :input-height="60"
            color="#2979ff"
          ></u-number-box>
        </view>
      </view>

      <!-- 4. 游客信息表单 -->
      <view class="visitors-form">
        <view
          class="visitor-card"
          v-for="(item, index) in visitorNum"
          :key="index"
        >
          <view class="visitor-header">
            <u-icon name="user" size="32" color="#2979ff"></u-icon>
            <text>游客 {{ index + 1 }}</text>
          </view>

          <u-form
            :model="form[index]"
            :ref="'form' + index"
            :rules="rules"
            label-position="left"
          >
            <u-form-item label="姓名" prop="fullName" required>
              <u-input
                v-model="form[index].fullName"
                placeholder="请输入姓名"
              />
            </u-form-item>

            <u-form-item label="手机号码" prop="phoneNumber" required>
              <u-input
                v-model="form[index].phoneNumber"
                placeholder="请输入手机号"
                type="number"
              />
            </u-form-item>

            <u-form-item label="身份证号" prop="idNumber" required>
              <u-input
                v-model="form[index].idNumber"
                placeholder="请输入身份证号"
              />
            </u-form-item>
          </u-form>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="onSubmit">确认预约</button>
      </view>
    </view>

    <!-- 选择器弹窗 -->
    <u-select
      v-model="openPopupScenic"
      mode="single-column"
      :list="scenicList"
      @confirm="confirmScenic"
    ></u-select>

    <u-popup v-model="openPopupDate" mode="bottom">
      <uni-calendar
        @change="changeDate"
        :selected="selectedTime"
        :start-date="startDate"
        :end-date="endDate"
      />
    </u-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import scenicApi from "@/apis/scenic";
import reservationsApi from "@/apis/reservations";
// import reservationsTimeApi from "@/apis/reservationsTime.js";
import reservationsTravelersApi from "@/apis/reservationsTravelers";

// 表单验证规则
const rules = {
  fullName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: ["blur", "change"],
    },
  ],
  phoneNumber: [
    {
      required: true,
      message: "请输入手机号",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: ["blur", "change"],
    },
  ],
  idNumber: [
    {
      required: true,
      message: "请输入身份证号",
      trigger: ["blur", "change"],
    },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "请输入正确的身份证号",
      trigger: ["blur", "change"],
    },
  ],
};

// 状态定义
const scenicList = ref([]);
const openPopupScenic = ref(false);
const selectedScenic = ref({});
const openPopupDate = ref(false);
const selectedOpenDate = ref("");
const selectedTime = ref([]);
const visitorNum = ref(1);
const form = ref([{ fullName: "", phoneNumber: "", idNumber: "" }]);
const onSubmitForm = ref({
  travelerList: [{}],
  reservationsId: "",
});

// 日期范围限制
const startDate = ref(new Date().toISOString().split("T")[0]);
const endDate = ref(
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
);

// 初始化
const init = async () => {
  try {
    uni.showLoading({ title: "加载中" });
    const { data } = await scenicApi.listScenicVOByPage({
      current: 1,
      pageSize: 100,
      type: 1,
    });
    scenicList.value = data.records.map((item) => ({
      label: item.scenicName,
      value: item.id,
    }));
  } catch (error) {
    uni.showToast({
      title: "加载失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};

// 选择景区
const confirmScenic = async (val) => {
  try {
    selectedScenic.value = {
      id: val[0].value,
      scenicName: val[0].label,
    };
    // onSubmitForm.value.reservationsId = selectedScenic.value.id;
    console.log("这是景区", onSubmitForm.value.reservationsId);

    const { data } = await reservationsApi.listApi({
      current: 1,
      pageSize: 100,
      scenicId: selectedScenic.value.id,
    });
    console.log("根据景区ID查询的Data", data);

    selectedTime.value = data.records.map((item) => ({
      date: item.openDateTime.split("T")[0],
      info: item.stock,
      id: item.id,
    }));
  } catch (error) {
    uni.showToast({
      title: "获取预约时间失败",
      icon: "none",
    });
  }
};

// 选择日期
const changeDate = async (e) => {
  console.log("这是多少", e);
  console.log("selectedTime", selectedTime.value);
  const test = selectedTime.value.some((item) => item.date === e.fulldate);
  console.log("@@@s", test);
  if (selectedTime.value.some((item) => item.date === e.fulldate)) {
    console.log("选择日期", e);

    selectedOpenDate.value = e.fulldate;
    onSubmitForm.value.reservationsId = e.extraInfo.id;
  } else {
    uni.showToast({
      title: "选择日期失败",
      icon: "none",
    });
  }
  // try {
  // const { data } = await reservationsTimeApi.list(
  //   onSubmitForm.value.reservationsId
  // );
  // console.log("选择日期的data", data);
  // const result = data.records.find(
  //   (item) => item.openDateTime.split("T")[0] === e.fulldate
  // );
  // onSubmitForm.value.reservationsTimeId = result?.id;
  // } catch (error) {}
};

// 表单提交
const onSubmit = async () => {
  try {
    // 表单验证
    if (!selectedScenic.value.id) {
      return uni.showToast({
        title: "请选择景区",
        icon: "none",
      });
    }
    if (!selectedOpenDate.value) {
      return uni.showToast({
        title: "请选择预约日期",
        icon: "none",
      });
    }

    uni.showLoading({ title: "提交中" });
    onSubmitForm.value.travelerList = form.value;
    console.log("提交之前表结构", onSubmitForm.value);

    const { code, message } = await reservationsTravelersApi.addApi(
      onSubmitForm.value
    );

    if (code === 0) {
      uni.showToast({
        title: "预约成功",
        icon: "success",
      });

      // 预约成功后跳转到记录页
      setTimeout(() => {
        uni.redirectTo({
          url: "/subpkg_index/reservations/record",
        });
      }, 1500);
    } else if (code === 40000) {
      uni.showToast({
        title: "该景区已预约",
        icon: "none",
      });
    } else {
      uni.showToast({
        title: message || "预约失败",
        icon: "none",
      });
    }
  } catch (error) {
    uni.showToast({
      title: "预约失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};

// 监听人数变化
watch(visitorNum, (newVal) => {
  const newForm = [];
  for (let i = 0; i < newVal; i++) {
    newForm.push(
      form.value[i] || { fullName: "", phoneNumber: "", idNumber: "" }
    );
  }
  form.value = newForm;
});

// 页面跳转
const goRecord = () => {
  uni.navigateTo({
    url: "/subpkg_index/reservations/record",
  });
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1976d2, #64b5f6);
  padding: 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;

  .title {
    color: #ffffff;
    font-size: 36rpx;
    font-weight: bold;
  }

  .record-btn {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 15rpx 30rpx;
    border-radius: 30rpx;

    text {
      color: #ffffff;
      margin-left: 10rpx;
      font-size: 28rpx;
    }
  }
}

.booking-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 40rpx;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    text {
      margin-left: 20rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .section-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;

    .placeholder {
      color: #999;
    }
  }
}

.visitors-form {
  .visitor-card {
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;

    .visitor-header {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;

      text {
        margin-left: 20rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }
    }
  }
}

.submit-section {
  margin-top: 60rpx;

  .submit-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: #2979ff;
    color: #ffffff;
    font-size: 32rpx;
    border-radius: 45rpx;
    border: none;

    &:active {
      background: darken(#2979ff, 10%);
    }
  }
}

::v-deep .u-form-item {
  .u-form-item__body {
    padding: 20rpx 0;
  }

  .u-form-item__body__left__content {
    padding-right: 30rpx;
  }
}
</style>
