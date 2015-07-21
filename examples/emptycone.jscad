function main(params) {
 var cone = CSG.cylinder
    ({start: [0,params.length +1,0], end: [0,0,0], radiusStart:params.c1, radiusEnd:params.c2, resolution: 16});
var inside = CSG.cylinder({start: [0,params.length +1,0], end: [0,0,0], radiusStart:params.c1 - .5,radiusEnd:1, resolution: 16});
var elbow = CSG.sphere   ({center: [0, params.length, 3], radius: params.c1-1, resolution: 32
});
cone = cone.subtract(inside);
cone = cone.subtract(elbow);
return cone;
  }

function getParameterDefinitions() {
  return [
    { name: 'length', caption: 'Arm Length:', type: 'float', default: 15 },
    { name: 'c1', caption: 'Back Circumference (Closest to elbow):', type: 'float', default: 7 },
    { name: 'c2', caption: 'Front Circumference (Closest to hand):', type: 'float', default: 4 },
    
    
  ];
}
