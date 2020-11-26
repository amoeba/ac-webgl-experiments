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

// Setup
const width = 150;
const height = 150;
const defaultRotation = 2;
const defaultCameraZ = 0.7;
const defaultCameraTranslateY = 0.2;

// Scene & Camera
const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.translateY(defaultCameraTranslateY);

const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new PointLight(0xffffff, 0);
camera.add(pointLight);

// Load the object
let object; // Save a ref for callbacks to work with

// Set up the loader
function loadModel() {
  object.traverse(function (child) {
    if (child.isMesh) {
      child.material.map = texture;
    }
  });

  object.rotation.x = defaultRotation;
  scene.add(object);
}

const manager = new LoadingManager(loadModel);

manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

// Load our texture
const texture = new Texture();
const imageLoader = new ImageLoader(manager);
imageLoader.load("/assets/06005E3B-W6041.png", function (image) {
  texture.image = image;
  texture.needsUpdate = true;
});

// Load our model
const objLoader = new OBJLoader(manager);
objLoader.load("/assets/01001A65-W6041.obj", function (obj) {
  console.log(obj);

  object = obj;
});

// Renderer
const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.querySelectorAll("#portrait")[0].appendChild(renderer.domElement);

camera.position.z = defaultCameraZ;

const animate = function () {
  requestAnimationFrame(animate);

  if (object) {
    object.rotation.z += 0.01;
  }

  renderer.render(scene, camera);
};

animate();
