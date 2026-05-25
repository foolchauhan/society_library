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
  userEdit: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  grid: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  pages: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
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

  async fetchRichBookMetadata(query, title = '', author = '', isbn = '', workKey = '') {
    const results = {
      title: title || '',
      author: author || '',
      isbn: isbn || '',
      genre: '',
      pages: '',
      language: 'English',
      publisher: '',
      publishYear: '',
      coverUrls: []
    };

    const cleanIsbn = (query && /^[0-9xX\-\s]+$/.test(query) ? query : (isbn || '')).replace(/[-\s]/g, '');

    const fetchGoogleBooks = async () => {
      let gUrl = '';
      if (cleanIsbn) {
        gUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`;
      } else if (title) {
        gUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}${author ? `+inauthor:${encodeURIComponent(author)}` : ''}`;
      } else if (query) {
        gUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
      }

      if (!gUrl) return null;

      try {
        const res = await fetch(gUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.items && data.items.length > 0) {
            return data.items[0].volumeInfo;
          }
        }
      } catch (e) {
        console.warn("Google Books fetch failed:", e);
      }
      return null;
    };

    const fetchOpenLibraryWork = async () => {
      if (!workKey) return null;
      try {
        const res = await fetch(`https://openlibrary.org${workKey}.json`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn("Open Library Work fetch failed:", e);
      }
      return null;
    };

    const fetchOpenLibrarySearch = async () => {
      let olSearchUrl = '';
      if (cleanIsbn) {
        olSearchUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(cleanIsbn)}&limit=1`;
      } else if (title) {
        olSearchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
      }
      if (!olSearchUrl) return null;
      try {
        const res = await fetch(olSearchUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.docs && data.docs.length > 0) {
            return data.docs[0];
          }
        }
      } catch (e) {
        console.warn("Open Library Search fetch failed:", e);
      }
      return null;
    };

    // Trigger in parallel
    const [gInfo, olWork, olSearch] = await Promise.all([
      fetchGoogleBooks(),
      fetchOpenLibraryWork(),
      (cleanIsbn || title) ? fetchOpenLibrarySearch() : Promise.resolve(null)
    ]);

    // 1. Google Books population
    if (gInfo) {
      if (gInfo.title && !results.title) results.title = gInfo.title;
      if (gInfo.authors && !results.author) results.author = gInfo.authors.join(', ');
      if (gInfo.pageCount) results.pages = gInfo.pageCount.toString();
      if (gInfo.publisher) results.publisher = gInfo.publisher;
      if (gInfo.publishedDate) {
        const match = gInfo.publishedDate.match(/\d{4}/);
        if (match) results.publishYear = match[0];
      }
      if (gInfo.language) {
        const langMap = { en: 'English', fr: 'French', de: 'German', es: 'Spanish', hi: 'Hindi', mr: 'Marathi', ja: 'Japanese' };
        results.language = langMap[gInfo.language] || gInfo.language;
      }
      if (gInfo.categories && gInfo.categories.length > 0) {
        results.genre = gInfo.categories.join(', ');
      }
      if (gInfo.imageLinks) {
        const imgs = gInfo.imageLinks;
        const addCover = (url) => {
          if (url && !results.coverUrls.includes(url)) {
            const secureUrl = url.replace('http://', 'https://');
            results.coverUrls.push(secureUrl);
          }
        };
        addCover(imgs.thumbnail);
        addCover(imgs.smallThumbnail);
        addCover(imgs.medium);
        addCover(imgs.large);
      }
      if (gInfo.industryIdentifiers) {
        const isbn13 = gInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
        const isbn10 = gInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
        if (isbn13) results.isbn = isbn13.identifier;
        else if (isbn10) results.isbn = isbn10.identifier;
      }
    }

    // 2. Open Library Work / Search fallback/enrichment
    const olDoc = olWork || olSearch;
    if (olDoc) {
      if (olDoc.title && !results.title) results.title = olDoc.title;
      if (olDoc.authors && !results.author) {
        if (Array.isArray(olDoc.authors)) {
          if (olDoc.authors[0] && olDoc.authors[0].name) {
            results.author = olDoc.authors.map(a => a.name).join(', ');
          } else if (olSearch && olSearch.author_name) {
            results.author = olSearch.author_name.join(', ');
          }
        }
      }
      if (olDoc.subjects && Array.isArray(olDoc.subjects)) {
        const cleanSubjects = olDoc.subjects.slice(0, 5).join(', ');
        if (results.genre) {
          const existing = results.genre.toLowerCase();
          const unique = olDoc.subjects.slice(0, 5).filter(s => !existing.includes(s.toLowerCase()));
          if (unique.length > 0) results.genre += ', ' + unique.join(', ');
        } else {
          results.genre = cleanSubjects;
        }
      } else if (olSearch && olSearch.subject && !results.genre) {
        results.genre = olSearch.subject.slice(0, 3).join(', ');
      }

      if (olSearch) {
        if (olSearch.number_of_pages_median && !results.pages) {
          results.pages = olSearch.number_of_pages_median.toString();
        }
        if (olSearch.publisher && olSearch.publisher.length > 0 && !results.publisher) {
          results.publisher = olSearch.publisher[0];
        }
        if (olSearch.first_publish_year && !results.publishYear) {
          results.publishYear = olSearch.first_publish_year.toString();
        }
        if (olSearch.isbn && !results.isbn) {
          results.isbn = olSearch.isbn[0];
        }
      }

      const addOlCover = (id, type = 'id') => {
        if (!id) return;
        const large = `https://covers.openlibrary.org/b/${type}/${id}-L.jpg`;
        if (!results.coverUrls.some(url => url === large)) {
          results.coverUrls.push(large);
        }
      };

      if (olDoc.covers && Array.isArray(olDoc.covers)) {
        olDoc.covers.forEach(coverId => {
          if (coverId && coverId > 0) addOlCover(coverId, 'id');
        });
      }
      if (olSearch) {
        if (olSearch.cover_i) addOlCover(olSearch.cover_i, 'id');
        if (olSearch.cover_edition_key) addOlCover(olSearch.cover_edition_key, 'olid');
        if (olSearch.edition_key && Array.isArray(olSearch.edition_key)) {
          olSearch.edition_key.slice(0, 3).forEach(ek => addOlCover(ek, 'olid'));
        }
        if (olSearch.isbn && Array.isArray(olSearch.isbn)) {
          olSearch.isbn.slice(0, 2).forEach(isbnNum => addOlCover(isbnNum, 'isbn'));
        }
      }
    }

    return results;
  }

  renderCoverCarousel(coverUrls, thumbnailsList, coverInput, customCoverMode = false) {
    thumbnailsList.innerHTML = '';
    
    const candidates = [];
    coverUrls.forEach(url => {
      if (!url) return;
      let thumb = url;
      if (url.includes('openlibrary.org')) {
        thumb = url.replace('-L.jpg', '-M.jpg').replace('-S.jpg', '-M.jpg');
      }
      if (!candidates.some(c => c.large === url)) {
        candidates.push({ thumb, large: url });
      }
    });

    if (candidates.length === 0) {
      thumbnailsList.innerHTML = `
        <div class="cover-thumbnail-placeholder">
          No Covers Found. Click 'Use Custom URL' to add one.
        </div>
      `;
      if (!customCoverMode) {
        coverInput.value = '';
      }
      return;
    }

    let displayedCount = 0;

    const renderNextBatch = (batchSize) => {
      const existingMoreBtn = thumbnailsList.querySelector('.cover-thumbnail-more');
      if (existingMoreBtn) {
        existingMoreBtn.remove();
      }

      const batch = candidates.slice(displayedCount, displayedCount + batchSize);
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
              coverInput.value = '';
            }
          }
        };

        item.appendChild(img);

        item.addEventListener('click', () => {
          thumbnailsList.querySelectorAll('.cover-thumbnail-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          if (!customCoverMode) {
            coverInput.value = cover.large;
            const editCoverImg = document.getElementById('book-edit-cover-img');
            const editCoverPreview = document.getElementById('book-edit-cover-preview');
            if (editCoverImg) {
              editCoverImg.src = cover.large;
            } else if (editCoverPreview) {
              editCoverPreview.innerHTML = `<img src="${cover.large}" style="width:100%;height:100%;object-fit:cover;" id="book-edit-cover-img">`;
            }
          }
        });

        thumbnailsList.appendChild(item);
      });

      displayedCount += batch.length;

      const selectedItem = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
      if (!selectedItem) {
        const firstVisible = Array.from(thumbnailsList.querySelectorAll('.cover-thumbnail-item'))
          .find(el => el.style.display !== 'none');
        if (firstVisible) {
          firstVisible.click();
        }
      }

      if (displayedCount < candidates.length) {
        const moreBtn = document.createElement('div');
        moreBtn.className = 'cover-thumbnail-more';
        moreBtn.innerHTML = `<span>+ More</span>`;
        moreBtn.addEventListener('click', () => {
          renderNextBatch(5);
        });
        thumbnailsList.appendChild(moreBtn);
      }
    };

    renderNextBatch(3);
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
    const bottomNav = document.getElementById('bottom-nav');
    
    if (bottomNav) {
      bottomNav.style.display = 'none';
      bottomNav.innerHTML = '';
    }

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

    // Add Tab Navigation click handlers for top header
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

    // Populate and render mobile bottom navbar
    if (bottomNav && isApproved) {
      bottomNav.style.display = 'flex';
      let bottomLinksHtml = '';
      
      bottomLinksHtml += `
        <button class="bottom-nav-link active" data-view="catalog">
          ${ICONS.book}
          <span>Explore</span>
        </button>
      `;
      
      if (role === 'Borrower' || role === 'Both' || role === 'Admin' || role === 'Owner') {
        bottomLinksHtml += `
          <button class="bottom-nav-link" data-view="borrower">
            ${ICONS.history}
            <span>Borrows</span>
          </button>
        `;
      }
      
      // Center Add Button inside bottom nav for mobile lenders
      if (role === 'Lender' || role === 'Both' || role === 'Admin' || role === 'Owner') {
        bottomLinksHtml += `
          <button class="bottom-nav-add-btn" id="bottom-nav-add-btn" type="button" title="Lend a Book">
            <div class="bottom-nav-add-icon-wrapper">${ICONS.plus}</div>
          </button>
        `;
      }
      
      if (role === 'Lender' || role === 'Both' || role === 'Admin' || role === 'Owner') {
        bottomLinksHtml += `
          <button class="bottom-nav-link" data-view="lender">
            ${ICONS.lending}
            <span>Lending</span>
          </button>
        `;
      }
      
      if (role === 'Admin' || role === 'Owner') {
        bottomLinksHtml += `
          <button class="bottom-nav-link" data-view="admin">
            ${ICONS.settings}
            <span>${role === 'Owner' ? 'Owner' : 'Admin'}</span>
          </button>
        `;
      }
      
      bottomNav.innerHTML = bottomLinksHtml;
      
      // Bind click handlers for bottom nav
      bottomNav.querySelectorAll('.bottom-nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetView = btn.getAttribute('data-view');
          this.switchActiveTab(targetView);
          if (this.onViewChangeCallback) {
            this.onViewChangeCallback(targetView);
          }
        });
      });

      // Bind click handler for center Add Book button
      const bottomAddBtn = document.getElementById('bottom-nav-add-btn');
      if (bottomAddBtn) {
        bottomAddBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showAddBookForm();
        });
      }
    }
  }

  switchActiveTab(targetViewOrElement) {
    let view = targetViewOrElement;
    if (targetViewOrElement instanceof HTMLElement) {
      view = targetViewOrElement.getAttribute('data-view');
    }
    
    // De-activate all top links and bottom buttons
    document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(l => l.classList.remove('active'));
    
    // Activate all elements matching view
    if (view) {
      document.querySelectorAll(`[data-view="${view}"]`).forEach(l => l.classList.add('active'));
    }
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
      this.renderBookGrid(filtered, currentUser, viewMode);
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
    if (addBtn) addBtn.addEventListener('click', () => this.showAddBookForm());

    // Mobile FAB has been replaced by the persistent center Add button in the bottom navigation bar
    const existingFab = document.getElementById('fab-add-book');
    if (existingFab) existingFab.remove();
  }

  renderBookGrid(books, currentUser, viewMode = 'grid') {
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

      // Bind all list-view button events (reusing same selectors as grid)
      this._bindBookGridEvents(books, currentUser, grid);
      // Bind cover image errors
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

    this._bindBookGridEvents(books, currentUser, grid);

    // Bind fallback covers
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

  _bindBookGridEvents(books, currentUser, grid) {
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

    // Bind click to open details page when clicking anywhere on the card or list row (except buttons/links)
    grid.querySelectorAll('.book-card, .book-list-row').forEach(el => {
      el.style.cursor = 'pointer'; // Ensure pointer cursor is shown
      el.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const bookId = el.getAttribute('data-book-id');
        if (bookId && this.onViewChangeCallback) {
          this.onViewChangeCallback(`book-details:${bookId}`);
        }
      });
    });
  }

  /**
   * Renders the Borrower Dashboard
   */
  renderBorrowerDashboard(loans) {
    const view = document.getElementById('borrower-view');
    
    const activeLoans = loans.filter(l => l.status === 'Requested' || l.status === 'Approved' || l.status === 'Out' || l.status === 'ReturnPending');
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
          actionButton = `<button class="btn btn-primary btn-sm btn-mark-returned" data-loan-id="${loan.loan_id}">Return Book</button>`;
          
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
        } else if (loan.status === 'ReturnPending') {
          statusBadge = `<span class="book-badge badge-requested">Return Pending</span>`;
          actionButton = `<button class="btn btn-secondary btn-sm" disabled>Awaiting Confirm</button>`;
        }

        return `
          <div class="glass-card clickable-loan-card" data-book-id="${loan.book_id}" style="display: flex; gap: 1.25rem; align-items: flex-start; margin-bottom: 1rem; position: relative; cursor: pointer;">
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
            <div style="align-self: center; margin-left: auto; z-index: 5;">
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
                <tr class="clickable-row" data-book-id="${loan.book_id}" style="cursor: pointer;">
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

    // Bind return request buttons
    view.querySelectorAll('.btn-mark-returned').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const loanId = btn.getAttribute('data-loan-id');
        this.showConfirmDialog(
          "Mark Book as Returned?",
          "This will notify the lender that you have returned the book. They will need to confirm receipt.",
          () => {
            if (this.onActionCallback) this.onActionCallback('borrower_return_request', { loanId });
          }
        );
      });
    });

    // Bind click to open details page
    view.querySelectorAll('.clickable-loan-card, .clickable-row').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const bookId = el.getAttribute('data-book-id');
        if (bookId && this.onViewChangeCallback) {
          this.onViewChangeCallback(`book-details:${bookId}`);
        }
      });
    });
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
    const activeReturns = loans.filter(l => l.status === 'Out' || l.status === 'ReturnPending');
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
                    <div class="book-card-actions">
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
          <div class="glass-card clickable-loan-card" data-book-id="${loan.book_id}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; cursor: pointer;">
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
            <div style="display:flex; gap: 0.5rem; z-index: 5;">
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
          <div class="glass-card clickable-loan-card" data-book-id="${loan.book_id}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; cursor: pointer;">
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
            <div style="z-index: 5;">
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
        const isPendingReturn = loan.status === 'ReturnPending';

        return `
          <div class="glass-card clickable-loan-card" data-book-id="${loan.book_id}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-color: var(--border-color); cursor: pointer;">
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
            <div style="display: flex; gap: 0.5rem; align-items: center; z-index: 5;">
              ${isPendingReturn ? `
                <span class="book-badge badge-requested" style="position:static; margin-right:0.25rem;">Return Pending</span>
                <button class="btn btn-primary btn-sm btn-return-confirm" data-loan-id="${loan.loan_id}" style="background: var(--accent-emerald); border-color: var(--accent-emerald); color: #fff;">Confirm Return</button>
              ` : `
                <button class="btn btn-secondary btn-sm btn-send-reminder" data-loan-id="${loan.loan_id}" style="display:flex; align-items:center; gap:4px;">${ICONS.bell || ''} Send Reminder</button>
                <button class="btn btn-primary btn-sm btn-return-confirm" data-loan-id="${loan.loan_id}">Mark as Returned</button>
              `}
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
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('approve_loan', { loanId });
      });
    });

    view.querySelectorAll('.btn-reject-loan').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('reject_loan', { loanId });
      });
    });

    view.querySelectorAll('.btn-handover-confirm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('handover_loan', { loanId });
      });
    });

    view.querySelectorAll('.btn-return-confirm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const loanId = btn.getAttribute('data-loan-id');
        if (this.onActionCallback) this.onActionCallback('return_confirm', { loanId });
      });
    });

    view.querySelectorAll('.btn-send-reminder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const loanId = btn.getAttribute('data-loan-id');
        const loan = loans.find(l => l.loan_id === loanId);
        if (loan) this.showReturnReminderModal(loan);
      });
    });

    // Bind inline Edit Book buttons on loan cards
    view.querySelectorAll('.btn-edit-loan-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
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
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.getAttribute('data-id');
        const book = books.find(b => b.book_id === bookId);
        if (book) this.showOwnerEditBookModal(book, currentUser);
      });
    });

    view.querySelectorAll('.btn-owner-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.getAttribute('data-id');
        if (this.onActionCallback) this.onActionCallback('toggle_book_availability', { bookId });
      });
    });

    view.querySelectorAll('.btn-owner-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // Bind click to open details page
    view.querySelectorAll('.book-card, .clickable-loan-card, .clickable-row').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const bookId = el.getAttribute('data-book-id');
        if (bookId && this.onViewChangeCallback) {
          this.onViewChangeCallback(`book-details:${bookId}`);
        }
      });
    });
  }

  /**
   * Renders the Admin Panel (Resident approval and roles management)
   */
  renderAdminDashboard(users, currentUser, automation) {
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

      ${isOwnerUser && automation ? (() => {
        const trig = automation.triggers || {};
        const notif = automation.notifications || {};

        const hourLabel = h => {
          if (h === 0) return '12 AM';
          if (h < 12) return `${h} AM`;
          if (h === 12) return '12 PM';
          return `${h - 12} PM`;
        };

        const hourOptions = Array.from({length: 24}, (_, i) =>
          `<option value="${i}" ${(trig[arguments[0]] && trig[arguments[0]].hour === i) ? 'selected' : ''}>${hourLabel(i)}</option>`
        );

        const triggerRow = (key, label, icon) => {
          const cfg = trig[key] || { enabled: true, hour: 15 };
          const opts = Array.from({length: 24}, (_, i) =>
            `<option value="${i}" ${cfg.hour === i ? 'selected' : ''}>${hourLabel(i)}</option>`
          ).join('');
          return `
            <div class="automation-row" data-trigger-key="${key}">
              <div class="automation-row-info">
                <span class="automation-icon">${icon}</span>
                <div>
                  <div class="automation-label">${label}</div>
                  <div class="automation-sublabel">Runs daily at scheduled hour</div>
                </div>
              </div>
              <div class="automation-row-controls">
                <select class="form-control automation-hour-select" data-trigger-key="${key}" title="Scheduled hour" style="width:auto; padding: 0.3rem 0.5rem; font-size:0.8rem;">
                  ${opts}
                </select>
                <label class="switch-control" title="${cfg.enabled ? 'Enabled' : 'Disabled'}">
                  <input type="checkbox" class="automation-trigger-toggle" data-trigger-key="${key}" ${cfg.enabled ? 'checked' : ''}>
                  <span class="slider-switch"></span>
                </label>
                <button class="btn btn-secondary btn-sm btn-trigger-now" data-notification-type="${key === 'dailyCheckOverdueLoans' ? 'overdue_loans' : key === 'dailyCheckLenderActions' ? 'lender_actions' : 'user_approvals'}" style="font-size:0.75rem; white-space:nowrap;">▶ Run Now</button>
              </div>
            </div>
          `;
        };

        const notifRow = (key, label, icon) => {
          const enabled = notif[key] !== false;
          return `
            <div class="automation-row" data-notif-key="${key}">
              <div class="automation-row-info">
                <span class="automation-icon">${icon}</span>
                <div>
                  <div class="automation-label">${label}</div>
                </div>
              </div>
              <div class="automation-row-controls">
                <label class="switch-control" title="${enabled ? 'Enabled' : 'Disabled'}">
                  <input type="checkbox" class="automation-notif-toggle" data-notif-key="${key}" ${enabled ? 'checked' : ''}>
                  <span class="slider-switch"></span>
                </label>
              </div>
            </div>
          `;
        };

        return `
          <div class="automation-panel glass-card" style="margin-top:2rem;">
            <div class="automation-panel-header">
              <span style="font-size:1.3rem;">⚙️</span>
              <div>
                <h3 class="font-serif" style="margin:0; font-size:1.05rem; color:var(--text-primary);">Automation &amp; Email Notifications</h3>
                <p style="margin:0; font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">Manage scheduled daily triggers and email category preferences</p>
              </div>
            </div>

            <div class="automation-section">
              <div class="automation-section-title">📅 Daily Scheduled Triggers</div>
              ${triggerRow('dailyCheckOverdueLoans',      '⚠️ Overdue Loan Reminders',          '📚')}
              ${triggerRow('dailyCheckLenderActions',     '🔔 Lender Actions Digest',             '📋')}
              ${triggerRow('dailyCheckPendingUserApprovals', '👤 Pending User Approvals Alert',   '🛡️')}
            </div>

            <div class="automation-section" style="margin-top:1.5rem;">
              <div class="automation-section-title">✉️ Email Notification Categories</div>
              ${notifRow('borrow_requests',   'Borrow Requests &amp; Approvals',       '📖')}
              ${notifRow('return_actions',    'Return Confirmations &amp; Receipts',   '↩️')}
              ${notifRow('user_registrations','User Registrations &amp; Approvals',    '🆕')}
              ${notifRow('overdue_reminders', 'Daily Overdue Alerts',                  '⏰')}
            </div>
          </div>
        `;
      })() : ''}

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

    // Owner: Automation trigger toggles
    view.querySelectorAll('.automation-trigger-toggle').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.getAttribute('data-trigger-key');
        const row = view.querySelector(`.automation-hour-select[data-trigger-key="${key}"]`);
        const hour = row ? parseInt(row.value, 10) : 15;
        if (this.onActionCallback) this.onActionCallback('admin_update_automation', {
          triggers: { [key]: { enabled: cb.checked, hour } }
        });
      });
    });

    // Owner: Automation hour selects
    view.querySelectorAll('.automation-hour-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const key = sel.getAttribute('data-trigger-key');
        const toggle = view.querySelector(`.automation-trigger-toggle[data-trigger-key="${key}"]`);
        const enabled = toggle ? toggle.checked : true;
        if (this.onActionCallback) this.onActionCallback('admin_update_automation', {
          triggers: { [key]: { enabled, hour: parseInt(sel.value, 10) } }
        });
      });
    });

    // Owner: Trigger-now buttons
    view.querySelectorAll('.btn-trigger-now').forEach(btn => {
      btn.addEventListener('click', () => {
        const notifType = btn.getAttribute('data-notification-type');
        if (this.onActionCallback) this.onActionCallback('admin_trigger_notification', { notificationType: notifType });
      });
    });

    // Owner: Notification category toggles
    view.querySelectorAll('.automation-notif-toggle').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.getAttribute('data-notif-key');
        if (this.onActionCallback) this.onActionCallback('admin_update_automation', {
          notifications: { [key]: cb.checked }
        });
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

    this.showModal("Lend a New Book", bodyHtml);

    // Cancel Button
    document.getElementById('btn-add-cancel').addEventListener('click', () => this.hideModal());

    // Extra details toggle
    document.getElementById('btn-toggle-extra-details').addEventListener('click', () => {
      const section = document.getElementById('extra-details-section');
      const arrow = document.getElementById('extra-details-arrow');
      section.classList.toggle('open');
      arrow.textContent = section.classList.contains('open') ? '▲' : '▼';
    });

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
                const meta = await this.fetchRichBookMetadata(null, titleVal, authorVal, isbnVal, doc.key);

                if (meta) {
                  document.getElementById('book-title').value = meta.title || titleVal || '';
                  document.getElementById('book-author').value = meta.author || authorVal || 'Unknown';
                  document.getElementById('book-isbn').value = meta.isbn || isbnVal || '';
                  document.getElementById('book-genre').value = meta.genre || '';
                  document.getElementById('book-pages').value = meta.pages || '';
                  document.getElementById('book-language').value = meta.language || 'English';
                  document.getElementById('book-publish-year').value = meta.publishYear || '';
                  document.getElementById('book-publisher').value = meta.publisher || '';

                  // Show cover carousel using Unified Carousel
                  this.renderCoverCarousel(meta.coverUrls, thumbnailsList, bookCoverInput, customCoverMode);
                  
                  // Auto-select first cover & sync to input value
                  const selected = thumbnailsList.querySelector('.cover-thumbnail-item.selected');
                  if (selected) {
                    bookCoverInput.value = selected.getAttribute('data-large-url') || '';
                  }

                  // Open additional details section since we enriched
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
                  this.showToast("Book details retrieved successfully!");
                }
              } catch (err) {
                console.error("Enrichment fetch failed", err);
                this.showToast("Fetched basic search details, but web enrichment failed.", "info");
                
                // Fallback to basic open library data
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
                
                // Auto-open extra details if any were populated
                const extraSection = document.getElementById('extra-details-section');
                const extraArrow = document.getElementById('extra-details-arrow');
                if (doc.first_publish_year || doc.number_of_pages_median || doc.publisher || doc.subject) {
                  if (extraSection && !extraSection.classList.contains('open')) {
                    extraSection.classList.add('open');
                    if (extraArrow) extraArrow.textContent = '▲';
                  }
                }
                
                // Fallback rendering
                await renderCoverCarousel(doc);
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

      // Ensure all fields are properly extracted with defaults
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

      // Validate required fields
      if (!payload.title || !payload.author) {
        alert('Please fill in Title and Author fields.');
        return;
      }

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

    // Toggle extra details
    document.getElementById('btn-edit-toggle-extra').addEventListener('click', () => {
      const s = document.getElementById('edit-extra-details-section');
      const a = document.getElementById('edit-extra-arrow');
      s.classList.toggle('open');
      a.textContent = s.classList.contains('open') ? '▲' : '▼';
      // If the book already has extra data, auto-open on first render
    });
    // Auto-open if book has extra data
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

    // Fetch Web Details wire up
    const fetchDetailsBtn = document.getElementById('book-edit-fetch-details');
    if (fetchDetailsBtn) {
      fetchDetailsBtn.addEventListener('click', async () => {
        const isbnVal = document.getElementById('book-edit-isbn').value.trim();
        const authorVal = document.getElementById('book-edit-author').value.trim();
        
        fetchDetailsBtn.disabled = true;
        const originalText = fetchDetailsBtn.innerHTML;
        fetchDetailsBtn.innerHTML = `<div class="spinner" style="width:1rem;height:1rem;border-width:1.5px;"></div>`;
        
        try {
          const meta = await this.fetchRichBookMetadata(isbnVal || book.title, book.title, authorVal, isbnVal);
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
            
            // Render cover carousel with meta.coverUrls
            if (meta.coverUrls && meta.coverUrls.length > 0) {
              this.renderCoverCarousel(meta.coverUrls, thumbnailsList, coverValueInput, customMode);
              
              // update preview image if carousel has a selected image
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
            
            // Open additional details if we populated them
            const extraSection = document.getElementById('edit-extra-details-section');
            const arrow = document.getElementById('edit-extra-arrow');
            if (extraSection && !extraSection.classList.contains('open')) {
              extraSection.classList.add('open');
              if (arrow) arrow.textContent = '▲';
            }
            
            this.showToast('Successfully fetched details from the web!', 'success');
          } else {
            this.showToast('No metadata found for this book.', 'info');
          }
        } catch (err) {
          console.error(err);
          this.showToast('Failed to fetch web details.', 'error');
        } finally {
          fetchDetailsBtn.disabled = false;
          fetchDetailsBtn.innerHTML = originalText;
        }
      });
    }

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

  showReturnReminderModal(loan) {
    let clientUrl = window.location.origin + window.location.pathname;
    if (clientUrl.endsWith('/')) {
      clientUrl = clientUrl.slice(0, -1);
    }
    const directLink = `${clientUrl}?view=book-details:${loan.book_id}`;
    
    const defaultMessage = `Dear ${loan.borrower_name},

This is a friendly reminder to return the book "${loan.book_title}" (by ${loan.book_author}), which you borrowed on ${new Date(loan.handover_date).toLocaleDateString()}.

The loan is currently active, and the owner is requesting it back. Please coordinate the return at your earliest convenience.

You can view the details and mark the book as returned here:
${directLink}

Thank you for contributing to our shared community library!`;

    const bodyHtml = `
      <form id="reminder-form" style="display:flex; flex-direction:column; gap:1.2rem;">
        <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">
          Send an email reminder to <strong>${loan.borrower_name}</strong> (${loan.borrower_email}) to return this book. You can customize the message below:
        </p>
        <div class="form-group">
          <label for="reminder-message" style="display:block; margin-bottom:0.4rem; font-weight:500; font-size:0.85rem; color:var(--text-secondary);">Message</label>
          <textarea id="reminder-message" class="form-control" rows="6" style="width:100%; min-height:120px; font-family:inherit; font-size:0.9rem; padding:0.5rem; background:var(--bg-secondary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm);" required>${defaultMessage}</textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.6rem; margin-top:0.5rem;">
          <button type="button" class="btn btn-secondary" id="reminder-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Email</button>
        </div>
      </form>
    `;

    this.showModal('Send Return Reminder', bodyHtml);

    document.getElementById('reminder-cancel').addEventListener('click', () => this.hideModal());

    document.getElementById('reminder-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const message = document.getElementById('reminder-message').value;
      this.hideModal();
      if (this.onActionCallback) {
        this.onActionCallback('send_return_reminder', { loanId: loan.loan_id, message: message });
      }
    });
  }

  renderBookDetailsView(book, loans, currentUser) {
    const view = document.getElementById('book-details-view');
    if (!view) return;

    // Find if there is an active loan on this book copy
    const activeLoan = loans.find(l => String(l.book_id) === String(book.book_id) && ['Requested', 'Approved', 'Out', 'ReturnPending'].includes(l.status));
    
    const isOwner = currentUser && book.owner_email === currentUser.email;
    const isSystemOwner = currentUser && currentUser.role === 'Owner';
    const isApprovedUser = currentUser && currentUser.status === 'Approved';

    let badgeClass = 'badge-available';
    if (book.status === 'Requested') badgeClass = 'badge-requested';
    if (book.status === 'Borrowed') badgeClass = 'badge-borrowed';
    if (book.status === 'Lost') badgeClass = 'badge-lost';
    if (book.status === 'Unavailable') badgeClass = 'badge-lost';

    // Cover art fallback logic
    const coverHtml = book.cover_url ? `
      <img id="details-cover-img" src="${book.cover_url}" alt="${book.title}">
    ` : `
      <div class="book-no-cover" style="font-size: 1.25rem;">
        ${ICONS.book}
        <span>${book.title}</span>
      </div>
    `;

    // Active loan block
    let activeLoanHtml = '';
    if (activeLoan) {
      const isBorrowerOfThisLoan = currentUser && activeLoan.borrower_email === currentUser.email;
      let loanStatusBadge = '';
      let progressHtml = '';
      
      if (activeLoan.status === 'Requested') {
        loanStatusBadge = `<span class="book-badge badge-requested" style="position:static; display:inline-block;">Requested</span>`;
      } else if (activeLoan.status === 'Approved') {
        loanStatusBadge = `<span class="book-badge badge-available" style="position:static; display:inline-block;">Approved (Awaiting Collection)</span>`;
      } else if (activeLoan.status === 'Out') {
        loanStatusBadge = `<span class="book-badge badge-borrowed" style="position:static; display:inline-block;">Borrowed</span>`;
        
        // Progress bar for due dates
        const start = new Date(activeLoan.handover_date).getTime();
        const due = new Date(activeLoan.due_date).getTime();
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
          <div style="margin-top: 1rem; max-width: 400px;">
            <div style="display:flex; justify-content:space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
              <span>Loan Progress</span>
              <span class="${daysLeft < 0 ? 'text-rose' : ''}">${dueText}</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar ${alertClass}" style="width: ${percent}%;"></div>
            </div>
          </div>
        `;
      } else if (activeLoan.status === 'ReturnPending') {
        loanStatusBadge = `<span class="book-badge badge-requested" style="position:static; display:inline-block;">Return Pending</span>`;
      }

      activeLoanHtml = `
        <div class="glass-card" style="margin-top: 1.5rem; border-color: var(--border-color); padding: 1.25rem;">
          <h3 class="book-details-section-title">
            ${ICONS.calendar} Active Loan Details
          </h3>
          <div style="font-size: 0.85rem; display:flex; flex-direction:column; gap: 0.5rem; margin-top: 0.75rem;">
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value">${loanStatusBadge}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Borrower</span>
              <span class="detail-value">${activeLoan.borrower_name} (Flat ${activeLoan.borrower_flat})</span>
            </div>
            ${isApprovedUser && activeLoan.borrower_phone ? `
              <div class="detail-item">
                <span class="detail-label">Borrower Phone</span>
                <span class="detail-value">${activeLoan.borrower_phone}</span>
              </div>
            ` : ''}
            <div class="detail-item">
              <span class="detail-label">Lender</span>
              <span class="detail-value">${activeLoan.lender_name} (Flat ${activeLoan.lender_flat})</span>
            </div>
            ${isApprovedUser && activeLoan.lender_phone ? `
              <div class="detail-item">
                <span class="detail-label">Lender Phone</span>
                <span class="detail-value">${activeLoan.lender_phone}</span>
              </div>
            ` : ''}
            <div class="detail-item">
              <span class="detail-label">Requested Duration</span>
              <span class="detail-value">${activeLoan.duration_days} days</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Request Date</span>
              <span class="detail-value">${new Date(activeLoan.request_date).toLocaleDateString()}</span>
            </div>
            ${activeLoan.handover_date ? `
              <div class="detail-item">
                <span class="detail-label">Handover Date</span>
                <span class="detail-value">${new Date(activeLoan.handover_date).toLocaleDateString()}</span>
              </div>
            ` : ''}
            ${activeLoan.due_date ? `
              <div class="detail-item">
                <span class="detail-label">Due Date</span>
                <span class="detail-value">${new Date(activeLoan.due_date).toLocaleDateString()}</span>
              </div>
            ` : ''}
            <div class="detail-item">
              <span class="detail-label">Notes</span>
              <span class="detail-value" style="font-style: italic;">"${activeLoan.notes || 'None'}"</span>
            </div>
            ${progressHtml}
          </div>
        </div>
      `;
    }

    // Action buttons construction
    let actionButtonsHtml = '';
    
    if (isOwner) {
      actionButtonsHtml += `
        <button class="btn btn-secondary btn-details-edit">${ICONS.edit} Edit Details</button>
        <button class="btn btn-secondary btn-details-toggle">${book.status === 'Unavailable' ? `${ICONS.unlock} Resume Availability` : `${ICONS.lock} Pause Availability`}</button>
        <button class="btn btn-danger btn-details-delete" style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.25); color:var(--accent-rose);">${ICONS.x} Remove Copy</button>
      `;

      if (activeLoan) {
        if (activeLoan.status === 'Requested') {
          actionButtonsHtml += `
            <button class="btn btn-primary btn-details-approve" style="background:var(--accent-emerald); border-color:var(--accent-emerald); color:#fff; margin-left:auto;">${ICONS.check} Approve Request</button>
            <button class="btn btn-secondary btn-details-reject">${ICONS.x} Reject Request</button>
          `;
        } else if (activeLoan.status === 'Approved') {
          actionButtonsHtml += `
            <button class="btn btn-warning btn-details-handover" style="margin-left:auto;">Confirm Handover</button>
          `;
        } else if (activeLoan.status === 'Out') {
          actionButtonsHtml += `
            <button class="btn btn-secondary btn-details-reminder" style="margin-left:auto; display:flex; align-items:center; gap:4px;">${ICONS.bell || ''} Send Reminder</button>
            <button class="btn btn-primary btn-details-return">Mark as Returned</button>
          `;
        } else if (activeLoan.status === 'ReturnPending') {
          actionButtonsHtml += `
            <button class="btn btn-primary btn-details-return" style="background:var(--accent-emerald); border-color:var(--accent-emerald); color:#fff; margin-left:auto;">Confirm Return</button>
          `;
        }
      }
    } else if (isSystemOwner) {
      actionButtonsHtml += `
        <div style="width:100%; display:flex; flex-direction:column; gap:0.5rem; border: 1px dashed var(--accent-rose); padding:1rem; border-radius:var(--radius-md); background: rgba(244,63,94,0.03);">
          <div style="font-size:0.7rem; color:var(--accent-rose); font-weight:700; text-align:center; letter-spacing:0.5px;">👑 OWNER OVERRIDE ACTIONS</div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-details-edit">${ICONS.edit} Edit Details</button>
            <button class="btn btn-secondary btn-details-toggle">${book.status === 'Unavailable' ? `${ICONS.unlock} Resume` : `${ICONS.lock} Pause`}</button>
            <button class="btn btn-danger btn-details-delete" style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.25); color:var(--accent-rose);">${ICONS.x} Remove</button>
          </div>
        </div>
      `;
    } else {
      // Guest or other borrower
      if (book.status === 'Available') {
        if (isApprovedUser) {
          actionButtonsHtml += `
            <button class="btn btn-primary btn-details-request" style="width:100%; max-width: 320px;">Request to Borrow</button>
          `;
        } else if (!currentUser) {
          actionButtonsHtml += `
            <button class="btn btn-primary btn-details-signin" style="width:100%; max-width: 320px;">Sign in to Borrow</button>
          `;
        } else {
          actionButtonsHtml += `
            <button class="btn btn-secondary" disabled style="width:100%; max-width: 320px;">Awaiting Profile Approval</button>
          `;
        }
      } else if (activeLoan && currentUser && activeLoan.borrower_email === currentUser.email) {
        if (activeLoan.status === 'Requested') {
          actionButtonsHtml += `
            <button class="btn btn-secondary" disabled style="width:100%; max-width: 320px;">Requested (Awaiting Lender Approval)</button>
          `;
        } else if (activeLoan.status === 'Approved') {
          actionButtonsHtml += `
            <button class="btn btn-warning" disabled style="width:100%; max-width: 320px;">Approved (Please Collect from Lender)</button>
          `;
        } else if (activeLoan.status === 'Out') {
          actionButtonsHtml += `
            <button class="btn btn-primary btn-details-borrower-return" style="width:100%; max-width: 320px;">Return Book</button>
          `;
        } else if (activeLoan.status === 'ReturnPending') {
          actionButtonsHtml += `
            <button class="btn btn-secondary" disabled style="width:100%; max-width: 320px;">Return Pending (Awaiting Lender Confirm)</button>
          `;
        }
      } else {
        actionButtonsHtml += `
          <button class="btn btn-secondary" disabled style="width:100%; max-width: 320px;">Unavailable (Currently Borrowed)</button>
        `;
      }
    }

    view.innerHTML = `
      <div class="dashboard-section">
        <button class="btn btn-secondary btn-sm book-details-back-btn" id="btn-details-back">
          ${ICONS.arrowLeft} Back
        </button>
        
        <div class="book-details-layout">
          <div class="book-details-cover-column">
            <div class="book-details-big-cover">
              ${coverHtml}
            </div>
            <span class="book-badge ${badgeClass} book-details-cover-badge" style="position:static;">${book.status}</span>
            <div style="font-size: 0.8rem; color:var(--text-muted); font-weight:500;">Copy #${book.copy_number} &middot; ISBN: ${book.isbn || 'N/A'}</div>
          </div>
          
          <div class="book-details-info-column">
            <div class="book-details-header">
              <h1 class="book-details-title">${book.title}</h1>
              <div class="book-details-author">by ${book.author}</div>
              <div style="margin-top: 0.5rem;">
                <a href="https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn || (book.title + ' ' + book.author))}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; display: inline-flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 500; text-decoration: underline;">
                  ${ICONS.external} Search on Goodreads
                </a>
              </div>
            </div>

            <div class="book-details-block">
              <h3 class="book-details-section-title">${ICONS.book} Book Information</h3>
              <div class="book-details-meta-grid">
                <div class="detail-item"><span class="detail-label">Genre</span><span class="detail-value">${book.genre || 'N/A'}</span></div>
                <div class="detail-item"><span class="detail-label">Pages</span><span class="detail-value">${book.pages ? book.pages + ' pages' : 'N/A'}</span></div>
                <div class="detail-item"><span class="detail-label">Language</span><span class="detail-value">${book.language || 'N/A'}</span></div>
                <div class="detail-item"><span class="detail-label">Publisher</span><span class="detail-value">${book.publisher || 'N/A'}</span></div>
                <div class="detail-item"><span class="detail-label">Publish Year</span><span class="detail-value">${book.publish_year || 'N/A'}</span></div>
                <div class="detail-item"><span class="detail-label">Date Added</span><span class="detail-value">${book.created_at ? new Date(book.created_at).toLocaleDateString() : 'N/A'}</span></div>
              </div>
            </div>

            <div class="book-details-block">
              <h3 class="book-details-section-title">${ICONS.user} Lender Information</h3>
              <div class="book-details-meta-grid">
                <div class="detail-item"><span class="detail-label">Owner</span><span class="detail-value">${book.owner_name}</span></div>
                <div class="detail-item"><span class="detail-label">Flat Number</span><span class="detail-value">Flat ${book.owner_flat || 'N/A'}</span></div>
                ${isApprovedUser && book.owner_phone ? `
                  <div class="detail-item"><span class="detail-label">Phone Number</span><span class="detail-value">${book.owner_phone}</span></div>
                ` : ''}
              </div>
            </div>

            ${activeLoanHtml}

            <div class="book-details-block">
              <h3 class="book-details-section-title">${ICONS.settings} Actions</h3>
              <div class="book-details-actions-panel">
                ${actionButtonsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add Cover image error callback
    const img = view.querySelector('#details-cover-img');
    if (img) {
      img.addEventListener('error', () => {
        img.parentElement.innerHTML = `<div class="book-no-cover" style="font-size: 1.25rem;">${ICONS.book}<span>${book.title}</span></div>`;
      });
    }

    // Bind Event Listeners
    const backBtn = view.querySelector('#btn-details-back');
    if (backBtn && this.onViewChangeCallback) {
      backBtn.addEventListener('click', () => {
        if (this.onViewChangeCallback) this.onViewChangeCallback('back');
      });
    }

    const editBtn = view.querySelector('.btn-details-edit');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.showOwnerEditBookModal(book, currentUser));
    }

    const toggleBtn = view.querySelector('.btn-details-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.onActionCallback) this.onActionCallback('toggle_book_availability', { bookId: book.book_id });
      });
    }

    const deleteBtn = view.querySelector('.btn-details-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.showConfirmDialog(
          `Remove "${book.title}" (Copy #${book.copy_number})?`,
          'This will permanently remove this book copy from the library. Active loans are not affected.',
          () => {
            if (this.onActionCallback) this.onActionCallback('delete_book', { bookId: book.book_id });
          }
        );
      });
    }

    const approveBtn = view.querySelector('.btn-details-approve');
    if (approveBtn && activeLoan) {
      approveBtn.addEventListener('click', () => {
        if (this.onActionCallback) this.onActionCallback('approve_loan', { loanId: activeLoan.loan_id });
      });
    }

    const rejectBtn = view.querySelector('.btn-details-reject');
    if (rejectBtn && activeLoan) {
      rejectBtn.addEventListener('click', () => {
        if (this.onActionCallback) this.onActionCallback('reject_loan', { loanId: activeLoan.loan_id });
      });
    }

    const handoverBtn = view.querySelector('.btn-details-handover');
    if (handoverBtn && activeLoan) {
      handoverBtn.addEventListener('click', () => {
        if (this.onActionCallback) this.onActionCallback('handover_loan', { loanId: activeLoan.loan_id });
      });
    }

    const returnBtn = view.querySelector('.btn-details-return');
    if (returnBtn && activeLoan) {
      returnBtn.addEventListener('click', () => {
        if (this.onActionCallback) this.onActionCallback('return_confirm', { loanId: activeLoan.loan_id });
      });
    }

    const reminderBtn = view.querySelector('.btn-details-reminder');
    if (reminderBtn && activeLoan) {
      reminderBtn.addEventListener('click', () => this.showReturnReminderModal(activeLoan));
    }

    const requestBtn = view.querySelector('.btn-details-request');
    if (requestBtn) {
      requestBtn.addEventListener('click', () => this.showRequestBorrowForm(book));
    }

    const signinBtn = view.querySelector('.btn-details-signin');
    if (signinBtn && this.onViewChangeCallback) {
      signinBtn.addEventListener('click', () => this.onViewChangeCallback('welcome'));
    }

    const borrowerReturnBtn = view.querySelector('.btn-details-borrower-return');
    if (borrowerReturnBtn && activeLoan) {
      borrowerReturnBtn.addEventListener('click', () => {
        this.showConfirmDialog(
          "Mark Book as Returned?",
          "This will notify the lender that you have returned the book. They will need to confirm receipt.",
          () => {
            if (this.onActionCallback) this.onActionCallback('borrower_return_request', { loanId: activeLoan.loan_id });
          }
        );
      });
    }
  }
}

export const LibraryUI = new UiService();
