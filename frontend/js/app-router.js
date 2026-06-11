// SPA Router for PUK OS - handles page navigation without reloads

const pageMap = {
  dashboard: 'Dashboard',
  games: 'Games',
  ai: 'AI Tools',
  calculator: 'Calculator',
  chat: 'Group Chat',
  profile: 'Profile',
  settings: 'Settings',
  admin: 'Admin Panel'
};

function navigateToPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('page-active');
  });

  // Show target page
  const targetPage = document.getElementById(`page-${pageName}`);
  if (targetPage) {
    targetPage.classList.add('page-active');
  }

  // Update page title
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = pageMap[pageName] || 'Page';
  }

  // Update sidebar active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });

  // Update back button visibility
  const backBtn = document.getElementById('backBtn');
  const isDashboard = pageName === 'dashboard';
  if (backBtn) {
    backBtn.textContent = isDashboard ? '' : 'Back';
    backBtn.classList.toggle('hidden', isDashboard);
  }

  // Store current page
  sessionStorage.setItem('currentPage', pageName);

  // Scroll to top
  window.scrollTo(0, 0);

  // Dispatch custom event for page change
  window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
}

// Navigation event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Nav link buttons
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      navigateToPage(link.dataset.page);
    });
  });

  // Generic page navigation buttons (data-page attribute on any button)
  document.addEventListener('click', event => {
    if (event.target.matches('button[data-page]')) {
      navigateToPage(event.target.dataset.page);
    }
  });

  // Back button
  document.getElementById('backBtn')?.addEventListener('click', () => {
    navigateToPage('dashboard');
  });

  // Restore page from session or start at dashboard
  const savedPage = sessionStorage.getItem('currentPage') || 'dashboard';
  navigateToPage(savedPage);
});
