const { assets } = require ('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const triangleArea = require('../../util/triangulate');
const queryString = require('query-string');
const swearjar = require('swearjar');
const colors = require('../../constants/colors');

// add fonts to preloader
const helvetikerFont = assets.queue({
  url: 'assets/fonts/helvetiker.typeface.json'
});

const typefaceList = [
  'helvetiker',
  'aroly-regular',
  'intro-black'
];

module.exports = class Text extends THREE.Object3D {
  constructor (initialState) {
    super();

    this.loader = new THREE.FontLoader();

    const textFromQuery = queryString.parse(location.search).text;
    if (textFromQuery) {
      const queryIsProfane = swearjar.profane(textFromQuery);
      queryIsProfane ? this.text = 'nice try' : this.text = textFromQuery;
    } else {
      this.text = 'ronik';
    }
    this.typeface = typefaceList[2];
    this.colorIndex = initialState;
    this.colorSet = colors[this.colorIndex];
    this.refreshText(this.typeface);
    this.shouldAnimate = false;
  }

  animateIn (opt = {}) {
    animate.to(this.materials[1].uniforms.alpha, 2.0, {
      ...opt,
      value: 1
    });
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
      height: 0.4
    };

    this.textGeo = new THREE.TextGeometry(text, options);

    this.materials = [
      new THREE.MeshBasicMaterial({color: 0x000000, flatShading: true}), // front
      new LiveShaderMaterial(honeyShader, {
        transparent: true,
        wireframe: true,
        uniforms: {
          alpha: { value: 0 },
          time: { value: 0 },
          colorA: { value: new THREE.Color(this.colorSet[0]) },
          colorB: { value: new THREE.Color(this.colorSet[1]) }
        }
      })
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
    if (this.shouldAnimate) {
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
      this.shouldAnimate = true;
    }

    if (oldState.theme !== newState.theme) {
      this.colorSet = colors[newState.theme];
      this.refreshText(this.typeface);
    }

    this.text = newState.text;
    this.refreshText(this.typeface);
  }

  update (dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    // this.rotation.y += dt * 0.1;
    this.materials[1].uniforms.time.value = time * 0.5;
  }
};
