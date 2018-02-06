const animate = require('@jam3/gsap-promise');

module.exports = class Floor extends THREE.Object3D {
  constructor (position) {
    super();

    this.geometry = new THREE.PlaneGeometry(10, 10, 3);
    this.material = new THREE.MeshBasicMaterial({color: 0x4e4e4e, wireframe: true});

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.receiveShadow = true;

    this.rotation.x = - Math.PI / 2;
    this.position.y = position;

    this.add(this.mesh);
  }

  animateIn () {
    animate.fromTo(this.rotation, 2.0, {
     z: Math.PI * 2
    }, {
      z: 0,
      ease: Expo.easeOut
    });
    animate.fromTo(this.scale, 4.0, {
      x: 0,
      y: 0,
      z: 0
    }, {
      x: 1,
      y: 1,
      z: 1,
      ease: Expo.easeOut
    });
  }
};
