/**
 * Society Library Management System - Book Details View Component
 */
import { ICONS } from '../icons.js';
import { showConfirmDialog } from '../components/modal.js';
import { showOwnerEditBookModal, showRequestBorrowForm } from './catalog.js';
import { showReturnReminderModal } from './lender.js';

let onViewChangeCallback = null;
let onActionCallback = null;

export function initBookDetailsView(onViewChange, onAction) {
  onViewChangeCallback = onViewChange;
  onActionCallback = onAction;
}

export function renderBookDetailsView(book, loans, currentUser) {
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

  // Cover art fallback
  const coverHtml = book.cover_url ? `
    <img id="details-cover-img" src="${book.cover_url}" alt="${book.title}">
  ` : `
    <div class="book-no-cover" style="font-size: 1.25rem;">
      ${ICONS.book}
      <span>${book.title}</span>
    </div>
  `;

  // Active loan section
  let activeLoanHtml = '';
  if (activeLoan) {
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
    // Guest or borrower user
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

  // Fallback image error logic
  const img = view.querySelector('#details-cover-img');
  if (img) {
    img.addEventListener('error', () => {
      img.parentElement.innerHTML = `<div class="book-no-cover" style="font-size: 1.25rem;">${ICONS.book}<span>${book.title}</span></div>`;
    });
  }

  // Bind Back Button
  const backBtn = view.querySelector('#btn-details-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (onViewChangeCallback) onViewChangeCallback('back');
    });
  }

  // Bind Actions
  const editBtn = view.querySelector('.btn-details-edit');
  if (editBtn) {
    editBtn.addEventListener('click', () => showOwnerEditBookModal(book, currentUser));
  }

  const toggleBtn = view.querySelector('.btn-details-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (onActionCallback) onActionCallback('toggle_book_availability', { bookId: book.book_id });
    });
  }

  const deleteBtn = view.querySelector('.btn-details-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      showConfirmDialog(
        `Remove "${book.title}" (Copy #${book.copy_number})?`,
        'This will permanently remove this book copy from the library. Active loans are not affected.',
        () => {
          if (onActionCallback) onActionCallback('delete_book', { bookId: book.book_id });
        },
        'Confirm Remove',
        'btn-danger'
      );
    });
  }

  const approveBtn = view.querySelector('.btn-details-approve');
  if (approveBtn && activeLoan) {
    approveBtn.addEventListener('click', () => {
      if (onActionCallback) onActionCallback('approve_loan', { loanId: activeLoan.loan_id });
    });
  }

  const rejectBtn = view.querySelector('.btn-details-reject');
  if (rejectBtn && activeLoan) {
    rejectBtn.addEventListener('click', () => {
      if (onActionCallback) onActionCallback('reject_loan', { loanId: activeLoan.loan_id });
    });
  }

  const handoverBtn = view.querySelector('.btn-details-handover');
  if (handoverBtn && activeLoan) {
    handoverBtn.addEventListener('click', () => {
      if (onActionCallback) onActionCallback('handover_loan', { loanId: activeLoan.loan_id });
    });
  }

  const returnBtn = view.querySelector('.btn-details-return');
  if (returnBtn && activeLoan) {
    returnBtn.addEventListener('click', () => {
      if (onActionCallback) onActionCallback('return_confirm', { loanId: activeLoan.loan_id });
    });
  }

  const reminderBtn = view.querySelector('.btn-details-reminder');
  if (reminderBtn && activeLoan) {
    reminderBtn.addEventListener('click', () => showReturnReminderModal(activeLoan));
  }

  const requestBtn = view.querySelector('.btn-details-request');
  if (requestBtn) {
    requestBtn.addEventListener('click', () => showRequestBorrowForm(book));
  }

  const signinBtn = view.querySelector('.btn-details-signin');
  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      if (onViewChangeCallback) onViewChangeCallback('welcome');
    });
  }

  const borrowerReturnBtn = view.querySelector('.btn-details-borrower-return');
  if (borrowerReturnBtn && activeLoan) {
    borrowerReturnBtn.addEventListener('click', () => {
      showConfirmDialog(
        "Mark Book as Returned?",
        "This will notify the lender that you have returned the book. They will need to confirm receipt.",
        () => {
          if (onActionCallback) onActionCallback('borrower_return_request', { loanId: activeLoan.loan_id });
        },
        'Confirm Return',
        'btn-primary'
      );
    });
  }
}
