<template></template>
<script setup lang="ts">
import { Cesium, graphic, layer,Map } from "mars3d";
import { onUnmounted } from "vue";
const { getMap } = defineProps(["getMap"]);
const map = getMap() as Map;
let graphicLayer = new layer.GraphicLayer();
map.addLayer(graphicLayer);
const video  = document.createElement("video");
video.muted=true;
video.src="./assets/videos/1665669595.mp4";
video.loop=true;
video.autoplay=true;
const video3D = new graphic.Video3D({
  position: new Cesium.Cartesian3(-2580943.270042545, 4650151.545379068, 3509011.801442911),
  style: {
    container:video,
    // maskImage: "http://mars3d.cn/img/textures/video-mask.png", // 羽化视频四周，融合更美观
    angle: 33.3,
    angle2: 23.4,
    heading: 40.7,
    pitch: -52.1,
    showFrustum: true
  },
  attr: { remark: "示例1" },
});
// PerspectiveFrustum
graphicLayer.addGraphic(video3D);
onUnmounted(() => {
  map.removeLayer(graphicLayer);
});
</script>
