// Shared topbar + footer for all CCD internal tool pages.
// Mount: <header data-chrome="topbar"></header> ... <footer data-chrome="footer"></footer>
// Then: <script type="module" src="https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/chrome.js"></script>

const BASE = 'https://ccd-brb.vercel.app';

const TOOLS = [
  { href: `${BASE}/onboarding/`, label: 'Newcomer Motivation Check-Up', status: 'Live', cls: '' },
  { href: `${BASE}/sounding-board/`, label: 'Sounding Board', status: 'Beta', cls: 'beta' },
  { href: `${BASE}/multi-rater/`, label: '360 Multi-Rater', status: 'Coming Soon', cls: 'planning' },
];

const CHROME_CSS = `
  body{background:var(--paper-tint)}
  header[data-chrome="topbar"]{position:sticky;top:0;z-index:50}
  .ccd-topbar{
    background:var(--paper);border-bottom:1px solid var(--rule);
    padding:0 24px;
    display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;
    height:44px;
  }
  .ccd-topbar .brand{
    justify-self:start;display:flex;align-items:center;height:100%;line-height:0;
    color:var(--ink);text-decoration:none;font-weight:var(--fw-semi,600);letter-spacing:0.04em;
  }
  .ccd-topbar nav.nav{display:flex;gap:0;justify-self:center;align-self:stretch}
  .ccd-topbar nav.nav > a,
  .ccd-topbar nav.nav > button:not(.nav__avatar),
  .ccd-topbar nav.nav .nav-item > button:not(.nav__avatar){
    padding:0 12px;height:44px;
    background:transparent;border:0;border-bottom:2px solid transparent;
    color:var(--ink-muted);text-decoration:none;
    font-family:inherit;font-size:var(--fs-small);font-weight:var(--fw-medium);
    cursor:pointer;display:inline-flex;align-items:center;gap:4px;
    transition:color var(--dur-fast) var(--ease),border-color var(--dur-fast) var(--ease);
  }
  .ccd-topbar nav.nav > a:hover,
  .ccd-topbar nav.nav button:not(.nav__avatar):hover{color:var(--ink)}
  .ccd-topbar nav.nav > a[aria-current="page"],
  .ccd-topbar nav.nav button[aria-pressed="true"]{
    color:var(--brand-deep);font-weight:var(--fw-semi);border-bottom-color:var(--brand);
  }
  .ccd-topbar nav.nav button:focus{outline:none}
  .ccd-topbar nav.nav button:focus-visible{
    outline:var(--focus-ring-width,2px) solid var(--focus-ring-color,var(--brand));
    outline-offset:-2px;border-radius:var(--r-xs,4px);
  }
  .ccd-topbar .nav-item{position:relative;display:flex;cursor:pointer}
  .ccd-topbar .nav-item > button .caret{
    width:10px;height:10px;display:inline-grid;place-items:center;color:currentColor;opacity:0.55;
    transition:transform var(--dur-base) var(--ease),opacity var(--dur-base) var(--ease);
  }
  .ccd-topbar .nav-item.open > button .caret{transform:rotate(180deg);opacity:0.9}
  .ccd-topbar .nav-item > button .caret svg{width:100%;height:100%;display:block;cursor:inherit}
  .ccd-topbar .dropdown{
    position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);
    background:var(--paper);border:1px solid var(--rule);border-radius:10px;
    padding:6px;min-width:280px;
    box-shadow:0 10px 28px rgba(20,37,73,0.10);
    display:none;z-index:60;
  }
  .ccd-topbar .nav-item.open .dropdown{display:block}
  .ccd-topbar .dropdown a{
    display:block;padding:10px 12px;border-radius:6px;
    font-size:var(--fs-small);color:var(--ink);font-weight:var(--fw-medium);text-decoration:none;
  }
  .ccd-topbar .dropdown a:hover{background:var(--paper-tint)}
  .ccd-topbar .dropdown a .status{
    display:inline-block;font-size:9px;font-weight:700;letter-spacing:0.1em;
    text-transform:uppercase;margin-left:6px;color:var(--dot-positive);
  }
  .ccd-topbar .dropdown a .status.beta{color:var(--brand)}
  .ccd-topbar .dropdown a .status.planning{color:var(--ink-muted)}
  .ccd-topbar .meta{
    justify-self:end;color:var(--ink-muted);font-size:var(--fs-nano);
    letter-spacing:0.04em;font-variant-numeric:tabular-nums;white-space:nowrap;
  }
  .ccd-topbar .meta strong{color:var(--ink);font-weight:var(--fw-semi,600);font-size:var(--fs-small);margin-right:4px}
  .ccd-footer{
    border-top:1px solid var(--rule);padding:10px clamp(20px,4vw,32px);background:var(--paper);
    text-align:center;color:var(--ink-muted);font-size:var(--fs-small);letter-spacing:-0.05px;
  }
  .ccd-footer .sep{opacity:0.5;margin:0 8px}
  .ccd-topbar .nav__avatar{
    width:28px;height:28px;border-radius:50%;
    background:var(--brand-soft);color:var(--ink);
    display:inline-grid;place-items:center;
    font-size:0.75rem;font-weight:var(--fw-bold,700);
    cursor:pointer;border:0;font-family:inherit;
    align-self:center;margin:0 8px;
    transition:opacity var(--dur-fast) var(--ease);
  }
  .ccd-topbar .nav__avatar:hover{opacity:0.8}
  .ccd-topbar .nav__avatar:focus-visible{
    outline:var(--focus-ring-width,2px) solid var(--focus-ring-color,var(--brand));
    outline-offset:2px;
  }
  .ccd-topbar #ccd-auth-item .dropdown{
    left:auto;right:0;transform:none;min-width:200px;
  }
  .ccd-topbar .auth-email{
    padding:10px 12px 8px;font-size:var(--fs-small);
    color:var(--ink-muted);border-bottom:1px solid var(--rule);margin-bottom:4px;
    word-break:break-all;
  }
  .ccd-topbar .auth-signout{
    display:block;padding:8px 12px;border-radius:6px;width:100%;text-align:left;
    font-size:var(--fs-small);font-family:inherit;color:var(--ink);
    background:none;border:0;cursor:pointer;
  }
  .ccd-topbar .auth-signout:hover{background:var(--paper-tint)}
  @media (max-width: 540px){
    .ccd-topbar{grid-template-columns:auto 1fr auto}
    .ccd-topbar nav.nav{justify-self:end}
    .ccd-topbar .meta{display:none}
  }
`;

function injectStyles() {
  if (document.getElementById('ccd-chrome-styles')) return;
  const s = document.createElement('style');
  s.id = 'ccd-chrome-styles';
  s.textContent = CHROME_CSS;
  document.head.appendChild(s);
}

function toolsDropdownHTML() {
  const items = TOOLS.map(t => `<a href="${t.href}" role="menuitem">${t.label} <span class="status ${t.cls}">${t.status}</span></a>`).join('');
  return `
    <div class="nav-item" data-dropdown="tools">
      <button type="button" aria-expanded="false" aria-haspopup="menu">Tools<span class="caret" aria-hidden="true"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4 L5 6.5 L7.5 4"/></svg></span></button>
      <div class="dropdown" role="menu">${items}</div>
    </div>
  `;
}

function topbarHTML() {
  const onHome = window.location.origin === BASE &&
    (window.location.pathname === '/' || window.location.pathname === '/index.html');
  return `
    <div class="ccd-topbar">
      <a class="brand" href="${BASE}/" aria-label="CCD home"></a>
      <nav class="nav" aria-label="Site navigation">
        <a href="${BASE}/" data-nav-route="" ${onHome ? 'aria-current="page"' : ''}>Home</a>
        ${toolsDropdownHTML()}
        <a href="${BASE}/#about" data-nav-route="/about">About Us</a>
        <div class="nav-item" id="ccd-auth-item">
          <button type="button" id="ccd-auth-btn" style="visibility:hidden">Sign in</button>
        </div>
      </nav>
      <span class="meta" aria-live="polite" data-ccd-ticker>—</span>
    </div>
  `;
}

function wireTicker(root) {
  const el = root.querySelector('[data-ccd-ticker]');
  if (!el) return;
  const FOUNDED_YEAR = 1933, ANNIV_MONTH = 8, ANNIV_DAY = 4;
  let MILESTONE = 100;
  let target = new Date(FOUNDED_YEAR + MILESTONE, ANNIV_MONTH - 1, ANNIV_DAY);
  while (target < new Date()) { MILESTONE += 25; target = new Date(FOUNDED_YEAR + MILESTONE, ANNIV_MONTH - 1, ANNIV_DAY); }
  // Build DOM once — only update textContent in the interval to avoid
  // innerHTML replacement causing a browser cursor-state reset each second.
  el.innerHTML = `<strong>--</strong>s <strong>--</strong>m <strong>--</strong>h <strong>---</strong>d till ${MILESTONE} years`;
  const [tS, tM, tH, tD] = el.querySelectorAll('strong');
  function render() {
    const diff = target - new Date();
    if (diff <= 0) { el.textContent = `${MILESTONE} years today`; return; }
    tS.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
    tM.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
    tH.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
    tD.textContent = Math.floor(diff / 86400000).toLocaleString();
  }
  render();
  setInterval(render, 1000);
}

function footerHTML() {
  return `
    <div class="ccd-footer">
      © 2026<span class="sep">·</span>Corporate Capability Development Group<span class="sep">·</span>Boon Rawd Brewery
    </div>
  `;
}

function wireDropdown(root) {
  const item = root.querySelector('.nav-item[data-dropdown="tools"]');
  if (!item) return;
  const trigger = item.querySelector('button');
  const open = () => { item.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); };
  const close = () => { item.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    item.classList.contains('open') ? close() : open();
    trigger.blur();
  });
  document.addEventListener('click', (e) => { if (!item.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

async function wireAuth() {
  const item = document.getElementById('ccd-auth-item');
  const btn = document.getElementById('ccd-auth-btn');
  if (!btn || !item) return;

  let auth;
  try {
    const authURL = new URL('/js/auth.js', document.baseURI).href;
    auth = await import(authURL);
  } catch {
    btn.textContent = 'Sign in';
    btn.style.visibility = '';
    btn.addEventListener('click', () => { window.location.href = `${BASE}/login`; });
    return;
  }

  let session = null;
  try { session = await auth.getSession(); } catch { /* unauth-friendly */ }

  if (!session?.user) {
    btn.textContent = 'Sign in';
    btn.style.visibility = '';
    btn.addEventListener('click', () => { window.location.href = `${BASE}/login`; });
    return;
  }

  // Signed in — replace plain button with avatar + dropdown
  const email = session.user.email || '';
  const initial = email[0]?.toUpperCase() || '?';
  item.innerHTML = `
    <button type="button" class="nav__avatar" aria-expanded="false" aria-haspopup="menu" title="${email}">${initial}</button>
    <div class="dropdown" role="menu">
      <div class="auth-email">${email}</div>
      <button type="button" class="auth-signout" role="menuitem">Sign out</button>
    </div>
  `;

  const avatar = item.querySelector('.nav__avatar');
  const open  = () => { item.classList.add('open');    avatar.setAttribute('aria-expanded', 'true'); };
  const close = () => { item.classList.remove('open'); avatar.setAttribute('aria-expanded', 'false'); };
  avatar.addEventListener('click', e => { e.stopPropagation(); item.classList.contains('open') ? close() : open(); });
  document.addEventListener('click', e => { if (!item.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  item.querySelector('.auth-signout').addEventListener('click', async () => {
    await auth.signOut();
    window.location.reload();
  });
}

injectStyles();
const topMount = document.querySelector('[data-chrome="topbar"]');
const footMount = document.querySelector('[data-chrome="footer"]');
if (topMount) {
  topMount.innerHTML = topbarHTML();
  wireDropdown(topMount);
  wireAuth();
  wireTicker(topMount);
}
if (footMount) footMount.innerHTML = footerHTML();
