/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated () {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`)
  }
}

/*
Create all the context menu items.
*/

browser.menus.create(
  {
    id: 'red',
    title: browser.i18n.getMessage('menuItemRed'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-red.png',
      32: 'icons/hl-red@2x.png'
    }
  },
  onCreated
)

browser.menus.create(
  {
    id: 'orange',
    title: browser.i18n.getMessage('menuItemOrange'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-orange.png',
      32: 'icons/hl-orange@2x.png'
    }
  },
  onCreated
)

browser.menus.create(
  {
    id: 'yellow',
    title: browser.i18n.getMessage('menuItemYellow'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-yellow.png',
      32: 'icons/hl-yellow@2x.png'
    }
  },
  onCreated
)

browser.menus.create(
  {
    id: 'green',
    title: browser.i18n.getMessage('menuItemGreen'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-green.png',
      32: 'icons/hl-green@2x.png'
    }
  },
  onCreated
)

browser.menus.create(
  {
    id: 'blue',
    title: browser.i18n.getMessage('menuItemBlue'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-blue.png',
      32: 'icons/hl-blue@2x.png'
    }
  },
  onCreated
)

browser.menus.create(
  {
    id: 'indigo',
    title: browser.i18n.getMessage('menuItemIndigo'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-indigo.png',
      32: 'icons/hl-indigo@2x.png'
    }
  },
  onCreated
)

browser.menus.create(
  {
    id: 'purple',
    title: browser.i18n.getMessage('menuItemPurple'),
    contexts: ['page', 'editable', 'frame', 'link', 'selection'],
    icons: {
      16: 'icons/hl-purple.png',
      32: 'icons/hl-purple@2x.png'
    }
  },
  onCreated
)
/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
  const id = info.menuItemId || 'red'
  let text = info.selectionText || ''
  text = text.trim()
  console.log(`${info.menuItemId}:${id}; ${info.selectionText}:${text}`)

  var getEnable = () => {
    return browser.storage.local.get({
      enable: false
    })
  }

  var setEnable = () => {
    return browser.storage.local.set({
      enable: true
    })
  }

  var setInfo = () => {
    return browser.storage.local.set({
      [id]: text
    })
  }

  var highlight = () => {
    return browser.tabs.executeScript({
      file: '/highlight.js',
      allFrames: true
    })
  }

  getEnable()
    .then(items => {
      console.log('get enable ok')
      if (items.enable === true) {
        setInfo()
          .then(() => {
            console.log('set info ok')
            return highlight()
          })
          .then(() => {
            console.log('exe script ok')
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        setEnable().then(() => {
          console.log('set enable ok')
          setInfo()
            .then(() => {
              console.log('set info ok')
              return highlight()
            })
            .then(() => {
              console.log('exe script ok')
            })
            .catch(e => {
              console.log(e)
            })
        })
      }
    })
    .catch(e => {
      console.log(e)
    })
})
