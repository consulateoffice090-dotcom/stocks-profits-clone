/**
 * auth.js
 * Injected into login.html and register.html via Vite.
 * Intercepts form submissions and calls the local Express API.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://stocks-profits-clone.onrender.com/api/auth';

// ── LOGIN ────────────────────────────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = loginForm.querySelector('[name="email"]')?.value?.trim();
    const password = loginForm.querySelector('[name="password"]')?.value;
    const btn      = loginForm.querySelector('[type="submit"]');
    const errorEl  = getOrCreateError(loginForm);

    setLoading(btn, true);
    errorEl.textContent = '';

    try {
      const res  = await fetch(`${API_BASE}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        showError(errorEl, data.error || 'Login failed.');
        return;
      }

      // Store credentials
      localStorage.setItem('sp_token', data.token);
      localStorage.setItem('sp_user',  JSON.stringify(data.user));

      // Redirect to dashboard
      window.location.href = '/pages/dashboard.html';

    } catch (err) {
      showError(errorEl, 'Network error – is the server running?');
    } finally {
      setLoading(btn, false);
    }
  });
}

// ── REGISTER ─────────────────────────────────────────────────────────────────
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = registerForm.querySelector('[name="name"]')?.value?.trim();
    const email    = registerForm.querySelector('[name="email"]')?.value?.trim();
    const password = registerForm.querySelector('[name="password"]')?.value;
    const confirm  = registerForm.querySelector('[name="password_confirmation"]')?.value;
    const btn      = registerForm.querySelector('[type="submit"]');
    const errorEl  = getOrCreateError(registerForm);

    if (password !== confirm) {
      showError(errorEl, 'Passwords do not match.');
      return;
    }

    setLoading(btn, true);
    errorEl.textContent = '';

    try {
      const res  = await fetch(`${API_BASE}/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password, password_confirmation: confirm })
      });
      const data = await res.json();

      if (!res.ok) {
        showError(errorEl, data.error || 'Registration failed.');
        return;
      }

      localStorage.setItem('sp_token', data.token);
      localStorage.setItem('sp_user',  JSON.stringify(data.user));

      window.location.href = '/pages/dashboard.html';

    } catch (err) {
      showError(errorEl, 'Network error – is the server running?');
    } finally {
      setLoading(btn, false);
    }
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getOrCreateError(form) {
  let el = form.querySelector('.sp-api-error');
  if (!el) {
    el = document.createElement('div');
    el.className = 'sp-api-error';
    el.style.cssText = `
      margin: 12px 0; padding: 12px 16px; border-radius: 10px;
      background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.3);
      color: #f87171; font-size: 14px; font-weight: 500;
    `;
    const submitBtn = form.querySelector('[type="submit"]');
    form.insertBefore(el, submitBtn?.closest('div') || submitBtn);
  }
  return el;
}

function showError(el, msg) {
  el.textContent = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn._origText = btn._origText || btn.innerHTML;
  btn.innerHTML = loading
    ? `<svg style="width:18px;height:18px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/></svg>&nbsp;Processing…`
    : btn._origText;
}
