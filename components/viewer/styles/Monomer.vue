<template>

</template>
<script setup lang="ts">
import { ElButton } from "element-plus";
import { Cesium, graphic, layer, Map, MaterialType } from "mars3d";
import { nextTick, onUnmounted } from "vue";
import customDraw from "../../../utils/customDraw";
import { getMonomerPositions } from "../../../utils/data";
import { guid } from "../../../utils/tool";
const { getMap } = defineProps(["getMap"]);
const map = getMap() as Map;
const data = getMonomerPositions();
const monomerLayer = new layer.GraphicLayer({});
const floors: any[] = [];
const handle = new Cesium.ScreenSpaceEventHandler(map.viewer.scene.canvas);
const draw = new customDraw(map.viewer);
let popup: graphic.Popup;
let pickedObject:
  | {
      id: string;
      primitive: Cesium.Primitive;
      color: Cesium.ColorGeometryInstanceAttribute;
      show: Cesium.ShowGeometryInstanceAttribute;
    }
  | undefined;
handle?.setInputAction(handleClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
map.addLayer(monomerLayer);
for (let i = 0; i < data.length; i++) {
  const element = data[i];
  for (let j = 0; j < element.attr.floors.length; j++) {
    const floor = element.attr.floors[j];
    addFloor(element.points, floor, element.attr.id);
  }
}

function handleClick(event: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
  const pick = map.viewer.scene.pick(event.position);

  if (Cesium.defined(pick) && Cesium.defined(pick.id)&&pick.primitive) {
    if (pick.id === pickedObject?.id) {
      return;
    } else {
      let pickPosition = map.viewer.scene.pickPosition(event.position);
      invertClassification(pick, pickPosition);
    }
  } else {
    if (pickedObject) {
      pickedObject.primitive.getGeometryInstanceAttributes(pickedObject.id).color =
        pickedObject.color;
      pickedObject = undefined;
    }
    if (popup) {
      monomerLayer.removeGraphic(popup);
    }
  }
}
function invertClassification(pick: any, pickPosition: Cesium.Cartesian3) {
  const attributes = pick.primitive.getGeometryInstanceAttributes(pick.id);
  if (pickedObject?.color) {
    pickedObject.primitive.getGeometryInstanceAttributes(pickedObject.id).color =
      pickedObject.color;
    pickedObject = undefined;
  }
  pickedObject = {
    id: pick.id,
    primitive: pick.primitive,
    color: attributes.color,
    show: attributes.show,
  };
  attributes.color = [255, 255, 255, 255];

  if (popup) {
    monomerLayer.removeGraphic(popup);
  }
  const popId = guid();
  popup = new graphic.Popup({
    position: pickPosition,
    style: {
      html: getPopupHtml(pick.id),
    },
    id: popId,
  });

  monomerLayer.addGraphic(popup);
}
function getPopupHtml(id: string) {
  const ids = id.split("*");
  for (let i = 0; i < data.length; i++) {
    if (data[i].attr.id === ids[0]) {
      for (let j = 0; j < data[i].attr.floors.length; j++) {
        const element = data[i].attr.floors[j];
        if (ids[1] === element.id) {
          return data[i].attr.name + "的" + element.name;
        }
      }
    }
  }
}
function addFloor(
  positions: Cesium.Cartesian3[],
  option: { name: string; bottom: number; top: number; id: string },
  parent: string
) {
  floors.push(
    map.viewer.scene.primitives.add(
      new Cesium.ClassificationPrimitive({
        releaseGeometryInstances: false,
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: {
              positions: positions,
              holes: [],
            },
            height: option.bottom,
            extrudedHeight: option.top,
            // perPositionHeight: true,
          }),
          //   modelMatrix: modelMatrix,
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromRandom({ alpha: 0.8 })
            ),
            show: new Cesium.ShowGeometryInstanceAttribute(true),
            // propup: option.name,
            // asdadasdasdasdasdasda: option.name,
          },
          id: parent + "*" + option.id,
        }),
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      })
    )
  );
}
onUnmounted(() => {
  floors.map((item) => {
    map.viewer.scene.primitives.remove(item);
  });
  floors.length = 0;
  map.removeLayer(monomerLayer);
  pickedObject = undefined;
  handle.destroy();
});
</script>
