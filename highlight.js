function main () {
  var enable
  var rainbow
  const rainbowColor = {
    red: '#ff8a80',
    orange: '#ffd180',
    yellow: '#ffff8d',
    green: '#b9f6ca',
    blue: '#80d8ff',
    indigo: '#8c9eff',
    purple: '#ea80fc'
  }

  function highlight (node, word, color) {
    if (node.parentElement.className === 'HL-7') return false

    const value = node.nodeValue
    if (value.indexOf(word) === -1) return false

    let forward = false
    const parent = node.parentElement
    const index = value.indexOf(word)
    if (index !== 0) {
      const before = document.createTextNode(value.substr(0, index))
      parent.insertBefore(before, node)
      forward = true
    }

    const middle = document.createElement('span')
    middle.className = 'HL-7'
    middle.style.backgroundColor = color
    middle.style.borderRadius = '4px'
    middle.appendChild(
      document.createTextNode(value.substr(index, word.length))
    )
    parent.insertBefore(middle, node)

    if (value.length !== index + word.length) {
      const after = document.createTextNode(value.substr(index + word.length))
      parent.insertBefore(after, node)
    }

    parent.removeChild(node)

    return forward
  }

  function hlWord (node, word, color) {
    if (Node.TEXT_NODE !== node.nodeType) {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (hlWord(node.childNodes[i], word, color) === true) i++
      }
    } else {
      return highlight(node, word, color)
    }
    return false
  }

  function hlRainbow () {
    for (const key in rainbow) {
      if (rainbow[key] === '') continue
      hlWord(document.body, rainbow[key], rainbowColor[key])
    }
  }

  function dim (node, word) {
    if (node.nodeValue !== word) return

    let content = ''
    const p = node.parentElement
    const pp = p.parentElement
    const pps = p.previousSibling
    if (pps !== null && pps.className !== 'HL-7' && pps.nodeType === 3) {
      content = pps.nodeValue
      pp.removeChild(pps)
    }
    content += word
    const pns = p.nextSibling
    if (pns !== null && pns.className !== 'HL-7' && pns.nodeType === 3) {
      content += pns.nodeValue
      pp.removeChild(pns)
    }
    const newNode = document.createTextNode(content)
    pp.replaceChild(newNode, p)
  }

  function dimWord (node, word) {
    if (Node.TEXT_NODE !== node.nodeType) {
      for (let i = 0, len = node.childNodes.length; i < len; i++) {
        dimWord(node.childNodes[i], word)
        if (len > node.childNodes.length) {
          i--
          len = node.childNodes.length
        }
      }
    } else {
      dim(node, word)
    }
  }

  function dimRainbow () {
    for (const key in rainbow) {
      if (rainbow[key] === '') continue
      dimWord(document.body, rainbow[key])
    }
  }

  browser.storage.local
    .get({
      enable: false
    })
    .then(function (items) {
      enable = items.enable
    })
    .catch(function (e) {
      console.log(e)
    })

  browser.storage.local
    .get({
      red: '',
      orange: '',
      yellow: '',
      green: '',
      blue: '',
      indigo: '',
      purple: ''
    })
    .then(items => {
      rainbow = items
      if (enable === true) hlRainbow()
    })
    .catch(e => {
      console.log(e)
    })

  // function storageChangeListener (changes, area) {
  //   if (area !== 'local') return

  //   // Here we can assumpt there's only one change occured
  //   const key = Object.keys(changes)[0]
  //   const oldValue = changes[key].oldValue
  //   const newValue = changes[key].newValue
  //   console.log(
  //     'key: ' + key + ' oldValue: ' + oldValue + ' newValue: ' + newValue
  //   )
  //   if (key === 'enable') {
  //     if (newValue === true) {
  //       enable = true
  //       hlRainbow()
  //     } else {
  //       enable = false
  //       dimRainbow()
  //     }
  //     return
  //   }

  //   if (oldValue !== '' && enable === true) {
  //     dimWord(document.body, oldValue)
  //   }
  //   if (newValue !== '' && enable === true) {
  //     hlWord(document.body, newValue, rainbowColor[key])
  //   }

  //   for (const kxy in rainbow) {
  //     if (key === kxy) {
  //       rainbow[kxy] = newValue
  //     }
  //   }
  // }

  function storageChangeListener (changes, area) {
    if (area !== 'local') return

    for (const key in changes) {
      const oldValue = changes[key].oldValue || ''
      const newValue = changes[key].newValue || ''
      console.log(
        'key: ' + key + ' oldValue: ' + oldValue + ' newValue: ' + newValue
      )
      if (key === 'enable') {
        newValue === true ? hlRainbow() : dimRainbow()
        enable = newValue
      } else {
        if (oldValue !== '' && enable === true) {
          dimWord(document.body, oldValue)
        }
        if (newValue !== '' && enable === true) {
          hlWord(document.body, newValue, rainbowColor[key])
        }
        rainbow[key] = newValue
      }
    }
  }
  browser.storage.onChanged.addListener(storageChangeListener)
}
// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         if (mutation.addedNodes && mutation.addedNodes.length > 0) {
//             // This DOM change was new nodes being added. Run our substitution
//             // algorithm on each newly added node.
//             for (let i = 0; i < mutation.addedNodes.length; i++) {
//                 const newNode = mutation.addedNodes[i];
//                 highlight(newNode);
//             }
//         }
//     });
// });
// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// })

var running
if (running === undefined) {
  main()
  running = true
  console.log('first time run highlight.js on this page')
} else {
  console.log('try to run highlight.js again on same page')
}
