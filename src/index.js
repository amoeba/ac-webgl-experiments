import loadScene from "./lib/loadScene";

const whichScene = function () {
  const params = window.location.search;
  const parts = params.split("=");

  if (parts[0] != "?scene" && parts[0].length <= 0) {
    return null;
  }

  return parts[1];
};

const init = function () {
  const scene_name = whichScene();

  if (!scene_name) {
    return;
  }

  const scene = "/assets/scenes/" + scene_name + ".json";

  fetch(scene)
    .then((response) => {
      return response.json();
    })
    .then((scene) => {
      loadScene(scene);
    });
};

init();
