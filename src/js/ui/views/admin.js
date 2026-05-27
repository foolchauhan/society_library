/**
 * Society Library Management System - Admin View Component
 */
import { ICONS } from '../icons.js';
import { showModal, hideModal, showConfirmDialog } from '../components/modal.js';

let onViewChangeCallback = null;
let onActionCallback = null;

export function initAdminView(onViewChange, onAction) {
  onViewChangeCallback = onViewChange;
  onActionCallback = onAction;
}

const normalizeString = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export function renderAdminDashboard(users, currentUser, automation) {
  const view = document.getElementById('admin-view');
  if (!view) return;
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

    ${isOwnerUser ? (() => {
      const defaultTrig = {
        dailyCheckOverdueLoans:          { enabled: true, hour: 15 },
        dailyCheckLenderActions:          { enabled: true, hour: 15 },
        dailyCheckPendingUserApprovals:   { enabled: true, hour: 15 }
      };
      const defaultNotif = { borrow_requests: true, return_actions: true, user_registrations: true, overdue_reminders: true };
      const trig = (automation && automation.triggers)       || defaultTrig;
      const notif = (automation && automation.notifications) || defaultNotif;

      const hourLabel = h => {
        if (h === 0) return '12 AM';
        if (h < 12) return `${h} AM`;
        if (h === 12) return '12 PM';
        return `${h - 12} PM`;
      };

      const triggerRow = (key, label, icon) => {
        const cfg = trig[key] || { enabled: true, hour: 15 };
        const opts = Array.from({length: 24}, (_, i) =>
          `<option value="${i}" ${cfg.hour === i ? 'selected' : ''}>${hourLabel(i)}</option>`
        ).join('');
        const notifType = key === 'dailyCheckOverdueLoans' ? 'overdue_loans'
                        : key === 'dailyCheckLenderActions' ? 'lender_actions'
                        : 'user_approvals';
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
              <button class="btn btn-secondary btn-sm btn-trigger-now" data-notification-type="${notifType}" style="font-size:0.75rem; white-space:nowrap;">&#9654; Run Now</button>
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
            <span style="font-size:1.3rem;">&#9881;&#65039;</span>
            <div>
              <h3 class="font-serif" style="margin:0; font-size:1.05rem; color:var(--text-primary);">Automation &amp; Email Notifications</h3>
              <p style="margin:0; font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">Manage scheduled daily triggers and email category preferences</p>
            </div>
          </div>

          <div class="automation-section">
            <div class="automation-section-title">&#128197; Daily Scheduled Triggers</div>
            ${triggerRow('dailyCheckOverdueLoans',         '&#9888;&#65039; Overdue Loan Reminders',     '&#128218;')}
            ${triggerRow('dailyCheckLenderActions',        '&#128276; Lender Actions Digest',            '&#128203;')}
            ${triggerRow('dailyCheckPendingUserApprovals', '&#128100; Pending User Approvals Alert',     '&#128737;&#65039;')}
          </div>

          <div class="automation-section" style="margin-top:1.5rem;">
            <div class="automation-section-title">&#9993;&#65039; Email Notification Categories</div>
            ${notifRow('borrow_requests',    'Borrow Requests &amp; Approvals',      '&#128214;')}
            ${notifRow('return_actions',     'Return Confirmations &amp; Receipts',  '&#8617;&#65039;')}
            ${notifRow('user_registrations', 'User Registrations &amp; Approvals',   '&#128338;')}
            ${notifRow('overdue_reminders',  'Daily Overdue Alerts',                 '&#128336;')}
          </div>
        </div>
      `;
    })() : ''}
    </div>
  `;

  // Search filter key bindings
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
      
      showConfirmDialog(
        `Confirm Status Update: ${actionVerb}`,
        `Are you sure you want to change the status of "${name}" to "${nextStatus}"?`,
        () => {
          if (onActionCallback) {
            onActionCallback('admin_update_status', { targetEmail, status: nextStatus, role: targetUser ? targetUser.role : null });
          }
        },
        nextStatus === 'Approved' ? 'Confirm Approval' : 'Confirm Block',
        nextStatus === 'Approved' ? 'btn-primary' : 'btn-danger'
      );
    });
  });

  // Edit user buttons
  view.querySelectorAll('.btn-admin-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetEmail = btn.getAttribute('data-email');
      const targetUser = users.find(u => u.email === targetEmail);
      if (targetUser) showAdminEditUserModal(targetUser, currentUser);
    });
  });

  // Owner promote to Admin
  view.querySelectorAll('.btn-promote-admin').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetEmail = btn.getAttribute('data-email');
      const targetName = btn.getAttribute('data-name');
      showConfirmDialog(
        `Promote ${targetName} to Admin?`,
        `${targetName} will gain Admin privileges — they can approve/block users and manage the library. Proceed?`,
        () => {
          const targetUser = users.find(u => u.email === targetEmail);
          if (onActionCallback) onActionCallback('admin_update_status', {
            targetEmail, status: (targetUser ? targetUser.status : 'Approved'), role: 'Admin'
          });
        },
        'Confirm Promotion',
        'btn-primary'
      );
    });
  });

  // Owner demote Admin
  view.querySelectorAll('.btn-demote-admin').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetEmail = btn.getAttribute('data-email');
      const targetName = btn.getAttribute('data-name');
      showConfirmDialog(
        `Remove Admin role from ${targetName}?`,
        `${targetName} will lose Admin privileges and revert to a regular Both (Lend & Borrow) member. Proceed?`,
        () => {
          const targetUser = users.find(u => u.email === targetEmail);
          if (onActionCallback) onActionCallback('admin_update_status', {
            targetEmail, status: (targetUser ? targetUser.status : 'Approved'), role: 'Both'
          });
        },
        'Confirm Demotion',
        'btn-warning'
      );
    });
  });

  // Owner automation scheduled trigger hour updates & toggles
  view.querySelectorAll('.automation-trigger-toggle').forEach(cb => {
    cb.addEventListener('change', () => {
      const key = cb.getAttribute('data-trigger-key');
      const row = view.querySelector(`.automation-hour-select[data-trigger-key="${key}"]`);
      const hour = row ? parseInt(row.value, 10) : 15;
      if (onActionCallback) onActionCallback('admin_update_automation', {
        triggers: { [key]: { enabled: cb.checked, hour } }
      });
    });
  });

  view.querySelectorAll('.automation-hour-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const key = sel.getAttribute('data-trigger-key');
      const toggle = view.querySelector(`.automation-trigger-toggle[data-trigger-key="${key}"]`);
      const enabled = toggle ? toggle.checked : true;
      if (onActionCallback) onActionCallback('admin_update_automation', {
        triggers: { [key]: { enabled, hour: parseInt(sel.value, 10) } }
      });
    });
  });

  // Owner trigger manual checking job run now
  view.querySelectorAll('.btn-trigger-now').forEach(btn => {
    btn.addEventListener('click', () => {
      const notifType = btn.getAttribute('data-notification-type');
      if (onActionCallback) onActionCallback('admin_trigger_notification', { notificationType: notifType });
    });
  });

  // Owner notifications checkbox categories triggers
  view.querySelectorAll('.automation-notif-toggle').forEach(cb => {
    cb.addEventListener('change', () => {
      const key = cb.getAttribute('data-notif-key');
      if (onActionCallback) onActionCallback('admin_update_automation', {
        notifications: { [key]: cb.checked }
      });
    });
  });
}

export function showAdminEditUserModal(user, currentUser) {
  const isOwnerUser = currentUser && currentUser.role === 'Owner';
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

  showModal(`Edit Member: ${user.name}`, bodyHtml);
  document.getElementById('admin-edit-cancel').addEventListener('click', () => hideModal());

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
      if (onActionCallback) onActionCallback('admin_edit_user', payload);
    };

    if (user.email !== (currentUser && currentUser.email)) {
      showConfirmDialog(
        'Confirm Profile Modification',
        `You are editing the profile details for "${user.name}" (${user.email}). Are you sure you want to save these changes on their behalf?`,
        doSubmit,
        'Confirm Modification',
        'btn-primary'
      );
    } else {
      doSubmit();
    }
  });
}
