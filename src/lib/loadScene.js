import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight } from "three";
import { OrbitControls } from "./OrbitControls";
import loadSetup from "./loadSetup";

/**
 * Find a place to put our scene
 *
 * Defaults to the body element
 *
 * @param {string} selector
 */
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
  const width = config.width || 600;
  const height = config.height || 600;

  // Scene & Camewra
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);

  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  config.objects.forEach(function (setup) {
    loadSetup(setup).then((object) => {
      scene.add(object);
    });
  });

  // Renderer
  const renderer = new WebGLRenderer();
  renderer.setSize(width, height);
  findTarget(config.target).appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.x = config.camera.position.x;
  camera.position.y = config.camera.position.y;
  camera.position.z = config.camera.position.z;

  controls.update();

  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
}
