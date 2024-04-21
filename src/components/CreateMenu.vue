<template>
  <template v-for="(item, index) in menuMap" :key="index">
    <el-sub-menu v-if="item.children" :index="cusKey + '-' + index">
      <template #title>
        <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
        <span>
          
          {{ uiText[item.path.replace(/\//g, "")]?.text || item.path.replace(/\//g, "") }}
        </span>
      </template>
      <CreateMenu
        v-bind:menuMap="item.children"
        v-bind:cusKey="cusKey + '-' + index"
        :uiText="uiText[item.path.replace(/\//g, '')]?.children || {}"
        :itemClick="itemClick"
        :parent="parent + item.path + '/'"></CreateMenu>
    </el-sub-menu>
    <el-menu-item v-else :index="parent + item.path" @click="itemClick">
      <template #title>
        <router-link :to="parent + item.path">
          <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
          {{ uiText[item.path.replace(/\//g, "")]?.text || item.path.replace(/\//g, "") }}
        </router-link>
      </template>
    </el-menu-item>
  </template>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
defineProps({
  parent: {
    type: String,
    default: "",
  },
  menuMap: {
    type: Array<any>,
    require: true,
  },
  cusKey: {
    type: String,
    default: "1",
  },
  uiText: {
    type: Object,
    default: () => {
      return {};
    },
  },
  itemClick: {
    type: Function,
    default: () => {},
  },
});
</script>
