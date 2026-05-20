# QUALPACK V27.1 — START / SITE / DEMO

QUALPACK est une PWA (Progressive Web App) qualité industrielle destinée principalement aux PME agroalimentaires sans trieuse pondérale, permettant de réaliser des autocontrôles préemballés TU1/TU2, des contrôles détecteurs et une traçabilité terrain simple, rapide et audit-friendly.

---

# Positionnement produit

QUALPACK n’est pas :
- un MES lourd,
- un ERP,
- un logiciel de certification automatique,
- un système de supervision industrielle complexe.

QUALPACK est :
- un assistant qualité terrain,
- un outil de traçabilité,
- un outil d’autocontrôle interne,
- une solution simple et crédible pour PME agroalimentaires.

La décision finale concernant la conformité d’un lot reste sous la responsabilité du service Qualité du site.

---

# Architecture technique

- Frontend : GitHub Pages
- Backend : Supabase
- Stockage local : IndexedDB
- Synchronisation : Supabase REST
- PWA offline compatible
- Génération PDF locale
- Import / export Excel

---

# Modes disponibles

## 1. START SOLO

Mode simplifié destiné :
- aux petites structures,
- aux auditeurs freelance,
- aux démonstrations rapides terrain.

Fonctionnalités :
- création rapide produits / lignes / détecteurs,
- limitation mono-ligne,
- Dashboard Pro,
- rapports PDF,
- pesées,
- contrôles détecteurs.

La limitation commerciale est pilotée par :

```text
nb_lignes_autorisees
```

dans la table Supabase `sites`.

---

## 2. SITE

Mode destiné aux PME agroalimentaires multi-lignes.

Fonctionnalités :
- plusieurs lignes,
- plusieurs détecteurs,
- import Excel catalogue,
- Dashboard Pro,
- supervision qualité,
- rapports PDF,
- historique,
- synchronisation Supabase.

---

## 3. MODE DEMO TERRAIN

Mode réservé à CODEX EXPERTISE pour démonstration client rapide.

Objectif :
- démontrer QUALPACK directement sur smartphone ou tablette,
- créer rapidement un produit client,
- réaliser quelques pesées,
- montrer Dashboard + PDF,
- réinitialiser ensuite complètement la démo.

Le mode DEMO est sécurisé via :
- `site_id = qualpack_demo`
- `mode_demo = true`
- RPC Supabase sécurisée.

Le bouton :
```text
🔄 Réinitialiser la démo
```
n’est disponible que pour le site `qualpack_demo`.

---

# Sécurité

## Validation d’accès

L’accès site est validé via RPC Supabase :

```text
qualpack_validate_site_access()
```

Contrôles :
- site actif,
- date expiration,
- clé site,
- nombre lignes autorisées,
- mode démo.

---

## Cloisonnement multi-site

Chaque site possède :
- son `site_id`,
- sa licence,
- ses données,
- ses limites d’utilisation.

---

# Fonctionnalités principales

## Pesées préemballés
- TU1
- TU2
- TNE
- calcul moyenne nette
- tare fixe
- conformité échantillon

## Contrôles détecteurs
- validation détecteurs,
- historique contrôles,
- rapports PDF.

## Dashboard Pro
- KPI qualité,
- historique,
- supervision,
- indicateurs visuels,
- cockpit dark industriel.

## Rapports PDF
- rapport pesées,
- rapport Dashboard,
- rapports détecteurs.

## Excel
- import catalogue,
- export données,
- export pesées,
- export détecteurs.

---

# Structure actuelle

## Fichiers principaux

- `app.html`
- `admin.js`
- `sync.js`
- `db.js`
- `pdf-v2.js`
- `xlsx.full.min.js`

---

# Roadmap future (V28+)

Prévu plus tard :
- Auth utilisateurs Supabase,
- rôles utilisateurs,
- suppression clés visibles,
- refonte architecture fichiers,
- séparation modules core/admin/dashboard,
- landing page commerciale,
- onboarding amélioré.

QUALPACK ne vise pas à devenir un gros SaaS complexe.

L’objectif reste :
- simplicité,
- efficacité terrain,
- crédibilité audit,
- facilité de déploiement pour PME agroalimentaires.

---

# CODEX EXPERTISE

Développement :
CODEX EXPERTISE

Président :
Serge Crocilli

Spécialités :
- contrôle qualité industriel,
- pesage,
- détection,
- vision,
- optimisation chaînes agroalimentaires.
