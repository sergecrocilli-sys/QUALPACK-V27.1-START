# QUALPACK V27.1 START

QUALPACK est une PWA (Progressive Web App) qualité industrielle destinée principalement aux PME agroalimentaires et semi-industrielles qui doivent réaliser des autocontrôles de poids sur préemballés, sans forcément disposer d’une trieuse pondérale.

L’objectif est simple : aider le terrain à saisir, tracer, contrôler et exporter les autocontrôles qualité de manière claire, rapide et audit-friendly.

---

## Positionnement produit

QUALPACK est :

- un assistant qualité terrain ;
- un outil d’autocontrôle interne ;
- un outil de traçabilité ;
- une aide à la préparation des audits ;
- une solution simple pour PME agroalimentaires.

QUALPACK n’est pas :

- un ERP ;
- un MES lourd ;
- un logiciel de certification réglementaire ;
- un système de supervision industrielle complexe ;
- un outil qui garantit automatiquement la conformité d’un lot.

La décision finale concernant le lot appartient toujours au service Qualité du site.

---

## Modes disponibles

### 1. START SOLO

Mode simplifié destiné aux petites structures, aux sites mono-ligne ou aux démonstrations terrain rapides.

Fonctionnalités principales :

- création rapide des produits, lignes et détecteurs ;
- saisie des pesées brutes ;
- calcul automatique du poids net avec tare fixe ;
- aide à l’analyse TU1 / TU2 / TNE ;
- ajout progressif de pesées par pas de +5 sans perte des saisies déjà réalisées ;
- contrôle détecteur de métaux ;
- historique ;
- Dashboard Pro ;
- exports PDF et Excel.

La limitation commerciale peut être pilotée via la donnée :

```text
nb_lignes_autorisees
```

dans la table Supabase `sites`.

---

### 2. SITE

Mode destiné aux PME agroalimentaires multi-lignes.

Fonctionnalités principales :

- plusieurs lignes de production ;
- plusieurs détecteurs ;
- import catalogue via Excel ;
- supervision qualité ;
- Dashboard Pro ;
- historique des contrôles ;
- rapports PDF ;
- exports Excel ;
- synchronisation Supabase.

---

### 3. Mode démonstration terrain

Mode réservé à CODEX EXPERTISE pour les démonstrations client.

Objectifs :

- ouvrir rapidement QUALPACK sur smartphone, tablette ou PC ;
- créer ou utiliser des données de démonstration ;
- réaliser un contrôle de pesées ;
- montrer les résultats, l’historique, le Dashboard Pro et les exports ;
- réinitialiser la démo après présentation.

Le mode démonstration utilise :

```text
site_id = qualpack_demo
mode_demo = true
```

Le bouton :

```text
Réinitialiser la démo
```

est réservé au site de démonstration.

---

## Fonctionnalités principales

### Pesées préemballés

- saisie des poids bruts ;
- déduction de la tare fixe ;
- calcul des poids nets ;
- moyenne nette ;
- seuils TU1 / TU2 ;
- TNE ;
- verdict indicatif d’autocontrôle ;
- ajout de pesées supplémentaires par bouton +5 avant calcul final.

### Sécurité de saisie opérateur

- aide visuelle pendant la saisie ;
- mise en évidence des valeurs inhabituelles ;
- conservation des pesées déjà saisies lors de l’ajout de lignes supplémentaires.

### Contrôles détecteurs

- contrôle des détecteurs associés ;
- historique des tests ;
- rapports PDF.

### Dashboard Pro

- KPI qualité ;
- conformité ;
- non-conformités ;
- suivi des défauts ;
- historique ;
- cockpit qualité dark industriel.

### Exports

- PDF pesées ;
- PDF détecteurs ;
- export Excel ;
- rapports utilisables pour le suivi qualité et les audits.

---

## Architecture technique actuelle

- Frontend : GitHub Pages
- Backend : Supabase
- Stockage local : IndexedDB
- Synchronisation : Supabase REST
- PWA compatible smartphone / tablette / PC
- Fonctionnement terrain avec logique locale
- Génération PDF locale
- Import / export Excel

---

## Fichiers principaux

Version actuelle volontairement simple, sans refonte lourde :

```text
index.html
demo.html
app.html
admin.js
db.js
sync.js
pdf-v2.js
sw.js
manifest.json
manifest-demo.json
xlsx.full.min.js
jspdf.umd.min.js
```

Certains fichiers historiques ou de travail peuvent encore être présents dans la racine. Le nettoyage complet de l’architecture est prévu plus tard afin de ne pas casser la version déployée.

---

## Sécurité et accès

L’accès site repose sur une validation Supabase, notamment :

```text
qualpack_validate_site_access()
```

Contrôles prévus ou utilisés selon le mode :

- site actif ;
- clé site ;
- date d’expiration ;
- nombre de lignes autorisées ;
- mode démonstration ;
- cloisonnement par `site_id`.

Chaque site dispose de ses propres données et de ses propres limites d’utilisation.

---

## Limites volontaires de la V27.1 START

Cette version reste volontairement simple.

Ne sont pas encore inclus :

- authentification utilisateur avancée ;
- rôles détaillés opérateur / responsable qualité / administrateur ;
- paiement en ligne ;
- facturation automatique ;
- workflows SaaS complets ;
- refonte complète de l’architecture fichiers.

Ces éléments sont prévus pour une étape ultérieure si le besoin terrain le justifie.

---

## Roadmap future V28+

Pistes conservées pour plus tard :

- nettoyage final de la racine GitHub ;
- extraction du CSS de `app.html` vers un fichier `style.css` ;
- séparation progressive des modules JavaScript ;
- meilleure organisation `/assets`, `/css`, `/js`, `/utils`, `/vendor` ;
- authentification Supabase utilisateurs ;
- rôles et droits d’accès ;
- domaine QUALPACK dédié ;
- landing page commerciale ;
- vidéo courte de démonstration ;
- packaging commercial START / SITE.

QUALPACK doit rester simple, crédible et utile au terrain.

---

## CODEX EXPERTISE

Développement : CODEX EXPERTISE  
Président : Serge Crocilli

Domaines d’expertise :

- contrôle qualité industriel ;
- pesage ;
- détection ;
- vision industrielle ;
- optimisation de chaînes de production agroalimentaires.
