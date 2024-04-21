<template>
  <Teleport to="#mapdom">
    <div class="custom-popup"></div>
  </Teleport>
</template>
<script setup lang="ts">
import { Map,Cesium } from 'mars3d';
const { getMap,position } = defineProps(["getMap","position"]);
const map = getMap() as Map;

map.viewer.clock.onTick.addEventListener(()=>{
//    cosnt position= Cesium.SceneTransforms.wgs84ToWindowCoordinates(map.viewer.scene, position);
});
</script>
<style scoped lang="scss">
.custom-popup{
    position: absolute;

}
</style>