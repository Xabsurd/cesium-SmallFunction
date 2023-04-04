<template>
  <ElButton @click="startDraw">绘制</ElButton>
  <div class="editer">
    <el-table :data="editData" style="width: 100%" border>
      <el-table-column label="名称">
        <template #default="scope">
          <el-input v-model="scope.row.name" @change="handleChangeName(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="高度" width="180">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.height"
            :min="1"
            :max="100000"
            @change="handleChangeHeight(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <ElButton @click="saveData">保存</ElButton>
    <ElButton @click="clearData">清除数据</ElButton>
  </div>
</template>
<script setup lang="ts">
import { Cesium, graphic, Map, layer } from "mars3d";
import { onUnmounted, ref } from "vue";
import customDraw from "../../../utils/customDraw";
import { guid } from "../../../utils/tool";
const { getMap } = defineProps(["getMap"]);
const editData = ref([]) as any;
let editId = "";
const map = getMap() as Map;
const draw = new customDraw(map.viewer);
let floors: Cesium.Primitive[] = [];
let entitys: Cesium.Entity[] = [];
const baseData = localStorage.getItem("CustomMonomer")
  ? JSON.parse(localStorage.getItem("CustomMonomer") as string)
  : [];
for (let i = 0; i < baseData.length; i++) {
  const element = baseData[i];
  pushMonomer(element, true);
}
let pickedObject:
  | {
      id: string;
      entity: Cesium.Entity;
      color: any;
    }
  | undefined;
const handle = new Cesium.ScreenSpaceEventHandler(map.viewer.scene.canvas);
handle?.setInputAction(handleClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
let popup: graphic.Popup;
const monomerLayer = new layer.GraphicLayer({});
map.addLayer(monomerLayer);
function startDraw() {
  draw.clearMeasure();
  draw.Draw(100).then((points) => {
    const data = {
      attr: {
        name: "一个房子",
        id: guid(),
        floors: [
          //   { name: "1楼", bottom: 15, top: 20, id: guid() },
          //   { name: "2楼", bottom: 20, top: 25, id: guid() },
          //   { name: "3楼", bottom: 25, top: 30, id: guid() },
          //   { name: "4楼", bottom: 30, top: 35, id: guid() },
          //   { name: "5楼", bottom: 35, top: 40, id: guid() },
        ] as any[],
      },
      points: points,
    };
    let bottom = 1000000;
    for (let i = 0; i < points.length; i++) {
      const element = Cesium.Cartographic.fromCartesian(points[i]);
      if (element.height < bottom) {
        bottom = element.height;
      }
    }
    for (let i = 0; i < 5; i++) {
      data.attr.floors.push({
        name: i + 1 + "楼",
        bottom: bottom + 5 * i,
        top: bottom + 5 * i + 5,
        id: guid(),
        height: 5,
      });
    }
    baseData.push(data);
    pushMonomer(data, true);
    editData.value = [];
    data.attr.floors.forEach((item) => {
      editData.value.push({ id: item.id, height: 5, name: item.name });
    });
    editId = data.attr.id;
    draw.clearMeasure();
  });
}
function pushMonomer(data: any, isEntity: boolean) {
  for (let i = 0; i < data.attr.floors.length; i++) {
    const element = data.attr.floors[i];
    addFloor(data.points, element, data.attr.id, isEntity);
  }
}
function addFloor(
  positions: Cesium.Cartesian3[],
  option: { name: string; bottom: number; top: number; id: string },
  parent: string,
  isEntity: boolean
) {
  if (isEntity) {
    entitys.push(
      map.viewer.entities.add({
        polygon: {
          hierarchy: positions as any,
          material: Cesium.Color.fromRandom({ alpha: 0.8 }),
          extrudedHeight: option.top,
          height: option.bottom,
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        },
        id: parent + "*" + option.id,
      })
    );
  } else {
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
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.fromRandom({ alpha: 0.8 })
              ),
              show: new Cesium.ShowGeometryInstanceAttribute(true),
            },
            id: parent + "*" + option.id,
          }),
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        })
      )
    );
  }
}
function handleClick(event: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
  const pick = map.viewer.scene.pick(event.position);
  if (Cesium.defined(pick) && Cesium.defined(pick.id)) {
    if (pick.id.id === pickedObject?.id) {
      return;
    } else {
      let pickPosition = map.viewer.scene.pickPosition(event.position);
      invertClassification(pick.id, pickPosition);
    }
  } else {
    if (pickedObject && pickedObject.entity.polygon) {
      pickedObject.entity.polygon.material = pickedObject.color as any;
      pickedObject = undefined;
    }
    if (popup) {
      monomerLayer.removeGraphic(popup);
    }
  }
}
function invertClassification(entity: Cesium.Entity, pickPosition: Cesium.Cartesian3) {
  if (pickedObject && pickedObject.entity.polygon) {
    pickedObject.entity.polygon.material = pickedObject.color as any;
    pickedObject = undefined;
  }
  pickedObject = {
    id: entity.id,
    entity: entity,
    color: entity?.polygon?.material || Cesium.Color.fromRandom({ alpha: 0.8 }),
  };
  if (entity.polygon) {
    entity.polygon.material = [255, 255, 255, 255] as any;
  }

  if (popup) {
    monomerLayer.removeGraphic(popup);
  }
  const popId = guid();
  popup = new graphic.Popup({
    position: pickPosition,
    style: {
      html: getPopupHtml(entity.id),
    },
    id: popId,
  });

  monomerLayer.addGraphic(popup);
}
function getPopupHtml(id: string) {
  const ids = id.split("*");
  for (let i = 0; i < baseData.length; i++) {
    if (baseData[i].attr.id === ids[0]) {
      editData.value = baseData[i].attr.floors;
      editId = baseData[i].attr.id;
      for (let j = 0; j < baseData[i].attr.floors.length; j++) {
        const element = baseData[i].attr.floors[j];
        if (ids[1] === element.id) {
          return baseData[i].attr.name + "的" + element.name;
        }
      }
    }
  }
}
function handleChangeName(row: any) {
  for (let i = 0; i < baseData.length; i++) {
    const element = baseData[i];
    if (element.attr.id === editId) {
      for (let j = 0; j < element.attr.floors.length; j++) {
        const floor = element.attr.floors[j];
        if (row.id === floor.id) {
          floor.name = row.name;
          return;
        }
      }
    }
  }
}
function handleChangeHeight(row: any) {
  for (let i = 0; i < baseData.length; i++) {
    const element = baseData[i];
    if (element.attr.id === editId) {
      let cha = 0;
      for (let j = 0; j < element.attr.floors.length; j++) {
        const floor = element.attr.floors[j];
        if (row.id === floor.id) {
          cha = row.height - floor.top + floor.bottom;
          floor.top += cha;
          changeEntityById(editId + "*" + floor.id, floor, element.points);
        } else {
          if (cha !== 0) {
            floor.top += cha;
            floor.bottom += cha;
            changeEntityById(editId + "*" + floor.id, floor, element.points);
          }
        }
      }
      return;
    }
  }
}
function changeEntityById(id: string, option: any, points: Cesium.Cartesian3[]) {
  console.log(id);
  for (let i = 0; i < entitys.length; i++) {
    const element = entitys[i];

    if (id === element.id && element.polygon) {
      //   console.log(option);
      //   element.polygon = new Cesium.PolygonGraphics({
      //     hierarchy: points as any,
      //     material: Cesium.Color.fromRandom({ alpha: 0.8 }),
      //     extrudedHeight: option.top,
      //     height: option.bottom,
      //     classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      //   });
      element.polygon.height = option.bottom;
      element.polygon.extrudedHeight = option.top;
    }
  }
}
function removeEntityById(id: string) {
  for (let i = 0; i < entitys.length; i++) {
    const element = entitys[i];
    if (id === element.id) {
      entitys.splice(i, 1);
      map.viewer.entities.removeById(element.id);
    }
  }
}
function saveData() {
  localStorage.setItem("CustomMonomer", JSON.stringify(baseData));
  editData.value = [];
  editId = "";
}
function clearData() {
  clearThis();
  localStorage.setItem("CustomMonomer", "");
}
function clearThis() {
  baseData.length = 0;
  floors.map((item) => {
    map.viewer.scene.primitives.remove(item);
  });
  floors.length = 0;
  entitys.map((item) => {
    map.viewer.entities.remove(item);
  });
  entitys.length = 0;
  editData.value = [];
  editId = "";
}
onUnmounted(() => {
  clearThis();
  map.removeLayer(monomerLayer);
});
</script>

<style scoped lang="scss">
.editer {
  position: absolute;
  top: 0;
  right: 0px;
  width: 400px;
  height: 100%;
  background: #fff;
}
</style>
