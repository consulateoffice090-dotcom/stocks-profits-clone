/**
 * dashboard-shell.js
 * Injected into all subpages to wrap them in the dashboard sidebar/topbar if logged in.
 */

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('sp_token');
  const userData = JSON.parse(localStorage.getItem('sp_user') || 'null');

  if (!token || !userData) {
    // User is not logged in: let the public page load normally
    return;
  }

  // User is logged in: replace public content with the dashboard version
  const template = document.getElementById('dashboard-content');
  if (!template) return;

  // Add dashboard active class to html/body
  document.documentElement.className = 'dark';
  
  // Clear body and build the dashboard shell
  const body = document.body;
  body.innerHTML = '';
  body.className = 'antialiased text-gray-200 bg-gray-900 font-sans min-h-screen';

  // Inject CSS styles for dashboard shell
  const style = document.createElement('style');
  style.textContent = `
    .sidebar {
      position: fixed; inset-y: 0; left: 0; width: 260px;
      background: linear-gradient(180deg, #0d1526 0%, #0a0f1a 100%);
      border-right: 1px solid rgba(99,102,241,.15);
      display: flex; flex-direction: column; z-index: 100;
    }
    .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,.06); display: flex; align-items: center; gap: 10px; }
    .sidebar-logo img { height: 36px; }
    .sidebar-logo span { font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #6366f1, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-section-label { font-size: 10px; font-weight: 600; letter-spacing: .12em; color: #4b5563; text-transform: uppercase; padding: 20px 20px 6px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 14px; font-weight: 500; color: #9ca3af; border-radius: 8px; margin: 2px 10px; text-decoration: none; transition: all .2s; cursor: pointer; }
    .nav-item:hover, .nav-item.active { background: rgba(99,102,241,.12); color: #a5b4fc; }
    .nav-item.active { border-left: 3px solid #6366f1; padding-left: 17px; }
    .nav-item i { width: 18px; height: 18px; }
    .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,.06); }
    .user-pill { display: flex; align-items: center; gap: 10px; background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.2); border-radius: 12px; padding: 10px 14px; }
    .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #38bdf8); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
    .user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .user-email { font-size: 11px; color: #6b7280; }

    .main { margin-left: 260px; min-height: 100vh; display: flex; flex-direction: column; }
    .topbar { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; background: rgba(10,15,26,.9); border-bottom: 1px solid rgba(255,255,255,.06); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
    .topbar-title { font-size: 20px; font-weight: 700; color: #f8fafc; }
    .topbar-actions { display: flex; align-items: center; gap: 10px; }
    .balance-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(56,189,248,.12)); border: 1px solid rgba(99,102,241,.25); font-size: 13px; font-weight: 700; color: #a5b4fc; }
    .logout-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25); color: #f87171; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
    .logout-btn:hover { background: rgba(239,68,68,.18); }
    .content { padding: 28px; flex: 1; }

    @media (max-width: 1100px) { .main { margin-left: 0; } .sidebar { transform: translateX(-100%); } }
  `;
  document.head.appendChild(style);

  // Determine current active route for active class styling
  const path = window.location.pathname;
  const isTab = (route) => path.includes(route) ? 'active' : '';

  // Construct Sidebar & Topbar
  const root = document.createElement('div');
  root.id = 'dashboard-root';
  root.innerHTML = `
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="https://stocks-profits.com/storage/app/public/photos/FyibsoaDkdkNVvYYJKmGqdoe0D3KJ84mQNjoyJ0K.png" alt="Logo" />
        <span>Stocks Profits</span>
      </div>
      <p class="nav-section-label">Overview</p>
      <a class="nav-item ${isTab('dashboard.html')}" href="/pages/dashboard.html"><i data-lucide="layout-dashboard"></i> Dashboard</a>
      <a class="nav-item ${isTab('deposit.html')}" href="/pages/deposit.html"><i data-lucide="download"></i> Deposit</a>
      <a class="nav-item ${isTab('trade.html')}" href="/pages/trade.html"><i data-lucide="candlestick-chart"></i> Trade</a>

      <p class="nav-section-label">Markets</p>
      <a class="nav-item ${isTab('forex.html')}" href="/pages/forex.html"><i data-lucide="dollar-sign"></i> Forex</a>
      <a class="nav-item ${isTab('cryptocurrencies.html')}" href="/pages/cryptocurrencies.html"><i data-lucide="bitcoin"></i> Crypto</a>
      <a class="nav-item ${isTab('shares.html')}" href="/pages/shares.html"><i data-lucide="trending-up"></i> Shares</a>
      <a class="nav-item ${isTab('etfs.html')}" href="/pages/etfs.html"><i data-lucide="bar-chart-2"></i> ETFs</a>
      <a class="nav-item ${isTab('indices.html')}" href="/pages/indices.html"><i data-lucide="activity"></i> Indices</a>

      <p class="nav-section-label">Tools</p>
      <a class="nav-item ${isTab('automate.html')}" href="/pages/automate.html"><i data-lucide="bot"></i> Automate</a>
      <a class="nav-item ${isTab('copy.html')}" href="/pages/copy.html"><i data-lucide="copy"></i> Copy Trading</a>

      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="user-avatar" id="sidebar-avatar">U</div>
          <div>
            <div class="user-name" id="sidebar-name">Loading…</div>
            <div class="user-email" id="sidebar-email"></div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Frame -->
    <div class="main">
      <header class="topbar">
        <div>
          <div class="topbar-title" id="page-topbar-title">Stocks Profits</div>
          <div style="font-size:12px;color:#4b5563;margin-top:2px" id="page-topbar-subtitle">Trading Platform</div>
        </div>
        <div class="topbar-actions">
          <div class="balance-pill">
            <i data-lucide="wallet" style="width:14px;height:14px"></i>
            <span id="topbar-balance">$0.00</span>
          </div>
          <button class="logout-btn" id="logout-btn">
            <i data-lucide="log-out" style="width:14px;height:14px"></i> Logout
          </button>
        </div>
      </header>

      <main class="content" id="dashboard-content-area"></main>
    </div>
  `;

  body.appendChild(root);

  // Populate User Info
  const initials = (userData.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('sidebar-name').textContent = userData.name || 'Trader';
  document.getElementById('sidebar-email').textContent = userData.email || '';
  const balance = userData.balance != null ? parseFloat(userData.balance).toLocaleString('en-US', { style:'currency', currency:'USD' }) : '$0.00';
  document.getElementById('topbar-balance').textContent = balance;

  // Logout Handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    window.location.href = '/pages/login.html';
  });

  // Inject active dashboard template content
  const contentArea = document.getElementById('dashboard-content-area');
  contentArea.appendChild(template.content.cloneNode(true));

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Load TradingView script dynamically if needed, then run initializer
  if (typeof TradingView === 'undefined') {
    const tvScript = document.createElement('script');
    tvScript.src = 'https://s3.tradingview.com/tv.js';
    tvScript.onload = () => {
      if (typeof window.initDashboardPage === 'function') {
        window.initDashboardPage({ token, userData });
      }
    };
    document.head.appendChild(tvScript);
  } else {
    if (typeof window.initDashboardPage === 'function') {
      window.initDashboardPage({ token, userData });
    }
  }
});
