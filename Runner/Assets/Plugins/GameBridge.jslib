
mergeInto(LibraryManager.library, {
  NotifyGameResult: function(isWin) {
    if (window.onGameResult) {
      window.onGameResult(isWin === 1);
    }
  }
});