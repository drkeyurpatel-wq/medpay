// src/index.js — MedPay: Doctor Payout Calculation & Settlement System
// Health1 Super Speciality Hospitals
// Stack: Cloudflare Workers + D1

// ===================== CSS =====================
const CSS = `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; color: #1a202c; }
  .nav { background: #1a365d; padding: 0 24px; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; }
  .nav-brand { color: #fff; font-size: 20px; font-weight: 700; margin-right: 32px; text-decoration: none; }
  .nav-brand span { color: #63b3ed; }
  .nav a { color: #cbd5e0; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; transition: all 0.2s; }
  .nav a:hover, .nav a.active { color: #fff; background: rgba(255,255,255,0.1); }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .card { background: #fff; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 24px; margin-bottom: 16px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .card-title { font-size: 18px; font-weight: 600; color: #1a365d; }
  h1 { font-size: 28px; font-weight: 700; color: #1a365d; margin-bottom: 8px; }
  h2 { font-size: 22px; font-weight: 600; color: #1a365d; margin-bottom: 16px; }
  h3 { font-size: 16px; font-weight: 600; color: #2d3748; margin-bottom: 12px; }
  .subtitle { color: #718096; font-size: 14px; margin-bottom: 24px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
  .btn-primary { background: #2b6cb0; color: #fff; }
  .btn-primary:hover { background: #2c5282; }
  .btn-success { background: #276749; color: #fff; }
  .btn-success:hover { background: #22543d; }
  .btn-danger { background: #c53030; color: #fff; }
  .btn-danger:hover { background: #9b2c2c; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e0; color: #4a5568; }
  .btn-outline:hover { border-color: #2b6cb0; color: #2b6cb0; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 4px; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #2b6cb0; box-shadow: 0 0 0 3px rgba(43,108,176,0.1); }
  .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .form-section { border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
  .form-section-title { font-size: 15px; font-weight: 700; color: #1a365d; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #ebf4ff; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-mgm { background: #ebf4ff; color: #2b6cb0; }
  .badge-ffs { background: #f0fff4; color: #276749; }
  .badge-retainer { background: #faf5ff; color: #6b46c1; }
  .badge-salary { background: #fffbeb; color: #c05621; }
  .badge-throughput { background: #fff5f5; color: #c53030; }
  .badge-rb { background: #e6fffa; color: #285e61; }
  .badge-active { background: #f0fff4; color: #276749; }
  .badge-inactive { background: #fff5f5; color: #c53030; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .stat-card .label { font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-card .value { font-size: 28px; font-weight: 700; color: #1a365d; margin-top: 4px; }
  .stat-card .sub { font-size: 13px; color: #a0aec0; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { background: #f7fafc; color: #4a5568; font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 2px solid #e2e8f0; }
  th.sortable { cursor: pointer; user-select: none; position: relative; padding-right: 20px; }
  th.sortable:hover { background: #edf2f7; }
  th.sortable::after { content: '\\2195'; position: absolute; right: 6px; color: #cbd5e0; font-size: 12px; }
  th.sortable.asc::after { content: '\\2191'; color: #2b6cb0; }
  th.sortable.desc::after { content: '\\2193'; color: #2b6cb0; }
  td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; }
  tr:hover { background: #f7fafc; }
  .toast { position: fixed; top: 20px; right: 20px; padding: 12px 24px; border-radius: 8px; color: #fff; font-weight: 600; z-index: 1000; animation: slideIn 0.3s ease; }
  .toast-success { background: #276749; }
  .toast-error { background: #c53030; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .flag-card { border: 2px solid #fc8181; background: #fff5f5; }
  .flag-badge { background: #fed7d7; color: #c53030; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .collapsible { cursor: pointer; user-select: none; }
  .collapsible-content { display: none; padding-top: 16px; }
  .collapsible-content.open { display: block; }
  .result-card { border-left: 4px solid #2b6cb0; }
  .result-card.mgm-triggered { border-left-color: #ed8936; }
  .result-card.incentive-triggered { border-left-color: #48bb78; }
  .payout-amount { font-size: 24px; font-weight: 700; color: #276749; }
  .pool-amount { font-size: 16px; color: #4a5568; }
  .trigger-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px; }
  .trigger-mgm { background: #fefcbf; color: #975a16; }
  .trigger-incentive { background: #c6f6d5; color: #276749; }
  .upload-zone { border: 2px dashed #cbd5e0; border-radius: 10px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover { border-color: #2b6cb0; background: #ebf8ff; }
  .upload-zone.dragover { border-color: #2b6cb0; background: #ebf8ff; }
  .hidden { display: none !important; }
  .tab-bar { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 0; }
  .tab { padding: 10px 20px; font-size: 14px; font-weight: 600; color: #718096; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
  .tab.active { color: #2b6cb0; border-bottom-color: #2b6cb0; }
  .pkg-row { display: grid; grid-template-columns: 1fr 150px 40px; gap: 8px; align-items: end; margin-bottom: 8px; }
  .alias-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
  .loader { display: inline-block; width: 20px; height: 20px; border: 3px solid #e2e8f0; border-top-color: #2b6cb0; border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pin-screen { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a365d; }
  .pin-box { background: #fff; padding: 48px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; width: 360px; }
  .pin-box h1 { color: #1a365d; margin-bottom: 4px; }
  .pin-box .subtitle { margin-bottom: 24px; }
  .pin-input { font-size: 32px; text-align: center; letter-spacing: 12px; padding: 12px; width: 200px; border: 2px solid #e2e8f0; border-radius: 8px; }
  .pin-input:focus { outline: none; border-color: #2b6cb0; }
  .pin-error { color: #c53030; font-size: 14px; margin-top: 12px; min-height: 20px; }
  @media (max-width: 768px) {
    .container { padding: 16px; }
    .nav { padding: 0 12px; overflow-x: auto; }
    .nav a { font-size: 12px; padding: 6px 10px; white-space: nowrap; }
    .form-row { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
    h1 { font-size: 22px; }
    .stat-card .value { font-size: 22px; }
  }
</style>
`;

// ===================== HTML Shell =====================
function htmlShell(title, navActive, bodyContent, scriptContent = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — MedPay</title>
  ${CSS}
</head>
<body>
  <nav class="nav">
    <a href="/" class="nav-brand">Med<span>Pay</span></a>
    <a href="/" class="${navActive === 'dash' ? 'active' : ''}">Dashboard</a>
    <a href="/calc" class="${navActive === 'calc' ? 'active' : ''}">Calculator</a>
    <a href="/doctors" class="${navActive === 'doctors' ? 'active' : ''}">Doctors</a>
    <a href="/settlements" class="${navActive === 'settlements' ? 'active' : ''}">Settlements</a>
    <a href="/adjustments" class="${navActive === 'adjustments' ? 'active' : ''}">Adjustments</a>
    <a href="/month-end" class="${navActive === 'monthend' ? 'active' : ''}">Month-End</a>
    <a href="/aliases" class="${navActive === 'aliases' ? 'active' : ''}">Aliases</a>
    <a href="/logout" style="margin-left:auto; color:#fc8181;">Logout</a>
  </nav>
  <div class="container">
    ${bodyContent}
  </div>
  ${scriptContent}
  <script>
  document.addEventListener('click', function(e) {
    var th = e.target.closest('th.sortable');
    if (!th) return;
    var table = th.closest('table');
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    var idx = Array.from(th.parentElement.children).indexOf(th);
    var rows = Array.from(tbody.querySelectorAll('tr'));
    var isAsc = th.classList.contains('asc');
    th.parentElement.querySelectorAll('th').forEach(function(h) { h.classList.remove('asc', 'desc'); });
    th.classList.add(isAsc ? 'desc' : 'asc');
    var dir = isAsc ? -1 : 1;
    rows.sort(function(a, b) {
      var ca = (a.children[idx] || {}).textContent || '';
      var cb = (b.children[idx] || {}).textContent || '';
      var na = parseFloat(ca.replace(/[^0-9.-]/g, ''));
      var nb = parseFloat(cb.replace(/[^0-9.-]/g, ''));
      if (!isNaN(na) && !isNaN(nb)) return (na - nb) * dir;
      return ca.localeCompare(cb) * dir;
    });
    rows.forEach(function(r) { tbody.appendChild(r); });
  });
  </script>
</body>
</html>`;
}

// ===================== PIN Auth Page =====================
function pinPage(error = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedPay — Login</title>
  ${CSS}
</head>
<body>
  <div class="pin-screen">
    <div class="pin-box">
      <h1>Med<span style="color:#63b3ed">Pay</span></h1>
      <p class="subtitle">Health1 Doctor Payout System</p>
      <form method="POST" action="/login">
        <input type="password" name="pin" class="pin-input" maxlength="4" pattern="[0-9]{4}" autofocus placeholder="••••" inputmode="numeric">
        <div class="pin-error">${error}</div>
        <br><br>
        <button type="submit" class="btn btn-primary" style="width:100%">Enter</button>
      </form>
    </div>
  </div>
</body>
</html>`;
}

// ===================== Auth Helpers =====================
function getAuthCookie(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/medpay_pin=([^;]+)/);
  return match ? match[1] : null;
}

async function validatePin(pin, env) {
  if (pin === '1111') return { valid: true, role: 'admin', doctorId: null };
  const doc = await env.DB.prepare('SELECT id, name FROM doctors WHERE pin = ?').bind(pin).first();
  if (doc) return { valid: true, role: 'doctor', doctorId: doc.id, doctorName: doc.name };
  return { valid: false };
}

// ===================== Format Helpers =====================
function fmtRs(n) {
  if (n == null || isNaN(n)) return 'Rs. 0';
  const num = Number(n);
  const s = Math.abs(num).toFixed(0);
  let result = '';
  const len = s.length;
  if (len <= 3) { result = s; }
  else {
    result = s.slice(-3);
    let rem = s.slice(0, -3);
    while (rem.length > 2) {
      result = rem.slice(-2) + ',' + result;
      rem = rem.slice(0, -2);
    }
    if (rem.length > 0) result = rem + ',' + result;
  }
  return (num < 0 ? '-' : '') + 'Rs. ' + result;
}

function badgeClass(type) {
  const map = { MGM: 'badge-mgm', FFS: 'badge-ffs', Retainer: 'badge-retainer', Salary: 'badge-salary', Throughput: 'badge-throughput', ReverseBilling: 'badge-rb' };
  return map[type] || 'badge-mgm';
}

// ===================== Audit Log Helper =====================
async function auditLog(env, auth, action, entity, entityId, details) {
  try {
    await env.DB.prepare('INSERT INTO audit_log (user_pin, user_role, user_name, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
      auth.role === 'admin' ? 'admin' : (auth.doctorName || ''), auth.role, auth.doctorName || 'Admin', action, entity, entityId, typeof details === 'string' ? details : JSON.stringify(details)
    ).run();
  } catch(e) { /* silent */ }
}

// ===================== Rate Limiting =====================
async function checkRateLimit(env, ip) {
  const cutoff = new Date(Date.now() - 60000).toISOString();
  await env.DB.prepare('DELETE FROM login_attempts WHERE attempted_at < ?').bind(cutoff).run();
  const count = (await env.DB.prepare('SELECT COUNT(*) as cnt FROM login_attempts WHERE ip = ?').bind(ip).first()).cnt || 0;
  return count < 5;
}

async function recordLoginAttempt(env, ip) {
  await env.DB.prepare('INSERT INTO login_attempts (ip) VALUES (?)').bind(ip).run();
}

// ===================== Shared Doctor Data Loader =====================
async function loadDoctorData(env) {
  const doctors = (await env.DB.prepare('SELECT * FROM doctors ORDER BY name').all()).results || [];
  const contracts = (await env.DB.prepare('SELECT * FROM contracts').all()).results || [];
  const aliases = (await env.DB.prepare('SELECT * FROM doctor_aliases').all()).results || [];
  const packages = (await env.DB.prepare('SELECT * FROM procedure_packages').all()).results || [];
  const deptMap = (await env.DB.prepare('SELECT * FROM department_map').all()).results || [];
  // Build lookup maps
  const contractMap = {};
  for (const c of contracts) contractMap[c.doctor_id] = c;
  const aliasMap = {};
  for (const a of aliases) aliasMap[a.alias] = a.doctor_id;
  const packageMap = {};
  for (const p of packages) {
    if (!packageMap[p.doctor_id]) packageMap[p.doctor_id] = [];
    packageMap[p.doctor_id].push(p);
  }
  // Department category lookup
  const deptCategoryMap = {};
  for (const d of deptMap) deptCategoryMap[d.ecw_department.toLowerCase()] = d.category;
  return { doctors, contracts, contractMap, aliases, aliasMap, packages, packageMap, deptMap, deptCategoryMap };
}

// ===================== PAGE: Dashboard =====================
async function dashboardPage(env) {
  const data = await loadDoctorData(env);
  const totalDoctors = data.doctors.filter(d => d.active).length;
  const settlements = (await env.DB.prepare('SELECT * FROM monthly_settlements ORDER BY month DESC, centre LIMIT 50').all()).results || [];

  // Latest month stats
  const latestMonth = settlements.length > 0 ? settlements[0].month : 'N/A';
  let totalPayout = 0;
  let monthSettlements = settlements.filter(s => s.month === latestMonth);
  for (const s of monthSettlements) totalPayout += (s.final_payout || 0);

  const centres = ['Shilaj', 'Vastral', 'Modasa', 'Gandhinagar', 'Udaipur'];
  let centreCards = '';
  for (const c of centres) {
    const cs = monthSettlements.filter(s => s.centre === c);
    const cp = cs.reduce((sum, s) => sum + (s.final_payout || 0), 0);
    const dc = cs.length;
    centreCards += `<div class="stat-card"><div class="label">${c}</div><div class="value">${fmtRs(cp)}</div><div class="sub">${dc} doctor${dc !== 1 ? 's' : ''} settled</div></div>`;
  }

  const body = `
    <h1>Dashboard</h1>
    <p class="subtitle">MedPay — Doctor Payout Management</p>
    <div class="stat-grid">
      <div class="stat-card"><div class="label">Active Doctors</div><div class="value">${totalDoctors}</div><div class="sub">Registered in system</div></div>
      <div class="stat-card"><div class="label">Latest Month</div><div class="value">${latestMonth}</div><div class="sub">Most recent settlements</div></div>
      <div class="stat-card"><div class="label">Total Payout</div><div class="value">${fmtRs(totalPayout)}</div><div class="sub">For ${latestMonth}</div></div>
      <div class="stat-card"><div class="label">Contract Types</div><div class="value">${Object.keys(data.contractMap).length}</div><div class="sub">Configured contracts</div></div>
    </div>
    <h2>Centre-wise (${latestMonth})</h2>
    <div class="stat-grid">${centreCards}</div>
    <div class="card">
      <div class="card-header"><div class="card-title">Recent Settlements</div></div>
      <table>
        <thead><tr><th class="sortable">Month</th><th class="sortable">Centre</th><th class="sortable">Doctor</th><th class="sortable">Pool</th><th class="sortable">Payout</th><th>Status</th></tr></thead>
        <tbody>
          ${monthSettlements.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:#a0aec0;padding:24px;">No settlements yet. Go to Calculator to process billing data.</td></tr>' : ''}
          ${monthSettlements.map(s => {
            const doc = data.doctors.find(d => d.id === s.doctor_id);
            return `<tr><td>${s.month}</td><td>${s.centre}</td><td>${doc ? doc.display_name || doc.name : 'Unknown'}</td><td>${fmtRs(s.calculated_pool)}</td><td style="font-weight:700;color:#276749">${fmtRs(s.final_payout)}</td><td>${s.locked ? '<span class="badge badge-active">Locked</span>' : '<span class="badge badge-inactive">Draft</span>'}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
  return htmlShell('Dashboard', 'dash', body);
}

// ===================== PAGE: Doctors List =====================
async function doctorsListPage(env) {
  const data = await loadDoctorData(env);
  let rows = '';
  for (const doc of data.doctors) {
    const contract = data.contractMap[doc.id];
    const type = contract ? contract.contract_type : '—';
    const aliases = data.aliases.filter(a => a.doctor_id === doc.id).map(a => a.alias).join(', ');
    rows += `<tr>
      <td style="font-weight:600">${doc.display_name || doc.name}</td>
      <td>${doc.name}</td>
      <td><span class="badge ${badgeClass(type)}">${type}</span></td>
      <td style="font-size:12px;color:#718096">${aliases || '—'}</td>
      <td><span class="badge ${doc.active ? 'badge-active' : 'badge-inactive'}">${doc.active ? 'Active' : 'Inactive'}</span></td>
      <td>
        <div class="btn-group">
          <a href="/doctors/edit/${doc.id}" class="btn btn-outline btn-sm">Edit</a>
          <button class="btn btn-sm ${doc.active ? 'btn-danger' : 'btn-success'}" onclick="toggleActive(${doc.id}, ${doc.active ? 0 : 1})">${doc.active ? 'Deactivate' : 'Activate'}</button>
        </div>
      </td>
    </tr>`;
  }

  const body = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div><h1>Doctors</h1><p class="subtitle" style="margin:0">Manage doctors and contracts</p></div>
      <a href="/doctors/import" class="btn btn-outline" style="margin-right:8px">Import CSV</a>
      <a href="/doctors/add" class="btn btn-primary">+ Add Doctor</a>
    </div>
    <div class="card" style="padding:0;overflow-x:auto">
      <table>
        <thead><tr><th class="sortable">Display Name</th><th class="sortable">Canonical Name</th><th class="sortable">Contract</th><th>Aliases</th><th class="sortable">Status</th><th>Actions</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" style="text-align:center;padding:24px;color:#a0aec0">No doctors registered. Click + Add Doctor to start.</td></tr>'}</tbody>
      </table>
    </div>
  `;

  const script = `<script>
async function toggleActive(id, val) {
  if (!confirm(val ? 'Activate this doctor?' : 'Deactivate this doctor?')) return;
  const r = await fetch('/api/doctors/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({active: val}) });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}
</script>`;

  return htmlShell('Doctors', 'doctors', body, script);
}

// ===================== PAGE: Add/Edit Doctor (Questionnaire) =====================
async function doctorFormPage(env, doctorId = null) {
  let doc = null, contract = null, pkgs = [], existingAliases = [];
  if (doctorId) {
    doc = await env.DB.prepare('SELECT * FROM doctors WHERE id = ?').bind(doctorId).first();
    contract = await env.DB.prepare('SELECT * FROM contracts WHERE doctor_id = ?').bind(doctorId).first();
    pkgs = (await env.DB.prepare('SELECT * FROM procedure_packages WHERE doctor_id = ?').bind(doctorId).all()).results || [];
    existingAliases = (await env.DB.prepare('SELECT * FROM doctor_aliases WHERE doctor_id = ?').bind(doctorId).all()).results || [];
  }

  const isEdit = !!doc;
  const v = (field, fallback = '') => {
    if (contract && contract[field] != null) return contract[field];
    if (doc && doc[field] != null) return doc[field];
    return fallback;
  };
  const sel = (field, val) => v(field) == val ? 'selected' : '';
  const chk = (field, val = 1) => v(field) == val ? 'checked' : '';

  const body = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div><h1>${isEdit ? 'Edit Doctor' : 'Add Doctor'}</h1><p class="subtitle" style="margin:0">${isEdit ? 'Update contract and settings for ' + doc.name : 'Onboard a new doctor via questionnaire'}</p></div>
      <a href="/doctors" class="btn btn-outline">← Back</a>
    </div>
    <form id="doctorForm">
      <input type="hidden" id="f_doctor_id" value="${isEdit ? doc.id : ''}">

      <!-- SECTION 1: Identity -->
      <div class="form-section">
        <div class="form-section-title">Section 1 — Doctor Identity</div>
        <div class="form-row">
          <div class="form-group"><label>Full Name (canonical) *</label><input type="text" id="f_name" value="${isEdit ? doc.name : ''}" required ${isEdit ? 'readonly style="background:#f7fafc"' : ''}></div>
          <div class="form-group"><label>Display Name</label><input type="text" id="f_display_name" value="${v('display_name')}"></div>
          <div class="form-group"><label>Login PIN (4-digit)</label><input type="text" id="f_pin" value="${v('pin')}" maxlength="4" pattern="[0-9]{4}" inputmode="numeric"></div>
        </div>
        <div class="form-group">
          <label>Centre(s)</label>
          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:4px">
            <label style="font-weight:400"><input type="checkbox" class="centre-chk" value="Shilaj"> Shilaj</label>
            <label style="font-weight:400"><input type="checkbox" class="centre-chk" value="Vastral"> Vastral</label>
            <label style="font-weight:400"><input type="checkbox" class="centre-chk" value="Modasa"> Modasa</label>
            <label style="font-weight:400"><input type="checkbox" class="centre-chk" value="Gandhinagar"> Gandhinagar</label>
            <label style="font-weight:400"><input type="checkbox" class="centre-chk" value="Udaipur"> Udaipur</label>
          </div>
        </div>
        <div class="form-group"><label>MOU Effective Date</label><input type="date" id="f_effective_date" value="${v('effective_date')}"></div>
      </div>

      <!-- SECTION 2: Contract Type -->
      <div class="form-section">
        <div class="form-section-title">Section 2 — Contract Type</div>
        <div class="form-group">
          <label>Select Contract Type *</label>
          <select id="f_contract_type" required onchange="onContractTypeChange()">
            <option value="">— Select —</option>
            <option value="MGM" ${sel('contract_type', 'MGM')}>MGM — Monthly Minimum Guarantee</option>
            <option value="Retainer" ${sel('contract_type', 'Retainer')}>Retainer — Fixed monthly + optional pool %</option>
            <option value="FFS" ${sel('contract_type', 'FFS')}>FFS — Fee For Service</option>
            <option value="Salary" ${sel('contract_type', 'Salary')}>Salary — Fixed salary, off-system</option>
            <option value="Throughput" ${sel('contract_type', 'Throughput')}>Throughput — 100% pass-through</option>
            <option value="ReverseBilling" ${sel('contract_type', 'ReverseBilling')}>Reverse Billing — Doctor bills hospital</option>
          </select>
        </div>
      </div>

      <!-- TDS -->
      <div class="form-section">
        <div class="form-section-title">TDS (Tax Deducted at Source)</div>
        <div class="form-row">
          <div class="form-group"><label>TDS Rate</label>
            <select id="f_tds_rate">
              <option value="10" ${v('tds_rate', 10) == 10 ? 'selected' : ''}>10% (Standard)</option>
              <option value="1" ${v('tds_rate', 10) == 1 ? 'selected' : ''}>1% (Low TDS Certificate)</option>
              <option value="0" ${v('tds_rate', 10) == 0 ? 'selected' : ''}>0% (Exempt)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- SECTION 3: Settlement Terms -->
      <div class="form-section" id="sec_settlement" style="display:none">
        <div class="form-section-title">Section 3 — Settlement Terms</div>
        <div class="form-row">
          <div class="form-group" id="grp_mgm"><label>Monthly Minimum Guarantee (Rs.)</label><input type="number" id="f_mgm_amount" value="${v('mgm_amount')}" step="0.01"></div>
          <div class="form-group" id="grp_threshold"><label>Incentive Threshold (Rs.)</label><input type="number" id="f_threshold_amount" value="${v('threshold_amount')}" step="0.01"></div>
          <div class="form-group" id="grp_incentive_pct"><label>Incentive % above threshold</label><input type="number" id="f_incentive_pct" value="${v('incentive_pct')}" step="0.01"></div>
          <div class="form-group" id="grp_retainer_pool"><label>Pool % (on top of retainer)</label><input type="number" id="f_retainer_pool_pct" value="${v('retainer_pool_pct')}" step="0.01"></div>
        </div>
      </div>

      <!-- SECTION 4: CASH Payor -->
      <div class="form-section" id="sec_cash" style="display:none">
        <div class="form-section-title">Section 4 — CASH Payor Terms</div>
        <div class="form-row">
          <div class="form-group"><label>Base Method</label>
            <select id="f_cash_base_method" onchange="onCashMethodChange()">
              <option value="">— Select —</option>
              <option value="A" ${sel('cash_base_method', 'A')}>A — Doctor Amt</option>
              <option value="B" ${sel('cash_base_method', 'B')}>B — Net minus Rad/Path/Pharma</option>
              <option value="B_pct" ${sel('cash_base_method', 'B_pct')}>B_pct — % of Method B</option>
              <option value="C" ${sel('cash_base_method', 'C')}>C — Package Amt</option>
              <option value="D" ${sel('cash_base_method', 'D')}>D — % of Net Amt</option>
              <option value="na" ${sel('cash_base_method', 'na')}>na — Not applicable</option>
              <option value="G" ${sel('cash_base_method', 'G')}>G — Government/Salary</option>
            </select>
          </div>
          <div class="form-group" id="grp_cash_b_pct" style="display:none"><label>B_pct: What % of Method B?</label><input type="number" id="f_cash_b_pct" value="${v('cash_b_pct')}" step="0.01"></div>
          <div class="form-group"><label>Self-referral %</label><input type="number" id="f_cash_self_pct" value="${v('cash_self_pct')}" step="0.01"></div>
          <div class="form-group"><label>Other-referral %</label><input type="number" id="f_cash_other_pct" value="${v('cash_other_pct')}" step="0.01"></div>
        </div>
      </div>

      <!-- SECTION 5: TPA Payor -->
      <div class="form-section" id="sec_tpa" style="display:none">
        <div class="form-section-title">Section 5 — TPA Payor Terms (Private Insurance)</div>
        <div class="form-row">
          <div class="form-group"><label>Base Method</label>
            <select id="f_tpa_base_method" onchange="onTpaMethodChange()">
              <option value="">— Select —</option>
              <option value="A" ${sel('tpa_base_method', 'A')}>A — Doctor Amt</option>
              <option value="B" ${sel('tpa_base_method', 'B')}>B — Net minus Rad/Path/Pharma</option>
              <option value="B_pct" ${sel('tpa_base_method', 'B_pct')}>B_pct — % of Method B</option>
              <option value="C" ${sel('tpa_base_method', 'C')}>C — Package Amt</option>
              <option value="D" ${sel('tpa_base_method', 'D')}>D — % of Net Amt</option>
              <option value="na" ${sel('tpa_base_method', 'na')}>na — Not applicable</option>
              <option value="G" ${sel('tpa_base_method', 'G')}>G — Government/Salary</option>
            </select>
          </div>
          <div class="form-group" id="grp_tpa_b_pct" style="display:none"><label>B_pct: What % of Method B?</label><input type="number" id="f_tpa_b_pct" value="${v('tpa_b_pct')}" step="0.01"></div>
          <div class="form-group"><label>Self-referral %</label><input type="number" id="f_tpa_self_pct" value="${v('tpa_self_pct')}" step="0.01"></div>
          <div class="form-group"><label>Other-referral %</label><input type="number" id="f_tpa_other_pct" value="${v('tpa_other_pct')}" step="0.01"></div>
        </div>
      </div>

      <!-- SECTION 6: PMJAY -->
      <div class="form-section" id="sec_pmjay" style="display:none">
        <div class="form-section-title">Section 6 — PMJAY Terms</div>
        <div class="form-row">
          <div class="form-group"><label>Is PMJAY applicable?</label>
            <select id="f_pmjay_base_method">
              <option value="na" ${sel('pmjay_base_method', 'na')}>No (na)</option>
              <option value="C" ${sel('pmjay_base_method', 'C')}>Yes (C — Package Amt)</option>
            </select>
          </div>
          <div class="form-group"><label>% of Package Amount</label><input type="number" id="f_pmjay_pct" value="${v('pmjay_pct')}" step="0.01"></div>
          <div class="form-group"><label>Count toward MGM pool?</label>
            <select id="f_pmjay_in_mgm_pool">
              <option value="1" ${sel('pmjay_in_mgm_pool', 1)}>Yes</option>
              <option value="0" ${sel('pmjay_in_mgm_pool', 0)}>No</option>
            </select>
          </div>
        </div>
      </div>

      <!-- SECTION 7: Govt Payor -->
      <div class="form-section" id="sec_govt" style="display:none">
        <div class="form-section-title">Section 7 — Govt Payor Terms (CGHS / ECHS / RGHS / UGVCL)</div>
        <div class="form-row">
          <div class="form-group"><label>Base Method</label>
            <select id="f_govt_base_method" onchange="onGovtMethodChange()">
              <option value="">— Select —</option>
              <option value="A" ${sel('govt_base_method', 'A')}>A — Doctor Amt</option>
              <option value="B" ${sel('govt_base_method', 'B')}>B — Net minus Rad/Path/Pharma</option>
              <option value="B_pct" ${sel('govt_base_method', 'B_pct')}>B_pct — % of Method B</option>
              <option value="C" ${sel('govt_base_method', 'C')}>C — Package Amt</option>
              <option value="D" ${sel('govt_base_method', 'D')}>D — % of Net Amt</option>
              <option value="na" ${sel('govt_base_method', 'na')}>na — Not applicable</option>
              <option value="G" ${sel('govt_base_method', 'G')}>G — Government/Salary</option>
            </select>
          </div>
          <div class="form-group" id="grp_govt_b_pct" style="display:none"><label>B_pct: What % of Method B?</label><input type="number" id="f_govt_b_pct" value="${v('govt_b_pct')}" step="0.01"></div>
          <div class="form-group"><label>Self-referral %</label><input type="number" id="f_govt_self_pct" value="${v('govt_self_pct')}" step="0.01"></div>
          <div class="form-group"><label>Other-referral %</label><input type="number" id="f_govt_other_pct" value="${v('govt_other_pct')}" step="0.01"></div>
        </div>
      </div>

      <!-- SECTION 8: OPD -->
      <div class="form-section" id="sec_opd" style="display:none">
        <div class="form-section-title">Section 8 — OPD Terms</div>
        <div class="form-row">
          <div class="form-group"><label>OPD % for CASH / TPA</label><input type="number" id="f_opd_non_govt_pct" value="${v('opd_non_govt_pct')}" step="0.01"></div>
          <div class="form-group"><label>OPD % for Govt</label><input type="number" id="f_opd_govt_pct" value="${v('opd_govt_pct')}" step="0.01"></div>
        </div>
      </div>

      <!-- SECTION 9: Fixed Procedure Packages -->
      <div class="form-section" id="sec_packages" style="display:none">
        <div class="form-section-title">Section 9 — Fixed Procedure Packages (Optional)</div>
        <p style="font-size:13px;color:#718096;margin-bottom:12px">These override ALL other methods when the eCW service name contains the keyword.</p>
        <div id="pkg_container">
          ${pkgs.map((p, i) => `<div class="pkg-row"><div class="form-group" style="margin:0"><input type="text" class="pkg-keyword" value="${p.procedure_keyword}" placeholder="eCW service keyword"></div><div class="form-group" style="margin:0"><input type="number" class="pkg-fee" value="${p.doctor_fee}" placeholder="Fee (Rs.)" step="0.01"></div><button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.pkg-row').remove()">✕</button></div>`).join('')}
        </div>
        <button type="button" class="btn btn-outline btn-sm" onclick="addPkgRow()">+ Add Package</button>
      </div>

      <!-- SECTION 10: Reverse Billing -->
      <div class="form-section" id="sec_rb" style="display:none">
        <div class="form-section-title">Section 10 — Reverse Billing Terms</div>
        <div class="form-row">
          <div class="form-group"><label>Hospital Fixed Charge (Rs.)</label><input type="number" id="f_rb_hospital_fixed" value="${v('rb_hospital_fixed')}" step="0.01"></div>
          <div class="form-group"><label>Deduct robotic charge when used?</label>
            <select id="f_rb_includes_robotic">
              <option value="0" ${sel('rb_includes_robotic', 0)}>No</option>
              <option value="1" ${sel('rb_includes_robotic', 1)}>Yes</option>
            </select>
          </div>
        </div>
      </div>

      <!-- SECTION 11: Aliases -->
      <div class="form-section">
        <div class="form-section-title">Section 11 — eCW Name Aliases</div>
        <p style="font-size:13px;color:#718096;margin-bottom:12px">Enter the exact name(s) this doctor appears under in eCW CSV exports. One per row.</p>
        <div id="alias_container">
          ${existingAliases.map(a => `<div class="alias-row"><input type="text" class="alias-input" value="${a.alias}" style="flex:1;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px"><button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.alias-row').remove()">✕</button></div>`).join('')}
        </div>
        <button type="button" class="btn btn-outline btn-sm" onclick="addAliasRow()">+ Add Alias</button>
      </div>

      <!-- SECTION 12: Notes -->
      <div class="form-section">
        <div class="form-section-title">Section 12 — Notes</div>
        <div class="form-group"><label>Special rules, exceptions, or context</label><textarea id="f_notes" rows="4">${v('notes')}</textarea></div>
      </div>

      <div style="display:flex;gap:12px;justify-content:flex-end;padding:20px 0">
        <a href="/doctors" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-primary" id="saveBtn">${isEdit ? 'Update Doctor' : 'Save Doctor'}</button>
      </div>
    </form>
  `;

  const script = `<script>
function onContractTypeChange() {
  var t = document.getElementById('f_contract_type').value;
  var show = function(id, vis) { document.getElementById(id).style.display = vis ? '' : 'none'; };
  var hasBilling = ['MGM','Retainer','FFS','Throughput','ReverseBilling'].indexOf(t) >= 0;
  show('sec_settlement', t === 'MGM' || t === 'Retainer');
  show('grp_mgm', t === 'MGM' || t === 'Retainer');
  show('grp_threshold', t === 'MGM');
  show('grp_incentive_pct', t === 'MGM');
  show('grp_retainer_pool', t === 'Retainer');
  show('sec_cash', hasBilling);
  show('sec_tpa', hasBilling);
  show('sec_pmjay', hasBilling);
  show('sec_govt', hasBilling);
  show('sec_opd', hasBilling);
  show('sec_packages', hasBilling);
  show('sec_rb', t === 'ReverseBilling');
}
function onCashMethodChange() { document.getElementById('grp_cash_b_pct').style.display = document.getElementById('f_cash_base_method').value === 'B_pct' ? '' : 'none'; }
function onTpaMethodChange() { document.getElementById('grp_tpa_b_pct').style.display = document.getElementById('f_tpa_base_method').value === 'B_pct' ? '' : 'none'; }
function onGovtMethodChange() { document.getElementById('grp_govt_b_pct').style.display = document.getElementById('f_govt_base_method').value === 'B_pct' ? '' : 'none'; }

function addPkgRow() {
  var c = document.getElementById('pkg_container');
  var d = document.createElement('div');
  d.className = 'pkg-row';
  d.innerHTML = '<div class="form-group" style="margin:0"><input type="text" class="pkg-keyword" placeholder="eCW service keyword"></div><div class="form-group" style="margin:0"><input type="number" class="pkg-fee" placeholder="Fee (Rs.)" step="0.01"></div><button type="button" class="btn btn-danger btn-sm" onclick="this.closest(\\x27.pkg-row\\x27).remove()">\\u2715</button>';
  c.appendChild(d);
}

function addAliasRow() {
  var c = document.getElementById('alias_container');
  var d = document.createElement('div');
  d.className = 'alias-row';
  d.innerHTML = '<input type="text" class="alias-input" style="flex:1;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px" placeholder="eCW name variant"><button type="button" class="btn btn-danger btn-sm" onclick="this.closest(\\x27.alias-row\\x27).remove()">\\u2715</button>';
  c.appendChild(d);
}

// Init visibility
onContractTypeChange();
onCashMethodChange();
onTpaMethodChange();
onGovtMethodChange();

// Form submit
document.getElementById('doctorForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var btn = document.getElementById('saveBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  var gv = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
  var gn = function(id) { var v = gv(id); return v === '' ? null : parseFloat(v); };

  var packages = [];
  document.querySelectorAll('.pkg-row').forEach(function(row) {
    var kw = row.querySelector('.pkg-keyword').value.trim();
    var fee = row.querySelector('.pkg-fee').value;
    if (kw && fee) packages.push({ procedure_keyword: kw, doctor_fee: parseFloat(fee) });
  });

  var aliases = [];
  document.querySelectorAll('.alias-input').forEach(function(inp) {
    var v = inp.value.trim();
    if (v) aliases.push(v);
  });

  var centres = [];
  document.querySelectorAll('.centre-chk:checked').forEach(function(cb) { centres.push(cb.value); });

  var payload = {
    doctor: {
      name: gv('f_name').trim(),
      display_name: gv('f_display_name').trim() || null,
      pin: gv('f_pin').trim() || null
    },
    contract: {
      contract_type: gv('f_contract_type'),
      mgm_amount: gn('f_mgm_amount'),
      threshold_amount: gn('f_threshold_amount'),
      incentive_pct: gn('f_incentive_pct'),
      retainer_pool_pct: gn('f_retainer_pool_pct'),
      cash_base_method: gv('f_cash_base_method') || null,
      cash_b_pct: gn('f_cash_b_pct'),
      cash_self_pct: gn('f_cash_self_pct'),
      cash_other_pct: gn('f_cash_other_pct'),
      tpa_base_method: gv('f_tpa_base_method') || null,
      tpa_b_pct: gn('f_tpa_b_pct'),
      tpa_self_pct: gn('f_tpa_self_pct'),
      tpa_other_pct: gn('f_tpa_other_pct'),
      pmjay_base_method: gv('f_pmjay_base_method') || null,
      pmjay_pct: gn('f_pmjay_pct'),
      pmjay_in_mgm_pool: parseInt(gv('f_pmjay_in_mgm_pool')) || 0,
      govt_base_method: gv('f_govt_base_method') || null,
      govt_b_pct: gn('f_govt_b_pct'),
      govt_self_pct: gn('f_govt_self_pct'),
      govt_other_pct: gn('f_govt_other_pct'),
      opd_non_govt_pct: gn('f_opd_non_govt_pct'),
      opd_govt_pct: gn('f_opd_govt_pct'),
      rb_hospital_fixed: gn('f_rb_hospital_fixed'),
      rb_includes_robotic: parseInt(gv('f_rb_includes_robotic')) || 0,
      notes: gv('f_notes').trim() || null,
      effective_date: gv('f_effective_date') || null,
      tds_rate: parseFloat(gv('f_tds_rate')) || 10
    },
    packages: packages,
    aliases: aliases,
    centres: centres
  };

  var doctorId = gv('f_doctor_id');
  var url = doctorId ? '/api/doctors/' + doctorId : '/api/doctors';
  var method = doctorId ? 'PUT' : 'POST';

  try {
    var r = await fetch(url, { method: method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (r.ok) {
      window.location.href = '/doctors?saved=1';
    } else {
      var err = await r.text();
      alert('Error: ' + err);
      btn.disabled = false;
      btn.textContent = doctorId ? 'Update Doctor' : 'Save Doctor';
    }
  } catch(ex) {
    alert('Network error: ' + ex.message);
    btn.disabled = false;
    btn.textContent = doctorId ? 'Update Doctor' : 'Save Doctor';
  }
});
</script>`;

  return htmlShell(isEdit ? 'Edit Doctor' : 'Add Doctor', 'doctors', body, script);
}

// ===================== PAGE: Calculator =====================
async function calcPage(env) {
  const data = await loadDoctorData(env);
  const docJson = JSON.stringify({
    doctors: data.doctors.filter(d => d.active),
    contractMap: data.contractMap,
    aliasMap: data.aliasMap,
    packageMap: data.packageMap,
    deptCategoryMap: data.deptCategoryMap
  });

  const body = `
    <h1>Payout Calculator</h1>
    <p class="subtitle">Process eCW billing CSV or enter bills manually</p>

    <div class="tab-bar">
      <div class="tab active" onclick="switchTab('csv')">CSV Upload</div>
      <div class="tab" onclick="switchTab('manual')">Manual Entry</div>
      <div class="tab" onclick="switchTab('flags')">Flags</div>
    </div>

    <!-- CSV Tab -->
    <div id="tab_csv">
      <div class="card">
        <div class="form-row">
          <div class="form-group">
            <label>Month</label>
            <input type="month" id="calc_month" value="${new Date().toISOString().slice(0,7)}">
          </div>
        </div>
        <div class="upload-zone" id="dropZone" onclick="document.getElementById('csvFile').click()">
          <input type="file" id="csvFile" accept=".csv" style="display:none" multiple onchange="handleFiles(this.files)">
          <div style="font-size:36px;margin-bottom:8px">📄</div>
          <div style="font-size:16px;font-weight:600;color:#2d3748">Drop eCW CSV(s) here or click to browse</div>
          <div style="font-size:13px;color:#a0aec0;margin-top:4px">Upload multiple files — across centres or date ranges. They will be combined.</div>
        </div>
        <div id="fileList" class="hidden" style="margin-top:12px"></div>
        <div id="doctorFilter" class="hidden" style="margin-top:16px">
          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center">
              <span>Select Doctors to Calculate</span>
              <div class="btn-group">
                <button class="btn btn-outline btn-sm" onclick="toggleAllDoctors(true)">Select All</button>
                <button class="btn btn-outline btn-sm" onclick="toggleAllDoctors(false)">Deselect All</button>
              </div>
            </div>
            <div id="doctorCheckboxes" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px"></div>
          </div>
        </div>
        <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
          <button class="btn btn-outline" id="clearBtn" onclick="clearAllFiles()" style="display:none">Clear All Files</button>
          <button class="btn btn-primary" id="processBtn" onclick="processCSV()" disabled>Process Bills</button>
        </div>
      </div>
    </div>

    <!-- Manual Tab -->
    <div id="tab_manual" class="hidden">
      <div class="card">
        <h3>Enter Individual Bill</h3>
        <div class="form-row">
          <div class="form-group"><label>Bill No *</label><input type="text" id="m_billno"></div>
          <div class="form-group"><label>Bill Date *</label><input type="date" id="m_billdate"></div>
          <div class="form-group"><label>Patient Name</label><input type="text" id="m_patient"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Consulting Doctor *</label><input type="text" id="m_doctor"></div>
          <div class="form-group"><label>Referring Doctor</label><input type="text" id="m_refdoctor"></div>
          <div class="form-group"><label>Sponsor</label><input type="text" id="m_sponsor" placeholder="Blank = CASH"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>IP/OP *</label>
            <select id="m_ipop"><option value="IP">IP</option><option value="OP">OP</option></select>
          </div>
          <div class="form-group"><label>Doctor Amt (Rs.)</label><input type="number" id="m_doctoramt" step="0.01"></div>
          <div class="form-group"><label>Service Amt (Rs.)</label><input type="number" id="m_serviceamt" step="0.01"></div>
          <div class="form-group"><label>Net Amt (Rs.)</label><input type="number" id="m_netamt" step="0.01"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Department</label><input type="text" id="m_dept" placeholder="e.g. IPD Consultation, IP PACKAGE"></div>
          <div class="form-group"><label>Service Name</label><input type="text" id="m_servicename"></div>
        </div>
        <div style="text-align:right;margin-top:8px">
          <button class="btn btn-outline" onclick="addManualRow()">+ Add Row to Bill</button>
          <button class="btn btn-primary" onclick="processManualBill()" style="margin-left:8px">Calculate</button>
        </div>
        <div id="manualRows" style="margin-top:12px"></div>
      </div>
    </div>

    <!-- Flags Tab -->
    <div id="tab_flags" class="hidden">
      <div class="card">
        <h3>Flagged Bills</h3>
        <div id="flagsList"><p style="color:#a0aec0">Process a CSV first to see flags.</p></div>
      </div>
    </div>

    <!-- Results Section -->
    <div id="results" class="hidden" style="margin-top:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="margin:0">Results</h2>
        <div class="btn-group">
          <button class="btn btn-outline btn-sm" onclick="exportResultsCSV()">Export CSV</button>
          <button class="btn btn-success btn-sm" onclick="saveSettlements()">Save Settlements</button>
        </div>
      </div>
      <div class="stat-grid" id="resultStats"></div>
      <div id="resultCards"></div>
    </div>
  `;

  const SCRIPT = `<script>
// ============ INJECTED DATA ============
var DOC_DATA = ${docJson};

// ============ GLOBALS ============
var uploadedFiles = [];  // { name, centre, rows[] }
var allCsvRows = [];     // combined rows from all files
var calcResults = null;
var manualBillRows = [];
var allFlags = [];
var detectedDoctors = {}; // docId -> { name, billCount }

// ============ UI HELPERS ============
function switchTab(t) {
  ['csv','manual','flags'].forEach(function(x) {
    document.getElementById('tab_' + x).classList.toggle('hidden', x !== t);
  });
  document.querySelectorAll('.tab-bar .tab').forEach(function(el, i) {
    el.classList.toggle('active', ['csv','manual','flags'][i] === t);
  });
}

function toast(msg, type) {
  var d = document.createElement('div');
  d.className = 'toast toast-' + (type || 'success');
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(function() { d.remove(); }, 3000);
}

function fmtRs(n) {
  if (n == null || isNaN(n)) return 'Rs. 0';
  n = Number(n);
  var s = Math.abs(n).toFixed(0);
  var result = '';
  var len = s.length;
  if (len <= 3) { result = s; }
  else {
    result = s.slice(-3);
    var rem = s.slice(0, -3);
    while (rem.length > 2) {
      result = rem.slice(-2) + ',' + result;
      rem = rem.slice(0, -2);
    }
    if (rem.length > 0) result = rem + ',' + result;
  }
  return (n < 0 ? '-' : '') + 'Rs. ' + result;
}

function fmtDate(d) {
  if (!d) return '—';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.getDate().toString().padStart(2, '0') + '-' + months[dt.getMonth()] + '-' + dt.getFullYear();
}

// ============ DRAG & DROP (MULTI-FILE) ============
var dz = document.getElementById('dropZone');
if (dz) {
  dz.addEventListener('dragover', function(e) { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', function() { dz.classList.remove('dragover'); });
  dz.addEventListener('drop', function(e) { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); });
}

function handleFiles(files) {
  if (!files || files.length === 0) return;
  var pending = files.length;
  for (var i = 0; i < files.length; i++) {
    (function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var text = e.target.result;
        var rows = parseCSV(text);
        // Detect centre from file header (first few lines)
        var centre = detectCentre(text);
        uploadedFiles.push({ name: file.name, centre: centre, rows: rows });
        pending--;
        if (pending === 0) onAllFilesLoaded();
      };
      reader.readAsText(file);
    })(files[i]);
  }
}

function detectCentre(text) {
  var header = text.substring(0, 500).toUpperCase();
  if (header.indexOf('SHILAJ') >= 0 || header.indexOf('NEURO 1') >= 0) return 'Shilaj';
  if (header.indexOf('VASTRAL') >= 0) return 'Vastral';
  if (header.indexOf('MODASA') >= 0) return 'Modasa';
  if (header.indexOf('GANDHINAGAR') >= 0) return 'Gandhinagar';
  if (header.indexOf('UDAIPUR') >= 0) return 'Udaipur';
  return 'Unknown';
}

function onAllFilesLoaded() {
  // Combine all rows
  allCsvRows = [];
  uploadedFiles.forEach(function(f) {
    f.rows.forEach(function(r) {
      r._centre = f.centre; // tag each row with its source centre
      allCsvRows.push(r);
    });
  });

  // Show file list
  var fl = document.getElementById('fileList');
  fl.classList.remove('hidden');
  fl.innerHTML = '<h3 style="margin-bottom:8px">Uploaded Files (' + uploadedFiles.length + ')</h3>' +
    uploadedFiles.map(function(f, i) {
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f7fafc;border-radius:6px;margin-bottom:4px">' +
        '<span><strong>' + f.name + '</strong> — ' + f.rows.length + ' rows — <span class="badge badge-mgm">' + f.centre + '</span></span>' +
        '<button class="btn btn-danger btn-sm" onclick="removeFile(' + i + ')">\\u2715</button></div>';
    }).join('');

  document.getElementById('clearBtn').style.display = '';

  // Build doctor filter from parsed data
  buildDoctorFilter();

  document.getElementById('processBtn').disabled = false;
}

function removeFile(idx) {
  uploadedFiles.splice(idx, 1);
  if (uploadedFiles.length === 0) {
    clearAllFiles();
  } else {
    onAllFilesLoaded();
  }
}

function clearAllFiles() {
  uploadedFiles = [];
  allCsvRows = [];
  detectedDoctors = {};
  document.getElementById('fileList').classList.add('hidden');
  document.getElementById('fileList').innerHTML = '';
  document.getElementById('doctorFilter').classList.add('hidden');
  document.getElementById('doctorCheckboxes').innerHTML = '';
  document.getElementById('processBtn').disabled = true;
  document.getElementById('clearBtn').style.display = 'none';
  document.getElementById('csvFile').value = '';
}

function buildDoctorFilter() {
  var bills = groupByBill(allCsvRows);
  var grouped = groupByDoctor(bills);
  detectedDoctors = {};

  // Count bills per known doctor
  Object.keys(grouped.doctorBills).forEach(function(docIdStr) {
    var docId = parseInt(docIdStr);
    var doc = getDoctorById(docId);
    if (doc) {
      detectedDoctors[docId] = { name: doc.display_name || doc.name, billCount: grouped.doctorBills[docId].length };
    }
  });

  var container = document.getElementById('doctorCheckboxes');
  var docIds = Object.keys(detectedDoctors).sort(function(a, b) {
    return detectedDoctors[a].name.localeCompare(detectedDoctors[b].name);
  });

  if (docIds.length === 0) {
    container.innerHTML = '<p style="color:#a0aec0">No registered doctors found in uploaded data. All bills will appear as flags.</p>';
  } else {
    container.innerHTML = docIds.map(function(id) {
      var d = detectedDoctors[id];
      return '<label style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:#f7fafc;border-radius:6px;font-weight:400;font-size:13px;cursor:pointer">' +
        '<input type="checkbox" class="doc-filter-chk" value="' + id + '" checked>' +
        d.name + ' <span style="color:#a0aec0">(' + d.billCount + ' bills)</span></label>';
    }).join('');
  }

  document.getElementById('doctorFilter').classList.remove('hidden');

  // Also show flag count
  if (grouped.flags.length > 0) {
    container.innerHTML += '<div style="margin-top:8px;font-size:13px;color:#c53030">+ ' + grouped.flags.length + ' bills with unknown doctors (will show in Flags)</div>';
  }
}

function toggleAllDoctors(selectAll) {
  document.querySelectorAll('.doc-filter-chk').forEach(function(cb) { cb.checked = selectAll; });
}

// ============ LAYER 1: CSV PARSER ============
function parseCSV(text) {
  var lines = text.split('\\n');
  var headerIdx = -1;
  var headers = [];

  // Find header row (contains S.No.)
  for (var i = 0; i < lines.length && i < 10; i++) {
    var cells = parseCSVLine(lines[i]);
    for (var j = 0; j < cells.length; j++) {
      if (cells[j].trim().replace(/\\./g, '') === 'SNo' || cells[j].trim() === 'S.No.' || cells[j].trim() === 'S.No') {
        headerIdx = i;
        headers = cells.map(function(c) { return c.trim(); });
        break;
      }
    }
    if (headerIdx >= 0) break;
  }

  if (headerIdx < 0) { alert('Could not find header row with S.No. in CSV'); return []; }

  var rows = [];
  for (var i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    var cells = parseCSVLine(lines[i]);
    if (cells.length < 3) continue;
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = (cells[j] || '').trim();
    }
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  var result = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = false; }
      } else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { result.push(current); current = ''; }
      else { current += ch; }
    }
  }
  result.push(current);
  return result;
}

// ============ LAYER 1b: GROUP BY BILL ============
function groupByBill(rows) {
  var bills = {};
  rows.forEach(function(r) {
    var bn = r['Bill No.'] || r['Bill No'] || '';
    if (!bn) return;
    // Derive IP/OP from Bill No prefix: IPB=IP, OPB=OP
    var ipOp = 'IP';
    if (bn.toUpperCase().indexOf('OPB') === 0) ipOp = 'OP';
    if (!bills[bn]) {
      bills[bn] = {
        billNo: bn,
        billDate: r['Bill Date'] || '',
        patientName: r['Patient Name'] || '',
        consultDoctor: r['Consulting Dr'] || r['Doctor Name'] || '',
        refDoctor: r['Ref. Doctor'] || r['Ref. Doctor Name'] || r['Ref Doctor Name'] || '',
        sponsor: r['Sponsor'] || '',
        ipOp: r['IP/OP'] || r['IPOP'] || ipOp,
        _centre: r._centre || 'Unknown',
        rows: []
      };
    }
    var doctorAmt = parseFloat(r['Doctor Amt']) || 0;
    var serviceAmt = parseFloat(r['Service Amt']) || 0;
    var netAmt = parseFloat(r['Net Amt']) || 0;
    var dept = (r['Department'] || '').trim();
    var serviceName = (r['Service Name'] || '').trim();

    // Doctor Amt fallback rule
    if (doctorAmt === 0 && (dept === 'IPD Consultation' || dept === 'OPD Consultation' || dept === 'OP Consultation' || dept === 'Professional Fee' || dept === 'PROCEDURE')) {
      doctorAmt = serviceAmt;
    }

    bills[bn].rows.push({
      department: dept,
      serviceName: serviceName,
      doctorAmt: doctorAmt,
      serviceAmt: serviceAmt,
      netAmt: netAmt
    });
  });
  return Object.values(bills);
}

// ============ LAYER 2: GROUP BY DOCTOR ============
function normaliseName(name) {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/\\./g, '')
    .replace(/\\s+/g, ' ')
    .trim()
    .replace(/\\s*health\\s*one\\s*team$/i, '')
    .replace(/\\s*healthone\\s*team$/i, '')
    .replace(/\\s*healthone$/i, '')
    .replace(/\\s*health\\s*one$/i, '')
    .trim();
}

function resolveDoctorId(name) {
  var norm = normaliseName(name);
  // Check aliases first
  if (DOC_DATA.aliasMap[norm]) return DOC_DATA.aliasMap[norm];
  // Check canonical names
  for (var i = 0; i < DOC_DATA.doctors.length; i++) {
    if (normaliseName(DOC_DATA.doctors[i].name) === norm) return DOC_DATA.doctors[i].id;
  }
  return null;
}

function getDoctorById(id) {
  for (var i = 0; i < DOC_DATA.doctors.length; i++) {
    if (DOC_DATA.doctors[i].id === id) return DOC_DATA.doctors[i];
  }
  return null;
}

function groupByDoctor(bills) {
  var result = {};
  var flags = [];
  bills.forEach(function(bill) {
    var docName = bill.consultDoctor;
    var norm = normaliseName(docName);

    // Skip hospital/RMO rows
    if (norm.indexOf('health one hospital') >= 0 || norm.indexOf('health team rmo') >= 0 || norm === 'rmo' || norm.indexOf('rmo') === 0) return;

    var docId = resolveDoctorId(docName);
    if (!docId) {
      flags.push({ bill: bill, reason: 'Unknown doctor: ' + docName + ' — needs alias mapping' });
      return;
    }
    if (!result[docId]) result[docId] = [];
    result[docId].push(bill);
  });
  return { doctorBills: result, flags: flags };
}

// ============ LAYER 3: APPLY CONTRACT ============
function classifyPayor(sponsor) {
  var s = (sponsor || '').trim().toUpperCase();
  if (!s || s === 'CASH' || s === 'SELF PAY') return 'CASH';
  if (s.indexOf('PMJAY') >= 0 || s.indexOf('PM JAY') >= 0 || s.indexOf('AB-PMJAY') >= 0 || s.indexOf('PMJAY SEHAT') >= 0 || s.indexOf('BAJAJ GENERAL') >= 0) return 'PMJAY';
  if (s.indexOf('CGHS') >= 0 || s.indexOf('ECHS') >= 0 || s.indexOf('RGHS') >= 0 || s.indexOf('UGVCL') >= 0) return 'Govt';
  return 'TPA';
}

function getIpPackageAmt(bill) {
  for (var i = 0; i < bill.rows.length; i++) {
    if (bill.rows[i].department === 'IP PACKAGE') return bill.rows[i].serviceAmt;
  }
  return 0;
}

function getMethodBBase(bill) {
  var totalNet = 0;
  var excludeAmt = 0;
  bill.rows.forEach(function(r) {
    totalNet += r.netAmt;
    var dept = r.department.toLowerCase();
    var cat = DOC_DATA.deptCategoryMap[dept] || '';
    // Exclude rad_exclude, lab_exclude, pharma_exclude categories
    if (cat === 'rad_exclude' || cat === 'lab_exclude' || cat === 'pharma_exclude') {
      excludeAmt += r.serviceAmt;
    }
    // Fallback: substring match for departments not in map
    if (!cat && (dept.indexOf('radiology') >= 0 || dept.indexOf('pathology') >= 0 || dept.indexOf('pharmacy') >= 0 || dept === 'laboratory')) {
      excludeAmt += r.serviceAmt;
    }
  });
  return totalNet - excludeAmt;
}

function checkProcedurePackage(bill, packages) {
  if (!packages || packages.length === 0) return null;
  for (var i = 0; i < bill.rows.length; i++) {
    var sn = bill.rows[i].serviceName.toLowerCase();
    for (var j = 0; j < packages.length; j++) {
      if (sn.indexOf(packages[j].procedure_keyword.toLowerCase()) >= 0) {
        return packages[j];
      }
    }
  }
  return null;
}

function calcBillEarning(bill, contract, packages) {
  var payor = classifyPayor(bill.sponsor);
  var isOPD = (bill.ipOp || '').toUpperCase() === 'OP';
  var isSelf = normaliseName(bill.refDoctor) === normaliseName(bill.consultDoctor);
  var result = { payor: payor, baseMethod: '', baseAmount: 0, selfRef: isSelf, splitPct: 100, earning: 0, pkgOverride: false, pkgName: null, flagged: false, flagReason: '' };

  if (!contract) {
    result.flagged = true;
    result.flagReason = 'No contract found';
    return result;
  }

  var ctype = contract.contract_type;
  if (ctype === 'Salary' || ctype === 'G') {
    result.baseMethod = 'G';
    return result;
  }

  // Check procedure package first
  var pkg = checkProcedurePackage(bill, packages);
  if (pkg) {
    result.pkgOverride = true;
    result.pkgName = pkg.procedure_keyword;
    result.baseMethod = 'PKG';
    result.baseAmount = pkg.doctor_fee;
    result.earning = pkg.doctor_fee;
    return result;
  }

  // OPD handling
  if (isOPD) {
    var doctorAmtSum = bill.rows.reduce(function(s, r) { return s + r.doctorAmt; }, 0);
    if (payor === 'Govt') {
      result.baseMethod = 'OPD_GOVT';
      result.splitPct = contract.opd_govt_pct || 100;
      result.baseAmount = doctorAmtSum;
      result.earning = doctorAmtSum * (result.splitPct / 100);
    } else {
      result.baseMethod = 'OPD';
      result.splitPct = contract.opd_non_govt_pct || 100;
      result.baseAmount = doctorAmtSum;
      result.earning = doctorAmtSum * (result.splitPct / 100);
    }
    return result;
  }

  // IP handling — determine base method and compute base
  var method, bPct, selfPct, otherPct;
  if (payor === 'PMJAY') {
    method = contract.pmjay_base_method || 'na';
    if (method === 'na') { result.baseMethod = 'PMJAY_na'; return result; }
    result.baseMethod = 'C';
    result.baseAmount = getIpPackageAmt(bill);
    result.splitPct = contract.pmjay_pct || 0;
    result.earning = result.baseAmount * (result.splitPct / 100);
    return result;
  }

  if (payor === 'CASH') {
    method = contract.cash_base_method; bPct = contract.cash_b_pct;
    selfPct = contract.cash_self_pct; otherPct = contract.cash_other_pct;
  } else if (payor === 'TPA') {
    method = contract.tpa_base_method; bPct = contract.tpa_b_pct;
    selfPct = contract.tpa_self_pct; otherPct = contract.tpa_other_pct;
  } else if (payor === 'Govt') {
    method = contract.govt_base_method; bPct = contract.govt_b_pct;
    selfPct = contract.govt_self_pct; otherPct = contract.govt_other_pct;
  }

  if (!method || method === 'na' || method === 'G') {
    result.baseMethod = method || 'na';
    return result;
  }

  // Calculate base amount
  if (method === 'A') {
    result.baseAmount = bill.rows.reduce(function(s, r) { return s + r.doctorAmt; }, 0);
  } else if (method === 'B') {
    result.baseAmount = getMethodBBase(bill);
  } else if (method === 'B_pct') {
    result.baseAmount = getMethodBBase(bill) * ((bPct || 0) / 100);
  } else if (method === 'C') {
    result.baseAmount = getIpPackageAmt(bill);
  } else if (method === 'D') {
    var totalNet = bill.rows.reduce(function(s, r) { return s + r.netAmt; }, 0);
    result.baseAmount = totalNet;
  }
  result.baseMethod = method;

  // Reverse Billing
  if (ctype === 'ReverseBilling') {
    var totalBill = bill.rows.reduce(function(s, r) { return s + r.netAmt; }, 0);
    var pharmacy = 0;
    bill.rows.forEach(function(r) { if (r.department.toLowerCase().indexOf('pharmacy') >= 0) pharmacy += r.serviceAmt; });
    result.baseAmount = totalBill - pharmacy - (contract.rb_hospital_fixed || 0);
    // Check for robotic
    if (contract.rb_includes_robotic) {
      bill.rows.forEach(function(r) {
        if (r.serviceName.toLowerCase().indexOf('robotic') >= 0) result.baseAmount -= r.serviceAmt;
      });
    }
    result.baseMethod = 'RB';
    result.earning = Math.max(0, result.baseAmount);
    return result;
  }

  // Apply referral split
  if (ctype === 'Throughput') {
    selfPct = 100; otherPct = 100;
  }
  result.splitPct = isSelf ? (selfPct || 100) : (otherPct || 100);
  result.earning = result.baseAmount * (result.splitPct / 100);

  return result;
}

// ============ LAYER 4: SETTLEMENT CHECK ============
function calcSettlement(docId, billResults, contract) {
  var pool = 0;
  var pmjayPool = 0;
  billResults.forEach(function(br) {
    pool += br.earning;
    if (br.payor === 'PMJAY') pmjayPool += br.earning;
  });

  var ctype = contract ? contract.contract_type : 'FFS';
  var payout = pool;
  var mgmTriggered = false;
  var incentiveTriggered = false;
  var incentiveAmount = 0;

  if (ctype === 'MGM') {
    var mgmPool = pool;
    if (contract.pmjay_in_mgm_pool === 0) mgmPool -= pmjayPool;
    if (mgmPool < (contract.mgm_amount || 0)) {
      payout = (contract.mgm_amount || 0);
      if (contract.pmjay_in_mgm_pool === 0) payout += pmjayPool;
      mgmTriggered = true;
    } else if (contract.threshold_amount && mgmPool >= contract.threshold_amount) {
      var delta = mgmPool - contract.threshold_amount;
      incentiveAmount = delta * ((contract.incentive_pct || 0) / 100);
      payout = contract.threshold_amount + incentiveAmount;
      if (contract.pmjay_in_mgm_pool === 0) payout += pmjayPool;
      incentiveTriggered = true;
    }
  } else if (ctype === 'Retainer') {
    payout = contract.mgm_amount || 0;
    if (pool > 0 && contract.retainer_pool_pct) {
      payout += pool * (contract.retainer_pool_pct / 100);
    }
  } else if (ctype === 'Salary') {
    payout = 0;
  }

  return {
    pool: pool,
    pmjayPool: pmjayPool,
    payout: payout,
    tdsRate: contract ? (contract.tds_rate != null ? contract.tds_rate : 10) : 10,
    tdsAmount: payout * ((contract ? (contract.tds_rate != null ? contract.tds_rate : 10) : 10) / 100),
    netPayout: payout - (payout * ((contract ? (contract.tds_rate != null ? contract.tds_rate : 10) : 10) / 100)),
    mgmTriggered: mgmTriggered,
    incentiveTriggered: incentiveTriggered,
    incentiveAmount: incentiveAmount
  };
}

// ============ LAYER 5: PROCESS & DISPLAY ============
function processCSV() {
  if (!allCsvRows || allCsvRows.length === 0) { alert('No CSV data loaded'); return; }

  // Pipeline stats
  var pStats = { rows: allCsvRows.length, bills: 0, doctorsMatched: 0, doctorsFlagged: 0, mgmCount: 0, incentiveCount: 0, zeroBills: 0 };

  // Get selected doctor IDs
  var selectedDocIds = {};
  var anyChecked = false;
  document.querySelectorAll('.doc-filter-chk').forEach(function(cb) {
    if (cb.checked) { selectedDocIds[cb.value] = true; anyChecked = true; }
  });

  var bills = groupByBill(allCsvRows);
  pStats.bills = bills.length;
  var grouped = groupByDoctor(bills);
  allFlags = grouped.flags;
  pStats.doctorsFlagged = allFlags.length;

  var results = [];
  var doctorBills = grouped.doctorBills;

  Object.keys(doctorBills).forEach(function(docIdStr) {
    // Apply doctor filter
    if (anyChecked && !selectedDocIds[docIdStr]) return;

    var docId = parseInt(docIdStr);
    var doc = getDoctorById(docId);
    var contract = DOC_DATA.contractMap[docId] || null;
    var packages = DOC_DATA.packageMap[docId] || [];
    var bills = doctorBills[docId];

    // Detect centres this doctor has bills from
    var centresUsed = {};
    bills.forEach(function(bill) {
      var c = bill._centre || 'Unknown';
      if (!centresUsed[c]) centresUsed[c] = 0;
      centresUsed[c]++;
    });

    var billResults = [];
    var billFlags = [];
    var payorBreakdown = { CASH: 0, TPA: 0, PMJAY: 0, Govt: 0, OPD: 0 };

    bills.forEach(function(bill) {
      var br = calcBillEarning(bill, contract, packages);
      br.bill = bill;
      br.centre = bill._centre || 'Unknown';
      billResults.push(br);
      if (br.flagged) billFlags.push(br);
      // Track payor breakdown
      if (br.baseMethod.indexOf('OPD') === 0) { payorBreakdown.OPD += br.earning; }
      else { payorBreakdown[br.payor] = (payorBreakdown[br.payor] || 0) + br.earning; }
    });

    var settlement = calcSettlement(docId, billResults, contract);

    results.push({
      docId: docId,
      doctor: doc,
      contract: contract,
      billResults: billResults,
      billFlags: billFlags,
      settlement: settlement,
      centresUsed: centresUsed,
      payorBreakdown: payorBreakdown
    });
  });

  // Sort by payout descending
  results.sort(function(a, b) { return b.settlement.payout - a.settlement.payout; });
  pStats.doctorsMatched = results.length;
  results.forEach(function(r) {
    if (r.settlement.mgmTriggered) pStats.mgmCount++;
    if (r.settlement.incentiveTriggered) pStats.incentiveCount++;
    r.billResults.forEach(function(br) { if (br.earning === 0 && !br.excluded) pStats.zeroBills++; });
  });
  calcResults = results;
  displayResults(results, pStats);
}

function displayResults(results, pStats) {
  document.getElementById('results').classList.remove('hidden');

  // Clear any previous pipeline/search elements
  var oldPipe = document.getElementById('pipelineSummary');
  if (oldPipe) oldPipe.remove();
  var oldSearch = document.getElementById('resultSearchWrap');
  if (oldSearch) oldSearch.remove();

  // Pipeline summary
  if (pStats) {
    var pipeHtml = '<div id="pipelineSummary" class="card" style="padding:12px 20px;margin-bottom:16px;background:linear-gradient(135deg,#ebf4ff,#f7fafc);border-left:4px solid #2b6cb0">' +
      '<div style="font-size:12px;font-weight:700;color:#1a365d;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Pipeline Summary</div>' +
      '<div style="display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:#4a5568">' +
      '<span>L1: <strong>' + pStats.rows + '</strong> rows</span>' +
      '<span>\\u2192 L2: <strong>' + pStats.bills + '</strong> bills</span>' +
      '<span>\\u2192 L3: <strong>' + pStats.doctorsMatched + '</strong> doctors' + (pStats.doctorsFlagged > 0 ? ', <span style="color:#c53030">' + pStats.doctorsFlagged + ' flagged</span>' : '') + '</span>' +
      '<span>\\u2192 L4: ' + (pStats.mgmCount > 0 ? '<span style="color:#ed8936">' + pStats.mgmCount + ' MGM</span> ' : '') + (pStats.incentiveCount > 0 ? '<span style="color:#48bb78">' + pStats.incentiveCount + ' Incentive</span>' : '') + (pStats.mgmCount === 0 && pStats.incentiveCount === 0 ? 'No triggers' : '') + '</span>' +
      (pStats.zeroBills > 0 ? '<span>\\u26A0 <span style="color:#ed8936">' + pStats.zeroBills + ' zero-earning bills</span></span>' : '') +
      '</div></div>';
    document.getElementById('resultStats').insertAdjacentHTML('beforebegin', pipeHtml);
  }

  // Search box
  var searchWrap = '<div id="resultSearchWrap" style="margin-bottom:12px"><input type="text" id="resultSearch" placeholder="Search doctors, patients, bill numbers..." style="width:100%;padding:10px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px" oninput="filterResultCards(this.value)"></div>';
  document.getElementById('resultStats').insertAdjacentHTML('afterend', searchWrap);

  var totalPayout = 0, totalPool = 0, totalBills = 0, flagCount = allFlags.length;
  var hospitalShortfall = 0, totalTds = 0, totalNet = 0;
  results.forEach(function(r) {
    totalPayout += r.settlement.payout;
    totalPool += r.settlement.pool;
    totalBills += r.billResults.length;
    flagCount += r.billFlags.length;
    totalTds += r.settlement.tdsAmount;
    totalNet += r.settlement.netPayout;
    if (r.settlement.mgmTriggered) hospitalShortfall += (r.settlement.payout - r.settlement.pool);
  });

  document.getElementById('resultStats').innerHTML =
    '<div class="stat-card"><div class="label">Doctors</div><div class="value">' + results.length + '</div></div>' +
    '<div class="stat-card"><div class="label">Total Bills</div><div class="value">' + totalBills + '</div></div>' +
    '<div class="stat-card"><div class="label">Total Prof Fee Pool</div><div class="value" style="color:#2b6cb0">' + fmtRs(totalPool) + '</div><div class="sub">Actual earnings from bills</div></div>' +
    '<div class="stat-card"><div class="label">Gross Payout</div><div class="value">' + fmtRs(totalPayout) + '</div><div class="sub">After MGM/settlement</div></div>' +
    '<div class="stat-card"><div class="label">Total TDS</div><div class="value" style="color:#c53030">' + fmtRs(totalTds) + '</div><div class="sub">Deducted at source</div></div>' +
    '<div class="stat-card"><div class="label">Net Payout</div><div class="value" style="color:#276749">' + fmtRs(totalNet) + '</div><div class="sub">Amount to doctor</div></div>' +
    (hospitalShortfall > 0 ? '<div class="stat-card"><div class="label">Hospital MGM Shortfall</div><div class="value" style="color:#c53030">' + fmtRs(hospitalShortfall) + '</div></div>' : '') +
    '<div class="stat-card"><div class="label">Flags</div><div class="value" style="color:' + (flagCount > 0 ? '#c53030' : '#276749') + '">' + flagCount + '</div></div>';

  var html = '';
  results.forEach(function(r, idx) {
    var doc = r.doctor;
    var s = r.settlement;
    var ct = r.contract ? r.contract.contract_type : '\\u2014';
    var cardClass = 'card result-card';
    if (s.mgmTriggered) cardClass += ' mgm-triggered';
    if (s.incentiveTriggered) cardClass += ' incentive-triggered';

    var triggers = '';
    if (s.mgmTriggered) triggers += '<span class="trigger-badge trigger-mgm">MGM Triggered (shortfall: ' + fmtRs(s.payout - s.pool) + ')</span>';
    if (s.incentiveTriggered) triggers += '<span class="trigger-badge trigger-incentive">Incentive: ' + fmtRs(s.incentiveAmount) + '</span>';

    // Centre badges
    var centreBadges = '';
    if (r.centresUsed) {
      Object.keys(r.centresUsed).forEach(function(c) {
        centreBadges += '<span class="badge badge-active" style="margin-left:4px">' + c + ' (' + r.centresUsed[c] + ')</span>';
      });
    }
    if (Object.keys(r.centresUsed || {}).length > 1) {
      centreBadges += '<span class="badge" style="background:#fed7d7;color:#c53030;margin-left:4px">Multi-Centre</span>';
    }

    // Payor breakdown mini-bar
    var pb = r.payorBreakdown || {};
    var pbParts = [];
    if (pb.CASH > 0) pbParts.push('CASH: ' + fmtRs(pb.CASH));
    if (pb.TPA > 0) pbParts.push('TPA: ' + fmtRs(pb.TPA));
    if (pb.PMJAY > 0) pbParts.push('PMJAY: ' + fmtRs(pb.PMJAY));
    if (pb.Govt > 0) pbParts.push('Govt: ' + fmtRs(pb.Govt));
    if (pb.OPD > 0) pbParts.push('OPD: ' + fmtRs(pb.OPD));
    var payorLine = pbParts.length > 0 ? '<div style="font-size:12px;color:#718096;margin-top:4px">' + pbParts.join(' | ') + '</div>' : '';

    html += '<div class="' + cardClass + '">' +
      '<div class="card-header collapsible" onclick="toggleCollapse(' + idx + ')">' +
        '<div style="flex:1">' +
          '<div class="card-title">' + (doc ? doc.display_name || doc.name : 'Unknown') + ' <span class="badge ' + badgeClass(ct) + '">' + ct + '</span>' + centreBadges + triggers + '</div>' +
          '<div class="pool-amount" style="margin-top:4px">Pool: <strong>' + fmtRs(s.pool) + '</strong>' + (s.pmjayPool > 0 ? ' (PMJAY: ' + fmtRs(s.pmjayPool) + ')' : '') + ' \\u2192 Gross: <strong>' + fmtRs(s.payout) + '</strong> \\u2212 TDS ' + s.tdsRate + '%: ' + fmtRs(s.tdsAmount) + ' = <strong style="color:#276749">' + fmtRs(s.netPayout) + '</strong></div>' +
          payorLine +
        '</div>' +
        '<div class="payout-amount">' + fmtRs(s.netPayout) + '<div style="font-size:11px;color:#718096;font-weight:400">Net of TDS</div></div>' +
      '</div>' +
      '<div class="collapsible-content" id="collapse_' + idx + '">' +
        buildPoolSummary(r) +
        '<div style="margin-bottom:12px;display:flex;gap:8px;align-items:center">' +
          '<button class="btn btn-outline btn-sm" onclick="overrideSettlement(' + idx + ')" title="Override gross payout">\\u270E Override Payout</button>' +
          (r.settlement.overridePayout != null ? '<span style="font-size:12px;color:#6b46c1">Payout overridden to ' + fmtRs(r.settlement.overridePayout) + (r.settlement.overrideReason ? ' — ' + r.settlement.overrideReason : '') + '</span>' : '') +
        '</div>' +
        buildBillTable(r.billResults, idx) +
        (r.billFlags.length > 0 ? '<div class="flag-card card" style="margin-top:12px"><h3 style="color:#c53030">Flagged Bills (' + r.billFlags.length + ')</h3>' + buildFlagTable(r.billFlags) + '</div>' : '') +
      '</div>' +
    '</div>';
  });

  // Unresolved flags (unknown doctors)
  if (allFlags.length > 0) {
    html += '<div class="flag-card card"><h3 style="color:#c53030">Unresolved Flags \\u2014 Unknown Doctors (' + allFlags.length + ')</h3><table><thead><tr><th>Bill No</th><th>Patient</th><th>Doctor (eCW)</th><th>Reason</th></tr></thead><tbody>';
    allFlags.forEach(function(f) {
      html += '<tr><td>' + f.bill.billNo + '</td><td>' + f.bill.patientName + '</td><td>' + f.bill.consultDoctor + '</td><td><span class="flag-badge">' + f.reason + '</span></td></tr>';
    });
    html += '</tbody></table></div>';
  }

  document.getElementById('resultCards').innerHTML = html;

  // Update flags tab with auto-alias mapping
  var flagsHtml = '';
  if (allFlags.length > 0) {
    // Group by unique unknown doctor name
    var unknownDocs = {};
    allFlags.forEach(function(f) {
      var name = f.bill.consultDoctor;
      if (!unknownDocs[name]) unknownDocs[name] = { name: name, count: 0 };
      unknownDocs[name].count++;
    });
    var unknownList = Object.values(unknownDocs).sort(function(a, b) { return b.count - a.count; });

    var docOptions = '<option value="">— Skip —</option><option value="__new__" style="color:#2b6cb0;font-weight:600">+ Create New Doctor</option>';
    DOC_DATA.doctors.forEach(function(d) {
      docOptions += '<option value="' + d.id + '">' + (d.display_name || d.name) + '</option>';
    });

    flagsHtml = '<p style="margin-bottom:12px;font-size:14px"><strong>' + unknownList.length + ' unknown doctor name(s)</strong> found in ' + allFlags.length + ' bills. Map to existing or create new.</p>';
    flagsHtml += '<div id="aliasMapRows">';
    unknownList.forEach(function(u, i) {
      flagsHtml += '<div class="alias-map-row" style="margin-bottom:8px;padding:8px 12px;background:#f7fafc;border-radius:6px" data-idx="' + i + '">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 60px;gap:8px;align-items:center">' +
        '<div><strong>' + u.name + '</strong><span style="color:#a0aec0;font-size:12px;margin-left:8px">(' + u.count + ' bills)</span></div>' +
        '<select class="alias-map-select" data-ecw-name="' + u.name.replace(/"/g, '&quot;') + '" onchange="onAliasDdChange(this,' + i + ')" style="padding:8px;border:1px solid #e2e8f0;border-radius:6px">' + docOptions + '</select>' +
        '<span class="alias-map-status" style="font-size:12px;color:#a0aec0">—</span>' +
        '</div>' +
        '<div id="quickAdd_' + i + '" class="hidden" style="margin-top:8px;padding:12px;background:#ebf4ff;border-radius:6px">' +
          '<div style="font-size:12px;font-weight:600;color:#1a365d;margin-bottom:8px">Quick Add Doctor</div>' +
          '<div class="form-row" style="gap:8px">' +
            '<div class="form-group" style="margin:0"><label style="font-size:11px">Name (pre-filled)</label><input type="text" class="qa-name" value="' + u.name.replace(/"/g, '&quot;') + '" style="padding:6px 8px;font-size:13px"></div>' +
            '<div class="form-group" style="margin:0"><label style="font-size:11px">Contract Type</label><select class="qa-ctype" style="padding:6px 8px;font-size:13px"><option value="FFS">FFS</option><option value="MGM">MGM</option><option value="Retainer">Retainer</option><option value="Salary">Salary</option><option value="Throughput">Throughput</option></select></div>' +
            '<div class="form-group" style="margin:0"><label style="font-size:11px">Cash/TPA Method</label><select class="qa-method" style="padding:6px 8px;font-size:13px"><option value="A">A — Doctor Amt</option><option value="B">B — Net minus Rad/Path/Pharma</option><option value="na">na</option></select></div>' +
            '<div class="form-group" style="margin:0"><label style="font-size:11px">Self %</label><input type="number" class="qa-self" value="100" style="padding:6px 8px;font-size:13px;width:70px"></div>' +
            '<div class="form-group" style="margin:0"><label style="font-size:11px">Other %</label><input type="number" class="qa-other" value="80" style="padding:6px 8px;font-size:13px;width:70px"></div>' +
          '</div>' +
          '<div style="margin-top:8px;text-align:right"><button class="btn btn-primary btn-sm" onclick="quickAddDoctor(' + i + ')">Create & Map</button></div>' +
        '</div>' +
        '</div>';
    });
    flagsHtml += '</div>';
    flagsHtml += '<div style="margin-top:16px;display:flex;gap:8px"><button class="btn btn-primary" onclick="saveAliasesAndReprocess()">Save Aliases & Re-process</button><button class="btn btn-outline" onclick="saveAliasesOnly()">Save Aliases Only</button></div>';
  } else if (flagCount > 0) {
    flagsHtml = '<p style="color:#ed8936">' + flagCount + ' flagged bills (contract issues). Check individual doctor cards.</p>';
  } else {
    flagsHtml = '<p style="color:#48bb78">No flags. All bills processed cleanly.</p>';
  }
  document.getElementById('flagsList').innerHTML = flagsHtml;
}

function buildPoolSummary(r) {
  var s = r.settlement;
  var c = r.contract;
  var pb = r.payorBreakdown || {};
  var h = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px;padding:12px;background:#f7fafc;border-radius:8px">';

  h += '<div><div style="font-size:11px;color:#718096;font-weight:600">TOTAL POOL</div><div style="font-size:18px;font-weight:700;color:#2b6cb0">' + fmtRs(s.pool) + '</div></div>';

  if (pb.CASH > 0) h += '<div><div style="font-size:11px;color:#718096">CASH</div><div style="font-size:14px;font-weight:600">' + fmtRs(pb.CASH) + '</div></div>';
  if (pb.TPA > 0) h += '<div><div style="font-size:11px;color:#718096">TPA</div><div style="font-size:14px;font-weight:600">' + fmtRs(pb.TPA) + '</div></div>';
  if (pb.PMJAY > 0) h += '<div><div style="font-size:11px;color:#718096">PMJAY</div><div style="font-size:14px;font-weight:600">' + fmtRs(pb.PMJAY) + '</div></div>';
  if (pb.Govt > 0) h += '<div><div style="font-size:11px;color:#718096">GOVT</div><div style="font-size:14px;font-weight:600">' + fmtRs(pb.Govt) + '</div></div>';
  if (pb.OPD > 0) h += '<div><div style="font-size:11px;color:#718096">OPD</div><div style="font-size:14px;font-weight:600">' + fmtRs(pb.OPD) + '</div></div>';

  h += '<div><div style="font-size:11px;color:#718096;font-weight:600">GROSS PAYOUT</div><div style="font-size:18px;font-weight:700">' + fmtRs(s.payout) + '</div></div>';
  h += '<div><div style="font-size:11px;color:#c53030;font-weight:600">TDS @ ' + s.tdsRate + '%</div><div style="font-size:14px;font-weight:700;color:#c53030">-' + fmtRs(s.tdsAmount) + '</div></div>';
  h += '<div><div style="font-size:11px;color:#276749;font-weight:600">NET PAYOUT</div><div style="font-size:18px;font-weight:700;color:#276749">' + fmtRs(s.netPayout) + '</div></div>';

  if (c && c.contract_type === 'MGM') {
    h += '<div><div style="font-size:11px;color:#718096">MGM Floor</div><div style="font-size:14px;font-weight:600">' + fmtRs(c.mgm_amount) + '</div></div>';
    h += '<div><div style="font-size:11px;color:#718096">Threshold</div><div style="font-size:14px;font-weight:600">' + fmtRs(c.threshold_amount) + '</div></div>';
    if (s.mgmTriggered) {
      h += '<div><div style="font-size:11px;color:#c53030;font-weight:600">SHORTFALL</div><div style="font-size:14px;font-weight:700;color:#c53030">' + fmtRs(s.payout - s.pool) + '</div></div>';
    }
    if (s.incentiveTriggered) {
      h += '<div><div style="font-size:11px;color:#276749;font-weight:600">INCENTIVE</div><div style="font-size:14px;font-weight:700;color:#276749">' + fmtRs(s.incentiveAmount) + '</div></div>';
    }
  }

  h += '</div>';
  return h;
}

function badgeClass(type) {
  var map = { MGM: 'badge-mgm', FFS: 'badge-ffs', Retainer: 'badge-retainer', Salary: 'badge-salary', Throughput: 'badge-throughput', ReverseBilling: 'badge-rb' };
  return map[type] || 'badge-mgm';
}

function toggleCollapse(idx) {
  var el = document.getElementById('collapse_' + idx);
  if (el) el.classList.toggle('open');
}

function buildBillTable(billResults, docIdx) {
  var h = '<table style="font-size:13px" id="billTable_' + docIdx + '"><thead><tr><th style="width:30px">Inc.</th><th>Bill No</th><th>Date</th><th>Patient</th><th>Centre</th><th>Payor</th><th>Method</th><th>Split</th><th style="text-align:right">Earning</th><th style="width:40px"></th></tr></thead><tbody>';
  billResults.forEach(function(br, bIdx) {
    var isExcluded = br.excluded;
    var isOverridden = br.originalEarning != null && br.originalEarning !== br.earning;
    var rowStyle = isExcluded ? ' style="opacity:0.4;text-decoration:line-through;background:#f7fafc"' : (br.flagged ? ' style="background:#fff5f5"' : (isOverridden ? ' style="background:#fffff0"' : ''));
    var earningDisplay = fmtRs(br.earning);
    if (isOverridden && !isExcluded) {
      earningDisplay = '<span style="text-decoration:line-through;color:#a0aec0;font-size:11px">' + fmtRs(br.originalEarning) + '</span> ' + fmtRs(br.earning);
    }
    h += '<tr' + rowStyle + '>' +
      '<td><input type="checkbox" ' + (isExcluded ? '' : 'checked') + ' onchange="toggleExclude(' + docIdx + ',' + bIdx + ',this.checked)" title="Include in pool"></td>' +
      '<td>' + br.bill.billNo + '</td>' +
      '<td>' + fmtDate(br.bill.billDate) + '</td>' +
      '<td>' + br.bill.patientName + '</td>' +
      '<td><span class="badge badge-active" style="font-size:11px">' + (br.centre || '') + '</span></td>' +
      '<td>' + br.payor + '</td>' +
      '<td>' + br.baseMethod + (br.pkgOverride ? ' <span class="flag-badge" style="background:#ebf4ff;color:#2b6cb0">PKG</span>' : '') + '</td>' +
      '<td>' + br.splitPct + '%' + (br.selfRef ? '(S)' : '') + '</td>' +
      '<td style="text-align:right;font-weight:600">' + earningDisplay + '</td>' +
      '<td><button class="btn btn-outline btn-sm" style="padding:2px 6px;font-size:11px" onclick="editBillEarning(' + docIdx + ',' + bIdx + ')" title="Override earning">\\u270E</button>' +
      '<button class="btn btn-outline btn-sm" style="padding:2px 6px;font-size:11px;margin-left:2px" onclick="showBillDetail(' + docIdx + ',' + bIdx + ')" title="Calculation detail">?</button></td>' +
      '</tr>';
    if (br.overrideReason) h += '<tr' + (isExcluded ? ' style="opacity:0.4"' : '') + '><td colspan="10" style="font-size:11px;color:#6b46c1;padding:2px 8px">Override: ' + br.overrideReason + '</td></tr>';
    if (br.flagged && !isExcluded) h += '<tr style="background:#fff5f5"><td colspan="10" style="color:#c53030;font-size:12px">\\u26A0 ' + br.flagReason + '</td></tr>';
  });
  h += '</tbody></table>';
  return h;
}

function buildFlagTable(flags) {
  var h = '<table style="font-size:13px"><thead><tr><th>Bill No</th><th>Patient</th><th>Reason</th></tr></thead><tbody>';
  flags.forEach(function(f) {
    h += '<tr><td>' + f.bill.billNo + '</td><td>' + f.bill.patientName + '</td><td>' + f.flagReason + '</td></tr>';
  });
  h += '</tbody></table>';
  return h;
}

// ============ MANUAL ENTRY ============
function addManualRow() {
  var row = {
    department: document.getElementById('m_dept').value.trim(),
    serviceName: document.getElementById('m_servicename').value.trim(),
    doctorAmt: parseFloat(document.getElementById('m_doctoramt').value) || 0,
    serviceAmt: parseFloat(document.getElementById('m_serviceamt').value) || 0,
    netAmt: parseFloat(document.getElementById('m_netamt').value) || 0
  };
  manualBillRows.push(row);
  var container = document.getElementById('manualRows');
  container.innerHTML = '<table style="font-size:13px"><thead><tr><th>Dept</th><th>Service</th><th>Dr Amt</th><th>Svc Amt</th><th>Net</th></tr></thead><tbody>' +
    manualBillRows.map(function(r) { return '<tr><td>' + r.department + '</td><td>' + r.serviceName + '</td><td>' + fmtRs(r.doctorAmt) + '</td><td>' + fmtRs(r.serviceAmt) + '</td><td>' + fmtRs(r.netAmt) + '</td></tr>'; }).join('') +
    '</tbody></table>';
  // Clear input fields
  document.getElementById('m_dept').value = '';
  document.getElementById('m_servicename').value = '';
  document.getElementById('m_doctoramt').value = '';
  document.getElementById('m_serviceamt').value = '';
  document.getElementById('m_netamt').value = '';
}

function processManualBill() {
  var bill = {
    billNo: document.getElementById('m_billno').value.trim(),
    billDate: document.getElementById('m_billdate').value,
    patientName: document.getElementById('m_patient').value.trim(),
    consultDoctor: document.getElementById('m_doctor').value.trim(),
    refDoctor: document.getElementById('m_refdoctor').value.trim(),
    sponsor: document.getElementById('m_sponsor').value.trim(),
    ipOp: document.getElementById('m_ipop').value,
    rows: manualBillRows.length > 0 ? manualBillRows : [{
      department: document.getElementById('m_dept').value.trim() || 'IPD Consultation',
      serviceName: document.getElementById('m_servicename').value.trim(),
      doctorAmt: parseFloat(document.getElementById('m_doctoramt').value) || 0,
      serviceAmt: parseFloat(document.getElementById('m_serviceamt').value) || 0,
      netAmt: parseFloat(document.getElementById('m_netamt').value) || 0
    }]
  };

  if (!bill.billNo || !bill.consultDoctor) { alert('Bill No and Doctor are required'); return; }

  var docId = resolveDoctorId(bill.consultDoctor);
  if (!docId) { alert('Unknown doctor: ' + bill.consultDoctor + '. Add them first or create an alias.'); return; }

  var doc = getDoctorById(docId);
  var contract = DOC_DATA.contractMap[docId] || null;
  var packages = DOC_DATA.packageMap[docId] || [];

  var br = calcBillEarning(bill, contract, packages);
  br.bill = bill;
  br.centre = 'Manual';

  var payorBreakdown = { CASH: 0, TPA: 0, PMJAY: 0, Govt: 0, OPD: 0 };
  if (br.baseMethod.indexOf('OPD') === 0) { payorBreakdown.OPD = br.earning; }
  else { payorBreakdown[br.payor] = br.earning; }

  var settlement = calcSettlement(docId, [br], contract);
  calcResults = [{ docId: docId, doctor: doc, contract: contract, billResults: [br], billFlags: br.flagged ? [br] : [], settlement: settlement, centresUsed: { Manual: 1 }, payorBreakdown: payorBreakdown }];
  allFlags = [];
  displayResults(calcResults);
  manualBillRows = [];
  document.getElementById('manualRows').innerHTML = '';
}

// ============ EXPORT CSV ============
function exportResultsCSV() {
  if (!calcResults) return;
  var lines = ['Doctor,Contract Type,Prof Fee Pool,CASH Pool,TPA Pool,PMJAY Pool,Govt Pool,OPD Pool,Final Payout,MGM Triggered,Incentive Triggered,Incentive Amt,Shortfall,Centres'];
  calcResults.forEach(function(r) {
    var doc = r.doctor;
    var s = r.settlement;
    var pb = r.payorBreakdown || {};
    var centres = Object.keys(r.centresUsed || {}).join('+');
    var shortfall = s.mgmTriggered ? (s.payout - s.pool) : 0;
    lines.push([
      '"' + (doc ? doc.name : 'Unknown') + '"',
      r.contract ? r.contract.contract_type : '',
      s.pool.toFixed(2),
      (pb.CASH || 0).toFixed(2),
      (pb.TPA || 0).toFixed(2),
      (pb.PMJAY || 0).toFixed(2),
      (pb.Govt || 0).toFixed(2),
      (pb.OPD || 0).toFixed(2),
      s.payout.toFixed(2),
      s.mgmTriggered ? 'Yes' : 'No',
      s.incentiveTriggered ? 'Yes' : 'No',
      s.incentiveAmount.toFixed(2),
      shortfall.toFixed(2),
      centres
    ].join(','));
  });
  var blob = new Blob([lines.join('\\n')], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'medpay_' + document.getElementById('calc_month').value + '.csv';
  a.click();
}

// ============ SEARCH FILTER ============
function filterResultCards(query) {
  var q = query.toLowerCase();
  document.querySelectorAll('.result-card').forEach(function(card) {
    var text = card.textContent.toLowerCase();
    card.style.display = (!q || text.indexOf(q) >= 0) ? '' : 'none';
  });
}

// ============ BILL CALCULATION DETAIL ============
function showBillDetail(docIdx, billIdx) {
  var br = calcResults[docIdx].billResults[billIdx];
  var contract = calcResults[docIdx].contract;
  var b = br.bill;
  var steps = [];
  steps.push('Bill: ' + b.billNo + ' | Patient: ' + b.patientName);
  steps.push('Sponsor: ' + (b.sponsor || 'CASH/blank') + ' \\u2192 Payor: ' + br.payor);
  steps.push('IP/OP: ' + b.ipOp + ' | Self-ref: ' + (br.selfRef ? 'Yes' : 'No'));
  if (br.pkgOverride) {
    steps.push('\\u2714 Procedure package matched: "' + br.pkgName + '" \\u2192 Fixed fee: Rs. ' + Math.round(br.earning));
  } else if (br.baseMethod.indexOf('OPD') === 0) {
    var docAmt = b.rows.reduce(function(s, r) { return s + r.doctorAmt; }, 0);
    steps.push('OPD: Doctor Amt sum = Rs. ' + Math.round(docAmt));
    steps.push('OPD %: ' + br.splitPct + '% \\u2192 Earning = Rs. ' + Math.round(br.earning));
  } else {
    steps.push('Base method: ' + br.baseMethod);
    if (br.baseMethod === 'A') {
      var docAmt = b.rows.reduce(function(s, r) { return s + r.doctorAmt; }, 0);
      steps.push('Sum of Doctor Amt across ' + b.rows.length + ' rows = Rs. ' + Math.round(docAmt));
    } else if (br.baseMethod === 'B' || br.baseMethod === 'B_pct') {
      steps.push('Net Amt - (Rad+Path+Pharma+Lab) = Rs. ' + Math.round(br.baseAmount));
    } else if (br.baseMethod === 'C') {
      steps.push('IP PACKAGE Service Amt = Rs. ' + Math.round(br.baseAmount));
    }
    steps.push('Base amount: Rs. ' + Math.round(br.baseAmount));
    steps.push('Split: ' + br.splitPct + '% (' + (br.selfRef ? 'self-ref' : 'other-ref') + ')');
    steps.push('Earning: Rs. ' + Math.round(br.baseAmount) + ' \\u00D7 ' + br.splitPct + '% = Rs. ' + Math.round(br.earning));
  }
  if (br.originalEarning != null) steps.push('\\u270E Override: Rs. ' + Math.round(br.originalEarning) + ' \\u2192 Rs. ' + Math.round(br.earning) + ' (' + br.overrideReason + ')');
  if (br.excluded) steps.push('\\u2718 EXCLUDED: ' + br.overrideReason);
  alert(steps.join('\\n'));
}

// ============ BILL & SETTLEMENT OVERRIDES ============
function editBillEarning(docIdx, billIdx) {
  var br = calcResults[docIdx].billResults[billIdx];
  var current = br.earning;
  var newVal = prompt('Override earning for ' + br.bill.billNo + ' (' + br.bill.patientName + ')\\nCurrent: Rs. ' + Math.round(current) + '\\n\\nEnter new earning (Rs.):', Math.round(current));
  if (newVal === null) return;
  newVal = parseFloat(newVal);
  if (isNaN(newVal)) { alert('Invalid number'); return; }
  var reason = prompt('Reason for override (required):', br.overrideReason || '');
  if (!reason || !reason.trim()) { alert('Override reason is required'); return; }
  // Store original if first override
  if (br.originalEarning == null) br.originalEarning = current;
  br.earning = newVal;
  br.overrideReason = reason.trim();
  recalcDoctor(docIdx);
}

function toggleExclude(docIdx, billIdx, included) {
  var br = calcResults[docIdx].billResults[billIdx];
  if (!included) {
    var reason = prompt('Reason for excluding this bill:', br.overrideReason || '');
    if (!reason || !reason.trim()) { alert('Reason required to exclude a bill'); return; }
    br.excluded = true;
    br.overrideReason = reason.trim();
    if (br.originalEarning == null) br.originalEarning = br.earning;
  } else {
    br.excluded = false;
  }
  recalcDoctor(docIdx);
}

function overrideSettlement(docIdx) {
  var r = calcResults[docIdx];
  var s = r.settlement;
  var current = s.overridePayout != null ? s.overridePayout : s.payout;
  var newVal = prompt('Override gross payout for ' + (r.doctor ? r.doctor.display_name || r.doctor.name : 'Doctor') + '\\nCalculated: Rs. ' + Math.round(s.payout) + '\\n\\nEnter new gross payout (Rs.), or leave blank to remove override:', s.overridePayout != null ? Math.round(s.overridePayout) : '');
  if (newVal === null) return;
  if (newVal.trim() === '') {
    // Remove override
    s.overridePayout = null;
    s.overrideReason = null;
  } else {
    newVal = parseFloat(newVal);
    if (isNaN(newVal)) { alert('Invalid number'); return; }
    var reason = prompt('Reason for payout override (required):', s.overrideReason || '');
    if (!reason || !reason.trim()) { alert('Override reason is required'); return; }
    s.overridePayout = newVal;
    s.overrideReason = reason.trim();
  }
  recalcDoctor(docIdx);
}

function recalcDoctor(docIdx) {
  var r = calcResults[docIdx];
  var contract = r.contract;
  // Recalculate pool from non-excluded bills
  var pool = 0, pmjayPool = 0;
  var payorBreakdown = { CASH: 0, TPA: 0, PMJAY: 0, Govt: 0, OPD: 0 };
  r.billResults.forEach(function(br) {
    if (br.excluded) return;
    pool += br.earning;
    if (br.payor === 'PMJAY') pmjayPool += br.earning;
    if (br.baseMethod && br.baseMethod.indexOf('OPD') === 0) payorBreakdown.OPD += br.earning;
    else payorBreakdown[br.payor] = (payorBreakdown[br.payor] || 0) + br.earning;
  });
  r.payorBreakdown = payorBreakdown;

  // Recalculate settlement
  var newSettlement = calcSettlement(r.docId, r.billResults.filter(function(b) { return !b.excluded; }), contract);
  // Preserve overrides
  var overridePayout = r.settlement.overridePayout;
  var overrideReason = r.settlement.overrideReason;
  r.settlement = newSettlement;
  if (overridePayout != null) {
    r.settlement.overridePayout = overridePayout;
    r.settlement.overrideReason = overrideReason;
    r.settlement.payout = overridePayout;
    r.settlement.tdsAmount = overridePayout * (r.settlement.tdsRate / 100);
    r.settlement.netPayout = overridePayout - r.settlement.tdsAmount;
  }

  // Re-render — preserve which cards are open
  var openCards = {};
  document.querySelectorAll('.collapsible-content.open').forEach(function(el) {
    openCards[el.id] = true;
  });
  displayResults(calcResults);
  // Restore open state
  Object.keys(openCards).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('open');
  });
}

// ============ AUTO-ALIAS FROM FLAGS ============
function onAliasDdChange(sel, idx) {
  var panel = document.getElementById('quickAdd_' + idx);
  if (sel.value === '__new__') {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}

async function quickAddDoctor(idx) {
  var row = document.querySelector('.alias-map-row[data-idx="' + idx + '"]');
  var sel = row.querySelector('.alias-map-select');
  var ecwName = sel.getAttribute('data-ecw-name');
  var panel = document.getElementById('quickAdd_' + idx);
  var name = panel.querySelector('.qa-name').value.trim();
  var ctype = panel.querySelector('.qa-ctype').value;
  var method = panel.querySelector('.qa-method').value;
  var selfPct = parseFloat(panel.querySelector('.qa-self').value) || 100;
  var otherPct = parseFloat(panel.querySelector('.qa-other').value) || 80;

  if (!name) { alert('Doctor name is required'); return; }

  var payload = {
    doctor: { name: name, display_name: name, pin: null },
    contract: {
      contract_type: ctype,
      mgm_amount: null, threshold_amount: null, incentive_pct: null, retainer_pool_pct: null,
      cash_base_method: method, cash_b_pct: null, cash_self_pct: selfPct, cash_other_pct: otherPct,
      tpa_base_method: method, tpa_b_pct: null, tpa_self_pct: selfPct, tpa_other_pct: otherPct,
      pmjay_base_method: 'na', pmjay_pct: null, pmjay_in_mgm_pool: 0,
      govt_base_method: method, govt_b_pct: null, govt_self_pct: 100, govt_other_pct: 100,
      opd_non_govt_pct: selfPct, opd_govt_pct: 100,
      tds_rate: 10, rb_hospital_fixed: null, rb_includes_robotic: 0,
      notes: 'Quick-added from calculator flags', effective_date: null
    },
    packages: [],
    aliases: [ecwName],
    centres: []
  };

  try {
    var r = await fetch('/api/doctors', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (r.ok) {
      var result = await r.json();
      var newId = result.id;
      // Add to local data so re-process works
      DOC_DATA.doctors.push({ id: newId, name: name, display_name: name, active: 1 });
      DOC_DATA.contractMap[newId] = payload.contract;
      var norm = ecwName.toLowerCase().replace(/\\./g, '').replace(/\\s+/g, ' ').trim().replace(/\\s*health\\s*one\\s*team$/i, '').replace(/\\s*healthone\\s*team$/i, '').replace(/\\s*healthone$/i, '').replace(/\\s*health\\s*one$/i, '').trim();
      DOC_DATA.aliasMap[norm] = newId;

      // Update dropdown to show the new doctor selected
      var newOption = document.createElement('option');
      newOption.value = newId;
      newOption.textContent = name;
      sel.insertBefore(newOption, sel.querySelector('option:nth-child(3)'));
      sel.value = newId;
      panel.classList.add('hidden');

      var statusEl = row.querySelector('.alias-map-status');
      statusEl.textContent = '\\u2713 Created #' + newId;
      statusEl.style.color = '#276749';
    } else {
      var err = await r.text();
      alert('Error creating doctor: ' + err);
    }
  } catch(ex) {
    alert('Network error: ' + ex.message);
  }
}

async function saveAliasesOnly() {
  var selects = document.querySelectorAll('.alias-map-select');
  var saved = 0, errors = 0, skipped = 0;
  for (var i = 0; i < selects.length; i++) {
    var sel = selects[i];
    var docId = sel.value;
    var ecwName = sel.getAttribute('data-ecw-name');
    var row = sel.closest('.alias-map-row');
    var statusEl = row ? row.querySelector('.alias-map-status') : sel.parentElement.querySelector('.alias-map-status');
    // Skip empty, __new__ (handled by quickAdd), and already-created
    if (!docId || docId === '__new__') { if (statusEl && statusEl.textContent.indexOf('Created') < 0) { statusEl.textContent = 'Skipped'; statusEl.style.color = '#a0aec0'; } skipped++; continue; }
    // Skip if already saved in this round (quick-add sets status to Created)
    if (statusEl && statusEl.textContent.indexOf('Created') >= 0) { skipped++; continue; }
    try {
      var r = await fetch('/api/aliases', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ alias: ecwName, doctor_id: parseInt(docId) }) });
      if (r.ok) {
        saved++;
        statusEl.textContent = '\\u2713 Saved';
        statusEl.style.color = '#276749';
        var norm = ecwName.toLowerCase().replace(/\\./g, '').replace(/\\s+/g, ' ').trim().replace(/\\s*health\\s*one\\s*team$/i, '').replace(/\\s*healthone\\s*team$/i, '').replace(/\\s*healthone$/i, '').replace(/\\s*health\\s*one$/i, '').trim();
        DOC_DATA.aliasMap[norm] = parseInt(docId);
      } else {
        errors++;
        var errText = await r.text();
        statusEl.textContent = '\\u2717 ' + (errText.indexOf('duplicate') >= 0 ? 'Exists' : 'Error');
        statusEl.style.color = errText.indexOf('duplicate') >= 0 ? '#ed8936' : '#c53030';
      }
    } catch(ex) {
      errors++;
      statusEl.textContent = '\\u2717 Failed';
      statusEl.style.color = '#c53030';
    }
  }
  toast(saved + ' alias(es) saved' + (errors > 0 ? ', ' + errors + ' error(s)' : ''));
}

async function saveAliasesAndReprocess() {
  await saveAliasesOnly();
  // Small delay then re-process
  setTimeout(function() { processCSV(); }, 500);
}

// ============ SAVE SETTLEMENTS ============
async function saveSettlements() {
  if (!calcResults || calcResults.length === 0) { alert('No results to save'); return; }
  var month = document.getElementById('calc_month').value;
  if (!month) { alert('Select month'); return; }

  var centresSummary = [];
  calcResults.forEach(function(r) {
    var centres = Object.keys(r.centresUsed || {});
    centres.forEach(function(c) { if (centresSummary.indexOf(c) < 0) centresSummary.push(c); });
  });

  // Check for existing settlements (duplicate detection)
  try {
    var checkUrl = '/api/settlements/check?month=' + month + '&centres=' + centresSummary.join(',') + '&doctor_ids=' + calcResults.map(function(r) { return r.docId; }).join(',');
    var checkResp = await fetch(checkUrl);
    if (checkResp.ok) {
      var existing = await checkResp.json();
      if (existing.length > 0) {
        var existNames = existing.map(function(e) { return e.doctor_name; }).join(', ');
        var action = confirm('Existing settlements found for ' + existing.length + ' doctor(s): ' + existNames + '\\n\\nClick OK to REPLACE them, or Cancel to abort.');
        if (!action) return;
        // Delete existing before saving
        for (var i = 0; i < existing.length; i++) {
          await fetch('/api/settlements/' + existing[i].id, { method: 'DELETE' });
        }
      }
    }
  } catch(e) { /* proceed anyway if check fails */ }

  if (!confirm('Save ' + calcResults.length + ' settlement(s) for ' + month + ' across ' + centresSummary.join(', ') + '?')) return;

  var payload = calcResults.map(function(r) {
    var primaryCentre = Object.keys(r.centresUsed || {})[0] || 'Unknown';
    return {
      doctor_id: r.docId,
      month: month,
      centre: primaryCentre,
      calculated_pool: r.settlement.pool,
      pmjay_pool: r.settlement.pmjayPool,
      final_payout: r.settlement.payout,
      mgm_triggered: r.settlement.mgmTriggered ? 1 : 0,
      incentive_triggered: r.settlement.incentiveTriggered ? 1 : 0,
      incentive_amount: r.settlement.incentiveAmount,
      tds_amount: r.settlement.tdsAmount,
      net_payout: r.settlement.netPayout,
      override_payout: r.settlement.overridePayout || null,
      override_reason: r.settlement.overrideReason || null,
      bills: r.billResults.map(function(br) {
        return {
          bill_no: br.bill.billNo,
          patient_name: br.bill.patientName,
          consulting_doctor: br.bill.consultDoctor,
          referring_doctor: br.bill.refDoctor,
          payor_type: br.payor,
          payor_raw: br.bill.sponsor,
          base_method: br.baseMethod,
          base_amount: br.baseAmount,
          self_ref: br.selfRef ? 1 : 0,
          split_pct: br.splitPct,
          doctor_earning: br.earning,
          original_earning: br.originalEarning || null,
          override_earning: (br.originalEarning != null && br.originalEarning !== br.earning) ? br.earning : null,
          override_reason: br.overrideReason || null,
          excluded: br.excluded ? 1 : 0,
          pkg_override: br.pkgOverride ? 1 : 0,
          pkg_name: br.pkgName,
          centre: br.centre || primaryCentre,
          bill_date: br.bill.billDate,
          flagged: br.flagged ? 1 : 0,
          flag_reason: br.flagReason
        };
      })
    };
  });

  try {
    var r = await fetch('/api/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (r.ok) {
      toast('Settlements saved successfully');
    } else {
      alert('Error saving: ' + (await r.text()));
    }
  } catch(ex) {
    alert('Network error: ' + ex.message);
  }
}
</script>`;

  return htmlShell('Calculator', 'calc', body, SCRIPT);
}

// ===================== PAGE: Settlements =====================
async function settlementsPage(env, searchParams) {
  const month = searchParams.get('month') || '';
  const centre = searchParams.get('centre') || '';
  const doctorId = searchParams.get('doctor_id') || '';

  let query = 'SELECT ms.*, d.name as doctor_name, d.display_name FROM monthly_settlements ms JOIN doctors d ON d.id = ms.doctor_id WHERE 1=1';
  const params = [];
  if (month) { query += ' AND ms.month = ?'; params.push(month); }
  if (centre) { query += ' AND ms.centre = ?'; params.push(centre); }
  if (doctorId) { query += ' AND ms.doctor_id = ?'; params.push(parseInt(doctorId)); }
  query += ' ORDER BY ms.month DESC, ms.centre, d.name LIMIT 200';

  let stmt = env.DB.prepare(query);
  if (params.length > 0) stmt = stmt.bind(...params);
  const settlements = (await stmt.all()).results || [];

  let rows = '';
  let pmtDataMap = {};
  for (const s of settlements) {
    const hasPmt = !!s.payment_utr;
    const st = s.status || (hasPmt ? 'paid' : (s.locked ? 'locked' : 'draft'));
    const statusBadges = {
      draft: '<span class="badge badge-inactive">Draft</span>',
      locked: '<span class="badge" style="background:#ebf4ff;color:#2b6cb0">Locked</span>',
      approved: '<span class="badge" style="background:#fefcbf;color:#975a16">Approved</span>',
      paid: '<span class="badge badge-active">Paid</span>'
    };
    const grossP = s.final_payout || 0;
    const tdsAmt = s.tds_amount || (grossP * 0.1);
    const netP = s.net_payout || (grossP - tdsAmt);
    pmtDataMap[s.id] = { utr: s.payment_utr||'', date: s.payment_date||'', bank: s.payment_bank||'', mode: s.payment_mode||'NEFT', amount: s.payment_amount || netP, gross: grossP, tdsAmt: tdsAmt };

    // Build action buttons based on status
    let actions = '<button class="btn btn-outline btn-sm" onclick="viewBills(' + s.id + ')">Bills</button>';
    if (st === 'draft') {
      actions += '<button class="btn btn-success btn-sm" onclick="lockSettlement(' + s.id + ')">Lock</button>';
      actions += '<button class="btn btn-danger btn-sm" onclick="deleteSettlement(' + s.id + ')">Delete</button>';
    } else if (st === 'locked') {
      actions += '<button class="btn btn-sm" style="background:#fefcbf;color:#975a16" onclick="approveSettlement(' + s.id + ')">Approve</button>';
      actions += '<button class="btn btn-outline btn-sm" onclick="unlockSettlement(' + s.id + ')">Unlock</button>';
    } else if (st === 'approved') {
      actions += `<button class="btn btn-sm" style="background:#ebf4ff;color:#2b6cb0" onclick="showPaymentModal(${s.id})">Record Payment</button>`;
      actions += '<button class="btn btn-outline btn-sm" onclick="unlockSettlement(' + s.id + ')">Revert</button>';
    } else if (st === 'paid') {
      actions += '<a href="/statement/' + s.id + '" target="_blank" class="btn btn-success btn-sm">Statement</a>';
      actions += `<button class="btn btn-sm" style="background:#ebf4ff;color:#2b6cb0" onclick="showPaymentModal(${s.id})">Edit Payment</button>`;
    }

    rows += `<tr>
      <td>${s.month}</td>
      <td>${s.centre}</td>
      <td style="font-weight:600">${s.display_name || s.doctor_name}</td>
      <td>${fmtRs(s.calculated_pool)}</td>
      <td style="font-weight:700;color:#276749">${fmtRs(netP)}</td>
      <td>${s.mgm_triggered ? '<span class="trigger-badge trigger-mgm">MGM</span>' : ''}${s.incentive_triggered ? '<span class="trigger-badge trigger-incentive">Incentive</span>' : ''}</td>
      <td>${statusBadges[st] || statusBadges.draft}${s.approved_by ? '<div style="font-size:10px;color:#718096">by ' + s.approved_by + '</div>' : ''}</td>
      <td><div class="btn-group">${actions}</div></td>
    </tr>`;
  }
  const pmtDataJson = JSON.stringify(pmtDataMap);

  const body = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div><h1>Settlements</h1><p class="subtitle" style="margin:0">Monthly settlement records — Draft → Lock → Approve → Pay</p></div>
      <a href="/payments/import" class="btn btn-primary">Batch Payment Import</a>
    </div>
    <div class="card">
      <div class="form-row" style="margin-bottom:16px">
        <div class="form-group"><label>Month</label><input type="month" id="filter_month" value="${month}" onchange="applyFilter()"></div>
        <div class="form-group"><label>Centre</label>
          <select id="filter_centre" onchange="applyFilter()">
            <option value="">All Centres</option>
            <option value="Shilaj" ${centre === 'Shilaj' ? 'selected' : ''}>Shilaj</option>
            <option value="Vastral" ${centre === 'Vastral' ? 'selected' : ''}>Vastral</option>
            <option value="Modasa" ${centre === 'Modasa' ? 'selected' : ''}>Modasa</option>
            <option value="Gandhinagar" ${centre === 'Gandhinagar' ? 'selected' : ''}>Gandhinagar</option>
            <option value="Udaipur" ${centre === 'Udaipur' ? 'selected' : ''}>Udaipur</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card" style="padding:0;overflow-x:auto">
      <table>
        <thead><tr><th class="sortable">Month</th><th class="sortable">Centre</th><th class="sortable">Doctor</th><th class="sortable">Pool</th><th class="sortable">Payout</th><th>Triggers</th><th class="sortable">Status</th><th>Actions</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="8" style="text-align:center;padding:24px;color:#a0aec0">No settlements found.</td></tr>'}</tbody>
      </table>
    </div>
    <div id="billModal" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:center;justify-content:center">
      <div class="card" style="max-width:900px;width:95%;max-height:80vh;overflow-y:auto">
        <div class="card-header"><div class="card-title">Bill Breakdown</div><button class="btn btn-outline btn-sm" onclick="closeBillModal()">Close</button></div>
        <div id="billModalContent"></div>
      </div>
    </div>
    <div id="paymentModal" class="hidden" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:center;justify-content:center">
      <div class="card" style="max-width:500px;width:95%">
        <div class="card-header"><div class="card-title">Record Payment</div><button class="btn btn-outline btn-sm" onclick="closePaymentModal()">Close</button></div>
        <div id="pmt_tds_info" style="background:#f7fafc;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px"></div>
        <input type="hidden" id="pmt_settlement_id">
        <div class="form-group"><label>UTR / Reference No. *</label><input type="text" id="pmt_utr" placeholder="e.g. AXISN12345678"></div>
        <div class="form-row">
          <div class="form-group"><label>Payment Date *</label><input type="date" id="pmt_date"></div>
          <div class="form-group"><label>Net Amount to Pay (Rs.) *</label><input type="number" id="pmt_amount" step="0.01"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Bank</label><input type="text" id="pmt_bank" placeholder="e.g. HDFC Bank"></div>
          <div class="form-group"><label>Mode</label>
            <select id="pmt_mode">
              <option value="NEFT">NEFT</option>
              <option value="RTGS">RTGS</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="savePayment()">Save Payment</button>
        </div>
      </div>
    </div>
  `;

  const script = `<script>
var PMT_DATA = ${pmtDataJson};

function applyFilter() {
  var m = document.getElementById('filter_month').value;
  var c = document.getElementById('filter_centre').value;
  var params = new URLSearchParams();
  if (m) params.set('month', m);
  if (c) params.set('centre', c);
  window.location.href = '/settlements' + (params.toString() ? '?' + params.toString() : '');
}

async function lockSettlement(id) {
  if (!confirm('Lock this settlement? It cannot be edited after locking.')) return;
  var r = await fetch('/api/settlements/' + id + '/lock', { method: 'PUT' });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}

async function unlockSettlement(id) {
  if (!confirm('Unlock this settlement?')) return;
  var r = await fetch('/api/settlements/' + id + '/unlock', { method: 'PUT' });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}

async function approveSettlement(id) {
  if (!confirm('Approve this settlement for payment?')) return;
  var r = await fetch('/api/settlements/' + id + '/approve', { method: 'PUT' });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}

async function deleteSettlement(id) {
  if (!confirm('Delete this settlement and all its bill records?')) return;
  var r = await fetch('/api/settlements/' + id, { method: 'DELETE' });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}

async function viewBills(settlementId) {
  var r = await fetch('/api/settlements/' + settlementId + '/bills');
  if (!r.ok) { alert('Error loading bills'); return; }
  var bills = await r.json();
  var html = '<table style="font-size:13px"><thead><tr><th>Bill No</th><th>Date</th><th>Patient</th><th>Doctor</th><th>Ref Doctor</th><th>Payor</th><th>Method</th><th>Base</th><th>Split</th><th>Earning</th></tr></thead><tbody>';
  bills.forEach(function(b) {
    html += '<tr' + (b.flagged ? ' style="background:#fff5f5"' : '') + '><td>' + b.bill_no + '</td><td>' + b.bill_date + '</td><td>' + b.patient_name + '</td><td>' + b.consulting_doctor + '</td><td>' + (b.referring_doctor || '\\u2014') + '</td><td>' + b.payor_type + '</td><td>' + b.base_method + '</td><td>Rs. ' + (b.base_amount || 0).toFixed(0) + '</td><td>' + (b.split_pct || 100) + '%</td><td style="font-weight:600">Rs. ' + (b.doctor_earning || 0).toFixed(0) + '</td></tr>';
    if (b.flagged) html += '<tr style="background:#fff5f5"><td colspan="10" style="color:#c53030;font-size:12px">\\u26A0 ' + (b.flag_reason || '') + '</td></tr>';
  });
  html += '</tbody></table>';
  document.getElementById('billModalContent').innerHTML = html;
  var modal = document.getElementById('billModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

function closeBillModal() {
  var modal = document.getElementById('billModal');
  modal.classList.add('hidden');
  modal.style.display = 'none';
}

function showPaymentModal(id) {
  var data = PMT_DATA[id] || {};
  document.getElementById('pmt_settlement_id').value = id;
  document.getElementById('pmt_utr').value = data.utr || '';
  document.getElementById('pmt_date').value = data.date || new Date().toISOString().slice(0,10);
  document.getElementById('pmt_bank').value = data.bank || '';
  document.getElementById('pmt_mode').value = data.mode || 'NEFT';
  document.getElementById('pmt_amount').value = data.amount || '';

  // TDS info
  var gross = data.gross || 0;
  var tds = data.tdsAmt || 0;
  var net = gross - tds;
  document.getElementById('pmt_tds_info').innerHTML = '<strong>Gross Payout:</strong> Rs. ' + Math.round(gross).toLocaleString('en-IN') + ' &nbsp;|&nbsp; <strong style="color:#c53030">TDS:</strong> - Rs. ' + Math.round(tds).toLocaleString('en-IN') + ' &nbsp;|&nbsp; <strong style="color:#276749">Net Payable:</strong> Rs. ' + Math.round(net).toLocaleString('en-IN');

  var modal = document.getElementById('paymentModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

function closePaymentModal() {
  var modal = document.getElementById('paymentModal');
  modal.classList.add('hidden');
  modal.style.display = 'none';
}

async function savePayment() {
  var id = document.getElementById('pmt_settlement_id').value;
  var utr = document.getElementById('pmt_utr').value.trim();
  var dt = document.getElementById('pmt_date').value;
  var amt = document.getElementById('pmt_amount').value;
  if (!utr || !dt || !amt) { alert('UTR, date and amount are required'); return; }
  var payload = {
    payment_utr: utr,
    payment_date: dt,
    payment_bank: document.getElementById('pmt_bank').value.trim(),
    payment_mode: document.getElementById('pmt_mode').value,
    payment_amount: parseFloat(amt)
  };
  var r = await fetch('/api/settlements/' + id + '/payment', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (r.ok) { closePaymentModal(); location.reload(); }
  else alert('Error: ' + (await r.text()));
}
</script>`;

  return htmlShell('Settlements', 'settlements', body, script);
}

// ===================== PAGE: Bulk Import =====================
async function bulkImportPage(env) {
  const doctors = (await env.DB.prepare('SELECT id, name, display_name FROM doctors ORDER BY name').all()).results || [];
  const docOpts = doctors.map(d => `<option value="${d.id}">${d.display_name || d.name}</option>`).join('');

  const body = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div><h1>Bulk Doctor Import</h1><p class="subtitle" style="margin:0">Import multiple doctors from CSV</p></div>
      <a href="/doctors" class="btn btn-outline">← Back</a>
    </div>
    <div class="card">
      <h3>Step 1 — Download Template</h3>
      <p style="font-size:13px;color:#718096;margin-bottom:12px">Download the CSV template, fill in doctor details, and upload below.</p>
      <button class="btn btn-primary btn-sm" onclick="downloadTemplate()">Download CSV Template</button>
    </div>
    <div class="card">
      <h3>Step 2 — Upload Filled CSV</h3>
      <div class="upload-zone" id="importDropZone" onclick="document.getElementById('importFile').click()" style="margin-top:12px">
        <input type="file" id="importFile" accept=".csv" style="display:none" onchange="handleImportFile(this.files[0])">
        <div style="font-size:36px;margin-bottom:8px">📋</div>
        <div style="font-size:16px;font-weight:600;color:#2d3748">Drop CSV here or click to browse</div>
      </div>
      <div id="importPreview" class="hidden" style="margin-top:16px"></div>
      <div id="importActions" class="hidden" style="margin-top:16px;text-align:right">
        <button class="btn btn-primary" onclick="executeImport()">Import All Doctors</button>
      </div>
    </div>
    <div id="importResults" class="hidden" style="margin-top:16px"></div>
  `;

  const script = `<script>
function downloadTemplate() {
  var headers = ['name','display_name','pin','centres','contract_type','mgm_amount','threshold_amount','incentive_pct','retainer_pool_pct','cash_base_method','cash_b_pct','cash_self_pct','cash_other_pct','tpa_base_method','tpa_b_pct','tpa_self_pct','tpa_other_pct','pmjay_base_method','pmjay_pct','pmjay_in_mgm_pool','govt_base_method','govt_b_pct','govt_self_pct','govt_other_pct','opd_non_govt_pct','opd_govt_pct','tds_rate','rb_hospital_fixed','rb_includes_robotic','effective_date','notes','aliases'];
  var example = ['Dr. Example Name','Dr. Example','2001','Shilaj','MGM','150000','225000','80','','A','','100','80','A','','100','80','na','','0','A','','100','100','80','100','10','','0','2026-01-01','Neurology specialist','dr example; dr example name'];
  var csv = headers.join(',') + '\\n' + example.join(',');
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'medpay_doctor_import_template.csv';
  a.click();
}

var importData = [];

function handleImportFile(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var lines = e.target.result.split('\\n');
    if (lines.length < 2) { alert('CSV must have header + at least 1 data row'); return; }
    var headers = lines[0].split(',').map(function(h) { return h.trim().replace(/"/g, ''); });
    importData = [];
    for (var i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      var cells = lines[i].split(',').map(function(c) { return c.trim().replace(/^"|"$/g, ''); });
      var row = {};
      headers.forEach(function(h, j) { row[h] = cells[j] || ''; });
      if (row.name) importData.push(row);
    }
    var preview = document.getElementById('importPreview');
    preview.classList.remove('hidden');
    preview.innerHTML = '<h3>' + importData.length + ' doctor(s) found</h3><table style="font-size:12px"><thead><tr><th>Name</th><th>Type</th><th>MGM</th><th>Centres</th><th>TDS</th></tr></thead><tbody>' +
      importData.map(function(r) { return '<tr><td>' + r.name + '</td><td>' + r.contract_type + '</td><td>' + (r.mgm_amount || '\\u2014') + '</td><td>' + (r.centres || '') + '</td><td>' + (r.tds_rate || '10') + '%</td></tr>'; }).join('') +
      '</tbody></table>';
    document.getElementById('importActions').classList.remove('hidden');
  };
  reader.readAsText(file);
}

async function executeImport() {
  if (importData.length === 0) return;
  var results = document.getElementById('importResults');
  results.classList.remove('hidden');
  results.innerHTML = '<div class="loader"></div> Importing...';
  var ok = 0, fail = 0, log = '';

  for (var i = 0; i < importData.length; i++) {
    var r = importData[i];
    var payload = {
      doctor: { name: r.name, display_name: r.display_name || null, pin: r.pin || null },
      contract: {
        contract_type: r.contract_type || 'FFS',
        mgm_amount: parseFloat(r.mgm_amount) || null,
        threshold_amount: parseFloat(r.threshold_amount) || null,
        incentive_pct: parseFloat(r.incentive_pct) || null,
        retainer_pool_pct: parseFloat(r.retainer_pool_pct) || null,
        cash_base_method: r.cash_base_method || null,
        cash_b_pct: parseFloat(r.cash_b_pct) || null,
        cash_self_pct: parseFloat(r.cash_self_pct) || null,
        cash_other_pct: parseFloat(r.cash_other_pct) || null,
        tpa_base_method: r.tpa_base_method || null,
        tpa_b_pct: parseFloat(r.tpa_b_pct) || null,
        tpa_self_pct: parseFloat(r.tpa_self_pct) || null,
        tpa_other_pct: parseFloat(r.tpa_other_pct) || null,
        pmjay_base_method: r.pmjay_base_method || null,
        pmjay_pct: parseFloat(r.pmjay_pct) || null,
        pmjay_in_mgm_pool: parseInt(r.pmjay_in_mgm_pool) || 0,
        govt_base_method: r.govt_base_method || null,
        govt_b_pct: parseFloat(r.govt_b_pct) || null,
        govt_self_pct: parseFloat(r.govt_self_pct) || null,
        govt_other_pct: parseFloat(r.govt_other_pct) || null,
        opd_non_govt_pct: parseFloat(r.opd_non_govt_pct) || null,
        opd_govt_pct: parseFloat(r.opd_govt_pct) || null,
        tds_rate: parseFloat(r.tds_rate) || 10,
        rb_hospital_fixed: parseFloat(r.rb_hospital_fixed) || null,
        rb_includes_robotic: parseInt(r.rb_includes_robotic) || 0,
        notes: r.notes || null,
        effective_date: r.effective_date || null
      },
      packages: [],
      aliases: r.aliases ? r.aliases.split(';').map(function(a) { return a.trim(); }).filter(Boolean) : [],
      centres: r.centres ? r.centres.split(';').map(function(c) { return c.trim(); }).filter(Boolean) : []
    };

    try {
      var resp = await fetch('/api/doctors', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (resp.ok) {
        ok++;
        log += '<tr style="color:#276749"><td>' + r.name + '</td><td>\\u2713 Created</td></tr>';
      } else {
        fail++;
        var err = await resp.text();
        log += '<tr style="color:#c53030"><td>' + r.name + '</td><td>\\u2717 ' + err.substring(0, 60) + '</td></tr>';
      }
    } catch(ex) {
      fail++;
      log += '<tr style="color:#c53030"><td>' + r.name + '</td><td>\\u2717 ' + ex.message + '</td></tr>';
    }
  }
  results.innerHTML = '<div class="card"><h3>Import Complete: ' + ok + ' created, ' + fail + ' failed</h3><table style="font-size:13px">' + log + '</table>' + (ok > 0 ? '<br><a href="/doctors" class="btn btn-primary btn-sm">View Doctors</a>' : '') + '</div>';
}
</script>`;

  return htmlShell('Bulk Import', 'doctors', body, script);
}

// ===================== PAGE: Month-End Dashboard =====================
async function monthEndPage(env) {
  const centres = ['Shilaj', 'Vastral', 'Modasa', 'Gandhinagar', 'Udaipur'];
  const now = new Date();

  // Get last 3 months
  const months = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }

  const allSettlements = (await env.DB.prepare('SELECT ms.*, d.name as doctor_name, d.display_name FROM monthly_settlements ms JOIN doctors d ON d.id = ms.doctor_id WHERE ms.month IN (?, ?, ?) ORDER BY ms.month DESC').bind(months[0], months[1], months[2]).all()).results || [];
  const totalDoctors = (await env.DB.prepare('SELECT COUNT(*) as cnt FROM doctors WHERE active = 1').first()).cnt || 0;

  // MoM comparison: current vs previous month per doctor
  let momAlerts = '';
  if (months.length >= 2) {
    const currMonth = months[0];
    const prevMonth = months[1];
    const currByDoc = {};
    const prevByDoc = {};
    allSettlements.forEach(s => {
      if (s.month === currMonth) currByDoc[s.doctor_id] = { pool: s.calculated_pool || 0, name: s.display_name || s.doctor_name, centre: s.centre };
      if (s.month === prevMonth) prevByDoc[s.doctor_id] = { pool: s.calculated_pool || 0, name: s.display_name || s.doctor_name, centre: s.centre };
    });

    let alerts = [];
    for (const docId of Object.keys(currByDoc)) {
      const curr = currByDoc[docId];
      const prev = prevByDoc[docId];
      if (!prev || prev.pool === 0) continue;
      const change = ((curr.pool - prev.pool) / prev.pool) * 100;
      if (Math.abs(change) >= 30) {
        alerts.push({ name: curr.name, centre: curr.centre, currPool: curr.pool, prevPool: prev.pool, changePct: change });
      }
    }
    // Doctors in prev but not curr
    for (const docId of Object.keys(prevByDoc)) {
      if (!currByDoc[docId]) {
        const prev = prevByDoc[docId];
        alerts.push({ name: prev.name, centre: prev.centre, currPool: 0, prevPool: prev.pool, changePct: -100, missing: true });
      }
    }

    if (alerts.length > 0) {
      alerts.sort((a, b) => a.changePct - b.changePct);
      momAlerts = `<div class="card flag-card" style="margin-bottom:24px">
        <div class="card-header"><div class="card-title" style="color:#c53030">MoM Anomaly Alerts (${alerts.length})</div></div>
        <p style="font-size:13px;color:#718096;margin-bottom:12px">Doctors with &gt;30% pool change between ${prevMonth} and ${currMonth}</p>
        <table style="font-size:13px">
          <thead><tr><th>Doctor</th><th>Centre</th><th style="text-align:right">${prevMonth}</th><th style="text-align:right">${currMonth}</th><th style="text-align:right">Change</th><th>Flag</th></tr></thead>
          <tbody>${alerts.map(a => {
            const color = a.changePct < 0 ? '#c53030' : '#276749';
            const flag = a.missing ? 'No data this month' : (a.changePct < -50 ? 'Major drop — check data' : (a.changePct < 0 ? 'Significant decline' : 'Significant spike'));
            return `<tr><td style="font-weight:600">${a.name}</td><td>${a.centre}</td><td style="text-align:right">${fmtRs(a.prevPool)}</td><td style="text-align:right">${fmtRs(a.currPool)}</td><td style="text-align:right;font-weight:600;color:${color}">${a.changePct > 0 ? '+' : ''}${a.changePct.toFixed(0)}%</td><td><span class="flag-badge">${flag}</span></td></tr>`;
          }).join('')}</tbody>
        </table>
      </div>`;
    }
  }

  let gridHtml = '';
  for (const month of months) {
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [y, m] = month.split('-');
    const label = monthNames[parseInt(m) - 1] + ' ' + y;

    let centreCards = '';
    for (const centre of centres) {
      const cs = allSettlements.filter(s => s.month === month && s.centre === centre);
      const getStatus = function(x) { return x.status || (x.payment_utr ? 'paid' : (x.locked ? 'locked' : 'draft')); };
      const drafted = cs.filter(s => getStatus(s) === 'draft').length;
      const locked = cs.filter(s => getStatus(s) === 'locked').length;
      const approved = cs.filter(s => getStatus(s) === 'approved').length;
      const paid = cs.filter(s => getStatus(s) === 'paid' || !!s.payment_utr).length;
      const totalPayout = cs.reduce((sum, s) => sum + (s.final_payout || 0), 0);
      const totalNet = cs.reduce((sum, s) => sum + (s.net_payout || s.final_payout * 0.9 || 0), 0);
      const total = cs.length;

      let statusColor = '#e2e8f0';
      if (total > 0 && paid === total) statusColor = '#48bb78';
      else if (approved > 0 || paid > 0) statusColor = '#ed8936';
      else if (locked > 0) statusColor = '#4299e1';
      else if (drafted > 0) statusColor = '#a0aec0';

      centreCards += `<div class="card" style="padding:16px;border-top:3px solid ${statusColor}">
        <div style="font-weight:700;font-size:14px;color:#1a365d">${centre}</div>
        <div style="font-size:22px;font-weight:700;color:#276749;margin:4px 0">${fmtRs(totalNet)}</div>
        <div style="font-size:12px;color:#718096">Gross: ${fmtRs(totalPayout)}</div>
        <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap">
          ${drafted > 0 ? `<span class="badge badge-inactive">${drafted} Draft</span>` : ''}
          ${locked > 0 ? `<span class="badge" style="background:#ebf4ff;color:#2b6cb0">${locked} Locked</span>` : ''}
          ${approved > 0 ? `<span class="badge" style="background:#fefcbf;color:#975a16">${approved} Approved</span>` : ''}
          ${paid > 0 ? `<span class="badge badge-active">${paid} Paid</span>` : ''}
          ${total === 0 ? `<span class="badge" style="background:#f0f0f0;color:#a0aec0">No data</span>` : ''}
        </div>
        <div style="font-size:11px;color:#a0aec0;margin-top:4px">${total} of ${totalDoctors} doctors</div>
      </div>`;
    }

    const monthTotal = allSettlements.filter(s => s.month === month);
    const monthGross = monthTotal.reduce((sum, s) => sum + (s.final_payout || 0), 0);
    const monthNet = monthTotal.reduce((sum, s) => sum + (s.net_payout || s.final_payout * 0.9 || 0), 0);
    const monthPaid = monthTotal.filter(s => !!s.payment_utr).length;

    gridHtml += `
      <div style="margin-bottom:32px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h2 style="margin:0">${label}</h2>
          <div style="font-size:14px;color:#4a5568">Gross: <strong>${fmtRs(monthGross)}</strong> | Net: <strong style="color:#276749">${fmtRs(monthNet)}</strong> | ${monthPaid}/${monthTotal.length} paid</div>
        </div>
        <div class="stat-grid" style="grid-template-columns:repeat(5,1fr)">${centreCards}</div>
      </div>`;
  }

  const body = `
    <h1>Month-End Dashboard</h1>
    <p class="subtitle">Settlement status across all centres</p>
    ${momAlerts}
    ${gridHtml}
  `;
  return htmlShell('Month-End', 'monthend', body);
}

// ===================== PAGE: Aliases =====================
async function aliasesPage(env) {
  const aliases = (await env.DB.prepare('SELECT da.*, d.name as doctor_name, d.display_name FROM doctor_aliases da JOIN doctors d ON d.id = da.doctor_id ORDER BY da.alias').all()).results || [];
  const doctors = (await env.DB.prepare('SELECT id, name, display_name FROM doctors WHERE active = 1 ORDER BY name').all()).results || [];

  let rows = '';
  for (const a of aliases) {
    rows += `<tr><td style="font-weight:600">${a.alias}</td><td>${a.display_name || a.doctor_name}</td><td><button class="btn btn-danger btn-sm" onclick="deleteAlias(${a.id})">Delete</button></td></tr>`;
  }

  const doctorOptions = doctors.map(d => `<option value="${d.id}">${d.display_name || d.name}</option>`).join('');

  const body = `
    <h1>Name Aliases</h1>
    <p class="subtitle">Map eCW doctor names to canonical names in MedPay</p>
    <div class="card">
      <h3>Add New Alias</h3>
      <div class="form-row">
        <div class="form-group"><label>eCW Name (as it appears in CSV)</label><input type="text" id="new_alias" placeholder="e.g. Dr. Sunil G"></div>
        <div class="form-group"><label>Maps to Doctor</label><select id="new_doctor_id"><option value="">— Select Doctor —</option>${doctorOptions}</select></div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary" onclick="addAlias()">Add Alias</button></div>
      </div>
    </div>
    <div class="card" style="padding:0;overflow-x:auto">
      <table>
        <thead><tr><th>eCW Alias</th><th>Canonical Doctor</th><th>Actions</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="3" style="text-align:center;padding:24px;color:#a0aec0">No aliases configured.</td></tr>'}</tbody>
      </table>
    </div>
  `;

  const script = `<script>
async function addAlias() {
  var alias = document.getElementById('new_alias').value.trim();
  var doctorId = document.getElementById('new_doctor_id').value;
  if (!alias || !doctorId) { alert('Both alias and doctor are required'); return; }
  var r = await fetch('/api/aliases', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ alias: alias, doctor_id: parseInt(doctorId) }) });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}

async function deleteAlias(id) {
  if (!confirm('Delete this alias?')) return;
  var r = await fetch('/api/aliases/' + id, { method: 'DELETE' });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}
</script>`;

  return htmlShell('Aliases', 'aliases', body, script);
}

// ===================== API HANDLERS =====================
async function handleApi(request, env, path, auth) {
  const method = request.method;
  const json = method === 'POST' || method === 'PUT' ? await request.json().catch(() => null) : null;

  // Role-based protection: doctors can only read their own statement data
  const adminOnly = ['POST', 'PUT', 'DELETE'];
  const doctorAllowedPaths = ['/api/statement/'];
  if (auth.role === 'doctor') {
    if (adminOnly.indexOf(method) >= 0) return new Response('Admin access required', { status: 403 });
    const isDoctorPath = doctorAllowedPaths.some(p => path.startsWith(p));
    if (!isDoctorPath && path !== '/api/doctors') return new Response('Access denied', { status: 403 });
  }

  // ---- DOCTORS ----
  if (path === '/api/doctors' && method === 'GET') {
    const docs = (await env.DB.prepare('SELECT * FROM doctors ORDER BY name').all()).results;
    return Response.json(docs);
  }

  if (path === '/api/doctors' && method === 'POST') {
    if (!json || !json.doctor || !json.doctor.name || !json.contract || !json.contract.contract_type) {
      return new Response('Missing required fields', { status: 400 });
    }
    const d = json.doctor;
    const c = json.contract;
    try {
      // Insert doctor
      const res = await env.DB.prepare('INSERT INTO doctors (name, display_name, pin) VALUES (?, ?, ?)').bind(d.name, d.display_name, d.pin).run();
      const doctorId = res.meta.last_row_id;

      // Insert contract
      await env.DB.prepare(`INSERT INTO contracts (doctor_id, contract_type, mgm_amount, threshold_amount, incentive_pct, retainer_pool_pct, cash_base_method, cash_b_pct, cash_self_pct, cash_other_pct, tpa_base_method, tpa_b_pct, tpa_self_pct, tpa_other_pct, pmjay_base_method, pmjay_pct, pmjay_in_mgm_pool, govt_base_method, govt_b_pct, govt_self_pct, govt_other_pct, opd_non_govt_pct, opd_govt_pct, rb_hospital_fixed, rb_includes_robotic, notes, effective_date, tds_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        doctorId, c.contract_type, c.mgm_amount, c.threshold_amount, c.incentive_pct, c.retainer_pool_pct,
        c.cash_base_method, c.cash_b_pct, c.cash_self_pct, c.cash_other_pct,
        c.tpa_base_method, c.tpa_b_pct, c.tpa_self_pct, c.tpa_other_pct,
        c.pmjay_base_method, c.pmjay_pct, c.pmjay_in_mgm_pool,
        c.govt_base_method, c.govt_b_pct, c.govt_self_pct, c.govt_other_pct,
        c.opd_non_govt_pct, c.opd_govt_pct, c.rb_hospital_fixed, c.rb_includes_robotic,
        c.notes, c.effective_date, c.tds_rate || 10
      ).run();

      // Insert procedure packages
      if (json.packages && json.packages.length > 0) {
        for (const pkg of json.packages) {
          await env.DB.prepare('INSERT INTO procedure_packages (doctor_id, procedure_keyword, doctor_fee) VALUES (?, ?, ?)').bind(doctorId, pkg.procedure_keyword, pkg.doctor_fee).run();
        }
      }

      // Insert aliases
      if (json.aliases && json.aliases.length > 0) {
        for (const alias of json.aliases) {
          const norm = alias.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
          if (norm) {
            await env.DB.prepare('INSERT OR IGNORE INTO doctor_aliases (alias, doctor_id) VALUES (?, ?)').bind(norm, doctorId).run();
          }
        }
      }

      // Auto-add canonical name as alias
      const normName = d.name.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
      await env.DB.prepare('INSERT OR IGNORE INTO doctor_aliases (alias, doctor_id) VALUES (?, ?)').bind(normName, doctorId).run();

      await auditLog(env, auth, 'doctor_create', 'doctors', doctorId, 'Created ' + d.name + ' (' + c.contract_type + ')');
      return Response.json({ id: doctorId, success: true });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }

  // PUT /api/doctors/:id
  const docMatch = path.match(/^\/api\/doctors\/(\d+)$/);
  if (docMatch && method === 'PUT') {
    const doctorId = parseInt(docMatch[1]);
    if (!json) return new Response('No data', { status: 400 });

    // Simple toggle active
    if (json.active !== undefined && !json.doctor) {
      await env.DB.prepare('UPDATE doctors SET active = ? WHERE id = ?').bind(json.active, doctorId).run();
      return Response.json({ success: true });
    }

    const d = json.doctor;
    const c = json.contract;
    try {
      // Update doctor
      if (d) {
        await env.DB.prepare('UPDATE doctors SET display_name = ?, pin = ? WHERE id = ?').bind(d.display_name, d.pin, doctorId).run();
      }

      // Upsert contract
      if (c) {
        await env.DB.prepare('DELETE FROM contracts WHERE doctor_id = ?').bind(doctorId).run();
        await env.DB.prepare(`INSERT INTO contracts (doctor_id, contract_type, mgm_amount, threshold_amount, incentive_pct, retainer_pool_pct, cash_base_method, cash_b_pct, cash_self_pct, cash_other_pct, tpa_base_method, tpa_b_pct, tpa_self_pct, tpa_other_pct, pmjay_base_method, pmjay_pct, pmjay_in_mgm_pool, govt_base_method, govt_b_pct, govt_self_pct, govt_other_pct, opd_non_govt_pct, opd_govt_pct, rb_hospital_fixed, rb_includes_robotic, notes, effective_date, tds_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
          doctorId, c.contract_type, c.mgm_amount, c.threshold_amount, c.incentive_pct, c.retainer_pool_pct,
          c.cash_base_method, c.cash_b_pct, c.cash_self_pct, c.cash_other_pct,
          c.tpa_base_method, c.tpa_b_pct, c.tpa_self_pct, c.tpa_other_pct,
          c.pmjay_base_method, c.pmjay_pct, c.pmjay_in_mgm_pool,
          c.govt_base_method, c.govt_b_pct, c.govt_self_pct, c.govt_other_pct,
          c.opd_non_govt_pct, c.opd_govt_pct, c.rb_hospital_fixed, c.rb_includes_robotic,
          c.notes, c.effective_date, c.tds_rate || 10
        ).run();
      }

      // Replace packages
      if (json.packages !== undefined) {
        await env.DB.prepare('DELETE FROM procedure_packages WHERE doctor_id = ?').bind(doctorId).run();
        for (const pkg of (json.packages || [])) {
          await env.DB.prepare('INSERT INTO procedure_packages (doctor_id, procedure_keyword, doctor_fee) VALUES (?, ?, ?)').bind(doctorId, pkg.procedure_keyword, pkg.doctor_fee).run();
        }
      }

      // Replace aliases
      if (json.aliases !== undefined) {
        await env.DB.prepare('DELETE FROM doctor_aliases WHERE doctor_id = ?').bind(doctorId).run();
        const docName = d ? d.name : (await env.DB.prepare('SELECT name FROM doctors WHERE id = ?').bind(doctorId).first()).name;
        const normName = docName.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
        await env.DB.prepare('INSERT OR IGNORE INTO doctor_aliases (alias, doctor_id) VALUES (?, ?)').bind(normName, doctorId).run();
        for (const alias of (json.aliases || [])) {
          const norm = alias.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
          if (norm && norm !== normName) {
            await env.DB.prepare('INSERT OR IGNORE INTO doctor_aliases (alias, doctor_id) VALUES (?, ?)').bind(norm, doctorId).run();
          }
        }
      }

      return Response.json({ success: true });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }

  // ---- ALIASES ----
  if (path === '/api/aliases' && method === 'GET') {
    const aliases = (await env.DB.prepare('SELECT da.*, d.name as doctor_name FROM doctor_aliases da JOIN doctors d ON d.id = da.doctor_id ORDER BY da.alias').all()).results;
    return Response.json(aliases);
  }

  if (path === '/api/aliases' && method === 'POST') {
    if (!json || !json.alias || !json.doctor_id) return new Response('Missing fields', { status: 400 });
    const norm = json.alias.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
    try {
      await env.DB.prepare('INSERT INTO doctor_aliases (alias, doctor_id) VALUES (?, ?)').bind(norm, json.doctor_id).run();
      return Response.json({ success: true });
    } catch (e) {
      return new Response('Error (duplicate?): ' + e.message, { status: 400 });
    }
  }

  const aliasMatch = path.match(/^\/api\/aliases\/(\d+)$/);
  if (aliasMatch && method === 'DELETE') {
    await env.DB.prepare('DELETE FROM doctor_aliases WHERE id = ?').bind(parseInt(aliasMatch[1])).run();
    return Response.json({ success: true });
  }

  // ---- SETTLEMENTS ----
  // GET /api/settlements/check — duplicate detection
  if (path === '/api/settlements/check' && method === 'GET') {
    const sp = new URL(request.url).searchParams;
    const month = sp.get('month');
    const doctorIds = (sp.get('doctor_ids') || '').split(',').filter(Boolean).map(Number);
    if (!month || doctorIds.length === 0) return Response.json([]);
    const placeholders = doctorIds.map(() => '?').join(',');
    const existing = (await env.DB.prepare(`SELECT ms.id, ms.doctor_id, ms.centre, ms.status, d.name as doctor_name FROM monthly_settlements ms JOIN doctors d ON d.id = ms.doctor_id WHERE ms.month = ? AND ms.doctor_id IN (${placeholders})`).bind(month, ...doctorIds).all()).results || [];
    return Response.json(existing);
  }

  if (path === '/api/settlements' && method === 'POST') {
    if (!json || !Array.isArray(json)) return new Response('Expected array', { status: 400 });
    try {
      for (const s of json) {
        const res = await env.DB.prepare(`INSERT INTO monthly_settlements (doctor_id, month, centre, calculated_pool, pmjay_pool, final_payout, mgm_triggered, incentive_triggered, incentive_amount, tds_amount, net_payout, override_payout, override_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
          s.doctor_id, s.month, s.centre, s.calculated_pool, s.pmjay_pool, s.final_payout, s.mgm_triggered, s.incentive_triggered, s.incentive_amount, s.tds_amount || 0, s.net_payout || s.final_payout, s.override_payout || null, s.override_reason || null
        ).run();
        const settlementId = res.meta.last_row_id;

        for (const b of (s.bills || [])) {
          await env.DB.prepare(`INSERT INTO bill_calculations (settlement_id, bill_no, patient_name, consulting_doctor, referring_doctor, payor_type, payor_raw, base_method, base_amount, self_ref, split_pct, doctor_earning, original_earning, override_earning, override_reason, excluded, pkg_override, pkg_name, centre, bill_date, flagged, flag_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
            settlementId, b.bill_no, b.patient_name, b.consulting_doctor, b.referring_doctor, b.payor_type, b.payor_raw, b.base_method, b.base_amount, b.self_ref, b.split_pct, b.doctor_earning, b.original_earning || null, b.override_earning || null, b.override_reason || null, b.excluded || 0, b.pkg_override, b.pkg_name, b.centre, b.bill_date, b.flagged, b.flag_reason
          ).run();
        }
      }
      await auditLog(env, auth, 'settlement_save', 'settlements', null, json.length + ' settlement(s) saved');
      return Response.json({ success: true, count: json.length });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }

  // GET /api/settlements/:id/bills
  const billsMatch = path.match(/^\/api\/settlements\/(\d+)\/bills$/);
  if (billsMatch && method === 'GET') {
    const bills = (await env.DB.prepare('SELECT * FROM bill_calculations WHERE settlement_id = ? ORDER BY bill_no').bind(parseInt(billsMatch[1])).all()).results;
    return Response.json(bills);
  }

  // PUT /api/settlements/:id/lock
  const lockMatch = path.match(/^\/api\/settlements\/(\d+)\/lock$/);
  if (lockMatch && method === 'PUT') {
    const lid = parseInt(lockMatch[1]);
    await env.DB.prepare('UPDATE monthly_settlements SET locked = 1, status = ? WHERE id = ?').bind('locked', lid).run();
    await auditLog(env, auth, 'settlement_lock', 'settlements', lid, 'Locked');
    return Response.json({ success: true });
  }

  // PUT /api/settlements/:id/unlock
  const unlockMatch = path.match(/^\/api\/settlements\/(\d+)\/unlock$/);
  if (unlockMatch && method === 'PUT') {
    const uid = parseInt(unlockMatch[1]);
    await env.DB.prepare('UPDATE monthly_settlements SET locked = 0, status = ? WHERE id = ?').bind('draft', uid).run();
    await auditLog(env, auth, 'settlement_unlock', 'settlements', uid, 'Unlocked');
    return Response.json({ success: true });
  }

  // DELETE /api/settlements/:id
  const delSettMatch = path.match(/^\/api\/settlements\/(\d+)$/);
  if (delSettMatch && method === 'DELETE') {
    const sid = parseInt(delSettMatch[1]);
    await env.DB.prepare('DELETE FROM bill_calculations WHERE settlement_id = ?').bind(sid).run();
    await env.DB.prepare('DELETE FROM monthly_settlements WHERE id = ?').bind(sid).run();
    await auditLog(env, auth, 'settlement_delete', 'settlements', sid, 'Deleted');
    return Response.json({ success: true });
  }

  // PUT /api/settlements/:id/payment
  const pmtMatch = path.match(/^\/api\/settlements\/(\d+)\/payment$/);
  if (pmtMatch && method === 'PUT') {
    if (!json) return new Response('No data', { status: 400 });
    const sid = parseInt(pmtMatch[1]);
    await env.DB.prepare('UPDATE monthly_settlements SET payment_utr = ?, payment_date = ?, payment_bank = ?, payment_mode = ?, payment_amount = ?, status = ? WHERE id = ?').bind(
      json.payment_utr, json.payment_date, json.payment_bank, json.payment_mode, json.payment_amount, 'paid', sid
    ).run();
    await auditLog(env, auth, 'payment_record', 'settlements', sid, 'UTR: ' + json.payment_utr + ', Rs. ' + json.payment_amount);
    return Response.json({ success: true });
  }

  // PUT /api/settlements/:id/approve
  const approveMatch = path.match(/^\/api\/settlements\/(\d+)\/approve$/);
  if (approveMatch && method === 'PUT') {
    const aid = parseInt(approveMatch[1]);
    await env.DB.prepare('UPDATE monthly_settlements SET status = ?, approved_by = ?, approved_at = ? WHERE id = ?').bind('approved', auth.doctorName || 'Admin', new Date().toISOString(), aid).run();
    await auditLog(env, auth, 'settlement_approve', 'settlements', aid, 'Approved');
    return Response.json({ success: true });
  }

  // GET /api/statement/:id — full data for statement generation
  const stmtMatch = path.match(/^\/api\/statement\/(\d+)$/);
  if (stmtMatch && method === 'GET') {
    const sid = parseInt(stmtMatch[1]);
    const settlement = await env.DB.prepare('SELECT ms.*, d.name as doctor_name, d.display_name FROM monthly_settlements ms JOIN doctors d ON d.id = ms.doctor_id WHERE ms.id = ?').bind(sid).first();
    if (!settlement) return new Response('Not found', { status: 404 });
    const contract = await env.DB.prepare('SELECT * FROM contracts WHERE doctor_id = ?').bind(settlement.doctor_id).first();
    const bills = (await env.DB.prepare('SELECT * FROM bill_calculations WHERE settlement_id = ? ORDER BY bill_date, bill_no').bind(sid).all()).results || [];
    return Response.json({ settlement, contract, bills });
  }

  // ---- ADJUSTMENTS ----
  if (path === '/api/adjustments' && method === 'GET') {
    const doctorId = new URL(request.url).searchParams.get('doctor_id');
    const month = new URL(request.url).searchParams.get('month');
    let q = 'SELECT a.*, d.name as doctor_name, d.display_name FROM adjustments a JOIN doctors d ON d.id = a.doctor_id WHERE 1=1';
    const p = [];
    if (doctorId) { q += ' AND a.doctor_id = ?'; p.push(parseInt(doctorId)); }
    if (month) { q += ' AND a.month = ?'; p.push(month); }
    q += ' ORDER BY a.month DESC, d.name';
    let stmt = env.DB.prepare(q);
    if (p.length > 0) stmt = stmt.bind(...p);
    const adj = (await stmt.all()).results;
    return Response.json(adj);
  }

  if (path === '/api/adjustments' && method === 'POST') {
    if (!json) return new Response('No data', { status: 400 });
    await env.DB.prepare('INSERT INTO adjustments (doctor_id, month, type, description, amount) VALUES (?, ?, ?, ?, ?)').bind(
      json.doctor_id, json.month, json.type, json.description, json.amount
    ).run();
    return Response.json({ success: true });
  }

  const adjDelMatch = path.match(/^\/api\/adjustments\/(\d+)$/);
  if (adjDelMatch && method === 'DELETE') {
    await env.DB.prepare('DELETE FROM adjustments WHERE id = ?').bind(parseInt(adjDelMatch[1])).run();
    return Response.json({ success: true });
  }

  return new Response('Not found', { status: 404 });
}

// ===================== PAGE: Adjustments =====================
async function adjustmentsPage(env, searchParams) {
  const doctors = (await env.DB.prepare('SELECT id, name, display_name FROM doctors WHERE active = 1 ORDER BY name').all()).results || [];
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
  const doctorId = searchParams.get('doctor_id') || '';

  let query = 'SELECT a.*, d.name as doctor_name, d.display_name FROM adjustments a JOIN doctors d ON d.id = a.doctor_id WHERE 1=1';
  const params = [];
  if (month) { query += ' AND a.month = ?'; params.push(month); }
  if (doctorId) { query += ' AND a.doctor_id = ?'; params.push(parseInt(doctorId)); }
  query += ' ORDER BY d.name, a.type';

  let stmt = env.DB.prepare(query);
  if (params.length > 0) stmt = stmt.bind(...params);
  const adjustments = (await stmt.all()).results || [];

  const docOptions = doctors.map(d => `<option value="${d.id}" ${d.id == doctorId ? 'selected' : ''}>${d.display_name || d.name}</option>`).join('');

  let totalAdv = 0, totalDed = 0;
  let rows = '';
  for (const a of adjustments) {
    const isPositive = a.amount > 0;
    if (isPositive) totalAdv += a.amount; else totalDed += Math.abs(a.amount);
    rows += `<tr>
      <td>${a.display_name || a.doctor_name}</td>
      <td>${a.month}</td>
      <td><span class="badge ${isPositive ? 'badge-active' : 'badge-inactive'}">${a.type}</span></td>
      <td>${a.description || '—'}</td>
      <td style="font-weight:600;color:${isPositive ? '#276749' : '#c53030'}">${isPositive ? '+' : ''}${fmtRs(a.amount)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteAdj(${a.id})">Delete</button></td>
    </tr>`;
  }

  const body = `
    <h1>Adjustments & Deductions</h1>
    <p class="subtitle">Advances, deductions, recoveries — applied to net payout</p>

    <div class="card">
      <h3>Add Adjustment</h3>
      <div class="form-row">
        <div class="form-group"><label>Doctor *</label><select id="adj_doctor">${docOptions}</select></div>
        <div class="form-group"><label>Month *</label><input type="month" id="adj_month" value="${month}"></div>
        <div class="form-group"><label>Type *</label>
          <select id="adj_type">
            <option value="Advance">Advance (deduct from payout)</option>
            <option value="Recovery">Recovery (deduct from payout)</option>
            <option value="Deduction">Other Deduction</option>
            <option value="Bonus">Bonus (add to payout)</option>
            <option value="Reimbursement">Reimbursement (add to payout)</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Amount (Rs.) *</label><input type="number" id="adj_amount" step="0.01" placeholder="Positive = add, Negative = deduct"></div>
        <div class="form-group"><label>Description</label><input type="text" id="adj_desc" placeholder="e.g. Equipment EMI, Prior month adjustment"></div>
        <div class="form-group" style="align-self:end"><button class="btn btn-primary" onclick="addAdj()">Add</button></div>
      </div>
    </div>

    <div class="card">
      <div class="form-row" style="margin-bottom:16px">
        <div class="form-group"><label>Filter Month</label><input type="month" id="filter_adj_month" value="${month}" onchange="applyAdjFilter()"></div>
        <div class="form-group"><label>Filter Doctor</label>
          <select id="filter_adj_doctor" onchange="applyAdjFilter()">
            <option value="">All Doctors</option>
            ${docOptions}
          </select>
        </div>
      </div>
      <div class="stat-grid" style="grid-template-columns:1fr 1fr;margin-bottom:16px">
        <div class="stat-card"><div class="label">Total Additions</div><div class="value" style="color:#276749">+ ${fmtRs(totalAdv)}</div></div>
        <div class="stat-card"><div class="label">Total Deductions</div><div class="value" style="color:#c53030">- ${fmtRs(totalDed)}</div></div>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Doctor</th><th>Month</th><th>Type</th><th>Description</th><th>Amount</th><th>Actions</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="6" style="text-align:center;padding:24px;color:#a0aec0">No adjustments found.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;

  const script = `<script>
function applyAdjFilter() {
  var m = document.getElementById('filter_adj_month').value;
  var d = document.getElementById('filter_adj_doctor').value;
  var params = new URLSearchParams();
  if (m) params.set('month', m);
  if (d) params.set('doctor_id', d);
  window.location.href = '/adjustments' + (params.toString() ? '?' + params.toString() : '');
}

async function addAdj() {
  var docId = document.getElementById('adj_doctor').value;
  var month = document.getElementById('adj_month').value;
  var type = document.getElementById('adj_type').value;
  var amount = parseFloat(document.getElementById('adj_amount').value);
  var desc = document.getElementById('adj_desc').value.trim();
  if (!docId || !month || !amount) { alert('Doctor, month and amount are required'); return; }
  // Auto-negate deductions
  if (['Advance','Recovery','Deduction'].indexOf(type) >= 0 && amount > 0) amount = -amount;
  var r = await fetch('/api/adjustments', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ doctor_id: parseInt(docId), month: month, type: type, description: desc, amount: amount }) });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}

async function deleteAdj(id) {
  if (!confirm('Delete this adjustment?')) return;
  var r = await fetch('/api/adjustments/' + id, { method: 'DELETE' });
  if (r.ok) location.reload();
  else alert('Error: ' + (await r.text()));
}
</script>`;

  return htmlShell('Adjustments', 'settlements', body, script);
}

// ===================== PAGE: Batch Payment Import =====================
async function batchPaymentPage(env) {
  // Get all approved/locked settlements without payment
  const pending = (await env.DB.prepare("SELECT ms.*, d.name as doctor_name, d.display_name FROM monthly_settlements ms JOIN doctors d ON d.id = ms.doctor_id WHERE ms.payment_utr IS NULL AND (ms.status = 'approved' OR ms.locked = 1) ORDER BY ms.month DESC, d.name").all()).results || [];

  let pendingRows = '';
  for (const s of pending) {
    const tds = s.tds_amount || (s.final_payout * 0.1);
    const net = s.net_payout || (s.final_payout - tds);
    pendingRows += `<tr><td>${s.id}</td><td>${s.month}</td><td>${s.centre}</td><td style="font-weight:600">${s.display_name || s.doctor_name}</td><td>${fmtRs(s.final_payout)}</td><td>${fmtRs(tds)}</td><td style="font-weight:700;color:#276749">${fmtRs(net)}</td></tr>`;
  }

  const body = `
    <h1>Batch Payment Import</h1>
    <p class="subtitle">Upload bank statement CSV to auto-match payments with settlements</p>

    <div class="card">
      <h3>Pending Payments (${pending.length})</h3>
      <div style="overflow-x:auto;max-height:300px;overflow-y:auto">
        <table style="font-size:13px">
          <thead><tr><th>ID</th><th>Month</th><th>Centre</th><th>Doctor</th><th>Gross</th><th>TDS</th><th>Net Payable</th></tr></thead>
          <tbody>${pendingRows || '<tr><td colspan="7" style="text-align:center;padding:16px;color:#a0aec0">No pending payments</td></tr>'}</tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h3>Upload Bank Statement CSV</h3>
      <p style="font-size:13px;color:#718096;margin-bottom:12px">CSV should have columns: <strong>Date, Description/Narration, Amount, UTR/Reference</strong>. System will match by net amount to pending settlements.</p>
      <div class="upload-zone" onclick="document.getElementById('bankFile').click()" style="margin-bottom:16px">
        <input type="file" id="bankFile" accept=".csv" style="display:none" onchange="handleBankCSV(this.files[0])">
        <div style="font-size:36px;margin-bottom:8px">🏦</div>
        <div style="font-size:16px;font-weight:600;color:#2d3748">Drop bank CSV here or click to browse</div>
      </div>
      <div id="bankPreview" class="hidden"></div>
    </div>

    <div id="matchResults" class="hidden">
      <div class="card">
        <h3>Matched Payments</h3>
        <div id="matchTable"></div>
        <div style="margin-top:16px;text-align:right">
          <button class="btn btn-primary" onclick="applyMatchedPayments()">Apply All Matched Payments</button>
        </div>
      </div>
    </div>
  `;

  const pendingJson = JSON.stringify(pending.map(s => ({
    id: s.id, month: s.month, centre: s.centre,
    doctor: s.display_name || s.doctor_name,
    gross: s.final_payout,
    tds: s.tds_amount || (s.final_payout * 0.1),
    net: s.net_payout || (s.final_payout - (s.tds_amount || s.final_payout * 0.1))
  })));

  const script = `<script>
var PENDING = ${pendingJson};
var bankRows = [];
var matches = [];

function handleBankCSV(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var lines = e.target.result.split('\\n');
    if (lines.length < 2) { alert('Empty CSV'); return; }
    var headers = lines[0].split(',').map(function(h) { return h.trim().replace(/"/g, '').toLowerCase(); });

    // Find relevant columns
    var dateCol = headers.findIndex(function(h) { return h.indexOf('date') >= 0; });
    var descCol = headers.findIndex(function(h) { return h.indexOf('desc') >= 0 || h.indexOf('narr') >= 0 || h.indexOf('particular') >= 0; });
    var amtCol = headers.findIndex(function(h) { return h.indexOf('amount') >= 0 || h.indexOf('credit') >= 0 || h.indexOf('debit') >= 0; });
    var utrCol = headers.findIndex(function(h) { return h.indexOf('utr') >= 0 || h.indexOf('ref') >= 0 || h.indexOf('cheque') >= 0 || h.indexOf('transaction') >= 0; });

    bankRows = [];
    for (var i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      var cells = lines[i].split(',').map(function(c) { return c.trim().replace(/^"|"$/g, ''); });
      var amt = parseFloat((cells[amtCol] || '0').replace(/,/g, ''));
      if (!amt || amt <= 0) continue;
      bankRows.push({
        date: cells[dateCol] || '',
        desc: cells[descCol] || '',
        amount: amt,
        utr: cells[utrCol] || ''
      });
    }

    document.getElementById('bankPreview').classList.remove('hidden');
    document.getElementById('bankPreview').innerHTML = '<p><strong>' + bankRows.length + '</strong> credit transactions found. Matching against ' + PENDING.length + ' pending settlements...</p>';

    matchPayments();
  };
  reader.readAsText(file);
}

function matchPayments() {
  matches = [];
  var usedSettlements = {};
  var usedBank = {};

  // Pass 1: exact net amount match
  bankRows.forEach(function(br, bi) {
    if (usedBank[bi]) return;
    PENDING.forEach(function(ps) {
      if (usedSettlements[ps.id] || usedBank[bi]) return;
      var net = Math.round(ps.net);
      var bankAmt = Math.round(br.amount);
      if (net === bankAmt) {
        matches.push({ settlement: ps, bankRow: br, bankIdx: bi, confidence: 'exact' });
        usedSettlements[ps.id] = true;
        usedBank[bi] = true;
      }
    });
  });

  // Pass 2: close match (within 1%)
  bankRows.forEach(function(br, bi) {
    if (usedBank[bi]) return;
    PENDING.forEach(function(ps) {
      if (usedSettlements[ps.id] || usedBank[bi]) return;
      var net = ps.net;
      var diff = Math.abs(br.amount - net);
      if (diff < net * 0.01 && diff < 500) {
        matches.push({ settlement: ps, bankRow: br, bankIdx: bi, confidence: 'close' });
        usedSettlements[ps.id] = true;
        usedBank[bi] = true;
      }
    });
  });

  // Display matches
  var html = '<table style="font-size:13px"><thead><tr><th>Doctor</th><th>Month</th><th>Expected Net</th><th>Bank Amount</th><th>UTR</th><th>Date</th><th>Match</th><th>Inc.</th></tr></thead><tbody>';
  matches.forEach(function(m, i) {
    var confColor = m.confidence === 'exact' ? '#276749' : '#ed8936';
    html += '<tr><td style="font-weight:600">' + m.settlement.doctor + '</td><td>' + m.settlement.month + '</td><td>' + Math.round(m.settlement.net).toLocaleString('en-IN') + '</td><td>' + Math.round(m.bankRow.amount).toLocaleString('en-IN') + '</td><td>' + m.bankRow.utr + '</td><td>' + m.bankRow.date + '</td><td style="color:' + confColor + ';font-weight:600">' + m.confidence + '</td><td><input type="checkbox" class="match-chk" data-idx="' + i + '" checked></td></tr>';
  });
  html += '</tbody></table>';
  if (matches.length === 0) html = '<p style="color:#a0aec0">No matches found. Check that bank CSV amounts match settlement net payouts.</p>';

  var unmatched = PENDING.filter(function(ps) { return !usedSettlements[ps.id]; });
  if (unmatched.length > 0) {
    html += '<div style="margin-top:16px"><h3 style="color:#ed8936">Unmatched Settlements (' + unmatched.length + ')</h3><table style="font-size:12px"><thead><tr><th>Doctor</th><th>Month</th><th>Net</th></tr></thead><tbody>';
    unmatched.forEach(function(ps) {
      html += '<tr><td>' + ps.doctor + '</td><td>' + ps.month + '</td><td>' + Math.round(ps.net).toLocaleString('en-IN') + '</td></tr>';
    });
    html += '</tbody></table></div>';
  }

  document.getElementById('matchTable').innerHTML = html;
  document.getElementById('matchResults').classList.remove('hidden');
}

async function applyMatchedPayments() {
  var checkedMatches = [];
  document.querySelectorAll('.match-chk:checked').forEach(function(cb) {
    checkedMatches.push(matches[parseInt(cb.getAttribute('data-idx'))]);
  });
  if (checkedMatches.length === 0) { alert('No matches selected'); return; }
  if (!confirm('Apply ' + checkedMatches.length + ' payment(s)?')) return;

  var ok = 0, fail = 0;
  for (var i = 0; i < checkedMatches.length; i++) {
    var m = checkedMatches[i];
    var payload = {
      payment_utr: m.bankRow.utr || 'BANK-' + (i + 1),
      payment_date: m.bankRow.date || new Date().toISOString().slice(0, 10),
      payment_bank: '',
      payment_mode: 'NEFT',
      payment_amount: m.bankRow.amount
    };
    try {
      var r = await fetch('/api/settlements/' + m.settlement.id + '/payment', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (r.ok) ok++;
      else fail++;
    } catch(e) { fail++; }
  }
  alert(ok + ' payment(s) applied' + (fail > 0 ? ', ' + fail + ' failed' : ''));
  if (ok > 0) location.reload();
}
</script>`;

  return htmlShell('Batch Payment', 'settlements', body, script);
}

// ===================== PAGE: Payout Statement =====================
async function statementPage(env, settlementId) {
  const settlement = await env.DB.prepare('SELECT ms.*, d.name as doctor_name, d.display_name FROM monthly_settlements ms JOIN doctors d ON d.id = ms.doctor_id WHERE ms.id = ?').bind(settlementId).first();
  if (!settlement) return htmlShell('Not Found', '', '<h1>Statement not found</h1>');

  const contract = await env.DB.prepare('SELECT * FROM contracts WHERE doctor_id = ?').bind(settlement.doctor_id).first();
  const bills = (await env.DB.prepare('SELECT * FROM bill_calculations WHERE settlement_id = ? ORDER BY bill_date, bill_no').bind(settlementId).all()).results || [];
  const adjustments = (await env.DB.prepare('SELECT * FROM adjustments WHERE doctor_id = ? AND month = ? ORDER BY type').bind(settlement.doctor_id, settlement.month).all()).results || [];
  const totalAdj = adjustments.reduce((sum, a) => sum + (a.amount || 0), 0);

  // Split IPD vs OPD, group IPD by bill_no (1 line per patient)
  let ipdMap = {};
  let opdTotal = 0, opdCount = 0;
  let cashPool = 0, tpaPool = 0, pmjayPool = 0, govtPool = 0, opdPool = 0;
  for (const b of bills) {
    const amt = b.doctor_earning || 0;
    const isOPD = (b.base_method || '').indexOf('OPD') === 0;
    const isExcluded = b.excluded === 1;
    if (isOPD) {
      if (!isExcluded) { opdTotal += amt; opdPool += amt; }
      opdCount++;
    } else {
      const key = b.bill_no || ('row-' + b.id);
      if (!ipdMap[key]) {
        ipdMap[key] = { bill_no: b.bill_no, bill_date: b.bill_date, patient_name: b.patient_name, payor_type: b.payor_type, payor_raw: b.payor_raw, base_method: b.base_method, earning: 0, original_earning: null, override_reason: b.override_reason, excluded: b.excluded, self_ref: b.self_ref, split_pct: b.split_pct };
      }
      ipdMap[key].earning += amt;
      if (b.original_earning != null) {
        if (ipdMap[key].original_earning == null) ipdMap[key].original_earning = 0;
        ipdMap[key].original_earning += b.original_earning;
      }
      if (!isExcluded) {
        if (b.payor_type === 'CASH') cashPool += amt;
        else if (b.payor_type === 'TPA') tpaPool += amt;
        else if (b.payor_type === 'PMJAY') pmjayPool += amt;
        else if (b.payor_type === 'Govt') govtPool += amt;
        else cashPool += amt;
      }
    }
  }
  const ipdRows = Object.values(ipdMap);
  const ipCount = ipdRows.length;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [yr, mn] = (settlement.month || '').split('-');
  const monthLabel = months[parseInt(mn) - 1] + ' ' + yr;
  const ctype = contract ? contract.contract_type : '—';
  const pool = settlement.calculated_pool || 0;
  const payout = settlement.final_payout || 0;
  const tdsRate = contract ? (contract.tds_rate != null ? contract.tds_rate : 10) : 10;
  const tdsAmt = settlement.tds_amount || (payout * tdsRate / 100);
  const netPayout = settlement.net_payout || (payout - tdsAmt);

  // IPD bill rows — show overrides and exclusions
  let ipdRowsHtml = '';
  let sno = 1;
  let excludedCount = 0;
  for (const r of ipdRows) {
    if (r.excluded) {
      excludedCount++;
      ipdRowsHtml += `<tr style="opacity:0.4;text-decoration:line-through"><td>${sno++}</td><td>${r.bill_no || ''}</td><td>${r.bill_date || ''}</td><td>${r.patient_name || ''}</td><td>${r.payor_type || ''}</td><td style="text-align:right">${fmtRs(r.earning)}</td></tr>`;
      if (r.override_reason) ipdRowsHtml += `<tr style="opacity:0.5"><td colspan="6" style="font-size:10px;color:#6b46c1;padding:1px 8px">Excluded: ${r.override_reason}</td></tr>`;
    } else {
      const hasOverride = r.original_earning != null && r.original_earning !== r.earning;
      const earningCell = hasOverride ? `<span style="text-decoration:line-through;color:#a0aec0;font-size:10px">${fmtRs(r.original_earning)}</span> ${fmtRs(r.earning)}` : fmtRs(r.earning);
      ipdRowsHtml += `<tr><td>${sno++}</td><td>${r.bill_no || ''}</td><td>${r.bill_date || ''}</td><td>${r.patient_name || ''}</td><td>${r.payor_type || ''}${r.payor_raw ? ' (' + (r.payor_raw || '').substring(0, 20) + ')' : ''}</td><td style="text-align:right;font-weight:600">${earningCell}</td></tr>`;
      if (hasOverride && r.override_reason) ipdRowsHtml += `<tr><td colspan="6" style="font-size:10px;color:#6b46c1;padding:1px 8px">Override: ${r.override_reason}</td></tr>`;
    }
  }

  // Settlement calc
  let calcRows = '';
  if (ctype === 'MGM') {
    calcRows = `<tr><td>Professional Fee Pool (from bills)</td><td style="text-align:right">${fmtRs(pool)}</td></tr>
      <tr><td>Monthly Minimum Guarantee (MGM)</td><td style="text-align:right">${fmtRs(contract.mgm_amount)}</td></tr>
      <tr><td>Incentive Threshold</td><td style="text-align:right">${fmtRs(contract.threshold_amount)}</td></tr>`;
    if (settlement.mgm_triggered) {
      calcRows += `<tr style="color:#c53030"><td>Pool below MGM — hospital covers shortfall of ${fmtRs(payout - pool)}</td><td style="text-align:right;font-weight:700">${fmtRs(payout)}</td></tr>`;
    } else if (settlement.incentive_triggered) {
      calcRows += `<tr><td>Pool exceeded threshold by ${fmtRs(pool - contract.threshold_amount)}</td><td></td></tr>
      <tr><td>Incentive (${contract.incentive_pct}% of excess)</td><td style="text-align:right">${fmtRs(settlement.incentive_amount)}</td></tr>
      <tr style="font-weight:700"><td>Gross Payout (threshold + incentive)</td><td style="text-align:right">${fmtRs(payout)}</td></tr>`;
    } else {
      calcRows += `<tr><td>Pool between MGM and threshold — paid at pool</td><td style="text-align:right;font-weight:700">${fmtRs(payout)}</td></tr>`;
    }
  } else if (ctype === 'Retainer') {
    calcRows = `<tr><td>Fixed Retainer Amount</td><td style="text-align:right">${fmtRs(contract.mgm_amount)}</td></tr>
      ${contract.retainer_pool_pct ? '<tr><td>Pool Bonus (' + contract.retainer_pool_pct + '% of ' + fmtRs(pool) + ')</td><td style="text-align:right">' + fmtRs(pool * contract.retainer_pool_pct / 100) + '</td></tr>' : ''}
      <tr style="font-weight:700"><td>Gross Payout</td><td style="text-align:right">${fmtRs(payout)}</td></tr>`;
  } else {
    calcRows = `<tr><td>Professional Fee Pool (from bills)</td><td style="text-align:right">${fmtRs(pool)}</td></tr>
      <tr style="font-weight:700"><td>Gross Payout</td><td style="text-align:right">${fmtRs(payout)}</td></tr>`;
  }
  // Settlement override
  let effectivePayout = payout;
  if (settlement.override_payout != null) {
    calcRows += `<tr style="color:#6b46c1"><td>Manual Override${settlement.override_reason ? ' — ' + settlement.override_reason : ''}</td><td style="text-align:right;font-weight:700">${fmtRs(settlement.override_payout)}</td></tr>`;
    effectivePayout = settlement.override_payout;
  }
  const effectiveTds = effectivePayout * tdsRate / 100;
  const effectiveNet = effectivePayout - effectiveTds;

  // TDS rows always
  calcRows += `<tr style="color:#c53030"><td>Less: TDS @ ${tdsRate}%</td><td style="text-align:right">- ${fmtRs(effectiveTds)}</td></tr>`;
  // Adjustments
  if (adjustments.length > 0) {
    for (const adj of adjustments) {
      const isNeg = adj.amount < 0;
      calcRows += `<tr style="color:${isNeg ? '#c53030' : '#276749'}"><td>${isNeg ? 'Less' : 'Add'}: ${adj.type}${adj.description ? ' — ' + adj.description : ''}</td><td style="text-align:right">${isNeg ? '- ' : '+ '}${fmtRs(Math.abs(adj.amount))}</td></tr>`;
    }
  }
  const finalNet = effectiveNet + totalAdj;
  calcRows += `<tr style="font-weight:700;font-size:16px;background:#ebf4ff"><td>Net Payable</td><td style="text-align:right;color:#276749">${fmtRs(finalNet)}</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payout Statement — ${settlement.display_name || settlement.doctor_name} — ${monthLabel}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a202c; background: #f0f2f5; }
    .page { max-width: 900px; margin: 20px auto; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .page-inner { padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #1a365d; margin-bottom: 24px; }
    .header-left h1 { font-size: 22px; color: #1a365d; font-weight: 800; }
    .header-left h1 span { color: #2b6cb0; }
    .header-left p { font-size: 12px; color: #718096; margin-top: 2px; }
    .header-right { text-align: right; }
    .header-right .doc-label { font-size: 11px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; }
    .header-right .doc-ref { font-size: 13px; color: #4a5568; margin-top: 2px; }
    .title-bar { background: #1a365d; color: #fff; padding: 14px 24px; text-align: center; font-size: 16px; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 13px; font-weight: 700; color: #1a365d; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 2px solid #ebf4ff; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .info-item { padding: 8px 12px; background: #f7fafc; border-radius: 4px; }
    .info-item .label { font-size: 11px; color: #718096; text-transform: uppercase; }
    .info-item .value { font-size: 15px; font-weight: 600; color: #1a202c; margin-top: 2px; }
    .pool-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 8px; }
    .pool-cell { text-align: center; padding: 8px; background: #f7fafc; border-radius: 4px; }
    .pool-cell .label { font-size: 10px; color: #718096; }
    .pool-cell .value { font-size: 14px; font-weight: 700; color: #2d3748; }
    .calc-table { width: 100%; border-collapse: collapse; }
    .calc-table td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .bill-table { width: 100%; border-collapse: collapse; font-size: 11px; }
    .bill-table th { background: #f7fafc; color: #4a5568; font-weight: 600; text-align: left; padding: 6px 8px; border-bottom: 2px solid #e2e8f0; font-size: 10px; text-transform: uppercase; }
    .bill-table td { padding: 5px 8px; border-bottom: 1px solid #f0f0f0; }
    .bill-table tr:nth-child(even) { background: #fafafa; }
    .total-row td { font-weight: 700; border-top: 2px solid #1a365d; background: #ebf4ff; }
    .opd-row td { background: #f0fff4; font-style: italic; }
    .signature-section { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    .sig-box { text-align: center; }
    .sig-line { border-top: 1px solid #cbd5e0; margin-top: 60px; padding-top: 8px; font-size: 12px; color: #718096; }
    .pmt-table { width: 100%; border-collapse: collapse; }
    .pmt-table td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .pmt-table td:first-child { width: 40%; font-weight: 600; color: #4a5568; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #a0aec0; }
    .no-print { margin: 20px auto; max-width: 900px; text-align: right; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; }
    .btn-primary { background: #2b6cb0; color: #fff; }
    .btn-outline { background: transparent; border: 1px solid #cbd5e0; color: #4a5568; }
    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; max-width: 100%; }
      .page-inner { padding: 24px; }
      .no-print { display: none !important; }
      .bill-table { font-size: 9px; }
      .bill-table th, .bill-table td { padding: 3px 4px; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <a href="/settlements" class="btn btn-outline">&larr; Back to Settlements</a>
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="page">
    <div class="page-inner">
      <div class="header">
        <div class="header-left">
          <h1>Health<span>1</span> Super Speciality Hospitals</h1>
          <p>Near Shilaj Circle, Sardar Patel Ring Road, Ahmedabad, Gujarat — 380059</p>
          <p>CIN: U85100GJ2016PTC091922 &nbsp;|&nbsp; www.health1hospitals.com</p>
        </div>
        <div class="header-right">
          <div class="doc-label">Statement Reference</div>
          <div class="doc-ref">MP-${settlement.id.toString().padStart(5, '0')}</div>
          <div class="doc-label" style="margin-top:8px">Generated</div>
          <div class="doc-ref">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div class="title-bar">PROFESSIONAL FEE PAYOUT STATEMENT</div>

      <div class="section">
        <div class="info-grid">
          <div class="info-item"><div class="label">Doctor</div><div class="value">${settlement.display_name || settlement.doctor_name}</div></div>
          <div class="info-item"><div class="label">Period</div><div class="value">${monthLabel}</div></div>
          <div class="info-item"><div class="label">Centre</div><div class="value">${settlement.centre}</div></div>
          <div class="info-item"><div class="label">Contract Type</div><div class="value">${ctype}${ctype === 'MGM' ? ' (MGM: ' + fmtRs(contract.mgm_amount) + ')' : ''}</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Professional Fee Pool — Payor Breakdown</div>
        <div class="pool-grid">
          <div class="pool-cell"><div class="label">CASH</div><div class="value">${fmtRs(cashPool)}</div></div>
          <div class="pool-cell"><div class="label">TPA</div><div class="value">${fmtRs(tpaPool)}</div></div>
          <div class="pool-cell"><div class="label">PMJAY</div><div class="value">${fmtRs(pmjayPool)}</div></div>
          <div class="pool-cell"><div class="label">GOVT</div><div class="value">${fmtRs(govtPool)}</div></div>
          <div class="pool-cell"><div class="label">OPD</div><div class="value">${fmtRs(opdPool)}</div></div>
        </div>
        <div class="info-grid" style="margin-top:8px">
          <div class="info-item"><div class="label">Total Prof Fee Pool</div><div class="value" style="color:#2b6cb0;font-size:18px">${fmtRs(pool)}</div></div>
          <div class="info-item"><div class="label">Bills</div><div class="value">IPD: ${ipCount} patients | OPD: ${opdCount} visits</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Settlement Calculation</div>
        <table class="calc-table">${calcRows}</table>
      </div>

      ${settlement.payment_utr ? `<div class="section">
        <div class="section-title">Payment Details</div>
        <table class="pmt-table">
          <tr><td>Payment Reference (UTR)</td><td>${settlement.payment_utr}</td></tr>
          <tr><td>Payment Date</td><td>${settlement.payment_date || '—'}</td></tr>
          <tr><td>Payment Mode</td><td>${settlement.payment_mode || '—'}</td></tr>
          <tr><td>Bank</td><td>${settlement.payment_bank || '—'}</td></tr>
          <tr><td>Gross Amount</td><td>${fmtRs(effectivePayout)}</td></tr>
          <tr><td>TDS Deducted (${tdsRate}%)</td><td style="color:#c53030">- ${fmtRs(effectiveTds)}</td></tr>
          ${totalAdj !== 0 ? '<tr><td>Adjustments</td><td style="color:' + (totalAdj < 0 ? '#c53030' : '#276749') + '">' + (totalAdj > 0 ? '+ ' : '- ') + fmtRs(Math.abs(totalAdj)) + '</td></tr>' : ''}
          <tr><td style="font-weight:700">Net Amount Paid</td><td style="font-weight:700;font-size:16px;color:#276749">${fmtRs(finalNet)}</td></tr>
        </table>
      </div>` : ''}

      <div class="section">
        <div class="section-title">IPD — Patient-wise Breakdown (${ipCount} patients)</div>
        <table class="bill-table">
          <thead><tr><th>#</th><th>Bill No</th><th>Date</th><th>Patient</th><th>Payor</th><th style="text-align:right">Doctor Earning</th></tr></thead>
          <tbody>
            ${ipdRowsHtml}
            ${opdCount > 0 ? '<tr class="opd-row"><td></td><td colspan="4">OPD Consultations (' + opdCount + ' visits — consolidated)</td><td style="text-align:right;font-weight:600">' + fmtRs(opdTotal) + '</td></tr>' : ''}
            <tr class="total-row">
              <td colspan="5">TOTAL PROFESSIONAL FEE POOL</td>
              <td style="text-align:right;font-size:13px">${fmtRs(pool)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CLOSING MESSAGE -->
      <div style="margin-top:24px;padding:16px 20px;background:#f7fafc;border-left:3px solid #2b6cb0;border-radius:0 8px 8px 0;font-size:13px;color:#2d3748;line-height:1.6">
        ${(() => {
          const poolRatio = pool / (contract ? contract.mgm_amount || 1 : 1);
          const isHighPerformer = settlement.incentive_triggered;
          const isMgmGap = settlement.mgm_triggered;
          const gapPct = isMgmGap ? Math.round((1 - poolRatio) * 100) : 0;
          const isNearThreshold = !isMgmGap && !isHighPerformer && contract && contract.threshold_amount && pool > contract.mgm_amount && pool >= contract.threshold_amount * 0.85;
          const isFirstMonth = settlement.id <= 5; // rough proxy

          if (isHighPerformer) {
            const msgs = [
              'Exceptional performance this month — your professional fee pool exceeded the incentive threshold. Thank you for your outstanding contribution to patient care at Health1. We look forward to continuing this momentum together.',
              'Congratulations on surpassing the incentive threshold this month. Your clinical excellence and dedication directly impact the quality of care at Health1. We truly value our partnership.',
              'An outstanding month — your earnings have crossed the incentive threshold, reflecting your exceptional clinical contributions. Health1 is proud to have you on the team. Thank you for making a difference.'
            ];
            return msgs[settlement.id % msgs.length];
          } else if (isNearThreshold) {
            return 'Your professional fee pool is tracking very close to the incentive threshold — a strong performance this month. A small push in the coming period could unlock the incentive slab. We appreciate your consistent clinical contributions to Health1.';
          } else if (isMgmGap && gapPct > 40) {
            return 'We appreciate your continued association with Health1. We understand that building a practice takes time, and we remain committed to supporting your growth. Please feel free to discuss any operational support, scheduling preferences, or referral opportunities with the management team — we are here to help you succeed.';
          } else if (isMgmGap && gapPct > 15) {
            return 'Thank you for your contributions this month. Your professional fee pool is developing, and Health1 is committed to supporting your practice growth. If there are ways we can help — whether through scheduling, referral coordination, or facility support — please do not hesitate to reach out to the management team.';
          } else if (isMgmGap) {
            return 'Thank you for your work this month. Your pool is nearly at the guaranteed minimum — continued momentum should see you comfortably past the MGM in the coming months. We value your partnership with Health1.';
          } else {
            const msgs = [
              'Thank you for your clinical contributions to Health1 this month. We value our partnership and look forward to continued collaboration in delivering excellent patient care.',
              'We appreciate your dedication to patient care at Health1. Your consistent contributions are valued by the entire team. Wishing you a productive month ahead.',
              'Thank you for being an integral part of Health1. Your professional commitment makes a real difference in the lives of our patients. We look forward to another successful month together.'
            ];
            return msgs[settlement.id % msgs.length];
          }
        })()}
      </div>

      <div class="signature-section">
        <div class="sig-box">
          <div style="font-size:12px;color:#718096;margin-bottom:4px">Warm Regards,</div>
          <div class="sig-line">For Health1 Super Speciality Hospitals<br><span style="font-size:11px;color:#4a5568">Dr. Keyur Patel, Chairman</span></div>
        </div>
        <div class="sig-box"><div class="sig-line">${settlement.display_name || settlement.doctor_name}<br><span style="font-size:11px;color:#4a5568">Acknowledged</span></div></div>
      </div>

      <div class="footer">
        <p>This is a system-generated statement from MedPay. For queries, contact the Finance Department at Health1 Hospitals.</p>
        <p>Statement Ref: MP-${settlement.id.toString().padStart(5, '0')} &nbsp;|&nbsp; Generated: ${new Date().toISOString()}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ===================== PAGE: Doctor Portal =====================
async function doctorPortalPage(env, doctorId) {
  const doc = await env.DB.prepare('SELECT * FROM doctors WHERE id = ?').bind(doctorId).first();
  if (!doc) return htmlShell('Error', '', '<h1>Doctor not found</h1>');

  const settlements = (await env.DB.prepare('SELECT * FROM monthly_settlements WHERE doctor_id = ? ORDER BY month DESC, centre LIMIT 50').bind(doctorId).all()).results || [];

  let rows = '';
  for (const s of settlements) {
    const hasPmt = !!s.payment_utr;
    const tdsAmt = s.tds_amount || 0;
    const netPayout = s.net_payout || (s.final_payout - tdsAmt);
    rows += `<tr>
      <td>${s.month}</td>
      <td>${s.centre}</td>
      <td>${fmtRs(s.calculated_pool)}</td>
      <td>${fmtRs(s.final_payout)}</td>
      <td style="color:#c53030">${fmtRs(tdsAmt)}</td>
      <td style="font-weight:700;color:#276749">${fmtRs(netPayout)}</td>
      <td>${hasPmt ? '<span class="badge badge-active">Paid</span>' : (s.locked ? '<span class="badge" style="background:#fefcbf;color:#975a16">Processing</span>' : '<span class="badge badge-inactive">Draft</span>')}</td>
      <td>${hasPmt ? s.payment_utr : '—'}</td>
      <td>${hasPmt ? '<a href="/statement/' + s.id + '" target="_blank" class="btn btn-primary btn-sm">Download</a>' : ''}</td>
    </tr>`;
  }

  const body = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div><h1>My Payout Statements</h1><p class="subtitle" style="margin:0">${doc.display_name || doc.name}</p></div>
      <a href="/logout" class="btn btn-outline">Logout</a>
    </div>
    <div class="card" style="padding:0;overflow-x:auto">
      <table>
        <thead><tr><th>Month</th><th>Centre</th><th>Pool</th><th>Gross</th><th>TDS</th><th>Net Payout</th><th>Status</th><th>UTR</th><th>Statement</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="9" style="text-align:center;padding:24px;color:#a0aec0">No settlements found yet.</td></tr>'}</tbody>
      </table>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Statements — MedPay</title>
  ${CSS}
</head>
<body>
  <nav class="nav">
    <a href="/portal" class="nav-brand">Med<span>Pay</span></a>
    <a href="/portal" class="active">My Statements</a>
    <a href="/logout" style="margin-left:auto; color:#fc8181;">Logout</a>
  </nav>
  <div class="container">${body}</div>
</body>
</html>`;
}

// ===================== MAIN ROUTER =====================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Login
    if (path === '/login' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, ip);
      if (!allowed) {
        return new Response(pinPage('Too many attempts. Please wait 60 seconds.'), { headers: { 'Content-Type': 'text/html' } });
      }
      await recordLoginAttempt(env, ip);
      const form = await request.formData();
      const pin = form.get('pin');
      const auth = await validatePin(pin, env);
      if (auth.valid) {
        await auditLog(env, auth, 'login', 'session', null, 'Login from ' + ip);
        return new Response(null, {
          status: 302,
          headers: {
            'Location': auth.role === 'doctor' ? '/portal' : '/',
            'Set-Cookie': `medpay_pin=${pin}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
          }
        });
      }
      return new Response(pinPage('Invalid PIN'), { headers: { 'Content-Type': 'text/html' } });
    }

    // Logout
    if (path === '/logout') {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': 'medpay_pin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
        }
      });
    }

    // Auth check
    const pin = getAuthCookie(request);
    if (!pin) {
      if (path.startsWith('/api/')) return new Response('Unauthorized', { status: 401 });
      return new Response(pinPage(), { headers: { 'Content-Type': 'text/html' } });
    }
    const auth = await validatePin(pin, env);
    if (!auth.valid) {
      if (path.startsWith('/api/')) return new Response('Unauthorized', { status: 401 });
      return new Response(pinPage('Session expired. Please log in again.'), { headers: { 'Content-Type': 'text/html' } });
    }

    // API routes
    if (path.startsWith('/api/')) {
      return handleApi(request, env, path, auth);
    }

    // Doctor portal — non-admin doctors can only access /portal and /statement
    if (auth.role === 'doctor') {
      let html;
      try {
        if (path === '/portal' || path === '/') {
          html = await doctorPortalPage(env, auth.doctorId);
        } else if (path.match(/^\/statement\/(\d+)$/)) {
          const id = parseInt(path.match(/^\/statement\/(\d+)$/)[1]);
          // Verify this statement belongs to this doctor
          const s = await env.DB.prepare('SELECT doctor_id FROM monthly_settlements WHERE id = ?').bind(id).first();
          if (s && s.doctor_id === auth.doctorId) {
            html = await statementPage(env, id);
          } else {
            html = doctorPortalPage(env, auth.doctorId);
          }
        } else {
          return new Response(null, { status: 302, headers: { 'Location': '/portal' } });
        }
      } catch (e) {
        html = `<html><body><h1>Error</h1><pre>${e.stack || e.message}</pre></body></html>`;
      }
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // Admin page routes
    let html;
    try {
      if (path === '/' || path === '/dashboard') {
        html = await dashboardPage(env);
      } else if (path === '/calc') {
        html = await calcPage(env);
      } else if (path === '/doctors') {
        html = await doctorsListPage(env);
      } else if (path === '/doctors/add') {
        html = await doctorFormPage(env);
      } else if (path === '/doctors/import') {
        html = await bulkImportPage(env);
      } else if (path.match(/^\/doctors\/edit\/(\d+)$/)) {
        const id = parseInt(path.match(/^\/doctors\/edit\/(\d+)$/)[1]);
        html = await doctorFormPage(env, id);
      } else if (path === '/settlements') {
        html = await settlementsPage(env, url.searchParams);
      } else if (path === '/aliases') {
        html = await aliasesPage(env);
      } else if (path === '/month-end') {
        html = await monthEndPage(env);
      } else if (path === '/adjustments') {
        html = await adjustmentsPage(env, url.searchParams);
      } else if (path === '/payments/import') {
        html = await batchPaymentPage(env);
      } else if (path.match(/^\/statement\/(\d+)$/)) {
        const id = parseInt(path.match(/^\/statement\/(\d+)$/)[1]);
        html = await statementPage(env, id);
      } else {
        html = htmlShell('Not Found', '', '<h1>404</h1><p>Page not found.</p><a href="/" class="btn btn-primary">Go to Dashboard</a>');
      }
    } catch (e) {
      html = htmlShell('Error', '', `<h1>Error</h1><div class="card flag-card"><pre style="white-space:pre-wrap">${e.stack || e.message}</pre></div>`);
    }

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }
};
