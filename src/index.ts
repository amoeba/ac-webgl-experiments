import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

// Setup
const width = 150;
const height = 150;

// Init
const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(width, height);
var portraitEl = document.getElementById("portrait");

if (!portraitEl) {
  console.log("Fail");
}
portraitEl.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x0000ff });
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 2;

const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
