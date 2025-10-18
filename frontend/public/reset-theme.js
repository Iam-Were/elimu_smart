// Force light mode on load - reset dark mode localStorage
(function() {
  try {
    // Clear dark mode setting
    localStorage.removeItem('elimu-dark-mode');
    // Ensure dark class is removed
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    console.log('Theme reset to light mode');
  } catch (e) {
    console.warn('Could not reset theme:', e);
  }
})();
