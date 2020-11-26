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

const whichModel = function () {
  const params = window.location.search;
  const parts = params.split("=");

  if (parts[0] != "?model" && parts[0].length <= 0) {
    return null;
  }

  return parts[1];
};

const handleError = function (error) {
  const el = document.querySelector("#placeholder");

  if (!el) {
    return;
  }

  el.innerHTML = error;
};

const init = function () {
  const model = whichModel();

  if (!model) {
    console.log("Failed");
    return;
  }
  const setup_url = "/assets/setups/" + model + ".json";

  fetch(setup_url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    })
    .then((setup) => {
      loadSetup(setup);
    })
    .catch((error) => {
      handleError(error);
    });
};

init();

const loadSetup = function (setup) {
  if (typeof setup === "undefined") {
    throw Error("Setup was undefined which is real bad.");
  }

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

  const placeholderEl = document.querySelectorAll("#placeholder")[0];

  if (!placeholderEl) {
    throw Error("Failed to find a place to render the model");
  }

  const resultEl = document.createElement("div");
  resultEl.id = "wrapper";

  const porraitEl = document.createElement("div");
  porraitEl.id = "portrait";
  porraitEl.appendChild(renderer.domElement);
  resultEl.appendChild(porraitEl);

  placeholderEl.appendChild(resultEl);

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
};
