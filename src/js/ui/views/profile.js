/**
 * Society Library Management System - Profile Views Component
 */
import { ICONS } from '../icons.js';
import { showModal, hideModal } from '../components/modal.js';

let onActionCallback = null;

export function initProfileView(onAction) {
  onActionCallback = onAction;
}

export function showRegistrationForm(prefilledEmail, prefilledName) {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // Hide stats summary during registration
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

  // Dynamic flat numbers population
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
  populateFlats();

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

    if (onActionCallback) {
      onActionCallback('register_submit', payload);
    }
  });
}

export function showPendingApprovalScreen(user) {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
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

export function showEditProfileModal(user) {
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

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
        <button type="button" class="btn btn-danger" id="profile-edit-logout" style="background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25); color: var(--accent-rose); display: flex; align-items: center; gap: 4px; padding: 0.5rem 1rem;">
          ${ICONS.logOut} Logout
        </button>
        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" id="profile-edit-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="profile-edit-submit">${ICONS.check} Save Changes</button>
        </div>
      </div>
    </form>
  `;

  showModal('Edit My Profile', bodyHtml);
  document.getElementById('profile-edit-cancel').addEventListener('click', () => hideModal());
  document.getElementById('profile-edit-logout').addEventListener('click', () => {
    hideModal();
    if (onActionCallback) onActionCallback('logout');
  });

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
    if (onActionCallback) onActionCallback('edit_profile', payload);
  });
}
