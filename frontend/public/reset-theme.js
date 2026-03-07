(function () {
  try {
    var dark = localStorage.getItem('elimu-dark-mode');
    if (dark === 'true') {
      document.documentElement.classList.add('dark');
    } else if (dark === null) {
      // No saved preference — respect system setting
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // localStorage unavailable (private browsing etc.) — default to light
  }
})();
