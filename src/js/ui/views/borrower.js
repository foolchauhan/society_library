/**
 * Society Library Management System - Borrower View Component
 */
import { ICONS } from '../icons.js';
import { showConfirmDialog } from '../components/modal.js';

let onViewChangeCallback = null;
let onActionCallback = null;

export function initBorrowerView(onViewChange, onAction) {
  onViewChangeCallback = onViewChange;
  onActionCallback = onAction;
}

export function renderBorrowerDashboard(loans, currentUser = null) {
  const view = document.getElementById('borrower-view');
  if (!view) return;
  
  // Filter loans to only those where the current user is the borrower
  const myLoans = loans.filter(l => currentUser && l.borrower_email === currentUser.email);
  
  const activeLoans = myLoans.filter(l => l.status === 'Requested' || l.status === 'Approved' || l.status === 'Out' || l.status === 'ReturnPending');
  const pastLoans = myLoans.filter(l => l.status === 'Returned' || l.status === 'Rejected');

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
        statusBadge = `<span class="book-badge badge-available">Approved &#8212; Collect from Flat ${loan.lender_flat}</span>`;
        actionButton = `<button class="btn btn-warning btn-sm btn-borrower-handover-confirm" data-loan-id="${loan.loan_id}" style="width:100%;">&#10003; Confirm I Received the Book</button>`;
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
        <div class="glass-card loan-card clickable-loan-card" data-book-id="${loan.book_id}">
          <div class="loan-card-cover">
            ${loan.book_cover
              ? `<img src="${loan.book_cover}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">`
              : `<div class="loan-card-cover-placeholder">${ICONS.book}</div>`
            }
          </div>
          <div class="loan-card-body">
            <div class="loan-card-title-row">
              <h3 class="loan-card-title">${loan.book_title}</h3>
              ${statusBadge}
            </div>
            <div class="loan-card-author">by ${loan.book_author}</div>
            <div style="margin-bottom:0.4rem;">
              <a href="https://www.goodreads.com/search?q=${encodeURIComponent(loan.book_title + ' ' + loan.book_author)}" target="_blank" rel="noopener noreferrer" class="loan-card-goodreads-link">
                ${ICONS.external} View on Goodreads
              </a>
            </div>
            <div class="loan-card-details">
              ${contactHtml}
              <div class="detail-item"><span class="detail-label">Requested Duration</span><span class="detail-value">${loan.duration_days} days</span></div>
              ${loan.due_date ? `<div class="detail-item"><span class="detail-label">Due Date</span><span class="detail-value">${new Date(loan.due_date).toLocaleDateString()}</span></div>` : ''}
            </div>
            ${progressHtml}
            <div class="loan-card-action">
              ${actionButton}
            </div>
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
      showConfirmDialog(
        "Mark Book as Returned?",
        "This will notify the lender that you have returned the book. They will need to confirm receipt.",
        () => {
          if (onActionCallback) onActionCallback('borrower_return_request', { loanId });
        },
        'Confirm Return',
        'btn-primary'
      );
    });
  });

  // Bind borrower handover confirm buttons
  view.querySelectorAll('.btn-borrower-handover-confirm').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const loanId = btn.getAttribute('data-loan-id');
      showConfirmDialog(
        "Confirm Book Receipt?",
        "Confirm that you have physically collected the book from the lender. This will mark the loan as active.",
        () => {
          if (onActionCallback) onActionCallback('handover_loan', { loanId });
        },
        'Confirm Receipt',
        'btn-primary'
      );
    });
  });

  // Bind click to open details page
  view.querySelectorAll('.clickable-loan-card, .clickable-row').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      const bookId = el.getAttribute('data-book-id');
      if (bookId && onViewChangeCallback) {
        onViewChangeCallback(`book-details:${bookId}`);
      }
    });
  });
}
