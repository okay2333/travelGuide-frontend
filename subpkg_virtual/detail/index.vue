<template>
  <div ref="container"></div>
  <!-- 使用 ref 来引用容器 -->
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onLoad } from "@dcloudio/uni-app";
import img1 from "@/static/博物馆.jpg";
import { onMounted, ref } from "vue";

// 使用 ref 获取 DOM 元素
const container = ref(null);
const id = ref();
const picture = ref("");
import vrtourApi from "@/apis/vrtour.js";
onMounted(async () => {
  const { code, data } = await vrtourApi.getVRTourById(id.value);
  picture.value = data.picture;

  const scene = new THREE.Scene();

  // (角度,宽高比，看多近，看多远)
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1100
  );

  // 相机的初始位置
  camera.position.set(15, -15, 50);

  // 加载图片
  const textureLoader = new THREE.TextureLoader();
  const texture1 = textureLoader.load(picture.value); //异步

  const geometry = new THREE.SphereGeometry(50, 50, 50);

  // 现在在球的表面把它写在内部
  geometry.scale(-1, 1, 1);

  const material = new THREE.MeshBasicMaterial({
    map: texture1,
  });

  const cube = new THREE.Mesh(geometry, material);

  cube.rotateY(5);
  cube.rotateZ(-0.3);
  scene.add(cube);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 使用 ref 引用容器并添加渲染器
  if (container.value) {
    container.value.replaceChildren(renderer.domElement);
  }

  // 制作3D效果
  const control = new OrbitControls(camera, renderer.domElement);
  control.zoomSpeed = 3;
  control.maxDistance = 70;
  control.minDistance = 10;
  control.autoRotate = true; // 自动旋转
  control.autoRotateSpeed = 1; // 旋转速度 默认1.5
  control.enableDamping = true; // 滑动的手感（阻尼感）

  // 这里还不能动 需要一直去渲染
  function animation() {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
  }

  animation();

  // 自适应
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  });
});

onLoad((option) => {
  console.log(option.id);
  id.value = option.id;
});
</script>

<style>
/* 你可以根据需要添加样式 */
</style>
