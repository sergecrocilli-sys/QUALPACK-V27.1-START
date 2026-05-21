/* ================================================================
   QualPack V27 START — Admin externalisé
   - PIN Admin
   - Import Excel / preview / validation
   - Formulaires rapides V27 START
   ================================================================ */

/* ================================================================
   ADMINISTRATION — PIN & ÉCRAN ADMIN
   ================================================================ */

const ADMIN_PIN_KEY = 'qp_admin_pin';
const DEFAULT_PIN   = '1234';

/* Récupère le PIN stocké (ou le défaut) */
function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
}

let _pinBuffer = '';

function togglePinChangeForm() {
  document.getElementById('pin-change-form').classList.toggle('open');
  document.getElementById('pin-change-error').textContent = '';
  document.getElementById('pin-current').value = '';
  document.getElementById('pin-new1').value = '';
  document.getElementById('pin-new2').value = '';
}

/* Admin : passe par le PIN avant d'afficher l'écran */
function openAdmin(btn) {
  window._adminNavBtn = btn;
  showPinOverlay();
}

function showPinOverlay() {
  _pinBuffer = '';
  updatePinDots();
  document.getElementById('pin-error-msg').textContent = '';
  document.getElementById('pin-overlay').classList.remove('hidden');
}

function hidePinOverlay() {
  document.getElementById('pin-overlay').classList.add('hidden');
  _pinBuffer = '';
  updatePinDots();
}

function updatePinDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pd' + i);
    if (!dot) continue;
    dot.classList.remove('filled', 'error');
    if (i < _pinBuffer.length) dot.classList.add('filled');
  }
}

function pinKey(digit) {
  if (_pinBuffer.length >= 4) return;
  _pinBuffer += digit;
  updatePinDots();
  if (_pinBuffer.length === 4) {
    setTimeout(validatePin, 120);
  }
}

function pinDel() {
  if (_pinBuffer.length > 0) {
    _pinBuffer = _pinBuffer.slice(0, -1);
    updatePinDots();
    document.getElementById('pin-error-msg').textContent = '';
  }
}

function pinCancel() {
  hidePinOverlay();
  window._adminNavBtn = null;
}

function validatePin() {
  if (_pinBuffer === getAdminPin()) {
    hidePinOverlay();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById('screen-admin').classList.add('active');
    if (window._adminNavBtn) window._adminNavBtn.classList.add('active');
    renderAdminCatalogue();
    renderAdminOperateurs();
    refreshSampleSizeUI();
    refreshBalanceRefUI();
    if (typeof adminV27RefreshLists === 'function') adminV27RefreshLists();
    if (typeof adminV27RenderRegisteredLists === 'function') adminV27RenderRegisteredLists();
    if (typeof qpDemoRenderResetPanel === 'function') qpDemoRenderResetPanel();
  } else {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById('pd' + i);
      if (!dot) continue;
      dot.classList.remove('filled');
      dot.classList.add('error');
    }
    document.getElementById('pin-error-msg').textContent = 'Code incorrect — réessayez';
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        const dot = document.getElementById('pd' + i);
        if (dot) dot.classList.remove('error');
      }
      _pinBuffer = '';
      updatePinDots();
    }, 800);
  }
}

function saveNewPin() {
  const current = document.getElementById('pin-current').value.trim();
  const new1    = document.getElementById('pin-new1').value.trim();
  const new2    = document.getElementById('pin-new2').value.trim();
  const errEl   = document.getElementById('pin-change-error');

  if (current !== getAdminPin()) {
    errEl.textContent = 'PIN actuel incorrect';
    return;
  }
  if (new1.length !== 4 || !/^\d{4}$/.test(new1)) {
    errEl.textContent = 'Le nouveau PIN doit contenir exactement 4 chiffres';
    return;
  }
  if (new1 !== new2) {
    errEl.textContent = 'Les deux PIN ne correspondent pas';
    return;
  }
  localStorage.setItem(ADMIN_PIN_KEY, new1);
  document.getElementById('pin-change-form').classList.remove('open');
  errEl.textContent = '';
  toast('PIN modifié avec succès ✓', 'ok');
}

function resetPinToDefault() {
  if (!confirm('Remettre le PIN par défaut (1234) ?')) return;
  localStorage.removeItem(ADMIN_PIN_KEY);
  toast('PIN remis à 1234', 'ok');
}

/* ================================================================
   V12 — ADMIN : GESTION CLIENTS/PRODUITS/OPÉRATEURS
   ================================================================ */

/* ── Calcul TNE pour aperçu ── */
function calcTNEdisplay(qn) {
  const s = calcSeuils(qn);
  return `TU1: ${s.tu1}g · TU2: ${s.tu2}g · TNE: ${s.tne}g`;
}

/* ── Import Excel/CSV produits ── */
async function importProduitsExcel(input) {
  const file = input.files[0];
  if (!file) return;
  await window._libsReady;
  const XLSXLib = getXLSXLib();
  if (!XLSXLib) { toast('Librairie XLSX non disponible', 'err'); return; }

  try {
    const data  = await file.arrayBuffer();
    const wb    = XLSXLib.read(data, { type: 'array' });

    const norm = k => String(k || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const readSheet = (sheetName, range = null) => {
      const target = wb.SheetNames.find(n => String(n || '').trim().toUpperCase() === String(sheetName || '').trim().toUpperCase());
      if (!target) return [];
      const ws = wb.Sheets[target];
      if (!ws) return [];
      const opts = { defval: '' };
      if (range !== null) opts.range = range;
      let rows = XLSXLib.utils.sheet_to_json(ws, opts);
      if (!rows.length && range !== null) rows = XLSXLib.utils.sheet_to_json(ws, { defval: '' });
      return rows.map(r => {
        const out = {};
        Object.entries(r || {}).forEach(([k, v]) => { out[norm(k)] = v; });
        return out;
      });
    };

   let normalized = [];

for (let startRow = 0; startRow <= 10; startRow++) {
  const testRows = readSheet('IMPORT_APP', startRow);
  const first = testRows[0] || {};

  const hasClient =
    'CLIENT_FINAL' in first ||
    'CLIENT' in first ||
    'ID_CLIENT' in first;

  const hasProduit =
    'PRODUIT' in first ||
    'NOM_PRODUIT' in first;

  const hasQN =
    'QN_G' in first ||
    'QN' in first ||
    'POIDS_NET_G' in first;

  if (hasProduit && hasQN) {
    normalized = testRows;
    console.log('IMPORT_APP détecté à partir de la ligne Excel :', startRow + 1);
    break;
  }
}

if (!normalized.length) {
  toast('Colonnes requises : PRODUIT, QN_G', 'err');
  return;
}
    const first = normalized[0] || {};

const hasProduit = 'PRODUIT' in first || 'NOM_PRODUIT' in first;
const hasQN = 'QN_G' in first || 'QN' in first || 'POIDS_NET_G' in first;

if (!hasProduit || !hasQN) {
  toast('Colonnes requises : PRODUIT, QN_G', 'err');
  return;
}

const preview = normalized.map(r => {
  const parseNumber = (v) => {
    if (v === '' || v == null) return null;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  };

  const parseIntOrNull = (v) => {
    if (v === '' || v == null) return null;
    const n = parseInt(String(v).replace(',', '.'), 10);
    return Number.isFinite(n) ? n : null;
  };

  const actifRaw = String(r.ACTIF ?? 'OUI').trim().toUpperCase();
  const actif = !['NON', 'NO', 'FALSE', '0', 'INACTIF'].includes(actifRaw);

  const qn = parseNumber(r.QN_G ?? r.QN ?? '');

  return {
  client: String(r.CLIENT_FINAL || r.CLIENT || r.ID_CLIENT || '').trim() || 'Non spécifié',
  nom: String(r.PRODUIT || r.NOM_PRODUIT || '').trim(),
  qn: qn,
  tare_fixe_g: parseNumber(r.TARE_FIXE_G ?? r.TARE_FIXE ?? r.TARE ?? ''),
  ligne_prod: String(r.LIGNE_PROD_HABITUELLE || r.LIGNE_PROD || r.LIGNE || '').trim(),
  detecteur: String(r.DETECTEUR_HABITUEL || r.DETECTEUR || r.EQUIPEMENT || '').trim(),
  quantite_prevue_defaut: parseIntOrNull(
    r.QUANTITE_PREVUE_PAR_DEFAUT ??
    r.QUANTITE_PREVUE ??
    r.QTE_PREVUE ??
    ''
  ),
  actif
};
}).filter(r => r.actif && r.nom && r.qn > 0);

    const lignesRows = readSheet('LIGNES', 3);
    const explicitLines = lignesRows.map((r, idx) => ({
      id: String(r.ID_LIGNE || r.ID || r.CODE || `L${idx+1}`).trim(),
      nom: String(r.NOM_LIGNE || r.LIGNE_PROD || r.LIGNE || r.NOM || '').trim()
    })).filter(r => r.nom);

    const detRows = readSheet('DETECTEURS', 3);
    const detecteurRefs = detRows.map((r, idx) => ({
      id: String(r.ID_DETECTEUR || r.ID || `DET${idx+1}`).trim(),
      detecteur: String(r.NOM_DETECTEUR || r.DETECTEUR || r.EQUIPEMENT || r.NOM || '').trim(),
      ligne_prod: String(r.LIGNE_PROD || r.LIGNE || '').trim()
    })).filter(r => r.detecteur || r.ligne_prod);

    if (!preview.length) { toast('Aucune ligne valide trouvée', 'err'); return; }

    _importLinesData = explicitLines;
    _importDetecteursRefData = detecteurRefs;
    renderImportPreview(preview);
  } catch(e) {
    console.error(e);
    toast('Erreur lecture fichier', 'err');
  }
}


let _importPreviewData = [];
let _importLinesData = [];
let _importDetecteursRefData = [];

function renderImportPreview(rows) {
  _importPreviewData = rows;
  const div = document.getElementById('import-preview');

  // Regrouper par client
  const byClient = {};
  rows.forEach(r => {
    if (!byClient[r.client]) byClient[r.client] = [];
    byClient[r.client].push(r);
  });

  const importedLinesCount = new Set([...(rows || []).map(r => String(r.ligne_prod || '').trim()).filter(Boolean), ..._importLinesData.map(r => String(r.nom || '').trim()).filter(Boolean)]).size;
  let html = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
    ${rows.length} produit(s) · ${Object.keys(byClient).length} client(s) détecté(s)${importedLinesCount ? ' · ' + importedLinesCount + ' ligne(s)' : ''}
  </div>`;

  Object.entries(byClient).forEach(([cli, prods]) => {
    html += `<div style="margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:var(--blue-light);margin-bottom:6px">${cli}</div>`;
    prods.forEach(p => {
      const s = calcSeuils(p.qn);
      html += `<div class="prod-row" style="margin-bottom:4px">
        <div class="pr-info">
          <div class="pr-name">${p.nom}</div>
          <div class="pr-meta">Qn ${p.qn}g · ${calcTNEdisplay(p.qn)}
            ${p.ligne_prod ? ' · ' + p.ligne_prod : ''}${p.detecteur ? ' · ' + p.detecteur : ''}
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
  });

  html += `<div style="display:flex;gap:8px;margin-top:12px">
    <button class="btn btn-primary" style="flex:1" onclick="confirmImportProduits()">
      ✓ Valider l'import
    </button>
    <button class="btn btn-secondary" style="flex:0.5" onclick="cancelImport()">
      Annuler
    </button>
  </div>`;

  div.innerHTML = html;
  div.style.display = 'block';
}

function cancelImport() {
  document.getElementById('import-preview').style.display = 'none';
  document.getElementById('file-import-produits').value = '';
  _importPreviewData = [];
  _importLinesData = [];
  _importDetecteursRefData = [];
}

async function confirmImportProduits() {
  if (!_importPreviewData.length) return;

  const importLineLimitCheck = adminV27CheckImportLineLimit();
  if (!importLineLimitCheck.ok) {
    toast(importLineLimitCheck.message, 'err');
    adminV27SetStatus(importLineLimitCheck.message, 'err');
    return;
  }

  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Import en cours...';

  try {
    const normalizeKey = v => String(v || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Nettoyage catalogue du site actif avant réimport
await fetch(`${SB_URL}/rest/v1/produits?${qpSiteEqParam()}`, {
  method: 'DELETE',
  headers: SB_HDR
});

await fetch(`${SB_URL}/rest/v1/lignes?${qpSiteEqParam()}`, {
  method: 'DELETE',
  headers: SB_HDR
});

await fetch(`${SB_URL}/rest/v1/clients?${qpSiteEqParam()}`, {
  method: 'DELETE',
  headers: SB_HDR
});

// Nettoyage local du site actif
CATALOGUE = {};
localStorage.removeItem(qpCacheKey('qp_catalogue'));
saveStoredLineCatalogue([]);
saveStoredDetecteurCatalogue([]);
saveLineDetecteurMap({});
    
    const existingClientsRes = await fetch(`${SB_URL}/rest/v1/clients?select=id,nom&${qpSiteEqParam()}`, { headers: SB_HDR });
    if (!existingClientsRes.ok) throw new Error('Lecture clients impossible');
    const existingClients = await existingClientsRes.json();
    const clientMap = {};
    const clientByNorm = {};
    const duplicateClientIdsToDelete = [];
    existingClients.forEach(c => {
      const name = String(c.nom || '').trim();
      if (!name) return;
      const nkey = normalizeTextKey(name);
      if (!clientByNorm[nkey]) {
        clientByNorm[nkey] = { id: c.id, nom: name };
        clientMap[name] = c.id;
      } else {
        duplicateClientIdsToDelete.push(c.id);
      }
    });

    for (const duplicateClientId of duplicateClientIdsToDelete) {
      try {
        await fetch(`${SB_URL}/rest/v1/clients?id=eq.${encodeURIComponent(duplicateClientId)}&${qpSiteEqParam()}`, { method: 'DELETE', headers: SB_HDR });
      } catch (e) {
        console.warn('delete duplicate client ignored:', duplicateClientId, e);
      }
    }

    const clientNames = [...new Set(_importPreviewData.map(r => r.client))];
    for (const nom of clientNames) {
      const normNom = normalizeTextKey(nom);
      if (clientMap[nom]) continue;
      if (clientByNorm[normNom]?.id) { clientMap[nom] = clientByNorm[normNom].id; continue; }
      const id = 'cli_' + qpSafeIdPart(QUALPACK_SITE_ID) + '_' + normalizeKey(nom).replace(/[^a-z0-9]/g,'_');
      const res = await fetch(`${SB_URL}/rest/v1/clients`, {
        method: 'POST',
        headers: { ...SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(qpWithSite({ id, nom }))
      });
      if (res.ok) {
        const data = await res.json();
        clientMap[nom] = data[0]?.id || id;
        clientByNorm[normNom] = { id: clientMap[nom], nom };
      } else {
        const r2 = await fetch(`${SB_URL}/rest/v1/clients?nom=ilike.${encodeURIComponent(nom)}&select=id,nom&${qpSiteEqParam()}`, { headers: SB_HDR });
        const d2 = await r2.json();
        const match = (d2 || []).find(x => normalizeTextKey(x.nom) === normNom);
        clientMap[nom] = match?.id || id;
        clientByNorm[normNom] = { id: clientMap[nom], nom: match?.nom || nom };
      }
    }

    const lineDetecteurRows = [
      ..._importPreviewData,
      ..._importDetecteursRefData.map(r => ({ ligne_prod: r.ligne_prod, detecteur: r.detecteur }))
    ];
    const lineDetecteurMap = mergeLineDetecteurMappings(lineDetecteurRows);

    const importedLineNames = [
      ..._importLinesData.map(r => r.nom),
      ..._importPreviewData.map(r => r.ligne_prod),
      ...Object.keys(lineDetecteurMap)
    ].filter(Boolean);
    saveStoredLineCatalogue(importedLineNames);
    
   const lignesPayload = Array.from(
  new Set(importedLineNames.map(v => String(v || '').trim()).filter(Boolean))
).map(nom => ({
  nom,
  detecteur_defaut: lineDetecteurMap[nom] || null,
  site_id: QUALPACK_SITE_ID
}));

    try {
      if (lignesPayload.length) {
        const resLignes = await fetch(`${SB_URL}/rest/v1/lignes`, {
          method: 'POST',
          headers: { ...SB_HDR, 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify(lignesPayload)
        });
        if (!resLignes.ok) {
          const txt = await resLignes.text();
          console.warn('Upsert lignes ignoré:', txt);
        }
      }
    } catch (e) {
      console.warn('Upsert lignes exception ignorée:', e);
    }

    const uniqueImportRows = [];
    const seenImportKeys = new Set();
    (_importPreviewData || []).forEach(r => {
      const client_id = clientMap[r.client];
      const importKey = `${client_id}||${normalizeTextKey(r.nom)}`;
      if (!client_id || !normalizeTextKey(r.nom) || seenImportKeys.has(importKey)) return;
      seenImportKeys.add(importKey);
      uniqueImportRows.push(r);
    });

    const existingProdsRes = await fetch(`${SB_URL}/rest/v1/produits?select=id,client_id,nom&${qpSiteEqParam()}`, { headers: SB_HDR });
    if (!existingProdsRes.ok) throw new Error('Lecture produits impossible');
    const existingProds = await existingProdsRes.json();
    const groupedExisting = {};
    existingProds.forEach(p => {
      const key = `${p.client_id}||${normalizeKey(p.nom)}`;
      if (!groupedExisting[key]) groupedExisting[key] = [];
      groupedExisting[key].push(p);
    });

    let importedCount = 0;
    for (const r of uniqueImportRows) {
      const client_id = clientMap[r.client];
      const naturalKey = `${client_id}||${normalizeKey(r.nom)}`;
      const existingList = groupedExisting[naturalKey] || [];
      const targetId = existingList[0]?.id || null;

      if (existingList.length > 1) {
        for (const dup of existingList.slice(1)) {
          try {
            await fetch(`${SB_URL}/rest/v1/produits?id=eq.${encodeURIComponent(dup.id)}&${qpSiteEqParam()}`, { method: 'DELETE', headers: SB_HDR });
          } catch (e) {
            console.warn('delete duplicate produit ignored:', dup.id, e);
          }
        }
      }

      const payload = {
  site_id: QUALPACK_SITE_ID,
  client_id,
  nom: r.nom,
  qn: r.qn,
  tare_fixe_g: Number.isFinite(r.tare_fixe_g) ? r.tare_fixe_g : null,
  ligne_prod: r.ligne_prod || null,
  detecteur: r.detecteur || lineDetecteurMap[r.ligne_prod] || null,
  quantite_prevue_defaut: Number.isFinite(r.quantite_prevue_defaut)
    ? r.quantite_prevue_defaut
    : null,
  actif: r.actif !== false
};

      if (targetId) {
        let resPatch = await fetch(`${SB_URL}/rest/v1/produits?id=eq.${encodeURIComponent(targetId)}&${qpSiteEqParam()}`, {
          method: 'PATCH',
          headers: { ...SB_HDR, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
          body: JSON.stringify(payload)
        });
        if (!resPatch.ok) {
          const err = await resPatch.text();
          if (/detecteur/i.test(err)) {
            const { detecteur, ...fallback } = payload;
            resPatch = await fetch(`${SB_URL}/rest/v1/produits?id=eq.${encodeURIComponent(targetId)}&${qpSiteEqParam()}`, {
              method: 'PATCH',
              headers: { ...SB_HDR, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
              body: JSON.stringify(fallback)
            });
            if (!resPatch.ok) throw new Error(await resPatch.text());
          } else {
            throw new Error(err);
          }
        }
      } else {
        const createId = 'prod_' + normalizeKey(r.nom).replace(/[^a-z0-9]/g,'_') + '_' + client_id;
        let resCreate = await fetch(`${SB_URL}/rest/v1/produits`, {
          method: 'POST',
          headers: { ...SB_HDR, 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify([{ id: createId, ...payload }])
        });
        if (!resCreate.ok) {
          const err = await resCreate.text();
          if (/detecteur/i.test(err)) {
            const { detecteur, ...fallback } = payload;
            resCreate = await fetch(`${SB_URL}/rest/v1/produits`, {
              method: 'POST',
              headers: { ...SB_HDR, 'Prefer': 'resolution=merge-duplicates' },
              body: JSON.stringify([{ id: createId, ...fallback }])
            });
            if (!resCreate.ok) throw new Error(await resCreate.text());
          } else {
            throw new Error(err);
          }
        }
      }

      groupedExisting[naturalKey] = [{ id: targetId || ('prod_' + normalizeKey(r.nom).replace(/[^a-z0-9]/g,'_') + '_' + client_id), client_id, nom: r.nom }];
      importedCount += 1;
    }

    populateLineSelect('inp-ligne');
    populateLineSelect('d-ligne');
    populateDetecteurSelect();
    toast(`${importedCount} produit(s) importé(s) ✓`, 'ok');
    cancelImport();
    await loadCatalogueFromSupabase();
    renderAdminCatalogue();

  } catch(e) {
    console.error(e);
    toast('Erreur import : ' + e.message, 'err');
    btn.disabled = false;
    btn.textContent = '✓ Valider l\'import';
  }
}

/* ── Télécharger le template Excel catalogue V25.1 ── */
async function downloadTemplate() {
  await window._libsReady;
  const XLSXLib = getXLSXLib();
  if (!XLSXLib) { toast('XLSX indisponible', 'err'); return; }

  const data = [
    [
      'CLIENT_FINAL',
      'PRODUIT',
      'QN_G',
      'TARE_FIXE_G',
      'LIGNE_PROD_HABITUELLE',
      'DETECTEUR_HABITUEL',
      'QUANTITE_PREVUE_PAR_DEFAUT',
      'ACTIF'
    ]
  ];

  const wb = XLSXLib.utils.book_new();
  const ws = XLSXLib.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 24 },
    { wch: 28 },
    { wch: 10 },
    { wch: 14 },
    { wch: 24 },
    { wch: 24 },
    { wch: 28 },
    { wch: 10 }
  ];

  XLSXLib.utils.book_append_sheet(wb, ws, 'IMPORT_APP');
  XLSXLib.writeFile(wb, `QualPack_Template_${QUALPACK_SITE_ID}.xlsx`);
}

/* ── Afficher catalogue dans l'admin ── */
function renderAdminCatalogue() {
  const div = document.getElementById('admin-catalogue-list');
  if (!div) return;
  const clients = Object.keys(CATALOGUE).sort();
  if (!clients.length) {
    div.innerHTML = '<div style="color:var(--text-muted);font-size:12px;padding:8px">Aucun produit configuré</div>';
    return;
  }
  let html = '';
  clients.forEach(cli => {
    const prods = CATALOGUE[cli] || [];
    html += `<div style="margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:var(--blue-light);letter-spacing:.6px;text-transform:uppercase;margin-bottom:6px">
        ${cli} <span style="color:var(--text-muted);font-weight:400">(${prods.length} produit${prods.length>1?'s':''})</span>
      </div>`;
    prods.forEach(p => {
      html += `<div class="prod-row" style="margin-bottom:4px">
        <div class="pr-info">
          <div class="pr-name">${p.nom}</div>
          <div class="pr-meta">Qn ${p.qn}g · TU1 ${p.tu1}g · TU2 ${p.tu2}g · TNE ${p.tne}g
            ${p.ligne_prod ? ' · ' + p.ligne_prod : ''}${p.detecteur ? ' · ' + p.detecteur : ''}
          </div>
        </div>
        <button onclick="deleteProduit('${p.id}','${p.nom}')"
          style="background:var(--red-bg);color:var(--red-text);border:1px solid var(--red);
          border-radius:var(--r-sm);padding:4px 10px;font-size:11px;cursor:pointer">
          Suppr.
        </button>
      </div>`;
    });
    html += '</div>';
  });
  div.innerHTML = html;
}

async function deleteProduit(id, nom) {
  if (!confirm(`Supprimer le produit "${nom}" ?`)) return;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/produits?id=eq.${id}&${qpSiteEqParam()}`, {
      method: 'DELETE', headers: SB_HDR
    });
    if (!res.ok) throw new Error(res.status);
    toast(`"${nom}" supprimé`, 'ok');
    await loadCatalogueFromSupabase();
    renderAdminCatalogue();
  } catch(e) {
    toast('Erreur suppression', 'err');
  }
}

/* ── Gestion opérateurs ── */
async function addOperateur() {
  const nomEl = document.getElementById('inp-op-nom');
  const roleEl = document.getElementById('sel-op-role');
  const nom  = nomEl ? nomEl.value.trim() : '';
  const role = roleEl ? roleEl.value : 'Operateur';

  reinforceOperateurInputVisibility();

  if (!nom) { toast('Saisissez un nom', 'err'); return; }

  const id = 'op_' + nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g,'_') + '_' + Date.now();
  const payload = { id, nom, role, actif: true, site_id: QUALPACK_SITE_ID };

  upsertLocalOperateur(payload);
  renderAdminOperateurs();
  populateOpSelects();
  if (nomEl) nomEl.value = '';
  reinforceOperateurInputVisibility();

  if (!navigator.onLine) {
    toast(nom + ' ajouté localement (hors ligne)', 'ok');
    return;
  }

  try {
    const res = await fetch(`${SB_URL}/rest/v1/operateurs`, {
      method: 'POST',
      headers: { ...SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('addOperateur error:', res.status, errText);
      toast(nom + ' ajouté localement — synchro serveur à vérifier', 'ok');
      return;
    }

    await loadCatalogueFromSupabase();
    renderAdminOperateurs();
    populateOpSelects();
    toast(nom + ' ajouté ✓', 'ok');
  } catch(e) {
    console.error('addOperateur exception:', e);
    toast(nom + ' ajouté localement — synchro serveur à vérifier', 'ok');
  }
}

async function deleteOperateur(id, nom) {
  if (!confirm(`Retirer l'opérateur "${nom}" ?`)) return;

  removeLocalOperateur(id);
  renderAdminOperateurs();
  populateOpSelects();

  if (!navigator.onLine) {
    toast(`${nom} retiré localement`, 'ok');
    return;
  }

  try {
    const res = await fetch(`${SB_URL}/rest/v1/operateurs?id=eq.${id}&${qpSiteEqParam()}`, {
      method: 'PATCH',
      headers: SB_HDR,
      body: JSON.stringify({ actif: false })
    });
    if (!res.ok) throw new Error(res.status);
    await loadCatalogueFromSupabase();
    renderAdminOperateurs();
    populateOpSelects();
    toast(`${nom} désactivé`, 'ok');
  } catch(e) {
    console.error('deleteOperateur error:', e);
    toast(`${nom} retiré localement — synchro serveur à vérifier`, 'ok');
  }
}

function renderAdminOperateurs() {
  const div = document.getElementById('admin-op-list');
  if (!div) return;
  if (!OPERATEURS.length) {
    div.innerHTML = '<div style="color:var(--text-muted);font-size:12px;padding:8px">Aucun opérateur configuré</div>';
    return;
  }
  div.innerHTML = OPERATEURS.map(op => `
    <div class="admin-row">
      <div>
        <div class="admin-row-label">${op.nom}</div>
        <div class="admin-row-sub">${op.role}</div>
      </div>
      <button onclick="deleteOperateur('${op.id}','${op.nom}')"
        style="background:var(--red-bg);color:var(--red-text);border:1px solid var(--red);
        border-radius:var(--r-sm);padding:4px 10px;font-size:11px;cursor:pointer">
        Retirer
      </button>
    </div>`).join('');
}


async function manualSync() {
  const btn = document.getElementById('btn-sync-history');
  const initialText = btn ? btn.textContent : '';

  try {
    if (!navigator.onLine) {
      toast('Connexion requise pour synchroniser', 'err');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Synchronisation...';
    }

    const syncFn =
      window.syncPending ||
      (typeof syncPending === 'function' ? syncPending : null);

    if (!syncFn) {
      toast('Synchronisation non disponible', 'err');
      return;
    }

    const count = await syncFn(true);

    if (typeof loadFromDB === 'function') {
      await loadFromDB();
    }

    if (typeof renderHist === 'function') {
      await renderHist();
    }

    if (document.getElementById('screen-dashboard')?.classList.contains('active')) {
      if (typeof renderDashboard === 'function') {
        renderDashboard();
      }
    }

    if ((count || 0) > 0) {
      toast(count + ' élément(s) synchronisé(s)', 'ok');
    } else {
      toast('Aucune donnée en attente', 'ok');
    }

  } catch (e) {
    console.error('manualSync error:', e);
    toast('Erreur de synchronisation', 'err');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = initialText || '🔄 Synchroniser';
    }
  }
}


/* ================================================================
   ADMIN V27 START — formulaires rapides terrain
   ================================================================ */

function adminV27SetStatus(message, type = 'info') {
  const el = document.getElementById('admin-v27-status');
  if (!el) return;
  const colors = {
    info: 'var(--text-muted)',
    ok: 'var(--green-text)',
    err: 'var(--red-text)',
    warn: 'var(--orange-text)'
  };
  el.style.color = colors[type] || colors.info;
  el.textContent = message || '';
}

function adminV27Text(id) {
  return String(document.getElementById(id)?.value || '').trim();
}

function adminV27Number(id) {
  const raw = String(document.getElementById(id)?.value || '').replace(',', '.').trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function adminV27Slug(value) {
  if (typeof qpSafeIdPart === 'function') return qpSafeIdPart(value);
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'item';
}

function adminV27Id(prefix, value) {
  const site = (typeof QUALPACK_SITE_ID !== 'undefined' && QUALPACK_SITE_ID) ? QUALPACK_SITE_ID : 'site';
  return `${prefix}_${adminV27Slug(site)}_${adminV27Slug(value)}`;
}

function adminV27GetClientNames() {
  try { return Object.keys(CATALOGUE || {}).sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'})); }
  catch (e) { return []; }
}

function adminV27RefreshLists() {
  const clients = adminV27GetClientNames();
  const lines = (typeof getStoredLineCatalogue === 'function') ? getStoredLineCatalogue() : [];
  const dets = (typeof getStoredDetecteurCatalogue === 'function') ? getStoredDetecteurCatalogue() : [];
const produits = [];
try {
  Object.values(CATALOGUE || {}).forEach(arr => {
    (Array.isArray(arr) ? arr : []).forEach(p => {
      if (p && p.nom) produits.push(p.nom);
    });
  });
  adminV27GetStartRows('produits').forEach(p => {
    const nom = p && (p.label || p.nom);
    if (nom) produits.push(nom);
  });
} catch (e) {
  console.warn('adminV27RefreshLists produits:', e);
}

  const setOptions = (id, values) => {
    const dl = document.getElementById(id);
    if (!dl) return;
    dl.innerHTML = (values || []).map(v => `<option value="${escapeHtml ? escapeHtml(v) : String(v).replace(/"/g, '&quot;')}"></option>`).join('');
  };

setOptions('admin-v27-clients-list', clients);
setOptions('admin-v27-lignes-list', lines);
setOptions('admin-v27-detecteurs-list', dets);
setOptions('admin-v27-produits-list', [...new Set(produits)].sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'})));
}

function adminV27Esc(value) {
  if (typeof escapeHtml === 'function') return escapeHtml(value);
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


function adminV27HiddenKey(kind) {
  const site = (typeof QUALPACK_SITE_ID !== 'undefined' && QUALPACK_SITE_ID) ? QUALPACK_SITE_ID : 'default';
  return `qp_v27_hidden_${kind}_${site}`;
}

function adminV27Norm(value) {
  return String(value || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function adminV27GetHidden(kind) {
  try {
    const raw = JSON.parse(localStorage.getItem(adminV27HiddenKey(kind)) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function adminV27Hide(kind, label) {
  const n = adminV27Norm(label);
  if (!n) return;
  const list = adminV27GetHidden(kind);
  if (!list.includes(n)) list.push(n);
  localStorage.setItem(adminV27HiddenKey(kind), JSON.stringify(list));
}

function adminV27IsHidden(kind, label) {
  return adminV27GetHidden(kind).includes(adminV27Norm(label));
}


function adminV27StartKey(kind) {
  const site = (typeof QUALPACK_SITE_ID !== 'undefined' && QUALPACK_SITE_ID) ? QUALPACK_SITE_ID : 'default';
  return `qp_v27_start_${kind}_${site}`;
}

function adminV27GetStartRows(kind) {
  try {
    const rows = JSON.parse(localStorage.getItem(adminV27StartKey(kind)) || '[]');
    return Array.isArray(rows) ? rows : [];
  } catch (e) {
    return [];
  }
}

function adminV27SaveStartRows(kind, rows) {
  localStorage.setItem(adminV27StartKey(kind), JSON.stringify(Array.isArray(rows) ? rows : []));
}

function adminV27TrackStartRow(kind, row) {
  if (!row) return;
  const rows = adminV27GetStartRows(kind);
  const key = adminV27Norm(row.key || row.id || row.label || row.nom);
  if (!key) return;
  const next = rows.filter(r => adminV27Norm(r.key || r.id || r.label || r.nom) !== key);
  next.unshift({ ...row, key, created_at: row.created_at || new Date().toISOString() });
  adminV27SaveStartRows(kind, next.slice(0, 50));
}

function adminV27UntrackStartRow(kind, keyValue) {
  const key = adminV27Norm(keyValue);
  adminV27SaveStartRows(kind, adminV27GetStartRows(kind).filter(r => adminV27Norm(r.key || r.id || r.label || r.nom) !== key));
}

async function adminV27SoftRemoveOperateur(id, nom) {
  if (typeof deleteOperateur === 'function') {
    await deleteOperateur(id, nom);
  }
  adminV27Hide('operateurs', nom);
  adminV27UntrackStartRow('operateurs', id || nom);
  await adminV27ReloadAfterChange();
}

async function adminV27SoftRemoveClient(nom) {
  if (!confirm(`Retirer le client "${nom}" de la configuration rapide ?\n\nAucune suppression physique Supabase ne sera réalisée.`)) return;
  adminV27Hide('clients', nom);
  adminV27UntrackStartRow('clients', nom);
  try {
    if (navigator.onLine) {
      const res = await fetch(`${SB_URL}/rest/v1/clients?select=id,nom&nom=eq.${encodeURIComponent(nom)}&${qpSiteEqParam()}`, { headers: SB_HDR });
      if (res.ok) {
        const rows = await res.json();
        const clientId = rows && rows[0] && rows[0].id;
        if (clientId) {
          await fetch(`${SB_URL}/rest/v1/produits?client_id=eq.${encodeURIComponent(clientId)}&${qpSiteEqParam()}`, {
            method: 'PATCH',
            headers: { ...SB_HDR, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ actif: false })
          }).catch(e => console.warn('Désactivation produits client ignorée:', e));
        }
      }
    }
  } catch (e) {
    console.warn('adminV27SoftRemoveClient warning:', e);
  }
  if (CATALOGUE && CATALOGUE[nom]) delete CATALOGUE[nom];
  try { localStorage.setItem(qpCacheKey('qp_catalogue'), JSON.stringify(CATALOGUE || {})); } catch(e) {}
  await adminV27ReloadAfterChange();
  toast('Client retiré de la configuration rapide', 'ok');
}

async function adminV27SoftRemoveLigne(nom) {
  if (!confirm(`Supprimer la ligne "${nom}" de la configuration rapide ?\n\nAucune suppression physique Supabase ne sera réalisée.`)) return;
  adminV27Hide('lignes', nom);
  adminV27UntrackStartRow('lignes', nom);
  try {
    if (typeof getStoredLineCatalogue === 'function' && typeof saveStoredLineCatalogue === 'function') {
      saveStoredLineCatalogue(getStoredLineCatalogue().filter(v => adminV27Norm(v) !== adminV27Norm(nom)));
    }
    if (typeof getLineDetecteurMap === 'function' && typeof saveLineDetecteurMap === 'function') {
      const map = getLineDetecteurMap();
      Object.keys(map || {}).forEach(k => { if (adminV27Norm(k) === adminV27Norm(nom)) delete map[k]; });
      saveLineDetecteurMap(map);
    }
  } catch(e) { console.warn('adminV27SoftRemoveLigne local warning:', e); }
  await adminV27ReloadAfterChange();
  toast('Ligne supprimée de la configuration rapide', 'ok');
}

async function adminV27SoftRemoveProduit(id, nom, client) {
  if (!confirm(`Supprimer le produit "${nom}" de la configuration rapide ?\n\nAucune suppression physique Supabase ne sera réalisée.`)) return;
  adminV27Hide('produits', `${client}||${nom}`);
  adminV27UntrackStartRow('produits', id || `${client}||${nom}`);
  try {
    if (navigator.onLine && id) {
      await adminV27Patch('produits', `id=eq.${encodeURIComponent(id)}`, { actif: false });
    }
  } catch (e) {
    console.warn('adminV27SoftRemoveProduit Supabase warning:', e);
  }
  try {
    if (CATALOGUE && CATALOGUE[client]) {
      CATALOGUE[client] = (CATALOGUE[client] || []).filter(p => String(p.id || '') !== String(id) && adminV27Norm(p.nom) !== adminV27Norm(nom));
      if (!CATALOGUE[client].length) delete CATALOGUE[client];
      localStorage.setItem(qpCacheKey('qp_catalogue'), JSON.stringify(CATALOGUE || {}));
    }
  } catch(e) {}
  await adminV27ReloadAfterChange();
  toast('Produit supprimé de la configuration rapide', 'ok');
}

function adminV27RenderMiniList(id, rows, emptyLabel) {
  const el = document.getElementById(id);
  if (!el) return;
  const list = Array.isArray(rows) ? rows.filter(Boolean).slice(0, 10) : [];
  if (!list.length) {
    el.innerHTML = `<div class="admin-v27-list-empty">${adminV27Esc(emptyLabel)}</div>`;
    return;
  }
  el.innerHTML = list.map(row => {
    const label = typeof row === 'string' ? row : (row.label || row.nom || '—');
    const meta = typeof row === 'string' ? '' : (row.meta || '');
    const action = typeof row === 'string' ? '' : (row.action || '');
    const actionLabel = typeof row === 'string' ? 'Retirer' : (row.actionLabel || 'Retirer');
    return `<div class="admin-v27-list-item admin-v27-list-item-action">
      <span>${adminV27Esc(label)}</span>
      ${meta ? `<small>${adminV27Esc(meta)}</small>` : ''}
      ${action ? `<button class="admin-v27-remove-btn" type="button" onclick="${action}">${adminV27Esc(actionLabel)}</button>` : ''}
    </div>`;
  }).join('');
}

function adminV27RenderRegisteredLists() {
  // V27 START : ces mini-listes affichent uniquement les éléments ajoutés via le Mode START
  // sur ce site/appareil. Elles ne reprennent pas tout le catalogue V26 ou l'import Excel,
  // pour garder une configuration auditeur / petit site simple et lisible.
  const ops = adminV27GetStartRows('operateurs')
    .filter(op => op && !adminV27IsHidden('operateurs', op.label || op.nom))
    .map(op => ({
      label: op.label || op.nom || 'Opérateur',
      meta: op.meta || op.role || 'Opérateur',
      action: `adminV27SoftRemoveOperateur('${adminV27Esc(op.id || op.key || '')}','${adminV27Esc(op.label || op.nom || '')}')`,
      actionLabel: 'Retirer'
    }));

  const clients = adminV27GetStartRows('clients')
    .filter(c => c && !adminV27IsHidden('clients', c.label || c.nom))
    .map(c => ({
      label: c.label || c.nom || 'Client',
      action: `adminV27SoftRemoveClient('${adminV27Esc(c.label || c.nom || '')}')`,
      actionLabel: 'Retirer'
    }));

  const lines = adminV27GetStartRows('lignes')
    .filter(l => l && !adminV27IsHidden('lignes', l.label || l.nom))
    .map(l => ({
      label: l.label || l.nom || 'Ligne',
      meta: l.meta || l.detecteur || '',
      action: `adminV27SoftRemoveLigne('${adminV27Esc(l.label || l.nom || '')}')`,
      actionLabel: 'Supprimer'
    }));

  const products = adminV27GetStartRows('produits')
    .filter(p => p && !adminV27IsHidden('produits', p.key || `${p.client || ''}||${p.label || p.nom || ''}`))
    .map(p => ({
      label: p.label || p.nom || 'Produit',
      meta: p.meta || p.client || '',
      action: `adminV27SoftRemoveProduit('${adminV27Esc(p.id || '')}','${adminV27Esc(p.label || p.nom || 'Produit')}','${adminV27Esc(p.client || '')}')`,
      actionLabel: 'Supprimer'
    }));

  adminV27RenderMiniList('admin-v27-list-operateurs', ops, 'Aucun opérateur ajouté via START');
  adminV27RenderMiniList('admin-v27-list-clients', clients, 'Aucun client ajouté via START');
  adminV27RenderMiniList('admin-v27-list-lignes', lines, 'Aucune ligne ajoutée via START');
  adminV27RenderMiniList('admin-v27-list-produits', products, 'Aucun produit ajouté via START');
}

function adminV27ApplyStartToOperationalLists() {
  // Alimente uniquement les écrans opérationnels (Pesées / Détecteur),
  // sans forcer le rendu du Catalogue complet — Import Excel.

  try {
    const ops = adminV27GetStartRows('operateurs')
      .filter(op => op && !adminV27IsHidden('operateurs', op.label || op.nom))
      .map(op => ({
        id: op.id || op.key || ('op_start_' + adminV27Slug(op.label || op.nom || 'operateur')),
        nom: op.label || op.nom,
        role: op.role || op.meta || 'Operateur',
        actif: true,
        source: 'start'
      }))
      .filter(op => op.nom);

    if (ops.length && typeof mergeOperateursLists === 'function') {
      OPERATEURS = mergeOperateursLists(ops, OPERATEURS || []);
      if (typeof saveLocalOperateursCache === 'function') saveLocalOperateursCache(OPERATEURS);
    }
  } catch (e) {
    console.warn('adminV27ApplyStartToOperationalLists opérateurs:', e);
  }

  try {
    const clients = adminV27GetStartRows('clients')
      .filter(c => c && !adminV27IsHidden('clients', c.label || c.nom))
      .map(c => c.label || c.nom)
      .filter(Boolean);

    clients.forEach(nom => {
      if (!CATALOGUE[nom]) CATALOGUE[nom] = [];
    });
  } catch (e) {
    console.warn('adminV27ApplyStartToOperationalLists clients:', e);
  }

  try {
    const lignes = adminV27GetStartRows('lignes')
      .filter(l => l && !adminV27IsHidden('lignes', l.label || l.nom))
      .map(l => l.label || l.nom)
      .filter(Boolean);

    if (lignes.length && typeof mergeStoredLineCatalogue === 'function') {
      mergeStoredLineCatalogue(lignes);
    }

    const detecteurs = adminV27GetStartRows('lignes')
      .filter(l => l && !adminV27IsHidden('lignes', l.label || l.nom))
      .map(l => l.detecteur || l.meta)
      .filter(Boolean);

    if (detecteurs.length && typeof mergeStoredDetecteurCatalogue === 'function') {
      mergeStoredDetecteurCatalogue(detecteurs);
    }

    if (typeof getLineDetecteurMap === 'function' && typeof saveLineDetecteurMap === 'function') {
      const map = getLineDetecteurMap();
      adminV27GetStartRows('lignes').forEach(l => {
        const ligne = l.label || l.nom;
        const det = l.detecteur || l.meta;
        if (ligne && det) map[ligne] = det;
      });
      saveLineDetecteurMap(map);
    }
  } catch (e) {
    console.warn('adminV27ApplyStartToOperationalLists lignes/détecteurs:', e);
  }

  try {
    const produits = adminV27GetStartRows('produits')
      .filter(p => p && !adminV27IsHidden('produits', p.label || p.nom));

    produits.forEach(p => {
      const client = p.client || p.meta || 'Non spécifié';
      if (!CATALOGUE[client]) CATALOGUE[client] = [];
      const exists = CATALOGUE[client].some(x => adminV27Norm(x.nom) === adminV27Norm(p.label || p.nom));
      if (!exists) {
        const qn = Number(p.qn || 0);
let seuils = {
  tu1: p.tu1 ?? null,
  tu2: p.tu2 ?? null,
  tne: p.tne ?? null
};

if ((!seuils.tu1 || !seuils.tu2 || !seuils.tne) && qn > 0 && typeof calcSeuils === 'function') {
  const s = calcSeuils(qn);
  seuils = {
    tu1: s.tu1 ?? null,
    tu2: s.tu2 ?? null,
    tne: s.tne ?? null
  };
}

CATALOGUE[client].push({
  id: p.id || p.key || ('prod_start_' + adminV27Slug(p.label || p.nom || 'produit')),
  nom: p.label || p.nom,
  qn: p.qn || null,
  tu1: seuils.tu1,
  tu2: seuils.tu2,
  tne: seuils.tne,
  tare_fixe_g: p.tare_fixe_g ?? null,
  ligne_prod: p.ligne_prod || '',
  detecteur: p.detecteur || '',
  quantite_prevue_defaut: p.quantite_prevue_defaut ?? null,
  actif: true,
  source: 'start'
});
      }
    });
  } catch (e) {
    console.warn('adminV27ApplyStartToOperationalLists produits:', e);
  }
}

async function adminV27ReloadAfterChange() {
  if (typeof adminV27ApplyStartToOperationalLists === 'function') {
    adminV27ApplyStartToOperationalLists();
  }

  if (typeof adminV27RefreshLists === 'function') adminV27RefreshLists();
  if (typeof adminV27RenderRegisteredLists === 'function') adminV27RenderRegisteredLists();
  if (typeof qpDemoRenderResetPanel === 'function') qpDemoRenderResetPanel();

  if (typeof populateClientSelect === 'function') populateClientSelect();
  if (typeof populateOpSelects === 'function') populateOpSelects();
  if (typeof populateLineSelect === 'function') {
    populateLineSelect('inp-ligne');
    populateLineSelect('d-ligne');
  }
  if (typeof populateDetecteurSelect === 'function') populateDetecteurSelect();
}

async function adminV27Post(table, payload, prefer = 'resolution=merge-duplicates,return=representation') {
  if (!navigator.onLine) throw new Error('Connexion requise pour écrire dans Supabase');
  const headers = { ...SB_HDR, 'Prefer': prefer };
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  try { return await res.json(); } catch (e) { return null; }
}

async function adminV27Patch(table, query, payload) {
  if (!navigator.onLine) throw new Error('Connexion requise pour écrire dans Supabase');
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${query}&${qpSiteEqParam()}`, {
    method: 'PATCH',
    headers: { ...SB_HDR, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  try { return await res.json(); } catch (e) { return null; }
}

async function adminV27EnsureClient(nom) {
  const clean = String(nom || '').trim();
  if (!clean) throw new Error('Nom client obligatoire');
  const norm = typeof normalizeTextKey === 'function' ? normalizeTextKey(clean) : clean.toLowerCase();

  try {
    const res = await fetch(`${SB_URL}/rest/v1/clients?select=id,nom&${qpSiteEqParam()}`, { headers: SB_HDR });
    if (res.ok) {
      const rows = await res.json();
      const found = (rows || []).find(c => (typeof normalizeTextKey === 'function' ? normalizeTextKey(c.nom) : String(c.nom).toLowerCase()) === norm);
      if (found?.id) return found.id;
    }
  } catch (e) {
    console.warn('adminV27EnsureClient lookup ignored:', e);
  }

  const id = adminV27Id('cli', clean);
  await adminV27Post('clients', qpWithSite({ id, nom: clean }));
  return id;
}

async function adminV27AddOperateur() {
  const nom = adminV27Text('admin-v27-op-nom');
  const role = String(document.getElementById('admin-v27-op-role')?.value || 'Operateur');
  if (!nom) { toast('Saisissez un nom opérateur', 'err'); return; }

  try {
    adminV27SetStatus('Ajout opérateur en cours...');
    const id = 'op_' + adminV27Slug(nom) + '_' + Date.now();
    const payload = qpWithSite({ id, nom, role, actif: true });

    if (typeof upsertLocalOperateur === 'function') upsertLocalOperateur(payload);
    if (typeof populateOpSelects === 'function') populateOpSelects();

    await adminV27Post('operateurs', payload);
    adminV27TrackStartRow('operateurs', { id, label: nom, meta: role, role });

    const nomEl = document.getElementById('admin-v27-op-nom');
    if (nomEl) nomEl.value = '';
    const roleEl = document.getElementById('admin-v27-op-role');
    if (roleEl) roleEl.value = 'Operateur';

    await adminV27ReloadAfterChange();
    toast('Opérateur ajouté ✓', 'ok');
    adminV27SetStatus('Opérateur ajouté dans le site actif.', 'ok');
  } catch (e) {
    console.error('adminV27AddOperateur:', e);
    toast('Erreur ajout opérateur', 'err');
    adminV27SetStatus('Erreur opérateur : ' + e.message, 'err');
  }
}

async function adminV27AddClient() {
  const nom = adminV27Text('admin-v27-client-nom');
  if (!nom) { toast('Saisissez un nom client', 'err'); return; }
  try {
    adminV27SetStatus('Ajout client en cours...');
    await adminV27EnsureClient(nom);
    adminV27TrackStartRow('clients', { label: nom });
    document.getElementById('admin-v27-client-nom').value = '';
    await adminV27ReloadAfterChange();
    toast('Client ajouté ✓', 'ok');
    adminV27SetStatus('Client ajouté dans le site actif.', 'ok');
  } catch (e) {
    console.error('adminV27AddClient:', e);
    toast('Erreur ajout client', 'err');
    adminV27SetStatus('Erreur client : ' + e.message, 'err');
  }
}



// QUALPACK START — contrôle générique de limite de lignes.
// Fonctions volontairement non liées à une version (V27/V28) pour rester réutilisables.
function qpStartGetLineLimit() {
  try {
    const site = (typeof QUALPACK_SITE_ID !== 'undefined' && QUALPACK_SITE_ID) ? QUALPACK_SITE_ID : 'default';
    const raw = localStorage.getItem(`qp_nb_lignes_autorisees_${site}`);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
  } catch (e) {
    return null;
  }
}

function qpStartCollectLineNames() {
  const names = [];

  // Catalogue opérationnel déjà présent localement.
  try {
    if (typeof getStoredLineCatalogue === 'function') {
      names.push(...getStoredLineCatalogue());
    }
  } catch (e) {}

  // Lignes explicitement créées dans START.
  try {
    adminV27GetStartRows('lignes').forEach(row => names.push(row?.label || row?.nom || row?.name || ''));
  } catch (e) {}

  // Lignes créées indirectement depuis les produits START.
  // Important : empêche le contournement de licence via le champ "Ligne de production" du produit.
  try {
    adminV27GetStartRows('produits').forEach(row => names.push(row?.ligne_prod || row?.ligne || ''));
  } catch (e) {}

  // Lignes issues d'un import Excel déjà préparé en mémoire.
  try {
    if (Array.isArray(_importLinesData)) {
      _importLinesData.forEach(row => names.push(row?.nom || row?.ligne || row?.label || ''));
    }
  } catch (e) {}

  return Array.from(new Set(
    names.map(v => String(v || '').trim()).filter(Boolean).map(v => adminV27Norm(v))
  ));
}

function qpStartCheckLineLimit(extraLineNames = []) {
  const limit = qpStartGetLineLimit();
  if (!limit) return { ok: true, limit: null, count: 0 };

  const merged = new Set(qpStartCollectLineNames());
  (extraLineNames || []).forEach(v => {
    const clean = String(v || '').trim();
    if (clean) merged.add(adminV27Norm(clean));
  });

  const count = merged.size;
  if (count <= limit) return { ok: true, limit, count };

  return {
    ok: false,
    limit,
    count,
    message: `Limite licence atteinte : ${count} ligne(s) détectée(s) pour ${limit} autorisée(s). Option ligne supplémentaire : 49 € HT / an.`
  };
}

function qpStartRegisterLine(ligne, detecteur = '') {
  const clean = String(ligne || '').trim();
  if (!clean) return;
  const det = String(detecteur || '').trim();
  adminV27TrackStartRow('lignes', { label: clean, meta: det, detecteur: det, source: 'start' });
}

// Wrappers conservés pour compatibilité avec le code existant.
function adminV27GetLineLimit() { return qpStartGetLineLimit(); }
function adminV27CurrentLineNames() { return qpStartCollectLineNames(); }
function adminV27CheckLineLimit(extraLineNames = []) { return qpStartCheckLineLimit(extraLineNames); }

function adminV27GetImportLineNames() {
  const names = [];
  try {
    if (Array.isArray(_importLinesData) && _importLinesData.length) {
      _importLinesData.forEach(row => names.push(row?.nom || row?.ligne || row?.label || ''));
    }
  } catch (e) {}

  try {
    if (Array.isArray(_importPreviewData) && _importPreviewData.length) {
      _importPreviewData.forEach(row => names.push(row?.ligne_prod || row?.ligne || ''));
    }
  } catch (e) {}

  return Array.from(new Set(names.map(v => String(v || '').trim()).filter(Boolean)));
}


function adminV27CheckImportLineLimit() {
  const limit = adminV27GetLineLimit();
  if (!limit) return { ok: true, limit: null, count: 0 };

  const count = adminV27GetImportLineNames().length;
  if (count <= limit) return { ok: true, limit, count };

  return {
    ok: false,
    limit,
    count,
    message: `Import refusé : ${count} ligne(s) dans le fichier pour ${limit} autorisée(s). Option ligne supplémentaire : 49 € HT / an.`
  };
}


async function adminV27AddLigne() {
  const nom = adminV27Text('admin-v27-ligne-nom');
  const detecteur = adminV27Text('admin-v27-ligne-det');
  if (!nom) { toast('Saisissez un nom de ligne', 'err'); return; }

  const lineLimitCheck = adminV27CheckLineLimit([nom]);
  if (!lineLimitCheck.ok) {
    toast(lineLimitCheck.message, 'err');
    adminV27SetStatus(lineLimitCheck.message, 'err');
    return;
  }

  try {
    adminV27SetStatus('Ajout ligne en cours...');
    // Table lignes : id Supabase peut être numérique. On laisse Supabase générer l'id.
    await adminV27Post('lignes', qpWithSite({ nom, detecteur_defaut: detecteur || null }));
    adminV27TrackStartRow('lignes', { label: nom, meta: detecteur || '', detecteur: detecteur || '' });
     
    // V27 START : ligne/détecteur visibles dans les mini-listes START.
    // On ne les pousse pas dans le catalogue complet affiché en bas.
    // La synchronisation Supabase reste active.
     
    document.getElementById('admin-v27-ligne-nom').value = '';
    document.getElementById('admin-v27-ligne-det').value = '';
    await adminV27ReloadAfterChange();
    toast('Ligne ajoutée ✓', 'ok');
    adminV27SetStatus('Ligne ajoutée dans le site actif.', 'ok');
  } catch (e) {
    console.error('adminV27AddLigne:', e);
    toast('Erreur ajout ligne', 'err');
    adminV27SetStatus('Erreur ligne : ' + e.message, 'err');
  }
}

async function adminV27AddProduit() {
  const clientNom = adminV27Text('admin-v27-prod-client');
  const nom = adminV27Text('admin-v27-prod-nom');
  const qn = adminV27Number('admin-v27-prod-qn');
  const tare = adminV27Number('admin-v27-prod-tare');
  const ligne = adminV27Text('admin-v27-prod-ligne');
  const detecteur = adminV27Text('admin-v27-prod-det');
  const qte = adminV27Number('admin-v27-prod-qte');

  if (!clientNom) { toast('Saisissez le client', 'err'); return; }
  if (!nom) { toast('Saisissez le produit', 'err'); return; }
  if (!Number.isFinite(qn) || qn <= 0) { toast('Saisissez un Qn valide', 'err'); return; }

  const lineLimitCheck = qpStartCheckLineLimit(ligne ? [ligne] : []);
  if (!lineLimitCheck.ok) {
    toast(lineLimitCheck.message, 'err');
    adminV27SetStatus(lineLimitCheck.message, 'err');
    return;
  }

  try {
    adminV27SetStatus('Ajout produit en cours...');
    const client_id = await adminV27EnsureClient(clientNom);
     
    // V27 START : le produit reste visible dans les mini-listes START.
    // On évite de le pousser visuellement dans le catalogue complet.
    // La sauvegarde Supabase reste active.

    const seuils = calcSeuils(qn);

    const payload = qpWithSite({
      id: adminV27Id('prod', `${client_id}_${nom}`),
      client_id,
      nom,
      qn,
      tu1: seuils.tu1,
      tu2: seuils.tu2,
      tne: seuils.tne,
      tare_fixe_g: Number.isFinite(tare) ? tare : null,
      ligne_prod: ligne || null,
      detecteur: detecteur || null,
      quantite_prevue_defaut: Number.isFinite(qte) ? qte : null,
      actif: true
    });

    await adminV27Post('produits', [payload], 'resolution=merge-duplicates');
    qpStartRegisterLine(ligne, detecteur);

    adminV27TrackStartRow('produits', {
    id: payload.id,
    key: `${clientNom}||${nom}`,
    label: nom,
    nom,
    meta: clientNom,
    client: clientNom,

    qn,
    tu1: seuils.tu1,
    tu2: seuils.tu2,
    tne: seuils.tne,

    tare_fixe_g: Number.isFinite(tare) ? tare : null,
    ligne_prod: ligne || '',
    detecteur: detecteur || '',
    quantite_prevue_defaut: Number.isFinite(qte) ? qte : null,

    source: 'start'
  });

    ['admin-v27-prod-client','admin-v27-prod-nom','admin-v27-prod-qn','admin-v27-prod-tare','admin-v27-prod-ligne','admin-v27-prod-det','admin-v27-prod-qte']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    await adminV27ReloadAfterChange();
    toast('Produit ajouté ✓', 'ok');
    adminV27SetStatus('Produit ajouté dans le site actif.', 'ok');
  } catch (e) {
    console.error('adminV27AddProduit:', e);
    toast('Erreur ajout produit', 'err');
    adminV27SetStatus('Erreur produit : ' + e.message, 'err');
  }
}


/* ================================
   QUALPACK V27.1 — MODE DÉMO TERRAIN
   - réservé au site qualpack_demo
   - reset via RPC Supabase sécurisé
   - nettoyage local uniquement du site démo
================================ */
function qpDemoGetSession() {
  try {
    if (typeof qpGetCurrentAccessSession === 'function') return qpGetCurrentAccessSession();
  } catch (e) {}
  return null;
}

function qpDemoIsEnabled() {
  const siteId = (typeof QUALPACK_SITE_ID !== 'undefined' && QUALPACK_SITE_ID) ? QUALPACK_SITE_ID : '';
  const session = qpDemoGetSession();
  return siteId === 'qualpack_demo' && session && session.mode_demo === true;
}

function qpDemoRenderResetPanel() {
  const panel = document.getElementById('qp-demo-reset-panel');
  if (!panel) return;
  panel.style.display = qpDemoIsEnabled() ? 'block' : 'none';
}

function qpDemoSetStatus(message, type = 'info') {
  const el = document.getElementById('qp-demo-reset-status');
  if (el) {
    el.textContent = message || '';
    el.style.color = type === 'err' ? '#FCA5A5' : (type === 'ok' ? '#BBF7D0' : '#FDE68A');
  }
}

async function qpDemoCallResetRpc() {
  if (!qpDemoIsEnabled()) {
    throw new Error('Reset démo non autorisé sur ce site.');
  }
  if (!navigator.onLine) {
    throw new Error('Connexion internet requise pour réinitialiser la démo.');
  }

  const siteKey = (typeof qpGetStoredSiteKey === 'function') ? qpGetStoredSiteKey() : '';
  const res = await fetch(`${SB_URL}/rest/v1/rpc/qualpack_reset_demo_site`, {
    method: 'POST',
    headers: { ...SB_HDR, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      p_site_id: 'qualpack_demo',
      p_site_key: siteKey
    })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `Erreur RPC ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || row.ok !== true) {
    throw new Error((row && row.message) || 'Reset démo refusé par Supabase.');
  }
  return row;
}

function qpDemoClearStartLocalState() {
  const kinds = ['operateurs', 'clients', 'lignes', 'produits'];
  kinds.forEach(kind => {
    try { localStorage.removeItem(adminV27StartKey(kind)); } catch (e) {}
    try { localStorage.removeItem(adminV27HiddenKey(kind)); } catch (e) {}
  });

  try { localStorage.removeItem(qpCacheKey('qp_catalogue')); } catch (e) {}
  try { localStorage.removeItem(qpCacheKey('qp_operateurs')); } catch (e) {}

  try { if (typeof CATALOGUE !== 'undefined') Object.keys(CATALOGUE).forEach(k => delete CATALOGUE[k]); } catch (e) {}
  try { if (Array.isArray(window.sessions)) window.sessions.length = 0; } catch (e) {}
  try { if (Array.isArray(window.dets)) window.dets.length = 0; } catch (e) {}
}

async function qpDemoClearIndexedDBStore(storeName) {
  if (typeof openDB !== 'function') return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const rows = Array.isArray(req.result) ? req.result : [];
      rows.forEach(row => {
        if (row && row.site_id === 'qualpack_demo' && row.id) {
          store.delete(row.id);
        }
      });
    };
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function qpDemoClearLocalMeasures() {
  await qpDemoClearIndexedDBStore('pesees');
  await qpDemoClearIndexedDBStore('detecteurs');

  try {
    const rows = JSON.parse(localStorage.getItem('qp_sessions') || '[]');
    if (Array.isArray(rows)) {
      localStorage.setItem('qp_sessions', JSON.stringify(rows.filter(r => r && r.site_id !== 'qualpack_demo')));
    }
  } catch (e) {}

  try {
    const rows = JSON.parse(localStorage.getItem('qp_dets') || '[]');
    if (Array.isArray(rows)) {
      localStorage.setItem('qp_dets', JSON.stringify(rows.filter(r => r && r.site_id !== 'qualpack_demo')));
    }
  } catch (e) {}
}

async function qpDemoResetSite() {
  if (!qpDemoIsEnabled()) {
    toast('Reset démo non autorisé sur ce site', 'err');
    qpDemoSetStatus('Reset démo non autorisé sur ce site.', 'err');
    return;
  }

  const ok = confirm(
    'Réinitialiser QUALPACK DEMO ?\n\n' +
    'Cette action effacera uniquement les données du site qualpack_demo : clients, produits, lignes, opérateurs, pesées et tests détecteurs.\n\n' +
    'Les vrais sites clients ne sont pas concernés.'
  );
  if (!ok) return;

  try {
    qpDemoSetStatus('Réinitialisation Supabase en cours...', 'info');
    await qpDemoCallResetRpc();

    qpDemoSetStatus('Nettoyage local en cours...', 'info');
    qpDemoClearStartLocalState();
    await qpDemoClearLocalMeasures();

    if (typeof adminV27ReloadAfterChange === 'function') await adminV27ReloadAfterChange();
    if (typeof renderAdminCatalogue === 'function') renderAdminCatalogue();
    if (typeof renderAdminOperateurs === 'function') renderAdminOperateurs();
    if (typeof populateClientSelect === 'function') populateClientSelect();
    if (typeof populateOpSelects === 'function') populateOpSelects();
    if (typeof populateLineSelect === 'function') {
      populateLineSelect('inp-ligne');
      populateLineSelect('d-ligne');
    }
    if (typeof populateDetecteurSelect === 'function') populateDetecteurSelect();

    qpDemoSetStatus('Démo réinitialisée. Vous pouvez saisir un nouveau scénario client.', 'ok');
    toast('Démo réinitialisée ✓', 'ok');
  } catch (e) {
    console.error('qpDemoResetSite:', e);
    qpDemoSetStatus('Erreur reset démo : ' + e.message, 'err');
    toast('Erreur reset démo', 'err');
  }
}


// Exposition explicite pour les onclick HTML et pour faciliter le debug terrain.
Object.assign(window, {
  openAdmin,
  showPinOverlay,
  hidePinOverlay,
  pinKey,
  pinDel,
  pinCancel,
  validatePin,
  togglePinChangeForm,
  saveNewPin,
  resetPinToDefault,
  importProduitsExcel,
  renderImportPreview,
  cancelImport,
  confirmImportProduits,
  downloadTemplate,
  renderAdminCatalogue,
  deleteProduit,
  addOperateur,
  deleteOperateur,
  renderAdminOperateurs,
  manualSync,
  adminV27RefreshLists,
  adminV27RenderRegisteredLists,
  adminV27AddOperateur,
  adminV27AddClient,
  adminV27AddLigne,
  adminV27AddProduit,
  adminV27SoftRemoveOperateur,
  adminV27SoftRemoveClient,
  adminV27SoftRemoveLigne,
  adminV27SoftRemoveProduit,
  adminV27GetStartRows,
  qpDemoRenderResetPanel,
  qpDemoResetSite
});
