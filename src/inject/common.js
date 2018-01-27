/* global chrome */

var originalHtmlTitle = null
var originalUrl = null

chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)

      originalHtmlTitle = document.title
      originalUrl = window.location.href

      chrome.storage.sync.get('blindfolderEnabled', function (values) {
        updateEnabled(values.blindfolderEnabled)
      })
    }
  }, 10)
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (!('blindfolderEnabled' in changes)) return

  var enabled = changes.blindfolderEnabled.newValue
  updateEnabled(enabled)
})

chrome.runtime.onMessage.addListener(function (request) {
  var titleChange = request.type === 'BLINDFOLDER_TITLE_CHANGE'
  var urlChange = request.type === 'BLINDFOLDER_URL_CHANGE'
  if (!titleChange && !urlChange) return

  chrome.storage.sync.get('blindfolderEnabled', function (values) {
    if (!values.blindfolderEnabled) return

    var options = window.blindfolderOptions
    if (titleChange) updateHtmlTitle(true, options)
    if (urlChange) updateUrl(true, options)
  })
})

function updateEnabled (enabled) {
  var className = 'blindfolder-disabled'
  var operation = enabled ? 'remove' : 'add'
  document.body.classList[operation](className)

  chrome.runtime.sendMessage({
    action: 'updateIcon',
    value: enabled
  })

  var options = window.blindfolderOptions
  updateHtmlTitle(enabled, options)
  updateUrl(enabled, options)
}

function updateHtmlTitle (enabled, options) {
  if (!options.shouldHideHtmlTitle) return

  var hiddenHtmlTitle = options.pageName || 'xxxxxxxxxxx'
  var newTitle = enabled ? hiddenHtmlTitle : originalHtmlTitle
  if (document.title !== newTitle) document.title = newTitle
}

function updateUrl (enabled, options) {
  if (!options.shouldHideUrl) return

  var path = location.pathname
  var hiddenUrl = '/x.x'
  var newUrl = enabled ? hiddenUrl : originalUrl
  if (newUrl !== path) window.history.replaceState({}, '', newUrl)
}
