<template>
  <el-menu :default-active="route.path" router class="Sider absurd-menu">
    <CreateMenu v-bind:menuMap="menuMap" :ui-text="uiText"></CreateMenu>
  </el-menu>
</template>

<script lang="ts" setup>
import CreateMenu from "./CreateMenu.vue";
import menuMap from "../router/menuMap";
import { useRoute } from "vue-router";
const route = useRoute();
const uiText = {
  home: { text: "重新设置视角" },
  wall: { text: "墙体设置" },
  house: { text: "房子" },
  road: { text: "道路" },
  water: { text: "水系" },
  field: { text: "田地" },
  effect: { text: "特效" },
  monomer: { text: "单体化" },
  video: { text: "视频融合" },
  custom: { text: "自定义单体化" },
};
</script>

<style lang="scss" scoped>
.Sider {
  width: 220px;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background-color: var(--sider-color);
  color: var(--sider-text-color);
  z-index: 1;
}
.el-menu--collapse {
  width: 0px;
}
</style>
