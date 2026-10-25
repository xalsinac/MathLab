/* Tema compartido: mantiene la preferencia entre páginas y dispositivos. */
(() => {
  const storageKey = 'mathlab_theme';
  const getTheme = () => {
    try { return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark'; }
    catch (_) { return 'dark'; }
  };
  const applyTheme = (theme) => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    const icon = document.getElementById('theme-icon');
    const button = document.getElementById('theme-toggle');
    if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
    if (button) {
      button.setAttribute('aria-label', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
      button.setAttribute('title', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
    }
  };

  applyTheme(getTheme());

  const setupToggle = () => {
    let button = document.getElementById('theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.id = 'theme-toggle';
      button.className = 'mathlab-theme-toggle';
      button.type = 'button';
      button.innerHTML = '<span id="theme-icon" aria-hidden="true">☀️</span>';
      document.body.appendChild(button);
    }
    // El controlador compartido evita depender de una función definida en index.html.
    button.removeAttribute('onclick');
    button.addEventListener('click', () => {
      const next = getTheme() === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(storageKey, next); } catch (_) {}
      applyTheme(next);
    });
    applyTheme(getTheme());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggle, { once: true });
  } else {
    setupToggle();
  }
})();
