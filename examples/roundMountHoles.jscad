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
  return color(params.color,cone);
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
  }, {
    name: 'color',
    type: 'choice',
    values: ["black",
      "silver",
      "gray",
      "white",
      "maroon",
      "red",
      "purple",
      "fuchsia",
      "green",
      "lime",
      "olive",
      "yellow",
      "navy",
      "blue",
      "teal",
      "aqua",
      "aliceblue",
      "antiquewhite",
      "aqua",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "black",
      "blanchedalmond",
      "blue",
      "blueviolet",
      "brown",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "cyan",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgreen",
      "darkgrey",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkslategrey",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dimgrey",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "fuchsia",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "gray",
      "green",
      "greenyellow",
      "grey",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgray",
      "lightgreen",
      "lightgrey",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightslategrey",
      "lightsteelblue",
      "lightyellow",
      "lime",
      "limegreen",
      "linen",
      "magenta",
      "maroon",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "navy",
      "oldlace",
      "olive",
      "olivedrab",
      "orange",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "pink",
      "plum",
      "powderblue",
      "purple",
      "red",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "silver",
      "skyblue",
      "slateblue",
      "slategray",
      "slategrey",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "teal",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "white",
      "whitesmoke",
      "yellow",
      "yellowgreen"
    ],
    caption: 'Color:',
    initial: "hotpink",
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
