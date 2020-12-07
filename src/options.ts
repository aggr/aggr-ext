import { browser } from "webextension-polyfill-ts";
import State from "./state";

(async function () {
  const state = await State.load();
  const inputs = getInputsByName();

  document
    .querySelector('button[type="submit"]')!
    .addEventListener("click", async function (event) {
      event.preventDefault();
      // Set the inputs in the config
      inputs.forEach(function (input, name) {
        if (input.value) {
          state.set(name, input.value);
        }
      });
      // Save the config
      await state.save();
    });

  // Populate the inputs from the config
  inputs.forEach(function (input, name) {
    input.value = state.get(name);
  });
})();

function getInputsByName(): Map<string, HTMLInputElement> {
  const out = new Map();
  document.querySelectorAll("input[name]").forEach(function (element) {
    out.set(element.getAttribute("name"), element as HTMLInputElement);
  });
  return out;
}
