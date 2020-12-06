// TODO: fetch from GitHub token
const username = "aymericbeaumet";
const userfeed = `https://aggr.md/@${username}/`;

// TODO: make this configurable
const pinned = true;

async function browserAction() {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    url: `${userfeed}*`,
  });

  if (tabs.length > 0) {
    const tab = tabs[0];
    return browser.tabs.update(tab.id, { active: true, pinned });
  }

  return browser.tabs.create({ url: userfeed, pinned });
}

async function onCommand(commandName: string) {
  switch (commandName) {
    case "toggle-sidebar":
      // not await'ing on purpose, we don't want to wait for the page to have
      // loaded before toggling
      browser.sidebarAction.setPanel({ panel: userfeed });
      // @ts-ignore
      await browser.sidebarAction.toggle();
      break;
  }
}

browser.browserAction.onClicked.addListener(browserAction);
browser.commands.onCommand.addListener(onCommand);
