import { DoubleSide, Object3D } from "three";
import { OBJLoader } from "./ObjLoader";
import { MTLLoader } from "./MTLLoader";

export default async function (setup) {
  const setup_url = "/assets/setups/" + setup + ".json";

  return fetch(setup_url)
    .then((response) => {
      return response.json();
    })
    .then((setup) => {
      return doLoadSetup(setup);
    });
}

const doLoadSetup = function (setup) {
  let completeObject = new Object3D();

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
      function (a, b, c) {},
      function (err) {}
    );
  });

  completeObject.position.x = setup.object.position.x;
  completeObject.position.y = setup.object.position.y;
  completeObject.position.z = setup.object.position.z;

  completeObject.rotation.x = setup.object.rotation.x;
  completeObject.rotation.y = setup.object.rotation.y;
  completeObject.rotation.z = setup.object.rotation.z;

  return completeObject;
};
