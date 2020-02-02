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
      console.error(e)
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
      console.error(e)
    })

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
      } else if (key === 'random') {
        if (document.hidden === true) continue
        if (enable !== true) {
          browser.storage.local
            .set({
              enable: true
            })
            .then(() => {
              console.log('random enabled')
              let color = 'auto'
              const items = Object.keys(rainbow)
              for (const item of items) {
                if (rainbow[item] === '') {
                  color = item
                  break
                }
              }
              if (color === 'auto') {
                color = items[new Date().getTime() % 7]
              }

              const text = window.top.getSelection().toString()
              browser.storage.local.set({
                [color]: text
              })
            })
            .then(() => {
              console.log('random color settle down')
            })
            .catch(e => {
              console.error(e)
            })
        } else {
          let color = 'auto'
          const items = Object.keys(rainbow)
          for (const item of items) {
            if (rainbow[item] === '') {
              color = item
              break
            }
          }
          if (color === 'auto') {
            color = items[new Date().getTime() % 7]
          }

          const text = window.top.getSelection().toString()
          browser.storage.local
            .set({
              [color]: text
            })
            .then(() => {
              console.log('random color settle down')
            })
            .catch(e => {
              console.error(e)
            })
        }
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

var running
if (running === undefined) {
  main()
  running = true
  console.log('first time run highlight.js on this page')
} else {
  console.log('try to run highlight.js again on same page')
}
