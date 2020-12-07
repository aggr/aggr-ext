import { browser, ContextMenus, Tabs } from "webextension-polyfill-ts";
import State from "./state";

(async function () {
  // Chrome-based browsers do not support the sidebarAction API.
  // See: https://bugs.chromium.org/p/chromium/issues/detail?id=477424
  const noSidebar = !browser.sidebarAction;

  const state = await State.load();
  state.set("githubToken", "xyz");
  state.set("popupWidth", "500px");
  state.set("_githubUsername", "aymericbeaumet");
  await state.save();

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
    title: "Subscribe With Aggr",
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

  if (!noSidebar) {
    browser.contextMenus.create({
      id: ContextMenu.ToggleSidebar,
      title: "Toggle the Aggr Sidebar",
      contexts: ["browser_action"],
    });
  }

  browser.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
      case ContextMenu.Subscribe:
        return tab?.url && subscribe(tab.url);
      case ContextMenu.OpenFeed:
        return activateOrCreateTab({ url: state.feedURL, pinned: false });
      case ContextMenu.PinFeed:
        return activateOrCreateTab({ url: state.feedURL, pinned: true });
      case ContextMenu.ToggleSidebar:
        return toggleSidebar();
      default:
        console.warn("Skipping unexpected context menu:", info.menuItemId);
    }
  });

  /*
   * Handle the commands defined in the manifest.json
   */

  enum Command {
    ToggleSidebar = "toggle-sidebar",
  }

  browser.commands.onCommand.addListener(function (command: string) {
    switch (command) {
      case Command.ToggleSidebar:
        return toggleSidebar();
      default:
        console.warn("Skipping unexpected command:", command);
    }
  });

  /*
   * Helpers
   */

  async function subscribe(url: string) {
    console.log("TODO: subscribing...", url);
  }

  async function activateOrCreateTab(options: {
    url: string;
    pinned: boolean;
  }) {
    const tabs = await browser.tabs.query({
      currentWindow: true,
      url: options.url,
    });
    const tab = tabs[0];
    if (tab) {
      return browser.tabs.update(tab.id, {
        active: true,
        pinned: tab.pinned || options.pinned,
      });
    }
    return browser.tabs.create({
      url: options.url,
      active: true,
      pinned: options.pinned,
    });
  }

  async function toggleSidebar() {
    if (noSidebar) {
      return;
    }
    return Promise.all([
      browser.sidebarAction.setPanel({ panel: state.feedURL }),
      // @ts-ignore
      await browser.sidebarAction.toggle(),
    ]);
  }
})();
