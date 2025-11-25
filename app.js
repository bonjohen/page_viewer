// Hub Application - JohnBoen.com

// State
let config = null;
let currentSite = null;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarNav = document.getElementById('sidebar-nav');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggle = document.getElementById('menu-toggle');
const currentSiteTitle = document.getElementById('current-site-title');
const openNewTabBtn = document.getElementById('open-new-tab');
const fallbackOpenTabBtn = document.getElementById('fallback-open-tab');
const welcomeMessage = document.getElementById('welcome-message');
const iframeContainer = document.getElementById('iframe-container');
const contentIframe = document.getElementById('content-iframe');
const loadingSpinner = document.getElementById('loading-spinner');
const fallbackMessage = document.getElementById('fallback-message');

// Initialize
async function init() {
  try {
    // Load configuration
    const response = await fetch('./sites.json');
    config = await response.json();
    
    // Render sidebar
    renderSidebar();
    
    // Setup event listeners
    setupEventListeners();
    
    // Restore state from URL or load home page
    const urlParams = new URLSearchParams(window.location.search);
    const siteId = urlParams.get('site');

    if (siteId) {
      loadSite(siteId);
    } else {
      // Load home page by default
      loadHomePage();
    }
  } catch (error) {
    console.error('Failed to initialize hub:', error);
  }
}

// Load home page
function loadHomePage() {
  currentSite = null;

  // Clear URL parameters
  const url = new URL(window.location);
  url.search = '';
  window.history.pushState({}, '', url);

  // Update UI
  updateActiveState(null);
  currentSiteTitle.textContent = 'Projects Hub';

  // Hide welcome message and open button
  welcomeMessage.style.display = 'none';
  openNewTabBtn.style.display = 'none';

  // Load home page in iframe
  loadIframe('./sites/home/');
}

// Render sidebar navigation
function renderSidebar() {
  sidebarNav.innerHTML = '';

  config.groups.forEach(group => {
    const groupEl = createGroupElement(group);
    sidebarNav.appendChild(groupEl);
  });

  // Setup header click handlers after sidebar is rendered
  setupHeaderClickHandlers();
}

// Create group element
function createGroupElement(group) {
  const groupDiv = document.createElement('div');
  groupDiv.className = 'nav-group';
  groupDiv.dataset.groupId = group.id;

  // Group header (non-interactive label)
  const header = document.createElement('div');
  header.className = 'nav-group-header';
  header.innerHTML = `<span>${group.name}</span>`;

  // Sites container
  const sitesDiv = document.createElement('div');
  sitesDiv.className = 'nav-group-sites';

  group.sites.forEach(site => {
    const siteEl = createSiteElement(site);
    sitesDiv.appendChild(siteEl);
  });

  groupDiv.appendChild(header);
  groupDiv.appendChild(sitesDiv);

  return groupDiv;
}

// Create site element
function createSiteElement(site) {
  const siteDiv = document.createElement('div');
  siteDiv.className = 'site-item';
  siteDiv.dataset.siteId = site.id;
  
  siteDiv.innerHTML = `
    <span class="site-label">${site.label}</span>
    <span class="site-description">${site.description}</span>
  `;
  
  siteDiv.addEventListener('click', () => {
    loadSite(site.id);
    closeMobileSidebar();
  });
  
  return siteDiv;
}

// Load site
function loadSite(siteId) {
  const site = findSiteById(siteId);
  if (!site) return;
  
  currentSite = site;
  
  // Update URL
  const url = new URL(window.location);
  url.searchParams.set('site', siteId);
  window.history.pushState({}, '', url);
  
  // Update UI
  updateActiveState(siteId);
  currentSiteTitle.textContent = site.label;
  
  // Hide welcome message
  welcomeMessage.style.display = 'none';
  
  // Show/hide open in new tab button
  openNewTabBtn.style.display = 'block';
  
  // Load content
  if (site.embed) {
    loadIframe(site.url);
  } else {
    showFallback(site.url);
  }
}

// Find site by ID
function findSiteById(siteId) {
  for (const group of config.groups) {
    for (const site of group.sites) {
      if (site.id === siteId) {
        return site;
      }
    }
  }
  return null;
}

// Update active state in sidebar
function updateActiveState(siteId) {
  const allSites = document.querySelectorAll('.site-item');
  allSites.forEach(item => {
    if (item.dataset.siteId === siteId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Load iframe
function loadIframe(url) {
  // Hide fallback
  fallbackMessage.style.display = 'none';

  // Show loading spinner
  loadingSpinner.classList.add('active');

  // Show iframe container
  iframeContainer.style.display = 'block';

  // Set iframe source
  contentIframe.src = url;

  // Handle iframe load
  contentIframe.onload = () => {
    loadingSpinner.classList.remove('active');
  };

  // Handle iframe error (can't detect all cases due to same-origin policy)
  contentIframe.onerror = () => {
    loadingSpinner.classList.remove('active');
    showFallback(url);
  };
}

// Show fallback message
function showFallback(url) {
  iframeContainer.style.display = 'none';
  loadingSpinner.classList.remove('active');
  fallbackMessage.style.display = 'block';

  fallbackOpenTabBtn.onclick = () => {
    window.open(url, '_blank');
  };
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileSidebar);
  }

  // Sidebar overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // Open in new tab button
  if (openNewTabBtn) {
    openNewTabBtn.addEventListener('click', () => {
      if (currentSite) {
        window.open(currentSite.url, '_blank');
      }
    });
  }
}

// Setup header click handlers (called after sidebar is rendered)
function setupHeaderClickHandlers() {
  // Sidebar header click - load home page
  const sidebarHeader = document.querySelector('.sidebar-header');
  if (sidebarHeader) {
    sidebarHeader.addEventListener('click', () => {
      loadHomePage();
      closeMobileSidebar();
    });
    sidebarHeader.style.cursor = 'pointer';
  }

  // Mobile header title click - load home page
  const mobileTitle = document.querySelector('.mobile-title');
  if (mobileTitle) {
    mobileTitle.addEventListener('click', () => {
      loadHomePage();
    });
    mobileTitle.style.cursor = 'pointer';
  }
}

// Toggle mobile sidebar
function toggleMobileSidebar() {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('active');
}

// Close mobile sidebar
function closeMobileSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

// Start the application
init();

