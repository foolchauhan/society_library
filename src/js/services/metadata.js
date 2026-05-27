/**
 * Society Library Management System - Book Metadata Service
 * Fetches rich book metadata from Google Books and Open Library APIs,
 * and handles UI carousel generation for selecting cover art.
 */

export async function fetchRichBookMetadata(query, title = '', author = '', isbn = '', workKey = '') {
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

  // Trigger API requests in parallel
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

export function renderCoverCarousel(coverUrls, thumbnailsList, coverInput, customCoverMode = false) {
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
