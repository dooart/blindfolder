/* global chrome */

chrome.browserAction.onClicked.addListener(function () {
  chrome.storage.sync.get('blindfolderEnabled', function ({ blindfolderEnabled }) {
    chrome.storage.sync.set({ 'blindfolderEnabled': !blindfolderEnabled })
  })
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (!('blindfolderEnabled' in changes)) return

  var enabled = changes.blindfolderEnabled.newValue
  var iconBase = enabled ? 'icons/enabled' : 'icons/disabled'
  chrome.browserAction.setIcon({
    path: {
      '19': iconBase + '-19.png',
      '38': iconBase + '-38.png',
      '128': iconBase + '-128.png'
    }
  })
})
