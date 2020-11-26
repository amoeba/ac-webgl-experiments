import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DoubleSide,
  Object3D,
} from "three";
import { OBJLoader } from "./lib/ObjLoader";
import { MTLLoader } from "./lib/MTLLoader";
import setup from "./setups/dual_fragment";

// Setup
const width = 150;
const height = 150;

// Scene & Camewra
const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Load the object
let completeObject = new Object3D(); // Save a ref for callbacks to work with

const mtlLoader = new MTLLoader();
mtlLoader.setPath("/assets/mtl/");
mtlLoader.load(setup.mtl, function (materials) {
  console.log(materials);

  materials.preload();

  var loader = new OBJLoader();
  loader.setPath("/assets/obj/");
  loader.setMaterials(materials);

  loader.load(
    setup.obj,
    function (object) {
      object.traverse(function (child) {
        if (child.material) {
          child.material.side = DoubleSide;
        }
      });

      object.updateMatrix();
      completeObject.add(object);
    },
    function (a, b, c) {
      console.log("update", a, b, c);
    },
    function (err) {
      console.log("error", err);
    }
  );
});

scene.add(completeObject);

// Renderer
const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.querySelectorAll("#portrait")[0].appendChild(renderer.domElement);

// Touch-ups
camera.position.z = setup.camera.position.z;
completeObject.position.y = setup.object.position.y;
completeObject.rotation.x = setup.object.rotation.x;

const animate = function () {
  requestAnimationFrame(animate);
  completeObject.rotation.z += 0.01;
  renderer.render(scene, camera);
};

animate();
