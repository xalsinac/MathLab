/* Tema compartido: mantiene la preferencia entre páginas y sincronizado con Math Universe y Math Dojo. */
(() => {
  const UNIVERSE_KEY = 'math-universe-theme';
  const LAB_KEY = 'mathlab_theme';
  const DOJO_KEY = 'mathdojo_theme';

  const getTheme = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme');
      if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme;

      const u = localStorage.getItem(UNIVERSE_KEY);
      if (u === 'light' || u === 'dark') return u;
      const l = localStorage.getItem(LAB_KEY);
      if (l === 'light' || l === 'dark') return l;
      const d = localStorage.getItem(DOJO_KEY);
      if (d === 'light' || d === 'dark') return d;
    } catch (_) {}
    return 'dark';
  };

  const updateCrossLinks = (theme) => {
    try {
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
        try {
          const url = new URL(href, window.location.href);
          if (url.origin === window.location.origin || url.hostname.includes('vercel.app')) {
            url.searchParams.set('theme', theme);
            if (url.origin === window.location.origin && !href.startsWith('http')) {
              const relativePath = href.split('?')[0].split('#')[0];
              const hash = href.includes('#') ? '#' + href.split('#')[1] : '';
              a.setAttribute('href', `${relativePath}?theme=${theme}${hash}`);
            } else {
              a.setAttribute('href', url.toString());
            }
          }
        } catch (_) {}
      });
    } catch (_) {}
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(UNIVERSE_KEY, theme);
      localStorage.setItem(LAB_KEY, theme);
      localStorage.setItem(DOJO_KEY, theme);
    } catch (_) {}
    updateCrossLinks(theme);
  };

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    const icon = document.getElementById('theme-icon');
    const button = document.getElementById('theme-toggle');
    if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
    if (button) {
      button.setAttribute('aria-label', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
      button.setAttribute('title', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f2f0ea' : '#101116');
  };

  const currentTheme = getTheme();
  saveTheme(currentTheme);
  applyTheme(currentTheme);

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
    button.removeAttribute('onclick');
    button.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      saveTheme(next);
      applyTheme(next);
    });
    applyTheme(getTheme());
    updateCrossLinks(getTheme());
  };

  window.addEventListener('storage', (e) => {
    if (e.key === LAB_KEY || e.key === UNIVERSE_KEY || e.key === DOJO_KEY) {
      const t = getTheme();
      applyTheme(t);
      updateCrossLinks(t);
    }
  });

  window.addEventListener('pageshow', () => {
    const t = getTheme();
    applyTheme(t);
    updateCrossLinks(t);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggle, { once: true });
  } else {
    setupToggle();
  }
})();
