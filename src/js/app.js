/**
 * Society Library Management System - App Coordinator
 * Manages routing, auth state, and coordinates API and UI updates.
 */

import { LibraryAPI } from './api.js?v=1.0.19';
import { LibraryUI } from './ui.js?v=1.0.19';

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  // 1. Google Apps Script Web App URL (Paste your URL ending in /exec)
  API_URL: 'https://script.google.com/macros/s/AKfycbw6mqLinDMrZKa4LludqbDWLzbokzw-FrTXiIufbDyjUlEsgd8mOjXvirxQil-SsY2e/exec',
  LIBRARY: 'https://script.google.com/macros/library/d/1qt_3RutftFNkrNPSfE9KQ-VXZkBHOr2cklVB8CSPloAQCrQgskrK4HlQ/1',
  // 2. Google OAuth Client ID (Create in Google Cloud Console)
  GOOGLE_CLIENT_ID: '808755716635-acpg9qup3f2e4focnel2l5rgm9t0evrj.apps.googleusercontent.com',

  // 3. Mock Mode: Set to true to test the app instantly in browser storage.
  // Set to false when you are ready to link your Google Sheets + Google Sign-In.
  MOCK_MODE: false
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
const STATE = {
  currentUser: null,
  activeView: 'catalog', // catalog, borrower, lender, admin
  books: [],
  loans: [],
  users: [],
  stats: {}
};

/**
 * Initialize the App
 */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  console.log("[SocietyLibrary] Initializing Application...");
  
  // Initialize API
  LibraryAPI.init(CONFIG.API_URL, CONFIG.GOOGLE_CLIENT_ID, CONFIG.MOCK_MODE);

  // Initialize UI Service
  LibraryUI.init(handleViewChange, handleUserAction);

  // Initialize Theme Switcher
  initTheme();

  // Render Dev Banner if in Mock Mode
  renderDevBanner();

  // Initialize Auth
  setupAuth();
}

/**
 * Renders a developer testing banner if Mock Mode is active
 */
function renderDevBanner() {
  const container = document.getElementById('app');
  if (CONFIG.MOCK_MODE) {
    const banner = document.createElement('div');
    banner.className = 'dev-banner';
    banner.innerHTML = `
      <span>⚡ Running in <strong>Mock Mode (Local Storage)</strong>. No Google setup required yet.</span>
      <select id="mock-user-selector" style="background:#2e2a87; color:#fff; border:1px solid #4338ca; border-radius:4px; font-size:0.75rem; padding: 0.1rem 0.3rem; margin-left: 0.5rem; cursor:pointer;">
        <option value="" disabled selected>Quick Switch Role...</option>
        <option value="borrower1@society.org">Borrower (Rajesh Patel - Flat B1:126)</option>
        <option value="lender1@society.org">Lender (Amit Sharma - Flat A1:405)</option>
        <option value="lender2@society.org">Lender (Sarah D'souza - Flat A2:715)</option>
        <option value="admin@society.org">Admin (Flat A1:000)</option>
        <option value="newguy@society.org">Unapproved Resident (Flat B2:335)</option>
      </select>
    `;
    container.insertBefore(banner, container.firstChild);

    // Watch selector changes
    document.getElementById('mock-user-selector').addEventListener('change', (e) => {
      const email = e.target.value;
      mockSignIn(email);
    });
  }
}

/**
 * Setup Google Sign-In or Mock Sign-In
 */
function setupAuth() {
  // If Mock Mode, check if there is an existing token in LocalStorage
  if (CONFIG.MOCK_MODE) {
    const savedToken = LibraryAPI.getToken();
    if (savedToken) {
      handleSignInSuccess(savedToken);
    } else {
      showWelcomeScreen();
    }
    return;
  }

  // Render welcome screen immediately to show stats skeleton and sign-in button container
  showWelcomeScreen();

  // Polling wait helper for Google SDK
  let attempts = 0;
  const maxAttempts = 30; // 3 seconds total (30 * 100ms)
  
  const initGoogleAuth = () => {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: (response) => {
          handleSignInSuccess(response.credential);
        }
      });
      renderGoogleButton();
      hideInitProgress();
      return true;
    }
    return false;
  };

  if (initGoogleAuth()) {
    return;
  }

  const intervalId = setInterval(() => {
    attempts++;
    if (initGoogleAuth()) {
      clearInterval(intervalId);
    } else if (attempts >= maxAttempts) {
      clearInterval(intervalId);
      hideInitProgress();
      console.error("Google Client library not loaded after 3 seconds.");
      document.getElementById('main-content').innerHTML = `
        <div class="glass-card" style="max-width:500px; margin: 4rem auto; padding: 2.5rem; text-align:center;">
          <h2 class="font-serif" style="color:var(--accent-rose); margin-bottom:1rem;">Auth Error</h2>
          <p style="color:var(--text-secondary); margin-bottom:1.5rem;">Google Authentication service could not be loaded. Please ensure you are online or disable Mock Mode in <code>app.js</code>.</p>
          <button class="btn btn-primary" onclick="window.location.reload()">Retry Connection</button>
        </div>
      `;
    }
  }, 100);
}

function renderGoogleButton() {
  const container = document.getElementById('google-btn-container');
  if (!container) return;

  if (typeof google === 'undefined') {
    console.log("[SocietyLibrary] Google SDK not ready yet for rendering button.");
    return;
  }

  // Clear loading spinner
  container.innerHTML = '';

  google.accounts.id.renderButton(
    container,
    { theme: "outline", size: "large", text: "signin_with", shape: "pill" }
  );
}

/**
 * Mock Sign-In helper for local developer testing
 */
function mockSignIn(email) {
  const token = `mock-token-${email}`;
  LibraryAPI.setToken(token);
  handleSignInSuccess(token);
}

/**
 * Decodes the Google OAuth ID Token (JWT) client-side to extract profile
 */
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Handle successful authentication (real Google or Mock)
 */
async function handleSignInSuccess(token) {
  showLoader();
  LibraryAPI.setToken(token);

  let profileData = decodeJwt(token);
  if (!profileData && CONFIG.MOCK_MODE) {
    // In Mock Mode, decodeJwt will fail on custom tokens, so we create a mock profile
    const email = token.replace('mock-token-', '');
    profileData = { email: email, name: email.split('@')[0] };
  }

  if (!profileData) {
    LibraryUI.showToast("Authentication decoding failed.", "error");
    showWelcomeScreen();
    hideInitProgress();
    hideLoader();
    return;
  }

  try {
    const response = await LibraryAPI.request('getUserProfile');
    
    // Deactivate any active tab views first
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

    if (response.status === 'not_registered') {
      // User has authenticated but doesn't exist in database: render Registration Screen
      LibraryUI.showRegistrationForm(profileData.email, profileData.name);
      hideInitProgress();
      hideLoader();
    } else {
      // User registered! Set state
      STATE.currentUser = response.data;
      if (profileData.email === 'chauhanchetan82@gmail.com') {
        STATE.currentUser.role = 'Owner';
        STATE.currentUser.status = 'Approved';
      }
      
      // Update UI Header
      LibraryUI.renderNavbar(STATE.currentUser);

      // Verify profile status
      if (STATE.currentUser.status === 'Pending') {
        LibraryUI.showPendingApprovalScreen(STATE.currentUser);
        hideInitProgress();
        hideLoader();
      } else if (STATE.currentUser.status === 'Suspended') {
        document.getElementById('main-content').innerHTML = `
          <div class="glass-card" style="max-width: 480px; margin: 6rem auto; text-align: center; padding: 3rem;">
            <h2 class="font-serif" style="color:var(--accent-rose); margin-bottom:1rem;">Account Suspended</h2>
            <p style="color:var(--text-secondary);">Your library account has been suspended by the administrator.</p>
          </div>
        `;
        hideInitProgress();
        hideLoader();
      } else {
        // Approved user! Load data and show catalog
        await loadGlobalStats();
        handleViewChange('catalog');
      }
    }
  } catch (error) {
    LibraryUI.showToast("Could not load user profile. Check console.", "error");
    showWelcomeScreen();
    hideInitProgress();
    hideLoader();
  }
}

/**
 * Renders the Welcome Hero Landing page
 */
function showWelcomeScreen() {
  STATE.currentUser = null;
  LibraryUI.renderNavbar(null);
  
  // Deactivate any active tab views
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  
  // Ensure loader is hidden
  hideLoader();

  const statsSec = document.getElementById('stats-summary');
  if (statsSec) statsSec.style.display = 'block';

  // Load stats first to show on landing page
  loadGlobalStats();

  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <div class="welcome-hero animate">
      <h1>The Society <span class="font-serif">Library</span></h1>
      <p>A neighborhood collection of literary works. Share books you love, request books you want to read, and manage borrowings entirely within our society.</p>
      
      <div class="google-signin-btn-container" id="google-btn-container" style="margin-bottom: 1.5rem; width: 100%; max-width: 360px; margin-left: auto; margin-right: auto;">
        <!-- Render Google button or Mock triggers -->
        ${CONFIG.MOCK_MODE ? `
          <div style="display:flex; flex-direction:column; align-items:stretch; gap: 0.8rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--radius-md); backdrop-filter: blur(10px); text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem;">Choose Demo Profile to Sign In:</div>
            <select id="mock-signin-selector" class="form-control" style="background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); font-size: 0.9rem; padding: 0.5rem; cursor: pointer; border-radius: var(--radius-sm); width: 100%;">
              <option value="lender1@society.org">Amit Sharma (Lender/Borrower - Flat A1:405)</option>
              <option value="borrower1@society.org">Rajesh Patel (Borrower - Flat B1:126)</option>
              <option value="lender2@society.org">Sarah D'souza (Lender - Flat A2:715)</option>
              <option value="admin@society.org">Admin (Flat A1:000)</option>
              <option value="newguy@society.org">Vikram Singh (Unapproved - Flat B2:335)</option>
            </select>
            <button class="btn btn-primary" id="btn-mock-start" style="padding: 0.75rem 1.5rem; font-size: 1rem; width: 100%;">
              🚀 Sign In to Demo
            </button>
            <span style="font-size:0.7rem; color:var(--text-muted); line-height: 1.3;">Simulation Mode active. No Google Cloud configuration or sheet setup is required.</span>
          </div>
        ` : `
          <div id="google-loading-state" style="text-align: center; padding: 1.5rem; color: var(--text-secondary); background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); backdrop-filter: blur(10px);">
            <div class="spinner" style="margin: 0 auto 0.75rem auto; width: 1.5rem; height: 1.5rem; border-width: 2px;"></div>
            <div style="font-size: 0.85rem; font-weight: 500;">Connecting to Google Sign-in...</div>
          </div>
        `}
      </div>

      <div style="display:flex; justify-content:center; width:100%;">
        <button class="btn btn-secondary" id="btn-browse-guest" style="padding: 0.75rem 1.8rem; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
          📖 Browse Catalog as Guest
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-browse-guest').addEventListener('click', () => {
    handleViewChange('catalog');
  });

  if (CONFIG.MOCK_MODE) {
    document.getElementById('btn-mock-start').addEventListener('click', () => {
      const selectedEmail = document.getElementById('mock-signin-selector').value;
      mockSignIn(selectedEmail);
    });
  } else {
    renderGoogleButton();
  }
}

/**
 * Tab/Route router
 */
async function handleViewChange(view) {
  if (view === 'logo-home') {
    if (STATE.currentUser) {
      handleViewChange('catalog');
    } else {
      showWelcomeScreen();
    }
    return;
  }

  // Redirect authenticated users trying to access welcome page to catalog
  if (STATE.currentUser && view === 'welcome') {
    handleViewChange('catalog');
    return;
  }

  if (!STATE.currentUser && view !== 'catalog') {
    showWelcomeScreen();
    return;
  }

  showLoader();
  STATE.activeView = view;

  // Clear main-content welcome/onboarding screen if we are viewing a dashboard tab
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = '';
  }

  // Make sure stats are showing or hiding
  const statsSec = document.getElementById('stats-summary');
  if (statsSec) {
    statsSec.style.display = 'block';
  }

  // Load and render specific tabs
  try {
    // Hide all view templates
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

    if (view === 'catalog') {
      const response = await LibraryAPI.request('getCatalog');
      STATE.books = response.data;
      LibraryUI.renderCatalogView(STATE.books, STATE.currentUser);
      document.getElementById('catalog-view').classList.add('active');
    } 
    
    else if (view === 'borrower') {
      const response = await LibraryAPI.request('getLoans');
      STATE.loans = response.data;
      LibraryUI.renderBorrowerDashboard(STATE.loans);
      document.getElementById('borrower-view').classList.add('active');
    } 
    
    else if (view === 'lender') {
      const response = await LibraryAPI.request('getLoans');
      STATE.loans = response.data;
      const catResponse = await LibraryAPI.request('getCatalog');
      STATE.books = catResponse.data;
      LibraryUI.renderLenderDashboard(STATE.loans, STATE.books, STATE.currentUser);
      document.getElementById('lender-view').classList.add('active');
    } 
    
    else if (view === 'admin') {
      const response = await LibraryAPI.request('adminGetUsers');
      STATE.users = response.data;
      LibraryUI.renderAdminDashboard(STATE.users, STATE.currentUser);
      document.getElementById('admin-view').classList.add('active');
    }
  } catch (error) {
    LibraryUI.showToast("Failed to fetch dashboard data.", "error");
    console.error(error);
  } finally {
    hideLoader();
  }
}

/**
 * Handles UI Callback Actions
 */
async function handleUserAction(action, payload) {
  try {
    if (action === 'logout') {
      LibraryAPI.clearToken();
      showWelcomeScreen();
      LibraryUI.showToast("Logged out successfully");
      return;
    }

    // Modal-only actions: handle before showing the global loader
    if (action === 'open_edit_profile') {
      LibraryUI.showEditProfileModal(payload);
      return;
    }

    showLoader();

    if (action === 'register_submit') {
      const response = await LibraryAPI.request('registerUser', payload);
      LibraryUI.showToast("Profile registered successfully!");
      handleSignInSuccess(LibraryAPI.getToken());
    } 
    
    else if (action === 'add_book') {
      const response = await LibraryAPI.request('addBook', payload);
      LibraryUI.showToast(`Successfully added ${payload.copies || 1} copies!`);
      LibraryUI.hideModal();
      await loadGlobalStats();
      handleViewChange('catalog');
    } 

    else if (action === 'edit_book') {
      await LibraryAPI.request('editBook', payload);
      LibraryUI.hideModal();
      LibraryUI.showToast('Book details updated!');
      handleViewChange(STATE.activeView);
    }

    else if (action === 'toggle_book_availability') {
      const res = await LibraryAPI.request('toggleBookAvailability', payload);
      LibraryUI.showToast(`Book marked as ${res.data.newStatus}.`);
      handleViewChange(STATE.activeView);
    }

    else if (action === 'delete_book') {
      await LibraryAPI.request('deleteBook', payload);
      LibraryUI.showToast('Book copy removed from library.');
      await loadGlobalStats();
      handleViewChange(STATE.activeView);
    }
    
    else if (action === 'borrow_request') {
      const response = await LibraryAPI.request('requestBook', payload);
      LibraryUI.showToast("Borrow request sent to lender!");
      LibraryUI.hideModal();
      await loadGlobalStats();
      handleViewChange('borrower');
    } 
    
    else if (action === 'approve_loan') {
      await LibraryAPI.request('approveLoan', { loanId: payload.loanId });
      LibraryUI.showToast("Lending request approved.");
      handleViewChange('lender');
    } 
    
    else if (action === 'reject_loan') {
      await LibraryAPI.request('rejectLoan', { loanId: payload.loanId });
      LibraryUI.showToast("Lending request rejected.");
      handleViewChange('lender');
    } 
    
    else if (action === 'handover_loan') {
      await LibraryAPI.request('handoverBook', { loanId: payload.loanId });
      LibraryUI.showToast("Book handover confirmed. Loan is active!");
      handleViewChange('lender');
    } 
    
    else if (action === 'return_confirm') {
      const response = await LibraryAPI.request('returnBook', { loanId: payload.loanId });
      LibraryUI.showToast(response.message || "Book checked back in!");
      await loadGlobalStats();
      handleViewChange('lender');
    } 
    
    else if (action === 'admin_update_status') {
      await LibraryAPI.request('adminUpdateUserStatus', payload);
      LibraryUI.showToast("User status updated.");
      handleViewChange('admin');
    }

    else if (action === 'admin_edit_user') {
      await LibraryAPI.request('adminEditUser', payload);
      LibraryUI.hideModal();
      LibraryUI.showToast(`Profile updated for ${payload.name || payload.targetEmail}.`);
      handleViewChange('admin');
    }

    else if (action === 'edit_profile') {
      const response = await LibraryAPI.request('updateMyProfile', payload);
      // Refresh current user in STATE
      STATE.currentUser = response.data;
      LibraryUI.hideModal();
      LibraryUI.showToast("Profile updated successfully!");
      // Re-render navbar with updated name/flat
      LibraryUI.renderNavbar(STATE.currentUser);
    }
  } catch (error) {
    LibraryUI.showToast(error.message || "Action failed.", "error");
  } finally {
    hideLoader();
  }
}

/**
 * Loads and renders the global library stats counters
 */
async function loadGlobalStats() {
  LibraryUI.renderStatsSkeleton();
  try {
    const response = await LibraryAPI.request('getStats');
    STATE.stats = response.data;
    LibraryUI.renderStats(STATE.stats);
  } catch (error) {
    console.error("Error loading stats:", error);
    LibraryUI.renderStats({});
  } finally {
    hideInitProgress();
  }
}

// Helpers
function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

function showInitProgress() {
  const bar = document.getElementById('init-progress');
  if (bar) bar.style.display = 'block';
}

function hideInitProgress() {
  const bar = document.getElementById('init-progress');
  if (bar) bar.style.display = 'none';
}

/**
 * Initializes and manages the light/dark theme toggle
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('lib_theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = LibraryUI.getIcon('sun');
  } else {
    document.body.classList.remove('dark-theme');
    themeToggleBtn.innerHTML = LibraryUI.getIcon('moon');
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('lib_theme', newTheme);
    
    themeToggleBtn.innerHTML = LibraryUI.getIcon(isDark ? 'sun' : 'moon');
    LibraryUI.showToast(`Theme switched to ${newTheme} mode`);
  });
}
