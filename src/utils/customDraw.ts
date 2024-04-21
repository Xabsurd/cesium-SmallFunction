import { cloneDeep } from "lodash";
import { Cesium } from "mars3d";

export default class customDraw {
  //私有变量
  #viewer: Cesium.Viewer; //地图对象
  #granularity: number; //计算粒度
  #drawLayer: Cesium.CustomDataSource; //绘制的图层
  #handle: Cesium.ScreenSpaceEventHandler | undefined;
  /**
   *
   * @param _viewer Cesium.Viewer
   * @param _granularity 计算粒度,数字越大越精确,建议15-22区间，默认值:19
   */
  constructor(_viewer: Cesium.Viewer, _granularity: number = Math.PI / Math.pow(2, 19)) {
    if (!_viewer) {
      throw new Error("必要参数:_viewer: Cesium.Viewer");
    }
    this.#viewer = _viewer;
    this.#drawLayer = new Cesium.CustomDataSource("cutMeasureLayer");
    this.#granularity = _granularity;
    this.#viewer.dataSources.add(this.#drawLayer);
  }
  clearMeasure() {
    this.#drawLayer.entities.removeAll();
  }
  //创建一个点实体
  #createPoint(worldPosition: Cesium.Cartesian3) {
    return this.#drawLayer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 8,
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
  }
  Draw(cutHeight: number):Promise<Cesium.Cartesian3[]> {
    // this.#viewer.scene.globe.depthTestAgainstTerrain = true;
    this.#handle = new Cesium.ScreenSpaceEventHandler(this.#viewer.scene.canvas);
    return new Promise((reslove, reject) => {
      let activeShapePoints: Array<Cesium.Cartesian3> = [];
      let outputPoints: Array<Cesium.Cartesian3> = [];
      let activeShape: Cesium.Entity | null;
      let floatingPoint: Cesium.Entity | null;

      this.#handle?.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        let earthPosition = this.#viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          if (activeShapePoints.length === 0) {
            floatingPoint = this.#createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            
            let dynamicPositions = new Cesium.CallbackProperty(() => {
              return new Cesium.PolygonHierarchy(activeShapePoints);
            }, false);
            activeShape = this.#drawLayer.entities.add({
              //绘制动态图
              polygon: {
                //heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                hierarchy: dynamicPositions,
                material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7)),
                // heightReference:Cesium.HeightReference.NONE
                // shadows:Cesium.ShadowMode.RECEIVE_ONLY
                // perPositionHeight:true
              },
            });
          }
          outputPoints.push(cloneDeep(earthPosition));
          activeShapePoints.pop();
          activeShapePoints.push(earthPosition);
          activeShapePoints.push(earthPosition);
          this.#createPoint(earthPosition); //添加点
        }
        return false;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.#handle?.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (Cesium.defined(floatingPoint)) {
          var newPosition = this.#viewer.scene.pickPosition(event.endPosition);
          if (Cesium.defined(newPosition)) {
            if (floatingPoint?.position) {
              floatingPoint.position = newPosition as any;
            }
            // floatingPoint?.position.setValue(newPosition);
            // activeShapePoints.pop();
            // activeShapePoints.push(newPosition);
            activeShapePoints[activeShapePoints.length - 1] = newPosition;
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.#handle?.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        activeShapePoints.pop(); //去除最后一个动态点
        activeShapePoints.pop();
        outputPoints.pop();
        terminateShape();
        this.#viewer.trackedEntity = undefined;
        return false;
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      this.#handle?.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        terminateShape();
        this.#viewer.trackedEntity = undefined;
        return false;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      
      //绘制最终几何
      const terminateShape = () => {
        
        this.#drawLayer.entities.add({
          polygon: {
            hierarchy: activeShapePoints as any, //getAllHeight(activeShapePoints),
            // extrudedHeight: cutHeight,
            // perPositionHeight: true,
            material: Cesium.Color.CYAN.withAlpha(0.5),
            outline: true,
            closeTop: false,
            closeBottom: false,
            outlineColor: Cesium.Color.WHITE,
          },
        });
        this.#viewer.entities.remove(floatingPoint as Cesium.Entity); //去除动态点图形（当前鼠标点）
        this.#viewer.entities.remove(activeShape as Cesium.Entity); //去除动态图形
        floatingPoint = null;
        activeShape = null;
        this.#handle?.destroy();
        reslove(outputPoints);
       

        activeShapePoints = [];
        outputPoints = [];
        this.#handle?.destroy();
      };
      //获取所有点的经纬度和实际高度并转换成笛卡尔坐标
      const getAllHeight = (points: Array<Cesium.Cartesian3>) => {
        var hp = [];
        for (let i = 0; i < points.length; i++) {
          const cartographic = Cesium.Cartographic.fromCartesian(points[i]);
          hp.push(
            Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              this.#viewer.scene.globe.getHeight(cartographic)
            )
          );
        }
        return hp;
      };
    });
  }
}

function outputGEO(points: Cesium.Cartesian3[]) {
  let str = "";
  for (let i = 0; i < points.length; i++) {
    const element = points[i];
    str += `new Cesium.Cartesian3(${element.x}, ${element.y}, ${element.z}),\n`;
  }
  console.log(str);
}
