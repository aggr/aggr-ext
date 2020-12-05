function openPage() {
  browser.tabs.create({
    url: "https://aggr.md/@aymericbeaumet/",
  });
}

browser.browserAction.onClicked.addListener(openPage);
