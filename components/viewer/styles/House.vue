<template></template>
<script setup lang="ts">
import { Cesium, layer, graphic, Map, MaterialType } from "mars3d";
import { onUnmounted } from "vue";
import { getHousePosition } from "../../../utils/data";
import { getColorRamp } from "../../../utils/ramp";
import { moveUp, polygonFilter } from "../../../utils/tool";
const { getMap } = defineProps(["getMap"]);
const map = getMap() as Map;
const housePosition = getHousePosition();
const highlightLayer = new layer.GraphicLayer({
  name: "房子墙体",
});
map.addLayer(highlightLayer);
const points = housePosition.map((item) => {
  return {
    positions: item.points,
  };
});
//材质
const materia = new Cesium.ImageMaterialProperty({
  transparent: true, //设置透明
  //Canvas
  image: getColorRamp(
    [
      { value: 1, color: "rgba(0,255,255, 0)" },
      { value: 0, color: "rgba(0,255,255,0.6)" },
    ],
    true
  ) as HTMLCanvasElement,
});
//遮罩
const entity1 = new Cesium.Entity({
  id: "13",
  polygon: {
    hierarchy: {
      // 绘制的区域太大容易卡顿
      positions: Cesium.Cartesian3.fromDegreesArray([100, 0, 100, 89, 150, 89, 150, 0]),
      // holes是图形内需要挖空的区域
      holes: points as any,
    },
    material: Cesium.Color.BLACK.withAlpha(0.8),
    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
  },
});

map.entities.add(entity1);
const handle = new Cesium.ScreenSpaceEventHandler(map.viewer.scene.canvas);
handle?.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
  let earthPosition = map.viewer.scene.pickPosition(event.position);
  for (let i = 0; i < housePosition.length; i++) {
    const element = housePosition[i];
    const inner = polygonFilter(earthPosition, element.points);
    if (inner) {
      
      highlight(element.points,element.attr.prop);
      return;
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
function highlight(points: Cesium.Cartesian3[],popup:string) {
  highlightLayer.clear();
  const _popup= new graphic.Popup({
    position:points[0],
    style:{
      html:popup
    }
  });
  const grap = new graphic.WallEntity({
    positions: points,
    style: {
      addHeight: 10,
      diffHeight: -10,
      material: materia,
    },
  });
  highlightLayer.addGraphic(grap);
  highlightLayer.addGraphic(_popup);
  map.flyTo(grap.entity, {
    duration: 2,
  });
  //   const max = points.map(() => {
  //     return 60;
  //   });
  //   const wall = map.viewer.entities.add({
  //     wall: {
  //       positions: points,
  //       //   maximumHeights: max,
  //       minimumHeights: max,
  //       material: new Cesium.ImageMaterialProperty({
  //         transparent: true, //设置透明
  //         //Canvas
  //         image: getColorRamp(
  //           [
  //             { value: 0, color: "rgba(73, 234, 255, 0)" },
  //             { value: 0.5, color: "rgba(73, 234, 255, 0)" },
  //             { value: 1, color: "rgba(73, 234, 255, 0.6)" },
  //           ],
  //           true
  //         ) as HTMLCanvasElement,
  //       }),
  //     },
  //   });
}
onUnmounted(() => {
  map.entities.remove(entity1);
  map.removeLayer(highlightLayer);
  highlightLayer.destroy();
  handle.isDestroyed();
});
</script>
