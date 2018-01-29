module.exports = class Lighting extends THREE.Object3D {
  constructor () {
    super();

    const primaryColor = 0x404040;
    const secondaryColor = 0xffffff;

    const ambientLight = new THREE.AmbientLight(primaryColor, 2);

    const pointLight = new THREE.PointLight(primaryColor, 1, 400);
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 500;

    this.add(ambientLight);
    this.add(pointLight);
  }
};
