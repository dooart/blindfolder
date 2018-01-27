/* global chrome */

var DOMAINS = ['hundred5.com', 'github.com', 'linkedin.com']

chrome.browserAction.onClicked.addListener(function () {
  chrome.storage.sync.get('blindfolderEnabled', function (values) {
    chrome.storage.sync.set({ blindfolderEnabled: !values.blindfolderEnabled })
  })
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (!('blindfolderEnabled' in changes)) return

  var enabled = changes.blindfolderEnabled.newValue
  updateIcon(enabled)
})

chrome.storage.sync.get('blindfolderEnabled', function (values) {
  updateIcon(values.blindfolderEnabled)
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  var isWatchedDomain = DOMAINS.some(function (domain) { return tab.url.match(domain) })
  if (!isWatchedDomain) return

  if ('title' in changeInfo) {
    chrome.tabs.sendMessage(tabId, { type: 'BLINDFOLDER_TITLE_CHANGE', value: changeInfo.title })
  }

  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: 'BLINDFOLDER_URL_CHANGE', value: tab.url })
  }
})

function updateIcon (enabled) {
  var iconBase = enabled ? 'icons/enabled' : 'icons/disabled'
  chrome.browserAction.setIcon({
    path: {
      '19': iconBase + '-19.png',
      '38': iconBase + '-38.png',
      '128': iconBase + '-128.png'
    }
  })
}
