// title      : e-NABLE COne-o-matic
// author     : Daniel R. Dugan and Kyle Bissell
// license    : MIT License
// revision   : 0.003
// tags       : Cone, Monette Socket
// file       : logo.jscad

function main(params) {
  var cone = CSG.cylinder({
    start: [0, params.length + 1, 0],
    end: [0, 0, 0],
    radiusStart: params.c1,
    radiusEnd: params.c2,
    resolution: params.resolution
  });
  cone = hollowOutInside(cone, params);
  cone = addElbow(cone, params);
  cone = addCoverToSocket(cone);
  cone = makeMountHoles(cone, params);
  cone = addCoverToMountHoles(cone, params);
  return cone;
}

var mountHoleCircumference = 1;
var socketCircumference = 1;

function getParameterDefinitions() {
  return [{
    name: 'length',
    caption: 'Arm Length:',
    type: 'float',
    default: 15
  }, {
    name: 'c1',
    caption: 'Back Circumference (Closest to elbow):',
    type: 'float',
    default: 7
  }, {
    name: 'c2',
    caption: 'Front Circumference (Closest to hand):',
    type: 'float',
    default: 4
  }, {
    name: 'resolution',
    caption: 'resolution',
    type: 'int',
    default: 16
  }];
}



function hollowOutInside(cone, params) {
  var inside = CSG.cylinder({
    start: [0, params.length + 1, 0],
    end: [0, 0, 0],
    radiusStart: params.c1 - .5,
    radiusEnd: socketCircumference,
    resolution: params.resolution
  });
  cone = cone.subtract(inside);
  return cone;
}

function addElbow(cone, params) {
  var elbow = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, params.c1],
    radius: params.c1 - 1,
    resolution: params.resolution
  });
  elbow = elbow.rotateX(-22);
  elbow = elbow.translate([0, params.length, 0]);

  cone = cone.subtract(elbow);
  return cone;
}

function addCoverToSocket(cone) {
  var cover = torus({
    fni: 4,
    fno: 6,
    roti: 45
  });
  cover = cover.rotateX(90);
  cover = cover.scale(.5*socketCircumference);

  cone = union(cone, cover);
  return cone;
}

function makeMountHoles(cone, params) {
  var mountHole = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, params.c1 - params.c2 + 1, 0],
    radius: mountHoleCircumference / 2,
    center: true,
    resolution: params.resolution
  });

  mountHole = mountHole.rotateZ(90);
  mountHole = mountHole.translate([
    params.c1,
    params.length -
    mountHoleCircumference,
    0
  ]);
  cone = cone.subtract(mountHole);
  cone = cone.subtract(mountHole.mirroredX());

  mountHole = mountHole.translate([
    0, -2 * mountHoleCircumference,
    0
  ]);

  cone = cone.subtract(mountHole);
  cone = cone.subtract(mountHole.mirroredX());
  return cone;
}

function addCoverToMountHoles(cone, params) {
  var mountHoleCover = torus({
    ro: 0.75 * mountHoleCircumference,
    ri: .05 * mountHoleCircumference

  });
  mountHoleCover = mountHoleCover.rotateY(86);
  mountHoleCover = mountHoleCover.rotateX(90);
  mountHoleCover = mountHoleCover.scale([3, 1, 1]);
  mountHoleCover = mountHoleCover.translate([
    params.c1 - .35 * mountHoleCircumference,
    params.length - mountHoleCircumference,
    0
  ]);
  cone = union(cone,
    mountHoleCover,
    mountHoleCover.mirroredX());
  mountHoleCover = mountHoleCover.translate([-.35 * mountHoleCircumference, -2 * mountHoleCircumference,
    0
  ]);
  cone = union(cone,
    mountHoleCover,
    mountHoleCover.mirroredX());
  return cone;
}