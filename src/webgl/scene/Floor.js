module.exports = class Floor extends THREE.Object3D {
  constructor () {
    super();

    this.geometry = new THREE.CubeGeometry(50, 25, 50);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      side: THREE.BackSide
    });
    this.mesh = new THREE.Mesh(
      this.geometry,
      this.material
    );

    this.position.set(0, 11, 0);
    this.mesh.receiveShadow = true;

    this.add(this.mesh);
  }
};
