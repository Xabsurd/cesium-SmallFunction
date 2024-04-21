export type RampType = {
  value: number;
  color: string;
};
export function getColorRamp(elevationRamp: RampType[], isVertical = true) {
  var ramp = document.createElement("canvas");
  ramp.width =100;
  ramp.height =100;
  var ctx = ramp.getContext("2d");
  if (!ctx) {
    return null;
  }
  var grd = isVertical
    ? ctx.createLinearGradient(0, 0, 0, 100)
    : ctx.createLinearGradient(0, 0, 100, 0);
  for (let i = 0; i < elevationRamp.length; i++) {
    const element = elevationRamp[i];
    grd.addColorStop(element.value, element.color);
  }
  // grd.addColorStop(values[0], '#000000'); //black
  // grd.addColorStop(values[1], '#2747E0'); //blue
  // grd.addColorStop(values[2], '#D33B7D'); //pink
  // grd.addColorStop(values[3], '#D33038'); //red
  // grd.addColorStop(values[4], '#FF9742'); //orange
  // grd.addColorStop(values[5], '#ffd700'); //yellow
  // grd.addColorStop(values[6], '#ffffff'); //white

  ctx.fillStyle = grd;
  if (isVertical) ctx.fillRect(0, 0, 100, 100);
  else ctx.fillRect(0, 0, 100, 100);
  return ramp;
}
export function getColorRamp1(elevationRamp: any, isVertical = true) {
  var ramp = document.createElement("canvas");
  ramp.width = isVertical ? 1 : 100;
  ramp.height = isVertical ? 100 : 1;
  var ctx = ramp.getContext("2d");
  if (!ctx) {
    return null;
  }
  var values = elevationRamp;
  var grd = isVertical
    ? ctx.createLinearGradient(0, 0, 0, 100)
    : ctx.createLinearGradient(0, 0, 100, 0);
  grd.addColorStop(values[0], "#000000"); //black
  grd.addColorStop(values[1], "#2747E0"); //blue
  grd.addColorStop(values[2], "#D33B7D"); //pink
  grd.addColorStop(values[3], "#D33038"); //red
  grd.addColorStop(values[4], "#FF9742"); //orange
  grd.addColorStop(values[5], "#ffd700"); //yellow
  grd.addColorStop(values[6], "#ffffff"); //white

  ctx.fillStyle = grd;
  if (isVertical) ctx.fillRect(0, 0, 1, 100);
  else ctx.fillRect(0, 0, 100, 1);
  
  return ramp;
}
