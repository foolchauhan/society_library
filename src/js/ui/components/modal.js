/**
 * Society Library Management System - Modal and Dialog Component
 */
import { ICONS } from '../icons.js';

let modalOverlay = null;

export function setupModalDom() {
  if (modalOverlay) return;
  modalOverlay = document.getElementById('modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
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
    document.body.appendChild(modalOverlay);

    // Event listener to close when clicking background
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) hideModal();
    });
    document.getElementById('modal-close').addEventListener('click', () => hideModal());
  }
}

export function showModal(title, bodyHtml) {
  setupModalDom();
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Push dummy state to browser history so back button/gesture closes modal
  if (window.history.pushState) {
    window.history.pushState({ isModalOpen: true }, '', window.location.href);
  }
}

export function hideModal(isPopState = false) {
  setupModalDom();
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';

  // If this was a manual close (not history back), pop the modal state
  if (!isPopState && window.history.state && window.history.state.isModalOpen) {
    window.history.back();
  }
}

export function isModalActive() {
  setupModalDom();
  return modalOverlay.classList.contains('active');
}

export function showConfirmDialog(title, message, onConfirm, okLabel = 'Confirm', btnClass = 'btn-primary') {
  const dialogHtml = `
    <div style="padding:0.5rem 0 1rem 0;">
      <p style="color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.5; font-size:0.95rem;">${message}</p>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <button class="btn btn-secondary" id="confirm-cancel-btn" type="button">Cancel</button>
        <button class="btn ${btnClass}" id="confirm-ok-btn" type="button">${okLabel}</button>
      </div>
    </div>
  `;

  showModal(title, dialogHtml);

  // Bind dialog button actions
  document.getElementById('confirm-cancel-btn').addEventListener('click', () => hideModal());
  
  document.getElementById('confirm-ok-btn').addEventListener('click', () => {
    hideModal();
    if (onConfirm) onConfirm();
  });
}
