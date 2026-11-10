/* Tema compartido y Preset Cósmico: sincronización de temas, botón de alternancia y Starfield cósmico */
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

    if (window.__cosmicRenderStarfield) {
      window.__cosmicRenderStarfield();
    }
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

  /* ==========================================================================
     MOTOR CÓSMICO DE ESTRELLAS Y NEBULOSA (PRESET OFICIAL MATH LAB)
     ========================================================================== */
  const setupStarfield = () => {
    if (window.__cosmicStarfieldActive || document.getElementById('cosmicStarfield')) return;
    window.__cosmicStarfieldActive = true;

    const STAR_COLORS_DARK = [
      '#ffffff',
      '#e0e7ff',
      '#93c5fd',
      '#c4b5fd',
      '#7dd3fc',
      '#fde68a'
    ];

    const STAR_COLORS_LIGHT = [
      '#e11d48',
      '#f43f5e',
      '#7c3aed',
      '#0284c7',
      '#ea580c',
      '#059669',
      '#be123c',
      '#d946ef'
    ];

    let canvas = null;
    let ctx = null;
    let animationFrameId = null;
    let stars = [];
    let width = 0;
    let height = 0;
    let isRunning = false;
    let scrollY = window.scrollY || 0;

    const STAR_COUNT_DESKTOP = 160;
    const STAR_COUNT_MOBILE = 80;

    const isLightMode = () => document.documentElement.getAttribute('data-theme') === 'light';
    const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Secuencia Halton 2D con bases coprimas (2 y 3) para máxima dispersión uniforme sin alineaciones
    const halton = (index, base) => {
      let result = 0;
      let f = 1 / base;
      let i = index;
      while (i > 0) {
        result += f * (i % base);
        i = Math.floor(i / base);
        f /= base;
      }
      return result;
    };

    const hash = (n) => {
      const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
      return s - Math.floor(s);
    };

    const initStars = (count) => {
      stars = [];
      for (let i = 0; i < count; i++) {
        const idx = i + 1;
        const rawX = (halton(idx, 2) + (hash(i * 3 + 1) - 0.5) * 0.06 + 1) % 1;
        const rawY = (halton(idx, 3) + (hash(i * 7 + 5) - 0.5) * 0.06 + 1) % 1;

        const isBright = i % 11 === 0;
        const h3 = hash(i * 13 + 7);
        const h4 = hash(i * 19 + 3);

        stars.push({
          x: rawX * 0.96 + 0.02,
          y: rawY * 0.96 + 0.02,
          size: isBright ? 1.8 + h3 * 0.9 : 0.7 + h4 * 1.15,
          baseAlpha: isBright ? 0.7 + h3 * 0.3 : 0.22 + h4 * 0.45,
          twinkleSpeed: 0.65 + h3 * 1.8,
          twinklePhase: i * 2.39996 + h4 * 6.28,
          colorIdx: i % STAR_COLORS_LIGHT.length,
          isCross: isBright,
          parallax: isBright ? 0.28 : 0.12 + h3 * 0.12
        });
      }
    };

    const resize = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = width < 768 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
      if (stars.length !== targetCount) {
        initStars(targetCount);
      }
    };

    const render = (timeMs) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isLight = isLightMode();
      const starPalette = isLight ? STAR_COLORS_LIGHT : STAR_COLORS_DARK;
      const timeSec = (timeMs || performance.now()) * 0.001;
      const scrollShift = scrollY * 0.00035;

      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];

        const sx = st.x * width;
        let sy = (st.y - scrollShift * st.parallax) % 1;
        if (sy < 0) sy += 1;
        sy = sy * height;

        const twinkle = 0.55 + 0.45 * Math.sin(timeSec * st.twinkleSpeed + st.twinklePhase);
        const alpha = Math.min(1, st.baseAlpha * twinkle * (isLight ? 1.25 : 1.12));

        if (alpha < 0.03) continue;

        const color = starPalette[st.colorIdx % starPalette.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;

        const r = isLight ? st.size * 1.15 : st.size;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        if (st.isCross && twinkle > 0.65) {
          const flare = r * (2.4 + twinkle * 1.8);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.85;
          ctx.globalAlpha = alpha * 0.65;
          ctx.beginPath();
          ctx.moveTo(sx - flare, sy);
          ctx.lineTo(sx + flare, sy);
          ctx.moveTo(sx, sy - flare);
          ctx.lineTo(sx, sy + flare);
          ctx.stroke();
        }
      }

      if (isRunning && !prefersReducedMotion()) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      if (prefersReducedMotion()) {
        render(1000);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    window.__cosmicRenderStarfield = () => {
      if (prefersReducedMotion()) {
        render(1000);
      }
    };

    // 1. Inyectar nebulosa suave en modo claro
    if (!document.querySelector('.cosmic-nebula')) {
      const neb = document.createElement('div');
      neb.className = 'cosmic-nebula';
      neb.setAttribute('aria-hidden', 'true');
      document.body.prepend(neb);
    }

    // 2. Inyectar canvas interactivo
    canvas = document.createElement('canvas');
    canvas.id = 'cosmicStarfield';
    canvas.className = 'cosmic-starfield-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    ctx = canvas.getContext('2d', { alpha: true });

    resize();
    startLoop();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        stopLoop();
      } else {
        startLoop();
      }
    });
  };

  const initAll = () => {
    setupToggle();
    setupStarfield();
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
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();

