<template>
  <u-popup v-model="props.orderPopupshow" mode="bottom" @close="closePopup">
    <view>
      <view class="cover">
        <img src="file:///G:/FrontEnd/HBuilderProjects/travelGuide-frontend/static/duolamei.jpg" width="70" alt="" />
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, defineProps } from 'vue';
const props = defineProps({ orderPopupshow: { type: Boolean, default: false } });
const closePopup = () => {
  console.log('关闭');
  props.orderPopupshow = false;
};
</script>

<style></style>
