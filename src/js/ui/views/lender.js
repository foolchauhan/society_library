/**
 * Society Library Management System - Lender View Component
 */
import { ICONS } from '../icons.js';
import { showModal, hideModal, showConfirmDialog } from '../components/modal.js';
import { showAddBookForm, showOwnerEditBookModal } from './catalog.js';

let onViewChangeCallback = null;
let onActionCallback = null;

export function initLenderView(onViewChange, onAction) {
  onViewChangeCallback = onViewChange;
  onActionCallback = onAction;
}

export function renderLenderDashboard(loans, books = [], currentUser = null) {
  const view = document.getElementById('lender-view');
  if (!view) return;
  
  // Filter loans to only those where the current user is the lender
  const myLentLoans = loans.filter(l => currentUser && l.lender_email === currentUser.email);
  
  // Group loans by operations needed
  const requests = myLentLoans.filter(l => l.status === 'Requested');
  const handovers = myLentLoans.filter(l => l.status === 'Approved');
  const activeReturns = myLentLoans.filter(l => l.status === 'Out' || l.status === 'ReturnPending');
  const history = myLentLoans.filter(l => l.status === 'Returned' || l.status === 'Rejected');

  // Filter books owned by the current user
  const myBooks = books.filter(b => currentUser && b.owner_email === currentUser.email);
  let myBooksHtml = '';
  if (myBooks.length === 0) {
    myBooksHtml = `<p style="color: var(--text-muted); font-size: 0.9rem; padding: 1.5rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md); text-align: center; max-width: 100%;">You haven't listed any books for lending yet. Use the button above to add a book.</p>`;
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
        <button class="btn btn-primary btn-sm" id="btn-lending-add-book" style="display: flex; align-items: center; gap: 4px;">
          ${ICONS.plus || ''} Lend a Book
        </button>
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
    lendingAddBtn.addEventListener('click', () => showAddBookForm());
  }

  view.querySelectorAll('.btn-approve-loan').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = btn.getAttribute('data-loan-id');
      if (onActionCallback) onActionCallback('approve_loan', { loanId });
    });
  });

  view.querySelectorAll('.btn-reject-loan').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = btn.getAttribute('data-loan-id');
      if (onActionCallback) onActionCallback('reject_loan', { loanId });
    });
  });

  view.querySelectorAll('.btn-handover-confirm').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = btn.getAttribute('data-loan-id');
      if (onActionCallback) onActionCallback('handover_loan', { loanId });
    });
  });

  view.querySelectorAll('.btn-return-confirm').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = btn.getAttribute('data-loan-id');
      if (onActionCallback) onActionCallback('return_confirm', { loanId });
    });
  });

  view.querySelectorAll('.btn-send-reminder').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = btn.getAttribute('data-loan-id');
      const loan = loans.find(l => l.loan_id === loanId);
      if (loan) showReturnReminderModal(loan);
    });
  });

  // Bind inline Edit Book buttons on loan cards
  view.querySelectorAll('.btn-edit-loan-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.getAttribute('data-book-id');
      const book = books.find(b => b.book_id === bookId);
      if (book) {
        if (book.owner_email !== (currentUser && currentUser.email)) {
          showConfirmDialog(
            `Edit book owned by ${book.owner_name || book.owner_email}?`,
            `You are about to edit "${book.title}" on behalf of another user. As Owner/Admin, you have full override access. Proceed?`,
            () => showOwnerEditBookModal(book, currentUser),
            'Confirm Edit',
            'btn-primary'
          );
        } else {
          showOwnerEditBookModal(book, currentUser);
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
      if (book) showOwnerEditBookModal(book, currentUser);
    });
  });

  view.querySelectorAll('.btn-owner-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = btn.getAttribute('data-id');
      if (onActionCallback) onActionCallback('toggle_book_availability', { bookId });
    });
  });

  view.querySelectorAll('.btn-owner-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
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

  // Bind click to open details page
  view.querySelectorAll('.book-card, .clickable-loan-card, .clickable-row').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      const bookId = el.getAttribute('data-book-id');
      if (bookId && onViewChangeCallback) {
        onViewChangeCallback(`book-details:${bookId}`);
      }
    });
  });
}

export function showReturnReminderModal(loan) {
  let clientUrl = window.location.origin + window.location.pathname;
  if (clientUrl.endsWith('/')) {
    clientUrl = clientUrl.slice(0, -1);
  }
  const directLink = `${clientUrl}?view=book-details:${loan.book_id}`;
  
  const ownerName = loan.book_owner_name || loan.lender_name || 'the owner';
  const ownerFlat = loan.book_owner_flat || loan.lender_flat || 'N/A';
  const ownerPhone = loan.book_owner_phone || loan.lender_phone || '';
  const ownerContact = ownerPhone ? `${ownerName} (Flat ${ownerFlat}, Phone: ${ownerPhone})` : `${ownerName} (Flat ${ownerFlat})`;

  const defaultMessage = `Dear ${loan.borrower_name},

This is a friendly reminder to return the book "${loan.book_title}" (by ${loan.book_author}), which you borrowed on ${new Date(loan.handover_date).toLocaleDateString()}.

The loan is currently active, and the book owner is requesting it back. Please coordinate the return at your earliest convenience with the owner:
Owner: ${ownerContact}

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

  showModal('Send Return Reminder', bodyHtml);

  document.getElementById('reminder-cancel').addEventListener('click', () => hideModal());

  document.getElementById('reminder-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('reminder-message').value;
    hideModal();
    if (onActionCallback) {
      onActionCallback('send_return_reminder', { loanId: loan.loan_id, message: message });
    }
  });
}
