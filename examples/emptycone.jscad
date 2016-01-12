// title      : e-NABLE Cone-o-matic
// authors     : Daniel R. Dugan, Kyle Bissell 
//               and Jesse Olson
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
  cone = makeMountHoleNubs(cone,params);
  cone = hollowOutInside(cone, params);
  cone = addSocket(cone,params);
  cone = addElbow(cone, params);
  cone = addCoverToSocket(cone,params);
  cone = makeMountHoles(cone, params);
  //cone = addCoverToMountHoles(cone, params);
  return cone;
}

var mountHoleCircumference = 4;
var socketCircumference = 13;

function getParameterDefinitions() {
  return [{
    name: 'length',
    caption: 'Arm Length:',
    type: 'float',
    default: 100
  }, {
    name: 'c1',
    caption: 'Back Circumference (Closest to elbow):',
    type: 'float',
    default: 40
  }, {
    name: 'c2',
    caption: 'Front Circumference (Closest to hand):',
    type: 'float',
    default: 25
  }, {
    name: 'resolution',
    caption: 'resolution',
    type: 'int',
    default: 64
  }, {
    name: 'thickness',
    caption: 'thickness',
    type: 'float',
    default: 3
  }];
}



function hollowOutInside(cone, params) {
  var inside = CSG.cylinder({
    start: [0, params.length+1, 0],
    end: [0, params.thickness, 0],
    radiusStart:    params.c1-params.thickness,                
    radiusEnd:      params.c2-params.thickness,
    resolution: params.resolution
  });
  cone = cone.subtract(inside);
  return cone;
}

function addSocket(cone,params){
    var socketHole = CSG.cylinder({
    start: [0,0, 0],
    end: [0, params.thickness, 0],
    radius: socketCircumference / 2,
    resolution: params.resolution
  }); 
  cone = cone.subtract(socketHole);
    return cone;
}

function addElbow(cone, params) {
  var elbow = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, params.c1],
    radius: params.c1 + 1,
    resolution: params.resolution
  });
  elbow = elbow.rotateX(-22);
  elbow = elbow.translate([0, params.length, 0]);

  cone = cone.subtract(elbow);
  return cone;
}

function addCoverToSocket(cone,params) {
  var cover = torus({
    ri: 1,
    ro: 3,
    fni: 4,
    fno: 6,
    roti:45
  });
  cover = cover.rotateX(90);
  cover = cover.scale([
      .2*socketCircumference,
      params.thickness,
      .2*socketCircumference]);
  //cover = cover.translate([0,.1*socketCircumference,0]);
  cone = union(cone, cover);
    cone = cone.subtract(cover);
    return cone;
}

function makeMountHoles(cone, params) {
  var mountHole = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, params.c1 - params.c2, 0],
    radius: mountHoleCircumference / 2,
    center: true,
    resolution: params.resolution
  });

  mountHole = mountHole.rotateZ(90);
  mountHole = mountHole.translate([
    params.c1,
    params.length -
    mountHoleCircumference,
    0-mountHoleCircumference
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

// Function to make a flattened rise where each mounting hole will be subtracted.
// There can be some excess geometry that we don't want in the final model, so this
// should be called with the solid cone just after it's made.  There is some cleanup
// to ensure that the nubs don't extend beyond the cone bounds.  Further subtractive
// work for the final model will take care of the rest.
function makeMountHoleNubs(cone, params) {
  var mountHoleNubPercentage = 2;//multiplier for flat lip around mount hole. Should be > 1
  var lipTopDiameter = mountHoleCircumference*mountHoleNubPercentage;
  var lipBottomDiameter = lipTopDiameter+(params.thickness*2);
//   Make a sloped cylinder with ~45 degree slope for printing
//   Rotate and translate to first mount hole position in one call
  var mountHoleLip = cylinder({
      d1:lipBottomDiameter,
      d2:lipTopDiameter,
      h:params.thickness,
      center: false
  }).rotateY(90).translate([
    params.c1-params.thickness,
    params.length -
    mountHoleCircumference,
    0-mountHoleCircumference
  ]);
  //Attatch nub and mirrored nub to cone
  cone = cone.union(mountHoleLip);
  cone = cone.union(mountHoleLip.mirroredX());
  //Translate nub for second hole
  mountHoleLip = mountHoleLip.translate([
    0,
    -2 * mountHoleCircumference,
    0
  ]);
  //Attatch second nub and mirrored nub to cone
  cone = cone.union(mountHoleLip);
  cone = cone.union(mountHoleLip.mirroredX());
  
  //Make a cylinder of arbitrary size (20) with the same resolution and dimensions
  //of the elbow end of cone.  Translate to the back of the cone.
  var ensureBoundsCylinder = CSG.cylinder({
    start: [0, 20, 0],
    end: [0, 0, 0],
    radiusStart: params.c1,
    radiusEnd: params.c1,
    resolution: params.resolution
  }).translate([
      0,
      params.length,
      0
  ]);
  //Subtract bounding cylinder to ensure no nub geometry exists beyond cone bounds
  cone = cone.subtract(ensureBoundsCylinder);
  //Return augmented cone
  return cone
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
    0-mountHoleCircumference
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
