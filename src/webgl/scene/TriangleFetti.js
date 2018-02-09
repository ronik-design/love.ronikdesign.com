const animate = require('@jam3/gsap-promise');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = class TriangleFetti extends THREE.Object3D {
  constructor () {
    super();

    this.generateFetti(30);
  }

  generateFetti = count => {
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.ConeGeometry(0.5, 1, 4);
      const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
      const mesh = new THREE.Mesh(geometry, material);

      mesh.rotation.x = getRandomInt(0, 360) * THREE.Math.DEG2RAD;
      mesh.rotation.z = getRandomInt(0, 360) * THREE.Math.DEG2RAD;
      mesh.rotation.y = getRandomInt(0, 360) * THREE.Math.DEG2RAD;
      mesh.position.y = getRandomInt(- count / 2, count / 3);
      mesh.position.x = getRandomInt(- count / 2, count / 3);
      mesh.position.z = getRandomInt(- count / 2, count / 3);

      const scale = (Math.random() * (0.5 - 0.2 + 1) + 0.2) / 1.5;
      mesh.scale.set(scale, scale, scale);

      this.add(mesh);
    }
  }

  animateIn () {
    animate.fromTo(this.position, 5.0, {
      x: -30,
      y: -30,
      z: -30
    }, {
      x: 0,
      y: 0,
      z: 0,
      ease: Back.easeOut,
      delay: 0.5
    });
    animate.fromTo(this.rotation, 15.0, {
      x: 15 * THREE.Math.DEG2RAD,
      y: 40 * THREE.Math.DEG2RAD,
      z: 25 * THREE.Math.DEG2RAD,
    }, {
      x: 0,
      y: 0,
      z: 0,
      ease: Expo.easeOut,
      delay: 0.5
    });
  }

  update(dt = 0) {
    if (this.children) {
      for (let j = 0; j < this.children.length; j++) {
        this.children[j].rotation.y += dt * 0.5;
        this.children[j].rotation.x += dt * 0.2;
        this.children[j].rotation.z += dt * 0.1;
      }
    }
  }
};
