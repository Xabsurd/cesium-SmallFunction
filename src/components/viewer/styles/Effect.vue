<template></template>
<script setup lang="ts">
import { Cesium, graphic, layer, Map, MaterialType } from "mars3d";
import { onUnmounted } from "vue";
import { getHousePosition } from "../../../utils/data";
const { getMap } = defineProps(["getMap"]);
const map = getMap() as Map;
const graphicLayer = new layer.GraphicLayer();
map.addLayer(graphicLayer);
// 圆形动态扩散图
const cicle = new graphic.CirclePrimitive({
  position: new Cesium.Cartesian3(-2581073.248361069, 4650145.445128394, 3508851.8953360114),
  style: {
    radius: 15,
    materialType: MaterialType.CircleWave,
    materialOptions: {
      color: "rgba(22,120,255,0.6)",
      count: 2,
      speed: 10,
    },
    clampToGround: true, // 是否贴地
  },
});

// 立体围墙扩散效果,面状
const diffuseWallGlow = new graphic.DiffuseWall({
  positions: getHousePosition()[1].points,
  style: {
    color: "#ffff00",
    diffHeight: 30, // 高度
    speed: 10, // 速度
  },
});
let _rotation = Math.random();

const search = new graphic.CircleEntity({
  position: new Cesium.Cartesian3(-2581051.3968967707, 4650155.945287908, 3508850.424217874),
  style: {
    radius: 15.0,
    // 扫描材质
    materialType: MaterialType.CircleScan,
    materialOptions: {
      image: "./assets/images/circle-scan.png",
      color: "#00ff00",
    },
    stRotation: new Cesium.CallbackProperty(function (e) {
      _rotation -= 0.1;
      return _rotation;
    }, false),
    classificationType: Cesium.ClassificationType.BOTH,
    clampToGround: true, // 是否贴地
  },
  attr: { remark: "示例4" },
});
graphicLayer.addGraphic(cicle);
graphicLayer.addGraphic(search);
graphicLayer.addGraphic(diffuseWallGlow);

onUnmounted(() => {
  map.removeLayer(graphicLayer);
});
</script>
