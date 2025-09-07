/* =============================
   PORTFÓLIO • INTERAÇÕES JS
   ============================= */

const Utils = {
  debounce(fn, wait = 200) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  },
  throttle(fn, limit = 100) {
    let inThrottle = false; return (...args) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } };
  },
  isEmail(str) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str); }
};

class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.init();
  }
  init() { this.setupScrollSpy(); this.setupSmooth(); this.setupNavbarBg(); }
  setupScrollSpy() {
    const update = Utils.throttle(() => {
      const y = window.pageYOffset + 120;
      let current = '';
      this.sections.forEach(sec => {
        if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) current = sec.id;
      });
      this.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }, 100);
    window.addEventListener('scroll', update);
    update();
  }
  setupSmooth() {
    this.navLinks.forEach(link => link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    }));
  }
  setupNavbarBg() {
    const onScroll = Utils.throttle(() => {
      if (!this.navbar) return;
      this.navbar.style.background = window.scrollY > 80 ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.9)';
    }, 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }
}

class SkillsAnimation {
  constructor() { this.bars = document.querySelectorAll('.skill-progress'); this.init(); }
  init() {
    if (!this.bars.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const bar = en.target; const w = bar.getAttribute('data-width');
          requestAnimationFrame(() => { bar.style.width = `${w}%`; });
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    this.bars.forEach(b => obs.observe(b));
  }
}

class FormValidation {
  constructor() { this.form = document.querySelector('.contact-form form'); this.init(); }
  init() { if (this.form) this.form.addEventListener('submit', (e) => this.onSubmit(e)); }
  onSubmit(e) {
      e.preventDefault();
    const data = new FormData(this.form);
    const name = String(data.get('name')||'').trim();
    const email = String(data.get('email')||'').trim();
    const subject = String(data.get('subject')||'').trim();
    const message = String(data.get('message')||'').trim();
    if (name.length < 2) return this.notify('Nome deve ter pelo menos 2 caracteres', 'error');
    if (!Utils.isEmail(email)) return this.notify('Informe um e-mail válido', 'error');
    if (subject.length < 3) return this.notify('Assunto deve ter pelo menos 3 caracteres', 'error');
    if (message.length < 10) return this.notify('Mensagem deve ter pelo menos 10 caracteres', 'error');
    this.submit();
  }
  async submit() {
    const btn = this.form.querySelector('button[type="submit"]');
    const old = btn.innerHTML; btn.innerHTML = 'Enviando...'; btn.disabled = true;
    try {
      await new Promise(r => setTimeout(r, 1200));
      this.notify('Mensagem enviada com sucesso!', 'success');
      this.form.reset();
    } catch(e) {
      this.notify('Ocorreu um erro. Tente novamente.', 'error');
    } finally { btn.innerHTML = old; btn.disabled = false; }
  }
  notify(msg, type = 'info') {
    const el = document.createElement('div');
    el.textContent = msg; el.role = 'status';
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    el.style.cssText = `position:fixed;top:20px;right:20px;z-index:2000;padding:12px 16px;border-radius:10px;font-weight:800;color:#fff;transform:translateX(120%);transition:.3s;background:${colors[type]||colors.info}`;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translateX(0)'; });
    setTimeout(() => { el.style.transform = 'translateX(120%)'; setTimeout(() => el.remove(), 300); }, 3200);
  }
}

class BackToTop {
  constructor() { this.btn = document.getElementById('backToTop'); this.init(); }
  init() {
    if (!this.btn) return;
    const onScroll = Utils.throttle(() => {
      if (window.scrollY > 300) this.btn.classList.add('visible'); else this.btn.classList.remove('visible');
    }, 100);
    window.addEventListener('scroll', onScroll);
    this.btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }
}

class TypeWriter {
  constructor(selector, text, speed = 75, startDelay = 400) {
    this.el = document.querySelector(selector);
    this.text = text;
    this.speed = speed;
    this.startDelay = startDelay;
    this.index = 0;
    this.init();
  }
  init() {
    if (!this.el) return;
    setTimeout(() => this.type(), this.startDelay);
  }
  type() {
    if (this.index <= this.text.length) {
      this.el.textContent = this.text.slice(0, this.index++);
      setTimeout(() => this.type(), this.speed);
    }
  }
}

class VantaBackground {
  constructor() { this.el = document.getElementById('vanta-bg'); this.init(); }
  init() {
    const start = () => {
      if (!this.el || typeof VANTA === 'undefined') return;
      VANTA.GLOBE({ el: this.el, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200.00, minWidth: 200.00, scale: 1.0, scaleMobile: 1.0, color: 0xfbbf24, color2: 0x6366f1, backgroundColor: 0x0f172a, size: 1.0, speed: 1.0 });
    };
    if (typeof VANTA !== 'undefined') start(); else setTimeout(start, 800);
  }
}

class App {
  constructor() { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => this.init()) : this.init(); }
  init() {
    new Navigation();
    new SkillsAnimation();
    new FormValidation();
    new BackToTop();
    new TypeWriter('#typing', 'Front-end developer', 70, 500);
    new VantaBackground();
    if (typeof AOS !== 'undefined') AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 100 });
    if (typeof feather !== 'undefined') feather.replace();
    const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}

new App();
