<template>
  <view class="container">
    <view>
      <h1 class="title">错峰出行，安全你我</h1>
      <view class="record" @click="goRecord"><p class="record_text">预约记录</p></view>
    </view>

    <view class="card">
      <!-- 1.选择景区 -->
      <view class="selectScenic" @click="openPopupScenic = true">
        <template v-if="Object.keys(selectedScenic).length === 0">
          <span>请选择景区</span>
          <u-icon name="arrow-right"></u-icon>
        </template>
        <template v-else>
          {{ selectedScenic.scenicName }}
        </template>
      </view>
      <hr />
      <!-- 2.预约日期 -->
      <view class="selectDate" @click="openPopupDate = true">
        <span style="padding-top: 20rpx">预约日期</span>
        <view class="select">
          <span class="select_text" v-if="!selectedOpenDate">请选择</span>
          <span class="select_text" v-else>{{ selectedOpenDate }}</span>
          <u-icon name="arrow-right" class="select_icon"></u-icon>
        </view>
      </view>
      <!-- 3.步进器 -->
      <view class="visitors">
        <span style="padding-top: 20rpx">游客信息</span>
        <view>
          <span style="padding-right: 15rpx">预约人数</span>
          <u-number-box :input-width="100" :input-height="60" :min="1" v-model="visitorNum"></u-number-box>
        </view>
      </view>
      <!-- 4.游客信息 -->
      <view class="userInfo" v-for="item in visitorNum">
        <view class="userInfo_header">
          <span>出游人信息（联系人）{{ item }}</span>
        </view>
        <u-form :model="form[item - 1]" ref="form1">
          <u-form-item label="姓名" prop="fullName"><u-input v-model="form[item - 1].fullName" /></u-form-item>
          <u-form-item label="手机" prop="phoneNumber"><u-input v-model="form[item - 1].phoneNumber" /></u-form-item>
          <u-form-item label="号码" prop="idNumber"><u-input v-model="form[item - 1].idNumber" /></u-form-item>
        </u-form>
      </view>

      <button @click="onSubmit">提交</button>
    </view>
  </view>
  <!-- 卡片 -->

  <u-select v-model="openPopupScenic" mode="single-column" :list="scenicList" @confirm="confirmScenic"></u-select>
  <u-popup v-model="openPopupDate" mode="bottom">
    <uni-calendar @change="changeDate" :selected="selectedTime" />
  </u-popup>
</template>

<script setup>
const goRecord = () => {
  uni.navigateTo({
    url: '/subpkg_index/reservations/record'
  });
};
import { ref, onMounted, watch, nextTick } from 'vue';
import reservationsApi from '@/apis/reservations';
import reservationsTimeApi from '@/apis/reservationsTime.js';
import reservationsTimeTravelersApi from '@/apis/reservationsTimeTravelers';

// 1. 选择景区
const scenicList = ref([]); // 景区列表
const openPopupScenic = ref(false); //选择景区弹窗
const selectedScenic = ref({}); // 被选择的景区
// 2. 预约时间
const openPopupDate = ref(false); // 预约日期弹窗
const selectedOpenDate = ref(); // 别选择的预约时间
const selectedTime = ref(); // 选择预约时间
// 3. 步进器
const visitorNum = ref(1); //出游人人数
// 4. 游客信息
const form = ref([{ fullName: '', phoneNumber: '', idNumber: '' }]); // 出游人表单
// 5. 提交表单
const onSubmitForm = ref({
  travelerList: [{}]
});
// 初始化函数
const init = async () => {
  const { code, data } = await reservationsApi.listApi();
  // map返回结果需要是对象，第二种方法是简写
  scenicList.value = data.records.map((result) => {
    return {
      label: result.scenicName,
      value: result.id
    };
  });
};

// 选择景区
const confirmScenic = async (val) => {
  selectedScenic.value = {
    id: val[0].value,
    scenicName: val[0].label
  };
  onSubmitForm.value.reservationsId = selectedScenic.value.id;
  // 查询预约时间
  const { data } = await reservationsTimeApi.list(onSubmitForm.value.reservationsId);
  selectedTime.value = data.records.map((item) => {
    const data = item.openDateTime.split('T')[0];
    return {
      date: data,
      info: item.stock
    };
  });
};

// 选择预约时间
const changeDate = async (e) => {
  selectedOpenDate.value = e.fulldate;
  const { data } = await reservationsTimeApi.list(onSubmitForm.value.reservationsId);
  const result = data.records.find((item) => item.openDateTime.split('T')[0] === e.fulldate);
  onSubmitForm.value.reservationsTimeId = result ? result.id : null;
};

// 表单提交
const onSubmit = async () => {
  onSubmitForm.value.travelerList = form.value;
  const res = await reservationsTimeTravelersApi.addApi(onSubmitForm.value);
};

// 监听步进器变化填充表单数据
watch(visitorNum, (newVal) => {
  // 初始化时填充表单数据
  initForm(visitorNum.value);
});

// 初始化 form 数组
const initForm = (num) => {
  form.value = [];
  for (let i = 0; i < num; i++) {
    form.value.push({
      fullName: '',
      phoneNumber: '',
      idNumber: ''
    });
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="scss">
.container {
  // background-color: aqua;
  background-image: linear-gradient(to right top, white, #065799);
  height: 100vh;
  .title {
    padding: 30rpx 0 0 30rpx;
  }
  .record {
    width: 160rpx;
    height: 60rpx;
    border: 1px solid black;
    border-radius: 15px;
    margin: 10px;
    float: right;
    .record_text {
      display: flex;
      height: 100%;
      width: 100%; /* 确保占满整个记录区域 */
      justify-content: center;
      align-items: center;
    }
  }
}
.card {
  overflow: hidden;
  background-color: #ffffff;
  margin: 0 auto;
  padding: 20rpx;
  width: 95%;
  border-radius: 5px;
  .selectScenic {
    display: flex;
    justify-content: space-between;
    margin: 30rpx 0;
    span {
      font-size: 36rpx;
      font-weight: 600;
    }
  }
  .selectDate {
    display: flex;
    justify-content: space-between;
    margin: 30rpx 0;
    .select {
      width: 500rpx;
      height: 80rpx;
      border: 1px solid #ccc;
      border: 1px solid #ffffff;
      display: flex;
      align-items: center;
      border-radius: 5px;
      .select_text {
        padding-left: 20rpx;
        width: 80%;
      }
      .select_icon {
        padding: 10rpx;
      }
    }
  }
  .visitors {
    display: flex;
    justify-content: space-between;
    margin: 30rpx 0;
  }
  .userInfo {
    margin-top: 20rpx;
    .userInfo_header {
      span {
        font-weight: 600;
        color: #08a7f9;
      }
    }
  }
}
</style>
