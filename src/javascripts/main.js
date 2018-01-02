const THREE = require('three');
import {triangleArea} from './utils/geometry';

THREE.Cache.enabled = true;

let container, permalink, hex, color;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textMesh2, textGeo, materials;
let firstLetter = true;
let text = 'three.js',
    height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,
    font = undefined,
    fontName = 'league-gothic';

const mirror = false;

const fontMap = {
  helvetiker: 0,
  monoton: 1
};

let reverseFontMap = [];

for (let i in fontMap) reverseFontMap[fontMap[i]] = i;

let targetRotation = 0;
let targetRotationOnMouseDown = 0;

let mouseX = 0;
let mouseXOnMouseDown = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function decimalToHex(d) {
  let hex = Number(d).toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;
  return hex.toUpperCase();
}

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  permalink = document.getElementById('permalink');

  // CAMERA

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 100, 1200);

  cameraTarget = new THREE.Vector3(0, 150, 0);

  // SCENE

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.Fog(0x000000, 250, 1400);

  // LIGHTS

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  // Get text from hash

  const hash = document.location.hash.substr(1);

  if (hash.length !== 0) {
    const texthash = hash.substring(1);

    text = decodeURI(texthash);

    updatePermalink();
  } else {
    pointLight.color.setHSL(Math.random(), 1, 0.5);
    hex = decimalToHex(pointLight.color.getHex());
  }

  materials = [
    new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}), // front
    new THREE.MeshPhongMaterial({color: 0xffffff}) // side
  ];

  group = new THREE.Group();
  group.position.y = 100;

  scene.add(group);

  loadFont();

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true})
  );
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // RENDERER

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // EVENTS

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  document.addEventListener('keypress', onDocumentKeyPress, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updatePermalink() {
  const link = encodeURI(text);

  permalink.href = '#' + link;
  window.location.hash = link;
}

function onDocumentKeyDown(event) {
  if (firstLetter) {
    firstLetter = false;
    text = '';
  }
  const keyCode = event.keyCode;

  // backspace

  if (keyCode === 8) {
    event.preventDefault();

    text = text.substring(0, text.length - 1);
    refreshText();

    return false;
  }
}

function onDocumentKeyPress(event) {
  const keyCode = event.which;

  // backspace
  if (keyCode === 8) {
    event.preventDefault();
  } else {
    const ch = String.fromCharCode(keyCode);
    text += ch;

    refreshText();
  }
}

function loadFont() {
  const loader = new THREE.FontLoader();
  loader.load('assets/fonts/' + fontName + '.typeface.json', function (response) {
    font = response;

    refreshText();
  });
}

function createText() {
  textGeo = new THREE.TextGeometry(text, {
    font: font,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled,
    material: 0,
    extrudeMaterial: 1
  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

  if (!bevelEnabled) {
    const triangleAreaHeuristics = 0.1 * (height * size);

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
  }

  let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

  textMesh1 = new THREE.Mesh(textGeo, materials);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  group.add(textMesh1);

  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials);

    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -hover;
    textMesh2.position.z = height;

    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;

    group.add(textMesh2);
  }
}

function refreshText() {
  updatePermalink();

  group.remove(textMesh1);
  if (mirror) {
    group.remove(textMesh2);
  }

  if (!text) {
    return;
  }

  createText();
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);

  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.001;
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {

    event.preventDefault();

    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
  }
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  renderer.clear();
  renderer.render(scene, camera);
}
