import loadSetup from "./lib/loadSetup";

const whichSetup = function () {
  const params = window.location.search;
  const parts = params.split("=");

  if (parts[0] != "?scene" && parts[0].length <= 0) {
    return null;
  }

  return parts[1];
};

const setupUrl = function (name) {
  return "/assets/setups/" + name + ".json";
};

const init = function () {
  const setup_name = whichSetup();

  if (!setup_name) {
    return;
  }

  const setup_url = setupUrl(setup_name);

  fetch(setup_url)
    .then((response) => {
      return response.json();
    })
    .then((setup) => {
      loadSetup(setup);
    });
};

init();
