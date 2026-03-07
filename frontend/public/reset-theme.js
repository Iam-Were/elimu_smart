(function () {
  try {
    var dark = localStorage.getItem('darkMode');
    if (dark === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // localStorage unavailable (private browsing etc.) — default to light
  }
})();
