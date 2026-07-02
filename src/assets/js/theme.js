// Theme toggle — persists choice, respects OS preference on first visit.
(function () {
  var root = document.documentElement;
  function current() { return root.getAttribute('data-theme') || 'light'; }
  function set(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    set(current() === 'dark' ? 'light' : 'dark');
  });
})();
