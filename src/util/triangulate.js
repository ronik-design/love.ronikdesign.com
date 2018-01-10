const THREE = require('three');

module.exports = function triangleArea() {
  const vector1 = new THREE.Vector3();
  const vector2 = new THREE.Vector3();

  return function (vectorA, vectorB, vectorC) {
    vector1.subVectors(vectorB, vectorA);
    vector2.subVectors(vectorC, vectorA);
    vector1.cross(vector2);

    return 0.5 * vector1.length();
  };
}