// TODO: fetch from GitHub token
const username = "aymericbeaumet";

// TODO: make this configurable
const pinned = true;

async function browserAction() {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    url: `https://aggr.md/@${username}/*`,
  });

  if (tabs.length > 0) {
    const tab = tabs[0];
    return browser.tabs.update(tab.id, { active: true, pinned });
  }

  return browser.tabs.create({ url: `https://aggr.md/@${username}/`, pinned });
}

async function onCommand(commandName: string) {
  switch (commandName) {
    case "toggle-sidebar":
      return browser.sidebarAction.toggle();
  }
}

browser.browserAction.onClicked.addListener(browserAction);
browser.commands.onCommand.addListener(onCommand);
