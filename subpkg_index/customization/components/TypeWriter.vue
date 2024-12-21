<template>
  <view class="typewriter">{{ displayText }}</view>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  typingSpeed: {
    type: Number,
    default: 50,
  },
});

const emit = defineEmits(["typing-complete"]);

const displayText = ref("");
let currentIndex = 0;

const typeText = () => {
  if (currentIndex < props.text.length) {
    displayText.value += props.text[currentIndex];
    currentIndex++;
    setTimeout(typeText, props.typingSpeed);
  } else {
    emit("typing-complete");
  }
};

watch(
  () => props.text,
  () => {
    displayText.value = "";
    currentIndex = 0;
    typeText();
  }
);

onMounted(() => {
  typeText();
});
</script>

<style scoped>
.typewriter {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
