import { initCommon, saveProfileData, getStoredUser } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommon();

  const nameInput = document.getElementById('profileNameInput');
  const bioInput = document.getElementById('profileBioInput');
  const pictureInput = document.getElementById('profilePictureInput');
  const saveBtn = document.getElementById('saveProfileBtn');
  const profileDisplayName = document.getElementById('profileCardName');
  const profileDisplayBio = document.getElementById('profileCardBio');
  const profileJoin = document.getElementById('profileJoinDate');
  const previewImage = document.getElementById('profilePreviewImage');

  const profileCreatedKey = 'pukProfileCreated';

  function getJoinDate() {
    return localStorage.getItem(profileCreatedKey) || new Date().toLocaleDateString();
  }

  function loadProfile() {
    const user = getStoredUser();
    if (nameInput) nameInput.value = user.name;
    if (bioInput) bioInput.value = user.bio;
    if (profileDisplayName) profileDisplayName.textContent = user.name;
    if (profileDisplayBio) profileDisplayBio.textContent = user.bio;
    if (profileJoin) profileJoin.textContent = getJoinDate();

    if (previewImage) {
      if (user.avatar) {
        previewImage.src = user.avatar;
        previewImage.classList.remove('hidden');
      } else {
        previewImage.classList.add('hidden');
      }
    }
  }

  async function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  saveBtn?.addEventListener('click', async () => {
    const name = nameInput?.value.trim();
    const bio = bioInput?.value.trim();
    let avatar = null;

    if (pictureInput?.files?.[0]) {
      avatar = await readFileAsDataUrl(pictureInput.files[0]);
    }

    saveProfileData({ name, bio, avatar });
    if (!localStorage.getItem(profileCreatedKey)) {
      localStorage.setItem(profileCreatedKey, new Date().toLocaleDateString());
    }
    loadProfile();
  });

  loadProfile();
});
