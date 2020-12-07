import { browser } from "webextension-polyfill-ts";
import State from "./state";

(async function () {
  const state = await State.load();
  const res = await fetch(state.feedURL);
  const text = await res.text();

  document.open();
  document.write(text);
  document.close();
  document.body.style.width = state.get("popupWidth");

  document.addEventListener(
    "click",
    function (event: MouseEvent) {
      if (event.target && event.target.tagName !== "A") {
        return;
      }
      event.preventDefault();
      window.open(event.target?.getAttribute("href"));
      window.close();
    },
    { capture: true, once: true, passive: false }
  );
})();
