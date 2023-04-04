<template></template>
<script setup lang="ts">
import { Cesium } from "mars3d";
import { onUnmounted } from "vue";
import { Map } from "mars3d";
import { getRoadPositions } from "../../../utils/data";
import { colorMask } from "../../../utils/colorMask";
const { getMap } = defineProps(["getMap"]);
const map = getMap() as Map;
const holes = getRoadPositions().map((item) => {
  return {
    positions: item.points,
  };
});
const _colorShadow = colorMask(map, holes, Cesium.Color.ORANGE.withAlpha(0.8));
onUnmounted(() => {
  _colorShadow.clear();
});
</script>
