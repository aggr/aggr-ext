import { browser, ContextMenus, Tabs } from "webextension-polyfill-ts";

// TODO: fetch from GitHub token / config
const username = "aymericbeaumet";
const userfeed = `https://aggr.md/@${username}/`;
// !TODO

// Chrome-based browsers do not support the sidebarAction API.
// See: https://bugs.chromium.org/p/chromium/issues/detail?id=477424
const browserHasSidebar = !!browser.sidebarAction;

/*
 * Setup and handle the context menus.
 */

enum ContextMenu {
  OpenFeed = "OPEN_FEED",
  PinFeed = "PIN_FEED",
  Subscribe = "SUBSCRIBE",
  ToggleSidebar = "TOGGLE_SIDEBAR",
}

browser.contextMenus.create({
  id: ContextMenu.Subscribe,
  title: "Subscribe with Aggr",
  contexts: ["page"],
});

browser.contextMenus.create({
  id: ContextMenu.OpenFeed,
  title: "Open my Aggr Feed",
  contexts: ["browser_action"],
});

browser.contextMenus.create({
  id: ContextMenu.PinFeed,
  title: "Pin my Aggr Feed",
  contexts: ["browser_action"],
});

if (browserHasSidebar) {
  browser.contextMenus.create({
    id: ContextMenu.ToggleSidebar,
    title: "Toggle the Aggr Sidebar",
    contexts: ["browser_action"],
  });
}

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  switch (info.menuItemId) {
    case ContextMenu.Subscribe:
      return tab && tab.url && subscribe(tab.url);
    case ContextMenu.OpenFeed:
      return switchOrCreateTab({ url: userfeed, pinned: false });
    case ContextMenu.PinFeed:
      return switchOrCreateTab({ url: userfeed, pinned: true });
    case ContextMenu.ToggleSidebar:
      return toggleSidebar();
  }
});

/*
 * Handle the commands defined in the manifest.json
 */

enum Command {
  ToggleSidebar = "toggle-sidebar",
}

browser.commands.onCommand.addListener(async function (command: string) {
  switch (command) {
    case Command.ToggleSidebar:
      return toggleSidebar();
  }
});

/*
 * Helpers
 */

async function subscribe(url: string) {
  console.log("TODO: subscribing...", url);
}

async function switchOrCreateTab(options: { url: string; pinned: boolean }) {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    url: options.url,
  });
  if (tabs[0]) {
    return browser.tabs.update(tabs[0].id, {
      active: true,
      pinned: options.pinned,
    });
  }
  return browser.tabs.create({
    url: options.url,
    active: true,
    pinned: options.pinned,
  });
}

async function toggleSidebar() {
  if (!browserHasSidebar) {
    return;
  }
  return Promise.all([
    browser.sidebarAction.setPanel({ panel: userfeed }),
    // @ts-ignore
    await browser.sidebarAction.toggle(),
  ]);
}
