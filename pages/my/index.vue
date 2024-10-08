<template>
  <view class="container test">
    <view class="list">
      <template v-for="item in columns[0].items">
        <view v-if="item.tag == 'left'" :class="item.type == 0 ? 'item' : 'item2'"></view>
      </template>
    </view>
    <view class="list">
      <template v-for="item in columns[1].items">
        <view v-if="item.tag == 'right'" :class="item.type == 0 ? 'item' : 'item2'"></view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const columns = ref([{ items: [] }, { items: [] }]);

const leftHeight = ref(0);
const rightHeight = ref(1);

const loadData = () => {
  for (let i = 0; i < 10; i++) {
    const type = Math.random() * 10 > 5 ? 1 : 0;
    let tag = '';

    if (leftHeight.value > rightHeight.value) {
      tag = 'right';
      rightHeight.value += 280;
      if (type === 1) {
        leftHeight.value -= 30;
      }
    } else {
      tag = 'left';
      leftHeight.value += 280;
      if (type === 1) {
        rightHeight.value -= 30;
      }
    }

    if (tag === 'left') {
      columns.value[0].items.push({ tag, type, name: i });
    } else {
      columns.value[1].items.push({ tag, type, name: i });
    }
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.test {
  display: flex;
  padding: 0 8rpx;
  flex-direction: row;
  background-color: #f5f5f5;
}

.list {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.item {
  height: 500rpx;
  margin: 8rpx;
  display: flex;
  border-radius: 8rpx;
  background-color: #ff9900;
}

.item2 {
  height: 560rpx;
  margin: 8rpx;
  display: flex;
  border-radius: 8rpx;
  background-color: #ff0099;
}
</style>