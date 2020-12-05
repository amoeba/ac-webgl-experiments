import loadScene from "./lib/loadScene";

const whichScene = function () {
  const params = window.location.search;
  const parts = params.split("=");

  if (parts[0] != "?scene" && parts[0].length <= 0) {
    return null;
  }

  return parts[1];
};

const sceneUrl = function (name) {
  return "/assets/scenes/" + name + ".json";
};

const init = function () {
  const scene_name = whichScene();

  if (!scene_name) {
    return;
  }

  const scene_url = sceneUrl(scene_name);

  fetch(scene_url)
    .then((response) => {
      return response.json();
    })
    .then((scene) => {
      loadScene(scene);
    });
};

init();
