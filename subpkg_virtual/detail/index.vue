<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import img1 from '@/static/博物馆.jpg';

export default {
  mounted() {
    const scene = new THREE.Scene();

    // 添加坐标系
    // const ax = new THREE.AxesHelper(50)
    // scene.add(ax)

    // (角度,宽高比，看多近，看多远)
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1100);

    // 相机的初始位置
    camera.position.set(15, -15, 50);

    // 加载图片
    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load(img1); //异步

    const geometry = new THREE.SphereGeometry(50, 50, 50);

    // 现在在球的表面把它写在内部
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      // color:'#ccc',
      // wireframe:true,
      map: texture1
    });

    const cube = new THREE.Mesh(geometry, material);

    cube.rotateY(5);
    cube.rotateZ(-0.3);
    scene.add(cube);

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('container').replaceChildren(renderer.domElement);

    // 制作3D效果
    const control = new OrbitControls(camera, renderer.domElement);
    // 加快缩放速度
    control.zoomSpeed = 3;
    control.maxDistance = 70;
    control.minDistance = 10;
    control.autoRotate = true; // 自动旋转
    control.autoRotateSpeed = 1; // 旋转速度 默认1.5
    control.enableDamping = true; // 滑动的手感（阻尼感）
    // 这里还不能动 需要一直去渲染
    function amniation() {
      control.update();
      renderer.render(scene, camera);
      requestAnimationFrame(amniation);
    }

    amniation();

    // 自适应
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    });

    // 双击全屏
    // window.addEventListener('dblclick',()=>{
    //     const fullscreen = document.fullscreenElement
    //     fullscreen? document.exitFullscreen():document.body.requestFullscreen()
    // })

    // renderer.render(scene,camera)
  }
};
</script>

<style></style>
