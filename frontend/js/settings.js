const notifyToggle = document.getElementById('notifyToggle');
const saveProfileBtn = document.getElementById('saveProfileBtn');

function initSettings(onSaveProfile) {
  const savedNotifications = localStorage.getItem('pukNotificationsEnabled');
  if (savedNotifications !== null) {
    notifyToggle.checked = savedNotifications === 'true';
  }

  notifyToggle.addEventListener('change', () => {
    localStorage.setItem('pukNotificationsEnabled', notifyToggle.checked.toString());
  });

  saveProfileBtn.addEventListener('click', event => {
    event.preventDefault();
    onSaveProfile();
  });
}

export { initSettings };
