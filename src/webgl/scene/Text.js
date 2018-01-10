const { assets } = require ('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const triangleArea = require('../../util/triangulate');

// add fonts to preloader
const helvetikerFont = assets.queue({
  url: 'assets/fonts/helvetiker.typeface.json'
});

module.exports = class Text extends THREE.Object3D {
  constructor () {
    super();

    this.material = new LiveShaderMaterial(honeyShader, {
      transparent: true,
      wireframe: true,
      uniforms: {
        alpha: { value: 0 },
        time: { value: 0 },
        colorA: { value: new THREE.Color('rgb(94,222,179)') },
        colorB: { value: new THREE.Color('rgb(85,57,210)') }
      }
    });

    const loader = new THREE.FontLoader();
    loader.load('assets/fonts/helvetiker.typeface.json', font => {
      this.addText(font);
    });
  }

  animateIn (opt = {}) {
    animate.to(this.material.uniforms.alpha, 2.0, {
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

  addText(font) {
    const text = 'ronik';
    const options = {
      font: font,
      size: 0.8,
      height: 0.2
    };

    const textGeo = new THREE.TextGeometry(text, options);

    const mesh = new THREE.Mesh(
      textGeo,
      this.material
    );

    // compute sizes
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    // center text
    mesh.position.x = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    mesh.position.y = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );

    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    const triangleAreaHeuristics = 0.1 * (options.height * options.size);

    for (let i = 0; i < textGeo.faces.length; i++) {
      const face = textGeo.faces[i];
      if (face.materialIndex === 1) {
        for (let j = 0; j < face.vertexNormals.length; j++) {
          face.vertexNormals[j].z = 0;
          face.vertexNormals[j].normalize();
        }

        const va = textGeo.vertices[face.a];
        const vb = textGeo.vertices[face.b];
        const vc = textGeo.vertices[face.c];
        const s = triangleArea(va, vb, vc);

        if (s > triangleAreaHeuristics) {
          for (let j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].copy(face.normal);
          }
        }
      }
    }

    this.add(mesh);
  }

  update (dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    this.rotation.y += dt * 0.1;
    this.material.uniforms.time.value = time;
  }
};
