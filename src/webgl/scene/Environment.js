const materials = require('../../constants/materials');
const animate = require('@jam3/gsap-promise');

module.exports = class Environment extends THREE.Object3D {
  constructor (props) {
    super();
  }

  animateIn (opt = {}) {
    animate.fromTo(this.scale, 5.0, {
      x: 0.2,
      y: 0.2,
      z: 0.2
    }, {
      ...opt,
      x: 1,
      y: 1,
      z: 1,
      ease: Expo.easeOut
    });
  }

  updateTexture() {
    if (this.mesh) {
      this.remove(this.mesh);
    }

    const textureName = materials[this.materialIndex];

    const colorMap = new THREE.TextureLoader().load(`/assets/textures/${textureName}/color_1024.jpg`, texture => this.updateTextureProperties(texture));
    const normalMap = new THREE.TextureLoader().load(`/assets/textures/${textureName}/normal_1024.jpg`, texture => this.updateTextureProperties(texture));
    const aoMap = new THREE.TextureLoader().load(`/assets/textures/${textureName}/occlusion_1024.jpg`, texture => this.updateTextureProperties(texture));
    const specularMap = new THREE.TextureLoader().load(`/assets/textures/${textureName}/specular_1024.jpg`, texture => this.updateTextureProperties(texture));

    this.geometry = new THREE.BoxGeometry(50, 50, 50);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: colorMap,
      normalMap: normalMap,
      specularMap: specularMap,
      aoMap: aoMap,
      side: THREE.BackSide
    });

    this.mesh = new THREE.Mesh(
      this.geometry,
      this.material
    );

    this.position.set(0, 0, 0);
    this.mesh.receiveShadow = true;

    this.add(this.mesh);
  }

  updateTextureProperties (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 4, 4 );
  }

  onAppDidUpdate (oldProps, oldState, newProps, newState) {
    if (oldState.isLoaded !== newState.isLoaded) {
      this.materialIndex = newState.backgroundMaterial;
      this.updateTexture();
    }

    if (oldState.backgroundMaterial !== newState.backgroundMaterial) {
      this.materialIndex = newState.backgroundMaterial;
      this.updateTexture();
    }
  }

  update(dt = 0) {
    this.rotation.z += dt * 0.05;
    this.rotation.y += dt * 0.06;
    this.rotation.x += dt * 0.04;
  }
};
