// helper
document.getElementById('logo').onclick = function () {
  console.log('logo btn is clicked')
  browser.tabs
    .create({
      url: 'https://github.com/imbeder/highlight-7'
    })
    .then(function (tab) {
      console.log(`Created new tab: ${tab.id}`)
    })
    .catch(function (e) {
      console.log(e)
    })
}

window.onload = function () {
  console.log('window onload')

  browser.storage.local
    .get()
    .then(function (items) {
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
    .catch(function (e) {
      console.log(e)
    })

  browser.tabs
    .executeScript({
      file: '/highlight.js',
      allFrames: true
    })
    .then(function (result) {
      console.log(result)
    })
    .catch(function (e) {
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
