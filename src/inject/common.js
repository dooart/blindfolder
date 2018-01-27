/* global chrome */

chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)

      chrome.storage.sync.get('blindfolderEnabled', function ({ blindfolderEnabled }) {
        updateEnabled(blindfolderEnabled)
      })
    }
  }, 10)
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (!('blindfolderEnabled' in changes)) return

  var enabled = changes.blindfolderEnabled.newValue
  updateEnabled(enabled)
})

function updateEnabled (enabled) {
  var className = 'blindfolder-disabled'
  var operation = enabled ? 'remove' : 'add'
  document.body.classList[operation](className)

  chrome.runtime.sendMessage({
    action: 'updateIcon',
    value: enabled
  })
}
