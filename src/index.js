import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LoadingManager,
  Texture,
  ImageLoader,
  AmbientLight,
  PointLight,
} from "three";
import { OBJLoader } from "./lib/ObjLoader";
import setup  from "./setups/dual_fragment";

// Setup
const width = 150;
const height = 150;


// Scene & Camera
const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.translateY(setup.defaultCameraTranslateY);

const ambientLight = new AmbientLight(0xffffff, 0);
scene.add(ambientLight);


// Load the object
let object; // Save a ref for callbacks to work with

// Set up the loader
function loadModel() {
  object.traverse(function (child) {
    if (child.isMesh) {
      child.material.map = texture;
    }
  });

  object.rotation.x = setup.defaultRotation;
  scene.add(object);
}

const manager = new LoadingManager(loadModel);

manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

// Load our texture
const texture = new Texture();
const imageLoader = new ImageLoader(manager);
imageLoader.load(setup.texture, function (image) {
  texture.image = image;
  texture.needsUpdate = true;
});

// Load our model
const objLoader = new OBJLoader(manager);
objLoader.load(setup.obj, function (obj) {
  console.log(obj);

  object = obj;
});

// Renderer
const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.querySelectorAll("#portrait")[0].appendChild(renderer.domElement);

camera.position.z = setup.defaultCameraZ;

let delta = 0.01;

const animate = function () {
  requestAnimationFrame(animate);

  if (object) {
    object.rotation.z += 0.01;
  }

  if (ambientLight.intensity >= 1) {
    delta = -0.01
  } else if (ambientLight.intensity <= 0) {
    delta = +0.01
  }

  ambientLight.intensity += delta;
  renderer.render(scene, camera);
};

animate();
