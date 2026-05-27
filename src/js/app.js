/**
 * Society Library Management System - App Coordinator
 * Manages routing, auth state, and coordinates API and UI updates.
 */

import { LibraryAPI } from './api.js?v=1.0.21';
import { LibraryUI } from './ui.js?v=1.0.21';

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
  previousView: 'catalog',
  books: [],
  loans: [],
  users: [],
  stats: {}
};

let googleAuthInitialized = false;

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

  // Handle API authentication expiration or invalidation errors
  LibraryAPI.onAuthErrorCallback = () => {
    showWelcomeScreen();
    LibraryUI.showToast("Session expired. Please sign in again.", "error");
  };

  // Initialize UI Service
  LibraryUI.init(handleViewChange, handleUserAction);

  // Initialize Theme Switcher
  initTheme();

  // Render Dev Banner if in Mock Mode
  renderDevBanner();

  // Initialize Auth
  setupAuth();

  // Handle popstate for browser back/forward buttons/gestures
  window.addEventListener('popstate', (event) => {
    // If a modal is currently open, close it and prevent page view navigation
    if (LibraryUI.isModalActive()) {
      LibraryUI.hideModal(true); // true indicates it's popped by history back, so we do not call history.back() again!
      return;
    }

    if (event.state && event.state.view) {
      handleViewChange(event.state.view, true);
    } else {
      // Default to URL query param or catalog
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view') || 'catalog';
      handleViewChange(view, true);
    }
  });
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
  const savedToken = LibraryAPI.getToken();
  if (savedToken) {
    handleSignInSuccess(savedToken);
  } else {
    showWelcomeScreen();
  }
}

function initializeGoogleAuth() {
  if (googleAuthInitialized) {
    renderGoogleButton();
    return;
  }

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
      googleAuthInitialized = true;
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
  const isMock = CONFIG.MOCK_MODE;
  LibraryAPI.setToken(token);

  let profileData = decodeJwt(token);
  if (!profileData && isMock) {
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

  // SWR Cache handling
  let hasCached = false;
  const cachedProfile = isMock ? null : LibraryAPI.getCache('getUserProfile');

  if (cachedProfile && cachedProfile.status !== 'not_registered') {
    hasCached = true;
    STATE.currentUser = cachedProfile.data;
    if (profileData.email === 'chauhanchetan82@gmail.com') {
      STATE.currentUser.role = 'Owner';
      STATE.currentUser.status = 'Approved';
    }
    LibraryUI.renderNavbar(STATE.currentUser);
    hideInitProgress();
    hideLoader();

    if (STATE.currentUser.status === 'Approved') {
      loadGlobalStats(); // revalidate in background
      const urlParams = new URLSearchParams(window.location.search);
      const redirectView = urlParams.get('view') || 'catalog';
      if (window.history.replaceState) {
        const initialUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?view=" + redirectView;
        window.history.replaceState({ view: redirectView }, '', initialUrl);
      }
      handleViewChange(redirectView, true); // revalidate catalog in background
    } else if (STATE.currentUser.status === 'Pending') {
      LibraryUI.showPendingApprovalScreen(STATE.currentUser);
    }
  }

  if (!hasCached) {
    showLoader();
  }

  try {
    const response = await LibraryAPI.request('getUserProfile');
    
    if (!isMock) {
      LibraryAPI.setCache('getUserProfile', response);
    }

    // Determine if state changed
    const isStateChanged = !hasCached || JSON.stringify(cachedProfile) !== JSON.stringify(response);

    if (isStateChanged) {
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
          // Approved user! Load data and show catalog (or the view specified in URL)
          await loadGlobalStats();
          const urlParams = new URLSearchParams(window.location.search);
          const redirectView = urlParams.get('view') || 'catalog';
          if (window.history.replaceState) {
            const initialUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?view=" + redirectView;
            window.history.replaceState({ view: redirectView }, '', initialUrl);
          }
          handleViewChange(redirectView, true);
        }
      }
    }
  } catch (error) {
    if (!hasCached) {
      LibraryUI.showToast("Could not load user profile. Check console.", "error");
      showWelcomeScreen();
      hideInitProgress();
      hideLoader();
    } else {
      console.error("Revalidation of user profile failed:", error);
    }
  }
}

/**
 * Renders the Welcome Hero Landing page
 */
function showWelcomeScreen() {
  STATE.currentUser = null;
  LibraryAPI.clearToken();
  LibraryUI.renderNavbar(null);
  
  // Deactivate any active tab views
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  
  // Ensure loader is hidden
  hideLoader();

  const statsSec = document.getElementById('stats-summary');
  if (statsSec) statsSec.style.display = 'none';

  // Load stats first to show on landing page
  loadGlobalStats();

  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <div class="welcome-hero animate">
      <h1>The Society Library</h1>
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
    initializeGoogleAuth();
  }
}

/**
 * Tab/Route router
 */
async function handleViewChange(view, isPopState = false) {
  if (view === 'back') {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleViewChange('catalog');
    }
    return;
  }

  let bookId = null;
  let viewName = view;
  if (view.startsWith('book-details:')) {
    viewName = 'book-details';
    bookId = view.split(':')[1];
  } else {
    STATE.previousView = view;
  }

  if (viewName === 'logo-home') {
    if (STATE.currentUser) {
      handleViewChange('catalog', isPopState);
    } else {
      showWelcomeScreen();
    }
    return;
  }

  // Redirect authenticated users trying to access welcome page to catalog
  if (STATE.currentUser && viewName === 'welcome') {
    handleViewChange('catalog', isPopState);
    return;
  }

  if (!STATE.currentUser && viewName !== 'catalog') {
    showWelcomeScreen();
    return;
  }

  STATE.activeView = view;
  LibraryUI.switchActiveTab(viewName);

  // Push state to browser history if this isn't a popstate navigation
  if (!isPopState && window.history.pushState) {
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?view=${view}`;
    window.history.pushState({ view: view }, '', newUrl);
  }

  // Clear main-content welcome/onboarding screen if we are viewing a dashboard tab
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = '';
  }

  // Make sure stats are showing or hiding
  const statsSec = document.getElementById('stats-summary');
  if (statsSec) {
    const isOwnerOrAdmin = STATE.currentUser && (STATE.currentUser.role === 'Owner' || STATE.currentUser.role === 'Admin');
    if (viewName === 'book-details' || !isOwnerOrAdmin) {
      statsSec.style.display = 'none';
    } else {
      statsSec.style.display = 'block';
    }
  }

  // Load and render specific tabs
  try {
    // Hide all view templates
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

    const isMock = CONFIG.MOCK_MODE;

    if (viewName === 'catalog') {
      const cachedCatalog = isMock ? null : LibraryAPI.getCache('getCatalog');
      if (cachedCatalog) {
        STATE.books = cachedCatalog.data;
        LibraryUI.renderCatalogView(STATE.books, STATE.currentUser);
        document.getElementById('catalog-view').classList.add('active');
        hideLoader();
        showStaleBanner();
      } else {
        showLoader();
      }

      const response = await LibraryAPI.request('getCatalog');
      if (!isMock) {
        LibraryAPI.setCache('getCatalog', response);
      }

      const isNew = !cachedCatalog || JSON.stringify(cachedCatalog.data) !== JSON.stringify(response.data);
      if (isNew) {
        STATE.books = response.data;
        if (STATE.activeView === 'catalog') {
          LibraryUI.renderCatalogView(STATE.books, STATE.currentUser);
          document.getElementById('catalog-view').classList.add('active');
        }
      }
      hideStaleBanner();
    } 
    
    else if (viewName === 'borrower') {
      const cachedLoans = isMock ? null : LibraryAPI.getCache('getLoans');
      if (cachedLoans) {
        STATE.loans = cachedLoans.data;
        LibraryUI.renderBorrowerDashboard(STATE.loans, STATE.currentUser);
        document.getElementById('borrower-view').classList.add('active');
        hideLoader();
        showStaleBanner();
      } else {
        showLoader();
      }

      const response = await LibraryAPI.request('getLoans');
      if (!isMock) {
        LibraryAPI.setCache('getLoans', response);
      }

      const isNew = !cachedLoans || JSON.stringify(cachedLoans.data) !== JSON.stringify(response.data);
      if (isNew) {
        STATE.loans = response.data;
        if (STATE.activeView === 'borrower') {
          LibraryUI.renderBorrowerDashboard(STATE.loans, STATE.currentUser);
          document.getElementById('borrower-view').classList.add('active');
        }
      }
      hideStaleBanner();
    } 
    
    else if (viewName === 'lender') {
      const cachedLoans = isMock ? null : LibraryAPI.getCache('getLoans');
      const cachedCatalog = isMock ? null : LibraryAPI.getCache('getCatalog');

      if (cachedLoans && cachedCatalog) {
        STATE.loans = cachedLoans.data;
        STATE.books = cachedCatalog.data;
        LibraryUI.renderLenderDashboard(STATE.loans, STATE.books, STATE.currentUser);
        document.getElementById('lender-view').classList.add('active');
        hideLoader();
        showStaleBanner();
      } else {
        showLoader();
      }

      const [loansResponse, catResponse] = await Promise.all([
        LibraryAPI.request('getLoans'),
        LibraryAPI.request('getCatalog')
      ]);

      if (!isMock) {
        LibraryAPI.setCache('getLoans', loansResponse);
        LibraryAPI.setCache('getCatalog', catResponse);
      }

      const isLoansNew = !cachedLoans || JSON.stringify(cachedLoans.data) !== JSON.stringify(loansResponse.data);
      const isCatalogNew = !cachedCatalog || JSON.stringify(cachedCatalog.data) !== JSON.stringify(catResponse.data);

      if (isLoansNew || isCatalogNew) {
        STATE.loans = loansResponse.data;
        STATE.books = catResponse.data;
        if (STATE.activeView === 'lender') {
          LibraryUI.renderLenderDashboard(STATE.loans, STATE.books, STATE.currentUser);
          document.getElementById('lender-view').classList.add('active');
        }
      }
      hideStaleBanner();
    } 
    
    else if (viewName === 'admin') {
      const cachedUsers = isMock ? null : LibraryAPI.getCache('adminGetUsers');
      const cachedAutomation = isMock ? null : LibraryAPI.getCache('adminGetAutomationSettings');
      const isOwner = STATE.currentUser && STATE.currentUser.role === 'Owner';

      if (cachedUsers) {
        STATE.users = cachedUsers.data;
        STATE.automation = cachedAutomation ? cachedAutomation.data : null;
        LibraryUI.renderAdminDashboard(STATE.users, STATE.currentUser, STATE.automation);
        document.getElementById('admin-view').classList.add('active');
        hideLoader();
        showStaleBanner();
      } else {
        showLoader();
      }

      const requests = [LibraryAPI.request('adminGetUsers')];
      if (isOwner) {
        requests.push(LibraryAPI.request('adminGetAutomationSettings').catch(() => ({ data: null })));
      }

      const results = await Promise.all(requests);
      const userResponse = results[0];
      const autoResponse = results[1] || { data: null };

      if (!isMock) {
        LibraryAPI.setCache('adminGetUsers', userResponse);
        if (isOwner && results[1]) {
          LibraryAPI.setCache('adminGetAutomationSettings', autoResponse);
        }
      }

      STATE.users = userResponse.data;
      STATE.automation = autoResponse.data;

      if (STATE.activeView === 'admin') {
        LibraryUI.renderAdminDashboard(STATE.users, STATE.currentUser, STATE.automation);
        document.getElementById('admin-view').classList.add('active');
      }
      hideStaleBanner();
    }

    else if (viewName === 'book-details') {
      let book = STATE.books.find(b => b.book_id === bookId);
      
      if (book) {
        LibraryUI.renderBookDetailsView(book, STATE.loans, STATE.currentUser);
        document.getElementById('book-details-view').classList.add('active');
        hideLoader();
      } else {
        const cachedCatalog = isMock ? null : LibraryAPI.getCache('getCatalog');
        const cachedLoans = isMock ? null : LibraryAPI.getCache('getLoans');
        if (cachedCatalog) {
          STATE.books = cachedCatalog.data;
          STATE.loans = cachedLoans ? cachedLoans.data : [];
          book = STATE.books.find(b => b.book_id === bookId);
        }
        
        if (book) {
          LibraryUI.renderBookDetailsView(book, STATE.loans, STATE.currentUser);
          document.getElementById('book-details-view').classList.add('active');
          hideLoader();
        } else {
          showLoader();
        }
      }

      const [catResponse, loansResponse] = await Promise.all([
        LibraryAPI.request('getCatalog'),
        LibraryAPI.request('getLoans').catch(() => ({ data: [] }))
      ]);

      if (!isMock) {
        LibraryAPI.setCache('getCatalog', catResponse);
        LibraryAPI.setCache('getLoans', loansResponse);
      }

      STATE.books = catResponse.data;
      STATE.loans = loansResponse.data || [];
      
      const freshBook = STATE.books.find(b => b.book_id === bookId);
      if (freshBook && STATE.activeView === `book-details:${bookId}`) {
        LibraryUI.renderBookDetailsView(freshBook, STATE.loans, STATE.currentUser);
        document.getElementById('book-details-view').classList.add('active');
      } else if (!freshBook && STATE.activeView === `book-details:${bookId}`) {
        LibraryUI.showToast("Book copy not found.", "error");
        handleViewChange('catalog');
      }
    }
  } catch (error) {
    LibraryUI.showToast("Failed to fetch dashboard data.", "error");
    console.error(error);
  } finally {
    hideLoader();
    hideStaleBanner();
  }
}

/**
 * Handles UI Callback Actions
 */
async function handleUserAction(action, payload) {
  try {
    if (action === 'logout') {
      LibraryAPI.clearToken();
      LibraryAPI.clearCache();
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
      handleViewChange(STATE.activeView.startsWith('book-details:') ? STATE.activeView : 'borrower');
    } 
    
    else if (action === 'approve_loan') {
      await LibraryAPI.request('approveLoan', { loanId: payload.loanId });
      LibraryUI.showToast("Lending request approved.");
      handleViewChange(STATE.activeView.startsWith('book-details:') ? STATE.activeView : 'lender');
    } 
    
    else if (action === 'reject_loan') {
      await LibraryAPI.request('rejectLoan', { loanId: payload.loanId });
      LibraryUI.showToast("Lending request rejected.");
      handleViewChange(STATE.activeView.startsWith('book-details:') ? STATE.activeView : 'lender');
    } 
    
    else if (action === 'handover_loan') {
      await LibraryAPI.request('handoverBook', { loanId: payload.loanId });
      LibraryUI.showToast("Book handover confirmed. Loan is active!");
      handleViewChange(STATE.activeView.startsWith('book-details:') ? STATE.activeView : 'lender');
    } 
    
    else if (action === 'return_confirm') {
      const response = await LibraryAPI.request('returnBook', { loanId: payload.loanId });
      LibraryUI.showToast(response.message || "Book checked back in!");
      await loadGlobalStats();
      handleViewChange(STATE.activeView.startsWith('book-details:') ? STATE.activeView : 'lender');
    }

    else if (action === 'borrower_return_request') {
      const response = await LibraryAPI.request('borrowerReturnBook', { loanId: payload.loanId });
      LibraryUI.showToast(response.message || "Return requested!");
      await loadGlobalStats();
      handleViewChange(STATE.activeView.startsWith('book-details:') ? STATE.activeView : 'borrower');
    }

    else if (action === 'send_return_reminder') {
      const response = await LibraryAPI.request('sendReturnReminder', payload);
      LibraryUI.showToast(response.message || "Reminder sent.");
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

    else if (action === 'admin_update_automation') {
      const response = await LibraryAPI.request('adminUpdateAutomationSettings', payload);
      STATE.automation = response.data;
      // Clear cache so next navigation reflects new settings
      if (!CONFIG.MOCK_MODE) LibraryAPI.setCache('adminGetAutomationSettings', response);
      LibraryUI.showToast('Automation settings saved ✓');
      // Re-render the admin panel in-place with updated settings
      LibraryUI.renderAdminDashboard(STATE.users, STATE.currentUser, STATE.automation);
    }

    else if (action === 'admin_trigger_notification') {
      const response = await LibraryAPI.request('adminTriggerNotification', payload);
      LibraryUI.showToast(response.message || 'Trigger executed successfully!');
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
  const isMock = CONFIG.MOCK_MODE;
  const cachedStats = isMock ? null : LibraryAPI.getCache('getStats');
  
  if (cachedStats) {
    STATE.stats = cachedStats.data;
    LibraryUI.renderStats(STATE.stats);
    hideInitProgress();
  } else {
    LibraryUI.renderStatsSkeleton();
  }

  try {
    const response = await LibraryAPI.request('getStats');
    if (!isMock) {
      LibraryAPI.setCache('getStats', response);
    }
    const isNew = !cachedStats || JSON.stringify(cachedStats.data) !== JSON.stringify(response.data);
    if (isNew) {
      STATE.stats = response.data;
      LibraryUI.renderStats(STATE.stats);
    }
  } catch (error) {
    console.error("Error loading stats:", error);
    if (!cachedStats) {
      LibraryUI.renderStats({});
    }
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

let _staleBannerTimer = null;
function showStaleBanner() {
  const el = document.getElementById('stale-banner');
  if (!el) return;
  if (_staleBannerTimer) { clearTimeout(_staleBannerTimer); _staleBannerTimer = null; }
  el.classList.remove('hiding');
  el.style.display = 'block';
}

function hideStaleBanner() {
  const el = document.getElementById('stale-banner');
  if (!el || el.style.display === 'none') return;
  el.classList.add('hiding');
  _staleBannerTimer = setTimeout(() => {
    el.style.display = 'none';
    el.classList.remove('hiding');
  }, 320);
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
