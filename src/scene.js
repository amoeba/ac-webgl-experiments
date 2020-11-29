import loadScene from "./lib/loadScene";

const init = function () {
  const scene_url = "/assets/scenes/test.json";

  fetch(scene_url)
    .then((response) => {
      return response.json();
    })
    .then((scene) => {
      loadScene(scene);
    });
};

init();
