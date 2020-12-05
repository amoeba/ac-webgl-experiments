import { DoubleSide, Object3D } from "three";
import { OBJLoader } from "./ObjLoader";
import { MTLLoader } from "./MTLLoader";

export default async function (object) {
  const object_url = "/assets/objects/" + object + ".json";

  return fetch(object_url)
    .then((response) => {
      return response.json();
    })
    .then((object) => {
      return doLoadObject(object);
    });
}

const doLoadObject = function (object) {
  let completeObject = new Object3D();

  const mtlLoader = new MTLLoader();
  mtlLoader.setPath("/assets/mtl/");
  mtlLoader.load(object.mtl, function (materials) {
    materials.preload();

    var loader = new OBJLoader();

    loader.setPath("/assets/obj/");
    loader.setMaterials(materials);

    loader.load(
      object.obj,
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

  completeObject.position.x = object.object.position.x;
  completeObject.position.y = object.object.position.y;
  completeObject.position.z = object.object.position.z;

  completeObject.rotation.x = object.object.rotation.x;
  completeObject.rotation.y = object.object.rotation.y;
  completeObject.rotation.z = object.object.rotation.z;

  return completeObject;
};
