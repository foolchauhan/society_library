/**
 * Society Library Management System - Statistics Overview Components
 */
import { ICONS } from '../icons.js';
import { switchActiveTab } from './navbar.js';

let onViewChangeCallback = null;

export function initStats(onViewChange) {
  onViewChangeCallback = onViewChange;
}

export function renderStatsSkeleton() {
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

export function renderStats(stats) {
  const statsContainer = document.getElementById('stats-summary');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="glass-card stat-card" data-target-view="catalog" style="cursor: pointer;" title="View Catalog">
        <div class="stat-icon">${ICONS.book}</div>
        <div>
          <div class="stat-value" id="stat-books">${stats.totalBooks || 0}</div>
          <div class="stat-label">Total Books</div>
        </div>
      </div>
      <div class="glass-card stat-card" data-target-view="admin" style="cursor: pointer;" title="View Registered Members">
        <div class="stat-icon">${ICONS.user}</div>
        <div>
          <div class="stat-value" id="stat-members">${stats.totalUsers || 0}</div>
          <div class="stat-label">Registered Members</div>
        </div>
      </div>
      <div class="glass-card stat-card" data-target-view="lender" style="cursor: pointer;" title="View Lending Desk History">
        <div class="stat-icon">${ICONS.lending}</div>
        <div>
          <div class="stat-value" id="stat-loans">${stats.totalLoans || 0}</div>
          <div class="stat-label">Lending History</div>
        </div>
      </div>
      <div class="glass-card stat-card" data-target-view="lender" style="cursor: pointer;" title="View Active Checked Out Books">
        <div class="stat-icon">${ICONS.calendar}</div>
        <div>
          <div class="stat-value" id="stat-active">${stats.activeLoans || 0}</div>
          <div class="stat-label">Books Checked Out</div>
        </div>
      </div>
    </div>
  `;

  // Bind click events to redirect user to corresponding views
  statsContainer.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetView = card.getAttribute('data-target-view');
      if (targetView && onViewChangeCallback) {
        // Switch tab visually in navbar
        const navLink = document.querySelector(`.nav-link[data-view="${targetView}"]`);
        if (navLink) {
          switchActiveTab(navLink);
        } else {
          switchActiveTab(targetView);
        }
        onViewChangeCallback(targetView);
      }
    });
  });
}
