const { gui, webgl, assets } = require('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const colors = require('../../constants/colors');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
const gltfKey = assets.queue({
  url: 'assets/models/spinner.gltf'
});

module.exports = class Spinner extends THREE.Object3D {
  constructor (initialState, position) {
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
      this.children.forEach(child => { child.material.uniforms.alpha.value = 1;})
    }
  }

  animateIn (opt = {}) {
    animate.to(this.material.uniforms.alpha, 2.0, {
      ...opt,
      value: 1
    });
    animate.fromTo(this.rotation, 2.0, {
      x: -Math.PI / 4
    }, {
      ...opt,
      x: Math.PI / 2,
      ease: Expo.easeOut
    });
  }

  update (dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    this.rotation.y += dt * 0.5;
    this.material.uniforms.time.value = time;
  }
};
