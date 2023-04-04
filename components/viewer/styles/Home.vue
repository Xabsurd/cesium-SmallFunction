<template></template>
<script setup lang="ts">
import { Cesium, graphic, layer, Map, MaterialType } from "mars3d";
const { getMap } = defineProps(["getMap"]);
const map = getMap() as Map;
map.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(119.032216, 33.589536, 145.08),
  orientation: { heading: 0, pitch: (-22.9 / 180) * Math.PI },
});
</script>
