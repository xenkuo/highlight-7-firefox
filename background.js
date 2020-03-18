/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  }
}

/*
Create all the context menu items.
*/
browser.menus.create(
  {
    id: "auto",
    title: browser.i18n.getMessage("menuItemAuto"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-7.png",
      32: "icons/hl-7@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "separator",
    type: "separator",
    contexts: ["page", "editable", "frame", "link", "selection"]
  },
  onCreated
);

browser.menus.create(
  {
    id: "red",
    title: browser.i18n.getMessage("menuItemRed"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-red.png",
      32: "icons/hl-red@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "orange",
    title: browser.i18n.getMessage("menuItemOrange"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-orange.png",
      32: "icons/hl-orange@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "yellow",
    title: browser.i18n.getMessage("menuItemYellow"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-yellow.png",
      32: "icons/hl-yellow@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "green",
    title: browser.i18n.getMessage("menuItemGreen"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-green.png",
      32: "icons/hl-green@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "blue",
    title: browser.i18n.getMessage("menuItemBlue"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-blue.png",
      32: "icons/hl-blue@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "indigo",
    title: browser.i18n.getMessage("menuItemIndigo"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-indigo.png",
      32: "icons/hl-indigo@2x.png"
    }
  },
  onCreated
);

browser.menus.create(
  {
    id: "purple",
    title: browser.i18n.getMessage("menuItemPurple"),
    contexts: ["page", "editable", "frame", "link", "selection"],
    icons: {
      16: "icons/hl-purple.png",
      32: "icons/hl-purple@2x.png"
    }
  },
  onCreated
);

function menuHighlight(id, text) {
  console.log("id: " + id + "; text: " + text);
  browser.storage.local
    .get({
      enable: false
    })
    .then(items => {
      if (items.enable === true) {
        browser.storage.local
          .set({
            [id]: text
          })
          .then(() => {
            browser.tabs.executeScript({
              file: "/highlight.js"
            });
          })
          .then(() => {
            console.log("highlight works");
          })
          .catch(e => {
            console.error(e);
          });
      } else {
        browser.storage.local
          .set({
            enable: true
          })
          .then(() => {
            browser.storage.local.set({
              [id]: text
            });
          })
          .then(() => {
            browser.tabs.executeScript({
              file: "/highlight.js"
            });
          })
          .then(() => {
            console.log("highlight works");
          })
          .catch(e => {
            console.error(e);
          });
      }
    })
    .catch(e => {
      console.error(e);
    });
}

browser.menus.onClicked.addListener((info, tab) => {
  let id = info.menuItemId || "auto";
  let text = info.selectionText || "";
  text = text.trim();
  console.log(`menu:${id}; text:${text}`);

  if (id === "auto") {
    browser.storage.local
      .get({
        red: "",
        orange: "",
        yellow: "",
        green: "",
        blue: "",
        indigo: "",
        purple: ""
      })
      .then(items => {
        const keys = Object.keys(items);
        for (const key of keys) {
          if (items[key] === "") {
            id = key;
            break;
          }
        }
        if (id === "auto") id = keys[new Date().getTime() % 7];
        menuHighlight(id, text);
      });
  } else {
    menuHighlight(id, text);
  }
});

function autoProcess() {
  browser.tabs
    .executeScript({
      file: "/highlight.js"
    })
    .then(() => {
      browser.storage.local.set({
        auto: new Date().getTime()
      });
    })
    .then(() => {
      console.log("auto set ok");
    })
    .catch(e => {
      console.error(e);
    });
}

function clearProcess() {
  browser.storage.local
    .clear()
    .then(() => {
      console.log("highlight 7 cleared");
    })
    .catch(e => {
      console.error(e);
    });
}

function switchProcess() {
  browser.storage.local
    .get({
      enable: false
    })
    .then(items => {
      if (items.enable === true) {
        browser.storage.local
          .set({
            enable: false
          })
          .then(() => {
            console.log("highlight 7 disabled");
          })
          .catch(e => {
            console.error(e);
          });
      } else {
        browser.storage.local
          .set({
            enable: true
          })
          .then(() => {
            console.log("highlight 7 enabled");
          })
          .catch(e => {
            console.error(e);
          });
      }
    })
    .catch(e => {
      console.error(e);
    });
}

browser.commands.onCommand.addListener(command => {
  console.log("shortcut: " + command + " triggered");
  if (command === "auto") {
    autoProcess();
  } else if (command === "clear") {
    clearProcess();
  } else if (command === "switch") {
    switchProcess();
  }
});
