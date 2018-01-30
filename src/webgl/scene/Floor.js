module.exports = class Floor extends THREE.Object3D {
  constructor (props) {
    super();

    this.geometry = new THREE.PlaneGeometry(100, 100, 1);
    this.material = new THREE.MeshStandardMaterial({roughness: 0.9});

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.receiveShadow = true;

    this.rotation.x = - Math.PI / 2;
    this.position.y = -3;

    this.add(this.mesh);
  }
};
