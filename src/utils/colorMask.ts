import { Cesium, effect } from "mars3d";
import { Map } from "mars3d";
// import { getRoadPositions } from "../../../utils/data";
export function colorMask(map: Map, holes: any[], color: Cesium.Color) {
  console.log(holes);
  
  const entity1 = new Cesium.Entity({
    id: Math.random().toString(),
    polygon: {
      hierarchy: {
        // 绘制的区域太大容易卡顿
        positions: Cesium.Cartesian3.fromDegreesArray([100, 0, 100, 89, 150, 89, 150, 0]),
        holes: holes as any,
      },
      material: Cesium.Color.BLACK.withAlpha(0.8),
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    },
  });

  const entitys: Cesium.Entity[] = [];
  map.entities.add(entity1);
  for (let i = 0; i < holes.length; i++) {
    const positions = holes[i].positions;
    const entity = new Cesium.Entity({
      id: Math.random().toString(),
      polygon: {
        hierarchy: {
          // 绘制的区域太大容易卡顿
          positions: positions,
        } as any,
        material: color,
        // perPositionHeight:true
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      },
      
    });
    entitys.push(entity);
    map.entities.add(entity);
  }

  let bloomEffect = new effect.BloomEffect();
  map.addEffect(bloomEffect);
  bloomEffect.stepSize = 5;
  const clear = () => {
    map.entities.remove(entity1);
    entitys.map((entity)=>{
      map.entities.remove(entity);
    });
    map.removeEffect(bloomEffect);
  };
  return { clear };
}
