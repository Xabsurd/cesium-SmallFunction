<template>
  <section>
    <aside>
      <Sider></Sider>
    </aside>
    <main>
      <div ref="mapdom" id="mapdom"></div>
      <div id="route-view" v-if="state.loadEnd">
        <RouterView :getMap="getMap" :getWallLayer="getWallLayer"></RouterView>
      </div>
    </main>
  </section>
  <!-- <img :src="getColorRamp1([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true)"> -->

  <article></article>
</template>
<script setup lang="ts">
import "mars3d/dist/mars3d.css";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
import { Cesium, Map, layer, graphic, effect } from "mars3d";
import { onMounted, reactive, ref } from "vue";
import Sider from "./Sider.vue";
import { getColorRamp } from "../utils/ramp";
import { getWallPositions } from "../utils/data";
const state = reactive({
  loadEnd: false,
});
let map: Map;
let mapdom = ref(null);
let tiles3dLayer: layer.TilesetLayer;
let wallLayer: layer.GraphicLayer;
onMounted(() => {
  // return;
  map = new Map(mapdom.value as any, {
    scene: {
      center: {
        lat: 30.054604,
        lng: 108.885436,
        alt: 17036414,
        heading: 0,
        pitch: -90,
      },
      showSun: false,
      showMoon: false,
      showSkyBox: false,
      showSkyAtmosphere: false,
      fog: false,
      backgroundColor: "#1e1e1e", // 天空背景色
      globe: {
        baseColor: "#1e1e1e", // 地球地面背景色
        // showGroundAtmosphere: false,
        // enableLighting: false,
      },
    },
    control: {
      baseLayerPicker: false,
    },
    terrain: { show: false, url: "" },
    basemaps: [],
    // terrain: {
    //   url: "//data.mars3d.cn/terrain",
    //   show: true,
    // },
    // basemaps: [
    //   {
    //     name: "天地图影像",
    //     icon: "img/basemaps/tdt_img.png",
    //     type: "tdt",
    //     layer: "img_d",
    //     show: true,
    //   } as any,
    // ],
    layers: [],
  });
  // map.viewer.scene.globe.depthTestAgainstTerrain = true;
  add3Dtile();
  addWall();

  state.loadEnd = true;
});
function getMap() {
  return map;
}
function getWallLayer() {
  return wallLayer;
}
function add3Dtile() {
  tiles3dLayer = new layer.TilesetLayer({
    name: "文庙",
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 80.6 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    center: {
      lat: 33.589536,
      lng: 119.032216,
      alt: 145.08,
      heading: 3.1,
      pitch: -22.9,
      roll: 0,
    },
    flyTo: true,
  });
  map.addLayer(tiles3dLayer);
}
function addWall() {
  wallLayer = new layer.GeoJsonLayer({
    name: "墙体",
  });

  //   for (let i = 0; i < positions.length; i++) {
  //     const point = Cesium.Cartographic.fromCartesian(positions[i]);
  //     point.height += 11;
  //     positions[i] = Cesium.Cartesian3.fromRadians(point.longitude, point.latitude, point.height);
  //     console.log(`new Cesium.Cartesian3(${positions[i].x},${positions[i].y},${positions[i].z})`);
  //   }
  //   //   console.log(JSON.stringify(positions));

  const grap = new graphic.WallEntity({
    positions: getWallPositions(),
    style: {
      addHeight: -20,
      diffHeight: 20, // 墙高
      material: new Cesium.ImageMaterialProperty({
        transparent: true, //设置透明
        //Canvas
        image: getColorRamp(
          [
            { value: 1, color: "rgba(0,255,255, 0)" },
            { value: 0, color: "rgba(0,255,255,0.6)" },
          ],
          true
        ) as HTMLCanvasElement,
      }),
    },
  });
  wallLayer.addGraphic(grap);
  map.addLayer(wallLayer);

}
</script>
<style lang="scss" scoped>
section {
  width: 100vw;
  height: 100vh;
  position: relative;

  #mapdom,
  #route-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  #route-view {
    pointer-events: none;
    > :deep(*) {
      pointer-events: all;
    }
  }
  aside {
    width: 220px;
    height: 100%;
    transition: transform 0.3s ease-out;
  }
  main {
    position: absolute;
    left: 220px;
    top: 0;
    bottom: 0;
    right: 0;
    transition: left 0.3s ease-out;
    overflow: hidden;
  }
}
</style>
