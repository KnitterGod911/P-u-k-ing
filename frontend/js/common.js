import { loadTheme, initThemeSelection } from './theme.js';

const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const adminLink = document.querySelector('.admin-link');
const userBadge = document.querySelector('.user-badge');
const userNameText = document.querySelector('.user-name');
const userSubtitle = document.querySelector('.user-subtitle');
const animationToggle = document.getElementById('animationsToggle');

const storageKeys = {
  profileName: 'pukProfileName',
  profileBio: 'pukProfileBio',
  profilePic: 'pukProfilePic',
  chatUsername: 'pukChatUsername',
  animationsEnabled: 'pukAnimationsEnabled',
  adminUsers: 'pukAdminUsers'
};

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href')?.split('/').pop();
    const isActive = linkPath === path || (path === '' && linkPath === 'index.html');
    link.classList.toggle('active', isActive);
  });
}

function getStoredUser() {
  return {
    name: localStorage.getItem(storageKeys.profileName)
      || localStorage.getItem(storageKeys.chatUsername)
      || 'Guest Explorer',
    bio: localStorage.getItem(storageKeys.profileBio) || 'Your next-gen control hub.',
    avatar: localStorage.getItem(storageKeys.profilePic) || null,
    animationsEnabled: localStorage.getItem(storageKeys.animationsEnabled) !== 'false'
  };
}

function applyProfileHeader() {
  const user = getStoredUser();
  if (userBadge) {
    if (user.avatar) {
      userBadge.textContent = '';
      userBadge.style.backgroundImage = `url('${user.avatar}')`;
      userBadge.style.backgroundSize = 'cover';
      userBadge.style.backgroundPosition = 'center';
      userBadge.style.color = '#fff';
    } else {
      userBadge.textContent = user.name.slice(0, 2).toUpperCase();
      userBadge.style.backgroundImage = '';
      userBadge.style.color = '';
    }
  }

  if (userNameText) {
    userNameText.textContent = user.name;
  }
  if (userSubtitle) {
    userSubtitle.textContent = user.bio;
  }
}

function applyAnimationsPreference() {
  const enabled = getStoredUser().animationsEnabled;
  document.documentElement.dataset.animations = enabled ? 'on' : 'off';
  if (animationToggle) {
    animationToggle.checked = enabled;
  }
}

function getAdminUsers() {
  try {
    const list = JSON.parse(localStorage.getItem(storageKeys.adminUsers) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function setAdminUsers(users) {
  localStorage.setItem(storageKeys.adminUsers, JSON.stringify(users));
}

function ensureAdminList() {
  const admins = getAdminUsers();
  if (admins.length) return admins;
  const currentName = localStorage.getItem(storageKeys.profileName)
    || localStorage.getItem(storageKeys.chatUsername);
  if (currentName) {
    setAdminUsers([currentName]);
    return [currentName];
  }
  return [];
}

function isAdmin() {
  const username = localStorage.getItem(storageKeys.profileName)
    || localStorage.getItem(storageKeys.chatUsername);
  if (!username) return false;
  const admins = ensureAdminList();
  return admins.includes(username);
}

function updateAdminNav() {
  if (!adminLink) return;
  adminLink.style.display = isAdmin() ? 'inline-flex' : 'none';
}

function bindAnimationToggle() {
  if (!animationToggle) return;
  animationToggle.addEventListener('change', event => {
    localStorage.setItem(storageKeys.animationsEnabled, event.target.checked ? 'true' : 'false');
    applyAnimationsPreference();
  });
}

function initCommon() {
  loadTheme();
  setActiveNav();
  updateAdminNav();
  applyProfileHeader();
  applyAnimationsPreference();
  bindAnimationToggle();
  initThemeSelection();
}

export { initCommon, saveProfileData, getStoredUser, applyAnimationsPreference, isAdmin, getAdminUsers, setAdminUsers };

function saveProfileData({ name, bio, avatar }) {
  if (name) localStorage.setItem(storageKeys.profileName, name);
  if (bio) localStorage.setItem(storageKeys.profileBio, bio);
  if (avatar) localStorage.setItem(storageKeys.profilePic, avatar);
  applyProfileHeader();
}

export { initCommon, saveProfileData, getStoredUser, applyAnimationsPreference };
