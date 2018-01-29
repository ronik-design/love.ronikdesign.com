module.exports = class Lighting extends THREE.Object3D {
  constructor () {
    super();

    const primaryColor = 0x404040;
    const secondaryColor = 0xffffff;

    this.ambientLight = new THREE.AmbientLight(primaryColor, 2);

    this.pointLight1 = new THREE.PointLight(primaryColor, 1, 10);
    this.pointLight1.position.set(10, 10, -20);
    this.pointLight1.castShadow = true;

    this.pointLight1.shadow.mapSize.width = 1024;
    this.pointLight1.shadow.mapSize.height = 1024;
    this.pointLight1.shadow.camera.near = 0.5;
    this.pointLight1.shadow.camera.far = 500;

    this.pointLight2 = new THREE.PointLight(secondaryColor, 1, 50);
    this.pointLight2.position.set(-10, -10, -10);
    this.pointLight2.castShadow = true;

    this.pointLight2.shadow.mapSize.width = 1024;
    this.pointLight2.shadow.mapSize.height = 1024;
    this.pointLight2.shadow.camera.near = 0.5;
    this.pointLight2.shadow.camera.far = 500;

    this.add(this.ambientLight);
    this.add(this.pointLight1);
    this.add(this.pointLight2);
  }

  update(dt = 0) {
    // this.rotation.x += dt;
  }
};
