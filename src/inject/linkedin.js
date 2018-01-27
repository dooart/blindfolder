/* global chrome */

chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)

      window.history.pushState('xxxxxxxxx', 'xxxxxxxxx', '/xxxxxxxxx')
      document.title = 'xxxxxxxxx'
    }
  }, 10)
})