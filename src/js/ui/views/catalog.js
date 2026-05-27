/**
 * Society Library Management System - Catalog View Component
 */
import { ICONS } from '../icons.js';
import { showToast } from '../components/toast.js';
import { showModal, hideModal, showConfirmDialog } from '../components/modal.js';
import { fetchRichBookMetadata, renderCoverCarousel } from '../../services/metadata.js';

let onViewChangeCallback = null;
let onActionCallback = null;

export function initCatalogView(onViewChange, onAction) {
  onViewChangeCallback = onViewChange;
  onActionCallback = onAction;
}

const normalizeString = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export function renderCatalogView(books, currentUser) {
  const viewContainer = document.getElementById('catalog-view');
  let viewMode = localStorage.getItem('lib_catalog_view') || 'grid';
  
  // Extract unique genres for dynamic checkbox dropdown
  const genresSet = new Set();
  books.forEach(book => {
    if (book.genre) {
      book.genre.split(/[,;]+/).forEach(g => {
        const trimmed = g.trim();
        if (trimmed) genresSet.add(trimmed);
      });
    }
  });
  const uniqueGenres = Array.from(genresSet).sort();
  
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
          <input type="text" class="form-control search-input" id="catalog-search" placeholder="Search by title, author, genre, or ISBN...">
        </div>
        <select class="form-control" id="catalog-filter-availability" style="max-width: 180px;">
          <option value="all" selected>All Copies</option>
          <option value="available">Only Available</option>
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
        <div class="genre-dropdown-container" id="genre-dropdown-container">
          <button type="button" class="form-control genre-dropdown-btn" id="genre-dropdown-btn">
            <span>All Genres</span>
            <span class="genre-dropdown-arrow">▼</span>
          </button>
          <div class="genre-dropdown-menu" id="genre-dropdown-menu">
            ${uniqueGenres.length === 0 ? `
              <div style="padding:0.5rem;font-size:0.8rem;color:var(--text-muted);text-align:center;">No genres found</div>
            ` : uniqueGenres.map(genre => `
              <label class="genre-checkbox-label">
                <input type="checkbox" value="${genre}" class="genre-checkbox-input">
                <span>${genre}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="catalog-toolbar">
        <span style="font-size:0.8rem; color:var(--text-muted);" id="catalog-count"></span>
        <div class="view-toggle-group">
          <button class="view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}" id="view-btn-grid" title="Grid View">${ICONS.grid} Grid</button>
          <button class="view-toggle-btn ${viewMode === 'list' ? 'active' : ''}" id="view-btn-list" title="List View">${ICONS.list} List</button>
        </div>
      </div>

      <div id="catalog-grid">
        <!-- Book cards will render here -->
      </div>
    </div>
  `;

  // Bind event listeners for search and filters
  const searchInput = document.getElementById('catalog-search');
  const filterSelect = document.getElementById('catalog-filter-availability');
  const ownershipSelect = document.getElementById('catalog-filter-ownership');
  const gridBtn = document.getElementById('view-btn-grid');
  const listBtn = document.getElementById('view-btn-list');
  const countLabel = document.getElementById('catalog-count');

  const genreDropdownBtn = document.getElementById('genre-dropdown-btn');
  const genreDropdownMenu = document.getElementById('genre-dropdown-menu');
  const genreDropdownContainer = document.getElementById('genre-dropdown-container');

  const filterAndRender = () => {
    const query = searchInput.value;
    const normQuery = normalizeString(query);
    const availability = filterSelect.value;
    const ownership = ownershipSelect ? ownershipSelect.value : 'all';
    
    // Get selected genres from checkboxes
    const checkedBoxes = document.querySelectorAll('.genre-checkbox-input:checked');
    const selectedGenres = Array.from(checkedBoxes).map(cb => cb.value);

    // Update dropdown button text
    if (genreDropdownBtn) {
      const btnSpan = genreDropdownBtn.querySelector('span');
      if (selectedGenres.length === 0) {
        btnSpan.textContent = 'All Genres';
        btnSpan.style.color = 'var(--text-secondary)';
      } else if (selectedGenres.length === 1) {
        btnSpan.textContent = selectedGenres[0];
        btnSpan.style.color = 'var(--text-primary)';
      } else {
        btnSpan.textContent = `Genres (${selectedGenres.length})`;
        btnSpan.style.color = 'var(--text-primary)';
      }
    }
    
    const filtered = books.filter(book => {
      const textMatch = 
        normalizeString(book.title).includes(normQuery) ||
        normalizeString(book.author).includes(normQuery) ||
        (book.owner_name && normalizeString(book.owner_name).includes(normQuery)) ||
        (book.owner_flat && normalizeString(book.owner_flat).includes(normQuery)) ||
        (book.isbn && normalizeString(book.isbn).includes(normQuery)) ||
        (book.genre && normalizeString(book.genre).includes(normQuery));
      
      let statusMatch = true;
      if (availability === 'available') {
        statusMatch = book.status === 'Available';
      } else if (availability === 'borrowed') {
        statusMatch = book.status === 'Borrowed' || book.status === 'Requested';
      }

      let ownershipMatch = true;
      if (ownership === 'mine') {
        ownershipMatch = currentUser && book.owner_email === currentUser.email;
      } else if (ownership.startsWith('book-')) {
        const targetBookId = ownership.replace('book-', '');
        ownershipMatch = book.book_id === targetBookId;
      }

      let genreMatch = true;
      if (selectedGenres.length > 0) {
        if (book.genre) {
          const bookGenres = book.genre.split(/[,;]+/).map(g => g.trim().toLowerCase());
          genreMatch = selectedGenres.some(sg => bookGenres.includes(sg.toLowerCase()));
        } else {
          genreMatch = false;
        }
      }

      return textMatch && statusMatch && ownershipMatch && genreMatch;
    });

    if (countLabel) countLabel.textContent = `${filtered.length} book${filtered.length !== 1 ? 's' : ''}`;
    renderBookGrid(filtered, currentUser, viewMode);
  };

  searchInput.addEventListener('input', filterAndRender);
  filterSelect.addEventListener('change', filterAndRender);
  if (ownershipSelect) ownershipSelect.addEventListener('change', filterAndRender);

  // Bind checkbox change listeners
  document.querySelectorAll('.genre-checkbox-input').forEach(cb => {
    cb.addEventListener('change', filterAndRender);
  });

  // Dropdown toggle listeners
  if (genreDropdownBtn && genreDropdownMenu) {
    genreDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = genreDropdownMenu.style.display === 'block';
      genreDropdownMenu.style.display = isOpen ? 'none' : 'block';
      genreDropdownContainer.classList.toggle('open', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (genreDropdownContainer && !genreDropdownContainer.contains(e.target)) {
        genreDropdownMenu.style.display = 'none';
        genreDropdownContainer.classList.remove('open');
      }
    });
  }

  // View toggle
  gridBtn.addEventListener('click', () => {
    viewMode = 'grid';
    localStorage.setItem('lib_catalog_view', 'grid');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    filterAndRender();
  });
  listBtn.addEventListener('click', () => {
    viewMode = 'list';
    localStorage.setItem('lib_catalog_view', 'list');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    filterAndRender();
  });

  filterAndRender();

  const addBtn = document.getElementById('btn-add-book');
  if (addBtn) addBtn.addEventListener('click', () => showAddBookForm());

  // Remove existing legacy FAB if any
  const existingFab = document.getElementById('fab-add-book');
  if (existingFab) existingFab.remove();
}

export function renderBookGrid(books, currentUser, viewMode = 'grid') {
  const grid = document.getElementById('catalog-grid');
  if (books.length === 0) {
    grid.className = '';
    grid.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
        ${ICONS.book}
        <p style="margin-top: 1rem; font-size: 1rem;">No books match your filters.</p>
      </div>
    `;
    return;
  }

  if (viewMode === 'list') {
    grid.className = 'book-list';
    grid.innerHTML = books.map(book => {
      const isOwner = currentUser && book.owner_email === currentUser.email;
      const isSystemOwner = currentUser && currentUser.role === 'Owner';
      const isAvailable = book.status === 'Available';
      let badgeClass = 'badge-available';
      if (book.status === 'Requested') badgeClass = 'badge-requested';
      if (book.status === 'Borrowed') badgeClass = 'badge-borrowed';
      if (book.status === 'Unavailable' || book.status === 'Lost') badgeClass = 'badge-lost';

      const genres = book.genre ? book.genre.split(',').map(g => g.trim()).filter(Boolean) : [];
      const genreHtml = genres.slice(0, 2).map(g => `<span class="genre-chip">${g}</span>`).join('');
      const pagesHtml = book.pages ? `<span class="book-meta-pill">${ICONS.pages} ${book.pages}p</span>` : '';
      const yearHtml = book.publish_year ? `<span class="book-meta-pill">${book.publish_year}</span>` : '';

      let actionHtml = '';
      if (isOwner) {
        actionHtml = `
          <span class="book-badge ${badgeClass}" style="position:static; display:inline-block; margin-bottom:0.35rem;">${book.status}</span>
          <div style="display:flex; gap:0.3rem;">
            <button class="btn btn-secondary btn-sm btn-owner-edit" data-id="${book.book_id}" title="Edit">${ICONS.edit}</button>
            <button class="btn btn-secondary btn-sm btn-owner-toggle" data-id="${book.book_id}" title="Toggle">${book.status === 'Unavailable' ? ICONS.unlock : ICONS.lock}</button>
            <button class="btn btn-sm btn-owner-delete" data-id="${book.book_id}" title="Remove" style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.25); color:var(--accent-rose);">${ICONS.x}</button>
          </div>`;
      } else if (isSystemOwner) {
        actionHtml = `
          <span class="book-badge ${badgeClass}" style="position:static; display:inline-block; margin-bottom:0.35rem;">${book.status}</span>
          <div style="display:flex; gap:0.3rem;">
            <button class="btn btn-secondary btn-sm btn-sysowner-edit" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" title="Edit">${ICONS.edit}</button>
            <button class="btn btn-sm btn-sysowner-delete" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" title="Remove" style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.25); color:var(--accent-rose);">${ICONS.x}</button>
          </div>`;
      } else if (isAvailable && currentUser && currentUser.status === 'Approved') {
        actionHtml = `
          <span class="book-badge ${badgeClass}" style="position:static; display:inline-block; margin-bottom:0.35rem;">${book.status}</span>
          <button class="btn btn-primary btn-sm btn-request-borrow" data-id="${book.book_id}">Request</button>`;
      } else if (isAvailable && !currentUser) {
        actionHtml = `
          <span class="book-badge ${badgeClass}" style="position:static; display:inline-block; margin-bottom:0.35rem;">${book.status}</span>
          <button class="btn btn-primary btn-sm btn-signin-redirect">Sign in</button>`;
      } else {
        actionHtml = `<span class="book-badge ${badgeClass}" style="position:static; display:inline-block;">${book.status}</span>`;
      }

      return `
        <div class="book-list-row" data-book-id="${book.book_id}">
          <div class="book-list-cover">
            ${book.cover_url
              ? `<img src="${book.cover_url}" alt="${book.title}" class="book-list-cover-img">`
              : `<div class="book-list-no-cover">${ICONS.book}</div>`}
          </div>
          <div class="book-list-meta">
            <div class="book-list-title" title="${book.title}">${book.title}</div>
            <div class="book-list-author">by ${book.author}${book.publish_year ? ` &middot; ${book.publish_year}` : ''}</div>
            <div class="book-list-details">
              ${genreHtml}
              ${pagesHtml}
              ${yearHtml && !book.publish_year ? yearHtml : ''}
              <span class="book-meta-pill">${ICONS.user} Flat ${book.owner_flat || 'N/A'}</span>
            </div>
          </div>
          <div class="book-list-actions">${actionHtml}</div>
        </div>
      `;
    }).join('');

    _bindBookGridEvents(books, currentUser, grid);
    grid.querySelectorAll('.book-list-cover-img').forEach(img => {
      img.addEventListener('error', () => {
        img.parentElement.innerHTML = `<div class="book-list-no-cover">${ICONS.book}</div>`;
      });
    });
    return;
  }

  grid.className = 'book-grid';
  grid.innerHTML = books.map(book => {
    const isOwner = currentUser && book.owner_email === currentUser.email;
    const isSystemOwner = currentUser && currentUser.role === 'Owner';
    const isAvailable = book.status === 'Available';
    
    let badgeClass = 'badge-available';
    if (book.status === 'Requested') badgeClass = 'badge-requested';
    if (book.status === 'Borrowed') badgeClass = 'badge-borrowed';
    if (book.status === 'Lost') badgeClass = 'badge-lost';
    if (book.status === 'Unavailable') badgeClass = 'badge-lost';

    const genres = book.genre ? book.genre.split(',').map(g => g.trim()).filter(Boolean) : [];
    const genreChips = genres.slice(0, 2).map(g => `<span class="genre-chip">${g}</span>`).join('');
    const metaPills = [
      book.pages ? `<span class="book-meta-pill">${ICONS.pages} ${book.pages}p</span>` : '',
      book.publish_year ? `<span class="book-meta-pill">${book.publish_year}</span>` : ''
    ].filter(Boolean).join('');

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
          ${genreChips || metaPills ? `
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem; margin-bottom:0.4rem;">${genreChips}${metaPills}</div>
          ` : ''}
          <div style="margin-top: 0.25rem; margin-bottom: 0.5rem;">
            <a href="https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn || (book.title + ' ' + book.author))}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 500; text-decoration: underline;">
              ${ICONS.external} Goodreads
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
              <span>${book.status === 'Borrowed' ? 'Borrowed by' : 'Requested by'}: <strong>${book.borrower_name}</strong> (Flat ${book.borrower_flat})</span>
            </div>
          ` : ''}
          
          <div style="margin-top: 1rem; width: 100%;">
            ${isOwner ? `
              <div style="display:flex; flex-direction:column; gap:0.4rem; width:100%;">
                <div class="book-card-actions">
                  <button class="btn btn-secondary btn-sm btn-owner-edit" data-id="${book.book_id}" style="flex:1; gap:0.3rem;">${ICONS.edit} Edit</button>
                  <button class="btn btn-secondary btn-sm btn-owner-toggle" data-id="${book.book_id}" style="flex:1; gap:0.3rem;">${book.status === 'Unavailable' ? `${ICONS.unlock} Available` : `${ICONS.lock} Pause`}</button>
                </div>
                <button class="btn btn-sm btn-owner-delete" data-id="${book.book_id}" style="width:100%; gap:0.3rem; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.25); color:var(--accent-rose);">${ICONS.x} Remove Copy</button>
              </div>
            ` : isSystemOwner ? `
              <div style="display:flex; flex-direction:column; gap:0.4rem; width:100%;">
                <div style="font-size:0.65rem; color:var(--accent-rose); font-weight:600; opacity:0.75; text-align:center; letter-spacing:0.5px;">👑 OWNER OVERRIDE</div>
                <div class="book-card-actions">
                  <button class="btn btn-secondary btn-sm btn-sysowner-edit" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" style="flex:1; gap:0.3rem; border-color:rgba(244,63,94,0.4);">${ICONS.edit} Edit</button>
                  <button class="btn btn-secondary btn-sm btn-sysowner-toggle" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" style="flex:1; gap:0.3rem; border-color:rgba(244,63,94,0.4);">${book.status === 'Unavailable' ? `${ICONS.unlock} Avail.` : `${ICONS.lock} Pause`}</button>
                </div>
                <button class="btn btn-sm btn-sysowner-delete" data-id="${book.book_id}" data-owner="${book.owner_name || 'the owner'}" style="width:100%; gap:0.3rem; background:rgba(244,63,94,0.08); border:1px solid rgba(244,63,94,0.3); color:var(--accent-rose);">${ICONS.x} Remove Copy</button>
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

  _bindBookGridEvents(books, currentUser, grid);
  grid.querySelectorAll('.book-cover').forEach(img => {
    img.addEventListener('error', () => {
      const bookCard = img.closest('[data-book-id]');
      const bookId = bookCard ? bookCard.getAttribute('data-book-id') : null;
      const book = bookId ? books.find(b => b.book_id === bookId) : null;
      const title = book ? book.title : 'Book';
      img.parentElement.innerHTML = `<div class="book-no-cover">${ICONS.book}<span>${title}</span></div>`;
    });
  });
}

export function _bindBookGridEvents(books, currentUser, grid) {
  // Bind request buttons
  grid.querySelectorAll('.btn-request-borrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.getAttribute('data-id');
      const book = books.find(b => b.book_id === bookId);
      if (book) showRequestBorrowForm(book);
    });
  });

  // Bind signin redirect buttons for guests
  grid.querySelectorAll('.btn-signin-redirect').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onViewChangeCallback) {
        onViewChangeCallback('welcome');
      }
    });
  });

  // Bind owner Edit buttons
  grid.querySelectorAll('.btn-owner-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.getAttribute('data-id');
      const book = books.find(b => b.book_id === bookId);
      if (book) showOwnerEditBookModal(book, currentUser);
    });
  });

  // Bind owner Toggle Availability buttons
  grid.querySelectorAll('.btn-owner-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.getAttribute('data-id');
      if (onActionCallback) onActionCallback('toggle_book_availability', { bookId });
    });
  });

  // Bind owner Delete buttons
  grid.querySelectorAll('.btn-owner-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.getAttribute('data-id');
      const book = books.find(b => b.book_id === bookId);
      if (!book) return;
      showConfirmDialog(
        `Remove "${book.title}" (Copy #${book.copy_number})?`,
        'This will permanently remove this book copy from the library. Active loans are not affected.',
        () => {
          if (onActionCallback) onActionCallback('delete_book', { bookId });
        },
        'Confirm Remove',
        'btn-danger'
      );
    });
  });

  // System Owner overrides
  grid.querySelectorAll('.btn-sysowner-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.getAttribute('data-id');
      const ownerName = btn.getAttribute('data-owner');
      const book = books.find(b => b.book_id === bookId);
      if (!book) return;
      showConfirmDialog(
        `Edit book owned by ${ownerName}?`,
        `You are about to edit "${book.title}" on behalf of ${ownerName}. As Owner you have full override access. Proceed?`,
        () => showOwnerEditBookModal(book, currentUser),
        'Confirm Edit',
        'btn-primary'
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
      showConfirmDialog(
        `Change availability for ${ownerName}'s book?`,
        `You are about to mark "${book.title}" as ${newState} on behalf of ${ownerName}. Proceed?`,
        () => {
          if (onActionCallback) onActionCallback('toggle_book_availability', { bookId });
        },
        'Confirm Change',
        'btn-primary'
      );
    });
  });

  grid.querySelectorAll('.btn-sysowner-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.getAttribute('data-id');
      const ownerName = btn.getAttribute('data-owner');
      const book = books.find(b => b.book_id === bookId);
      if (!book) return;
      showConfirmDialog(
        `Remove book owned by ${ownerName}?`,
        `⚠️ You are about to permanently remove "${book.title}" (Copy #${book.copy_number}) from ${ownerName}'s library. This cannot be undone. Are you absolutely sure?`,
        () => {
          if (onActionCallback) onActionCallback('delete_book', { bookId });
        },
        'Confirm Remove',
        'btn-danger'
      );
    });
  });

  // Click card to navigate to book details
  grid.querySelectorAll('.book-card, .book-list-row').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      const bookId = el.getAttribute('data-book-id');
      if (bookId && onViewChangeCallback) {
        onViewChangeCallback(`book-details:${bookId}`);
      }
    });
  });
}

export function showAddBookForm() {
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

      <button type="button" class="details-toggle-btn" id="btn-toggle-extra-details">
        <span>📚 Additional Details (Genre, Pages, Language…)</span>
        <span id="extra-details-arrow">▼</span>
      </button>
      <div class="extra-details-section" id="extra-details-section">
        <div class="extra-details-grid">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-genre">Genre(s)</label>
            <input type="text" class="form-control" id="book-genre" placeholder="e.g. Fantasy, Adventure">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-pages">Pages</label>
            <input type="number" class="form-control" id="book-pages" placeholder="e.g. 310" min="1">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-language">Language</label>
            <input type="text" class="form-control" id="book-language" placeholder="e.g. English" value="English">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-publish-year">Publish Year</label>
            <input type="number" class="form-control" id="book-publish-year" placeholder="e.g. 1954" min="1000" max="2100">
          </div>
          <div class="form-group" style="margin-bottom:0; grid-column: 1 / -1;">
            <label class="form-label" for="book-publisher">Publisher</label>
            <input type="text" class="form-control" id="book-publisher" placeholder="e.g. HarperCollins">
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
        <button type="button" class="btn btn-secondary" id="btn-add-cancel">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btn-add-submit">Add to Library</button>
      </div>
    </form>
  `;

  showModal("Lend a New Book", bodyHtml);

  // Cancel Button
  document.getElementById('btn-add-cancel').addEventListener('click', () => hideModal());

  // Extra details toggle
  document.getElementById('btn-toggle-extra-details').addEventListener('click', () => {
    const section = document.getElementById('extra-details-section');
    const arrow = document.getElementById('extra-details-arrow');
    section.classList.toggle('open');
    arrow.textContent = section.classList.contains('open') ? '▲' : '▼';
  });

  // Search and Autofill logic
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
      const selectedThumb = coverCarouselWrapper.querySelector('.cover-thumbnail-item.selected');
      if (selectedThumb) {
        bookCoverInput.value = selectedThumb.getAttribute('data-large-url') || '';
      }
    }
  });

  const getCoversFromSearchDoc = async (doc) => {
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

    if (doc.edition_key && Array.isArray(doc.edition_key)) {
      doc.edition_key.slice(0, 5).forEach(ekey => {
        addCover(
          `https://covers.openlibrary.org/b/olid/${ekey}-M.jpg`,
          `https://covers.openlibrary.org/b/olid/${ekey}-L.jpg`
        );
      });
    }

    if (doc.isbn && Array.isArray(doc.isbn)) {
      doc.isbn.slice(0, 3).forEach(isbnNum => {
        addCover(
          `https://covers.openlibrary.org/b/isbn/${isbnNum}-M.jpg`,
          `https://covers.openlibrary.org/b/isbn/${isbnNum}-L.jpg`
        );
      });
    }

    const largeUrls = coverCandidates.map(c => c.large);
    renderCoverCarousel(largeUrls, thumbnailsList, bookCoverInput, customCoverMode);
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
        const titleUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}*&limit=20`;
        const authorUrl = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}*&limit=20`;
        const qUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}*&limit=20`;

        const [resTitle, resAuthor, resQ] = await Promise.all([
          fetch(titleUrl).then(r => r.json()).catch(() => ({ docs: [] })),
          fetch(authorUrl).then(r => r.json()).catch(() => ({ docs: [] })),
          fetch(qUrl).then(r => r.json()).catch(() => ({ docs: [] }))
        ]);

        const combined = [...(resTitle.docs || []), ...(resAuthor.docs || []), ...(resQ.docs || [])];
        
        const seen = new Set();
        for (const doc of combined) {
          if (doc.key && !seen.has(doc.key)) {
            seen.add(doc.key);
            docs.push(doc);
          }
        }
      }

      if (searchInput.value.trim() !== query) return;

      if (docs.length > 0) {
        const lowerQuery = normalizeString(query);

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
            resultsPicker.style.display = 'none';
            resultsPicker.innerHTML = '';

            lookupAlert.style.display = 'flex';
            lookupAlert.style.background = 'var(--bg-surface)';
            lookupAlert.style.border = '1px solid var(--border-color)';
            alertTitle.style.color = 'var(--text-secondary)';
            alertTitle.innerText = "Querying additional metadata...";
            alertDesc.innerText = "Fetching rich details and cover versions in parallel...";
            spinner.style.display = 'block';

            try {
              const titleVal = doc.title || '';
              const authorVal = doc.author_name ? doc.author_name.join(', ') : '';
              const isbnVal = doc.isbn ? doc.isbn[0] : '';
              const meta = await fetchRichBookMetadata(null, titleVal, authorVal, isbnVal, doc.key);

              if (meta) {
                document.getElementById('book-title').value = meta.title || titleVal || '';
                document.getElementById('book-author').value = meta.author || authorVal || 'Unknown';
                document.getElementById('book-isbn').value = meta.isbn || isbnVal || '';
                document.getElementById('book-genre').value = meta.genre || '';
                document.getElementById('book-pages').value = meta.pages || '';
                document.getElementById('book-language').value = meta.language || 'English';
                document.getElementById('book-publish-year').value = meta.publishYear || '';
                document.getElementById('book-publisher').value = meta.publisher || '';

                renderCoverCarousel(meta.coverUrls, thumbnailsList, bookCoverInput, customCoverMode);
                
                const selected = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
                if (selected) {
                  bookCoverInput.value = selected.getAttribute('data-large-url') || '';
                }

                const extraSection = document.getElementById('extra-details-section');
                const extraArrow = document.getElementById('extra-details-arrow');
                if (extraSection && !extraSection.classList.contains('open')) {
                  extraSection.classList.add('open');
                  if (extraArrow) extraArrow.textContent = '▲';
                }

                lookupAlert.style.background = 'rgba(16, 185, 129, 0.08)';
                lookupAlert.style.border = '1px solid rgba(16, 185, 129, 0.15)';
                alertTitle.innerText = "Details Autofilled!";
                alertTitle.style.color = 'var(--accent-emerald)';
                alertDesc.innerText = `Selected & Enriched "${doc.title}"`;
                showToast("Book details retrieved successfully!");
              }
            } catch (err) {
              console.error("Enrichment fetch failed", err);
              showToast("Fetched basic search details, but web enrichment failed.", "info");
              
              document.getElementById('book-title').value = doc.title || '';
              document.getElementById('book-author').value = doc.author_name ? doc.author_name.join(', ') : 'Unknown';
              document.getElementById('book-isbn').value = doc.isbn ? doc.isbn[0] : '';
              if (doc.first_publish_year) {
                document.getElementById('book-publish-year').value = doc.first_publish_year;
              }
              if (doc.number_of_pages_median) {
                document.getElementById('book-pages').value = doc.number_of_pages_median;
              }
              if (doc.publisher && doc.publisher.length > 0) {
                document.getElementById('book-publisher').value = doc.publisher[0];
              }
              if (doc.language && doc.language.length > 0) {
                const langMap = { eng: 'English', fre: 'French', ger: 'German', spa: 'Spanish', hin: 'Hindi', mar: 'Marathi' };
                document.getElementById('book-language').value = langMap[doc.language[0]] || doc.language[0];
              }
              if (doc.subject && doc.subject.length > 0) {
                document.getElementById('book-genre').value = doc.subject.slice(0, 3).join(', ');
              }
              
              const extraSection = document.getElementById('extra-details-section');
              const extraArrow = document.getElementById('extra-details-arrow');
              if (doc.first_publish_year || doc.number_of_pages_median || doc.publisher || doc.subject) {
                if (extraSection && !extraSection.classList.contains('open')) {
                  extraSection.classList.add('open');
                  if (extraArrow) extraArrow.textContent = '▲';
                }
              }
              
              await getCoversFromSearchDoc(doc);
            } finally {
              spinner.style.display = 'none';
            }
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

    const titleEl = document.getElementById('book-title');
    const authorEl = document.getElementById('book-author');
    const isbnEl = document.getElementById('book-isbn');
    const coverEl = document.getElementById('book-cover');
    const copiesEl = document.getElementById('book-copies');
    const genreEl = document.getElementById('book-genre');
    const pagesEl = document.getElementById('book-pages');
    const languageEl = document.getElementById('book-language');
    const publisherEl = document.getElementById('book-publisher');
    const publishYearEl = document.getElementById('book-publish-year');

    const payload = {
      title: titleEl ? titleEl.value.trim() : '',
      author: authorEl ? authorEl.value.trim() : '',
      isbn: isbnEl ? isbnEl.value.trim() : '',
      coverUrl: coverEl ? coverEl.value.trim() : '',
      copies: copiesEl ? copiesEl.value.trim() : '1',
      genre: genreEl ? genreEl.value.trim() : '',
      pages: pagesEl ? pagesEl.value.trim() : '',
      language: languageEl ? languageEl.value.trim() : 'English',
      publisher: publisherEl ? publisherEl.value.trim() : '',
      publishYear: publishYearEl ? publishYearEl.value.trim() : ''
    };

    if (!payload.title || !payload.author) {
      alert('Please fill in Title and Author fields.');
      return;
    }

    if (onActionCallback) {
      onActionCallback('add_book', payload);
    }
  });
}

export function showOwnerEditBookModal(book, currentUser = null) {
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
        <div style="display:flex; gap:0.5rem;">
          <input type="text" class="form-control" id="book-edit-isbn" value="${book.isbn || ''}" placeholder="e.g. 9780261102217" autocomplete="off" style="flex:1;">
          <button type="button" class="btn btn-secondary" id="book-edit-fetch-details" style="white-space:nowrap; padding: 0 0.75rem;">Fetch Details</button>
        </div>
      </div>

      <button type="button" class="details-toggle-btn" id="btn-edit-toggle-extra">
        <span>📚 Additional Details</span>
        <span id="edit-extra-arrow">▼</span>
      </button>
      <div class="extra-details-section" id="edit-extra-details-section">
        <div class="extra-details-grid">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-edit-genre">Genre(s)</label>
            <input type="text" class="form-control" id="book-edit-genre" value="${book.genre || ''}" placeholder="e.g. Fantasy, Adventure">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-edit-pages">Pages</label>
            <input type="number" class="form-control" id="book-edit-pages" value="${book.pages || ''}" placeholder="e.g. 310" min="1">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-edit-language">Language</label>
            <input type="text" class="form-control" id="book-edit-language" value="${book.language || 'English'}" placeholder="e.g. English">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="book-edit-publish-year">Publish Year</label>
            <input type="number" class="form-control" id="book-edit-publish-year" value="${book.publish_year || ''}" placeholder="e.g. 1954" min="1000" max="2100">
          </div>
          <div class="form-group" style="margin-bottom:0; grid-column: 1 / -1;">
            <label class="form-label" for="book-edit-publisher">Publisher</label>
            <input type="text" class="form-control" id="book-edit-publisher" value="${book.publisher || ''}" placeholder="e.g. HarperCollins">
          </div>
        </div>
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
        <input type="hidden" id="book-edit-cover-value" value="${book.cover_url || ''}">
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-color);">
        <button type="button" class="btn btn-secondary" id="book-edit-cancel">Cancel</button>
        <button type="submit" class="btn btn-primary" id="book-edit-submit">${ICONS.check} Save Changes</button>
      </div>
    </form>
  `;

  showModal(`Edit: ${book.title}`, bodyHtml);
  document.getElementById('book-edit-cancel').addEventListener('click', () => hideModal());

  document.getElementById('btn-edit-toggle-extra').addEventListener('click', () => {
    const s = document.getElementById('edit-extra-details-section');
    const a = document.getElementById('edit-extra-arrow');
    s.classList.toggle('open');
    a.textContent = s.classList.contains('open') ? '▲' : '▼';
  });

  if (book.genre || book.pages || book.publisher) {
    const s = document.getElementById('edit-extra-details-section');
    const a = document.getElementById('edit-extra-arrow');
    if (s) { s.classList.add('open'); if (a) a.textContent = '▲'; }
  }

  const coverValueInput = document.getElementById('book-edit-cover-value');
  const coverImg = document.getElementById('book-edit-cover-img');
  const thumbnailsList = document.getElementById('book-edit-thumbnails-list');
  const carouselWrapper = document.getElementById('book-edit-carousel-wrapper');
  const customWrapper = document.getElementById('book-edit-custom-wrapper');
  const toggleBtn = document.getElementById('book-edit-toggle-cover');
  const loadMoreBtn = document.getElementById('book-edit-load-more');

  let customMode = false;

  const fetchDetailsBtn = document.getElementById('book-edit-fetch-details');
  if (fetchDetailsBtn) {
    fetchDetailsBtn.addEventListener('click', async () => {
      const isbnVal = document.getElementById('book-edit-isbn').value.trim();
      const authorVal = document.getElementById('book-edit-author').value.trim();
      
      fetchDetailsBtn.disabled = true;
      const originalText = fetchDetailsBtn.innerHTML;
      fetchDetailsBtn.innerHTML = `<div class="spinner" style="width:1rem;height:1rem;border-width:1.5px;"></div>`;
      
      try {
        const meta = await fetchRichBookMetadata(isbnVal || book.title, book.title, authorVal, isbnVal);
        if (meta) {
          if (meta.author && !authorVal) {
            document.getElementById('book-edit-author').value = meta.author;
          }
          if (meta.isbn && !isbnVal) {
            document.getElementById('book-edit-isbn').value = meta.isbn;
          }
          document.getElementById('book-edit-genre').value = meta.genre || '';
          document.getElementById('book-edit-pages').value = meta.pages || '';
          document.getElementById('book-edit-language').value = meta.language || 'English';
          document.getElementById('book-edit-publish-year').value = meta.publishYear || '';
          document.getElementById('book-edit-publisher').value = meta.publisher || '';
          
          if (meta.coverUrls && meta.coverUrls.length > 0) {
            renderCoverCarousel(meta.coverUrls, thumbnailsList, coverValueInput, customMode);
            
            const selected = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
            if (selected) {
              const largeUrl = selected.getAttribute('data-large-url');
              coverValueInput.value = largeUrl;
              if (coverImg) {
                coverImg.src = largeUrl;
              } else {
                const previewContainer = document.getElementById('book-edit-cover-preview');
                if (previewContainer) {
                  previewContainer.innerHTML = `<img src="${largeUrl}" style="width:100%;height:100%;object-fit:cover;" id="book-edit-cover-img">`;
                }
              }
            }
          }
          
          const extraSection = document.getElementById('edit-extra-details-section');
          const arrow = document.getElementById('edit-extra-arrow');
          if (extraSection && !extraSection.classList.contains('open')) {
            extraSection.classList.add('open');
            if (arrow) arrow.textContent = '▲';
          }
          
          showToast('Successfully fetched details from the web!', 'success');
        } else {
          showToast('No metadata found for this book.', 'info');
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to fetch web details.', 'error');
      } finally {
        fetchDetailsBtn.disabled = false;
        fetchDetailsBtn.innerHTML = originalText;
      }
    });
  }

  toggleBtn.addEventListener('click', () => {
    customMode = !customMode;
    if (customMode) {
      carouselWrapper.style.display = 'none';
      customWrapper.style.display = 'block';
      toggleBtn.textContent = 'Use Carousel';
      document.getElementById('book-edit-cover-url').value = coverValueInput.value;
    } else {
      carouselWrapper.style.display = 'block';
      customWrapper.style.display = 'none';
      toggleBtn.textContent = 'Use Custom URL';
      const selected = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
      if (selected) coverValueInput.value = selected.getAttribute('data-large-url') || '';
    }
  });

  document.getElementById('book-edit-cover-url').addEventListener('input', (e) => {
    coverValueInput.value = e.target.value;
  });

  const selectThumb = (item) => {
    thumbnailsList.querySelectorAll('.cover-thumbnail-item').forEach(el => el.classList.remove('selected'));
    item.classList.add('selected');
    const largeUrl = item.getAttribute('data-large-url') || '';
    coverValueInput.value = largeUrl;
    const editCoverImg = document.getElementById('book-edit-cover-img');
    const editCoverPreview = document.getElementById('book-edit-cover-preview');
    if (editCoverImg) {
      editCoverImg.src = largeUrl;
    } else if (editCoverPreview && largeUrl) {
      editCoverPreview.innerHTML = `<img src="${largeUrl}" style="width:100%;height:100%;object-fit:cover;" id="book-edit-cover-img">`;
    }
  };

  thumbnailsList.querySelectorAll('.cover-thumbnail-item').forEach(item => {
    item.addEventListener('click', () => selectThumb(item));
    const imgEl = item.querySelector('img');
    if (imgEl) {
      imgEl.addEventListener('error', () => { item.style.display = 'none'; });
    }
  });

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

        if (book.cover_url) {
          addCover(book.cover_url.replace('-L.jpg','-M.jpg').replace('-S.jpg','-M.jpg'), book.cover_url);
        }

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

  document.getElementById('owner-edit-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (customMode) {
      coverValueInput.value = document.getElementById('book-edit-cover-url').value;
    }
    const payload = {
      bookId: book.book_id,
      author: document.getElementById('book-edit-author').value,
      isbn: document.getElementById('book-edit-isbn').value,
      coverUrl: coverValueInput.value,
      genre: document.getElementById('book-edit-genre').value,
      pages: document.getElementById('book-edit-pages').value,
      language: document.getElementById('book-edit-language').value,
      publisher: document.getElementById('book-edit-publisher').value,
      publishYear: document.getElementById('book-edit-publish-year').value
    };
    
    const doSubmit = () => {
      if (onActionCallback) onActionCallback('edit_book', payload);
    };

    if (currentUser && book.owner_email !== currentUser.email) {
      showConfirmDialog(
        'Confirm Override Changes',
        `You are editing "${book.title}" on behalf of another user (${book.owner_name || book.owner_email}). Are you sure you want to proceed?`,
        doSubmit,
        'Confirm Override',
        'btn-primary'
      );
    } else {
      doSubmit();
    }
  });
}

export function showRequestBorrowForm(book) {
  const bodyHtml = `
    <div>
      <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem;">
        <div style="width: 80px; aspect-ratio: 2/3; border-radius: var(--radius-sm); overflow:hidden; border: 1px solid var(--border-color); background: #1e293b; flex-shrink:0;">
          ${book.cover_url ? `<img src="${book.cover_url}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color: var(--text-muted);">${ICONS.book}</div>`}
        </div>
        <div style="flex-grow:1;">
          <h3 style="font-size: 1.1rem; font-family: var(--font-title); color: var(--text-primary);">${book.title}</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem;">by ${book.author}</div>
          ${book.genre ? `<div style="margin-bottom:0.4rem;">${book.genre.split(',').map(g => `<span class="genre-chip">${g.trim()}</span>`).join(' ')}</div>` : ''}
          <div style="margin-bottom: 0.5rem;">
            <a href="https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn || (book.title + ' ' + book.author))}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 500; text-decoration: underline;">${ICONS.external} Goodreads</a>
          </div>
          <div style="font-size:0.78rem;">
            ${book.pages ? `<div class="book-meta-row"><span class="book-meta-label">Pages</span><span class="book-meta-value">${book.pages}</span></div>` : ''}
            ${book.language ? `<div class="book-meta-row"><span class="book-meta-label">Language</span><span class="book-meta-value">${book.language}</span></div>` : ''}
            ${book.publisher ? `<div class="book-meta-row"><span class="book-meta-label">Publisher</span><span class="book-meta-value">${book.publisher}</span></div>` : ''}
            ${book.publish_year ? `<div class="book-meta-row"><span class="book-meta-label">Published</span><span class="book-meta-value">${book.publish_year}</span></div>` : ''}
            <div class="book-meta-row"><span class="book-meta-label">Lender</span><span class="book-meta-value">Flat ${book.owner_flat} &middot; ${book.owner_name}</span></div>
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

  showModal("Confirm Borrow Request", bodyHtml);

  document.getElementById('btn-borrow-cancel').addEventListener('click', () => hideModal());

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

    if (onActionCallback) {
      onActionCallback('borrow_request', payload);
    }
  });
}
