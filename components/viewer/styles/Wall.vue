<template>
  <el-form
    label-width="120px"
    class="form"
    onsubmit="onSubmit"
    v-model="state.form"
    @submit.native.prevent>
    <el-form-item label="边框颜色">
      <el-color-picker
        v-for="(item, index) in state.colors"
        :key="index"
        @change="handleChangeColor"
        v-model="state.colors[index]"
        show-alpha />
    </el-form-item>
    <el-form-item label="边框高度">
      <el-input-number v-model="state.height" :min="1" :max="100000" @change="handleChangeHeight" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { Cesium, layer, graphic } from "mars3d";
import { defineProps, reactive } from "vue";
import { getWallPositions } from "../../../utils/data";
import { getColorRamp } from "../../../utils/ramp";
const state = reactive({
  colors: ["rgba(0,255,255, 0.6)", "rgba(0, 0, 0,0)"],
  height: 20,
  form: {},
});
const { getWallLayer } = defineProps(["getWallLayer"]);
const wallLayer = getWallLayer() as layer.GraphicLayer;
function handleChangeColor() {
  setStyle();
}
function handleChangeHeight() {
  setStyle();
}
function setStyle() {
  const grap = new graphic.WallEntity({
    positions: getWallPositions(),
    style: {
      addHeight: -state.height,
      diffHeight: state.height,
      material: new Cesium.ImageMaterialProperty({
        transparent: true, //设置透明
        //Canvas
        image: getColorRamp(
          [
            { value: 0, color: state.colors[0] },
            { value: 1, color: state.colors[1] },
          ],
          true
        ) as HTMLCanvasElement,
      }),
    },
  });
  wallLayer.clear();
  wallLayer.addGraphic(grap);

  // wallLayer.graphics[0].positions = getWallPositions();
  // wallLayer.graphics[0].style = {
  //   addHeight: -state.height,
  //   diffHeight: state.height,
  //   material: new Cesium.ImageMaterialProperty({
  //     transparent: true, //设置透明
  //     //Canvas
  //     image: getColorRamp(
  //       [
  //         { value: 0, color: state.colors[0] },
  //         { value: 1, color: state.colors[1] },
  //       ],
  //       true
  //     ) as HTMLCanvasElement,
  //   }),
  // };
}
</script>
<style lang="scss" scoped>
.form {
  background: url("../assets/images/bg.jpg");
  background-position: center;
  background-size: cover;
  width: 300px;
  &:deep(.el-form-item__label) {
    color: #efefef;
  }
}
</style>
