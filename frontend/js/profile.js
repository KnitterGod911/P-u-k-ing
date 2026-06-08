const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileBio = document.getElementById('profileBio');
const profilePageName = document.getElementById('profilePageName');
const profilePageBio = document.getElementById('profilePageBio');
const profileJoinDate = document.getElementById('profileJoinDate');
const statGamesPlayed = document.getElementById('statGamesPlayed');
const statMessagesSent = document.getElementById('statMessagesSent');
const statAIAssists = document.getElementById('statAIAssists');
const userBadge = document.getElementById('userBadge');
const userNameText = document.getElementById('userNameText');
const userEmailText = document.getElementById('userEmailText');

function updateProfileDisplay(user, stats = {}) {
  if (!user) {
    userBadge.textContent = 'PU';
    userNameText.textContent = 'Guest';
    userEmailText.textContent = 'Please sign in';
    profileAvatar.textContent = 'PU';
    profileName.textContent = 'Guest Explorer';
    profileBio.textContent = 'Sign in to track your stats and customize your profile.';
    profilePageName.textContent = 'Guest Explorer';
    profilePageBio.textContent = 'Create a profile and become part of the community.';
    profileJoinDate.textContent = '--';
    statGamesPlayed.textContent = '0';
    statMessagesSent.textContent = '0';
    statAIAssists.textContent = '0';
    return;
  }

  const name = user.displayName || user.email.split('@')[0];
  userBadge.textContent = name.slice(0, 2).toUpperCase();
  userNameText.textContent = name;
  userEmailText.textContent = user.email || 'PUK Member';
  profileAvatar.textContent = name.slice(0, 2).toUpperCase();
  profileName.textContent = name;
  profileBio.textContent = user.bio || 'PUK member since today.';
  profilePageName.textContent = name;
  profilePageBio.textContent = user.bio || 'A curious player exploring games, AI, and chat.';
  profileJoinDate.textContent = new Date().toLocaleDateString();
  statGamesPlayed.textContent = stats.gamesPlayed || '0';
  statMessagesSent.textContent = stats.messagesSent || '0';
  statAIAssists.textContent = stats.promptsSent || '0';
}

export { updateProfileDisplay };
