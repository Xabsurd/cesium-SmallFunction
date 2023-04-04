import { Cesium } from "mars3d";

/*
	checkPoint: [latitude, longitude] 需要计算的点位
	polygonPoints: [ [latitude, longitude],  [latitude, longitude],  [latitude, longitude], [latitude, longitude], [latitude, longitude] ] 标绘区域的点位数值，，
*/
export function polygonFilter(_checkPoint: Cesium.Cartesian3, _polygonPoints: Cesium.Cartesian3[]) {
  const polygonPoints = Cartesian3ToCartographic(_polygonPoints);
  const checkPoint = Cesium.Cartographic.fromCartesian(_checkPoint);
  let counter = 0;
  let i;
  let xinters;
  let p1, p2;
  let pointCount = polygonPoints.length;
  p1 = polygonPoints[0];

  for (i = 1; i <= pointCount; i++) {
    p2 = polygonPoints[i % pointCount];
    if (
      checkPoint.latitude > Math.min(p1.latitude, p2.latitude) &&
      checkPoint.latitude <= Math.max(p1.latitude, p2.latitude)
    ) {
      if (checkPoint.longitude <= Math.max(p1.longitude, p2.longitude)) {
        if (p1.latitude != p2.latitude) {
          xinters =
            ((checkPoint.latitude - p1.latitude) * (p2.longitude - p1.longitude)) /
              (p2.latitude - p1.latitude) +
            p1.longitude;
          if (p1.longitude == p2.longitude || checkPoint.longitude <= xinters) {
            counter++;
          }
        }
      }
    }
    p1 = p2;
  }
  if (counter % 2 == 0) {
    return false;
  } else {
    return true;
  }
}

function Cartesian3ToCartographic(positions: Cesium.Cartesian3[]) {
  const data = [];
  for (let i = 0; i < positions.length; i++) {
    const element = positions[i];
    data.push(Cesium.Cartographic.fromCartesian(element));
  }
  return data;
}

export function outputGEO(points: Cesium.Cartesian3[]) {
  let str = "";
  for (let i = 0; i < points.length; i++) {
    const element = points[i];
    str += `new Cesium.Cartesian3(${element.x}, ${element.y}, ${element.z}),\n`;
  }
  console.log(str);
}
export function moveUp(positions: Cesium.Cartesian3[],height:number) {
    const data = [];
    for (let i = 0; i < positions.length; i++) {
        const element = positions[i];
        const g = Cesium.Cartographic.fromCartesian(element);
        g.height+=height;
        data.push(Cesium.Cartesian3.fromRadians(g.longitude,g.latitude,g.height));
    }
    outputGEO(data);
    return data;
}
export function guid() {
  return 'xxxxxxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })+"-"+new Date().getTime().toString(16);
}