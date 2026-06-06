mergeInto(LibraryManager.library, {
  OnMessageDelivered: function() {
    if (window.parent && window.parent.onGameResult) window.parent.onGameResult(true);
  },
  OnMessageFailed: function() {
    if (window.parent && window.parent.onGameResult) window.parent.onGameResult(false);
  }
});