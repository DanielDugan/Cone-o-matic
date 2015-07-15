function main() {
var cone = CSG.cylinder 
({start: [0,-5,0], end: [0,8,0], radiusStart:4, radiusEnd:2, resolution: 16});
var inside = CSG.cylinder({start: [0,-5,0], end: [0,5,0], radiusStart:3,radiusEnd:0, resolution: 16});
cone = cone.subtract(inside);
return cone;
}