// helper
document.getElementById('logo').onclick = function () {
  console.log('logo btn is clicked')
  browser.tabs
    .create({
      url: 'https://www.patreon.com/xenkuo'
    })
    .then(tab => {
      console.log(`Created new tab: ${tab.id}`)
    })
    .catch(e => {
      console.log(e)
    })
}

document.getElementById('clear').onclick = function () {
  console.log('clear btn is clicked')

  browser.storage.local
    .clear()
    .then(() => {
      document.getElementById('red').value = ''
      document.getElementById('orange').value = ''
      document.getElementById('yellow').value = ''
      document.getElementById('green').value = ''
      document.getElementById('blue').value = ''
      document.getElementById('indigo').value = ''
      document.getElementById('purple').value = ''
      document.getElementById('enable').checked = false
    })
    .catch(e => {
      console.log(e)
    })
}

window.onload = function () {
  console.log('window onload')

  browser.storage.local
    .get()
    .then(items => {
      console.log(items)
      document.getElementById('red').value = items.red || ''
      document.getElementById('orange').value = items.orange || ''
      document.getElementById('yellow').value = items.yellow || ''
      document.getElementById('green').value = items.green || ''
      document.getElementById('blue').value = items.blue || ''
      document.getElementById('indigo').value = items.indigo || ''
      document.getElementById('purple').value = items.purple || ''
      document.getElementById('enable').checked = items.enable || false
    })
    .catch(e => {
      console.log(e)
    })

  browser.tabs
    .executeScript({
      file: '/highlight.js',
      allFrames: true
    })
    .then(result => {
      console.log(result)
    })
    .catch(e => {
      console.log(e)
    })
}

window.onchange = function (e) {
  const id = e.target.id
  let value = e.target.value.trim()

  if (id !== 'enable') {
    browser.storage.local
      .set({
        [id]: value
      })
      .then(this.storeSetOk, this.storeError)
  } else {
    value = e.target.checked
    browser.storage.local
      .set({
        [id]: value
      })
      .then(this.storeSetOk, this.storeError)
  }
}
