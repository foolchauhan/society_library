/**
 * Society Library Management System - Navigation Components
 */
import { ICONS } from '../icons.js';

let onViewChangeCallback = null;
let onActionCallback = null;
let addFormTriggerCallback = null; // Callback to show the add book form

export function initNavbar(onViewChange, onAction, onShowAddBook) {
  onViewChangeCallback = onViewChange;
  onActionCallback = onAction;
  addFormTriggerCallback = onShowAddBook;

  // Bind Logo Home button
  const logoHome = document.getElementById('logo-home');
  if (logoHome) {
    logoHome.addEventListener('click', (e) => {
      e.preventDefault();
      if (onViewChangeCallback) {
        onViewChangeCallback('logo-home');
      }
    });
  }
}

export function renderNavbar(user) {
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
      switchActiveTab(e.currentTarget);
      if (onViewChangeCallback) {
        onViewChangeCallback('catalog');
      }
    });

    // Bind click handler for guest Sign In button
    document.getElementById('signin-nav-btn').addEventListener('click', () => {
      if (onViewChangeCallback) {
        onViewChangeCallback('welcome');
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

  // Profile initials and avatar menu rendering
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';
  userMenu.innerHTML = `
    <div id="profile-trigger" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;" title="Edit My Profile & Logout">
      <div class="user-avatar" id="user-avatar-btn">
        <span>${initials}</span>
      </div>
      <div style="display: flex; flex-direction: column; font-size: 0.75rem; text-align: left; max-width: 100px;">
        <span class="profile-name" style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); transition: color var(--transition-fast);">${user.name}</span>
        <span style="color: var(--text-muted); font-size: 0.65rem;">Flat ${user.flat_number}</span>
      </div>
    </div>
  `;

  // Add click handlers for top navigation tabs
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetView = link.getAttribute('data-view');
      switchActiveTab(link);
      if (onViewChangeCallback) {
        onViewChangeCallback(targetView);
      }
    });
  });

  document.getElementById('profile-trigger').addEventListener('click', () => {
    if (onActionCallback) onActionCallback('open_edit_profile', user);
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
    
    // Add Book button in bottom center for lenders on mobile
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
    
    // Bind click handlers for bottom nav links
    bottomNav.querySelectorAll('.bottom-nav-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        switchActiveTab(targetView);
        if (onViewChangeCallback) {
          onViewChangeCallback(targetView);
        }
      });
    });

    // Bind click handler for center Add Book button on mobile
    const bottomAddBtn = document.getElementById('bottom-nav-add-btn');
    if (bottomAddBtn) {
      bottomAddBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (addFormTriggerCallback) {
          addFormTriggerCallback();
        }
      });
    }
  }
}

export function switchActiveTab(targetViewOrElement) {
  let view = targetViewOrElement;
  if (targetViewOrElement instanceof HTMLElement) {
    view = targetViewOrElement.getAttribute('data-view');
  }
  
  // De-activate all top links and bottom buttons
  document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(l => l.classList.remove('active'));
  
  // Activate matching elements
  if (view) {
    document.querySelectorAll(`[data-view="${view}"]`).forEach(l => l.classList.add('active'));
  }

  // Hide mobile bottom center add button on Lending Desk
  const bottomAddBtn = document.getElementById('bottom-nav-add-btn');
  if (bottomAddBtn) {
    bottomAddBtn.style.display = (view === 'lender') ? 'none' : '';
  }
}
