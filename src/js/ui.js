/**
 * Society Library Management System - UI Renderer
 * Handles rendering HTML views, tables, forms, and modals.
 */

// SVG Icon Helpers (Lucide replica)
const ICONS = {
  book: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h10"/><path d="M6 18h10"/></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  logOut: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  history: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="14"/></svg>',
  lending: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 4-4-4-4"/><path d="M20 12H8a4 4 0 0 0-4 4v2"/></svg>',
  sun: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>',
  moon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  lock: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  unlock: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
  userEdit: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
};

const normalizeString = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

class UiService {
  constructor() {
    this.toastContainer = null;
    this.modalOverlay = null;
    this.onViewChangeCallback = null;
    this.onActionCallback = null;
  }

  getIcon(name) {
    return ICONS[name] || '';
  }

  init(onViewChange, onAction) {
    this.onViewChangeCallback = onViewChange;
    this.onActionCallback = onAction;

    // Create Toast Container if it doesn't exist
    this.toastContainer = document.getElementById('toast-container');
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      this.toastContainer.className = 'toast-container';
      document.body.appendChild(this.toastContainer);
    }

    // Setup Modal DOM Structure
    this.setupModalDom();

    // Bind Logo Home button to navigate to catalog (if logged in) or welcome page (if guest)
    const logoHome = document.getElementById('logo-home');
    if (logoHome) {
      logoHome.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.onViewChangeCallback) {
          this.onViewChangeCallback('logo-home');
        }
      });
    }
  }

  setupModalDom() {
    this.modalOverlay = document.getElementById('modal-overlay');
    if (!this.modalOverlay) {
      this.modalOverlay = document.createElement('div');
      this.modalOverlay.id = 'modal-overlay';
      this.modalOverlay.className = 'modal-overlay';
      this.modalOverlay.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title">Modal Title</h3>
            <button class="modal-close" id="modal-close">${ICONS.x}</button>
          </div>
          <div class="modal-body" id="modal-body">
            <!-- Dynamic Form Content -->
          </div>
        </div>
      `;
      document.body.appendChild(this.modalOverlay);

      // Event listener to close
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.hideModal();
      });
      document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
    }
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = ICONS.check;
    if (type === 'error') icon = ICONS.x;
    if (type === 'info') icon = ICONS.alertCircle;

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
    `;

    this.toastContainer.appendChild(toast);

    // Fade out and remove after 4 seconds
    setTimeout(() => {
      toast.style.transition = 'opacity 500ms, transform 500ms';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3500);
  }

  showModal(title, bodyHtml) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    this.modalOverlay.classList.add('active');
  }

  hideModal() {
    this.modalOverlay.classList.remove('active');
  }

  renderNavbar(user) {
    const navLinks = document.getElementById('nav-links');
    const userMenu = document.getElementById('user-menu');
    
    if (!user) {
      navLinks.innerHTML = `
        <li class="nav-link active" data-view="catalog">${ICONS.book} Explore</li>
      `;
      userMenu.innerHTML = `
        <button class="btn btn-primary btn-sm" id="signin-nav-btn" style="padding: 0.4rem 0.8rem;">
          Sign In
        </button>
      `;

      // Bind click handler for guest Explore link
      navLinks.querySelector('.nav-link').addEventListener('click', (e) => {
        this.switchActiveTab(e.currentTarget);
        if (this.onViewChangeCallback) {
          this.onViewChangeCallback('catalog');
        }
      });

      // Bind click handler for guest Sign In button
      document.getElementById('signin-nav-btn').addEventListener('click', () => {
        if (this.onViewChangeCallback) {
          this.onViewChangeCallback('welcome');
        }
      });
      return;
    }

    const role = user.role;
    const isApproved = user.status === 'Approved';

    let linksHtml = '';

    if (isApproved) {
      linksHtml += `
        <li class="nav-link active" data-view="catalog">${ICONS.book} Explore</li>
      `;
      if (role === 'Borrower' || role === 'Both' || role === 'Admin' || role === 'Owner') {
        linksHtml += `<li class="nav-link" data-view="borrower">${ICONS.history} My Borrows</li>`;
      }
      if (role === 'Lender' || role === 'Both' || role === 'Admin' || role === 'Owner') {
        linksHtml += `<li class="nav-link" data-view="lender">${ICONS.lending} Lending Desk</li>`;
      }
      if (role === 'Admin' || role === 'Owner') {
        linksHtml += `<li class="nav-link" data-view="admin">${ICONS.settings} ${role === 'Owner' ? '👑 Owner Panel' : 'Admin Panel'}</li>`;
      }
    }

    navLinks.innerHTML = linksHtml;

    // Profile menu rendering
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';
    userMenu.innerHTML = `
      <div class="user-avatar" title="${user.name} (${user.role}) - Flat ${user.flat_number}" style="cursor:pointer;" id="user-avatar-btn">
        <span>${initials}</span>
      </div>
      <div style="display: flex; flex-direction: column; font-size: 0.75rem; text-align: left; max-width: 100px;">
        <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary);">${user.name}</span>
        <span style="color: var(--text-muted); font-size: 0.65rem;">Flat ${user.flat_number}</span>
      </div>
      <button class="btn btn-secondary btn-sm" id="edit-profile-btn" style="padding: 0.35rem 0.5rem;" title="Edit My Profile">
        ${ICONS.edit}
      </button>
      <button class="btn btn-secondary btn-sm" id="logout-btn" style="padding: 0.35rem 0.5rem;" title="Logout">
        ${ICONS.logOut}
      </button>
    `;

    // Add Tab Navigation click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetView = link.getAttribute('data-view');
        this.switchActiveTab(link);
        if (this.onViewChangeCallback) {
          this.onViewChangeCallback(targetView);
        }
      });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      if (this.onActionCallback) this.onActionCallback('logout');
    });

    document.getElementById('edit-profile-btn').addEventListener('click', () => {
      if (this.onActionCallback) this.onActionCallback('open_edit_profile', user);
    });
  }

  switchActiveTab(activeLinkElement) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    activeLinkElement.classList.add('active');
  }

  renderStatsSkeleton() {
    const statsContainer = document.getElementById('stats-summary');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="stats-grid">
        ${[1, 2, 3, 4].map(() => `
          <div class="glass-card stat-card" style="opacity: 0.75;">
            <div class="stat-icon skeleton" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; display: inline-block;"></div>
            <div style="flex-grow: 1;">
              <div class="skeleton" style="width: 3rem; height: 1.5rem; margin-bottom: 0.4rem;"></div>
              <div class="skeleton" style="width: 6.5rem; height: 0.8rem;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderStats(stats) {
    const statsContainer = document.getElementById('stats-summary');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="glass-card stat-card">
          <div class="stat-icon">${ICONS.book}</div>
          <div>
            <div class="stat-value" id="stat-books">${stats.totalBooks || 0}</div>
            <div class="stat-label">Total Books</div>
          </div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-icon">${ICONS.user}</div>
          <div>
            <div class="stat-value" id="stat-members">${stats.totalUsers || 0}</div>
            <div class="stat-label">Registered Members</div>
          </div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-icon">${ICONS.lending}</div>
          <div>
            <div class="stat-value" id="stat-loans">${stats.totalLoans || 0}</div>
            <div class="stat-label">Lending History</div>
          </div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-icon">${ICONS.calendar}</div>
          <div>
            <div class="stat-value" id="stat-active">${stats.activeLoans || 0}</div>
            <div class="stat-label">Books Checked Out</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders the catalog grid with search and filter controls
   */
  renderCatalogView(books, currentUser) {
    const viewContainer = document.getElementById('catalog-view');
    
    // Clear and build DOM skeleton first time or reuse
    viewContainer.innerHTML = `
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title font-serif">Society Catalog</h2>
          ${currentUser && currentUser.status === 'Approved' && (currentUser.role === 'Lender' || currentUser.role === 'Both' || currentUser.role === 'Admin' || currentUser.role === 'Owner') ? `
            <button class="btn btn-primary" id="btn-add-book">${ICONS.plus} Lend a Book</button>
          ` : ''}
        </div>

        <div class="search-container">
          <div class="search-wrapper">
            <span class="search-icon">${ICONS.search}</span>
            <input type="text" class="form-control search-input" id="catalog-search" placeholder="Search by title, author, owner flat, or ISBN...">
          </div>
          <select class="form-control" id="catalog-filter-availability" style="max-width: 180px;">
            <option value="all">All Copies</option>
            <option value="available" selected>Only Available</option>
            <option value="borrowed">Checked Out</option>
          </select>
          ${currentUser ? `
          <select class="form-control" id="catalog-filter-ownership" style="max-width: 220px;">
            <option value="all" selected>All Books</option>
            <option value="mine">My Books Only</option>
            ${(function() {
              const myBooks = books.filter(b => b.owner_email === currentUser.email);
              if (myBooks.length > 0) {
                return `
                  <optgroup label="My Copies">
                    ${myBooks.map(b => `<option value="book-${b.book_id}">${b.title} (Copy #${b.copy_number})</option>`).join('')}
                  </optgroup>
                `;
              }
              return '';
            })()}
          </select>
          ` : ''}
        </div>

        <div class="book-grid" id="catalog-grid">
          <!-- Book cards will render here -->
        </div>
      </div>
    `;

    // Bind event listeners for search and filters
    const searchInput = document.getElementById('catalog-search');
    const filterSelect = document.getElementById('catalog-filter-availability');
    const ownershipSelect = document.getElementById('catalog-filter-ownership');
    
    const filterAndRender = () => {
      const query = searchInput.value;
      const normQuery = normalizeString(query);
      const availability = filterSelect.value;
      const ownership = ownershipSelect ? ownershipSelect.value : 'all';
      
      const filtered = books.filter(book => {
        // Text Match
        const textMatch = 
          normalizeString(book.title).includes(normQuery) ||
          normalizeString(book.author).includes(normQuery) ||
          (book.owner_name && normalizeString(book.owner_name).includes(normQuery)) ||
          (book.owner_flat && normalizeString(book.owner_flat).includes(normQuery)) ||
          (book.isbn && normalizeString(book.isbn).includes(normQuery));
        
        // Status Match
        let statusMatch = true;
        if (availability === 'available') {
          statusMatch = book.status === 'Available';
        } else if (availability === 'borrowed') {
          statusMatch = book.status === 'Borrowed' || book.status === 'Requested';
        }

        // Ownership Match
        let ownershipMatch = true;
        if (ownership === 'mine') {
          ownershipMatch = currentUser && book.owner_email === currentUser.email;
        } else if (ownership.startsWith('book-')) {
          const targetBookId = ownership.replace('book-', '');
          ownershipMatch = book.book_id === targetBookId;
        }

        return textMatch && statusMatch && ownershipMatch;
      });

      this.renderBookGrid(filtered, currentUser);
    };

    searchInput.addEventListener('input', filterAndRender);
    filterSelect.addEventListener('change', filterAndRender);
    if (ownershipSelect) {
      ownershipSelect.addEventListener('change', filterAndRender);
    }

    // Initial render of book grid
    filterAndRender();

    // Bind lend a book button
    const addBtn = document.getElementById('btn-add-book');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddBookForm());
    }
  }

  renderBookGrid(books, currentUser) {
    const grid = document.getElementById('catalog-grid');
    if (books.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          ${ICONS.book}
          <p style="margin-top: 1rem; font-size: 1rem;">No books match your filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = books.map(book => {
      const isOwner = currentUser && book.owner_email === currentUser.email;
      const isSystemOwner = currentUser && currentUser.role === 'Owner';
      const isAvailable = book.status === 'Available';
      
      let badgeClass = 'badge-available';
      if (book.status === 'Requested') badgeClass = 'badge-requested';
      if (book.status === 'Borrowed') badgeClass = 'badge-borrowed';
      if (book.status === 'Lost') badgeClass = 'badge-lost';
      if (book.status === 'Unavailable') badgeClass = 'badge-lost';

      return `
        <div class="glass-card book-card" data-book-id="${book.book_id}">
          <span class="book-badge ${badgeClass}">${book.status}</span>
          <div class="book-cover-container">
            ${book.cover_url ? `
              <img class="book-cover" src="${book.cover_url}" alt="${book.title}">
            ` : `
              <div class="book-no-cover">
                ${ICONS.book}
                <span>${book.title}</span>
              </div>
            `}
          </div>
          <div class="book-info">
            <h3 class="book-title" title="${book.title}">${book.title}</h3>
            <div class="book-author">by ${book.author}</div>
            <div style="margin-top: 0.25rem;">
              <a href="https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn || (book.title + ' ' + book.author))}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 500; text-decoration: underline;">
                ${ICONS.external} View on Goodreads
              </a>
            </div>
            
            <div class="book-owner">
              <span style="display:flex; align-items:center; gap: 4px;">
                ${ICONS.user} Flat ${book.owner_flat || 'N/A'}
              </span>
              <span style="margin-left: auto; color: var(--text-muted); font-size: 0.7rem;">Copy #${book.copy_number}</span>
            </div>

            ${!isAvailable && book.borrower_name ? `
              <div class="book-borrower" style="margin-top: 0.5rem; font-size: 0.75rem; display: flex; align-items: center; gap: 6px; color: var(--text-secondary); background: var(--nav-link-hover-bg); padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                ${ICONS.user}
                <span>
                  ${book.status === 'Borrowed' ? 'Borrowed by' : 'Requested by'}: <strong>${book.borrower_name}</strong> (Flat ${book.borrower_flat})
                </span>
              </div>
            ` : ''}
            
            <div style="margin-top: 1rem; width: 100%;">
              ${isOwner ? `
                <!-- Own book: standard controls -->
                <div style="display:flex; flex-direction:column; gap:0.4rem; width:100%;">
                  <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-secondary btn-sm btn-owner-edit" data-id="${book.book_id}" style="flex:1; gap:0.3rem;">${ICONS.edit} Edit</button>
                    <button class="btn btn-secondary btn-sm btn-owner-toggle" data-id="${book.book_id}" style="flex:1; gap:0.3rem;">
                      ${book.status === 'Unavailable' ? `${ICONS.unlock} Available` : `${ICONS.lock} Pause`}
                    </button>
                  </div>
                  <button class="btn btn-sm btn-owner-delete" data-id="${book.book_id}" style="width:100%; gap:0.3rem; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.25); color:var(--accent-rose);">
                    ${ICONS.x} Remove Copy
                  </button>
                </div>
              ` : isSystemOwner ? `
                <!-- System Owner override on others' books -->
                <div style="display:flex; flex-direction:column; gap:0.4rem; width:100%;">
                  <div style="font-size:0.65rem; color:var(--accent-rose); font-weight:600; opacity:0.75; text-align:center; letter-spacing:0.5px;">👑 OWNER OVERRIDE</div>
                  <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-secondary btn-sm btn-sysowner-edit" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" style="flex:1; gap:0.3rem; border-color:rgba(244,63,94,0.4);">${ICONS.edit} Edit</button>
                    <button class="btn btn-secondary btn-sm btn-sysowner-toggle" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" style="flex:1; gap:0.3rem; border-color:rgba(244,63,94,0.4);">
                      ${book.status === 'Unavailable' ? `${ICONS.unlock} Avail.` : `${ICONS.lock} Pause`}
                    </button>
                  </div>
                  <button class="btn btn-sm btn-sysowner-delete" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" style="width:100%; gap:0.3rem; background:rgba(244,63,94,0.08); border:1px solid rgba(244,63,94,0.3); color:var(--accent-rose);">
                    ${ICONS.x} Remove Copy
                  </button>
                </div>
              ` : isAvailable && currentUser && currentUser.status === 'Approved' ? `
                <button class="btn btn-primary btn-sm btn-request-borrow" data-id="${book.book_id}" style="width: 100%;">Request</button>
              ` : isAvailable && !currentUser ? `
                <button class="btn btn-primary btn-sm btn-signin-redirect" style="width: 100%;">Sign in to Borrow</button>
              ` : `
                <button class="btn btn-secondary btn-sm" disabled style="width: 100%;">Unavailable</button>
              `}
            </div>

          </div>
        </div>
      `;
    }).join('');

    // Bind request buttons
    grid.querySelectorAll('.btn-request-borrow').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = btn.getAttribute('data-id');
        const book = books.find(b => b.book_id === bookId);
        if (book) this.showRequestBorrowForm(book);
      });
    });

    // Bind signin redirect buttons for guests
    grid.querySelectorAll('.btn-signin-redirect').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.onViewChangeCallback) {
          this.onViewChangeCallback('welcome');
        }
      });
    });

    // Bind owner Edit buttons
    grid.querySelectorAll('.btn-owner-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const book = books.find(b => b.book_id === bookId);
        if (book) this.showOwnerEditBookModal(book);
      });
    });

    // Bind owner Toggle Availability buttons
    grid.querySelectorAll('.btn-owner-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        if (this.onActionCallback) this.onActionCallback('toggle_book_availability', { bookId });
      });
    });

    // Bind owner Delete buttons
    grid.querySelectorAll('.btn-owner-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const book = books.find(b => b.book_id === bookId);
        if (!book) return;
        this.showConfirmDialog(
          `Remove "${book.title}" (Copy #${book.copy_number})?`,
          'This will permanently remove this book copy from the library. Active loans are not affected.',
          () => {
            if (this.onActionCallback) this.onActionCallback('delete_book', { bookId });
          }
        );
      });
    });

    // === System Owner override controls (on others' books) ===
    grid.querySelectorAll('.btn-sysowner-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const ownerName = btn.getAttribute('data-owner');
        const book = books.find(b => b.book_id === bookId);
        if (!book) return;
        this.showConfirmDialog(
          `Edit book owned by ${ownerName}?`,
          `You are about to edit "${book.title}" on behalf of ${ownerName}. As Owner you have full override access. Proceed?`,
          () => this.showOwnerEditBookModal(book)
        );
      });
    });

    grid.querySelectorAll('.btn-sysowner-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const ownerName = btn.getAttribute('data-owner');
        const book = books.find(b => b.book_id === bookId);
        if (!book) return;
        const newState = book.status === 'Unavailable' ? 'Available' : 'Unavailable';
        this.showConfirmDialog(
          `Change availability for ${ownerName}\'s book?`,
          `You are about to mark "${book.title}" as ${newState} on behalf of ${ownerName}. Proceed?`,
          () => {
            if (this.onActionCallback) this.onActionCallback('toggle_book_availability', { bookId });
          }
        );
      });
    });

    grid.querySelectorAll('.btn-sysowner-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const ownerName = btn.getAttribute('data-owner');
        const book = books.find(b => b.book_id === bookId);
        if (!book) return;
        this.showConfirmDialog(
          `Remove book owned by ${ownerName}?`,
          `⚠️ You are about to permanently remove "${book.title}" (Copy #${book.copy_number}) from ${ownerName}\'s library. This cannot be undone. Are you absolutely sure?`,
          () => {
            if (this.onActionCallback) this.onActionCallback('delete_book', { bookId });
          }
        );
      });
    });

    // Bind fallback covers for broken image URLs to avoid inline onerror parsing errors
    grid.querySelectorAll('.book-cover').forEach(img => {
      img.addEventListener('error', () => {
        const bookCard = img.closest('.book-card');
        const bookId = bookCard.getAttribute('data-book-id');
        const book = books.find(b => b.book_id === bookId);
        const title = book ? book.title : 'Book';
        img.parentElement.innerHTML = `
          <div class="book-no-cover">
            ${ICONS.book}
            <span>${title}</span>
          </div>
        `;
      });
    });
  }

  /**
   * Renders the Borrower Dashboard
   */
  renderBorrowerDashboard(loans) {
    const view = document.getElementById('borrower-view');
    
    const activeLoans = loans.filter(l => l.status === 'Requested' || l.status === 'Approved' || l.status === 'Out');
    const pastLoans = loans.filter(l => l.status === 'Returned' || l.status === 'Rejected');

    let activeLoansHtml = '';
    if (activeLoans.length === 0) {
      activeLoansHtml = `
        <div class="glass-card" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>You have no active book loans or pending requests.</p>
        </div>
      `;
    } else {
      activeLoansHtml = activeLoans.map(loan => {
        let actionButton = '';
        let statusBadge = '';
        let progressHtml = '';
        let contactHtml = `<div class="detail-item"><span class="detail-label">Lender</span><span class="detail-value">${loan.lender_name} (Flat ${loan.lender_flat})</span></div>`;

        if (loan.status === 'Requested') {
          statusBadge = `<span class="book-badge badge-requested">Requested</span>`;
          actionButton = `<button class="btn btn-secondary btn-sm" disabled>Awaiting Approval</button>`;
        } else if (loan.status === 'Approved') {
          statusBadge = `<span class="book-badge badge-available">Approved</span>`;
          actionButton = `<button class="btn btn-warning btn-sm" style="width:100%; pointer-events:none;">Collect from Flat ${loan.lender_flat}</button>`;
          if (loan.lender_phone) {
            contactHtml += `<div class="detail-item"><span class="detail-label">Phone</span><span class="detail-value">${loan.lender_phone}</span></div>`;
          }
        } else if (loan.status === 'Out') {
          statusBadge = `<span class="book-badge badge-borrowed">Borrowed</span>`;
          actionButton = `<button class="btn btn-secondary btn-sm" disabled>Out on Loan</button>`;
          
          // Calculate due progress
          const start = new Date(loan.handover_date).getTime();
          const due = new Date(loan.due_date).getTime();
          const now = Date.now();
          const total = due - start;
          const elapsed = now - start;
          let percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
          
          let alertClass = '';
          if (percent > 85) alertClass = 'danger';
          else if (percent > 60) alertClass = 'warning';

          const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
          const dueText = daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days!` : `${daysLeft} days remaining`;

          progressHtml = `
            <div style="margin-top: 1rem;">
              <div style="display:flex; justify-content:space-between; font-size: 0.75rem; color: var(--text-secondary);">
                <span>Progress</span>
                <span class="${daysLeft < 0 ? 'text-rose' : ''}">${dueText}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar ${alertClass}" style="width: ${percent}%;"></div>
              </div>
            </div>
          `;
        }

        return `
          <div class="glass-card" style="display: flex; gap: 1.25rem; align-items: flex-start; margin-bottom: 1rem; position: relative;">
            <div style="width: 70px; aspect-ratio: 2/3; border-radius: var(--radius-sm); overflow:hidden; border: 1px solid var(--border-color); flex-shrink: 0; background: #1e293b;">
              ${loan.book_cover ? `<img src="${loan.book_cover}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color: var(--text-muted);">${ICONS.book}</div>`}
            </div>
            <div style="flex-grow: 1;">
              <div style="display:flex; justify-content:space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                <h3 style="font-size: 1rem; font-family: var(--font-title); padding-right: 80px;">${loan.book_title}</h3>
                ${statusBadge}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">by ${loan.book_author}</div>
              <div style="margin-top: -0.25rem; margin-bottom: 0.5rem;">
                <a href="https://www.goodreads.com/search?q=${encodeURIComponent(loan.book_title + ' ' + loan.book_author)}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 500; text-decoration: underline;">
                  ${ICONS.external} View on Goodreads
                </a>
              </div>
              
              <div style="font-size: 0.8rem;">
                ${contactHtml}
                <div class="detail-item"><span class="detail-label">Requested Duration</span><span class="detail-value">${loan.duration_days} days</span></div>
                ${loan.due_date ? `<div class="detail-item"><span class="detail-label">Due Date</span><span class="detail-value">${new Date(loan.due_date).toLocaleDateString()}</span></div>` : ''}
              </div>
              ${progressHtml}
            </div>
            <div style="align-self: center; margin-left: auto;">
              ${actionButton}
            </div>
          </div>
        `;
      }).join('');
    }

    let pastLoansHtml = '';
    if (pastLoans.length === 0) {
      pastLoansHtml = `<p style="color: var(--text-muted); font-size: 0.9rem;">No transaction history yet.</p>`;
    } else {
      pastLoansHtml = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Lender</th>
                <th>Request Date</th>
                <th>Returned / Rejected Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${pastLoans.map(loan => `
                <tr>
                  <td>
                    <div style="font-weight:600; color: var(--text-primary);">${loan.book_title}</div>
                    <div style="font-size:0.75rem; color: var(--text-muted);">${loan.book_author}</div>
                  </td>
                  <td>${loan.lender_name} (Flat ${loan.lender_flat})</td>
                  <td>${new Date(loan.request_date).toLocaleDateString()}</td>
                  <td>${loan.return_date ? new Date(loan.return_date).toLocaleDateString() : (loan.approval_date ? 'N/A' : 'Rejected')}</td>
                  <td>
                    <span class="book-badge ${loan.status === 'Returned' ? 'badge-available' : 'badge-lost'}">${loan.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    view.innerHTML = `
      <div class="dashboard-section">
        <h2 class="section-title font-serif" style="margin-bottom: 1.5rem;">My Borrowings</h2>
        
        <h3 style="font-size: 1.1rem; margin-bottom: 1rem; display:flex; align-items:center; gap: 6px; color: var(--accent-emerald);">
          ${ICONS.book} Active Loans & Requests
        </h3>
        <div style="margin-bottom: 2.5rem;">
          ${activeLoansHtml}
        </div>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem; display:flex; align-items:center; gap: 6px; color: var(--text-secondary);">
          ${ICONS.history} History
        </h3>
        <div>
          ${pastLoansHtml}
        </div>
      </div>
    `;

    // No return triggers bound here as only lenders can return books
  }

  /**
   * Renders the Lender Dashboard (Incoming requests, handover, returns)
   */
  /**
   * Renders the Lender Dashboard (Incoming requests, handover, returns)
   */
  renderLenderDashboard(loans, books = [], currentUser = null) {
    const view = document.getElementById('lender-view');
    
    // Group loans by operations needed
    const requests = loans.filter(l => l.status === 'Requested');
    const handovers = loans.filter(l => l.status === 'Approved');
    const activeReturns = loans.filter(l => l.status === 'Out');
    const history = loans.filter(l => l.status === 'Returned' || l.status === 'Rejected');

    // Filter books owned by the current user
    const myBooks = books.filter(b => currentUser && b.owner_email === currentUser.email);
    let myBooksHtml = '';
    if (myBooks.length === 0) {
      myBooksHtml = `<p style="color: var(--text-muted); font-size: 0.9rem; padding: 1.5rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md); text-align: center; max-width: 100%;">You haven't listed any books for lending yet. Use the Catalog tab to add a book.</p>`;
    } else {
      myBooksHtml = `
        <div class="book-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${myBooks.map(book => {
            const isAvailable = book.status === 'Available';
            let badgeClass = 'badge-available';
            if (book.status === 'Requested') badgeClass = 'badge-requested';
            if (book.status === 'Borrowed') badgeClass = 'badge-borrowed';
            if (book.status === 'Lost') badgeClass = 'badge-lost';
            if (book.status === 'Unavailable') badgeClass = 'badge-lost';

            return `
              <div class="glass-card book-card" data-book-id="${book.book_id}" style="padding: 1rem; display: flex; flex-direction: column; height: 100%; position: relative;">
                <span class="book-badge ${badgeClass}" style="position: absolute; top: 0.5rem; right: 0.5rem; font-size: 0.65rem; padding: 0.2rem 0.5rem;">${book.status}</span>
                <div class="book-cover-container" style="height: 120px; min-height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
                  ${book.cover_url ? `
                    <img class="book-cover" src="${book.cover_url}" alt="${book.title}" style="max-height: 100%; object-fit: contain; border-radius: var(--radius-sm);">
                  ` : `
                    <div class="book-no-cover" style="font-size: 0.8rem; height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); color: var(--text-muted);">
                      ${ICONS.book}
                      <span style="font-size: 0.7rem; text-align: center; display: block; margin-top: 0.25rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 90%;">${book.title}</span>
                    </div>
                  `}
                </div>
                <div class="book-info" style="padding: 0; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                  <div>
                    <h4 class="book-title" title="${book.title}" style="font-size: 0.85rem; font-family: var(--font-title); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.15rem; font-weight: 600;">${book.title}</h4>
                    <div class="book-author" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.5rem;">by ${book.author}</div>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: auto; width: 100%;">
                    <div style="display: flex; gap: 0.4rem;">
                      <button class="btn btn-secondary btn-sm btn-owner-edit" data-id="${book.book_id}" style="flex: 1; padding: 0.35rem; font-size: 0.7rem; gap: 0.2rem; display: inline-flex; align-items: center; justify-content: center;">${ICONS.edit} Edit</button>
                      <button class="btn btn-secondary btn-sm btn-owner-toggle" data-id="${book.book_id}" style="flex: 1; padding: 0.35rem; font-size: 0.7rem; gap: 0.2rem; display: inline-flex; align-items: center; justify-content: center;">
                        ${book.status === 'Unavailable' ? `${ICONS.unlock} Resume` : `${ICONS.lock} Pause`}
                      </button>
                    </div>
                    <button class="btn btn-sm btn-owner-delete" data-id="${book.book_id}" style="width: 100%; padding: 0.35rem; font-size: 0.7rem; gap: 0.2rem; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25); color: var(--accent-rose); display: inline-flex; align-items: center; justify-content: center;">
                      ${ICONS.x} Remove Copy
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Section 1: Incoming Borrow Requests
    let requestsHtml = '';
    if (requests.length === 0) {
      requestsHtml = `<p style="color: var(--text-muted); font-size: 0.9rem; padding: 1rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">No pending requests for your books.</p>`;
    } else {
      requestsHtml = requests.map(loan => {
        const loanBook = books.find(b => b.book_id === loan.book_id);
        const canEditBook = loanBook && (loanBook.owner_email === (currentUser && currentUser.email) || (currentUser && currentUser.role === 'Owner'));
        return `
          <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <h4 style="font-size: 0.95rem; font-family: var(--font-title); margin: 0;">${loan.book_title}</h4>
                ${canEditBook ? `
                  <button class="btn btn-secondary btn-sm btn-edit-loan-book" data-book-id="${loan.book_id}" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; line-height:1; display: inline-flex; align-items: center; height: auto; border-color: rgba(251,191,36,0.3); color: var(--accent-gold);">
                    ${ICONS.edit} Edit Book
                  </button>
                ` : ''}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Requested by: <strong>${loan.borrower_name}</strong> (Flat ${loan.borrower_flat})</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Duration: ${loan.duration_days} days | Note: "${loan.notes || 'None'}"</div>
            </div>
            <div style="display:flex; gap: 0.5rem;">
              <button class="btn btn-primary btn-sm btn-approve-loan" data-loan-id="${loan.loan_id}">${ICONS.check} Approve</button>
              <button class="btn btn-secondary btn-sm btn-reject-loan" data-loan-id="${loan.loan_id}">${ICONS.x} Reject</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Section 2: Handovers Pending (Awaiting pickup)
    let handoversHtml = '';
    if (handovers.length === 0) {
      handoversHtml = `<p style="color: var(--text-muted); font-size: 0.9rem; padding: 1rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">No books waiting to be collected.</p>`;
    } else {
      handoversHtml = handovers.map(loan => {
        const loanBook = books.find(b => b.book_id === loan.book_id);
        const canEditBook = loanBook && (loanBook.owner_email === (currentUser && currentUser.email) || (currentUser && currentUser.role === 'Owner'));
        return `
          <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <h4 style="font-size: 0.95rem; font-family: var(--font-title); margin: 0;">${loan.book_title}</h4>
                ${canEditBook ? `
                  <button class="btn btn-secondary btn-sm btn-edit-loan-book" data-book-id="${loan.book_id}" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; line-height:1; display: inline-flex; align-items: center; height: auto; border-color: rgba(251,191,36,0.3); color: var(--accent-gold);">
                    ${ICONS.edit} Edit Book
                  </button>
                ` : ''}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Approved for: <strong>${loan.borrower_name}</strong> (Flat ${loan.borrower_flat})</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Phone: ${loan.borrower_phone || 'N/A'}</div>
            </div>
            <div>
              <button class="btn btn-warning btn-sm btn-handover-confirm" data-loan-id="${loan.loan_id}">Confirm Handover</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Section 3: Active Lent Books & Returns
    let returnsHtml = '';
    if (activeReturns.length === 0) {
      returnsHtml = `<p style="color: var(--text-muted); font-size: 0.9rem; padding: 1rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">You have no books currently lent out.</p>`;
    } else {
      returnsHtml = activeReturns.map(loan => {
        const now = Date.now();
        const due = new Date(loan.due_date).getTime();
        const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        const dueText = daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days!` : `Due in ${daysLeft} days`;
        const loanBook = books.find(b => b.book_id === loan.book_id);
        const canEditBook = loanBook && (loanBook.owner_email === (currentUser && currentUser.email) || (currentUser && currentUser.role === 'Owner'));

        return `
          <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-color: var(--border-color);">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <h4 style="font-size: 0.95rem; font-family: var(--font-title); margin: 0;">${loan.book_title}</h4>
                ${canEditBook ? `
                  <button class="btn btn-secondary btn-sm btn-edit-loan-book" data-book-id="${loan.book_id}" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; line-height:1; display: inline-flex; align-items: center; height: auto; border-color: rgba(251,191,36,0.3); color: var(--accent-gold);">
                    ${ICONS.edit} Edit Book
                  </button>
                ` : ''}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Borrower: <strong>${loan.borrower_name}</strong> (Flat ${loan.borrower_flat}) | Phone: ${loan.borrower_phone}</div>
              <div style="font-size: 0.8rem; color: ${daysLeft < 0 ? 'var(--accent-rose)' : 'var(--text-muted)'}; margin-top: 0.25rem;">
                ${dueText} (Due: ${new Date(loan.due_date).toLocaleDateString()})
              </div>
            </div>
            <div>
              <button class="btn btn-primary btn-sm btn-return-confirm" data-loan-id="${loan.loan_id}">Mark as Returned</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Section 4: Lend History
    let historyHtml = '';
    if (history.length === 0) {
      historyHtml = `<p style="color: var(--text-muted); font-size: 0.9rem;">No lending history yet.</p>`;
    } else {
      historyHtml = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Lend Date</th>
                <th>Returned Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(loan => `
                <tr>
                  <td>
                    <div style="font-weight:600; color: var(--text-primary);">${loan.book_title}</div>
                  </td>
                  <td>${loan.borrower_name} (Flat ${loan.borrower_flat})</td>
                  <td>${loan.handover_date ? new Date(loan.handover_date).toLocaleDateString() : 'N/A'}</td>
                  <td>${loan.return_date ? new Date(loan.return_date).toLocaleDateString() : 'Rejected'}</td>
                  <td>
                    <span class="book-badge ${loan.status === 'Returned' ? 'badge-available' : 'badge-lost'}">${loan.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    view.innerHTML = `
      <div class="dashboard-section">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 class="section-title font-serif" style="margin: 0;">Lending Desk</h2>
          ${currentUser && currentUser.status === 'Approved' && (currentUser.role === 'Lender' || currentUser.role === 'Both' || currentUser.role === 'Admin' || currentUser.role === 'Owner') ? `
            <button class="btn btn-primary" id="btn-lending-add-book">${ICONS.plus} Lend a Book</button>
          ` : ''}
        </div>

        <!-- My Books Section -->
        <div style="margin-bottom: 3rem;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-gold); display:flex; align-items:center; gap: 8px;">
            ${ICONS.book} My Books Offered for Lending
          </h3>
          ${myBooksHtml}
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem;">
          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-rose); display:flex; align-items:center; gap: 8px;">
              ${ICONS.alertCircle} Incoming Requests
            </h3>
            ${requestsHtml}
          </div>

          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-blue); display:flex; align-items:center; gap: 8px;">
              ${ICONS.calendar} Handovers Pending (Awaiting Pickup)
            </h3>
            ${handoversHtml}
          </div>

          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-emerald); display:flex; align-items:center; gap: 8px;">
              ${ICONS.book} Active Loans (Confirm Returns here)
            </h3>
            ${returnsHtml}
          </div>
        </div>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-secondary); display:flex; align-items:center; gap: 8px;">
          ${ICONS.history} History
        </h3>
        <div>
          ${historyHtml}
        </div>
      </div>
    `;

    // Bind Event Listeners
    const lendingAddBtn = view.querySelector('#btn-lending-add-book');
    if (lendingAddBtn) {
      lendingAddBtn.addEventListener('click', () => this.showAddBookForm());
    }

    view.querySelectorAll('.btn-approve-loan').forEach(btn => {
      btn.addEventListener('click', () => {
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('approve_loan', { loanId });
      });
    });

    view.querySelectorAll('.btn-reject-loan').forEach(btn => {
      btn.addEventListener('click', () => {
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('reject_loan', { loanId });
      });
    });

    view.querySelectorAll('.btn-handover-confirm').forEach(btn => {
      btn.addEventListener('click', () => {
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('handover_loan', { loanId });
      });
    });

    view.querySelectorAll('.btn-return-confirm').forEach(btn => {
      btn.addEventListener('click', () => {
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('return_confirm', { loanId });
      });
    });

    // Bind inline Edit Book buttons on loan cards
    view.querySelectorAll('.btn-edit-loan-book').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-book-id');
        const book = books.find(b => b.book_id === bookId);
        if (book) {
          // If the book is owned by someone else, show surety warning
          if (book.owner_email !== (currentUser && currentUser.email)) {
            this.showConfirmDialog(
              `Edit book owned by ${book.owner_name || book.owner_email}?`,
              `You are about to edit "${book.title}" on behalf of another user. As Owner/Admin, you have full override access. Proceed?`,
              () => this.showOwnerEditBookModal(book, currentUser)
            );
          } else {
            this.showOwnerEditBookModal(book, currentUser);
          }
        }
      });
    });

    // Bind owned books edit/toggle/delete on lending desk
    view.querySelectorAll('.btn-owner-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const book = books.find(b => b.book_id === bookId);
        if (book) this.showOwnerEditBookModal(book, currentUser);
      });
    });

    view.querySelectorAll('.btn-owner-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        if (this.onActionCallback) this.onActionCallback('toggle_book_availability', { bookId });
      });
    });

    view.querySelectorAll('.btn-owner-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-id');
        const book = books.find(b => b.book_id === bookId);
        if (!book) return;
        this.showConfirmDialog(
          `Remove "${book.title}" (Copy #${book.copy_number})?`,
          'This will permanently remove this book copy from the library. Active loans are not affected.',
          () => {
            if (this.onActionCallback) this.onActionCallback('delete_book', { bookId });
          }
        );
      });
    });
  }

  /**
   * Renders the Admin Panel (Resident approval and roles management)
   */
  renderAdminDashboard(users, currentUser) {
    const view = document.getElementById('admin-view');
    const isOwnerUser = currentUser && currentUser.role === 'Owner';

    const pendingUsers = users.filter(u => u.status === 'Pending');
    const approvedUsers = users.filter(u => u.status === 'Approved');
    const suspendedUsers = users.filter(u => u.status === 'Suspended');

    const statusBadge = (status) => {
      const map = { Approved: 'badge-available', Pending: 'badge-requested', Suspended: 'badge-lost' };
      return `<span class="book-badge ${map[status] || 'badge-requested'}" style="position:static; font-size:0.7rem;">${status}</span>`;
    };

    const roleBadge = (role) => {
      const colorMap = {
        Owner:    'var(--accent-rose)',
        Admin:    'var(--accent-rose)',
        Both:     'var(--accent-emerald)',
        Lender:   'var(--accent-blue)',
        Borrower: 'var(--accent-gold)'
      };
      const icon = role === 'Owner' ? '👑 ' : role === 'Admin' ? '🛡️ ' : '';
      return `<span style="font-size:0.7rem; font-weight:600; color:${colorMap[role] || 'var(--text-secondary)'}; white-space:nowrap;">${icon}${role}</span>`;
    };

    const renderUserRows = (userList) => {
      if (userList.length === 0) return `<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 2rem;">No users in this group.</td></tr>`;

      return userList.map(u => {
        const isSelf = currentUser && u.email === currentUser.email;
        const isTargetOwner = u.role === 'Owner';
        const canEdit = !isTargetOwner || isOwnerUser; // Only Owner can edit another Owner

        // Promote/Demote buttons only visible to Owner
        let promoDemoBtns = '';
        if (isOwnerUser && !isSelf) {
          if (u.role === 'Admin') {
            promoDemoBtns = `<button class="btn btn-secondary btn-sm btn-demote-admin" data-email="${u.email}" data-name="${u.name}" style="gap:0.3rem; font-size:0.7rem;">${ICONS.x} Remove Admin</button>`;
          } else if (u.role !== 'Owner') {
            promoDemoBtns = `<button class="btn btn-primary btn-sm btn-promote-admin" data-email="${u.email}" data-name="${u.name}" style="gap:0.3rem; font-size:0.7rem;">🛡️ Make Admin</button>`;
          }
        }

        return `
          <tr data-email="${u.email}">
            <td>
              <div style="font-weight: 600; color: var(--text-primary);">${u.name}${isSelf ? ' <span style="font-size:0.65rem;color:var(--text-muted);">(you)</span>' : ''}</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">${u.email}</div>
            </td>
            <td>Flat <strong>${u.flat_number}</strong></td>
            <td>${u.phone_number || '—'}</td>
            <td>${roleBadge(u.role)}</td>
            <td>${statusBadge(u.status)}</td>
            <td>
              <div style="display:flex; gap: 0.4rem; flex-wrap: wrap;">
                ${canEdit ? `<button class="btn btn-secondary btn-sm btn-admin-edit" data-email="${u.email}" style="gap:0.3rem;">${ICONS.edit} Edit</button>` : `<span style="font-size:0.75rem; color:var(--text-muted);">Owner</span>`}
                ${promoDemoBtns}
                ${canEdit ? (u.status === 'Pending' ? `
                  <button class="btn btn-primary btn-sm btn-admin-status" data-email="${u.email}" data-status="Approved" style="gap:0.3rem;">${ICONS.check} Approve</button>
                  <button class="btn btn-danger btn-sm btn-admin-status" data-email="${u.email}" data-status="Suspended" style="gap:0.3rem;">${ICONS.lock} Block</button>
                ` : u.status === 'Approved' && !isTargetOwner ? `
                  <button class="btn btn-danger btn-sm btn-admin-status" data-email="${u.email}" data-status="Suspended" style="gap:0.3rem;">${ICONS.lock} Block</button>
                ` : u.status === 'Suspended' ? `
                  <button class="btn btn-primary btn-sm btn-admin-status" data-email="${u.email}" data-status="Approved" style="gap:0.3rem;">${ICONS.unlock} Unblock</button>
                ` : '') : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    };

    view.innerHTML = `
      <div class="dashboard-section">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 1.5rem; flex-wrap:wrap; gap:1rem;">
          <h2 class="section-title font-serif">Admin Panel</h2>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="search-wrapper" style="position:relative;">
              <span class="search-icon" style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none;">${ICONS.search}</span>
              <input type="text" class="form-control search-input" id="admin-user-search" placeholder="Search by name, email, flat..." style="padding-left:2.25rem; min-width:220px;">
            </div>
          </div>
        </div>

        ${pendingUsers.length > 0 ? `
        <div style="background: rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.2); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:2rem;">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--accent-gold); display:flex; align-items:center; gap: 8px;">
            ${ICONS.alertCircle} Pending Approvals (${pendingUsers.length})
          </h3>
          <div class="table-container admin-user-section" data-group="pending">
            <table><thead><tr>
              <th>Member</th><th>Flat</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr></thead><tbody>${renderUserRows(pendingUsers)}</tbody></table>
          </div>
        </div>
        ` : ''}

        <div style="margin-bottom:2rem;">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--accent-emerald); display:flex; align-items:center; gap: 8px;">
            ${ICONS.check} Active Residents (${approvedUsers.length})
          </h3>
          <div class="table-container admin-user-section" data-group="approved">
            <table><thead><tr>
              <th>Member</th><th>Flat</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr></thead><tbody>${renderUserRows(approvedUsers)}</tbody></table>
          </div>
        </div>

        ${suspendedUsers.length > 0 ? `
        <div>
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--accent-rose); display:flex; align-items:center; gap: 8px;">
            ${ICONS.lock} Blocked Accounts (${suspendedUsers.length})
          </h3>
          <div class="table-container admin-user-section" data-group="suspended">
            <table><thead><tr>
              <th>Member</th><th>Flat</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr></thead><tbody>${renderUserRows(suspendedUsers)}</tbody></table>
          </div>
        </div>
        ` : ''}
      </div>
    `;

    // Search filter
    document.getElementById('admin-user-search').addEventListener('input', (e) => {
      const q = normalizeString(e.target.value);
      view.querySelectorAll('tr[data-email]').forEach(row => {
        const text = normalizeString(row.textContent);
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });

    // Status-change buttons (Approve/Block/Unblock)
    view.querySelectorAll('.btn-admin-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetEmail = btn.getAttribute('data-email');
        const nextStatus = btn.getAttribute('data-status');
        const targetUser = users.find(u => u.email === targetEmail);
        const name = targetUser ? targetUser.name : targetEmail;
        const actionVerb = nextStatus === 'Approved' ? 'Approve/Unblock' : 'Block';
        
        this.showConfirmDialog(
          `Confirm Status Update: ${actionVerb}`,
          `Are you sure you want to change the status of "${name}" to "${nextStatus}"?`,
          () => {
            if (this.onActionCallback) {
              this.onActionCallback('admin_update_status', { targetEmail, status: nextStatus, role: targetUser ? targetUser.role : null });
            }
          }
        );
      });
    });

    // Edit user buttons
    view.querySelectorAll('.btn-admin-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetEmail = btn.getAttribute('data-email');
        const targetUser = users.find(u => u.email === targetEmail);
        if (targetUser) this.showAdminEditUserModal(targetUser, currentUser);
      });
    });

    // Owner: Promote to Admin
    view.querySelectorAll('.btn-promote-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetEmail = btn.getAttribute('data-email');
        const targetName = btn.getAttribute('data-name');
        this.showConfirmDialog(
          `Promote ${targetName} to Admin?`,
          `${targetName} will gain Admin privileges — they can approve/block users and manage the library. Proceed?`,
          () => {
            const targetUser = users.find(u => u.email === targetEmail);
            if (this.onActionCallback) this.onActionCallback('admin_update_status', {
              targetEmail, status: (targetUser ? targetUser.status : 'Approved'), role: 'Admin'
            });
          }
        );
      });
    });

    // Owner: Demote from Admin
    view.querySelectorAll('.btn-demote-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetEmail = btn.getAttribute('data-email');
        const targetName = btn.getAttribute('data-name');
        this.showConfirmDialog(
          `Remove Admin role from ${targetName}?`,
          `${targetName} will lose Admin privileges and revert to a regular Both (Lend & Borrow) member. Proceed?`,
          () => {
            const targetUser = users.find(u => u.email === targetEmail);
            if (this.onActionCallback) this.onActionCallback('admin_update_status', {
              targetEmail, status: (targetUser ? targetUser.status : 'Approved'), role: 'Both'
            });
          }
        );
      });
    });
  }

  /**
   * Admin modal: edit any user's profile details
   * currentUser: the logged-in admin/owner making the change
   */
  showAdminEditUserModal(user, currentUser) {
    const isOwnerUser = currentUser && currentUser.role === 'Owner';
    const isSelf = currentUser && user.email === currentUser.email;
    const flatParts = (user.flat_number || 'A1:000').split(':');
    const flatBlock = flatParts[0] || 'A1';
    const flatFloorFlatRaw = flatParts[1] || '000';
    const flatFloor = flatFloorFlatRaw.charAt(0);
    const flatNum = flatFloorFlatRaw.substring(1);

    const bodyHtml = `
      <form id="admin-edit-user-form">
        <div style="display:flex; gap:1rem; align-items:center; padding:1rem; background:var(--bg-surface); border-radius:var(--radius-lg); margin-bottom:1.5rem; border:1px solid var(--border-color);">
          <div class="user-avatar" style="width:2.75rem; height:2.75rem; font-size:1rem; flex-shrink:0;">
            <span>${user.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}</span>
          </div>
          <div>
            <div style="font-weight:600; color:var(--text-primary);">${user.name}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${user.email}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="admin-edit-name">Full Name *</label>
          <input type="text" class="form-control" id="admin-edit-name" value="${user.name || ''}" required placeholder="Full Name">
        </div>

        <div class="form-group">
          <label class="form-label">Flat / Building Location *</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0.5rem;">
            <div>
              <label class="form-label" for="admin-edit-block" style="font-size: 0.75rem; color: var(--text-secondary);">Block</label>
              <select class="form-control" id="admin-edit-block" required>
                <option value="A1" ${flatBlock==='A1'?'selected':''}>A1</option>
                <option value="A2" ${flatBlock==='A2'?'selected':''}>A2</option>
                <option value="B1" ${flatBlock==='B1'?'selected':''}>B1</option>
                <option value="B2" ${flatBlock==='B2'?'selected':''}>B2</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="admin-edit-floor" style="font-size: 0.75rem; color: var(--text-secondary);">Floor</label>
              <select class="form-control" id="admin-edit-floor" required>
                ${[0,1,2,3,4,5,6,7,8,9].map(f=>`<option value="${f}" ${String(f)===flatFloor?'selected':''}>${f===0?'0 (Ground)':f}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="form-label" for="admin-edit-flatnum" style="font-size: 0.75rem; color: var(--text-secondary);">Flat No.</label>
              <select class="form-control" id="admin-edit-flatnum" required>
                <!-- Dynamically populated -->
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="admin-edit-phone">Phone Number *</label>
          <input type="tel" class="form-control" id="admin-edit-phone" value="${user.phone_number || ''}" required placeholder="e.g. 9876543210">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="admin-edit-role">Role</label>
            <select class="form-control" id="admin-edit-role">
              <option value="Both" ${user.role==='Both'?'selected':''}>Both (Lend &amp; Borrow)</option>
              <option value="Borrower" ${user.role==='Borrower'?'selected':''}>Borrower only</option>
              <option value="Lender" ${user.role==='Lender'?'selected':''}>Lender only</option>
              <option value="Admin" ${user.role==='Admin'?'selected':''}>Admin</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="admin-edit-status">Account Status</label>
            <select class="form-control" id="admin-edit-status">
              <option value="Approved" ${user.status==='Approved'?'selected':''}>Approved</option>
              <option value="Pending" ${user.status==='Pending'?'selected':''}>Pending</option>
              <option value="Suspended" ${user.status==='Suspended'?'selected':''}>Suspended (Blocked)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
          <button type="button" class="btn btn-secondary" id="admin-edit-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="admin-edit-submit">${ICONS.check} Save Changes</button>
        </div>
      </form>
    `;

    this.showModal(`Edit Member: ${user.name}`, bodyHtml);
    document.getElementById('admin-edit-cancel').addEventListener('click', () => this.hideModal());

    // Flat number population
    const blockSel = document.getElementById('admin-edit-block');
    const flatNumSel = document.getElementById('admin-edit-flatnum');
    const flatRanges = { 'A1': { min: 0, max: 13 }, 'A2': { min: 12, max: 24 }, 'B1': { min: 25, max: 32 }, 'B2': { min: 33, max: 40 } };
    const populateFlats = (selectedNum) => {
      const range = flatRanges[blockSel.value] || { min: 0, max: 13 };
      flatNumSel.innerHTML = '';
      for (let i = range.min; i <= range.max; i++) {
        const padded = String(i).padStart(2, '0');
        const opt = document.createElement('option');
        opt.value = padded;
        opt.textContent = padded;
        if (padded === selectedNum) opt.selected = true;
        flatNumSel.appendChild(opt);
      }
    };
    blockSel.addEventListener('change', () => populateFlats(null));
    populateFlats(flatNum);

    document.getElementById('admin-edit-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const block = blockSel.value;
      const floor = document.getElementById('admin-edit-floor').value;
      const num = flatNumSel.value;
      const formattedFlat = `${block}:${floor}${num}`;
      const payload = {
        targetEmail: user.email,
        name: document.getElementById('admin-edit-name').value,
        flatNumber: formattedFlat,
        phoneNumber: document.getElementById('admin-edit-phone').value,
        role: document.getElementById('admin-edit-role').value,
        status: document.getElementById('admin-edit-status').value
      };
      
      const doSubmit = () => {
        if (this.onActionCallback) this.onActionCallback('admin_edit_user', payload);
      };

      if (user.email !== (currentUser && currentUser.email)) {
        this.showConfirmDialog(
          'Confirm Profile Modification',
          `You are editing the profile details for "${user.name}" (${user.email}). Are you sure you want to save these changes on their behalf?`,
          doSubmit
        );
      } else {
        doSubmit();
      }
    });
  }

  /**
   * Shows user's own profile edit modal
   */
  showEditProfileModal(user) {
    const flatParts = (user.flat_number || 'A1:000').split(':');
    const flatBlock = flatParts[0] || 'A1';
    const flatFloorFlatRaw = flatParts[1] || '000';
    const flatFloor = flatFloorFlatRaw.charAt(0);
    const flatNum = flatFloorFlatRaw.substring(1);

    const bodyHtml = `
      <form id="edit-profile-form">
        <div style="display:flex; gap:1rem; align-items:center; padding:1rem; background:var(--bg-surface); border-radius:var(--radius-lg); margin-bottom:1.5rem; border:1px solid var(--border-color);">
          <div class="user-avatar" style="width:2.75rem; height:2.75rem; font-size:1rem; flex-shrink:0;">
            <span>${user.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}</span>
          </div>
          <div>
            <div style="font-weight:600; color:var(--text-primary);">${user.email}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Role: <strong>${user.role}</strong> · Status: <strong>${user.status}</strong></div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="profile-edit-name">Full Name *</label>
          <input type="text" class="form-control" id="profile-edit-name" value="${user.name || ''}" required placeholder="Full Name">
        </div>

        <div class="form-group">
          <label class="form-label">Flat / Building Location *</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0.5rem;">
            <div>
              <label class="form-label" for="profile-edit-block" style="font-size: 0.75rem; color: var(--text-secondary);">Block</label>
              <select class="form-control" id="profile-edit-block" required>
                <option value="A1" ${flatBlock==='A1'?'selected':''}>A1</option>
                <option value="A2" ${flatBlock==='A2'?'selected':''}>A2</option>
                <option value="B1" ${flatBlock==='B1'?'selected':''}>B1</option>
                <option value="B2" ${flatBlock==='B2'?'selected':''}>B2</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="profile-edit-floor" style="font-size: 0.75rem; color: var(--text-secondary);">Floor</label>
              <select class="form-control" id="profile-edit-floor" required>
                ${[0,1,2,3,4,5,6,7,8,9].map(f=>`<option value="${f}" ${String(f)===flatFloor?'selected':''}>${f===0?'0 (Ground)':f}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="form-label" for="profile-edit-flatnum" style="font-size: 0.75rem; color: var(--text-secondary);">Flat No.</label>
              <select class="form-control" id="profile-edit-flatnum" required></select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="profile-edit-phone">Phone Number *</label>
          <input type="tel" class="form-control" id="profile-edit-phone" value="${user.phone_number || ''}" required placeholder="e.g. 9876543210">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
          <button type="button" class="btn btn-secondary" id="profile-edit-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="profile-edit-submit">${ICONS.check} Save Changes</button>
        </div>
      </form>
    `;

    this.showModal('Edit My Profile', bodyHtml);
    document.getElementById('profile-edit-cancel').addEventListener('click', () => this.hideModal());

    const blockSel = document.getElementById('profile-edit-block');
    const flatNumSel = document.getElementById('profile-edit-flatnum');
    const flatRanges = { 'A1': { min: 0, max: 13 }, 'A2': { min: 12, max: 24 }, 'B1': { min: 25, max: 32 }, 'B2': { min: 33, max: 40 } };
    const populateFlats = (selectedNum) => {
      const range = flatRanges[blockSel.value] || { min: 0, max: 13 };
      flatNumSel.innerHTML = '';
      for (let i = range.min; i <= range.max; i++) {
        const padded = String(i).padStart(2, '0');
        const opt = document.createElement('option');
        opt.value = padded;
        opt.textContent = padded;
        if (padded === selectedNum) opt.selected = true;
        flatNumSel.appendChild(opt);
      }
    };
    blockSel.addEventListener('change', () => populateFlats(null));
    populateFlats(flatNum);

    document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const block = blockSel.value;
      const floor = document.getElementById('profile-edit-floor').value;
      const num = flatNumSel.value;
      const payload = {
        name: document.getElementById('profile-edit-name').value,
        flatNumber: `${block}:${floor}${num}`,
        phoneNumber: document.getElementById('profile-edit-phone').value
      };
      if (this.onActionCallback) this.onActionCallback('edit_profile', payload);
    });
  }

  showAddBookForm() {
    const bodyHtml = `
      <form id="add-book-form">
        <div class="alert-banner" id="isbn-lookup-alert" style="display:none; margin-bottom: 1rem;">
          <div class="spinner" id="isbn-spinner" style="display:none; width: 1rem; height: 1rem; border-width: 1.5px; flex-shrink:0;"></div>
          <div>
            <div class="alert-banner-title" id="isbn-alert-title">Search Info</div>
            <div class="alert-banner-desc" id="isbn-alert-desc">Details auto-fetched!</div>
          </div>
        </div>

        <div class="form-group" style="position: relative;">
          <label class="form-label" for="book-search-query">Search Book by Title, Author, or ISBN</label>
          <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
            <div style="flex-grow: 1;">
              <input type="text" class="form-control" id="book-search-query" placeholder="e.g. The Hobbit, George Orwell, or 9780261102217" autocomplete="off">
            </div>
            <button type="button" class="btn btn-secondary" id="btn-isbn-lookup" style="height: 42px;">Fetch Details</button>
          </div>
          <div id="search-results-picker"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="book-title">Book Title *</label>
          <input type="text" class="form-control" id="book-title" placeholder="e.g. The Hobbit" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="book-author">Author *</label>
          <input type="text" class="form-control" id="book-author" placeholder="e.g. J.R.R. Tolkien" required>
        </div>

        <div class="form-group">
          <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span>Select Cover Artwork Option</span>
            <button type="button" class="btn-link" id="btn-toggle-custom-cover" style="font-size: 0.75rem; color: var(--accent-gold); background: none; border: none; cursor: pointer; text-decoration: underline; padding: 0;">Use Custom URL</button>
          </label>
          
          <div id="cover-carousel-wrapper">
            <div id="cover-thumbnails-list" class="cover-thumbnails-list">
              <div class="cover-thumbnail-placeholder">
                No Book Selected
              </div>
            </div>
          </div>
          
          <div id="custom-cover-input-wrapper" style="display: none; margin-top: 0.5rem;">
            <input type="url" class="form-control" id="book-cover" placeholder="https://example.com/cover.jpg" autocomplete="off" style="width: 100%;">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="book-isbn">ISBN (Optional)</label>
          <input type="text" class="form-control" id="book-isbn" placeholder="e.g. 9780261102217" autocomplete="off">
        </div>

        <div class="form-group">
          <label class="form-label" for="book-copies">Number of Copies</label>
          <select class="form-control" id="book-copies">
            <option value="1" selected>1 copy</option>
            <option value="2">2 copies</option>
            <option value="3">3 copies</option>
            <option value="5">5 copies</option>
          </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
          <button type="button" class="btn btn-secondary" id="btn-add-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="btn-add-submit">Add to Library</button>
        </div>
      </form>
    `;

    this.showModal("Lend a New Book", bodyHtml);

    // Cancel Button
    document.getElementById('btn-add-cancel').addEventListener('click', () => this.hideModal());

    // Search and Autofill logic!
    const searchInput = document.getElementById('book-search-query');
    const isbnBtn = document.getElementById('btn-isbn-lookup');
    const resultsPicker = document.getElementById('search-results-picker');
    const lookupAlert = document.getElementById('isbn-lookup-alert');
    const alertTitle = document.getElementById('isbn-alert-title');
    const alertDesc = document.getElementById('isbn-alert-desc');
    const spinner = document.getElementById('isbn-spinner');

    const btnToggleCustomCover = document.getElementById('btn-toggle-custom-cover');
    const customCoverInputWrapper = document.getElementById('custom-cover-input-wrapper');
    const coverCarouselWrapper = document.getElementById('cover-carousel-wrapper');
    const bookCoverInput = document.getElementById('book-cover');
    const thumbnailsList = document.getElementById('cover-thumbnails-list');

    let customCoverMode = false;
    btnToggleCustomCover.addEventListener('click', () => {
      customCoverMode = !customCoverMode;
      if (customCoverMode) {
        customCoverInputWrapper.style.display = 'block';
        coverCarouselWrapper.style.display = 'none';
        btnToggleCustomCover.innerText = 'Use Carousel';
      } else {
        customCoverInputWrapper.style.display = 'none';
        coverCarouselWrapper.style.display = 'block';
        btnToggleCustomCover.innerText = 'Use Custom URL';
        // Re-apply selected carousel cover url if any
        const selectedThumb = coverCarouselWrapper.querySelector('.cover-thumbnail-item.selected');
        if (selectedThumb) {
          bookCoverInput.value = selectedThumb.getAttribute('data-large-url') || '';
        }
      }
    });

    const renderCoverCarousel = async (doc) => {
      // Show loading spinner
      thumbnailsList.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
          <div class="spinner" style="width: 1rem; height: 1rem; border-width: 1.5px;"></div>
          <span>Loading cover options...</span>
        </div>
      `;

      let coverCandidates = [];
      const addCover = (thumb, large) => {
        if (!large) return;
        if (!coverCandidates.some(c => c.large === large)) {
          coverCandidates.push({ thumb, large });
        }
      };

      // Add basic covers from search doc
      if (doc.cover_i) {
        addCover(
          `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
          `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        );
      }
      if (doc.cover_edition_key) {
        addCover(
          `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`,
          `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`
        );
      }

      // Query work API details for additional covers
      if (doc.key) {
        try {
          const workRes = await fetch(`https://openlibrary.org${doc.key}.json`);
          if (workRes.ok) {
            const workData = await workRes.json();
            if (workData && workData.covers && Array.isArray(workData.covers)) {
              workData.covers.forEach(coverId => {
                if (coverId && coverId > 0) {
                  addCover(
                    `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
                    `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                  );
                }
              });
            }
          }
        } catch (e) {
          console.warn("Failed to fetch additional work covers:", e);
        }
      }

      // Add edition key covers
      if (doc.edition_key && Array.isArray(doc.edition_key)) {
        doc.edition_key.slice(0, 5).forEach(ekey => {
          addCover(
            `https://covers.openlibrary.org/b/olid/${ekey}-M.jpg`,
            `https://covers.openlibrary.org/b/olid/${ekey}-L.jpg`
          );
        });
      }

      // Add ISBN covers
      if (doc.isbn && Array.isArray(doc.isbn)) {
        doc.isbn.slice(0, 3).forEach(isbnNum => {
          addCover(
            `https://covers.openlibrary.org/b/isbn/${isbnNum}-M.jpg`,
            `https://covers.openlibrary.org/b/isbn/${isbnNum}-L.jpg`
          );
        });
      }

      thumbnailsList.innerHTML = '';
      if (coverCandidates.length === 0) {
        thumbnailsList.innerHTML = `
          <div class="cover-thumbnail-placeholder">
            No Covers Found. Click 'Use Custom URL' to add one.
          </div>
        `;
        if (!customCoverMode) {
          bookCoverInput.value = '';
        }
        return;
      }

      let displayedCount = 0;

      const renderNextBatch = (batchSize) => {
        const existingMoreBtn = thumbnailsList.querySelector('.cover-thumbnail-more');
        if (existingMoreBtn) {
          existingMoreBtn.remove();
        }

        const batch = coverCandidates.slice(displayedCount, displayedCount + batchSize);
        batch.forEach((cover) => {
          const item = document.createElement('div');
          item.className = 'cover-thumbnail-item';
          item.setAttribute('data-large-url', cover.large);

          const img = document.createElement('img');
          img.src = cover.thumb;
          img.alt = 'Cover option';

          img.onerror = () => {
            item.style.display = 'none';
            if (item.classList.contains('selected')) {
              const visibleItems = Array.from(thumbnailsList.querySelectorAll('.cover-thumbnail-item'))
                .filter(el => el.style.display !== 'none' && el !== item);
              if (visibleItems.length > 0) {
                visibleItems[0].click();
              } else {
                bookCoverInput.value = '';
              }
            }
          };

          item.appendChild(img);

          item.addEventListener('click', () => {
            thumbnailsList.querySelectorAll('.cover-thumbnail-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            if (!customCoverMode) {
              bookCoverInput.value = cover.large;
            }
          });

          thumbnailsList.appendChild(item);
        });

        displayedCount += batch.length;

        // Auto select first visible if nothing selected
        const selectedItem = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
        if (!selectedItem) {
          const firstVisible = Array.from(thumbnailsList.querySelectorAll('.cover-thumbnail-item'))
            .find(el => el.style.display !== 'none');
          if (firstVisible) {
            firstVisible.click();
          }
        }

        if (displayedCount < coverCandidates.length) {
          const moreBtn = document.createElement('div');
          moreBtn.className = 'cover-thumbnail-more';
          moreBtn.innerHTML = `<span>+ More</span>`;
          moreBtn.addEventListener('click', () => {
            renderNextBatch(5);
          });
          thumbnailsList.appendChild(moreBtn);
        }
      };

      // Initial batch of 3 covers
      renderNextBatch(3);
    };

    let debounceTimer = null;

    const triggerSearch = async () => {
      const query = searchInput.value.trim();
      if (!query || query.length < 3) {
        resultsPicker.style.display = 'none';
        resultsPicker.innerHTML = '';
        lookupAlert.style.display = 'none';
        return;
      }

      spinner.style.display = 'block';
      lookupAlert.style.display = 'flex';
      lookupAlert.style.background = 'var(--bg-surface)';
      lookupAlert.style.border = '1px solid var(--border-color)';
      alertTitle.style.color = 'var(--text-secondary)';
      alertTitle.innerText = "Querying Open Library...";
      alertDesc.innerText = `Searching for "${query}"`;
      resultsPicker.style.display = 'none';

      try {
        const isIsbn = /^[0-9xX\-\s]+$/.test(query);
        let docs = [];

        if (isIsbn) {
          const isbnClean = query.replace(/[-\s]/g, '');
          const searchUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(isbnClean)}&limit=5`;
          const response = await fetch(searchUrl);
          const data = await response.json();
          docs = data.docs || [];
        } else {
          // Parallel search across title, author, and general fields with wildcards
          const titleUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}*&limit=20`;
          const authorUrl = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}*&limit=20`;
          const qUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}*&limit=20`;

          const [resTitle, resAuthor, resQ] = await Promise.all([
            fetch(titleUrl).then(r => r.json()).catch(() => ({ docs: [] })),
            fetch(authorUrl).then(r => r.json()).catch(() => ({ docs: [] })),
            fetch(qUrl).then(r => r.json()).catch(() => ({ docs: [] }))
          ]);

          const combined = [...(resTitle.docs || []), ...(resAuthor.docs || []), ...(resQ.docs || [])];
          
          // Deduplicate by work/doc key
          const seen = new Set();
          for (const doc of combined) {
            if (doc.key && !seen.has(doc.key)) {
              seen.add(doc.key);
              docs.push(doc);
            }
          }
        }

        // Check if query has changed in the input since the API call started
        if (searchInput.value.trim() !== query) return;

        if (docs.length > 0) {
          const lowerQuery = normalizeString(query);

          // Calculate match score to prioritize actual partial matches
          const getScore = (doc) => {
            let score = 0;
            const title = normalizeString(doc.title);
            const subtitle = normalizeString(doc.subtitle);

            if (title.includes(lowerQuery)) {
              if (title.startsWith(lowerQuery)) {
                score += 100;
              } else {
                score += 50;
              }
            } else if (subtitle.includes(lowerQuery)) {
              score += 40;
            }

            if (doc.author_name && doc.author_name.some(name => normalizeString(name).includes(lowerQuery))) {
              score += 30;
            }

            if (doc.isbn && doc.isbn.some(num => normalizeString(num).includes(lowerQuery))) {
              score += 80;
            }

            return score;
          };

          // Filter and sort docs to prioritize matches containing the partial string
          let processedDocs = docs.map(doc => ({ doc, score: getScore(doc) }));
          
          if (processedDocs.some(item => item.score > 0)) {
            processedDocs = processedDocs.filter(item => item.score > 0);
          }

          processedDocs.sort((a, b) => b.score - a.score);
          const displayDocs = processedDocs.map(item => item.doc).slice(0, 5);

          resultsPicker.innerHTML = '';
          displayDocs.forEach(doc => {
            const item = document.createElement('div');
            item.className = 'search-result-item';

            const coverUrl = doc.cover_i 
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg` 
              : (doc.cover_edition_key ? `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-S.jpg` : '');

            item.innerHTML = `
              <div class="result-cover">
                ${coverUrl ? `<img src="${coverUrl}" alt="${doc.title}">` : ICONS.book}
              </div>
              <div class="result-info">
                <div class="result-title" title="${doc.title}">${doc.title}</div>
                <div class="result-author" title="by ${doc.author_name ? doc.author_name.join(', ') : 'Unknown'}">by ${doc.author_name ? doc.author_name.join(', ') : 'Unknown'} (${doc.first_publish_year || 'N/A'})</div>
              </div>
            `;

            item.addEventListener('click', async () => {
              document.getElementById('book-title').value = doc.title || '';
              document.getElementById('book-author').value = doc.author_name ? doc.author_name.join(', ') : 'Unknown';
              document.getElementById('book-isbn').value = doc.isbn ? doc.isbn[0] : '';

              resultsPicker.style.display = 'none';
              resultsPicker.innerHTML = '';

              lookupAlert.style.background = 'rgba(16, 185, 129, 0.08)';
              lookupAlert.style.border = '1px solid rgba(16, 185, 129, 0.15)';
              alertTitle.innerText = "Details Autofilled!";
              alertTitle.style.color = 'var(--accent-emerald)';
              alertDesc.innerText = `Selected "${doc.title}"`;
              this.showToast("Book details retrieved successfully!");

              // Render Carousel!
              await renderCoverCarousel(doc);
            });

            resultsPicker.appendChild(item);
          });

          resultsPicker.style.display = 'block';
          lookupAlert.style.display = 'none';
        } else {
          lookupAlert.style.background = 'rgba(244, 63, 94, 0.08)';
          lookupAlert.style.border = '1px solid rgba(244, 63, 94, 0.15)';
          alertTitle.innerText = "No Results Found";
          alertTitle.style.color = 'var(--accent-rose)';
          alertDesc.innerText = "No books matched this query. Please enter details manually.";
          resultsPicker.style.display = 'none';
          resultsPicker.innerHTML = '';
        }
      } catch (err) {
        console.error("Open Library Fetch error:", err);
        lookupAlert.style.background = 'rgba(244, 63, 94, 0.08)';
        lookupAlert.style.border = '1px solid rgba(244, 63, 94, 0.15)';
        alertTitle.innerText = "Fetch Error";
        alertTitle.style.color = 'var(--accent-rose)';
        alertDesc.innerText = "Failed to query search database. Enter details manually.";
        resultsPicker.style.display = 'none';
        resultsPicker.innerHTML = '';
      } finally {
        spinner.style.display = 'none';
      }
    };

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(triggerSearch, 400);
    });

    isbnBtn.addEventListener('click', () => {
      clearTimeout(debounceTimer);
      triggerSearch();
    });

    const clickOutsideHandler = (e) => {
      const picker = document.getElementById('search-results-picker');
      if (!picker) {
        document.removeEventListener('click', clickOutsideHandler);
        return;
      }
      if (picker.style.display === 'block' && !picker.contains(e.target) && e.target !== searchInput && e.target !== isbnBtn) {
        picker.style.display = 'none';
      }
    };
    document.addEventListener('click', clickOutsideHandler);

    // Form Submit
    document.getElementById('add-book-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const payload = {
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        isbn: document.getElementById('book-isbn').value,
        coverUrl: document.getElementById('book-cover').value,
        copies: document.getElementById('book-copies').value
      };

      if (this.onActionCallback) {
        this.onActionCallback('add_book', payload);
      }
    });
  }


  /**
   * Lightweight confirm dialog (reuses the modal)
   */
  showConfirmDialog(title, message, onConfirm) {
    const bodyHtml = `
      <div>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">${message}</p>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
          <button class="btn btn-danger" id="confirm-ok">${ICONS.x} Confirm Remove</button>
        </div>
      </div>
    `;
    this.showModal(title, bodyHtml);
    document.getElementById('confirm-cancel').addEventListener('click', () => this.hideModal());
    document.getElementById('confirm-ok').addEventListener('click', () => {
      this.hideModal();
      onConfirm();
    });
  }

  /**
   * Owner: Edit book details modal (author, ISBN, cover — NOT title)
   */
  showOwnerEditBookModal(book, currentUser = null) {
    const bodyHtml = `
      <form id="owner-edit-book-form">
        <div style="display:flex; gap:1rem; align-items:center; padding:1rem; background:var(--bg-surface); border-radius:var(--radius-lg); margin-bottom:1.5rem; border:1px solid var(--border-color);">
          <div id="book-edit-cover-preview" style="width:56px; aspect-ratio:2/3; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border-color); background:var(--book-cover-bg); flex-shrink:0;">
            ${book.cover_url ? `<img src="${book.cover_url}" style="width:100%;height:100%;object-fit:cover;" id="book-edit-cover-img">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);">${ICONS.book}</div>`}
          </div>
          <div>
            <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">${book.title}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Copy #${book.copy_number} &middot; ISBN: ${book.isbn || 'N/A'}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="book-edit-author">Author *</label>
          <input type="text" class="form-control" id="book-edit-author" value="${book.author || ''}" required placeholder="e.g. J.R.R. Tolkien">
        </div>

        <div class="form-group">
          <label class="form-label" for="book-edit-isbn">ISBN</label>
          <input type="text" class="form-control" id="book-edit-isbn" value="${book.isbn || ''}" placeholder="e.g. 9780261102217" autocomplete="off">
        </div>

        <div class="form-group">
          <label class="form-label" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span>Cover Image</span>
            <button type="button" id="book-edit-toggle-cover" style="font-size:0.75rem; color:var(--accent-gold); background:none; border:none; cursor:pointer; text-decoration:underline; padding:0;">Use Custom URL</button>
          </label>

          <div id="book-edit-carousel-wrapper">
            <div id="book-edit-thumbnails-list" class="cover-thumbnails-list">
              ${book.cover_url
                ? `<div class="cover-thumbnail-item selected" data-large-url="${book.cover_url}">
                     <img src="${book.cover_url.replace('-L.jpg','-M.jpg').replace('-S.jpg','-M.jpg')}" alt="Current cover">
                   </div>
                   <div class="cover-thumbnail-more" id="book-edit-load-more"><span>+ More</span></div>`
                : `<div class="cover-thumbnail-placeholder">No cover. Search more options or use a custom URL.</div>
                   <div class="cover-thumbnail-more" id="book-edit-load-more" style="display:${book.isbn || book.title ? 'flex' : 'none'}"><span>+ Load Covers</span></div>`}
            </div>
          </div>

          <div id="book-edit-custom-wrapper" style="display:none; margin-top:0.5rem;">
            <input type="url" class="form-control" id="book-edit-cover-url" value="${book.cover_url || ''}" placeholder="https://example.com/cover.jpg" autocomplete="off" style="width:100%;">
          </div>
          <!-- Hidden field always holds the current cover URL -->
          <input type="hidden" id="book-edit-cover-value" value="${book.cover_url || ''}">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-color);">
          <button type="button" class="btn btn-secondary" id="book-edit-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="book-edit-submit">${ICONS.check} Save Changes</button>
        </div>
      </form>
    `;

    this.showModal(`Edit: ${book.title}`, bodyHtml);
    document.getElementById('book-edit-cancel').addEventListener('click', () => this.hideModal());

    const coverValueInput = document.getElementById('book-edit-cover-value');
    const coverImg = document.getElementById('book-edit-cover-img');
    const thumbnailsList = document.getElementById('book-edit-thumbnails-list');
    const carouselWrapper = document.getElementById('book-edit-carousel-wrapper');
    const customWrapper = document.getElementById('book-edit-custom-wrapper');
    const toggleBtn = document.getElementById('book-edit-toggle-cover');
    const loadMoreBtn = document.getElementById('book-edit-load-more');

    let customMode = false;

    // Toggle Custom URL vs Carousel
    toggleBtn.addEventListener('click', () => {
      customMode = !customMode;
      if (customMode) {
        carouselWrapper.style.display = 'none';
        customWrapper.style.display = 'block';
        toggleBtn.textContent = 'Use Carousel';
        // Sync custom input with current value
        document.getElementById('book-edit-cover-url').value = coverValueInput.value;
      } else {
        carouselWrapper.style.display = 'block';
        customWrapper.style.display = 'none';
        toggleBtn.textContent = 'Use Custom URL';
        // Sync back from carousel selection
        const selected = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
        if (selected) coverValueInput.value = selected.getAttribute('data-large-url') || '';
      }
    });

    // Custom URL input: live preview
    document.getElementById('book-edit-cover-url').addEventListener('input', (e) => {
      coverValueInput.value = e.target.value;
    });

    // Thumbnail click handler helper
    const selectThumb = (item) => {
      thumbnailsList.querySelectorAll('.cover-thumbnail-item').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      coverValueInput.value = item.getAttribute('data-large-url') || '';
    };

    // Bind existing thumbnail if present
    thumbnailsList.querySelectorAll('.cover-thumbnail-item').forEach(item => {
      item.addEventListener('click', () => selectThumb(item));
      const imgEl = item.querySelector('img');
      if (imgEl) {
        imgEl.addEventListener('error', () => { item.style.display = 'none'; });
      }
    });

    // Load More: fetch covers from Open Library
    if (loadMoreBtn) {
      let allCovers = [];
      let displayedCount = 0;
      let coversLoaded = false;

      const loadCovers = async () => {
        loadMoreBtn.innerHTML = `<div class="spinner" style="width:1rem;height:1rem;border-width:1.5px;"></div>`;
        loadMoreBtn.style.pointerEvents = 'none';

        if (!coversLoaded) {
          coversLoaded = true;
          const coverCandidates = [];
          const addCover = (thumb, large) => {
            if (!large) return;
            if (!coverCandidates.some(c => c.large === large)) coverCandidates.push({ thumb, large });
          };

          // Current cover first
          if (book.cover_url) {
            addCover(book.cover_url.replace('-L.jpg','-M.jpg').replace('-S.jpg','-M.jpg'), book.cover_url);
          }

          // Search by ISBN or title/author
          try {
            const q = book.isbn
              ? `https://openlibrary.org/search.json?isbn=${encodeURIComponent(book.isbn)}&limit=1`
              : `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}*&author=${encodeURIComponent(book.author || '')}*&limit=3`;

            const res = await fetch(q);
            const data = await res.json();
            const docs = data.docs || [];

            for (const doc of docs.slice(0, 3)) {
              if (doc.cover_i) addCover(
                `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
                `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              );
              if (doc.cover_edition_key) addCover(
                `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`,
                `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`
              );
              // Work covers
              if (doc.key) {
                try {
                  const wr = await fetch(`https://openlibrary.org${doc.key}.json`);
                  if (wr.ok) {
                    const wd = await wr.json();
                    (wd.covers || []).forEach(id => {
                      if (id > 0) addCover(`https://covers.openlibrary.org/b/id/${id}-M.jpg`, `https://covers.openlibrary.org/b/id/${id}-L.jpg`);
                    });
                  }
                } catch(_) {}
              }
            }
          } catch(_) {}

          allCovers = coverCandidates;
        }

        // Render next batch
        loadMoreBtn.remove();
        const batch = allCovers.slice(displayedCount, displayedCount + 5);
        batch.forEach(cover => {
          const item = document.createElement('div');
          item.className = 'cover-thumbnail-item';
          item.setAttribute('data-large-url', cover.large);
          const img = document.createElement('img');
          img.src = cover.thumb;
          img.alt = 'Cover';
          img.onerror = () => item.style.display = 'none';
          item.appendChild(img);
          item.addEventListener('click', () => selectThumb(item));
          thumbnailsList.appendChild(item);
        });
        displayedCount += batch.length;

        // Auto-select first visible if nothing selected
        if (!thumbnailsList.querySelector('.cover-thumbnail-item.selected')) {
          const first = Array.from(thumbnailsList.querySelectorAll('.cover-thumbnail-item')).find(el => el.style.display !== 'none');
          if (first) selectThumb(first);
        }

        if (displayedCount < allCovers.length) {
          const moreBtn = document.createElement('div');
          moreBtn.className = 'cover-thumbnail-more';
          moreBtn.innerHTML = '<span>+ More</span>';
          moreBtn.addEventListener('click', loadCovers);
          thumbnailsList.appendChild(moreBtn);
        }
      };

      loadMoreBtn.addEventListener('click', loadCovers);
    }

    // Form submit
    document.getElementById('owner-edit-book-form').addEventListener('submit', (e) => {
      e.preventDefault();
      // If in custom URL mode, use that input value
      if (customMode) {
        coverValueInput.value = document.getElementById('book-edit-cover-url').value;
      }
      const payload = {
        bookId: book.book_id,
        author: document.getElementById('book-edit-author').value,
        isbn: document.getElementById('book-edit-isbn').value,
        coverUrl: coverValueInput.value
      };
      
      const doSubmit = () => {
        if (this.onActionCallback) this.onActionCallback('edit_book', payload);
      };

      if (currentUser && book.owner_email !== currentUser.email) {
        this.showConfirmDialog(
          'Confirm Override Changes',
          `You are editing "${book.title}" on behalf of another user (${book.owner_name || book.owner_email}). Are you sure you want to proceed?`,
          doSubmit
        );
      } else {
        doSubmit();
      }
    });
  }

  showRequestBorrowForm(book) {

    const bodyHtml = `
      <div>
        <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem;">
          <div style="width: 80px; aspect-ratio: 2/3; border-radius: var(--radius-sm); overflow:hidden; border: 1px solid var(--border-color); background: #1e293b; flex-shrink:0;">
            ${book.cover_url ? `<img src="${book.cover_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color: var(--text-muted);">${ICONS.book}</div>`}
          </div>
          <div>
            <h3 style="font-size: 1.1rem; font-family: var(--font-title); color: var(--text-primary);">${book.title}</h3>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">by ${book.author}</div>
            <div style="margin-top: -0.25rem; margin-bottom: 0.5rem;">
              <a href="https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn || (book.title + ' ' + book.author))}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 500; text-decoration: underline;">
                ${ICONS.external} View on Goodreads
              </a>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Lender Flat: <strong>${book.owner_flat}</strong> (${book.owner_name})
            </div>
          </div>
        </div>

        <form id="borrow-request-form">
          <div class="form-group">
            <label class="form-label">Duration of Borrowing *</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div>
                <label class="form-label" for="borrow-duration-val" style="font-size: 0.75rem; color: var(--text-secondary);">Value</label>
                <input type="number" class="form-control" id="borrow-duration-val" value="2" min="1" required>
              </div>
              <div>
                <label class="form-label" for="borrow-duration-unit" style="font-size: 0.75rem; color: var(--text-secondary);">Unit</label>
                <select class="form-control" id="borrow-duration-unit" required>
                  <option value="days">Days</option>
                  <option value="weeks" selected>Weeks</option>
                </select>
              </div>
            </div>
            <div id="duration-warning" style="display: none; font-size: 0.8rem; margin-top: 0.5rem; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--accent-gold); color: var(--accent-gold); background: rgba(212, 163, 89, 0.08); line-height: 1.4;">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="borrow-notes">Note to Lender (Optional)</label>
            <textarea class="form-control" id="borrow-notes" rows="2" placeholder="e.g. Will take good care of it, thanks!"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" id="btn-borrow-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-borrow-submit">Send Borrow Request</button>
          </div>
        </form>
      </div>
    `;

    this.showModal("Confirm Borrow Request", bodyHtml);

    document.getElementById('btn-borrow-cancel').addEventListener('click', () => this.hideModal());

    const valInput = document.getElementById('borrow-duration-val');
    const unitSelect = document.getElementById('borrow-duration-unit');
    const warningDiv = document.getElementById('duration-warning');
    const submitBtn = document.getElementById('btn-borrow-submit');

    function validateDuration() {
      const val = parseInt(valInput.value, 10) || 0;
      const unit = unitSelect.value;
      const days = unit === 'weeks' ? val * 7 : val;

      if (days > 28) {
        warningDiv.style.display = 'block';
        warningDiv.innerHTML = `<span style="font-weight:bold;">Lending Limit Notice:</span> Maximum duration is capped at 4 weeks (28 days). If more time is required, please lend/request it again later after returning the book.`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      } else if (days < 1) {
        warningDiv.style.display = 'block';
        warningDiv.innerHTML = `<span style="font-weight:bold;">Notice:</span> Minimum borrow duration is 1 day.`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      } else {
        warningDiv.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    }

    valInput.addEventListener('input', validateDuration);
    unitSelect.addEventListener('change', validateDuration);

    document.getElementById('borrow-request-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const val = parseInt(valInput.value, 10) || 0;
      const unit = unitSelect.value;
      const days = unit === 'weeks' ? val * 7 : val;

      if (days > 28 || days < 1) {
        return;
      }

      const payload = {
        bookId: book.book_id,
        durationDays: days,
        notes: document.getElementById('borrow-notes').value
      };

      if (this.onActionCallback) {
        this.onActionCallback('borrow_request', payload);
      }
    });
  }

  showRegistrationForm(prefilledEmail, prefilledName) {
    const mainContent = document.getElementById('main-content');
    
    // Hide stats and search
    const statsSec = document.getElementById('stats-summary');
    if (statsSec) statsSec.style.display = 'none';

    mainContent.innerHTML = `
      <div style="max-width: 480px; margin: 4rem auto; padding: 2rem;" class="glass-card">
        <h2 class="font-serif" style="font-size: 1.75rem; margin-bottom: 0.5rem; text-align: center; color: var(--accent-emerald);">Resident Onboarding</h2>
        <p style="color: var(--text-secondary); text-align: center; font-size: 0.9rem; margin-bottom: 1.5rem;">
          To join the society library database, please complete your profile.
        </p>

        <form id="onboarding-form">
          <div class="form-group">
            <label class="form-label">Google Account Email</label>
            <input type="text" class="form-control" value="${prefilledEmail}" readonly style="opacity: 0.7;">
          </div>
          
          <div class="form-group">
            <label class="form-label" for="reg-name">Full Name *</label>
            <input type="text" class="form-control" id="reg-name" value="${prefilledName}" required placeholder="John Doe">
          </div>

          <div class="form-group">
            <label class="form-label">Flat / Building Location *</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0.5rem;">
              <div>
                <label class="form-label" for="reg-block" style="font-size: 0.75rem; color: var(--text-secondary);">Block</label>
                <select class="form-control" id="reg-block" required>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>
              <div>
                <label class="form-label" for="reg-floor" style="font-size: 0.75rem; color: var(--text-secondary);">Floor</label>
                <select class="form-control" id="reg-floor" required>
                  <option value="0">0 (Ground)</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              <div>
                <label class="form-label" for="reg-flat-num" style="font-size: 0.75rem; color: var(--text-secondary);">Flat No.</label>
                <select class="form-control" id="reg-flat-num" required>
                  <!-- Dynamically populated -->
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-phone">Phone Number *</label>
            <input type="tel" class="form-control" id="reg-phone" required placeholder="e.g. 9876543210">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.75rem;">Submit Profile</button>
        </form>
      </div>
    `;

    // Dynamic flat numbers population based on block limits
    const blockSelect = document.getElementById('reg-block');
    const flatSelect = document.getElementById('reg-flat-num');
    const flatRanges = {
      'A1': { min: 0, max: 13 },
      'A2': { min: 12, max: 24 },
      'B1': { min: 25, max: 32 },
      'B2': { min: 33, max: 40 }
    };

    function populateFlats() {
      const selectedBlock = blockSelect.value;
      const range = flatRanges[selectedBlock];
      flatSelect.innerHTML = '';
      for (let i = range.min; i <= range.max; i++) {
        const paddedVal = String(i).padStart(2, '0');
        const option = document.createElement('option');
        option.value = paddedVal;
        option.textContent = paddedVal;
        flatSelect.appendChild(option);
      }
    }

    blockSelect.addEventListener('change', populateFlats);
    populateFlats(); // Initial trigger

    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const block = document.getElementById('reg-block').value;
      const floor = document.getElementById('reg-floor').value;
      const flatNum = document.getElementById('reg-flat-num').value;
      const formattedFlat = `${block}:${floor}${flatNum}`;

      const payload = {
        name: document.getElementById('reg-name').value,
        flatNumber: formattedFlat,
        phoneNumber: document.getElementById('reg-phone').value,
        role: 'Both'
      };

      if (this.onActionCallback) {
        this.onActionCallback('register_submit', payload);
      }
    });
  }

  showPendingApprovalScreen(user) {
    const mainContent = document.getElementById('main-content');
    
    // Hide stats
    const statsSec = document.getElementById('stats-summary');
    if (statsSec) statsSec.style.display = 'none';

    mainContent.innerHTML = `
      <div style="max-width: 480px; margin: 6rem auto; text-align: center; padding: 3rem;" class="glass-card">
        <div style="color: var(--accent-gold); font-size: 3rem; margin-bottom: 1.5rem; animation: pulse 2s infinite;">
          ${ICONS.alertCircle}
        </div>
        <h2 class="font-serif" style="font-size: 1.75rem; margin-bottom: 1rem;">Profile Under Review</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
          Hi <strong>${user.name}</strong>, your request to register flat <strong>${user.flat_number}</strong> is pending admin approval.
        </p>
        <div style="font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
          Please reach out to the society library representative or administrator to activate your account.
        </div>
      </div>
    `;
  }
}

export const LibraryUI = new UiService();
