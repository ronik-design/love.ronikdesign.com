const { assets } = require ('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const triangleArea = require('../../util/triangulate');
const colors = require('../../constants/colors');

// add font to preloader
const introFont = assets.queue({
  url: 'assets/fonts/intro-black.typeface.json'
});

module.exports = class Text extends THREE.Object3D {
  constructor (color, text = 'ronik', position = [0, 0, 0], delay = 0) {
    super();

    // retrieve font
    const font = assets.get(introFont);
    this.font = new THREE.Font(font);

    this.text = text;
    this.typeface = 'intro-black';
    this.colorIndex = color;
    this.colorSet = colors[this.colorIndex];

    this.position.x = position[0];
    this.position.y = position[1];
    this.position.z = position[2];
    this.animationDelay = delay;

    this.createText(this.font);
  }

  animateIn () {
    animate.to(this.materials[1].uniforms.alpha, 2.0, {
      value: 1,
      delay: this.animationDelay,
    });
    animate.to(this.materials[1], 2.0, {
      opacity: 1
    });
    animate.to(this.materials[0], 0.2, {
      opacity: 0.4,
      delay: this.animationDelay
    });
    animate.fromTo(this.rotation, 2.0, {
      x: -Math.PI / 2
    }, {
      x: 0,
      ease: Elastic.easeOut,
      delay: this.animationDelay
    })
  }

  animateOut () {
    animate.to(this.materials[1].uniforms.alpha, 2.0, {
      value: 0,
    });
    animate.fromTo(this.rotation, 2.0, {
      x: 0
    }, {
      x: -Math.PI / 2,
      ease: Expo.easeOut,
    })
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
      new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0}), // front
      new LiveShaderMaterial(honeyShader, {
        transparent: true,
        wireframe: true,
        opacity: 0,
        uniforms: {
          alpha: { value: 0 },
          time: { value: 0 },
          colorA: { value: new THREE.Color(this.colorSet[0]) },
          colorB: { value: new THREE.Color(this.colorSet[1]) }
        }
      })
    ];

    this.mesh = new THREE.Mesh(
      this.textGeo,
      this.materials
    );

    // compute sizes
    this.textGeo.computeBoundingBox();
    this.textGeo.computeVertexNormals();
    this.textGeo.center();

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

    this.add(this.mesh);
  }

  update (dt = 0, time = 0) {
    if (this.materials) {
      this.materials[1].uniforms.time.value = time * 0.5;
    }
  }
};
