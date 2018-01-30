const animate = require('@jam3/gsap-promise');

module.exports = class Lighting extends THREE.Object3D {
  constructor () {
    super();

    const primaryColor = 0x404040;
    const secondaryColor = 0xffffff;

    this.ambientLight = new THREE.AmbientLight(primaryColor, 0);

    this.pointLight1 = new THREE.PointLight(primaryColor, 0, 10);
    this.pointLight1.position.set(10, 10, -20);
    this.pointLight1.castShadow = true;

    this.pointLight1.shadow.mapSize.width = 1024;
    this.pointLight1.shadow.mapSize.height = 1024;
    this.pointLight1.shadow.camera.near = 0.5;
    this.pointLight1.shadow.camera.far = 500;

    this.pointLight2 = new THREE.PointLight(secondaryColor, 0, 50);
    this.pointLight2.position.set(2, 1, 2);
    this.pointLight2.castShadow = true;

    this.pointLight2.shadow.mapSize.width = 1024;
    this.pointLight2.shadow.mapSize.height = 1024;
    this.pointLight2.shadow.camera.near = 0.5;
    this.pointLight2.shadow.camera.far = 500;

    this.add(this.ambientLight);
    this.add(this.pointLight1);
    this.add(this.pointLight2);
  }

  animateIn () {
    animate.fromTo(this.pointLight1, 5.0, {
      intensity: 0
    }, {
      intensity: 2,
      ease: Expo.easeOut,
    });
    animate.fromTo(this.pointLight2, 5.0, {
      intensity: 0
    }, {
      intensity: 1,
      ease: Expo.easeOut
    });
    animate.fromTo(this.ambientLight, 5.0, {
      intensity: 0
    }, {
      intensity: 2,
      ease: Expo.easeOut
    });
  }

  update(dt = 0) {
    // this.rotation.x += dt;
    // console.log(this.pointLight1.intensity);
  }
};
