
  window._libsReady = Promise.resolve();

  function getJsPDFCtor() {
    return window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : null;
  }

  function getXLSXLib() {
    return window.XLSX || null;
  }
</script>
<body>

<div class="app">

 <!-- HEADER -->
<div class="header">
  <div class="logo">
    <div class="logo-icon">
      <img src="./icon-192.png" alt="QualPack" style="width:32px;height:32px;border-radius:6px;display:block;">
    </div>
    <div class="logo-text">Qual<span>Pack</span></div>
    <div class="logo-by">by CODEX EXPERTISE</div>
  </div>
  <div class="header-status">
    <div class="status-dot" id="status-dot"></div>
    <span id="status-label">En ligne</span>
  </div>
</div>

  <!-- CONTENU -->
  <div class="content" id="main-content">

    <!-- ==================== PESÉES ==================== -->
    <div class="screen active" id="screen-pesees">

      <!-- ÉTAPE 1 : Identification -->
      <div class="step active" id="ps1">

        <div class="install-banner" id="install-banner">
          <div class="ib-text">
            <strong>Installer QualPack</strong>
            Ajoutez l'app sur votre tablette pour l'utiliser hors-ligne
          </div>
          <button class="ib-btn" onclick="installApp()">Installer</button>
        </div>

        <div class="step-indicator">
          <div class="si-item active" id="si1-1"><div class="si-num">1</div><span>Identif.</span></div>
          <div class="si-line"></div>
          <div class="si-item" id="si1-2"><div class="si-num">2</div><span>Pesées</span></div>
          <div class="si-line"></div>
          <div class="si-item" id="si1-3"><div class="si-num">3</div><span>Résultats</span></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon blue">📋</div>
            <div>
              <div class="card-title">Identification du contrôle</div>
              <div class="card-sub">Saisie et traçabilité d’un échantillon de pesée</div>
            </div>
          </div>

          <div class="field">
            <label>Client (optionnel)</label>
            <select id="sel-client" onchange="onClient()">
              <option value="">— Non spécifié —</option>
            </select>
          </div>

          <div class="field">
            <label>Produit</label>
            <select id="sel-produit" onchange="onProduit()">
              <option value="">— Sélectionner un produit —</option>
            </select>
          </div>

          <div class="info-strip" id="prod-info">
            <div class="is-item"><div class="is-label">Qn</div><div class="is-val" id="ip-qn">—</div></div>
            <div class="is-item"><div class="is-label">TU1</div><div class="is-val" id="ip-tu1">—</div></div>
            <div class="is-item"><div class="is-label">TU2</div><div class="is-val" id="ip-tu2">—</div></div>
            <div class="is-item"><div class="is-label">TNE</div><div class="is-val" id="ip-tne">—</div></div>
            <div class="is-item"><div class="is-label">Tare fixe</div><div class="is-val" id="ip-tare">—</div></div>
          </div>

          <div class="field" id="field-ligne">
            <label>Ligne de production <span style="color:var(--text-muted);font-weight:400">(optionnel)</span></label>
            <select id="inp-ligne" onchange="chk1()">
              <option value="">— Sélectionner une ligne —</option>
            </select>
          </div>

          <div class="field">
            <label>Opérateur</label>
            <select id="sel-op" onchange="chk1()">
              <option value="">— Sélectionner un opérateur —</option>
            </select>
          </div>

          <div class="field">
            <label>N° Ordre de fabrication</label>
            <div id="of-container">
              <select id="sel-of" style="display:none" onchange="onOfSelect()">
                <option value="">— Sélectionner un OF —</option>
              </select>
              <input type="text" id="inp-of" placeholder="ex : OF 123" oninput="chk1()" autocomplete="off" />
            </div>
          </div>

          <div class="field">
            <label>Quantité prévue <span style="color:var(--text-muted);font-weight:400">(optionnel)</span></label>
            <input type="number" id="inp-qte" placeholder="ex : 800" min="1" oninput="chk1()" autocomplete="off" inputmode="numeric"/>
          </div>

          <div class="field">
            <label>Nombre de pesées souhaitées</label>
            <input type="number" id="inp-sample-size" min="1" step="1" placeholder="ex : 10" autocomplete="off" inputmode="numeric" oninput="onSampleSizeCurrentChange()"/>
            <div style="font-size:12px;color:var(--text-muted);margin-top:5px;line-height:1.35;">
              Prérempli avec le réglage par défaut du site — modifiable pour ce lot / OF.
            </div>
          </div>

          <button class="btn btn-blue" id="btn-ps1" onclick="goPS2()" disabled>
            Démarrer les pesées →
          </button>
        </div>
      </div>

      <!-- ÉTAPE 2 : Pesées -->
      <div class="step" id="ps2">
        <div class="step-indicator">
          <div class="si-item done" id="si2-1"><div class="si-num">✓</div><span>Identif.</span></div>
          <div class="si-line"></div>
          <div class="si-item active" id="si2-2"><div class="si-num">2</div><span>Pesées</span></div>
          <div class="si-line"></div>
          <div class="si-item" id="si2-3"><div class="si-num">3</div><span>Résultats</span></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon blue">⚖</div>
            <div>
              <div class="card-title" id="ps2-title">Pesées de l’échantillon</div>
              <div class="card-sub" id="ps2-sub">—</div>
            </div>
          </div>

          <div class="prog-wrap">
            <div class="prog-bar" id="prog-bar" style="width:0%"></div>
          </div>

          <div class="pesees-grid" id="pesees-grid"></div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Pesées saisies</div>
              <div class="stat-val" id="sc-n">0 / 20</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Moyenne (g)</div>
              <div class="stat-val" id="sc-moy">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Défauts TU1</div>
              <div class="stat-val" id="sc-tu1">0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Défauts TU2</div>
              <div class="stat-val" id="sc-tu2">0</div>
            </div>
          </div>

          <button class="btn btn-blue" id="btn-ps2" onclick="goPS3()" disabled>
            Calculer les résultats →
          </button>
          <button class="btn btn-ghost" onclick="goPS1back()">← Modifier l'identification</button>
        </div>
      </div>

      <!-- ÉTAPE 3 : Résultats -->
      <div class="step" id="ps3">
        <div class="step-indicator">
          <div class="si-item done"><div class="si-num">✓</div><span>Identif.</span></div>
          <div class="si-line"></div>
          <div class="si-item done"><div class="si-num">✓</div><span>Pesées</span></div>
          <div class="si-line"></div>
          <div class="si-item active"><div class="si-num">3</div><span>Résultats</span></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon green">📊</div>
            <div>
              <div class="card-title">Résultats de l’échantillon</div>
              <div class="card-sub" id="ps3-sub">—</div>
            </div>
          </div>

          <div class="verdict" id="verdict-pesee">
            <div class="verdict-icon" id="verd-icon">—</div>
            <div>
              <div class="verdict-title" id="verd-title">—</div>
              <div class="verdict-sub" id="verd-sub">—</div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Moyenne brute</div>
              <div class="stat-val" id="r-moy-gross">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Tare fixe</div>
              <div class="stat-val" id="r-tare">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Moyenne nette calculée</div>
              <div class="stat-val" id="r-moy">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Écart-type net</div>
              <div class="stat-val" id="r-et">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Défauts TU1</div>
              <div class="stat-val" id="r-tu1">0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Défauts TU2</div>
              <div class="stat-val" id="r-tu2">0</div>
            </div>
          </div>

          <div class="admin-info-card" style="margin-top:10px">
            <strong>Mode de calcul :</strong> poids brut saisi par l’opérateur, puis déduction automatique de la tare fixe pour calculer le poids net réglementaire.
          </div>

          <div class="section-title">Récapitulatif</div>

          <div class="recap">
            <div class="recap-row"><span class="rk">Client</span><span class="rv" id="rc-cli">—</span></div>
            <div class="recap-row"><span class="rk">Produit</span><span class="rv" id="rc-prod">—</span></div>
            <div class="recap-row"><span class="rk">Ligne</span><span class="rv" id="rc-ligne">—</span></div>
            <div class="recap-row"><span class="rk">N° OF</span><span class="rv" id="rc-of">—</span></div>
            <div class="recap-row"><span class="rk">Opérateur</span><span class="rv" id="rc-op">—</span></div>
            <div class="recap-row"><span class="rk">Date / heure</span><span class="rv" id="rc-date">—</span></div>
            <div class="recap-row"><span class="rk">Mode de saisie</span><span class="rv" id="rc-mode">—</span></div>
            <div class="recap-row"><span class="rk">Tare fixe</span><span class="rv" id="rc-tare">—</span></div>
            <div class="recap-row"><span class="rk">Moyenne brute</span><span class="rv" id="rc-mg">—</span></div>
            <div class="recap-row"><span class="rk">Moyenne nette calculée</span><span class="rv" id="rc-mn">—</span></div>
            <div class="recap-row"><span class="rk">Verdict moyenne</span><span class="rv" id="rc-vm">—</span></div>
            <div class="recap-row"><span class="rk">Verdict défectueux</span><span class="rv" id="rc-vd">—</span></div>
          </div>

          <div class="btn-row">
            <button class="btn btn-red" onclick="genPDF()" style="flex:1">📄 PDF</button>
            <button class="btn btn-green" onclick="genExcelPesee()" style="flex:1">📊 Excel</button>
            <button class="btn btn-blue" id="btn-save-pesee" onclick="saveSession()" style="flex:1">💾 Enregistrer</button>
          </div>
          <button class="btn btn-ghost" onclick="newPesee()">+ Nouvelle saisie</button>
        </div>
      </div>
    </div>

    <!-- ==================== DÉTECTEUR ==================== -->
    <div class="screen" id="screen-detecteur">

      <!-- DS1 : Identification -->
      <div class="step active" id="ds1">
        <div class="step-indicator">
          <div class="si-item active"><div class="si-num">1</div><span>Identif.</span></div>
          <div class="si-line"></div>
          <div class="si-item"><div class="si-num">2</div><span>Test</span></div>
          <div class="si-line"></div>
          <div class="si-item"><div class="si-num">3</div><span>Résultat</span></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon blue">🔍</div>
            <div>
              <div class="card-title">Test détecteur de métaux</div>
              <div class="card-sub">Identification de l'équipement</div>
            </div>
          </div>

          <div class="field">
            <label>Équipement</label>
            <select id="d-equip" onchange="onDetecteurEquipChange()">
              <option value="">— Sélectionner un détecteur —</option>
            </select>
          </div>

          <div class="field">
            <label>Ligne de production <span style="color:var(--text-muted);font-weight:400">(optionnel)</span></label>
            <select id="d-ligne" onchange="onDetecteurLigneChange()">
              <option value="">— Sélectionner une ligne —</option>
            </select>
          </div>

          <div class="field">
            <label>Opérateur</label>
            <select id="d-op" onchange="chkD1()">
              <option value="">— Sélectionner —</option>
            </select>
          </div>

          <div class="field">
            <label>N° OF (optionnel)</label>
            <input type="text" id="d-of" placeholder="ex : OF 123" autocomplete="off"/>
          </div>

          <div class="field">
            <label>Moment du test</label>
            <select id="d-type" onchange="chkD1()">
              <option value="">— Sélectionner —</option>
              <option>Avant production</option>
              <option>Pendant production</option>
              <option>Après production</option>
            </select>
          </div>

          <button class="btn btn-blue" id="btn-ds1" onclick="goDS2()" disabled>
            Démarrer le test →
          </button>
        </div>
      </div>

      <!-- DS2 : Test -->
      <div class="step" id="ds2">
        <div class="step-indicator">
          <div class="si-item done"><div class="si-num">✓</div><span>Identif.</span></div>
          <div class="si-line"></div>
          <div class="si-item active"><div class="si-num">2</div><span>Test</span></div>
          <div class="si-line"></div>
          <div class="si-item"><div class="si-num">3</div><span>Résultat</span></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon blue">🔍</div>
            <div>
              <div class="card-title">Test des étalons</div>
              <div class="card-sub" id="ds2-sub">—</div>
            </div>
          </div>

          <div class="det-instruction">
            Passez chaque étalon test dans le détecteur.<br>
            Appuyez sur la carte correspondante selon le résultat.
          </div>

          <div class="det-grid">
            <div class="det-card" id="dc-fer" onclick="toggleDet('fer')">
              <div class="det-card-icon">🔴</div>
              <div class="det-card-name">Ferreux</div>
              <div class="det-card-status" id="ds-fer">— Non testé</div>
            </div>
            <div class="det-card" id="dc-nfer" onclick="toggleDet('nfer')">
              <div class="det-card-icon">🟡</div>
              <div class="det-card-name">Non ferreux</div>
              <div class="det-card-status" id="ds-nfer">— Non testé</div>
            </div>
            <div class="det-card" id="dc-inox" onclick="toggleDet('inox')">
              <div class="det-card-icon">⚪</div>
              <div class="det-card-name">Inox</div>
              <div class="det-card-status" id="ds-inox">— Non testé</div>
            </div>
          </div>

          <button class="btn btn-blue" id="btn-ds2" onclick="goDS3()" disabled>
            Valider le test →
          </button>
          <button class="btn btn-ghost" onclick="goDS1back()">← Modifier</button>
        </div>
      </div>

      <!-- DS3 : Résultat -->
      <div class="step" id="ds3">
        <div class="step-indicator">
          <div class="si-item done"><div class="si-num">✓</div><span>Identif.</span></div>
          <div class="si-line"></div>
          <div class="si-item done"><div class="si-num">✓</div><span>Test</span></div>
          <div class="si-line"></div>
          <div class="si-item active"><div class="si-num">3</div><span>Résultat</span></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon green">✅</div>
            <div>
              <div class="card-title">Résultat du test</div>
              <div class="card-sub" id="ds3-sub">—</div>
            </div>
          </div>

          <div class="verdict" id="verdict-det">
            <div class="verdict-icon" id="d-verd-icon">—</div>
            <div>
              <div class="verdict-title" id="d-verd-title">—</div>
              <div class="verdict-sub" id="d-verd-sub">—</div>
            </div>
          </div>

          <div class="recap">
            <div class="recap-row"><span class="rk">Équipement</span><span class="rv" id="dr-eq">—</span></div>
            <div class="recap-row"><span class="rk">Ligne</span><span class="rv" id="dr-ligne">—</span></div>
            <div class="recap-row"><span class="rk">Opérateur</span><span class="rv" id="dr-op">—</span></div>
            <div class="recap-row"><span class="rk">N° OF</span><span class="rv" id="dr-of">—</span></div>
            <div class="recap-row"><span class="rk">Moment du test</span><span class="rv" id="dr-type">—</span></div>
            <div class="recap-row"><span class="rk">Date / heure</span><span class="rv" id="dr-date">—</span></div>
            <div class="recap-row"><span class="rk">Ferreux</span><span class="rv" id="dr-fer">—</span></div>
            <div class="recap-row"><span class="rk">Non ferreux</span><span class="rv" id="dr-nfer">—</span></div>
            <div class="recap-row"><span class="rk">Inox</span><span class="rv" id="dr-inox">—</span></div>
          </div>

          <div class="btn-row">
            <button class="btn btn-red" onclick="genPDFdet()" style="flex:1">📄 PDF</button>
            <button class="btn btn-green" onclick="genExcelDet()" style="flex:1">📊 Excel</button>
            <button class="btn btn-blue" id="btn-save-det" onclick="saveDet()" style="flex:1">💾 Enregistrer</button>
          </div>
          <button class="btn btn-ghost" onclick="newDet()">+ Nouveau test</button>
        </div>
      </div>
    </div>

    <!-- ==================== HISTORIQUE ==================== -->
    <div class="screen" id="screen-historique">
      <div class="hist-filter">
        <button class="hf-btn active" id="hf-p" onclick="filterHist('pesees')">⚖ Pesées</button>
        <button class="hf-btn" id="hf-d" onclick="filterHist('det')">🔍 Détecteur</button>
        <button class="hf-btn" onclick="genExcel()" style="flex:0.8;color:var(--green-text);border-color:var(--green-dark);">📊 Excel</button>
        <button class="hf-btn" id="btn-sync-history" onclick="manualSync()" style="flex:1;color:var(--blue-light);border-color:var(--blue-dark);">🔄 Synchroniser</button>
      </div>
      <div id="hist-list"></div>
    </div>

    <!-- ==================== DASHBOARD ==================== -->
    <div class="screen" id="screen-dashboard"> 
      <div class="dash-header v2">
        <div>
          <h2 class="dash-main-title">Dashboard Suivi Qualité</h2>
          <p class="dash-main-subtitle">Vue d’ensemble qualité sur la période sélectionnée</p>
        </div>
      <div class="dash-date" id="dash-date"></div>
    </div>

      <div class="dash-toolbar">
        <div class="dash-period">
          <button class="dp-btn active" id="dp-7"  onclick="setDashPeriod(7,  this)">7 j</button>
          <button class="dp-btn"        id="dp-30" onclick="setDashPeriod(30, this)">30 j</button>
          <button class="dp-btn"        id="dp-90" onclick="setDashPeriod(90, this)">90 j</button>
          <button class="dp-btn"        id="dp-0"  onclick="setDashPeriod(0,  this)">Tout</button>
        </div>
        <div class="dash-filters-grid">
          <select id="dash-filter-client" class="dash-select" onchange="setDashFilter('client', this.value)">
            <option value="">Tous les clients</option>
          </select>
          <select id="dash-filter-product" class="dash-select" onchange="setDashFilter('product', this.value)">
            <option value="">Tous les produits</option>
          </select>
          <select id="dash-filter-status" class="dash-select" onchange="setDashFilter('status', this.value)">
            <option value="all">Tous statuts</option>
            <option value="ok">Conformes</option>
            <option value="warn">À surveiller</option>
            <option value="err">Critiques</option>
          </select>
        </div>
        <div class="dash-actions-row">
          <button class="btn btn-ghost btn-mini" onclick="refreshDashboard()">🔄 Actualiser</button>
          <button class="btn btn-blue btn-mini" onclick="genDashboardPDF()">Générer Rapport PDF</button>
        </div>
      </div>

      <div id="dash-body"></div>
    </div>


    <!-- ==================== ADMIN ==================== -->
    <div class="screen" id="screen-admin">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--text-primary)">Administration</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Accès responsable qualité</div>
        </div>
        <span class="admin-version-badge">V27 START</span>
      </div>

      <!-- Sécurité / PIN -->
      <div class="admin-section">
        <div class="admin-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Sécurité
        </div>

        <div class="admin-row">
          <div>
            <div class="admin-row-label">Code PIN d'accès</div>
            <div class="admin-row-sub">4 chiffres — requis à chaque ouverture de l'Admin</div>
          </div>
          <button class="btn btn-secondary" style="font-size:12px;padding:6px 12px"
            onclick="togglePinChangeForm()">Modifier</button>
        </div>

        <div class="pin-change-form" id="pin-change-form">
          <div class="pin-input-row">
            <input class="pin-input-field" type="tel" inputmode="numeric"
              maxlength="4" placeholder="••••" id="pin-current"
              autocomplete="off" oninput="this.value=this.value.replace(/\D/g,'')">
            <div style="font-size:11px;color:var(--text-muted);text-align:center">PIN actuel</div>
            <input class="pin-input-field" type="tel" inputmode="numeric"
              maxlength="4" placeholder="••••" id="pin-new1"
              autocomplete="off" oninput="this.value=this.value.replace(/\D/g,'')">
            <div style="font-size:11px;color:var(--text-muted);text-align:center">Nouveau PIN</div>
            <input class="pin-input-field" type="tel" inputmode="numeric"
              maxlength="4" placeholder="••••" id="pin-new2"
              autocomplete="off" oninput="this.value=this.value.replace(/\D/g,'')">
            <div style="font-size:11px;color:var(--text-muted);text-align:center">Confirmer le nouveau PIN</div>
          </div>
          <button class="btn btn-primary" style="width:100%" onclick="saveNewPin()">
            Enregistrer le nouveau PIN
          </button>
          <div id="pin-change-error" style="font-size:12px;color:var(--red-text);text-align:center;margin-top:8px;min-height:18px"></div>
        </div>

      </div>

      <!-- Mode rapide terrain V27 START -->
      <div class="admin-section" id="admin-v27-start-section">
        <div class="admin-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M12 5v14"/><path d="M5 12h14"/>
          </svg>
          Mode rapide terrain — V27 START
        </div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.45;margin-bottom:12px">
          Ajout direct depuis l'application. L'import Excel reste disponible plus bas pour les catalogues complets.
        </div>

        <div class="admin-v27-grid" style="display:grid;grid-template-columns:1fr;gap:12px">
          <div class="admin-v27-card" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--r-md);padding:12px">
            <div style="font-size:12px;font-weight:700;color:var(--blue-light);margin-bottom:8px">Client</div>
            <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
              <div style="flex:1;min-width:180px">
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Nom du client final</div>
                <input id="admin-v27-client-nom" type="text" placeholder="Ex : Moulin des Moines" class="admin-v27-input" autocomplete="off" />
              </div>
              <button class="btn btn-primary" style="padding:8px 14px;font-size:12px" onclick="adminV27AddClient()">+ Ajouter</button>
            </div>
          </div>

          <div class="admin-v27-card" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--r-md);padding:12px">
            <div style="font-size:12px;font-weight:700;color:var(--blue-light);margin-bottom:8px">Ligne / détecteur</div>
            <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end">
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Nom de ligne</div>
                <input id="admin-v27-ligne-nom" type="text" placeholder="Ex : Ligne 1" class="admin-v27-input" autocomplete="off" />
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Détecteur par défaut</div>
                <input id="admin-v27-ligne-det" type="text" placeholder="Ex : CCP1" class="admin-v27-input" autocomplete="off" />
              </div>
              <button class="btn btn-primary" style="padding:8px 14px;font-size:12px" onclick="adminV27AddLigne()">+ Ajouter</button>
            </div>
          </div>

          <div class="admin-v27-card" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--r-md);padding:12px">
            <div style="font-size:12px;font-weight:700;color:var(--blue-light);margin-bottom:8px">Produit</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 90px 90px;gap:8px;margin-bottom:8px">
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Client final</div>
                <input id="admin-v27-prod-client" type="text" placeholder="Client" class="admin-v27-input" list="admin-v27-clients-list" autocomplete="off" />
                <datalist id="admin-v27-clients-list"></datalist>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Produit</div>
                <input id="admin-v27-prod-nom" type="text" placeholder="Nom produit" class="admin-v27-input" autocomplete="off" />
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Qn g</div>
                <input id="admin-v27-prod-qn" type="number" min="0" step="0.1" placeholder="250" class="admin-v27-input" />
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Tare g</div>
                <input id="admin-v27-prod-tare" type="number" min="0" step="0.1" placeholder="15" class="admin-v27-input" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 130px auto;gap:8px;align-items:end">
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Ligne habituelle</div>
                <input id="admin-v27-prod-ligne" type="text" placeholder="Ligne" class="admin-v27-input" list="admin-v27-lignes-list" autocomplete="off" />
                <datalist id="admin-v27-lignes-list"></datalist>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Détecteur habituel</div>
                <input id="admin-v27-prod-det" type="text" placeholder="Détecteur" class="admin-v27-input" list="admin-v27-detecteurs-list" autocomplete="off" />
                <datalist id="admin-v27-detecteurs-list"></datalist>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Qté prévue</div>
                <input id="admin-v27-prod-qte" type="number" min="0" step="1" placeholder="1000" class="admin-v27-input" />
              </div>
              <button class="btn btn-primary" style="padding:8px 14px;font-size:12px" onclick="adminV27AddProduit()">+ Ajouter</button>
            </div>
          </div>
        </div>

        <div id="admin-v27-status" style="font-size:11px;color:var(--text-muted);margin-top:10px;min-height:16px"></div>
      </div>

      <!-- Gestion clients & produits V12 -->
      <div class="admin-section">
        <div class="admin-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          </svg>
          Clients &amp; Produits
        </div>

        <div style="display:flex;gap:8px;margin-bottom:14px">
          <button class="btn btn-secondary" style="flex:1;font-size:12px" onclick="downloadTemplate()">
            ⬇ Template Excel
          </button>
          <label class="btn btn-primary" style="flex:1;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center">
            ⬆ Importer Excel
            <input type="file" id="file-import-produits" accept=".xlsx,.xls,.csv"
              style="display:none" onchange="importProduitsExcel(this)">
          </label>
        </div>

        <div id="import-preview" style="display:none;background:var(--bg-surface);border:1px solid var(--border);
          border-radius:var(--r-md);padding:12px;margin-bottom:12px;font-size:12px"></div>

        <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;
          letter-spacing:.6px;margin-bottom:8px">Catalogue actuel</div>
        <div id="admin-catalogue-list">
          <div style="color:var(--text-muted);font-size:12px;padding:8px">Chargement...</div>
        </div>
      </div>

      <!-- Gestion opérateurs V12 -->
      <div class="admin-section">
        <div class="admin-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          Opérateurs
        </div>

        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:flex-end">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Nom</div>
            <input type="text" id="inp-op-nom" placeholder="Prénom NOM"
              style="width:140px;min-width:140px;background:#0F2033 !important;border:1px solid var(--border);
              border-radius:var(--r-sm);padding:8px 12px;color:#E8EDF3 !important;
              font-size:13px;font-family:var(--font-ui);caret-color:#E8EDF3 !important;-webkit-text-fill-color:#E8EDF3 !important"
              autocomplete="off" spellcheck="false"/>
          </div>
          <div style="flex:0.8">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Rôle</div>
            <select id="sel-op-role"
              style="width:100%;background:var(--bg-input);border:1px solid var(--border);
              border-radius:var(--r-sm);padding:8px 10px;color:var(--text-primary);
              font-size:13px;font-family:var(--font-ui)">
              <option value="Operateur">Opérateur</option>
              <option value="Responsable">Responsable</option>
            </select>
          </div>
          <button class="btn btn-primary" style="padding:8px 14px;font-size:12px;white-space:nowrap"
            onclick="addOperateur()">+ Ajouter</button>
        </div>

        <div id="admin-op-list">
          <div style="color:var(--text-muted);font-size:12px;padding:8px">Chargement...</div>
        </div>
      </div>


      <!-- Paramètres de pesée -->
      <div class="admin-section">
        <div class="admin-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M12 3v18"/><path d="M7 8h10"/><path d="M7 16h10"/>
          </svg>
          Paramètres de pesée
        </div>

        <div class="admin-row">
          <div>
            <div class="admin-row-label">Nombre de pesées par échantillon</div>
            <div class="admin-row-sub">Définit le nombre de valeurs à saisir pour un contrôle de préemballés</div>
          </div>
          <input id="cfg-sample-size" type="number" min="1" step="1" value="20" onchange="saveSampleSizeSetting()" oninput="saveSampleSizeSetting()"
            style="width:110px;background:var(--bg-input);border:1px solid var(--border);
            border-radius:var(--r-sm);padding:8px 10px;color:var(--text-primary);
            font-size:13px;font-family:var(--font-ui);text-align:right" />
        </div>
      </div>

      <div class="admin-row">
  <div style="flex:1;margin-right:12px">
    <div class="admin-row-label">Balance de référence</div>
    <div class="admin-row-sub">Référence ou type de balance repris dans les rapports PDF</div>
  </div>
  <input
    type="text"
    id="cfg-balance-ref"
    placeholder="ex : Mettler Toledo PBA430"
    oninput="saveBalanceRefSetting()"
    style="min-width:220px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;color:var(--text-primary);font-size:13px;font-family:var(--font-ui)"
    autocomplete="off"
  />
</div>

      <!-- Infos app -->
      <div class="admin-section">
        <div class="admin-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Informations
        </div>
        <div class="admin-row">
          <div><div class="admin-row-label">Application</div></div>
          <div style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono)">QualPack V27 START</div>
        </div>
        <div class="admin-row">
          <div><div class="admin-row-label">Développé par</div></div>
          <div style="font-size:12px;color:var(--blue-light);font-weight:600">CODEX Expertise</div>
        </div>
        <div class="admin-row">
          <div><div class="admin-row-label">Réinitialiser le PIN</div>
            <div class="admin-row-sub">Revenir au PIN par défaut (1234)</div>
          </div>
          <button class="btn btn-red" style="font-size:12px;padding:6px 12px"
            onclick="resetPinToDefault()">Reset</button>
        </div>
      </div>

      <div style="height:16px"></div>
    </div>

  </div>

  <!-- BOTTOM NAV -->
  <nav class="bottom-nav">
    <div class="desktop-side-logo">
      <img src="./icon-192.png" alt="QualPack">

      <div class="desktop-side-logo-text">
        <strong>QualPack</strong>
        <span>by CODEX EXPERTISE</span>
      </div>
    </div>

    <button class="nav-item active" id="nav-pesees" onclick="showScreen('pesees', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M12 3L4 9v12h5v-6h6v6h5V9z"/>
      </svg>
      Pesées
    </button>
    <button class="nav-item" id="nav-detecteur" onclick="showScreen('detecteur', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      Détecteur
    </button>
    <button class="nav-item" id="nav-historique" onclick="showScreen('historique', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/>
      </svg>
      Historique
    </button>
    <button class="nav-item" id="nav-dashboard" onclick="showScreen('dashboard', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      Dashboard
    </button>
    <button class="nav-item" id="nav-admin" onclick="openAdmin(this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
      Admin
    </button>

    <div class="desktop-side-filters" id="desktop-side-filters">
      <div class="desktop-side-filters-title">Filtres dashboard</div>

      <div class="side-period-buttons">
        <button class="side-dp-btn active" id="side-dp-7" onclick="setDashPeriod(7, this)">7 j</button>
        <button class="side-dp-btn" id="side-dp-30" onclick="setDashPeriod(30, this)">30 j</button>
        <button class="side-dp-btn" id="side-dp-90" onclick="setDashPeriod(90, this)">90 j</button>
        <button class="side-dp-btn" id="side-dp-0" onclick="setDashPeriod(0, this)">Tout</button>
      </div>

      <div class="side-filter-field">
        <label>Clients</label>
        <select id="side-dash-filter-client" onchange="setDashFilter('client', this.value)">
          <option value="">Tous les clients</option>
        </select>
      </div>

      <div class="side-filter-field">
        <label>Produits</label>
        <select id="side-dash-filter-product" onchange="setDashFilter('product', this.value)">
          <option value="">Tous les produits</option>
        </select>
      </div>

      <div class="side-filter-field">
        <label>Statut</label>
        <select id="side-dash-filter-status" onchange="setDashFilter('status', this.value)">
          <option value="all">Tous statuts</option>
          <option value="ok">Conformes</option>
          <option value="warn">À surveiller</option>
          <option value="err">Critiques</option>
        </select>
      </div>

      <button class="side-refresh-btn" onclick="refreshDashboard()">↻ Actualiser</button>
    </div>
  </nav>

<!-- OVERLAY PIN ADMIN -->
<div class="pin-overlay hidden" id="pin-overlay">
  <div class="pin-logo">🔐</div>
  <div class="pin-title">Accès Administration</div>
  <div class="pin-subtitle">Entrez votre code PIN responsable qualité</div>
  <div class="pin-dots" id="pin-dots">
    <div class="pin-dot" id="pd0"></div>
    <div class="pin-dot" id="pd1"></div>
    <div class="pin-dot" id="pd2"></div>
    <div class="pin-dot" id="pd3"></div>
  </div>
  <div class="pin-keypad">
    <button class="pin-key" onclick="pinKey('1')">1</button>
    <button class="pin-key" onclick="pinKey('2')">2</button>
    <button class="pin-key" onclick="pinKey('3')">3</button>
    <button class="pin-key" onclick="pinKey('4')">4</button>
    <button class="pin-key" onclick="pinKey('5')">5</button>
    <button class="pin-key" onclick="pinKey('6')">6</button>
    <button class="pin-key" onclick="pinKey('7')">7</button>
    <button class="pin-key" onclick="pinKey('8')">8</button>
    <button class="pin-key" onclick="pinKey('9')">9</button>
    <button class="pin-key empty"></button>
    <button class="pin-key" onclick="pinKey('0')">0</button>
    <button class="pin-key del" onclick="pinDel()">⌫</button>
  </div>
  <div class="pin-error-msg" id="pin-error-msg"></div>
  <button class="pin-cancel" onclick="pinCancel()">Annuler</button>
</div>

</div>

<div class="toast" id="toast"></div>

<script>
async function renderHist() {
  const list = document.getElementById('hist-list');
  if (!list) return;

  const safeDateValue = (item) => {
    const value = item && (item.createdAt || item.date);
    const t = value ? new Date(value).getTime() : 0;
    return Number.isFinite(t) ? t : 0;
  };

  const getSyncMeta = (item) => {
    const status = item?.syncStatus || (item?.synced === true ? 'synced' : item?.synced === false ? 'pending' : 'idle');
    if (status === 'synced') return { cls: 'synced', label: 'Synchronisé' };
    if (status === 'error') return { cls: 'error', label: 'Erreur synchro' };
    if (status === 'pending') return { cls: 'pending', label: 'À synchroniser' };
    return { cls: 'idle', label: 'Statut local' };
  };

  try {
    if (histFilter === 'pesees') {
      const sessionsRaw = await getAllPesees();
      const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : [];

      if (!sessions.length) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">⚖</div>Aucun relevé de pesée enregistré</div>';
        return;
      }

      sessions.sort((a, b) => safeDateValue(b) - safeDateValue(a));

      list.innerHTML = sessions.map(s => {
        const prod = s.prod || 'Produit';
        const of = s.of || '—';
        const controlId = s.controlId || s.id || '—';
        const op = s.op || '—';
        const date = s.date || '—';
        const moy = (s.moy !== undefined && s.moy !== null && s.moy !== '') ? s.moy : '—';
        const vf = s.vF || 'warn';
        const verdictLabel = vf === 'ok' ? 'Conforme' : (vf === 'warn' ? 'À vérifier' : 'Non conforme');
        const syncMeta = getSyncMeta(s);

        return `
          <div class="hist-item">
            <div>
              <div class="hi-title">${prod}  ·  ${of}</div>
             <div class="hi-meta">${controlId}  ·  ${op}  ·  ${date}  ·  ${s.qte ? 'Qté prévue ' + s.qte + ' · ' : ''}moy. ${moy} g</div>
              <div class="sync-badge ${syncMeta.cls}">${syncMeta.label}</div>
            </div>
            <span class="badge ${vf}">${verdictLabel}</span>
          </div>
        `;
      }).join('');
    } else {
      const detsRaw = await getAllDetecteurs();
      const dets = Array.isArray(detsRaw) ? detsRaw : [];

      if (!dets.length) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div>Aucun test détecteur enregistré</div>';
        return;
      }

      dets.sort((a, b) => safeDateValue(b) - safeDateValue(a));

      list.innerHTML = dets.map(d => {
        const eq = d.eq || 'Détecteur';
        const testType = d.testType || d.type || 'Test';
        const controlId = d.controlId || d.id || '—';
        const op = d.op || '—';
        const date = d.date || '—';
        const vf = d.vF || 'warn';
        const verdictLabel = vf === 'ok' ? 'Conforme' : 'Non conforme';
        const syncMeta = getSyncMeta(d);

        return `
          <div class="hist-item">
            <div>
              <div class="hi-title">${eq}  ·  ${testType}</div>
              <div class="hi-meta">${controlId}  ·  ${op}  ·  ${date}</div>
              <div class="sync-badge ${syncMeta.cls}">${syncMeta.label}</div>
            </div>
            <span class="badge ${vf}">${verdictLabel}</span>
          </div>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Erreur renderHist:', error);
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div>Erreur de lecture de l’historique</div>';
  }
}

function reinforceOperateurInputVisibility() {
  const input = document.getElementById('inp-op-nom');
  if (!input) return;
  const forceStyle = () => {
    input.style.width = '140px';
    input.style.minWidth = '140px';
    input.style.color = '#E8EDF3';
    input.style.webkitTextFillColor = '#E8EDF3';
    input.style.caretColor = '#E8EDF3';
    input.style.opacity = '1';
    input.style.background = '#0F2033';
    input.style.textShadow = '0 0 0 #E8EDF3';
  };
  ['focus', 'input', 'keyup', 'change', 'blur', 'click'].forEach(evt => input.addEventListener(evt, forceStyle));
  forceStyle();
}


/* ================================================================
   DONNÉES
   ================================================================ */
/* Catalogue chargé depuis Supabase / IndexedDB (remplace PRODS hardcodé) */
let CATALOGUE = {};   // { "CLIENT": [{id, nom, qn, tu1, tu2, tne, ligne_prod, of_planifies}] }
let OPERATEURS = [];  // [{id, nom, role}]

function normalizeTextKey(v) {
  return String(v || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function dedupeProductsList(products) {
  const map = new Map();
  (products || []).forEach(p => {
    if (!p) return;
    const key = normalizeTextKey(p.nom);
    if (!key) return;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, { ...p });
      return;
    }
    map.set(key, {
      ...prev,
      ...p,
      id: prev.id || p.id,
      nom: prev.nom || p.nom,
      qn: p.qn ?? prev.qn,
      tu1: p.tu1 ?? prev.tu1,
      tu2: p.tu2 ?? prev.tu2,
      tne: p.tne ?? prev.tne,
      ligne_prod: prev.ligne_prod || p.ligne_prod || '',
      detecteur: prev.detecteur || p.detecteur || '',
      of_planifies: prev.of_planifies || p.of_planifies || ''
    });
  });
  return Array.from(map.values()).sort((a,b) => String(a.nom||'').localeCompare(String(b.nom||''), 'fr', { sensitivity:'base' }));
}

function sanitizeCatalogue(rawCatalogue) {
  const clean = {};
  Object.entries(rawCatalogue || {}).forEach(([client, products]) => {
    const clientName = String(client || '').trim();
    if (!clientName) return;
    clean[clientName] = dedupeProductsList(products || []);
  });
  return clean;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}


function qpSiteStorageKey(base) {
  const site =
    (window.QUALPACK_SITE_ID)
      ? window.QUALPACK_SITE_ID
      : (
          localStorage.getItem('qp_v26_test_site_id') ||
          new URLSearchParams(window.location.search).get('site_id') ||
          'default'
        );

  return `${base}_${site}`;
}

const LINE_DETECTEUR_STORAGE_KEY = qpSiteStorageKey('qp_line_detecteurs');
const LINE_CATALOGUE_STORAGE_KEY = qpSiteStorageKey('qp_lines_catalogue');
const DETECTEUR_CATALOGUE_STORAGE_KEY = qpSiteStorageKey('qp_detecteurs_catalogue');
let detecteurManualOverride = false;
let detecteurAutoFilledValue = '';

function getStoredLineCatalogue() {
  try {
    const raw = localStorage.getItem(LINE_CATALOGUE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (e) {
    console.warn('getStoredLineCatalogue error:', e);
    return [];
  }
}

function saveStoredLineCatalogue(lines) {
  try {
    const cleaned = Array.from(new Set((lines || []).map(v => String(v || '').trim()).filter(Boolean)))
      .sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'}));
    localStorage.setItem(LINE_CATALOGUE_STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch (e) {
    console.warn('saveStoredLineCatalogue error:', e);
    return [];
  }
}

function mergeStoredLineCatalogue(lines) {
  const merged = Array.from(new Set([
    ...getStoredLineCatalogue(),
    ...((lines || []).map(v => String(v || '').trim()).filter(Boolean))
  ])).sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'}));
  saveStoredLineCatalogue(merged);
  return merged;
}

function getStoredDetecteurCatalogue() {
  try {
    const raw = localStorage.getItem(DETECTEUR_CATALOGUE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (e) {
    console.warn('getStoredDetecteurCatalogue error:', e);
    return [];
  }
}

function saveStoredDetecteurCatalogue(items) {
  try {
    const cleaned = Array.from(new Set((items || []).map(v => String(v || '').trim()).filter(Boolean)))
      .sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'}));
    localStorage.setItem(DETECTEUR_CATALOGUE_STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch (e) {
    console.warn('saveStoredDetecteurCatalogue error:', e);
    return [];
  }
}

function mergeStoredDetecteurCatalogue(items) {
  const merged = Array.from(new Set([
    ...getStoredDetecteurCatalogue(),
    ...((items || []).map(v => String(v || '').trim()).filter(Boolean))
  ])).sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'}));
  saveStoredDetecteurCatalogue(merged);
  return merged;
}

function getLineDetecteurMap() {
  try {
    const raw = localStorage.getItem(LINE_DETECTEUR_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.warn('getLineDetecteurMap error:', e);
    return {};
  }
}

function saveLineDetecteurMap(map) {
  try {
    localStorage.setItem(LINE_DETECTEUR_STORAGE_KEY, JSON.stringify(map || {}));
  } catch (e) {
    console.warn('saveLineDetecteurMap error:', e);
  }
}

function mergeLineDetecteurMappings(rows) { 
  const current = {};
  let changed = true;
  const detecteurs = [];;

  (rows || []).forEach(r => {
    const line = String((r && (r.ligne_prod || r.ligne || r.LIGNE_PROD || r.LIGNE)) || '').trim();
    const det  = String((r && (r.detecteur || r.DETECTEUR || r.eq || r.nom_detecteur || r.NOM_DETECTEUR)) || '').trim();

    if (det) detecteurs.push(det);

    if (line && det && current[line] !== det) {
      current[line] = det;
      changed = true;
    }
  });

  saveStoredDetecteurCatalogue([...new Set(detecteurs)]);

  if (changed) saveLineDetecteurMap(current);

  return current;
}

function getDetecteurForLine(line) {
  const key = String(line || '').trim();
  if (!key) return '';

  const map = getLineDetecteurMap();
  if (map[key]) return String(map[key]).trim();

  for (const cli of Object.keys(CATALOGUE || {})) {
    const products = CATALOGUE[cli] || [];
    const prodMatch = products.find(p =>
      String((p && p.ligne_prod) || '').trim() === key &&
      String((p && p.detecteur) || '').trim()
    );
    if (prodMatch) return String(prodMatch.detecteur).trim();
  }

  const detMatch = (dets || [])
    .filter(d => !d.site_id || d.site_id === QUALPACK_SITE_ID)
    .find(d =>
      d &&
      String(d.ligne_prod || d.ligne || '').trim() === key &&
      String(d.eq || '').trim()
    );

  return detMatch ? String(detMatch.eq).trim() : '';
}

function getLineForDetecteur(eq) {
  const equip = String(eq || '').trim();
  if (!equip) return '';

  const map = getLineDetecteurMap();
  const entry = Object.entries(map).find(([, det]) => String(det || '').trim() === equip);
  if (entry) return entry[0];

  const detMatch = (dets || [])
    .filter(d => !d.site_id || d.site_id === QUALPACK_SITE_ID)
    .find(d =>
      d &&
      String(d.eq || '').trim() === equip &&
      String((d.ligne_prod || d.ligne || '')).trim()
    );

  return detMatch ? String(detMatch.ligne_prod || detMatch.ligne || '').trim() : '';
}

function getAllDetecteurOptions() {
  const set = new Set();

  getStoredDetecteurCatalogue().forEach(det => {
    const clean = String(det || '').trim();
    if (clean) set.add(clean);
  });

  Object.values(getLineDetecteurMap()).forEach(v => {
    const det = String(v || '').trim();
    if (det) set.add(det);
  });

  const activeClient = document.getElementById('sel-client')?.value || '';
  const catalogueSources = activeClient
    ? (CATALOGUE[activeClient] || [])
    : Object.values(CATALOGUE || {}).flat();

  catalogueSources.forEach(p => {
    const det = String((p && p.detecteur) || '').trim();
    if (det) set.add(det);
  });

  (dets || [])
    .filter(d => !d.site_id || d.site_id === QUALPACK_SITE_ID)
    .forEach(d => {
      const det = String((d && d.eq) || '').trim();
      if (det) set.add(det);
    });

  return Array.from(set).sort((a,b) => a.localeCompare(b, 'fr', { sensitivity:'base' }));
}

function populateDetecteurSelect(selectedValue = '', preferredValue = '') {
  const sel = document.getElementById('d-equip');
  if (!sel) return;
  const current = String(selectedValue || sel.value || '').trim();
  const preferred = String(preferredValue || '').trim();
  const all = getAllDetecteurOptions();
  const ordered = [];
  if (preferred) ordered.push(preferred);
  all.forEach(v => { if (!ordered.includes(v)) ordered.push(v); });
  if (current && !ordered.includes(current)) ordered.push(current);

  sel.innerHTML = '<option value="">— Sélectionner un détecteur —</option>';
  ordered.forEach(det => {
    sel.innerHTML += `<option value="${escapeHtml(det)}">${escapeHtml(det)}</option>`;
  });
  if (current) sel.value = current;
}

function autoFillDetecteurFromLine(force = false) {
  const lineSel = document.getElementById('d-ligne');
  const eqSel = document.getElementById('d-equip');
  if (!lineSel || !eqSel) return;
  const line = String(lineSel.value || '').trim();
  const mapped = getDetecteurForLine(line);
  populateDetecteurSelect(eqSel.value, mapped);
  if (!mapped) { chkD1(); return; }
  const current = String(eqSel.value || '').trim();
  const shouldApply = force || !current || !detecteurManualOverride || current === detecteurAutoFilledValue;
  if (shouldApply) {
    eqSel.value = mapped;
    detecteurAutoFilledValue = mapped;
    detecteurManualOverride = false;
  }
  chkD1();
}

function onDetecteurLigneChange() {
  autoFillDetecteurFromLine(false);
}

function onDetecteurEquipChange() {
  const eqSel = document.getElementById('d-equip');
  const lineSel = document.getElementById('d-ligne');
  const equip = String(eqSel?.value || '').trim();
  const line = String(lineSel?.value || '').trim();
  const mapped = line ? getDetecteurForLine(line) : '';
  detecteurManualOverride = !!equip && !!mapped && equip !== mapped;
  if (!line && equip) {
    const inferredLine = getLineForDetecteur(equip);
    if (inferredLine) {
      populateLineSelect('d-ligne', inferredLine);
    }
  }
  chkD1();
}

function getAvailableLines() {
  const set = new Set();

  getStoredLineCatalogue().forEach(line => {
    const clean = String(line || '').trim();
    if (clean) set.add(clean);
  });

  const activeClient = document.getElementById('sel-client')?.value || '';
  const catalogueSources = activeClient
    ? (CATALOGUE[activeClient] || [])
    : Object.values(CATALOGUE || {}).flat();

  catalogueSources.forEach(p => {
    const line = String((p && p.ligne_prod) || '').trim();
    if (line) set.add(line);
  });

  (sessions || [])
    .filter(s => !s.site_id || s.site_id === QUALPACK_SITE_ID)
    .forEach(s => {
      const line = String((s && (s.ligne_prod || s.ligne)) || '').trim();
      if (line) set.add(line);
    });

  (dets || [])
    .filter(d => !d.site_id || d.site_id === QUALPACK_SITE_ID)
    .forEach(d => {
      const line = String((d && (d.ligne_prod || d.ligne)) || '').trim();
      if (line) set.add(line);
    });

  return Array.from(set).sort((a,b) => a.localeCompare(b, 'fr', {sensitivity:'base'}));
}

function populateLineSelect(selectId, selectedValue = '') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const current = selectedValue || sel.value || '';
  const options = getAvailableLines();
  sel.innerHTML = '<option value="">— Sélectionner une ligne —</option>';
  options.forEach(line => {
    sel.innerHTML += `<option value="${escapeHtml(line)}">${escapeHtml(line)}</option>`;
  });
  if (current) {
    if (!options.includes(current)) {
      sel.innerHTML += `<option value="${escapeHtml(current)}">${escapeHtml(current)}</option>`;
    }
    sel.value = current;
  }
}

function prefillDetecteurLineFromEquip() {
  const equip = document.getElementById('d-equip')?.value || '';
  const lineSel = document.getElementById('d-ligne');
  if (!lineSel || !equip) return;
  const existingValue = lineSel.value;
  if (existingValue) return;

  const line = getLineForDetecteur(equip);
  if (line) {
    populateLineSelect('d-ligne', line);
  }
}

let curProd = null;
let detState = {fer:null, nfer:null, inox:null};
let sessions = [];
let dets = [];
let histFilter = 'pesees';
let deferredInstall = null;

/* Chargement depuis IndexedDB au démarrage */
async function loadFromDB() {
  try {
    const db = await openDB();
    sessions = await new Promise((res, rej) => {
      const tx = db.transaction('pesees', 'readonly');
      const req = tx.objectStore('pesees').getAll();
      req.onsuccess = () => res(req.result.sort((a,b) => b.id.localeCompare(a.id)));
      req.onerror = () => rej(req.error);
    });
    dets = await new Promise((res, rej) => {
      const tx = db.transaction('detecteurs', 'readonly');
      const req = tx.objectStore('detecteurs').getAll();
      req.onsuccess = () => res(req.result.sort((a,b) => b.id.localeCompare(a.id)));
      req.onerror = () => rej(req.error);
    });
  } catch(e) {
    console.warn('IndexedDB load error — fallback localStorage:', e);
    try {
      sessions = JSON.parse(localStorage.getItem('qp_sessions') || '[]');
      dets     = JSON.parse(localStorage.getItem('qp_dets')     || '[]');
    } catch(e2) {
      sessions = []; dets = [];
    }
  }
}
// Attendre que le DOM ET db.js soient prêts avant d'initialiser IndexedDB
document.addEventListener('DOMContentLoaded', async () => {
  if (!qpCheckTrialStatus()) return;
  const accessOk = await qpEnsureSiteAccess();
  if (!accessOk) return;
  resetCurrentSampleSizeFromDefault();
  refreshSampleSizeUI();
  refreshBalanceRefUI();
  initCatalogue();   // V12 — charge clients/produits/opérateurs depuis Supabase
  loadFromDB().then(() => {
    if (document.getElementById('screen-historique').classList.contains('active')) {
      renderHist();
    }
  });
});

/* ================================================================
   NAVIGATION
   ================================================================ */
function showScreen(name, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'historique') renderHist();
  if (name === 'dashboard')  renderDashboard();
}

/* Admin : passe par le PIN avant d'afficher l'écran */
function openAdmin(btn) {
  window._adminNavBtn = btn;
  showPinOverlay();
}

/* ================================================================
   STATUS RÉSEAU
   ================================================================ */
function updateNetStatus() {
  const dot = document.getElementById('status-dot');
  const lbl = document.getElementById('status-label');
  if (navigator.onLine) {
    dot.classList.remove('offline');
    lbl.textContent = 'En ligne';
  } else {
    dot.classList.add('offline');
    lbl.textContent = 'Hors-ligne';
  }
}
window.addEventListener('online',  updateNetStatus);
window.addEventListener('offline', updateNetStatus);
updateNetStatus();
reinforceOperateurInputVisibility();

/* ================================================================
   PWA — INSTALLATION
   ================================================================ */
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  document.getElementById('install-banner').classList.add('show');
});
function installApp() {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  deferredInstall.userChoice.then(() => {
    deferredInstall = null;
    document.getElementById('install-banner').classList.remove('show');
  });
}
window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner').classList.remove('show');
  toast('QualPack installée avec succès !', 'ok');
});

/* ================================================================
   PESÉES — STEP 1
   ================================================================ */
function getProductsForClientSelection(clientName = '') {
  if (clientName) {
    return (CATALOGUE[clientName] || []).map(p => ({ ...p, _client: clientName }));
  }

  // V26-test : client facultatif => tous les produits restent sélectionnables.
  const all = [];
  Object.entries(CATALOGUE || {}).forEach(([cli, products]) => {
    (products || []).forEach(p => all.push({ ...p, _client: cli }));
  });
  return all.sort((a, b) => String(a.nom || '').localeCompare(String(b.nom || ''), 'fr', { sensitivity: 'base' }));
}

function populateProduitSelect(clientName = '') {
  const sel = document.getElementById('sel-produit');
  if (!sel) return;
  const current = sel.value;
  const products = getProductsForClientSelection(clientName);
  sel.innerHTML = "<option value=''>— Sélectionner un produit —</option>";
  products.forEach((p, idx) => {
    const value = `${p._client}||${p.id || idx}`;
    const label = clientName ? p.nom : `${p.nom}${p._client && p._client !== 'Non renseigné' && p._client !== 'Non spécifié' ? ' · ' + p._client : ''}`;
    sel.innerHTML += `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
  });
  sel.disabled = false;
  if (current && [...sel.options].some(o => o.value === current)) sel.value = current;
}

function onClient() {
  const c = document.getElementById('sel-client').value;
  curProd = null;
  document.getElementById('prod-info').classList.remove('show');
  populateLineSelect('inp-ligne', '');
  populateProduitSelect(c);
  chk1();
}

function onProduit() {
  const c = document.getElementById('sel-client').value;
  const selected = document.getElementById('sel-produit').value;
  const [selectedClient, selectedId] = String(selected || '').split('||');
  const effectiveClient = c || selectedClient || '';
  curProd = (CATALOGUE[effectiveClient] || []).find(p => String(p.id) === String(selectedId)) || null;
  if (curProd) curProd._client = effectiveClient;
  const strip = document.getElementById('prod-info');

  const inpQte = document.getElementById('inp-qte');

  if (curProd) {
    document.getElementById('ip-qn').textContent  = curProd.qn  + ' g';
    document.getElementById('ip-tu1').textContent = curProd.tu1 + ' g';
    document.getElementById('ip-tu2').textContent = curProd.tu2 + ' g';
    document.getElementById('ip-tne').textContent = curProd.tne + ' g';
    document.getElementById('ip-tare').textContent =
      curProd.tare_fixe_g != null && curProd.tare_fixe_g !== ''
        ? String(curProd.tare_fixe_g).replace('.', ',') + ' g'
        : '—';

    strip.classList.add('show');

    /* Ligne de production habituelle */
    const ligne = curProd.ligne_prod || '';
    populateLineSelect('inp-ligne', ligne);

    /* Quantité prévue par défaut */
    if (inpQte) {
      const qteDefaut =
        curProd.quantite_prevue_defaut ??
        curProd.quantite_prevue ??
        curProd.qte_defaut ??
        '';

      inpQte.value = qteDefaut || '';
    }

    /* OF libre en V1 : saisie manuelle chaque jour */
    const selOf  = document.getElementById('sel-of');
    const inpOf  = document.getElementById('inp-of');

    selOf.style.display = 'none';
    inpOf.style.display = 'block';

    if (!inpOf.value) {
      inpOf.value = '';
    }

  } else {
    strip.classList.remove('show');
    populateLineSelect('inp-ligne', '');

    document.getElementById('sel-of').style.display = 'none';
    document.getElementById('inp-of').style.display = 'block';

    const tareEl = document.getElementById('ip-tare');
    if (tareEl) tareEl.textContent = '—';

    if (inpQte) inpQte.value = '';
  }

  chk1();
}
  function onOfSelect() {
  const val   = document.getElementById('sel-of').value;
  const inpOf = document.getElementById('inp-of');

  if (val === '__autre__') {
    inpOf.style.display = 'block';
    inpOf.value = '';
    inpOf.focus();
  } else {
    inpOf.style.display = 'none';
    inpOf.value = val;
  }

  chk1();
}

window.onOfSelect = onOfSelect;

function chk1() {
  const ofVal = document.getElementById('sel-of').style.display !== 'none'
    ? document.getElementById('sel-of').value && document.getElementById('sel-of').value !== '__autre__'
      ? document.getElementById('sel-of').value
      : document.getElementById('inp-of').value.trim()
    : document.getElementById('inp-of').value.trim();

  // V26-test : le client devient facultatif. Les champs obligatoires restent : produit, opérateur, OF.
  const ok = document.getElementById('sel-produit').value
    && document.getElementById('sel-op').value
    && ofVal;
  document.getElementById('btn-ps1').disabled = !ok;
}

function showStep(prefix, n) {
  document.querySelectorAll(`#screen-${prefix} .step`).forEach(s => s.classList.remove('active'));
  document.getElementById((prefix === 'pesees' ? 'ps' : 'ds') + n).classList.add('active');
  document.getElementById('main-content').scrollTop = 0;
}

function getOFValue() {
  const selOf = document.getElementById('sel-of');
  if (selOf.style.display !== 'none' && selOf.value && selOf.value !== '__autre__') return selOf.value;
  return document.getElementById('inp-of').value.trim();
}


function getDefaultSampleSize() {
  const v = parseInt(localStorage.getItem('qp_sample_size') || '20', 10);
  return Number.isFinite(v) && v >= 1 ? v : 20;
}

function getSampleSize() {
  // Priorité V26 : champ de l'échantillon en cours > réglage Admin > valeur de sécurité 20.
  const currentInput = document.getElementById('inp-sample-size');
  if (currentInput && currentInput.value !== '') {
    const current = parseInt(String(currentInput.value || '').replace(',', '.'), 10);
    if (Number.isFinite(current) && current >= 1) return current;
  }

  return getDefaultSampleSize();
}

function setSampleSize(v) {
  const n = parseInt(String(v || '').replace(',', '.'), 10);
  localStorage.setItem('qp_sample_size', String(Number.isFinite(n) && n >= 1 ? n : 20));
}

function resetCurrentSampleSizeFromDefault() {
  const inp = document.getElementById('inp-sample-size');
  if (!inp) return;
  inp.value = String(getDefaultSampleSize());
}

function refreshSampleSizeUI() {
  const expectedCount = getSampleSize();

  const sel = document.getElementById('cfg-sample-size');
  if (sel) sel.value = String(getDefaultSampleSize());

  const title = document.getElementById('ps2-title');
  if (title) title.textContent = `${expectedCount} pesées`;

  const scn = document.getElementById('sc-n');
  if (scn) {
    const current = (typeof getVals === 'function') ? getVals().length : 0;
    scn.textContent = `${current} / ${expectedCount}`;
  }
}

function onSampleSizeCurrentChange() {
  refreshSampleSizeUI();

  if (document.getElementById('ps2') && document.getElementById('ps2').classList.contains('active')) {
    buildGrid();
    updateLiveStats();
  }
}

function saveSampleSizeSetting() {
  const inp = document.getElementById('cfg-sample-size');
  setSampleSize(inp ? inp.value : 20);
  refreshSampleSizeUI();
  if (document.getElementById('ps2').classList.contains('active')) {
    buildGrid();
    updateLiveStats();
    setTimeout(() => document.getElementById('p1') && document.getElementById('p1').focus(), 150);
  }
}
  function getBalanceRef() {
  return (localStorage.getItem('qp_balance_ref') || '').trim();
}

function setBalanceRef(value) {
  localStorage.setItem('qp_balance_ref', String(value || '').trim());
}

function refreshBalanceRefUI() {
  const inp = document.getElementById('cfg-balance-ref');
  if (inp) inp.value = getBalanceRef();
}

function saveBalanceRefSetting() {
  const inp = document.getElementById('cfg-balance-ref');
  setBalanceRef(inp ? inp.value : '');
}

function goPS2() {
  showStep('pesees', 2);
  const ligne = document.getElementById('inp-ligne').value.trim();

  const inpSample = document.getElementById('inp-sample-size');
  if (inpSample && !inpSample.value) {
    inpSample.value = String(getDefaultSampleSize());
  }

  refreshSampleSizeUI();
  document.getElementById('ps2-sub').textContent =
    curProd.nom + (ligne ? '  ·  ' + ligne : '') + '  ·  Qn ' + curProd.qn + ' g  ·  ' + getOFValue();
  buildGrid();
  updateLiveStats();
  setTimeout(() => document.getElementById('p1') && document.getElementById('p1').focus(), 150);
}

function goPS1back() { showStep('pesees', 1); }

/* ================================================================
   PESÉES — STEP 2
   ================================================================ */
function buildGrid() {
  const g = document.getElementById('pesees-grid');
  const expectedCount = getSampleSize();
  g.innerHTML = '';
  for (let i = 1; i <= expectedCount; i++) {
    g.innerHTML += `
      <div class="p-cell">
        <span class="p-num">#${String(i).padStart(2,'0')}</span>
        <input class="p-input" type="number" step="0.1" id="p${i}" placeholder="—"
          oninput="colorCell(${i})" onkeydown="nextCell(event,${i})"
          inputmode="decimal" />
      </div>`;
  }
}

function nextCell(e, i) {
  const expectedCount = getSampleSize();
  if (e.key === 'Enter' && i < expectedCount) {
    e.preventDefault();
    document.getElementById('p' + (i + 1)).focus();
  }
}

function getCurrentTareFixe() {
  if (!curProd) return 0;
  const raw = curProd.tare_fixe_g ?? curProd.tareFixe_g ?? curProd.tare_fixe ?? curProd.tare ?? 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function grossToNet(value) {
  const x = Number(value);
  if (!Number.isFinite(x)) return NaN;
  return x - getCurrentTareFixe();
}

function colorCell(i) {
  const inp = document.getElementById('p' + i);
  const gross = parseFloat(inp.value);
  const net = grossToNet(gross);

  inp.classList.remove('ok', 'warn', 'err');
  if (!isNaN(net) && curProd) {
    if      (net < curProd.tu2) inp.classList.add('err');
    else if (net < curProd.tu1) inp.classList.add('warn');
    else                        inp.classList.add('ok');
  }
  updateLiveStats();
}

function getGrossVals() {
  const v = [];
  const expectedCount = getSampleSize();
  for (let i = 1; i <= expectedCount; i++) {
    const el = document.getElementById('p' + i);
    if (!el) continue;
    const x = parseFloat(el.value);
    if (!isNaN(x)) v.push(x);
  }
  return v;
}

function getNetVals() {
  return getGrossVals()
    .map(grossToNet)
    .filter(x => !isNaN(x));
}

function getVals() {
  return getGrossVals();
}

function updateLiveStats() {
  const expectedCount = getSampleSize();
  const vGross = getGrossVals();
  const vNet = getNetVals();
  const n = vGross.length;

  const bar = document.getElementById('prog-bar');
  bar.style.width = (n / expectedCount * 100) + '%';
  bar.className = 'prog-bar' + (n === expectedCount ? ' full' : '');

  document.getElementById('sc-n').textContent = n + ' / ' + expectedCount;

  let tu1 = 0, tu2 = 0;
  if (curProd) vNet.forEach(x => { if (x < curProd.tu2) tu2++; else if (x < curProd.tu1) tu1++; });

  const moy = vNet.length ? (vNet.reduce((a, b) => a + b, 0) / vNet.length) : null;
  const moyEl = document.getElementById('sc-moy');
  moyEl.textContent = moy !== null ? moy.toFixed(1) + ' g' : '—';
  moyEl.className = 'stat-val' + (moy === null ? '' : (moy >= curProd.qn ? ' ok' : ' err'));

  const maxTU1Live = getMaxTU1Allowed(expectedCount);
document.getElementById('sc-tu1').textContent = `${tu1} / ${expectedCount} (${maxTU1Live} autorisé)`;
document.getElementById('sc-tu1').className = 'stat-val' + (tu1 > maxTU1Live ? ' err' : (tu1 > 0 ? ' warn' : ''));

  document.getElementById('sc-tu2').textContent = tu2;
  document.getElementById('sc-tu2').className = 'stat-val' + (tu2 > 0 ? ' err' : '');

  document.getElementById('btn-ps2').disabled = n < expectedCount;
}

/* ================================================================
   PESÉES — STEP 3
   ================================================================ */
function getMaxTU1Allowed(n) {
  const count = Number(n);
  if (!Number.isFinite(count) || count < 1) return 0;
  // Règle V26-test sécurisée : 2 % max, et 0 défaut TU1 autorisé sous 50 unités contrôlées.
  return count < 50 ? 0 : Math.floor(count * 0.02);
}

function getTauxTU1(nbTU1, n) {
  const count = Number(n);
  if (!Number.isFinite(count) || count < 1) return 0;
  return (Number(nbTU1 || 0) / count) * 100;
}

function calcStats() {
  const vGross = getGrossVals();
  const vNet = getNetVals();
  const n = vNet.length;

  const moy = vNet.reduce((a, b) => a + b, 0) / n;
  const et  = Math.sqrt(vNet.reduce((a, b) => a + (b - moy) ** 2, 0) / n);

  let tu1 = 0, tu2 = 0;
  if (curProd) vNet.forEach(x => { if (x < curProd.tu2) tu2++; else if (x < curProd.tu1) tu1++; });

  const maxTU1 = getMaxTU1Allowed(n);
  const tauxTU1 = getTauxTU1(tu1, n);

  const vMoy = moy >= curProd.qn ? 'CONFORME' : 'NON CONFORME';
  const vDef = (tu2 === 0 && tu1 <= maxTU1) ? 'CONFORME' : 'NON CONFORME';
  const vF   = (vMoy === 'CONFORME' && vDef === 'CONFORME') ? 'ok' : 'err';

  return { v: vGross, vGross, vNet, moy, et, tu1, tu2, maxTU1, tauxTU1, vMoy, vDef, vF };
}

function goPS3() {
  const r = calcStats();
  const now = new Date().toLocaleString('fr-FR');
  const cli = document.getElementById('sel-client').value || curProd?._client || 'Non spécifié';
  const op  = document.getElementById('sel-op').value;
  const of  = getOFValue();
  const ligne = document.getElementById('inp-ligne').value.trim();
  const tareFixe = getCurrentTareFixe();
  const moyGross = Array.isArray(r.vGross) && r.vGross.length
    ? (r.vGross.reduce((a, b) => a + b, 0) / r.vGross.length)
    : null;

  showStep('pesees', 3);

  document.getElementById('ps3-sub').textContent =
    curProd.nom
    + (ligne ? ' · ' + ligne : '')
    + ' · Qn ' + curProd.qn + ' g'
    + ' · N° OF ' + of;

  const vb = document.getElementById('verdict-pesee');
  vb.className = 'verdict ' + r.vF;
  document.getElementById('verd-icon').textContent = r.vF === 'ok' ? '✅' : '🚫';

  let verdictTitle = 'Échantillon conforme';
  let verdictSub = 'Calcul réglementaire réalisé sur le poids net après déduction de la tare fixe';

  if (r.vF !== 'ok') {
    verdictTitle = 'Échantillon non conforme';
    if (r.tu2 > 0) {
      verdictSub = 'Non conforme – présence de défaut(s) TU2, aucun défaut TU2 autorisé';
    } else if (r.tu1 > r.maxTU1) {
      verdictSub = `TU1 trop élevé (${r.tu1} / ${r.vNet.length} – ${r.maxTU1} autorisé)`;
    } else if (r.moy < curProd.qn) {
      verdictSub = 'Non conforme – moyenne nette inférieure au poids nominal Qn';
    } else {
      verdictSub = 'Non conforme – revue qualité nécessaire';
    }
  }

  document.getElementById('verd-title').textContent = verdictTitle;
  document.getElementById('verd-sub').textContent = verdictSub;

  document.getElementById('r-moy-gross').textContent =
    moyGross !== null ? moyGross.toFixed(2) + ' g' : '—';
  document.getElementById('r-moy-gross').className = 'stat-val';

  document.getElementById('r-tare').textContent =
    tareFixe ? tareFixe.toFixed(2) + ' g' : '0.00 g';
  document.getElementById('r-tare').className = 'stat-val';

  document.getElementById('r-moy').textContent = r.moy.toFixed(2) + ' g';
  document.getElementById('r-moy').className =
    'stat-val ' + (r.moy >= curProd.qn ? 'ok' : 'err');

  document.getElementById('r-et').textContent = r.et.toFixed(2) + ' g';
  document.getElementById('r-et').className = 'stat-val';

  document.getElementById('r-tu1').textContent = `${r.tu1} / ${r.vNet.length} (${r.maxTU1} autorisé)`;
  document.getElementById('r-tu1').className =
    'stat-val' + (r.tu1 > r.maxTU1 ? ' err' : ' ok');

  document.getElementById('r-tu2').textContent = r.tu2;
  document.getElementById('r-tu2').className =
    'stat-val' + (r.tu2 > 0 ? ' err' : ' ok');

  document.getElementById('rc-cli').textContent = cli;
  document.getElementById('rc-prod').textContent = curProd.nom;
  document.getElementById('rc-ligne').textContent = ligne || '—';
  document.getElementById('rc-of').textContent = of;
  document.getElementById('rc-op').textContent = op;
  document.getElementById('rc-date').textContent = now;
  document.getElementById('rc-mode').textContent = 'Poids brut saisi / net calculé';
  document.getElementById('rc-tare').textContent =
    tareFixe ? tareFixe.toFixed(2) + ' g' : '0.00 g';
  document.getElementById('rc-mg').textContent =
    moyGross !== null ? moyGross.toFixed(2) + ' g' : '—';
  document.getElementById('rc-mn').textContent = r.moy.toFixed(2) + ' g';

  const vmEl = document.getElementById('rc-vm');
  vmEl.textContent = r.vMoy;
  vmEl.className = 'rv ' + (r.vMoy === 'CONFORME' ? 'ok' : 'err');

  const vdEl = document.getElementById('rc-vd');
  vdEl.textContent = r.vDef;
  vdEl.className = 'rv ' + (r.vDef === 'CONFORME' ? 'ok' : 'err');

 const qtePrevue = parseInt(document.getElementById('inp-qte').value, 10) || null;

window._lastPesee = {
  r,
  cli,
  op,
  of,
  now,
  prod: curProd,
  ligne_prod: ligne || null,
  qte: qtePrevue,
  tare_fixe_g: curProd?.tare_fixe_g ?? null,
  qn: curProd?.qn ?? null,
  tne: curProd?.tne ?? null,
  tu1_limite: curProd?.tu1 ?? null,
  moyGross: moyGross
};
}

async function saveSession() {
  if (!window._lastPesee) return;

  if (window._lastPeseeSaved === true) {
    toast('Cette série de pesées est déjà enregistrée ✓', 'ok');
    return;
  }

  if (window._savePeseeInProgress === true) return;
  window._savePeseeInProgress = true;

  const btn = document.getElementById('btn-save-pesee');
  const oldText = btn ? btn.innerHTML : '';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Enregistrement...';
  }

  const { r, cli, op, of, now, prod, ligne_prod, tare_fixe_g, qn, tne, tu1_limite, moyGross } = window._lastPesee;
  const ligne = (ligne_prod || document.getElementById('inp-ligne').value || '').trim();
  const qte = parseInt(document.getElementById('inp-qte').value) || null;

  const record = {
    id: window._lastPeseeId || ('pesee_' + Date.now()),
    site_id: QUALPACK_SITE_ID,
    type: 'pesee',
    cli,
    prod: prod.nom,
    of,
    op,
    date: now,
    ligne: ligne || null,
    ligne_prod: ligne || null,
    qte: qte,
    qn: qn,
    tne: tne,
    tu1_limite: tu1_limite,
    tare_fixe_g: tare_fixe_g,
    moy: r.moy.toFixed(2),
    et: r.et.toFixed(2),
    tu1: r.tu1,
    tu2: r.tu2,
    maxTU1: r.maxTU1,
    tauxTU1: Number.isFinite(r.tauxTU1) ? r.tauxTU1.toFixed(2) : '0.00',
    vMoy: r.vMoy,
    vDef: r.vDef,
    vF: r.vF,
    pesees: r.v,
    synced: false
  };

  window._lastPeseeId = record.id;

  try {
    await savePesee(record);
    sessions.unshift(record);
    window._lastPeseeSaved = true;
    toast('Relevé enregistré ✓', 'ok');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '✅ Enregistré';
    }
  } catch (e) {
    console.error('IndexedDB saveSession error:', e);

    try {
      const stored = JSON.parse(localStorage.getItem('qp_sessions') || '[]');

      const alreadyExists = stored.some(x => x && x.id === record.id);
      if (!alreadyExists) {
        stored.unshift(record);
        localStorage.setItem('qp_sessions', JSON.stringify(stored));
        sessions.unshift(record);
      }

      window._lastPeseeSaved = true;
      toast('Relevé enregistré (local) ✓', 'ok');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '✅ Enregistré';
      }
    } catch (e2) {
      window._savePeseeInProgress = false;

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = oldText || '💾 Enregistrer';
      }

      toast('Erreur enregistrement', 'err');
      return;
    }
  }

  window._savePeseeInProgress = false;

  // Sync Supabase en arrière-plan seulement si disponible
  if (typeof syncPesee === 'function') {
    try {
      const ok = await syncPesee(record);
      if (ok) toast('Synchronisé ✓', 'ok');
    } catch (err) {
      console.warn('syncPesee failed:', err);
    }
  }
}
  
function newPesee() {
  window._lastPesee = null;
  window._lastPeseeId = null;
  window._lastPeseeSaved = false;
  window._savePeseeInProgress = false;

  const btnSave = document.getElementById('btn-save-pesee');
  if (btnSave) {
    btnSave.disabled = false;
    btnSave.innerHTML = '💾 Enregistrer';
  }

  showStep('pesees', 1);
  document.getElementById('sel-client').value = '';
  populateProduitSelect('');
  document.getElementById('sel-produit').value = '';
  document.getElementById('sel-op').value = '';
  document.getElementById('inp-of').value = '';
  document.getElementById('inp-qte').value = '';
  const inpSample = document.getElementById('inp-sample-size');
  if (inpSample) inpSample.value = String(getDefaultSampleSize());
  populateLineSelect('inp-ligne', '');
  document.getElementById('sel-of').style.display = 'none';
  document.getElementById('inp-of').style.display = 'block';
  document.getElementById('prod-info').classList.remove('show');
  document.getElementById('btn-ps1').disabled = true;
  curProd = null;
}

/* ================================================================
   DÉTECTEUR — STEP 1
   ================================================================ */
function chkD1() {
  prefillDetecteurLineFromEquip();
  document.getElementById('btn-ds1').disabled =
    !(document.getElementById('d-equip').value
    && document.getElementById('d-op').value
    && document.getElementById('d-type').value);
}

function goDS2() {
  detState = { fer:null, nfer:null, inox:null };
  ['fer','nfer','inox'].forEach(k => {
    document.getElementById('dc-' + k).className = 'det-card';
    document.getElementById('ds-' + k).textContent = '— Non testé';
  });
  document.getElementById('btn-ds2').disabled = true;
  const ligne = document.getElementById('d-ligne').value.trim();
  document.getElementById('ds2-sub').textContent =
    document.getElementById('d-equip').value + (ligne ? '  ·  ' + ligne : '') + '  ·  ' + document.getElementById('d-type').value;
  showStep('detecteur', 2);
}

function goDS1back() { showStep('detecteur', 1); }

/* ================================================================
   DÉTECTEUR — STEP 2
   ================================================================ */
function toggleDet(k) {
  setDet(k, detState[k] === null ? true : !detState[k]);
}

function setDet(k, pass) {
  detState[k] = pass;
  const card = document.getElementById('dc-' + k);
  const stat = document.getElementById('ds-' + k);
  card.className = 'det-card ' + (pass ? 'pass' : 'fail');
  stat.textContent = pass ? '✓ Réussi' : '✗ Échoué';
  chkDS2();
}

function chkDS2() {
  document.getElementById('btn-ds2').disabled = Object.values(detState).some(v => v === null);
}

/* ================================================================
   DÉTECTEUR — STEP 3
   ================================================================ */
function goDS3() {
  const eq   = document.getElementById('d-equip').value;
  const op   = document.getElementById('d-op').value;
  const of   = document.getElementById('d-of').value.trim() || '—';
  const type = document.getElementById('d-type').value;
  const ligne = document.getElementById('d-ligne').value.trim();
  const now  = new Date().toLocaleString('fr-FR');
  const allOk = Object.values(detState).every(v => v === true);
  const vF = allOk ? 'ok' : 'err';

  showStep('detecteur', 3);

  document.getElementById('ds3-sub').textContent = eq + (ligne ? '  ·  ' + ligne : '') + '  ·  ' + type;

  const dvb = document.getElementById('verdict-det');
  dvb.className = 'verdict ' + vF;
  document.getElementById('d-verd-icon').textContent  = allOk ? '✅' : '🚫';
  document.getElementById('d-verd-title').textContent = allOk ? 'Détecteur conforme' : 'Détecteur non conforme';
  document.getElementById('d-verd-sub').textContent   = allOk ? 'Les 3 étalons ont été correctement détectés' : 'Un ou plusieurs étalons non détectés — Arrêt de ligne requis';

  document.getElementById('dr-eq').textContent   = eq;
  document.getElementById('dr-ligne').textContent = ligne || '—';
  document.getElementById('dr-op').textContent   = op;
  document.getElementById('dr-of').textContent   = of;
  document.getElementById('dr-type').textContent = type;
  document.getElementById('dr-date').textContent = now;

  const ferEl  = document.getElementById('dr-fer');
  const nferEl = document.getElementById('dr-nfer');
  const inoxEl = document.getElementById('dr-inox');
  ferEl.textContent  = detState.fer  ? 'Réussi' : 'Échoué';
  nferEl.textContent = detState.nfer ? 'Réussi' : 'Échoué';
  inoxEl.textContent = detState.inox ? 'Réussi' : 'Échoué';
  ferEl.className  = 'rv ' + (detState.fer  ? 'ok' : 'err');
  nferEl.className = 'rv ' + (detState.nfer ? 'ok' : 'err');
  inoxEl.className = 'rv ' + (detState.inox ? 'ok' : 'err');

  window._lastDet = { eq, op, of, type, now, ligne_prod: ligne || null, vF, fer:detState.fer, nfer:detState.nfer, inox:detState.inox };
}

async function saveDet() {
  if (!window._lastDet) return;

  if (window._lastDetSaved === true) {
    toast('Ce test détecteur est déjà enregistré ✓', 'ok');
    return;
  }

  if (window._saveDetInProgress === true) return;
  window._saveDetInProgress = true;

  const btn = document.getElementById('btn-save-det');
  const oldText = btn ? btn.innerHTML : '';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Enregistrement...';
  }

  const record = {
    id: window._lastDetId || ('det_' + Date.now()),
    site_id: QUALPACK_SITE_ID,
    type: 'det',
    ligne: window._lastDet.ligne_prod || null,
    ...window._lastDet,
    synced: false
  };

  window._lastDetId = record.id;

  try {
    await saveDetecteur(record);

    const alreadyInMemory = dets.some(x => x && x.id === record.id);
    if (!alreadyInMemory) dets.unshift(record);

    window._lastDetSaved = true;
    toast('Test enregistré ✓', 'ok');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '✅ Enregistré';
    }
  } catch (e) {
    console.error('IndexedDB saveDet error:', e);

    try {
      const stored = JSON.parse(localStorage.getItem('qp_dets') || '[]');

      const alreadyExists = stored.some(x => x && x.id === record.id);
      if (!alreadyExists) {
        stored.unshift(record);
        localStorage.setItem('qp_dets', JSON.stringify(stored));
      }

      const alreadyInMemory = dets.some(x => x && x.id === record.id);
      if (!alreadyInMemory) dets.unshift(record);

      window._lastDetSaved = true;
      toast('Test enregistré (local) ✓', 'ok');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '✅ Enregistré';
      }
    } catch (e2) {
      window._saveDetInProgress = false;

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = oldText || '💾 Enregistrer';
      }

      toast('Erreur enregistrement', 'err');
      return;
    }
  }

  window._saveDetInProgress = false;

  // Sync Supabase en arrière-plan seulement si disponible
  if (typeof syncDetecteur === 'function') {
    try {
      const ok = await syncDetecteur(record);
      if (ok) toast('Synchronisé ✓', 'ok');
    } catch (err) {
      console.warn('syncDetecteur failed:', err);
    }
  }
}

function newDet() {
  window._lastDet = null;
  window._lastDetId = null;
  window._lastDetSaved = false;
  window._saveDetInProgress = false;

  const btnSave = document.getElementById('btn-save-det');
  if (btnSave) {
    btnSave.disabled = false;
    btnSave.innerHTML = '💾 Enregistrer';
  }

  showStep('detecteur', 1);
  ['d-equip','d-op','d-of','d-type','d-ligne'].forEach(id => document.getElementById(id).value = '');
  detecteurManualOverride = false;
  detecteurAutoFilledValue = '';
  populateLineSelect('d-ligne', '');
  populateDetecteurSelect('', '');
  document.getElementById('btn-ds1').disabled = true;
}
/* ================================================================
   HISTORIQUE
   ================================================================ */
function filterHist(f) {
  histFilter = f;
  document.getElementById('hf-p').className = 'hf-btn' + (f === 'pesees' ? ' active' : '');
  document.getElementById('hf-d').className = 'hf-btn' + (f === 'det'    ? ' active' : '');
  renderHist();
}

function deduplicateHistory(data, type) {
  const seen = new Set();
  return data.filter(item => {
    const key = type === 'pesees'
      ? `${item.prod || ''}_${item.of || ''}_${item.op || ''}_${item.date || item.createdAt || ''}_${item.moy || ''}`
      : `${item.eq || ''}_${item.type || ''}_${item.op || ''}_${item.date || item.now || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
  
function renderHist() {
  const list = document.getElementById('hist-list');
  if (!list) return;

  if (histFilter === 'pesees') {
    const uniqueSessions = deduplicateHistory(sessions, 'pesees');

    if (!uniqueSessions.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">⚖</div>Aucun relevé de pesée enregistré</div>';
      return;
    }

    list.innerHTML = uniqueSessions.map(s => `
      <div class="hist-item">
        <div>
          <div class="hi-title">${s.prod}${(s.ligne_prod || s.ligne) ? '  ·  ' + (s.ligne_prod || s.ligne) : ''}  ·  ${s.of}</div>
          <div class="hi-meta">${s.op}  ·  ${s.date}  ·  moy. ${s.moy} g</div>
        </div>
        <span class="badge ${s.vF}">${s.vF === 'ok' ? 'Conforme' : s.vF === 'warn' ? 'À vérifier' : 'Non conforme'}</span>
      </div>`).join('');
  } else {
    const uniqueDets = deduplicateHistory(dets, 'det');

    if (!uniqueDets.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div>Aucun test détecteur enregistré</div>';
      return;
    }

    list.innerHTML = uniqueDets.map(d => `
      <div class="hist-item">
        <div>
          <div class="hi-title">${d.eq}${(d.ligne_prod || d.ligne) ? '  ·  ' + (d.ligne_prod || d.ligne) : ''}  ·  ${d.type}</div>
          <div class="hi-meta">${d.op}  ·  ${d.date || d.now || '—'}</div>
        </div>
        <span class="badge ${d.vF}">${d.vF === 'ok' ? 'Conforme' : 'Non conforme'}</span>
      </div>`).join('');
  }
}

/* ================================================================
   EXPORT EXCEL — PESÉES
   ================================================================ */
function genExcelPesee() {
  const XLSXLib = window.XLSX || (typeof XLSX !== 'undefined' ? XLSX : null);
  if (!window._lastPesee || !XLSXLib) {
    toast('Librairie Excel indisponible', 'err');
    return;
  }

  const d = window._lastPesee;
  const r = d.r;
  const wb = XLSXLib.utils.book_new();

  const controleData = [
    ['CONTROLE QUALITE PREEMBALLES'],
    [],
    ['Client', d.cli],
    ['Produit', d.prod.nom],
    ['N° OF', d.of],
    ['Opérateur', d.op],
    ['Date / Heure', d.now],
    ['Quantité prévue', d.qte ? d.qte + ' unités' : 'Non renseigné'],
    [],
    ['Qn', d.prod.qn],
    ['TNE', d.prod.tne],
    ['TU1', d.prod.tu1],
    ['TU2', d.prod.tu2],
    [],
    ['N°', 'Poids (g)', 'Statut']
  ];

  r.v.forEach((val, i) => {
    let statut = 'OK';
    if (val < d.prod.tu2) statut = 'TU2';
    else if (val < d.prod.tu1) statut = 'TU1';
    controleData.push([i + 1, Number(val.toFixed(1)), statut]);
  });

  controleData.push([]);
  controleData.push(['Moyenne', Number(r.moy.toFixed(2))]);
  controleData.push(['Écart-type', Number(r.et.toFixed(2))]);
  controleData.push(['Défauts TU1', r.tu1]);
  controleData.push(['Défauts TU2', r.tu2]);
  controleData.push(['Verdict moyenne', r.vMoy]);
  controleData.push(['Verdict défectueux', r.vDef]);
  controleData.push(['Verdict final', r.vF === 'ok' ? 'CONFORME' : r.vF === 'warn' ? 'A VERIFIER' : 'NON CONFORME']);

  const wsControle = XLSXLib.utils.aoa_to_sheet(controleData);
  wsControle['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 14 }];
  XLSXLib.utils.book_append_sheet(wb, wsControle, 'Controle_Pesee');

  const syntheseData = [[
  'OF', 'Client', 'Produit', 'Opérateur', 'Date', 'Quantité prévue', 'Moyenne', 'Écart-type', 'TU1', 'TU2', 'Verdict'
]];
syntheseData.push([
  d.of, d.cli, d.prod.nom, d.op, d.now,
  d.qte ? d.qte + ' unités' : 'Non renseigné',
  Number(r.moy.toFixed(2)), Number(r.et.toFixed(2)), r.tu1, r.tu2,
  r.vF === 'ok' ? 'CONFORME' : r.vF === 'warn' ? 'A VERIFIER' : 'NON CONFORME'
]);
  const wsSynthese = XLSXLib.utils.aoa_to_sheet(syntheseData);
 wsSynthese['!cols'] = [
  { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 20 },
  { wch: 18 },
  { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 16 }
];
  XLSXLib.utils.book_append_sheet(wb, wsSynthese, 'Synthese');

  const wsDetecteur = XLSXLib.utils.aoa_to_sheet([
    ['TEST DETECTEUR'],
    [],
    ['Ce fichier provient d\'un contrôle de pesée.'],
    ['Aucun test détecteur lié à cet export.']
  ]);
  wsDetecteur['!cols'] = [{ wch: 42 }];
  XLSXLib.utils.book_append_sheet(wb, wsDetecteur, 'Detecteur');

  const safeOF = (d.of || 'controle').replace(/[^\w\-]+/g, '_');
  XLSXLib.writeFile(wb, `qualpack_controle_${safeOF}.xlsx`);
}

/* ================================================================
   EXPORT EXCEL — DÉTECTEUR
   ================================================================ */
function genExcelDet() {
  const XLSXLib = window.XLSX || (typeof XLSX !== 'undefined' ? XLSX : null);
  if (!window._lastDet || !XLSXLib) {
    toast('Librairie Excel indisponible', 'err');
    return;
  }

  const d = window._lastDet;
  const wb = XLSXLib.utils.book_new();
  const verdict = d.fer && d.nfer && d.inox ? 'CONFORME' : 'NON CONFORME';

  const detecteurData = [
    ['TEST DETECTEUR DE METAUX'],
    [],
    ['Équipement', d.eq],
    ['Opérateur', d.op],
    ['N° OF', d.of],
    ['Type de test', d.type],
    ['Date / Heure', d.now],
    [],
    ['Echantillon', 'Résultat'],
    ['Ferreux', d.fer ? 'REUSSI' : 'ECHEC'],
    ['Non ferreux', d.nfer ? 'REUSSI' : 'ECHEC'],
    ['Inox', d.inox ? 'REUSSI' : 'ECHEC'],
    [],
    ['Verdict final', verdict]
  ];
  const wsDetecteur = XLSXLib.utils.aoa_to_sheet(detecteurData);
  wsDetecteur['!cols'] = [{ wch: 20 }, { wch: 18 }];
  XLSXLib.utils.book_append_sheet(wb, wsDetecteur, 'Detecteur');

  const syntheseData = [[
    'Équipement', 'Opérateur', 'OF', 'Type', 'Date', 'Ferreux', 'Non ferreux', 'Inox', 'Verdict'
  ]];
  syntheseData.push([
    d.eq, d.op, d.of, d.type, d.now,
    d.fer ? 'OK' : 'ECHEC', d.nfer ? 'OK' : 'ECHEC', d.inox ? 'OK' : 'ECHEC', verdict
  ]);
  const wsSynthese = XLSXLib.utils.aoa_to_sheet(syntheseData);
  wsSynthese['!cols'] = [
    { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 20 },
    { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 16 }
  ];
  XLSXLib.utils.book_append_sheet(wb, wsSynthese, 'Synthese');

  const safeEq = (d.eq || 'detecteur').replace(/[^\w\-]+/g, '_');
  XLSXLib.writeFile(wb, `qualpack_detecteur_${safeEq}.xlsx`);
}

/* ================================================================
   EXPORT PDF — PESÉES
   ================================================================ */
async function genPDF() {
  await window._libsReady;
  const JsPDFCtor = getJsPDFCtor();
  if (!window._lastPesee || !JsPDFCtor) {
    toast('Librairie PDF indisponible (mode hors-ligne ?)', 'err'); return;
  }
  const doc = new JsPDFCtor({ unit:'mm', format:'a4' });
  const { r, cli, op, of, now, prod, qte } = window._lastPesee;
  const M = 18; let y = 0;

  /* En-tête */
  doc.setFillColor(13, 27, 42);
  doc.rect(0, 0, 210, 22, 'F');
  doc.setFillColor(46, 125, 209);
  doc.rect(0, 22, 210, 2, 'F');
  doc.setTextColor(232, 237, 243);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text('QUALPACK', M, 11);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text('RAPPORT DE CONTRÔLE PRÉEMBALLÉS', M, 17);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.setTextColor(122, 143, 166);
  doc.text('Généré le ' + now, 210 - M, 17, { align:'right' });

  y = 32;
  doc.setTextColor(30, 30, 40);

 /* Bloc identification */
const qteText = qte ? qte + ' unités' : 'Non renseigné';
const balanceRef = (getBalanceRef() || '').trim() || 'Non renseigné';

doc.setFillColor(245, 247, 250);
doc.roundedRect(M, y, 174, 66, 3, 3, 'F');
doc.setDrawColor(200, 210, 225);
doc.roundedRect(M, y, 174, 66, 3, 3, 'S');

/* Titre */
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(74, 98, 120);
doc.text('IDENTIFICATION', M + 6, y + 7);

/* Colonne gauche */
const idLeft = [
  ['CLIENT', cli],
  ['N° OF', of],
  ['BALANCE', balanceRef]
];

/* Colonne droite */
const idRight = [
  ['PRODUIT', prod.nom],
  ['OPÉRATEUR', op],
  ['QUANTITÉ PRÉVUE', qteText]
];

let yLeft = y + 18;
let yRight = y + 18;

idLeft.forEach(([label, value]) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(122, 143, 166);
  doc.text(label, M + 6, yLeft);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 40);
  doc.text(String(value || 'Non renseigné'), M + 6, yLeft + 5);

  yLeft += 14;
});

idRight.forEach(([label, value]) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(122, 143, 166);
  doc.text(label, M + 92, yRight);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 40);
  doc.text(String(value || 'Non renseigné'), M + 92, yRight + 5);

  yRight += 14;
});

/* Mode de calcul */
doc.setFont('helvetica', 'italic');
doc.setTextColor(122, 143, 166);
doc.setFontSize(8.2);
doc.text(
  'Mode de calcul : poids brut saisi par l’opérateur, puis déduction automatique de la tare fixe pour calculer le poids net réglementaire.',
  M + 6,
  y + 59,
  { maxWidth: 160 }
);

y += 74;

  /* Seuils produit */
const seuils = [
  ['Qn (nominal)', prod.qn + ' g'],
  ['TU1 (T1)', prod.tu1 + ' g'],
  ['TU2 (T2)', prod.tu2 + ' g'],
  ['TNE', prod.tne + ' g'],
  ['Tare fixe', (prod.tare_fixe_g != null && prod.tare_fixe_g !== '') ? String(prod.tare_fixe_g).replace('.', ',') + ' g' : '—']
];

doc.setFillColor(14, 45, 74);
doc.roundedRect(M, y, 174, 28, 3, 3, 'F');

seuils.forEach(([k, v], i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = M + 6 + col * 56;
  const yy = y + 6 + row * 11;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(122, 143, 166);
  doc.text(k, x, yy);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(74, 154, 232);
  doc.text(v, x, yy + 6);
});

y += 36;

  /* Statistiques */
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(74, 98, 120);
doc.text('RÉSULTATS STATISTIQUES', M, y);
y += 5;

doc.setDrawColor(200, 210, 225);
doc.line(M, y, 210 - M, y);
y += 6;

const valsGross = Array.isArray(r.vGross) ? r.vGross : (Array.isArray(r.v) ? r.v : []);
const valsNet   = Array.isArray(r.vNet) ? r.vNet : [];
const nbPes = valsGross.length;

const tareFixePdf = (prod.tare_fixe_g != null && prod.tare_fixe_g !== '')
  ? Number(prod.tare_fixe_g)
  : 0;

const moyGrossPdf = valsGross.length
  ? valsGross.reduce((a, b) => a + b, 0) / valsGross.length
  : 0;

const maxTU1Pdf = Number.isFinite(r.maxTU1) ? r.maxTU1 : getMaxTU1Allowed(nbPes);
const tauxTU1Pdf = Number.isFinite(r.tauxTU1) ? r.tauxTU1 : getTauxTU1(r.tu1, nbPes);

const stats = [
  ['Moyenne brute', moyGrossPdf.toFixed(2) + ' g', 'neutral'],
  ['Tare fixe', tareFixePdf.toFixed(2) + ' g', 'neutral'],
  ['Moyenne nette calculée', r.moy.toFixed(2) + ' g', r.moy >= prod.qn ? 'ok' : 'err'],
  ['Écart-type net', r.et.toFixed(2) + ' g', 'neutral'],
  [`Défauts TU1 (${maxTU1Pdf} autorisé)`, r.tu1 + ' / ' + nbPes, r.tu1 <= maxTU1Pdf ? 'ok' : 'err'],
  ['Taux TU1', tauxTU1Pdf.toFixed(2).replace('.', ',') + ' % (max autorisé : 2 %)', tauxTU1Pdf <= 2 && r.tu1 <= maxTU1Pdf ? 'ok' : 'err'],
  ['Défauts TU2 (max 0)', r.tu2 + ' / ' + nbPes, r.tu2 === 0 ? 'ok' : 'err'],
  ['Verdict moyenne', r.vMoy, r.vMoy === 'CONFORME' ? 'ok' : 'err'],
  ['Verdict défectueux', r.vDef, r.vDef === 'CONFORME' ? 'ok' : 'err'],
];

stats.forEach(([k, v, status]) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 70);
  doc.text(k, M + 2, y);

  doc.setFont('helvetica', 'bold');

  if (status === 'ok') {
    doc.setTextColor(15, 110, 86);
  } else if (status === 'warn') {
    doc.setTextColor(186, 117, 23);
  } else if (status === 'err') {
    doc.setTextColor(163, 45, 45);
  } else {
    doc.setTextColor(50, 60, 70);
  }

  doc.text(v, 210 - M, y, { align: 'right' });
  y += 7;
});

y += 4;

/* Pesées brutes — pagination robuste */
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(74, 98, 120);
doc.text('DÉTAIL DES ' + nbPes + ' PESÉES BRUTES SAISIES', M, y);
y += 5;

doc.setDrawColor(200, 210, 225);
doc.line(M, y, 210 - M, y);
y += 5;

const rowHeight = 8;
const colWidth  = 34;
const COLS      = 5;

// Page 1 : espace réduit à cause de l'identification + statistiques.
// Pages suivantes : plus de place disponible.
const LIMIT_P1 = 25;   // 25 pesées max sur la page 1
const LIMIT_PN = 125;  // 125 pesées max sur les pages suivantes

let detailBaseY = y;
let indexOnPage = 0;
let pageLimit   = LIMIT_P1;
let detailPage  = 1;

function addPeseesDetailPage() {
  doc.addPage();
  detailPage++;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 98, 120);
  doc.text('DÉTAIL DES PESÉES BRUTES SAISIES — SUITE', M, 20);

  doc.setDrawColor(200, 210, 225);
  doc.line(M, 25, 210 - M, 25);

  detailBaseY = 32;
  indexOnPage = 0;
  pageLimit   = LIMIT_PN;
}

valsGross.forEach((val, i) => {
  if (indexOnPage >= pageLimit) {
    addPeseesDetailPage();
  }

  const col = indexOnPage % COLS;
  const row = Math.floor(indexOnPage / COLS);
  const x   = M + col * colWidth;
  const py  = detailBaseY + row * rowHeight;

  const netVal = valsNet[i];
  const isOk   = netVal >= prod.tu1;
  const isWarn = netVal >= prod.tu2 && netVal < prod.tu1;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 115, 130);
  doc.text('#' + String(i + 1).padStart(2, '0'), x, py);

  if (isOk)        doc.setTextColor(15, 110, 86);
  else if (isWarn) doc.setTextColor(186, 117, 23);
  else             doc.setTextColor(163, 45, 45);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(val.toFixed(1) + ' g', x + 10, py);

  indexOnPage++;
});

const rowsUsed = Math.ceil(indexOnPage / COLS);
y = detailBaseY + rowsUsed * rowHeight + 10;

// Sécurité avant le verdict final : si la fin tombe trop bas, nouvelle page.
if (y > 255) {
  doc.addPage();
  y = 30;
}
  /* Verdict final */
  const vc = r.vF === 'ok' ? [8,42,28,26,201,109,13,110,86] : r.vF === 'warn' ? [45,30,8,232,137,26,186,117,23] : [45,14,14,214,59,59,163,45,45];
  doc.setFillColor(vc[0], vc[1], vc[2]);
  doc.roundedRect(M, y, 174, 18, 4, 4, 'F');
  doc.setFillColor(vc[3], vc[4], vc[5]);
  doc.roundedRect(M, y, 5, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
  doc.setTextColor(vc[6], vc[7], vc[8]);
  const vt = r.vF === 'ok'
  ? 'ÉCHANTILLON CONFORME'
  : r.vF === 'warn'
    ? 'ÉCHANTILLON À SURVEILLER'
    : 'ÉCHANTILLON NON CONFORME';
  doc.text(vt, M + 12, y + 11);

  y += 28;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(150, 150, 150);
  doc.text('QualPack V1.0  ·  Document généré automatiquement  ·  ' + now, M, y);

  doc.save('qualpack_pesees_' + of.replace(/\s/g,'_') + '_' + Date.now() + '.pdf');
}

/* ================================================================
   EXPORT PDF — DÉTECTEUR
   ================================================================ */
async function genPDFdet() {
  await window._libsReady;
  const JsPDFCtor = getJsPDFCtor();
  if (!window._lastDet || !JsPDFCtor) {
    toast('Librairie PDF indisponible (mode hors-ligne ?)', 'err'); return;
  }
  const doc = new JsPDFCtor({ unit:'mm', format:'a4' });
  const D = window._lastDet;
  const M = 18; let y = 0;

  doc.setFillColor(13, 27, 42); doc.rect(0, 0, 210, 22, 'F');
  doc.setFillColor(46, 125, 209); doc.rect(0, 22, 210, 2, 'F');
  doc.setTextColor(232, 237, 243);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text('QUALPACK', M, 11);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text('RAPPORT TEST DÉTECTEUR DE MÉTAUX', M, 17);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.setTextColor(122, 143, 166);
  doc.text('Généré le ' + D.now, 210 - M, 17, { align:'right' });

  y = 32;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(M, y, 174, 44, 3, 3, 'F');
  doc.setDrawColor(200, 210, 225);
  doc.roundedRect(M, y, 174, 44, 3, 3, 'S');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  doc.setTextColor(74, 98, 120);
  doc.text('IDENTIFICATION', M + 6, y + 7);
  const fields = [['Équipement',D.eq],['Opérateur',D.op],['N° OF',D.of],['Type de test',D.type],['Date',D.now]];
  fields.forEach(([k, v], i) => {
    const col = i % 2; const row = Math.floor(i / 2);
    const x = M + 6 + col * 87; const ly = y + 16 + row * 12;
    doc.setFont('helvetica', 'bold'); doc.setTextColor(122, 143, 166); doc.setFontSize(7);
    doc.text(k.toUpperCase(), x, ly);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 40); doc.setFontSize(10);
    doc.text(String(v), x, ly + 5);
  });

  y += 54;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(74, 98, 120);
  doc.text('RÉSULTATS DES TESTS', M, y); y += 5;
  doc.setDrawColor(200, 210, 225); doc.line(M, y, 210 - M, y); y += 8;

  [['Étalon ferreux', D.fer], ['Étalon non ferreux', D.nfer], ['Étalon inox', D.inox]].forEach(([k, v]) => {
    doc.setFillColor(v ? 8 : 45, v ? 42 : 14, v ? 28 : 14);
    doc.roundedRect(M, y - 5, 174, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.setTextColor(v ? 93 : 240, v ? 219 : 112, v ? 168 : 112);
    doc.text(k, M + 6, y + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(v ? '✓  RÉUSSI' : '✗  ÉCHOUÉ', 210 - M, y + 3, { align:'right' });
    y += 16;
  });

  y += 6;
  const allOk = D.fer && D.nfer && D.inox;
  const vc = allOk ? [8,42,28,26,201,109,13,110,86] : [45,14,14,214,59,59,163,45,45];
  doc.setFillColor(vc[0], vc[1], vc[2]);
  doc.roundedRect(M, y, 174, 18, 4, 4, 'F');
  doc.setFillColor(vc[3], vc[4], vc[5]);
  doc.roundedRect(M, y, 5, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
  doc.setTextColor(vc[6], vc[7], vc[8]);
  doc.text(allOk ? 'DÉTECTEUR CONFORME' : 'DÉTECTEUR NON CONFORME — ARRÊT DE LIGNE REQUIS', M + 12, y + 11);

  y += 28;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(150, 150, 150);
  doc.text('QualPack V1.0  ·  Document généré automatiquement  ·  ' + D.now, M, y);

  doc.save('qualpack_detecteur_' + D.eq + '_' + Date.now() + '.pdf');
}

/* ================================================================
   EXPORT EXCEL
   ================================================================ */
async function genExcel() {
  await window._libsReady;

  const XLSXLib = window.XLSX || (typeof XLSX !== 'undefined' ? XLSX : null);
  if (!XLSXLib) {
    toast('Librairie Excel indisponible', 'err');
    return;
  }

  try {
    const pesees = await getAllPesees();
    const detsAll = await getAllDetecteurs();

    const wb = XLSXLib.utils.book_new();

    const safeNumber = (v) => {
      if (v === '' || v === null || v === undefined) return '';
      const n = Number(v);
      return Number.isFinite(n) ? n : '';
    };

    const safeArrayToText = (v) => {
      if (Array.isArray(v)) return v.join(' | ');
      if (typeof v === 'string') return v;
      if (v === null || v === undefined) return '';
      return String(v);
    };

    const peseesRows = (Array.isArray(pesees) ? pesees : []).map((s) => ({
      'Date':           s?.date || '',
      'N° OF':          s?.of || '',
      'Client':         s?.cli || '',
      'Produit':        s?.prod || '',
      'Ligne':          s?.ligne_prod || s?.ligne || '',
      'Opérateur':      s?.op || '',
      'Quantité prévue':  safeNumber(s?.qte),
      'Moyenne (g)':    safeNumber(s?.moy),
      'Écart-type (g)': safeNumber(s?.et),
      'Défauts TU1':    safeNumber(s?.tu1),
      'Défauts TU2':    safeNumber(s?.tu2),
      'Verdict':        s?.vF === 'ok'
                          ? 'Conforme'
                          : s?.vF === 'warn'
                            ? 'À surveiller'
                            : 'Non conforme',
      'Pesées détail':  safeArrayToText(s?.pesees)
    }));

    const wsPesees = XLSXLib.utils.json_to_sheet(
      peseesRows.length ? peseesRows : [{ 'Info': 'Aucun relevé' }]
    );
    XLSXLib.utils.book_append_sheet(wb, wsPesees, 'Pesees');

    const detRows = (Array.isArray(detsAll) ? detsAll : []).map((d) => ({
      'Date':         d?.now || d?.date || '',
      'Équipement':   d?.eq || '',
      'Ligne':        d?.ligne_prod || d?.ligne || '',
      'Opérateur':    d?.op || '',
      'N° OF':        d?.of || '',
      'Type de test': d?.testType || d?.type || '',
      'Ferreux':      d?.fer  ? 'Réussi' : 'Échoué',
      'Non ferreux':  d?.nfer ? 'Réussi' : 'Échoué',
      'Inox':         d?.inox ? 'Réussi' : 'Échoué',
      'Verdict':      d?.vF === 'ok' ? 'Conforme' : 'Non conforme'
    }));

    const wsDet = XLSXLib.utils.json_to_sheet(
      detRows.length ? detRows : [{ 'Info': 'Aucun test' }]
    );
    XLSXLib.utils.book_append_sheet(wb, wsDet, 'Detecteur');

    const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    XLSXLib.writeFile(wb, `qualpack_export_${date}.xlsx`);
    toast('Export Excel téléchargé', 'ok');
  } catch (e) {
    console.error('genExcel error:', e);
    toast('Erreur export Excel', 'err');
  }
}

/* ================================================================
   TOAST
   ================================================================ */
let toastTimer;
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ================================================================
   DASHBOARD — RESPONSABLE QUALITÉ V8
   ================================================================ */
let dashPeriod = 7;
let dashFilters = { client:'', product:'', status:'all' };

function setDashPeriod(days, btn) {
  dashPeriod = days;

  document.querySelectorAll('.dp-btn, .side-dp-btn').forEach(b => {
    b.classList.remove('active');
  });

  const mainBtn = document.getElementById(`dp-${days}`);
  const sideBtn = document.getElementById(`side-dp-${days}`);

  if (mainBtn) mainBtn.classList.add('active');
  if (sideBtn) sideBtn.classList.add('active');

  renderDashboard();
}

function setDashFilter(key, value) {
  dashFilters[key] = value;

  if (key === 'client') {
    dashFilters.product = '';

    const productSel = document.getElementById('dash-filter-product');
    const sideProductSel = document.getElementById('side-dash-filter-product');

    if (productSel) productSel.value = '';
    if (sideProductSel) sideProductSel.value = '';

    populateDashFilters();
  }

  renderDashboard();
}

async function refreshDashboard() {
  try {
    toast('Actualisation du dashboard...', 'ok');

    if (navigator.onLine && typeof syncPending === 'function') {
      await syncPending(true);
    }

    if (typeof loadFromDB === 'function') {
      await loadFromDB();
    }

    populateDashFilters();
    renderDashboard();

    toast('Dashboard actualisé ✓', 'ok');
  } catch (e) {
    console.error('refreshDashboard error:', e);
    toast('Erreur actualisation dashboard', 'err');
  }
}

function filterByPeriod(items, days) {
  if (!days) return items;
  const cutoff = Date.now() - days * 86400000;
  return items.filter(s => {
    const ts = parseFRDate(s.date || s.now);
    return !isNaN(ts) ? ts >= cutoff : true;
  });
}

function pctColor(v) {
  return v === null ? '' : v >= 95 ? 'green' : v >= 80 ? 'orange' : 'red';
}

function parseFRDate(raw) {
  const parts = (raw || '').replace(',','').split(' ');
  if (parts.length < 2) return NaN;
  const [d, m, y] = parts[0].split('/');
  return new Date(`${y}-${m}-${d}T${parts[1]}`).getTime();
}

const ICONS = {
  scale:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L4 9v12h5v-6h6v6h5V9z"/></svg>`,
  detector:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
  calendar:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  clock:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  tu1:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  tu2:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  taux:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/></svg>`,
  conform:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2l8 4v6c0 5-3.5 9.74-8 11-4.5-1.26-8-6-8-11V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
  prio:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
  pilotage:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  pin:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  equip:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>`,
  check:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  cloud:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/><path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/></svg>`,
  arrowUp:   `<svg class="trend-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 13V3M3 8l5-5 5 5"/></svg>`,
  arrowDn:   `<svg class="trend-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 3v10M3 8l5 5 5-5"/></svg>`,
  arrowFlat: `<svg class="trend-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 8h12M10 4l4 4-4 4"/></svg>`,
};

function filterPrevPeriod(items, days) {
  if (!days) return [];
  const cutoff = Date.now() - days * 86400000;
  const prev   = cutoff - days * 86400000;
  return items.filter(s => {
    const ts = parseFRDate(s.date || s.now);
    return !isNaN(ts) && ts >= prev && ts < cutoff;
  });
}

function trendBadge(currVal, prevVal, isInverted, suffix) {
  if (prevVal === null || prevVal === undefined || currVal === null || currVal === undefined) return '';
  const delta = Math.round((currVal - prevVal) * 10) / 10;
  if (delta === 0) return `<span class="trend flat">${ICONS.arrowFlat} stable</span>`;
  const up = delta > 0;
  const good = up !== isInverted;
  const cls = good ? 'good' : 'bad';
  const arrow = up ? ICONS.arrowUp : ICONS.arrowDn;
  const sign = up ? '+' : '';
  return `<span class="trend ${cls}">${arrow}${sign}${delta}${suffix || ''}</span>`;
}

function kpiCard(colorClass, svgIcon, val, valClass, label, trend) {
  return `<div class="kpi-card ${colorClass}">
    <div class="kpi-svg-icon">${svgIcon}</div>
    <div class="kpi-val ${valClass || ''}">${val}</div>
    <div class="kpi-label">${label}</div>
    ${trend ? `<div class="kpi-trend">${trend}</div>` : ''}
  </div>`;
}

function blockHeader(svgIcon, label, subtitle) {
  return `<div class="dash-block-header">
    <div class="dbh-left">
      <span class="dbh-svg-icon">${svgIcon}</span>
      <span class="dbh-title">${label}</span>
    </div>
    ${subtitle ? `<span class="dbh-sub">${subtitle}</span>` : ''}
  </div>`;
}

function conformBar(label, pct, detail, colorCl, trend) {
  return `<div class="conform-bar-wrap">
    <div class="cb-top">
      <span class="cb-label">${label}</span>
      <div style="display:flex;align-items:center;gap:8px">${trend || ''}<span class="cb-pct ${colorCl}">${pct}%</span></div>
    </div>
    <div class="cb-track"><div class="cb-fill ${colorCl}" style="width:${pct}%"></div></div>
    <div class="cb-sub">${detail}</div>
  </div>`;
}

function relativeFromTs(ts) {
  if (!ts || isNaN(ts)) return '—';
  const diffMin = Math.round((Date.now() - ts) / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffMin < 1440) return `Il y a ${Math.round(diffMin/60)} h`;
  return new Date(ts).toLocaleDateString('fr-FR');
}

function populateDashFilters() {
  const clientSel = document.getElementById('dash-filter-client');
  const prodSel = document.getElementById('dash-filter-product');
  const statusSel = document.getElementById('dash-filter-status');

  const sideClientSel = document.getElementById('side-dash-filter-client');
  const sideProdSel = document.getElementById('side-dash-filter-product');
  const sideStatusSel = document.getElementById('side-dash-filter-status');

  const clients = [...new Set(sessions.map(s => s.cli).filter(Boolean))].sort();
  const clientOptions = '<option value="">Tous les clients</option>' + clients.map(c => `<option value="${c}">${c}</option>`).join('');

  if (clientSel) {
    clientSel.innerHTML = clientOptions;
    clientSel.value = dashFilters.client || '';
  }

  if (sideClientSel) {
    sideClientSel.innerHTML = clientOptions;
    sideClientSel.value = dashFilters.client || '';
  }

  let prods = sessions;
  if (dashFilters.client) prods = prods.filter(s => s.cli === dashFilters.client);

  const products = [...new Set(prods.map(s => s.prod).filter(Boolean))].sort();
  const productOptions = '<option value="">Tous les produits</option>' + products.map(p => `<option value="${p}">${p}</option>`).join('');

  if (prodSel) {
    prodSel.innerHTML = productOptions;
    prodSel.value = dashFilters.product || '';
  }

  if (sideProdSel) {
    sideProdSel.innerHTML = productOptions;
    sideProdSel.value = dashFilters.product || '';
  }

  if (statusSel) statusSel.value = dashFilters.status || 'all';
  if (sideStatusSel) sideStatusSel.value = dashFilters.status || 'all';
}

function applyDashFilters(pItems, dItems) {
  let p = [...pItems];
  let d = [...dItems];
  if (dashFilters.client) p = p.filter(s => s.cli === dashFilters.client);
  if (dashFilters.product) p = p.filter(s => s.prod === dashFilters.product);
  if (dashFilters.status !== 'all') {
    p = p.filter(s => s.vF === dashFilters.status);
    if (dashFilters.status === 'warn') d = [];
    else d = d.filter(s => (dashFilters.status === 'ok' ? s.vF === 'ok' : s.vF !== 'ok'));
  }
  return { p, d };
}

function buildStatusHero(pF, dF) {
  const tu2 = pF.reduce((acc, s) => acc + (parseInt(s.tu2) || 0), 0);
  const tu1 = pF.reduce((acc, s) => acc + (parseInt(s.tu1) || 0), 0);
  const detKo = dF.filter(d => d.vF !== 'ok').length;
  let cls = 'ok', chip = 'Conforme', main = 'Production maîtrisée', sub = 'Aucune alerte critique détectée sur la période sélectionnée.';
  if (tu2 > 0 || detKo > 0) {
    cls = 'err'; chip = 'Non conforme';
    main = 'Action prioritaire requise';
    sub = `${tu2} défaut${tu2>1?'s':''} TU2 et ${detKo} test${detKo>1?'s':''} détecteur NOK sur la période.`;
  } else if (tu1 > 0) {
    cls = 'warn'; chip = 'À surveiller';
    main = 'Dérives à analyser';
    sub = `${tu1} défaut${tu1>1?'s':''} TU1 détecté${tu1>1?'s':''}. Revue qualité conseillée.`;
  }
  const activeLots = pF.length;
  const activeDet = dF.length;
  const lastTs = Math.max(0, ...[...pF, ...dF].map(x => parseFRDate(x.date || x.now)).filter(x => !isNaN(x)));
  return `<div class="status-hero ${cls}">
    <div class="status-top">
      <div>
        <div class="status-title">Statut global</div>
        <div class="status-main">${main}</div>
        <div class="status-sub">${sub}</div>
      </div>
      <span class="status-chip ${cls}">${chip}</span>
    </div>
    <div class="status-meta-grid">
      <div class="status-meta-card"><div class="status-meta-label">Echantillons</div><div class="status-meta-val">${activeLots}</div></div>
      <div class="status-meta-card"><div class="status-meta-label">Tests détecteur</div><div class="status-meta-val">${activeDet}</div></div>
      <div class="status-meta-card"><div class="status-meta-label">Dernière activité</div><div class="status-meta-val">${relativeFromTs(lastTs)}</div></div>
    </div>
  </div>`;
}

function buildBlocSynthese(pF, dF, pPrev, dPrev) {
  const pOk = pF.filter(s => s.vF === 'ok').length;
  const pErr = pF.filter(s => s.vF === 'err').length;
  const detKo = dF.filter(d => d.vF !== 'ok').length;
  const conform = pF.length ? Math.round((pOk / pF.length) * 100) : null;
  const conformPrev = pPrev.length ? Math.round((pPrev.filter(s => s.vF === 'ok').length / pPrev.length) * 100) : null;
  const lotsTrend = dashPeriod ? trendBadge(pF.length, pPrev.length, false, '') : '';
  const confTrend = dashPeriod ? trendBadge(conform, conformPrev, false, ' pt') : '';
  const tu2 = pF.reduce((acc, s) => acc + (parseInt(s.tu2) || 0), 0);
  const tu2Prev = pPrev.reduce((acc, s) => acc + (parseInt(s.tu2) || 0), 0);
  const detKoPrev = dPrev.filter(d => d.vF !== 'ok').length;
  const qualityColor = pctColor(conform);

  return `<div class="dash-block">
    ${blockHeader(ICONS.pilotage, 'Synthèse de pilotage', dashPeriod ? `${dashPeriod} jours` : 'toute la période')}
    <div class="kpi-grid kpi-grid-4">
      ${kpiCard(qualityColor || 'blue', ICONS.taux, conform !== null ? conform + '%' : '—', qualityColor || '', 'Conformité pesées', confTrend)}
      ${kpiCard(tu2 > 0 ? 'red' : 'green', ICONS.tu2, tu2, tu2 > 0 ? 'red' : 'green', 'Défauts TU2', dashPeriod ? trendBadge(tu2, tu2Prev, true, '') : '')}
      ${kpiCard(detKo > 0 ? 'red' : 'green', ICONS.detector, detKo, detKo > 0 ? 'red' : 'green', 'Détecteur NOK', dashPeriod ? trendBadge(detKo, detKoPrev, true, '') : '')}
      ${kpiCard('blue', ICONS.scale, pF.length, '', 'Echantillons', lotsTrend)}
    </div>
    <div class="dash-two-col">
      ${buildBlocActiviteMini(pF, dF, pPrev, dPrev)}
      ${buildBlocConformiteMini(pF, dF, pPrev, dPrev, pErr)}
    </div>
  </div>`;
}

function buildBlocActiviteMini(pF, dF, pPrev, dPrev) {
  const all = [...pF, ...dF];
  const timestamps = all.map(s => parseFRDate(s.date || s.now)).filter(t => !isNaN(t));
  const lastTs = timestamps.length ? Math.max(...timestamps) : NaN;
  const sparkDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    sparkDays.push({ key:d.toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit'}), label:d.toLocaleDateString('fr-FR', {weekday:'short'}).slice(0,2), p:[], d:[] });
  }
  pF.forEach(s => {
    const raw = (s.date || '').replace(',','').split(' ')[0];
    const idx = sparkDays.findIndex(d => d.key === raw);
    if (idx >= 0) sparkDays[idx].p.push(s);
  });
  dF.forEach(s => {
    const raw = (s.date || s.now || '').replace(',','').split(' ')[0];
    const idx = sparkDays.findIndex(d => d.key === raw);
    if (idx >= 0) sparkDays[idx].d.push(s);
  });
  const maxCount = Math.max(...sparkDays.map(d => d.p.length + d.d.length), 1);
  const sparkBars = sparkDays.map(d => {
    const n = d.p.length + d.d.length;
    const hasErr = d.p.some(s => s.vF === 'err') || d.d.some(s => s.vF !== 'ok');
    const hasWarn = d.p.some(s => s.vF === 'warn');
    const cl = n === 0 ? 'empty' : hasErr ? 'err' : hasWarn ? 'warn' : 'ok';
    const h = n === 0 ? 6 : Math.max(8, Math.round(n / maxCount * 48));
    return `<div class="sl-bar-wrap"><div class="sl-bar ${cl}" style="height:${h}px"></div><div class="sl-lbl">${d.label}</div></div>`;
  }).join('');
  const comp = Math.round((sparkDays.filter(d => d.p.length + d.d.length > 0).length / 7) * 100);

  return `<div class="dash-list-card">
    <div class="dash-list-title">Activité</div>
    <div class="kpi-label">Dernière activité : <strong style="color:var(--text-primary)">${relativeFromTs(lastTs)}</strong></div>
    <div class="kpi-label" style="margin-top:6px">Tests détecteur : <strong style="color:var(--text-primary)">${dF.length}</strong> ${dashPeriod ? `${trendBadge(dF.length, dPrev.length, false, '')}` : ''}</div>
    <div class="kpi-label" style="margin-top:6px">Complétion 7 jours : <strong style="color:var(--text-primary)">${comp}%</strong></div>
    <div class="sparkline-wrap" style="margin-top:10px; margin-bottom:0"><div class="sl-title">Activité journalière</div><div class="sl-bars">${sparkBars}</div></div>
  </div>`;
}

function buildBlocConformiteMini(pF, dF, pPrev, dPrev, pErr) {
  const pOk = pF.filter(s => s.vF === 'ok').length;
  const pWarn = pF.filter(s => s.vF === 'warn').length;
  const dOk = dF.filter(d => d.vF === 'ok').length;
  const dErr = dF.filter(d => d.vF !== 'ok').length;
  const tu1Total = pF.reduce((acc, s) => acc + (parseInt(s.tu1) || 0), 0);
  const tu2Total = pF.reduce((acc, s) => acc + (parseInt(s.tu2) || 0), 0);
  const pConform = pF.length ? Math.round((pOk / pF.length) * 100) : 0;
  const dConform = dF.length ? Math.round((dOk / dF.length) * 100) : 0;
  const pPrevConform = pPrev.length ? Math.round((pPrev.filter(s => s.vF === 'ok').length / pPrev.length) * 100) : 0;
  const dPrevConform = dPrev.length ? Math.round((dPrev.filter(s => s.vF === 'ok').length / dPrev.length) * 100) : 0;
  return `<div class="dash-list-card">
    <div class="dash-list-title">Conformité</div>
    ${pF.length ? conformBar('Pesées', pConform, `${pOk} conformes · ${pWarn} à vérifier · ${pErr} non conformes`, pctColor(pConform), dashPeriod ? trendBadge(pConform, pPrevConform, false, ' pt') : '') : '<div class="dash-empty-mini">Aucune pesée sur la période.</div>'}
    ${dF.length ? `<div style="height:8px"></div>${conformBar('Détecteur', dConform, `${dOk} réussis · ${dErr} échoués`, pctColor(dConform), dashPeriod ? trendBadge(dConform, dPrevConform, false, ' pt') : '')}` : ''}
    <div class="kpi-label" style="margin-top:10px">TU1 : <strong style="color:var(--orange-text)">${tu1Total}</strong> · TU2 : <strong style="color:var(--red-text)">${tu2Total}</strong></div>
  </div>`;
}

function buildBlocActions(pF, dF) {
  const actions = [];
  const lotsWarn = pF.filter(s => s.vF === 'warn');
  const lotsErr = pF.filter(s => s.vF === 'err');
  const detErr = dF.filter(d => d.vF !== 'ok');

  lotsErr.slice(0, 3).forEach(s => actions.push({ type:'err', title:`TU2 – ${s.prod}`, meta:`Lot ${s.of} · ${s.cli} · ${s.date}`, action:'Voir pesées', go:'pesees' }));
  lotsWarn.slice(0, 2).forEach(s => actions.push({ type:'warn', title:`À analyser – ${s.prod}`, meta:`Lot ${s.of} · ${s.op} · ${s.date}`, action:'Voir pesées', go:'pesees' }));
  detErr.slice(0, 3).forEach(d => actions.push({ type:'err', title:`Détecteur NOK – ${d.eq}`, meta:`${d.type} · ${d.op} · ${d.date || d.now}`, action:'Voir détecteur', go:'det' }));

  const prodRisk = {};
  pF.forEach(s => {
    if (!prodRisk[s.prod]) prodRisk[s.prod] = { nc:0, total:0 };
    prodRisk[s.prod].total++; if (s.vF !== 'ok') prodRisk[s.prod].nc++;
  });
  const prodRows = Object.entries(prodRisk)
    .filter(([,v]) => v.nc > 0)
    .sort((a,b) => b[1].nc - a[1].nc)
    .slice(0,3)
    .map(([prod,v], i) => `<div class="prod-row"><div class="pr-rank">#${i+1}</div><div class="pr-info"><div class="pr-name">${prod}</div><div class="pr-meta">${v.nc} NC sur ${v.total} lot${v.total>1?'s':''}</div></div><span class="pr-badge ${Math.round(v.nc/v.total*100) >= 50 ? 'err':'warn'}">${Math.round(v.nc/v.total*100)}% NC</span></div>`).join('');

  const alertHTML = actions.length ? actions.map(a => `
    <div class="alert-item ${a.type}">
      <div class="alert-svg-icon">${a.type === 'warn' ? ICONS.tu1 : ICONS.tu2}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-meta">${a.meta}</div>
        <div class="alert-actions">
          <button class="alert-btn" onclick="dashGoHistory('${a.go}')">${a.action}</button>
          <button class="alert-btn secondary" onclick="genDashboardPDF()">Générer Rapport PDF</button>
        </div>
      </div>
    </div>`).join('') : `<div class="alert-item info"><div class="alert-svg-icon">${ICONS.check}</div><div class="alert-body"><div class="alert-title">Aucune action requise</div><div class="alert-meta">Tous les indicateurs sont sous contrôle sur la période filtrée.</div></div></div>`;

  return `<div class="dash-block">
    ${blockHeader(ICONS.prio, 'Alertes et actions', actions.length ? `${actions.length} action${actions.length>1?'s':''}` : 'RAS')}
    ${alertHTML}
    <div class="dash-section-title" style="margin-top:12px">Top produits à risque</div>
    ${prodRows || '<div class="dash-empty-mini">Aucun produit en dérive sur la période sélectionnée.</div>'}
  </div>`;
}

function buildBlocSync(pF, dF) {
  const items = [...pF, ...dF];
  const pending = items.filter(i => i.synced === false).length;
  const syncedItems = items.filter(i => i.synced !== false);
  const lastSyncedTs = Math.max(0, ...syncedItems.map(i => parseFRDate(i.date || i.now)).filter(t => !isNaN(t)));
  const sourceTs = Math.max(0, ...items.map(i => parseFRDate(i.date || i.now)).filter(t => !isNaN(t)));
  return `<div class="dash-block">
    ${blockHeader(ICONS.cloud, 'Synchronisation', pending > 0 ? 'à surveiller' : 'à jour')}
    <div class="sync-grid">
      <div class="sync-card"><div class="sync-label">Dernière remontée</div><div class="sync-value">${lastSyncedTs ? relativeFromTs(lastSyncedTs) : 'Aucune'}</div></div>
      <div class="sync-card"><div class="sync-label">En attente</div><div class="sync-value">${pending}</div></div>
      <div class="sync-card full"><div class="sync-label">Dernière activité locale</div><div class="sync-value">${sourceTs ? relativeFromTs(sourceTs) : '—'}</div></div>
    </div>
  </div>`;
}

function dashGoHistory(type) {
  const btn = document.getElementById('nav-historique');
  showScreen('historique', btn);
  filterHist(type === 'det' ? 'det' : 'pesees');
}


function buildDashboardTrendSeries(pItems) {
  const spanDays = dashPeriod || 30;
  const totalDays = Math.max(7, Math.min(spanDays, 30));
  const today = new Date();
  today.setHours(0,0,0,0);
  const series = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('fr-CA');
    series.push({
      key,
      label: d.toLocaleDateString('fr-FR', totalDays <= 14 ? { day:'2-digit', month:'2-digit' } : { day:'2-digit', month:'2-digit' }),
      items: []
    });
  }
  pItems.forEach(item => {
    const ts = parseFRDate(item.date || item.now);
    if (isNaN(ts)) return;
    const key = new Date(ts).toLocaleDateString('fr-CA');
    const found = series.find(s => s.key === key);
    if (found) found.items.push(item);
  });
  return {
    conformity: series.map(s => {
      const ok = s.items.filter(i => i.vF === 'ok').length;
      return {
        label: s.label,
        value: s.items.length ? Math.round((ok / s.items.length) * 100) : null
      };
    }),
    tu2: series.map(s => ({
      label: s.label,
      value: s.items.reduce((acc, i) => acc + (parseInt(i.tu2) || 0), 0)
    }))
  };
}

function getDashboardExportData() {
  const pBase = filterByPeriod(sessions, dashPeriod);
  const dBase = filterByPeriod(dets, dashPeriod);
  const pPrevBase = filterPrevPeriod(sessions, dashPeriod);
  const dPrevBase = filterPrevPeriod(dets, dashPeriod);
  const { p, d } = applyDashFilters(pBase, dBase);
  const { p: pPrev, d: dPrev } = applyDashFilters(pPrevBase, dPrevBase);

  const tu1 = p.reduce((acc, s) => acc + (parseInt(s.tu1) || 0), 0);
  const tu2 = p.reduce((acc, s) => acc + (parseInt(s.tu2) || 0), 0);
  const pOk = p.filter(s => s.vF === 'ok').length;
  const pWarn = p.filter(s => s.vF === 'warn').length;
  const pErr = p.filter(s => s.vF === 'err').length;
  const dOk = d.filter(x => x.vF === 'ok').length;
  const dErr = d.filter(x => x.vF !== 'ok').length;
  const pConf = p.length ? Math.round((pOk / p.length) * 100) : 0;
  const dConf = d.length ? Math.round((dOk / d.length) * 100) : 0;
  const pPrevConf = pPrev.length ? Math.round((pPrev.filter(s => s.vF === 'ok').length / pPrev.length) * 100) : null;
  const dPrevConf = dPrev.length ? Math.round((dPrev.filter(x => x.vF === 'ok').length / dPrev.length) * 100) : null;
  const detKo = dErr;
  let status = { level:'ok', chip:'Conforme', title:'Production maîtrisée', subtitle:'Aucune alerte critique détectée sur la période sélectionnée.' };
  if (tu2 > 0 || detKo > 0) {
    status = { level:'err', chip:'Non conforme', title:'Action prioritaire requise', subtitle:`${tu2} défaut${tu2 > 1 ? 's' : ''} TU2 et ${detKo} test${detKo > 1 ? 's' : ''} détecteur NOK sur la période.` };
  } else if (tu1 > 0) {
    status = { level:'warn', chip:'À surveiller', title:'Dérives à analyser', subtitle:`${tu1} défaut${tu1 > 1 ? 's' : ''} TU1 détecté${tu1 > 1 ? 's' : ''}. Revue qualité conseillée.` };
  }

  const alerts = [];
  p.filter(s => s.vF === 'err').slice(0, 8).forEach(s => alerts.push({
    date: s.date || '—',
    produit: s.prod || '—',
    lot: s.of || '—',
    type: 'TU2',
    statut: 'À analyser',
    responsable: '—',
    action: `Contrôle pondéral non conforme (${parseInt(s.tu2) || 0} TU2).`
  }));
  p.filter(s => s.vF === 'warn').slice(0, 8 - alerts.length).forEach(s => alerts.push({
    date: s.date || '—',
    produit: s.prod || '—',
    lot: s.of || '—',
    type: 'TU1',
    statut: 'À surveiller',
    responsable: s.op || '—',
    action: `Dérive à confirmer (${parseInt(s.tu1) || 0} TU1).`
  }));
  d.filter(x => x.vF !== 'ok').slice(0, 8 - alerts.length).forEach(x => alerts.push({
    date: x.date || x.now || '—',
    produit: x.eq || 'Détecteur',
    lot: '—',
    type: 'Détecteur NOK',
    statut: 'À vérifier',
    responsable: x.op || '—',
    action: `${x.type || 'Test détecteur'} en échec.`
  }));
  if (!alerts.length) {
    alerts.push({ date:'—', produit:'Aucune alerte', lot:'—', type:'RAS', statut:'Traité', responsable:'—', action:'Aucune non-conformité détectée sur la période sélectionnée.' });
  }

  const topRisks = Object.entries(p.reduce((acc, s) => {
    const key = s.prod || 'Produit non renseigné';
    if (!acc[key]) acc[key] = { total:0, nc:0, tu2:0 };
    acc[key].total += 1;
    if (s.vF !== 'ok') acc[key].nc += 1;
    acc[key].tu2 += parseInt(s.tu2) || 0;
    return acc;
  }, {})).sort((a,b) => (b[1].tu2 + b[1].nc) - (a[1].tu2 + a[1].nc)).slice(0,5);

  return {
    p, d, pPrev, dPrev, status,
    stats: {
      tu1, tu2, pOk, pWarn, pErr, dOk, dErr, pConf, dConf, pPrevConf, dPrevConf,
      lots: p.length, tests: d.length,
      completion: Math.round((Math.min(7, [...new Set([...p, ...d].map(x => (x.date || x.now || '').split(' ')[0]).filter(Boolean))].length) / 7) * 100)
    },
    alerts,
    topRisks,
    trends: buildDashboardTrendSeries(p),
    filtersText: {
      periode: dashPeriod ? `${dashPeriod} jours` : 'Tout historique',
      client: dashFilters.client || 'Tous les clients',
      produit: dashFilters.product || 'Tous les produits',
      statut: dashFilters.status === 'all' ? 'Tous statuts' : dashFilters.status === 'ok' ? 'Conforme' : dashFilters.status === 'warn' ? 'À surveiller' : 'Non conforme'
    }
  };
}

function pdfV2Theme() {
  return {
    green: [34, 139, 90],
    orange: [245, 158, 11],
    red: [220, 38, 38],
    blue: [30, 64, 175],
    navy: [15, 23, 42],
    sky: [59, 130, 246],
    text: [31, 41, 55],
    muted: [107, 114, 128],
    border: [226, 232, 240],
    borderStrong: [203, 213, 225],
    bgSoft: [248, 250, 252],
    bgAlt: [241, 245, 249],
    white: [255, 255, 255]
  };
}

function pdfStatusColor(level, theme) {
  return level === 'err' ? theme.red : level === 'warn' ? theme.orange : theme.green;
}

function pdfSetFill(doc, arr) { doc.setFillColor(arr[0], arr[1], arr[2]); }
function pdfSetText(doc, arr) { doc.setTextColor(arr[0], arr[1], arr[2]); }
function pdfSetDraw(doc, arr) { doc.setDrawColor(arr[0], arr[1], arr[2]); }

function pdfCard(doc, x, y, w, h, fill, border, radius) {
  pdfSetFill(doc, fill);
  pdfSetDraw(doc, border);
  doc.roundedRect(x, y, w, h, radius || 3, radius || 3, 'FD');
}

function pdfSafeCircle(doc, x, y, r, style) {
  if (doc && typeof doc.circle === 'function') {
    doc.circle(x, y, r, style || 'S');
    return;
  }
  if (doc && typeof doc.ellipse === 'function') {
    doc.ellipse(x, y, r, r, style || 'S');
    return;
  }
  pdfSetDraw(doc, pdfV2Theme().text);
  if ((style || 'S') === 'F') pdfSetFill(doc, pdfV2Theme().text);
  doc.roundedRect(x - r, y - r, r * 2, r * 2, r, r, style || 'S');
}


const _pdfBrandAssets = { logo:null, picto:null, loaded:false };

async function loadImageAsDataURL(src) {
  const candidates = Array.isArray(src) ? src : [src];
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.92));
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = () => reject(new Error('Image introuvable: ' + candidate));
        img.src = candidate;
      });

      if (dataUrl) return dataUrl;
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error('Image introuvable');
}

async function ensurePdfBrandAssets() {
  if (_pdfBrandAssets.loaded) return _pdfBrandAssets;

  try {
    const [logo, picto, appIcon] = await Promise.all([
      loadImageAsDataURL(['./logo-codex.jpg']),
      loadImageAsDataURL(['./picto-codex.jpg']),
      loadImageAsDataURL(['./icon-192.png', './icon-512.png'])
    ]);

    _pdfBrandAssets.logo = logo || null;
    _pdfBrandAssets.picto = picto || null;
    _pdfBrandAssets.appIcon = appIcon || null;
  } catch (e) {
    console.warn('Assets PDF branding non chargés', e);
  }

  _pdfBrandAssets.loaded = true;
  return _pdfBrandAssets;
}

function pdfPageHeader(doc, pageTitle, subtitle, pageNo) {
  const theme = pdfV2Theme();
  const assets = _pdfBrandAssets;

  // Fond header
  pdfSetFill(doc, theme.white);
  doc.rect(0, 0, 210, 34, 'F');

  // Ligne fine CODEX
  pdfSetFill(doc, theme.blue);
  doc.rect(0, 32, 210, 1.2, 'F');

  // Branding gauche
  if (pageNo === 1) {
    if (assets.logo) {
      try {
        doc.addImage(assets.logo, 'JPEG', 14, 6, 48, 16);
      } catch (e) {
        console.warn('Logo CODEX non ajouté', e);
      }
    }
  } else {
    if (assets.picto) {
      try {
        doc.addImage(assets.picto, 'JPEG', 14, 6, 13, 13);
      } catch (e) {
        console.warn('Picto CODEX non ajouté', e);
      }
    }
  }

  // Titre principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  pdfSetText(doc, theme.navy);
  doc.text('Rapport qualité', 105, 14, { align: 'center' });

  // Sous-titre de page
  if (subtitle) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    pdfSetText(doc, theme.text);
    doc.text(subtitle, 105, 23, { align: 'center' });
  }

  // Date du rapport en haut à droite
  const now = new Date();
  const reportDate = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  pdfSetText(doc, theme.muted);
  doc.text(reportDate, 196, 10, { align: 'right' });

  // Icône app discrète sous la date (page 1 uniquement)
  if (pageNo === 1 && assets.appIcon) {
    try {
      doc.addImage(assets.appIcon, 'PNG', 182, 13, 10, 10);
    } catch (e) {
      console.warn('Icône app PDF non ajoutée', e);
    }
  }
}
   
function pdfSectionTitle(doc, y, title) {
  const theme = pdfV2Theme();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  pdfSetText(doc, theme.text);
  doc.text(title, 14, y);
}

function pdfMetricCard(doc, x, y, w, h, label, value, accent, subtext) {
  const theme = pdfV2Theme();
  pdfCard(doc, x, y, w, h, theme.white, theme.border, 3);
  pdfSetFill(doc, accent);
  doc.roundedRect(x, y, 2.8, h, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  pdfSetText(doc, theme.text);
  doc.text(String(value), x + 7, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  pdfSetText(doc, theme.muted);
  doc.text(label, x + 7, y + 21);
  if (subtext) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    pdfSetText(doc, theme.muted);
    const lines = doc.splitTextToSize(subtext, w - 12);
    doc.text(lines.slice(0,2), x + 7, y + 28);
  }
}

function pdfDrawLineChart(doc, x, y, w, h, title, series, color, options = {}) {
  const theme = pdfV2Theme();
  pdfCard(doc, x, y, w, h, theme.white, theme.border, 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  pdfSetText(doc, theme.text);
  doc.text(title, x + 6, y + 9);

  const chartX = x + 10, chartY = y + 18, chartW = w - 18, chartH = h - 32;
  pdfSetDraw(doc, theme.border);
  doc.line(chartX, chartY, chartX, chartY + chartH);
  doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);

  const vals = series.map(s => s.value).filter(v => v !== null && !isNaN(v));
  const maxVal = options.maxValue || Math.max(...vals, 1);
  const minVal = options.minValue != null ? options.minValue : 0;

  [0, 0.5, 1].forEach(step => {
    const py = chartY + chartH - (chartH * step);
    pdfSetDraw(doc, theme.border);
    doc.line(chartX, py, chartX + chartW, py);
  });

  const usable = series.length > 1 ? series.length - 1 : 1;
  let prev = null;
  series.forEach((pt, idx) => {
    if (pt.value === null || isNaN(pt.value)) return;
    const px = chartX + (idx / usable) * chartW;
    const ratio = maxVal === minVal ? 0 : (pt.value - minVal) / (maxVal - minVal);
    const py = chartY + chartH - (ratio * chartH);
    if (prev) {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.8);
      doc.line(prev.x, prev.y, px, py);
    }
    pdfSetFill(doc, color);
    pdfSafeCircle(doc, px, py, 1.2, 'F');
    prev = { x:px, y:py };
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  pdfSetText(doc, theme.muted);
  const labelStep = series.length > 12 ? 3 : series.length > 8 ? 2 : 1;
  series.forEach((pt, idx) => {
    if (idx % labelStep !== 0 && idx !== series.length - 1) return;
    const px = chartX + (idx / usable) * chartW;
    doc.text(pt.label, px, chartY + chartH + 5, { align:'center' });
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  pdfSetText(doc, theme.text);
  const lastVal = vals.length ? vals[vals.length - 1] : 0;
  const suffix = options.suffix || '';
  doc.text(`Dernière valeur : ${lastVal}${suffix}`, x + w - 6, y + 9, { align:'right' });
}

function pdfEnsureSpace(doc, y, needed) {
  if (y + needed <= 280) return y;
  doc.addPage();
  return 18;
}

function pdfDrawAlertTable(doc, y, alerts) {
  const theme = pdfV2Theme();
  const cols = [14, 34, 72, 108, 132, 156, 176];
  const headers = ['Date', 'Produit / équipement', 'Lot', 'Type', 'Statut', 'Resp.', 'Action'];
  pdfSectionTitle(doc, y, 'Alertes et non-conformités');
  y += 8;
  pdfCard(doc, 14, y, 182, 10, theme.bgSoft, theme.border, 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  pdfSetText(doc, theme.text);
  headers.forEach((h, i) => doc.text(h, cols[i] + 1, y + 6.4));
  y += 12;

  alerts.forEach(alert => {
    const lines = {
      date: doc.splitTextToSize(alert.date || '—', 18),
      produit: doc.splitTextToSize(alert.produit || '—', 36),
      lot: doc.splitTextToSize(alert.lot || '—', 22),
      type: doc.splitTextToSize(alert.type || '—', 22),
      statut: doc.splitTextToSize(alert.statut || '—', 22),
      resp: doc.splitTextToSize(alert.responsable || '—', 16),
      action: doc.splitTextToSize(alert.action || '—', 18)
    };
    const rowH = Math.max(10, Math.max(...Object.values(lines).map(arr => arr.length)) * 4.2 + 4);
    if (y + rowH > 280) {
      doc.addPage();
      pdfPageHeader(doc, 'Page 3/4', 'Alertes', 3);
      y = 34;
      pdfCard(doc, 14, y, 182, 10, theme.bgSoft, theme.border, 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      pdfSetText(doc, theme.text);
      headers.forEach((h, i) => doc.text(h, cols[i] + 1, y + 6.4));
      y += 12;
    }
    pdfCard(doc, 14, y, 182, rowH, theme.white, theme.border, 2);
    const statusColor = (alert.type === 'TU2' || /NOK/i.test(alert.type)) ? theme.red : (alert.type === 'TU1' ? theme.orange : theme.green);
    pdfSetFill(doc, statusColor);
    doc.roundedRect(14, y, 2.6, rowH, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    pdfSetText(doc, theme.text);
    doc.text(lines.date, cols[0] + 1, y + 5);
    doc.text(lines.produit, cols[1] + 1, y + 5);
    doc.text(lines.lot, cols[2] + 1, y + 5);
    doc.text(lines.type, cols[3] + 1, y + 5);
    doc.text(lines.statut, cols[4] + 1, y + 5);
    doc.text(lines.resp, cols[5] + 1, y + 5);
    doc.text(lines.action, cols[6] + 1, y + 5);
    y += rowH + 3;
  });
  return y;
}

function pdfDrawTopRisks(doc, y, topRisks) {
  const theme = pdfV2Theme();
  pdfSectionTitle(doc, y, 'Produits les plus exposés');
  y += 8;
  if (!topRisks.length) {
    pdfCard(doc, 14, y, 182, 12, theme.white, theme.border, 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    pdfSetText(doc, theme.muted);
    doc.text('Aucun produit en dérive sur la période sélectionnée.', 18, y + 7.5);
    return y + 16;
  }
  topRisks.forEach(([prod, v], idx) => {
    const rowH = 14;
    if (y + rowH > 280) { doc.addPage(); pdfPageHeader(doc, 'Page 4/4', 'Annexe', 4); y = 34; }
    pdfCard(doc, 14, y, 182, rowH, theme.white, theme.border, 2);
    const riskPct = v.total ? Math.round((v.nc / v.total) * 100) : 0;
    const accent = riskPct >= 50 || v.tu2 > 0 ? theme.red : theme.orange;
    pdfSetFill(doc, accent); doc.roundedRect(14, y, 2.6, rowH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); pdfSetText(doc, theme.text);
    doc.text(`#${idx + 1}  ${prod}`, 19, y + 5.7);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.2); pdfSetText(doc, theme.muted);
    doc.text(`${v.nc} NC sur ${v.total} lot(s) · ${v.tu2} TU2`, 19, y + 10.2);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); pdfSetText(doc, accent);
    doc.text(`${riskPct}% NC`, 188, y + 8, { align:'right' });
    y += rowH + 3;
  });
  return y;
}

async function genDashboardPDF() {
  try {
    await window._libsReady;
    const JsPDFCtor = getJsPDFCtor();
    if (!JsPDFCtor) {
      toast('Librairie PDF indisponible', 'err');
      return;
    }

    await ensurePdfBrandAssets();

    const data = getDashboardExportData();
    const theme = pdfV2Theme();
    const doc = new JsPDFCtor({ unit: 'mm', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    pdfSetText(doc, theme.text);

    const perimeter = getPDFV2Perimeter(data);
    const safeText = (value) => String(value || '—');
    const split = (txt, w) => doc.splitTextToSize(safeText(txt), w);

   const pRows = (Array.isArray(data.p) ? data.p : []).map(r => ({
  date: r.date || '—',
  label: r.prod || 'Produit',
  of: r.of || '—',
  line: r.ligne_prod || r.ligne || '—',
  qte: r.qte ? String(r.qte) : '—',
  result: r.vF === 'ok' ? 'OK' : r.vF === 'warn' ? 'À SURVEILLER' : 'NON CONFORME',
  ok: r.vF === 'ok'
}));

    const dRows = (Array.isArray(data.d) ? data.d : []).map(r => ({
      date: r.date || r.now || '—',
      label: r.eq || 'Détecteur',
      of: r.of || '—',
      line: r.ligne_prod || r.ligne || '—',
      result: r.vF === 'ok' ? 'CONFORME' : 'NON CONFORME',
      ok: r.vF === 'ok'
    }));

        function drawFooter(pageNo) {
      pdfSetDraw(doc, theme.borderStrong || theme.border);
      doc.setLineWidth(0.35);
      doc.line(14, 284, 196, 284);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      pdfSetText(doc, theme.muted);
      doc.text('Document généré automatiquement par QualPack', 14, 289);

      if (pageNo === 3) {
        doc.text('La décision finale concernant les lots relève du service Qualité du site.', 105, 294, { align: 'center' });
      }

      doc.text(`Page ${pageNo}/3`, 196, 289, { align: 'right' });
    }

    function drawMetricCard(x, y, w, h, title, value, accent, subtitle) {
      pdfCard(doc, x, y, w, h, theme.white, theme.border, 3);
      pdfSetFill(doc, accent);
      doc.roundedRect(x, y, 2.8, h, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      pdfSetText(doc, theme.muted);
      doc.text(title, x + 6, y + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      pdfSetText(doc, accent);
      doc.text(String(value), x + 6, y + 15.5);

      if (subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        pdfSetText(doc, theme.muted);
        const lines = split(subtitle, w - 10);
        doc.text(lines.slice(0, 2), x + 6, y + 22);
      }
    }

    function drawSimpleTableTitle(y, title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      pdfSetText(doc, theme.navy);
      doc.text(title, 14, y);
    }

    function drawRowsTable(y, title, rows, emptyText) {
      drawSimpleTableTitle(y, title);
      y += 5;

     const cols = [
  { key: 'date', x: 14, w: 30, label: 'Date' },
  { key: 'label', x: 44, w: 64, label: 'Produit / Équipement' },
  { key: 'of', x: 126, w: 20, label: 'N° OF' },
  { key: 'line', x: 146, w: 20, label: 'Ligne' },
  { key: 'result', x: 166, w: 30, label: 'Résultat' }
];
      pdfCard(doc, 14, y, 182, 9, theme.bgSoft, theme.border, 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      pdfSetText(doc, theme.text);
      cols.forEach(c => doc.text(c.label, c.x + 1.2, y + 5.8));
      y += 11;

      if (!rows.length) {
        pdfCard(doc, 14, y, 182, 10, theme.white, theme.border, 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.3);
        pdfSetText(doc, theme.muted);
        doc.text(emptyText, 18, y + 6.2);
        return y + 14;
      }

      rows.forEach(row => {
        const lineSets = {
          date: split(row.date, 30),
          label: split(row.label, 64),
          of: split(row.of, 16),
          line: split(row.line, 16),
          result: [row.result]
        };

        const maxLines = Math.max(
          lineSets.date.length,
          lineSets.label.length,
          lineSets.of.length,
          lineSets.line.length
        );

        const rowH = Math.max(10, 4 + maxLines * 3.8);

        if (y + rowH > 278) {
          doc.addPage();
          pdfPageHeader(doc, 'Rapport qualité', 'Activité & traçabilité', 2);
          y = 38;

          pdfCard(doc, 14, y, 182, 9, theme.bgSoft, theme.border, 2);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          pdfSetText(doc, theme.text);
          cols.forEach(c => doc.text(c.label, c.x + 1.2, y + 5.8));
          y += 11;
        }

        pdfCard(doc, 14, y, 182, rowH, theme.white, theme.border, 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.6);
        pdfSetText(doc, theme.text);

        doc.text(lineSets.date, 15.2, y + 4.8);
        doc.text(lineSets.label, 44.2, y + 4.8);
        doc.text(lineSets.of, 127.2, y + 4.8);
        doc.text(lineSets.line, 147.2, y + 4.8);

        const chipColor = row.ok ? theme.green : theme.red;
        const chipX = 167;
        const chipW = 27;
        const chipH = 6.2;

        pdfSetFill(doc, chipColor);
        doc.roundedRect(chipX, y + 2, chipW, chipH, 2, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.4);
        doc.setTextColor(255, 255, 255);
        doc.text(row.result, chipX + (chipW / 2), y + 6.0, { align: 'center' });

        pdfSetText(doc, theme.text);

        y += rowH + 2.5;
      });

      return y;
    }


    function parseFrDateForSort(value) {
      const str = String(value || '');
      const m = str.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
      if (!m) return 0;
      return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0)).getTime();
    }

    function buildSyntheseParOF(pesees) {
      const map = {};

      (Array.isArray(pesees) ? pesees : []).forEach(p => {
        const key = String(p.of || 'Sans OF').trim() || 'Sans OF';
        const nbPesees = Array.isArray(p.pesees) ? p.pesees.length : (Array.isArray(p.v) ? p.v.length : Number(p.n || 0));
        const nbTU1 = Number(p.tu1 || p.nbTU1 || 0);
        const nbTU2 = Number(p.tu2 || p.nbTU2 || 0);
        const isOk = p.vF === 'ok' || p.resultat === 'CONFORME';
        const dateValue = p.date || p.now || '';

        if (!map[key]) {
          map[key] = {
            produit: p.prod || p.produit || 'Produit',
            ligne: p.ligne_prod || p.ligne || '—',
            controles: 0,
            peses: 0,
            conformes: 0,
            nonConformes: 0,
            tu1: 0,
            tu2: 0,
            lastDate: dateValue,
            lastTime: parseFrDateForSort(dateValue)
          };
        }

        const item = map[key];
        item.controles += 1;
        item.peses += nbPesees;
        item.tu1 += nbTU1;
        item.tu2 += nbTU2;

        if (isOk) item.conformes += 1;
        else item.nonConformes += 1;

        const t = parseFrDateForSort(dateValue);
        if (t >= item.lastTime) {
          item.lastDate = dateValue;
          item.lastTime = t;
        }
      });

      return Object.entries(map);
    }

    function drawSyntheseParOF(y, pesees) {
      const synthese = buildSyntheseParOF(pesees);
      drawSimpleTableTitle(y, 'SYNTHÈSE PAR OF');
      y += 5;

      if (!synthese.length) {
        pdfCard(doc, 14, y, 182, 10, theme.white, theme.border, 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.3);
        pdfSetText(doc, theme.muted);
        doc.text('Aucun OF à synthétiser sur la période.', 18, y + 6.2);
        return y + 14;
      }

      const cols = [
        { label: 'N° OF', x: 15, w: 18 },
        { label: 'Produit', x: 34, w: 50 },
        { label: 'Ligne', x: 86, w: 24 },
        { label: 'Séries', x: 112, w: 15 },
        { label: 'Pesées', x: 128, w: 16 },
        { label: 'Conf.', x: 145, w: 14 },
        { label: 'NC', x: 160, w: 10 },
        { label: 'Verdict', x: 171, w: 23 }
      ];

      pdfCard(doc, 14, y, 182, 9, theme.bgSoft, theme.border, 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      pdfSetText(doc, theme.text);
      cols.forEach(c => doc.text(c.label, c.x, y + 5.8));
      y += 11;

      synthese.slice(0, 8).forEach(([of, s]) => {
        const verdict = s.nonConformes > 0 ? 'À surveiller' : 'Conforme';
        const rowH = 10;

        if (y + rowH > 278) {
          doc.addPage();
          pdfPageHeader(doc, 'Rapport qualité', 'Activité & traçabilité', 2);
          y = 38;
        }

        pdfCard(doc, 14, y, 182, rowH, theme.white, theme.border, 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.0);
        pdfSetText(doc, theme.text);

        doc.text(split(of, 17).slice(0, 1), 15, y + 6);
        doc.text(split(s.produit, 48).slice(0, 1), 34, y + 6);
        doc.text(split(s.ligne, 22).slice(0, 1), 86, y + 6);
        doc.text(String(s.controles), 114, y + 6);
        doc.text(String(s.peses), 130, y + 6);
        doc.text(String(s.conformes), 148, y + 6);
        doc.text(String(s.nonConformes), 162, y + 6);

        const chipColor = s.nonConformes > 0 ? theme.orange : theme.green;
        pdfSetFill(doc, chipColor);
        doc.roundedRect(171, y + 2.2, 22, 5.8, 1.8, 1.8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.3);
        doc.setTextColor(255, 255, 255);
        doc.text(verdict, 182, y + 6, { align: 'center' });
        pdfSetText(doc, theme.text);

        y += rowH + 2.2;
      });

      if (synthese.length > 8) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.2);
        pdfSetText(doc, theme.muted);
        doc.text(`+ ${synthese.length - 8} OF supplémentaire(s) dans le détail chronologique.`, 18, y + 4);
        y += 7;
      }

      return y + 2;
    }

    /* =========================
       PAGE 1 — SYNTHÈSE
    ========================= */
    pdfPageHeader(doc, 'Rapport qualité', 'Synthèse', 1);

    let y = 40;

    pdfCard(doc, 14, y, 182, 42, theme.bgSoft, theme.border, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    pdfSetText(doc, theme.text);
    doc.text('Périmètre du rapport', 18, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    pdfSetText(doc, theme.muted);

    const balanceRef = (getBalanceRef() || '').trim() || 'Non renseigné';

doc.text(split(`Période analysée : ${perimeter.periodTitle}`, 78), 18, y + 14);

doc.setFont('helvetica', 'bold');
doc.text('Client :', 18, y + 20);
doc.setFont('helvetica', 'normal');
doc.text(`${perimeter.client}`, 33, y + 20);

doc.setFont('helvetica', 'bold');
doc.text('Balance :', 18, y + 26);
doc.setFont('helvetica', 'normal');
doc.text(balanceRef, 37, y + 26);

doc.setFont('helvetica', 'italic');
doc.setFontSize(7.5);
pdfSetText(doc, theme.muted);
doc.text(
  split(
    'Mode de calcul : poids brut saisi par l’opérateur, puis déduction automatique de la tare fixe pour calculer le poids net réglementaire.',
    115
  ),
  18,
  y + 32
);    

doc.text(
  split(`Document d’autocontrôle interne - Outil de saisie et de traçabilité des échantillons de pesée.`, 165),
  18,
  y + 38
);

y += 48;

   pdfSectionTitle(doc, y, 'PESÉES');
   y += 6;

    drawMetricCard(14, y, 56, 28, 'Echantillons', data.stats.lots, theme.blue, `${data.stats.pOk} échantillon(s) conforme(s)`);
    drawMetricCard(77, y, 56, 28, 'Echantillons conformes', `${data.stats.pConf}%`, data.stats.pConf >= 95 ? theme.green : data.stats.pConf >= 90 ? theme.orange : theme.red, `${data.stats.pErr} NC`);
    drawMetricCard(140, y, 56, 28, 'Taux de complétion', `${data.stats.completion}%`, theme.blue, 'Sur la période');

    y += 38;

    pdfSectionTitle(doc, y, 'DÉTECTEUR');
    y += 6;

    drawMetricCard(14, y, 56, 28, 'Tests réalisés', data.stats.tests, theme.sky, `${data.stats.dOk} OK`);
    drawMetricCard(77, y, 56, 28, 'Tests conformes', `${data.stats.dConf}%`, data.stats.dConf >= 95 ? theme.green : data.stats.dConf >= 90 ? theme.orange : theme.red, `${data.stats.dErr} NOK`);
    drawMetricCard(140, y, 56, 28, 'Taux de complétion', `${data.stats.completion}%`, theme.sky, 'Sur la période');

    y += 40;

    pdfSectionTitle(doc, y, 'Point de vigilance');
    y += 6;

    pdfCard(doc, 14, y, 182, 24, theme.white, theme.border, 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    pdfSetText(doc, theme.text);

    let summaryMsg = 'Aucune non-conformité détectée sur la période.';
    if (data.stats.dErr > 0) {
      summaryMsg = `${data.stats.dErr} test(s) détecteur non conforme(s) détecté(s) sur la période.`;
    } else if (data.stats.pErr > 0) {
      summaryMsg = `${data.stats.pErr} échantillon(s) pesées non conforme(s) détecté(s) sur la période.`;
    } else if (data.stats.pWarn > 0) {
      summaryMsg = `${data.stats.pWarn} échantillon(s) de pesées à surveiller sur la période.`;
    }

    doc.text(split(summaryMsg, 168), 18, y + 10);

    drawFooter(1);

    /* =========================
       PAGE 2 — ACTIVITÉ & TRAÇABILITÉ
    ========================= */
    doc.addPage();
    pdfPageHeader(doc, 'Rapport qualité', 'Activité & traçabilité', 2);

    let y2 = 40;
    y2 = drawSyntheseParOF(y2, data.p || []);
    y2 += 6;
    y2 = drawRowsTable(y2, 'Contrôles pesées', pRows, 'Aucun contrôle pesées sur la période.');
    y2 += 6;
    y2 = drawRowsTable(y2, 'Contrôles détecteur', dRows, 'Aucun contrôle détecteur sur la période.');

    drawFooter(2);

    /* =========================
       PAGE 3 — ANALYSE & DÉCISION
    ========================= */
    doc.addPage();
    pdfPageHeader(doc, 'Rapport qualité', 'Analyse & décision', 3);

    let y3 = 40;

    // Bloc alerte visuel
    const hasAlert = data.stats.dErr > 0 || data.stats.pErr > 0 || data.stats.pWarn > 0;
    const alertColor = data.stats.dErr > 0 || data.stats.pErr > 0 ? theme.red : theme.orange;

    pdfCard(doc, 14, y3, 182, 24, hasAlert ? [255, 245, 245] : theme.bgSoft, theme.border, 3);
pdfSetFill(doc, alertColor);
doc.roundedRect(14, y3, 3, 24, 2, 2, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
pdfSetText(doc, hasAlert ? alertColor : theme.green);
doc.text(hasAlert ? 'Alerte qualité' : 'Situation maîtrisée', 20, y3 + 7.5);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.7);
pdfSetText(doc, theme.text);
const alertText = hasAlert
  ? summaryMsg
  : 'Aucune non-conformité critique détectée sur la période.';
doc.text(split(alertText, 165), 20, y3 + 15.5);

    y3 += 32;

    pdfSectionTitle(doc, y3, 'Analyse automatique');
    y3 += 6;

    pdfCard(doc, 14, y3, 182, 34, theme.white, theme.border, 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    pdfSetText(doc, theme.text);

    const analysisLines = [
      data.stats.pErr === 0 ? '• Aucun défaut critique pesées' : `• ${data.stats.pErr} défaut(s) critique(s) pesées`,
      data.stats.dErr === 0 ? '• Détecteur maîtrisé' : `• ${data.stats.dErr} test(s) détecteur NOK`,
      data.stats.tu1 === 0 ? '• Pas de dérive détectée' : `• ${data.stats.tu1} défaut(s) TU1 à surveiller`
    ];

    analysisLines.forEach((line, idx) => {
      doc.text(split(line, 165), 18, y3 + 9 + (idx * 8));
    });

    y3 += 44;

    pdfSectionTitle(doc, y3, 'Alertes à retenir');
    y3 += 6;

    pdfCard(doc, 14, y3, 182, 24, theme.white, theme.border, 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    pdfSetText(doc, theme.text);

    const alertMsg = (data.alerts && data.alerts.length)
      ? `${safeText(data.alerts[0].date)} — ${safeText(data.alerts[0].type)} — ${safeText(data.alerts[0].produit)}`
      : 'Aucune alerte majeure sur la période.';

    doc.text(split(alertMsg, 165), 18, y3 + 10);

    y3 += 34;

    pdfSectionTitle(doc, y3, 'Recommandation');
    y3 += 6;

    pdfCard(doc, 14, y3, 182, 24, theme.bgSoft, theme.border, 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    pdfSetText(doc, theme.text);

    let reco = 'Processus maîtrisé. Maintenir le niveau de surveillance actuel.';
    if (data.stats.dErr > 0) {
      reco = 'Vérifier immédiatement le détecteur concerné et sécuriser la production associée.';
    } else if (data.stats.pErr > 0) {
      reco = 'Analyser les causes des non-conformités pesées et renforcer le contrôle des lots concernés.';
    } else if (data.stats.pWarn > 0) {
      reco = 'Surveiller les dérives de pesées et prévoir une revue qualité ciblée.';
    }

    doc.text(split(reco, 168), 18, y3 + 10);

    drawFooter(3);

    doc.save('QualPack_Rapport_Qualite.pdf');

  } catch (e) {
    console.error('genDashboardPDF error:', e);
    toast('Erreur génération PDF', 'err');
  }
}

/* ============================================================
   DASHBOARD MOBILE
   ============================================================ */
  
function renderDashboardMobile() {
  const body = document.getElementById('dash-body');
  const dateEl = document.getElementById('dash-date');
  populateDashFilters();
  dateEl.textContent = new Date().toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' });

  const pBase = filterByPeriod(sessions, dashPeriod);
  const dBase = filterByPeriod(dets, dashPeriod);
  const pPrevBase = filterPrevPeriod(sessions, dashPeriod);
  const dPrevBase = filterPrevPeriod(dets, dashPeriod);
  const { p: pF, d: dF } = applyDashFilters(pBase, dBase);
  const { p: pPrev, d: dPrev } = applyDashFilters(pPrevBase, dPrevBase);

  if (!pF.length && !dF.length) {
    body.innerHTML = `<div class="empty-dash"><div class="ed-icon">📊</div><div class="ed-title">Aucune donnée sur la période</div><div class="ed-sub">Élargis la période ou enlève les filtres pour afficher le dashboard.</div></div>`;
    return;
  }

  body.innerHTML =
    buildStatusHero(pF, dF) +
    buildBlocSynthese(pF, dF, pPrev, dPrev) +
    buildBlocActions(pF, dF) +
    buildBlocSync(pF, dF) +
    '<div style="height:16px"></div>';
}

  /* ============================================================
   DASHBOARD RESPONSIVE V26
   ============================================================ */

function renderDashboard() {

  // TABLETTE / PC
  if (window.innerWidth >= 768) {
    renderDashboardPro();
    return;
  }

  // SMARTPHONE
  renderDashboardMobile();
}

/* ============================================================
   DASHBOARD QUALITÉ PRO (placeholder V26)
   ============================================================ */

function renderDashboardPro() {

  const body = document.getElementById('dash-body');
  const dateEl = document.getElementById('dash-date');

  populateDashFilters();

  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString(
      'fr-FR',
      { weekday:'short', day:'numeric', month:'short' }
    );
  }

  const pBase = filterByPeriod(sessions, dashPeriod);
  const dBase = filterByPeriod(dets, dashPeriod);
  const { p: pF, d: dF } = applyDashFilters(pBase, dBase);

  const totalPesees = pF.length;
  const totalDetecteurs = dF.length;

  const conformes = pF.filter(x => x.vF === 'ok').length;
  const aSurveiller = pF.filter(x => x.vF === 'warn').length;
  const critiques = pF.filter(x => x.vF === 'err').length;
  const nonConformes = aSurveiller + critiques;

  const tauxConformite = totalPesees > 0
    ? Math.round((conformes / totalPesees) * 100)
    : 0;

 const totalMesures = pF.reduce((acc, s) => {
  if (Array.isArray(s.pesees)) return acc + s.pesees.length;
  if (Array.isArray(s.v)) return acc + s.v.length;
  if (Array.isArray(s.valeurs)) return acc + s.valeurs.length;
  if (Array.isArray(s.poids)) return acc + s.poids.length;

  return acc
    + (Number(s.nb_pesees) || 0)
    + (Number(s.nbPesees) || 0)
    + (Number(s.nb_mesures) || 0)
    + (Number(s.nbMesures) || 0)
    + (Number(s.n) || 0);
}, 0);

   const totalTU1 = pF.reduce((acc, s) => acc + (Number(s.tu1) || Number(s.nbTU1) || 0), 0);
  const totalTU2 = pF.reduce((acc, s) => acc + (Number(s.tu2) || Number(s.nbTU2) || 0), 0);

  const joursAvecActivite = [
    ...new Set(
      [...pF, ...dF]
        .map(x => (x.date || x.now || '').split(' ')[0])
        .filter(Boolean)
    )
  ].length;

  const tauxCompletion = dashPeriod
    ? Math.round((Math.min(dashPeriod, joursAvecActivite) / dashPeriod) * 100)
    : 100;

  const statutClass = critiques > 0 ? 'err' : (aSurveiller > 0 || totalTU1 > 0 ? 'warn' : 'ok');
  const statutLabel = critiques > 0
    ? 'Action qualité requise'
    : (aSurveiller > 0 || totalTU1 > 0 ? 'Dérives à analyser' : 'Situation maîtrisée');

  const statutSub = critiques > 0
    ? `${critiques} échantillon(s) critique(s) détecté(s).`
    : (totalTU1 > 0
        ? `${totalTU1} défaut(s) TU1 détecté(s). Revue qualité conseillée.`
        : 'Aucune dérive majeure détectée sur la période.');

  const topProduitsMap = {};
  pF.forEach(s => {
    const prod = s.prod || s.produit || 'Produit non renseigné';
    if (!topProduitsMap[prod]) topProduitsMap[prod] = { total: 0, nc: 0 };
    topProduitsMap[prod].total += 1;
    if (s.vF !== 'ok') topProduitsMap[prod].nc += 1;
  });

  const topProduits = Object.entries(topProduitsMap)
    .map(([name, v]) => ({
      name,
      total: v.total,
      nc: v.nc,
      pct: v.total ? Math.round((v.nc / v.total) * 100) : 0
    }))
    .sort((a, b) => b.pct - a.pct || b.nc - a.nc)
    .slice(0, 3);

  const ofMap = {};
  pF.forEach(s => {
    const of = s.of || 'OF non renseigné';
    if (!ofMap[of]) {
      ofMap[of] = {
        of,
        prod: s.prod || s.produit || '—',
        ligne: s.ligne || s.ligne_prod || '—',
        controles: 0,
        pesees: 0,
        conformes: 0,
        nc: 0,
        tu1: 0,
        tu2: 0,
        last: s.date || s.now || ''
      };
    }
    ofMap[of].controles += 1;
    ofMap[of].pesees += Array.isArray(s.pesees)
      ? s.pesees.length
      : (Array.isArray(s.v) ? s.v.length : 0);
    ofMap[of].conformes += s.vF === 'ok' ? 1 : 0;
    ofMap[of].nc += s.vF !== 'ok' ? 1 : 0;
    ofMap[of].tu1 += Number(s.tu1) || Number(s.nbTU1) || 0;
    ofMap[of].tu2 += Number(s.tu2) || Number(s.nbTU2) || 0;
    ofMap[of].last = s.date || s.now || ofMap[of].last;
  });

 const ofRows = Object.values(ofMap)
  .sort((a, b) => String(b.last).localeCompare(String(a.last)));

  const alerts = [];
  pF.filter(s => s.vF !== 'ok').slice(0, 3).forEach(s => {
    alerts.push({
      type: s.vF === 'err' ? 'err' : 'warn',
      title: `${s.vF === 'err' ? 'Non-conformité' : 'À surveiller'} — ${s.prod || s.produit || 'Produit'}`,
      meta: `${s.of || 'OF non renseigné'} · ${s.ligne || s.ligne_prod || 'Ligne non renseignée'}`
    });
  });

  const badgeClass =
  critiques > 0 ? 'err' :
  aSurveiller > 0 ? 'warn' :
  'ok';

  const badgeText =
  critiques > 0 ? 'Action qualité requise' :
  aSurveiller > 0 ? 'À surveiller' :
  'Situation conforme';

  const repartitionNC = nonConformes || totalTU1 || totalTU2;
  const tu1Pct = repartitionNC ? Math.round((totalTU1 / repartitionNC) * 100) : 0;
  const tu2Pct = repartitionNC ? Math.round((totalTU2 / repartitionNC) * 100) : 0;

  const detOkCount = dF.filter(d => d && d.vF === 'ok').length;
const detKoCount = dF.filter(d => d && d.vF !== 'ok').length;

const sortedDets = [...dF].sort((a, b) => {
  const da = new Date(a.now || a.date || 0);
  const db = new Date(b.now || b.date || 0);
  return db - da;
});

const lastDet = sortedDets[0] || null;
const lastDetKo = sortedDets.find(d => d && d.vF !== 'ok') || null;

const lastDetText = lastDet
  ? (lastDet.now || lastDet.date || 'Renseigné')
  : 'Aucun test';

const lastDetFailText = lastDetKo
  ? (lastDetKo.ligne_prod || lastDetKo.ligne || lastDetKo.eq || 'Échec détecteur')
  : 'Aucun échec';

  const sparkValues = [72, 78, 81, tauxConformite, Math.max(0, tauxConformite - 6), tauxConformite, Math.min(100, tauxConformite + 3)];

const periodeFin = new Date();
const periodeDebut = new Date();

if (dashPeriod) {
  periodeDebut.setDate(periodeFin.getDate() - dashPeriod + 1);
}

const periodeDebutTxt = dashPeriod
  ? periodeDebut.toLocaleDateString('fr-FR')
  : 'début historique';

const periodeFinTxt = periodeFin.toLocaleDateString('fr-FR');

body.innerHTML = `
    <div class="dash-pro-cockpit">

      <aside class="dash-pro-sidebar">
        <div class="dash-pro-side-title">PÉRIMÈTRE ANALYSÉ</div>
        <div class="dash-pro-side-item"><span>Période</span><strong>${dashPeriod ? `${dashPeriod} jours` : 'Tout historique'}</strong></div>
        <div class="dash-pro-side-item"><span>Échantillons</span><strong>${totalPesees}</strong></div>
        <div class="dash-pro-side-item"><span>Détecteur</span><strong>${totalDetecteurs}</strong></div>
        <div class="dash-pro-side-item"><span>Complétion</span><strong>${tauxCompletion}%</strong></div>
      </aside>

      <section class="dash-pro-main">

         <div class="dash-pro-top">
  <div class="dash-pro-period-card">
    <span>Période analysée</span>
    <strong>Du ${periodeDebutTxt} au ${periodeFinTxt}</strong>
  </div>

  <span class="dash-pro-badge ${badgeClass}">${badgeText}</span>
</div>
    <div class="dash-pro-kpis">
    <div class="dash-pro-kpi">
    <span class="dash-kpi-title info">Contrôles réalisés</span>
    <strong>${totalPesees}</strong>
    <small>${totalMesures} pesées</small>
    <svg class="dash-kpi-sparkline" viewBox="0 0 72 34" aria-hidden="true">
      <polygon points="0,34 0,28 12,24 24,26 36,15 48,20 60,8 72,14 72,34"></polygon>
      <polyline points="0,28 12,24 24,26 36,15 48,20 60,8 72,14"></polyline>
    </svg>
  </div>

  <div class="dash-pro-kpi">
    <span class="dash-kpi-title ${tauxConformite >= 95 ? 'ok' : tauxConformite >= 92 ? 'warn' : 'err'}">Taux conformité</span>
    <strong class="${tauxConformite >= 95 ? 'ok' : tauxConformite >= 92 ? 'warn' : 'err'}">${tauxConformite}%</strong>
    <small>${conformes} / ${totalPesees} conformes</small>
    <div class="dash-kpi-donut ${tauxConformite >= 95 ? 'ok' : tauxConformite >= 92 ? 'warn' : 'err'}" style="--donut-value:${Math.max(0, Math.min(100, tauxConformite))};"></div>
  </div>

  <div class="dash-pro-kpi">
    <span class="dash-kpi-title ${nonConformes === 0 ? 'ok' : nonConformes === 1 ? 'warn' : 'err'}">Non-conformités</span>
    <strong class="${nonConformes === 0 ? 'ok' : nonConformes === 1 ? 'warn' : 'err'}">${nonConformes}</strong>
    <small>${aSurveiller} à surveiller · ${critiques} critiques</small>
    <div class="dash-kpi-gauge ${nonConformes === 0 ? 'ok' : nonConformes === 1 ? 'warn' : 'err'}" style="--gauge-value:${nonConformes === 0 ? 8 : nonConformes === 1 ? 45 : 100};">
      <div></div>
    </div>
  </div>

  <div class="dash-pro-kpi">
    <span class="dash-kpi-title ${tauxCompletion >= 90 ? 'ok' : tauxCompletion >= 80 ? 'warn' : 'err'}">Complétion</span>
    <strong class="${tauxCompletion >= 90 ? 'ok' : tauxCompletion >= 80 ? 'warn' : 'err'}">${tauxCompletion}%</strong>
    <small>${joursAvecActivite} jour(s) actif(s)</small>
    <div class="dash-kpi-progress ${tauxCompletion >= 90 ? 'ok' : tauxCompletion >= 80 ? 'warn' : 'err'}" style="--qp:${Math.max(0, Math.min(100, tauxCompletion))};">
      <div></div>
    </div>
  </div>

  <div class="dash-pro-kpi">
  <span class="dash-kpi-title ${totalTU1 === 0 ? 'ok' : totalTU1 === 1 ? 'warn' : 'err'}">Défauts TU1</span>
  <strong class="${totalTU1 === 0 ? 'ok' : totalTU1 === 1 ? 'warn' : 'err'}">${totalTU1}</strong>
  <small>défaut(s) TU1</small>

  <div class="dash-kpi-alert-icon ${totalTU1 === 0 ? 'ok' : totalTU1 === 1 ? 'warn' : 'err'}">
    ${totalTU1 === 0 ? '✓' : totalTU1 === 1 ? '!' : '⚠'}
    </div>
  </div>
</div>
  
        <div class="dash-pro-grid-main">
         <div class="dash-pro-panel chart-panel">
  <div class="dash-pro-panel-title">Évolution de la conformité</div>

  <div class="dash-pro-linechart">

    <svg viewBox="0 0 320 140" preserveAspectRatio="none">

      <!-- ligne objectif -->
      <line
        x1="0"
        y1="20"
        x2="320"
        y2="20"
        class="dash-pro-target-line"
      />

      <!-- courbe -->
      <polyline
        fill="none"
        stroke="${tauxConformite >= 95 ? '#3ecf8e' : tauxConformite >= 80 ? '#ffb84d' : '#ff5d5d'}"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="
          0,90
          50,72
          100,65
          150,${120 - tauxConformite}
          200,${130 - Math.max(55, tauxConformite - 8)}
          260,${120 - tauxConformite}
          320,${115 - tauxConformite}
        "
      />

      <!-- points -->
      <circle cx="0" cy="90" r="3" class="dash-pro-point"/>
      <circle cx="50" cy="72" r="3" class="dash-pro-point"/>
      <circle cx="100" cy="65" r="3" class="dash-pro-point"/>
      <circle cx="150" cy="${120 - tauxConformite}" r="3" class="dash-pro-point active"/>

    </svg>

  </div>

  <div class="dash-pro-chart-caption">
    Tendance indicative — objectif qualité 98%
  </div>
</div>

          <div class="dash-pro-panel">
  <div class="dash-pro-panel-title">Surveillance détecteurs</div>

  <div class="dash-detector-watch">
    <div class="dash-detector-row ok">
      <span>✅ Tests conformes</span>
      <strong>${detOkCount}</strong>
    </div>

    <div class="dash-detector-row warn">
      <span>⚠️ Tests non conformes</span>
      <strong>${detKoCount}</strong>
    </div>

    <div class="dash-detector-row neutral">
      <span>🕒 Dernier test</span>
      <strong>${lastDetText}</strong>
    </div>

    <div class="dash-detector-row danger">
      <span>🚨 Dernier échec</span>
      <strong>${lastDetFailText}</strong>
    </div>
  </div>
</div>

          <div class="dash-pro-panel">
            <div class="dash-pro-panel-title">Top 3 produits — taux NC</div>
            ${topProduits.length ? topProduits.map((p, i) => `
              <div class="dash-pro-top-product">
                <span>#${i + 1}</span>
                <strong>${p.name}</strong>
                <em>${p.nc} / ${p.total}</em>
                <b>${p.pct}%</b>
              </div>
            `).join('') : `<div class="dash-pro-empty">Aucun produit à risque</div>`}
          </div>
        </div>

        <div class="dash-pro-bottom">
          <div class="dash-pro-panel of-panel">
            <div class="dash-pro-panel-title">Synthèse par OF</div>
            <div class="dash-pro-of-scroll">
            <table class="dash-pro-table">
              <thead>
                <tr>
                  <th>N° OF</th><th>Produit</th><th>Ligne</th><th>Contrôles</th><th>Pesées</th><th>NC</th><th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                ${ofRows.map(r => `
                  <tr>
                    <td>${r.of}</td>
                    <td>${r.prod}</td>
                    <td>${r.ligne}</td>
                    <td>${r.controles}</td>
                    <td>${r.pesees}</td>
                    <td>${r.nc}</td>
                    <td><span class="dash-pro-status ${r.nc ? 'warn' : 'ok'}">${r.nc ? 'À surveiller' : 'Conforme'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
        </div>
      </div>

<div class="dash-pro-panel alerts-panel">
            <div class="dash-pro-panel-title">Alertes & recommandation</div>
            ${alerts.length ? alerts.map(a => `
              <div class="dash-pro-alert ${a.type}">
                <strong>${a.title}</strong>
                <span>${a.meta}</span>
              </div>
            `).join('') : `<div class="dash-pro-alert ok"><strong>Aucune alerte critique</strong><span>${statutSub}</span></div>`}

            <div class="dash-pro-reco">
              <strong>Recommandation</strong>
              <span>${nonConformes ? 'Analyser les OF en alerte et vérifier les réglages de dosage / tare.' : 'Maintenir la fréquence de contrôle actuelle.'}</span>
            </div>
          </div>
        </div>

      </section>
    </div>
  `;
}

 
/* ADMIN V27 START : logique PIN déplacée dans admin.js */


/* ================================================================
   V12 — CATALOGUE SUPABASE (clients, produits, opérateurs)
   ================================================================ */

const SB_URL = 'https://ktnfqhsuajrsvviszooa.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bmZxaHN1YWpyc3Z2aXN6b29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDQzMzMsImV4cCI6MjA5MDk4MDMzM30.8Hid-R35NXLb8DTpYvOj34a9yvNoi4NlGLd2njfw0eY';

/* ================================
   CONFIG CLIENT MULTI-SITE V24
   - site_id lu depuis l'URL : ?site_id=moulin_des_moines
   - mémorisation locale par navigateur
   - fallback sécurisé pour compatibilité V23
================================ */
const QUALPACK_DEFAULT_SITE_ID = 'codex_test';
const QUALPACK_SITE_STORAGE_KEY = 'qp_v26_test_site_id';

function qpNormalizeSiteId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function qpReadSiteIdFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search || '');
    return qpNormalizeSiteId(params.get('site_id'));
  } catch (e) {
    return '';
  }
}

function qpGetSiteId() {
  const fromUrl = qpReadSiteIdFromUrl();

  if (fromUrl) {
    localStorage.setItem(QUALPACK_SITE_STORAGE_KEY, fromUrl);
    return fromUrl;
  }

  // V26-TEST : sans site_id dans l’URL, on force CODEX TEST.
  // Objectif : ne jamais récupérer par erreur un ancien site_id V25.2
  // stocké dans le navigateur, par exemple traiteur_de_la_thur.
  localStorage.setItem(QUALPACK_SITE_STORAGE_KEY, QUALPACK_DEFAULT_SITE_ID);
  return QUALPACK_DEFAULT_SITE_ID;
}

function qpSiteNameFromId(siteId) {
  const labels = {
    traiteur_de_la_thur: 'Traiteur de la Thur',
    moulin_des_moines: 'Moulin des Moines',
    codex_test: 'CODEX TEST'
  };
  if (labels[siteId]) return labels[siteId];
  return String(siteId || QUALPACK_DEFAULT_SITE_ID)
    .split('_')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const QUALPACK_SITE_ID = qpGetSiteId();
const QUALPACK_SITE_NAME = qpSiteNameFromId(QUALPACK_SITE_ID);

function qpHandleSiteSwitch() {
  const currentSite = QUALPACK_SITE_ID;
  const previousSite = localStorage.getItem('qp_v26_test_current_site_id');

  if (previousSite && previousSite !== currentSite) {
    [
      'qp_catalogue',
      'qp_operateurs',
      'qp_line_detecteurs',
      'qp_lines_catalogue',
      'qp_detecteurs_catalogue'
    ].forEach(k => localStorage.removeItem(k));

    Object.keys(localStorage)
      .filter(k =>
        k.startsWith('qp_catalogue_') ||
        k.startsWith('qp_operateurs_') ||
        k.startsWith('qp_line_detecteurs_') ||
        k.startsWith('qp_lines_catalogue_') ||
        k.startsWith('qp_detecteurs_catalogue_') ||
        k.startsWith('qp_sessions') ||
        k.startsWith('qp_dets')
      )
      .forEach(k => localStorage.removeItem(k));

    try {
      indexedDB.deleteDatabase('qualpack_db');
      console.log('QualPack : IndexedDB nettoyée après changement de site');
    } catch (e) {
      console.warn('QualPack : nettoyage IndexedDB impossible', e);
    }
  }

  localStorage.setItem('qp_v26_test_current_site_id', currentSite);
}

qpHandleSiteSwitch();  

function qpSiteEqParam() {
  return `site_id=eq.${encodeURIComponent(QUALPACK_SITE_ID)}`;
}

function qpAddSiteToUrl(url) {
  return url + (url.includes('?') ? '&' : '?') + qpSiteEqParam();
}

function qpWithSite(payload) {
  return { ...(payload || {}), site_id: QUALPACK_SITE_ID };
}

function qpSafeIdPart(value) {
  return qpNormalizeSiteId(value).replace(/_+/g, '_') || 'site';
}

/* ================================
   ESSAI GRATUIT 30 JOURS V24
   Gestion locale par site_id
================================ */
const QUALPACK_TRIAL_DAYS = 30;

function qpTrialKey(suffix) {
  return `qp_trial_${QUALPACK_SITE_ID}_${suffix}`;
}

function qpGetTrialStartDate() {
  let raw = localStorage.getItem(qpTrialKey('start'));
  if (!raw) {
    raw = new Date().toISOString();
    localStorage.setItem(qpTrialKey('start'), raw);
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

function qpTrialDaysUsed() {
  const start = qpGetTrialStartDate();
  const now = new Date();
  return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
}

function qpTrialDaysLeft() {
  return QUALPACK_TRIAL_DAYS - qpTrialDaysUsed();
}

function qpBlockExpiredTrial() {
  document.body.innerHTML = `
    <div style="min-height:100vh;background:#0D1B2A;color:#E8EDF3;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Arial,sans-serif;text-align:center;">
      <div style="max-width:520px;background:#132236;border:1px solid #1F3A55;border-radius:16px;padding:28px;">
        <h1 style="font-size:24px;margin:0 0 12px;color:#F07070;">Essai QualPack expiré</h1>
        <p style="font-size:15px;line-height:1.5;margin:0 0 10px;">La période d'essai de 30 jours est terminée pour le site <strong>${QUALPACK_SITE_NAME}</strong>.</p>
        <p style="font-size:14px;line-height:1.5;color:#7A8FA6;margin:0;">Merci de contacter CODEX EXPERTISE pour prolonger ou activer votre accès.</p>
      </div>
    </div>`;
}

function qpCheckTrialStatus() {
  const left = qpTrialDaysLeft();
  if (left <= 0) {
    qpBlockExpiredTrial();
    return false;
  }

  if (left <= 7 && localStorage.getItem(qpTrialKey('last_warning_days_left')) !== String(left)) {
    localStorage.setItem(qpTrialKey('last_warning_days_left'), String(left));
    setTimeout(() => {
      try {
        alert(`Essai QualPack — ${left} jour(s) restant(s) pour ${QUALPACK_SITE_NAME}.`);
      } catch (e) {}
    }, 600);
  }
  return true;
}

/* ================================
   SÉCURITÉ V26 — validation site_id + clé
   - La clé est saisie une fois par site et mémorisée localement
   - Les headers sont envoyés à Supabase pour les policies RLS V26
================================ */
const QUALPACK_SITE_KEY_STORAGE_KEY = `qp_site_key_${QUALPACK_SITE_ID}`;
const QUALPACK_SITE_ACCESS_STORAGE_KEY = `qp_site_access_${QUALPACK_SITE_ID}`;

const SB_HDR = {
  'Content-Type': 'application/json',
  'apikey': SB_KEY,
  'Authorization': 'Bearer ' + SB_KEY,
  'x-qualpack-site-id': QUALPACK_SITE_ID,
  'x-qualpack-site-key': ''
};

function qpGetStoredSiteKey() {
  return String(localStorage.getItem(QUALPACK_SITE_KEY_STORAGE_KEY) || '').trim();
}

function qpSetStoredSiteKey(key) {
  localStorage.setItem(QUALPACK_SITE_KEY_STORAGE_KEY, String(key || '').trim());
}

function qpClearStoredSiteKey() {
  localStorage.removeItem(QUALPACK_SITE_KEY_STORAGE_KEY);
  localStorage.removeItem(QUALPACK_SITE_ACCESS_STORAGE_KEY);
  SB_HDR['x-qualpack-site-key'] = '';
}

function qpApplySiteSecurityHeaders(key) {
  SB_HDR['x-qualpack-site-id'] = QUALPACK_SITE_ID;
  SB_HDR['x-qualpack-site-key'] = String(key || qpGetStoredSiteKey() || '').trim();
}

function qpSaveValidatedAccess(siteRow, key) {
  qpSetStoredSiteKey(key);
  localStorage.setItem(QUALPACK_SITE_ACCESS_STORAGE_KEY, JSON.stringify({
    site_id: siteRow?.site_id || QUALPACK_SITE_ID,
    nom: siteRow?.nom || QUALPACK_SITE_NAME,
    actif: siteRow?.actif === true,
    date_expiration: siteRow?.date_expiration || null,
    validated_at: new Date().toISOString()
  }));
  qpApplySiteSecurityHeaders(key);
}

function qpStoredAccessStillValidOffline() {
  try {
    const raw = JSON.parse(localStorage.getItem(QUALPACK_SITE_ACCESS_STORAGE_KEY) || 'null');
    if (!raw || raw.site_id !== QUALPACK_SITE_ID || raw.actif !== true) return false;
    if (!raw.date_expiration) return false;
    const end = new Date(raw.date_expiration + 'T23:59:59');
    return end >= new Date();
  } catch (e) {
    return false;
  }
}

async function qpValidateSiteAccess(siteKey) {
  const key = String(siteKey || '').trim();
  if (!key) return { ok: false, reason: 'missing_key' };

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SB_KEY,
    'Authorization': 'Bearer ' + SB_KEY,
    'x-qualpack-site-id': QUALPACK_SITE_ID,
    'x-qualpack-site-key': key
  };

  const url = `${SB_URL}/rest/v1/sites?select=site_id,nom,actif,date_expiration&site_id=eq.${encodeURIComponent(QUALPACK_SITE_ID)}&limit=1`;
  const res = await fetch(url, { headers });
  if (!res.ok) return { ok: false, reason: `http_${res.status}` };

  const rows = await res.json();
  const site = Array.isArray(rows) ? rows[0] : null;
  if (!site) return { ok: false, reason: 'invalid_or_expired' };

  qpSaveValidatedAccess(site, key);
  return { ok: true, site };
}

function qpRenderAccessScreen(message = '') {
  document.body.innerHTML = `
    <div style="min-height:100vh;background:#0D1B2A;color:#E8EDF3;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Arial,sans-serif;">
      <div style="width:100%;max-width:440px;background:#132236;border:1px solid #1F3A55;border-radius:18px;padding:26px;box-shadow:0 18px 45px rgba(0,0,0,.35);">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <img src="./icon-192.png" alt="QualPack" style="width:42px;height:42px;border-radius:12px;object-fit:cover;display:block;">
          <div>
            <div style="font-size:22px;font-weight:800;letter-spacing:.2px;">QualPack V26 TEST</div>
            <div style="font-size:13px;color:#7A8FA6;">Accès sécurisé par site</div>
          </div>
        </div>

        <div style="background:#0F2033;border:1px solid #1F3A55;border-radius:14px;padding:14px;margin-bottom:16px;">
          <div style="font-size:12px;color:#7A8FA6;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Site détecté</div>
          <div style="font-size:16px;font-weight:700;">${QUALPACK_SITE_NAME}</div>
          <div style="font-size:12px;color:#7A8FA6;margin-top:3px;">${QUALPACK_SITE_ID}</div>
        </div>

        <label for="qp-site-key-input" style="display:block;font-size:13px;color:#B8C7D8;margin-bottom:8px;">Clé d'accès QUALPACK</label>
        <input id="qp-site-key-input" type="password" autocomplete="current-password" placeholder="Ex : QP-CODEX-TEST"
          style="width:100%;box-sizing:border-box;background:#0D1B2A;color:#E8EDF3;border:1px solid #2E4A66;border-radius:12px;padding:13px 14px;font-size:15px;outline:none;">

        <button id="qp-site-key-submit" type="button"
          style="width:100%;margin-top:14px;background:#2E7DD1;color:white;border:0;border-radius:12px;padding:13px 16px;font-size:15px;font-weight:700;cursor:pointer;">
          Valider l'accès
        </button>

        <div id="qp-site-key-error" style="min-height:20px;margin-top:12px;color:#F07070;font-size:13px;line-height:1.4;">${message || ''}</div>

        <p style="font-size:12px;line-height:1.45;color:#7A8FA6;margin:14px 0 0;">
          Chaque lien QUALPACK est propre à un site. Ne transmettez pas ce lien ni cette clé à une autre société.
        </p>
      </div>
    </div>
  `;

  const input = document.getElementById('qp-site-key-input');
  const btn = document.getElementById('qp-site-key-submit');
  const err = document.getElementById('qp-site-key-error');

  const submit = async () => {
    const key = input.value.trim();
    if (!key) { err.textContent = 'Merci de saisir la clé d’accès.'; return; }
    btn.disabled = true;
    btn.textContent = 'Vérification...';
    err.textContent = '';
    try {
      const result = await qpValidateSiteAccess(key);
      if (!result.ok) {
        qpClearStoredSiteKey();
        err.textContent = 'Clé invalide, site inactif ou période d’essai expirée.';
        btn.disabled = false;
        btn.textContent = 'Valider l’accès';
        return;
      }
      window.location.reload();
    } catch (e) {
      err.textContent = 'Connexion Supabase impossible. Vérifie la connexion internet puis réessaie.';
      btn.disabled = false;
      btn.textContent = 'Valider l’accès';
    }
  };

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  setTimeout(() => input.focus(), 50);
}

async function qpEnsureSiteAccess() {
  const storedKey = qpGetStoredSiteKey();
  if (storedKey) {
    qpApplySiteSecurityHeaders(storedKey);
    if (!navigator.onLine && qpStoredAccessStillValidOffline()) return true;
    try {
      const result = await qpValidateSiteAccess(storedKey);
      if (result.ok) return true;
    } catch (e) {
      if (qpStoredAccessStillValidOffline()) return true;
    }
    qpClearStoredSiteKey();
  }

  qpRenderAccessScreen();
  return false;
}

qpApplySiteSecurityHeaders(qpGetStoredSiteKey());

/* ── Formule réglementaire TNE ── */
function calcTNE(qn) {
  if (qn <= 50)   return qn * 0.09;
  if (qn <= 100)  return 4.5;
  if (qn <= 200)  return qn * 0.045;
  if (qn <= 300)  return 9;
  if (qn <= 500)  return qn * 0.03;
  if (qn <= 1000) return 15;
  return qn * 0.015;
}

function calcSeuils(qn) {
  const tne = Math.round(calcTNE(qn) * 10) / 10;
  return {
    qn:  qn,
    tne: tne,
    tu1: Math.round((qn - tne) * 10) / 10,
    tu2: Math.round((qn - tne * 2) * 10) / 10
  };

}

function qpCacheKey(base) {
  const site = (typeof QUALPACK_SITE_ID !== 'undefined' && QUALPACK_SITE_ID)
    ? QUALPACK_SITE_ID
    : 'default';
  return `${base}_${site}`;
}

function getLocalOperateursCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(qpCacheKey('qp_operateurs')) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch(e) {
    return [];
  }
}

function saveLocalOperateursCache(items) {
  localStorage.setItem(qpCacheKey('qp_operateurs'), JSON.stringify(items || []));
}

function mergeOperateursLists(primary, secondary) {
  const map = new Map();
  [...(primary || []), ...(secondary || [])].forEach(op => {
    if (!op || (!op.id && !op.nom)) return;
    const key = op.id || String(op.nom).toLowerCase();
    if (!map.has(key)) {
      map.set(key, { ...op });
    } else {
      map.set(key, { ...map.get(key), ...op });
    }
  });
  return Array.from(map.values())
    .filter(op => op.actif !== false)
    .sort((a, b) => String(a.nom || '').localeCompare(String(b.nom || ''), 'fr'));
}

function upsertLocalOperateur(op) {
  const current = getLocalOperateursCache();
  const merged = mergeOperateursLists([op], current);
  saveLocalOperateursCache(merged);
  OPERATEURS = mergeOperateursLists([op], OPERATEURS);
}

function removeLocalOperateur(id) {
  const current = getLocalOperateursCache().filter(op => op.id !== id);
  saveLocalOperateursCache(current);
  OPERATEURS = OPERATEURS.filter(op => op.id !== id);
}

/* ── Charger catalogue depuis Supabase ── */

async function loadCatalogueFromSupabase() {
  if (!navigator.onLine) return false;
  try {
    const rClients = await fetch(`${SB_URL}/rest/v1/clients?select=*&${qpSiteEqParam()}&order=nom`, { headers: SB_HDR });
    if (!rClients.ok) throw new Error('clients ' + rClients.status);
    const clients = await rClients.json();

    const rProds = await fetch(`${SB_URL}/rest/v1/produits?select=*&${qpSiteEqParam()}&order=nom`, { headers: SB_HDR });
    if (!rProds.ok) throw new Error('produits ' + rProds.status);
    const prods = await rProds.json();

    let lignes = [];
    try {
      const rLignes = await fetch(`${SB_URL}/rest/v1/lignes?select=*&${qpSiteEqParam()}&order=nom`, { headers: SB_HDR });
      if (rLignes.ok) {
        lignes = await rLignes.json();
      } else {
        console.warn('lignes fetch ignored:', rLignes.status);
      }
    } catch (e) {
      console.warn('lignes fetch exception ignored:', e);
    }

    const rOps = await fetch(`${SB_URL}/rest/v1/operateurs?select=*&${qpSiteEqParam()}&actif=eq.true&order=nom`, {
      headers: SB_HDR
    });

    let ops = [];
    if (rOps.ok) {
      ops = await rOps.json();
    } else {
      console.warn('operateurs fetch ignored:', rOps.status);
    }

    const hasSupabaseCatalogue = Array.isArray(clients) && clients.length > 0 && Array.isArray(prods) && prods.length > 0;

    if (hasSupabaseCatalogue) {
      const nextCatalogue = {};
      clients.forEach(c => { nextCatalogue[c.nom] = []; });

     prods.forEach(p => {
  const s = calcSeuils(parseFloat(p.qn));
 const prod = {
  id: p.id,
  nom: p.nom,
  qn: s.qn,
  tu1: s.tu1,
  tu2: s.tu2,
  tne: s.tne,
  tare_fixe_g: p.tare_fixe_g ?? null,
  ligne_prod: p.ligne_prod || '',
  detecteur: p.detecteur || '',
  of_planifies: p.of_planifies || '',
  quantite_prevue_defaut: p.quantite_prevue_defaut ?? null,
  actif: p.actif !== false
};

  const cli = clients.find(c => c.id === p.client_id);
  if (cli) {
    if (!nextCatalogue[cli.nom]) nextCatalogue[cli.nom] = [];
    nextCatalogue[cli.nom].push(prod);
  }
});

      if (Object.keys(nextCatalogue).length) {
        CATALOGUE = sanitizeCatalogue(nextCatalogue);
        localStorage.setItem(qpCacheKey('qp_catalogue'), JSON.stringify(CATALOGUE));
      }
    } else {
  console.warn('Catalogue Supabase vide pour ce site, réinitialisation du catalogue local');
  CATALOGUE = {};
  localStorage.removeItem(qpCacheKey('qp_catalogue'));
}

    OPERATEURS = mergeOperateursLists(ops, getLocalOperateursCache().length ? getLocalOperateursCache() : OPERATEURS);
    if (!OPERATEURS.length) {
  OPERATEURS = [];
}
    saveLocalOperateursCache(OPERATEURS);

    const prodsForCurrentSite = (prods || []).filter(p => !p.site_id || p.site_id === QUALPACK_SITE_ID);

mergeLineDetecteurMappings(prodsForCurrentSite);

saveStoredDetecteurCatalogue(
  [...new Set(prodsForCurrentSite
    .map(p => String((p && p.detecteur) || '').trim())
    .filter(Boolean))]
);

const fetchedLines = (lignes || [])
  .map(l => String((l && (l.nom || l.nom_ligne || l.ligne_prod || l.ligne)) || '').trim())
  .filter(Boolean);

saveStoredLineCatalogue([...new Set(fetchedLines)]);
    populateClientSelect();
    populateOpSelects();
    populateLineSelect('inp-ligne');
    populateLineSelect('d-ligne');
    populateDetecteurSelect();
    return true;
  } catch(e) {
    console.warn('loadCatalogue Supabase error:', e);
    return false;
  }
}

/* ── Charger depuis cache local (fallback offline) ── */
function loadCatalogueFromCache() {
  try {
    const cat = localStorage.getItem(qpCacheKey('qp_catalogue'));
    const ops = localStorage.getItem(qpCacheKey('qp_operateurs'));
    getStoredLineCatalogue();
    if (cat) CATALOGUE = sanitizeCatalogue(JSON.parse(cat));
    if (ops) OPERATEURS = mergeOperateursLists(JSON.parse(ops), OPERATEURS);
   // Aucun catalogue de démonstration en version client
if (!Object.keys(CATALOGUE).length) {
  CATALOGUE = {};
}
    if (!OPERATEURS.length) {
  OPERATEURS = [];
}
  } catch(e) {
    console.warn('loadCatalogueFromCache error:', e);
  }
}

/* ── Peupler le select clients ── */
function populateClientSelect() {
  const sel = document.getElementById('sel-client');
  if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">— Non spécifié —</option>';
  Object.keys(CATALOGUE).sort().forEach(nom => {
    if (nom === 'Non renseigné' || nom === 'Non spécifié') return;
    sel.innerHTML += `<option value="${escapeHtml(nom)}">${escapeHtml(nom)}</option>`;
  });
  if (val) sel.value = val;
  populateProduitSelect(sel.value || '');
}

/* ── Peupler les selects opérateurs (pesées + détecteur) ── */
function populateOpSelects() {
  ['sel-op', 'd-op'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const val = sel.value;
    sel.innerHTML = '<option value="">— Sélectionner un opérateur —</option>';
    OPERATEURS.forEach(op => {
      sel.innerHTML += `<option value="${op.nom}">${op.nom}</option>`;
    });
    if (val) sel.value = val;
  });
}

/* ── Initialisation catalogue au démarrage ── */
async function initCatalogue() {
  loadCatalogueFromCache();   // immédiat (offline-first)
  CATALOGUE = sanitizeCatalogue(CATALOGUE);
  populateClientSelect();
  populateOpSelects();
  populateLineSelect('inp-ligne');
  populateLineSelect('d-ligne');
  populateDetecteurSelect();
  if (navigator.onLine) {
    const ok = await loadCatalogueFromSupabase();
    if (ok) console.log('Catalogue chargé depuis Supabase');
  }
}

/* ADMIN V27 START : import Excel et fonctions Admin déplacés dans admin.js */

/* ================================================================
   SERVICE WORKER
   ================================================================ */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js?v=27-start')
    .then(() => console.log('SW enregistré v27-start'))
    .catch(e => console.warn('SW erreur', e));
}


function getPDFV2Perimeter(data) {
  const p = Array.isArray(data.p) ? data.p : [];
  const d = Array.isArray(data.d) ? data.d : [];
  const allLines = [...new Set([...p, ...d].map(x => (x && (x.ligne_prod || x.ligne) || '').trim()).filter(Boolean))];
  return {
    periodTitle: data.filtersText?.periode === 'Tout historique' ? 'Tout historique' : `Les ${String(data.filtersText?.periode || '7 jours').replace(' jours',' derniers jours')}`,
    site: allLines.length > 1 ? `Lignes de production ${allLines.join(' / ')}` : (allLines[0] || 'Site non renseigné'),
    client: data.filtersText?.client || 'Tous les clients',
    product: data.filtersText?.produit || 'Tous produits',
    line: allLines.length ? allLines.join(' / ') : 'Toutes lignes'
  };
}

async function refreshDashboard() {
  try {
    toast('Actualisation du dashboard...', 'ok');

    if (navigator.onLine && typeof syncPending === 'function') {
      await syncPending(true);
    }

    if (typeof loadFromDB === 'function') {
      await loadFromDB();
    }

    if (typeof populateDashFilters === 'function') {
      populateDashFilters();
    }

    if (typeof renderDashboard === 'function') {
      renderDashboard();
    }

    toast('Dashboard actualisé ✓', 'ok');
  } catch (e) {
    console.error('refreshDashboard error:', e);
    toast('Erreur actualisation dashboard', 'err');
  }
}

window.refreshDashboard = refreshDashboard;

  
