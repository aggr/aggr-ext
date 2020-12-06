(async function () {
  const res = await fetch("https://aggr.md/@aymericbeaumet");
  const text = await res.text();

  document.open();
  document.write(text);
  document.close();

  document.body.style.width = "500px";

  document.addEventListener(
    "click",
    function (event) {
      if (event.target.tagName !== "A") {
        return;
      }
      event.preventDefault();
      window.open(event.target.getAttribute("href"));
      window.close();
    },
    { capture: true, once: true, passive: false }
  );
})();
