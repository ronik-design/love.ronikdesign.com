const { assets } = require ('../../context');

const animate = require('@jam3/gsap-promise');
const triangleArea = require('../../util/triangulate');
const queryString = require('query-string');
const swearjar = require('swearjar');

// add fonts to preloader
const helvetikerFont = assets.queue({
  url: 'assets/fonts/helvetiker.typeface.json'
});

const typefaceList = [
  'helvetiker',
  'aroly-regular'
];

module.exports = class Text extends THREE.Object3D {
  constructor () {
    super();

    this.loader = new THREE.FontLoader();

    const textFromQuery = queryString.parse(location.search).text;
    if (textFromQuery) {
      const queryIsProfane = swearjar.profane(textFromQuery);
      queryIsProfane ? this.text = 'nice try' : this.text = textFromQuery;
    } else {
      this.text = 'ronik';
    }

    this.typeface = typefaceList[0];
    this.refreshText(this.typeface);
    this.hasAnimatedOnce = false;
  }

  animateIn (opt = {}) {
    animate.fromTo(this.rotation, 2.0, {
      x: -Math.PI / 2
    }, {
      ...opt,
      x: 0,
      ease: Expo.easeOut
    });
  }

  createText(font) {
    const text = this.text;
    const options = {
      font: font,
      size: 0.8,
      height: 0.2
    };

    this.textGeo = new THREE.TextGeometry(text, options);

    this.materials = [
      new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}), // front
      new THREE.MeshStandardMaterial({color: 0xffffff}) // side
    ];

    this.altMaterial = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(
      this.textGeo,
      this.materials
    );

    // compute sizes
    this.textGeo.computeBoundingBox();
    this.textGeo.computeVertexNormals();

    // center text
    this.mesh.position.x = -0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );
    this.mesh.position.y = -0.5 * ( this.textGeo.boundingBox.max.y - this.textGeo.boundingBox.min.y );

    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    const triangleAreaHeuristics = 0.1 * (options.height * options.size);

    for (let i = 0; i < this.textGeo.faces.length; i++) {
      const face = this.textGeo.faces[i];
      if (face.materialIndex === 1) {
        for (let j = 0; j < face.vertexNormals.length; j++) {
          face.vertexNormals[j].z = 0;
          face.vertexNormals[j].normalize();
        }

        const va = this.textGeo.vertices[face.a];
        const vb = this.textGeo.vertices[face.b];
        const vc = this.textGeo.vertices[face.c];
        const s = triangleArea(va, vb, vc);

        if (s > triangleAreaHeuristics) {
          for (let j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].copy(face.normal);
          }
        }
      }
    }

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.add(this.mesh);

    // prevent animation from being fired twice on first load
    if (this.hasAnimatedOnce) {
      this.animateIn();
    }
  }

  refreshText(typeface) {
    if (this.mesh) {
      this.remove(this.mesh);
    }

    this.loader.load(`assets/fonts/${typeface}.typeface.json`, font => {
      this.createText(font);
    });
  }

  onAppDidUpdate (oldProps, oldState, newProps, newState) {
    if (oldState.isLoaded === false) {
      return;
    } else {
      this.hasAnimatedOnce = true;
    }

    if (oldState.text === newState.text) {
      return;
    }

    this.text = newState.text;
    this.refreshText(this.typeface);
  }

  update (dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    // this.rotation.y += dt * 0.1;
    // this.material.uniforms.time.value = time * 0.5;
  }
};
