<template>
  <!-- 	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view> -->
  <h1>首页</h1>
  <u-tag text="一丘之貉" mode="dark" />
  <u-tag text="沆瀣一气" mode="light" />
  <u-tag text="狼狈为奸" mode="plain" />
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello'
    };
  },
  onLoad() {
    console.log('Index page loaded');
  },
  methods: {}
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
