const { gui, webgl, assets } = require('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const colors = require('../../constants/colors');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
const gltfKey = assets.queue({
  url: 'assets/models/heart.gltf'
});

module.exports = class Heart extends THREE.Object3D {
  constructor (initialState, position, delay = 0) {
    super();

    // now fetch the loaded resource
    const gltf = assets.get(gltfKey);

    this.colorIndex = initialState;
    this.colorSet = colors[this.colorIndex];

    this.refreshMaterial();

    this.children = [];

    // Replaces all meshes material with something basic
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.material = this.material;

        // ThreeJS attaches something odd here on GLTF ipmport
        child.onBeforeRender = () => {};
        this.children.push(child);
      }
    });

    this.position.z = position;

    this.animationDelay = delay;
    this.add(gltf.scene);
  }

  refreshMaterial () {
    this.material = new LiveShaderMaterial(honeyShader, {
      transparent: true,
      wireframe: true,
      uniforms: {
        alpha: { value: 0 },
        time: { value: 0 },
        colorA: { value: new THREE.Color(this.colorSet[0]) },
        colorB: { value: new THREE.Color(this.colorSet[1]) }
      }
    });
  }

  onAppDidUpdate (oldProps, oldState, newProps, newState) {
    if (oldState.theme !== newState.theme) {
      this.colorSet = colors[newState.theme];
      this.refreshMaterial();
      this.children.forEach(child => { child.material = this.material });
      // this.children.forEach(child => { child.material.uniforms.alpha.value = 1;})
    }
  }

  animateIn (opt = {}) {
    animate.to(this.material.uniforms.alpha, 2.0, {
      ...opt,
      value: 1,
      delay: this.animationDelay
    });
    animate.fromTo(this.rotation, 1.0, {
      x: 90 * THREE.Math.DEG2RAD,
    }, {
      ...opt,
      x: 0,
      ease: Expo.easeOut,
      delay: this.animationDelay,
    });
    animate.to(this.scale, 0.4, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      repeat: -1,
      yoyo: true,
      delay: 0.4,
      ease: Expo.easeInOut
    })
  }

  update (dt = 0, time = 0) {
    this.material.uniforms.time.value = time;
  }
};
