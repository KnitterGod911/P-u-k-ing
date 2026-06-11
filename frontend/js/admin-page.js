import { initCommon, getAdminUsers, setAdminUsers, isAdmin } from './common.js';

let adminInitialized = false;

function initAdminPage() {
  initCommon();

  const adminStatus = document.getElementById('adminStatus');
  const adminListElement = document.getElementById('adminList');
  const banListElement = document.getElementById('banList');
  const adminUsernameInput = document.getElementById('adminUsernameInput');
  const grantAdminBtn = document.getElementById('grantAdminBtn');
  const banUsernameInput = document.getElementById('banUsernameInput');
  const banReasonInput = document.getElementById('banReasonInput');
  const banDaysInput = document.getElementById('banDaysInput');
  const banUserBtn = document.getElementById('banUserBtn');
  const kickUsernameInput = document.getElementById('kickUsernameInput');
  const kickUserBtn = document.getElementById('kickUserBtn');

  const banStorageKey = 'pukBanList';

  function loadBans() {
    try {
      return JSON.parse(localStorage.getItem(banStorageKey) || '[]');
    } catch {
      return [];
    }
  }

  function saveBans(bans) {
    localStorage.setItem(banStorageKey, JSON.stringify(bans));
  }

  function cleanExpiredBans(bans) {
    const now = new Date().toISOString();
    return bans.filter(ban => ban.expiresAt > now);
  }

  function renderAdminList() {
    const admins = getAdminUsers();
    if (!adminListElement) return;
    adminListElement.innerHTML = admins.length
      ? admins.map(name => `<li>${name}</li>`).join('')
      : '<li>No admins configured.</li>';
  }

  function renderBanList() {
    if (!banListElement) return;
    const bans = cleanExpiredBans(loadBans());
    saveBans(bans);
    banListElement.innerHTML = bans.length
      ? bans.map(ban => `<li><strong>${ban.username}</strong> — ${ban.reason || 'No reason'} (expires ${new Date(ban.expiresAt).toLocaleString()})</li>`).join('')
      : '<li>No active bans.</li>';
  }

  function updateStatus(message, danger = false) {
    if (!adminStatus) return;
    adminStatus.textContent = message;
    adminStatus.style.color = danger ? 'var(--danger)' : 'var(--text-primary)';
  }

  function ensureAccess() {
    const admins = getAdminUsers();
    if (!isAdmin()) {
      updateStatus('Access denied. Only platform admins may view this page.', true);
      grantAdminBtn?.setAttribute('disabled', 'true');
      banUserBtn?.setAttribute('disabled', 'true');
      kickUserBtn?.setAttribute('disabled', 'true');
      adminUsernameInput?.setAttribute('disabled', 'true');
      banUsernameInput?.setAttribute('disabled', 'true');
      banReasonInput?.setAttribute('disabled', 'true');
      banDaysInput?.setAttribute('disabled', 'true');
      kickUsernameInput?.setAttribute('disabled', 'true');
      return false;
    }

    updateStatus(`Welcome, admin. ${admins.length} admin(s) active.`);
    grantAdminBtn?.removeAttribute('disabled');
    banUserBtn?.removeAttribute('disabled');
    kickUserBtn?.removeAttribute('disabled');
    return true;
  }

  function handleGrantAdmin() {
    const username = adminUsernameInput?.value.trim();
    if (!username) return;
    const currentAdmins = Array.from(new Set([...getAdminUsers(), username]));
    setAdminUsers(currentAdmins);
    renderAdminList();
    updateStatus(`${username} has been granted admin access.`);
    adminUsernameInput.value = '';
  }

  function handleBanUser() {
    const username = banUsernameInput?.value.trim();
    const reason = banReasonInput?.value.trim() || 'Rule violation';
    const days = Number(banDaysInput?.value) || 1;
    if (!username) return;

    const bans = cleanExpiredBans(loadBans());
    bans.push({
      username,
      reason,
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    });
    saveBans(bans);
    renderBanList();
    updateStatus(`${username} is banned for ${days} day(s).`);
    banUsernameInput.value = '';
    banReasonInput.value = '';
  }

  function handleKickUser() {
    const username = kickUsernameInput?.value.trim();
    if (!username) return;
    const bans = cleanExpiredBans(loadBans());
    bans.push({
      username,
      reason: 'Temporary kick',
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString()
    });
    saveBans(bans);
    renderBanList();
    updateStatus(`${username} has been kicked for 1 minute.`);
    kickUsernameInput.value = '';
  }

  grantAdminBtn?.addEventListener('click', handleGrantAdmin);
  banUserBtn?.addEventListener('click', handleBanUser);
  kickUserBtn?.addEventListener('click', handleKickUser);

  renderAdminList();
  renderBanList();
  ensureAccess();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!adminInitialized) {
    initAdminPage();
    adminInitialized = true;
  }
});

window.addEventListener('pageChanged', event => {
  if (event.detail.page === 'admin' && !adminInitialized) {
    initAdminPage();
    adminInitialized = true;
  }
});
