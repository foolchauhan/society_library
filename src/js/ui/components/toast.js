/**
 * Society Library Management System - Toast Notifications Component
 */
import { ICONS } from '../icons.js';

let toastContainer = null;

function initToastContainer() {
  if (toastContainer) return;
  toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, type = 'success') {
  initToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = ICONS.check;
  if (type === 'error') icon = ICONS.x;
  if (type === 'info') icon = ICONS.alertCircle;

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
  `;

  toastContainer.appendChild(toast);

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
