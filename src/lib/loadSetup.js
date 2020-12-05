import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight } from "three";
import { OrbitControls } from "./OrbitControls";
import loadObject from "./loadObject";

const findTarget = function (selector) {
  if (typeof selector === "undefined") {
    return document.body;
  }

  const el = document.querySelectorAll(selector);

  if (el.length != 1) {
    return document.body;
  }

  return el[0];
};

export default function (config = {}) {
  // Setup
  const width = config.width || 150;
  const height = config.height || 150;

  // Scene & Camewra
  const scene = new Scene();
  const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);

  camera.position.x =
    (config.camera && config.camera.position && config.camera.position.x) || 0;
  camera.position.y =
    (config.camera && config.camera.position && config.camera.position.y) || 0;
  camera.position.z =
    (config.camera && config.camera.position && config.camera.position.z) || 0;

  // Light
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Object
  let setups = [];

  config.objects.forEach(function (setup) {
    loadObject(setup).then((object) => {
      scene.add(object);
      setups.push(object);
    });
  });

  // Renderer
  const renderer = new WebGLRenderer();
  renderer.setSize(width, height);

  const target = findTarget(config.target);
  target.parentElement.classList.remove("loading");
  target.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // Animation
  const animate = function () {
    setups.forEach((setup) => {
      setup.rotation.z += config.rotation.dz;
    });

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };

  animate();
}
