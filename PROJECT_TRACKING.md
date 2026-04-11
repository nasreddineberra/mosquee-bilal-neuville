# 🕌 Mosquée Bilal - Suivi Détaillé du Projet

## 📋 Informations Générales
- **Nom du projet :** Mosquée Bilal Neuville
- **Type :** Site web moderne + CMS d'administration
- **Stack technique :** Next.js, React, Tailwind CSS, Supabase (PostgreSQL + Auth)
- **Date de démarrage :** 10 Avril 2026
- **Repository :** github.com/Nasr-Eddine/mosquee-bilal-neuville

---

## 🎯 Vision & Objectifs

### Vision
Créer une plateforme numérique moderne, apaisante et fonctionnelle pour la Mosquée Bilal. Le site doit servir de pont entre l'association et la communauté, tout en facilitant la gestion interne.

### Objectifs Principaux
1. **Informer** : Horaires de prière, actualités, événements
2. **Éduquer** : Documentation sur l'Islam
3. **Gérer** : Interface d'administration robuste (CMS maison)
4. **Sécuriser** : Architecture compatible Supabase (Auth + RLS)

---

## 📊 Avancement du Projet

### Phase 1 : Initialisation & Setup ✅
- [x] 10/04 - Création du repository GitHub
- [x] 10/04 - Initialisation Git local
- [x] 10/04 - Analyse du template Stitch (light mode & dark mode)
- [x] 10/04 - Analyse du PRD
- [x] 10/04 - Initialisation du projet Next.js
- [x] 10/04 - Configuration Tailwind CSS
- [ ] Configuration ESLint & Prettier
- [x] 10/04 - Architecture i18n (next-intl)
- [ ] Structure de base du projet

### Phase 2 : Design System 🚧
- [x] Configuration des couleurs Light Mode (Palette Sakinah UI Light)
- [x] Configuration des couleurs Dark Mode (Palette Saphir Ambre)
- [x] Création des variables CSS dans globals.css
- [x] Hook useTheme avec localStorage
- [x] Composant ThemeToggle
- [x] Intégration des polices (Noto Serif + Inter + Manrope)
- [x] Configuration next-intl (FR/AR)
- [x] Support RTL automatique
- [ ] Création des tokens Tailwind personnalisés
- [ ] Composants de base :
  - [ ] Buttons (Primary, Secondary, Ghost)
  - [ ] Cards (News, Activities, Stats)
  - [ ] Badges/Chips
  - [ ] Inputs & Forms
  - [ ] Modals
  - [ ] Tabs
  - [ ] Breadcrumbs
  - [ ] Navigation (Header + Footer)

### Phase 3 : Front-Office (Site Public) 📝
#### Page d'Accueil
- [x] Header avec navigation et logo
- [ ] Hero Section (bento grid avec image de fond)
- [ ] Widget Prochaine Prière (compte à rebours)
- [ ] Widget Mawaqit (iframe responsive)
- [ ] Section Statistiques rapides
- [ ] CTA Dons
- [ ] Section Dernières Actualités
- [ ] Footer complet

#### Pages Secondaires
- [ ] Page Actualités / Événements (liste filtrable)
- [ ] Page Activités communautaires
- [ ] Page Documentation Islam
- [ ] Page Infos pratiques
- [ ] Page Contact (formulaire + carte)

### Phase 4 : Back-Office (Administration) 🔐
- [ ] Page de connexion (Supabase Auth)
- [ ] Dashboard admin (statistiques, notifications)
- [ ] Gestion de contenu (CRUD articles, événements, pages)
- [ ] Médiathèque (upload images/documents)
- [ ] Paramètres (rôles, profil utilisateur)

### Phase 5 : Backend & Intégrations ⚙️
- [ ] Configuration Supabase
- [ ] Schéma de base de données PostgreSQL
- [ ] Row Level Security (RLS) policies
- [ ] Authentification (Admin, Éditeur, Lecteur)
- [ ] API Routes Next.js
- [ ] Intégration Mawaqit (widget prière)

### Phase 6 : Tests & Optimisations 🧪
- [ ] Tests responsives (mobile, tablet, desktop)
- [ ] Tests d'accessibilité (WCAG)
- [ ] Optimisation des performances (Lighthouse)
- [ ] Tests de navigation
- [ ] Corrections de bugs
- [ ] Documentation finale

---

## 🎨 Design System

### Light Mode - "The Living Sanctuary"
**Palette Saphir/Émeraude :**
- Primary: `#064E3B` (Émeraude profond)
- Secondary: `#FDFBF7` (Crème)
- Tertiary/Accent: `#B45309` (Or mat)
- Neutral: `#1E293B` (Ardoise)
- Background: `#f9f9ff`
- Surface: `#f9f9ff`
- On-Surface: `#111c2d`

**Typographie :**
- Headlines: Noto Serif
- Body: Inter

### Dark Mode - "The Celestial Sanctuary"
**Palette Saphir/Ambré :**
- Primary: `#BEC6E0` (Argent-bleu)
- Secondary: `#B9C7E0` (Ardoise muted)
- Tertiary/Amber: `#FFB95F` (Lumière sacrée)
- Background: `#0B1326` (Minuit profond)
- Surface: `#0B1326`
- On-Surface: tons clairs

**Typographie :**
- Headlines: Noto Serif
- Body: Manrope

### Règles de Design
1. **"No-Line" Rule** : Pas de bordures 1px pour sectionner. Utiliser les shifts de couleur de surface.
2. **Glassmorphism** : Éléments flottants avec backdrop-blur (12-20px)
3. **Intentional Asymmetry** : Marges asymétriques, éléments qui débordent
4. **Ambient Shadows** : Ombres douces, jamais de noir pur
5. **Ghost Borders** : Bordures à 15-20% d'opacité si nécessaires

---

## 🏗️ Architecture du Site

### Front-Office (Public)
```
/                           → Page d'accueil
/actualites                 → Actualités & Événements
/activites                  → Activités communautaires
/documentation              → Documentation sur l'Islam
/info-pratiques             → Infos pratiques
/contact                    → Contact
```

### Back-Office (Admin)
```
/admin                      → Dashboard
/admin/login                → Connexion
/admin/content              → Gestion de contenu
/admin/media                  → Médiathèque
/admin/settings             → Paramètres
```

---

## 📁 Structure du Projet

```
mosquee-bilal-neuville/
├── public/
│   ├── images/             # Images statiques
│   │   └── logos/          # Logos
│   └── fonts/              # Fonts locales (si nécessaire)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Routes publiques
│   │   │   ├── page.tsx    # Accueil
│   │   │   ├── actualites/
│   │   │   ├── activites/
│   │   │   ├── documentation/
│   │   │   ├── info-pratiques/
│   │   │   └── contact/
│   │   ├── (admin)/        # Routes admin
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx  # Dashboard
│   │   │   │   ├── login/
│   │   │   │   ├── content/
│   │   │   │   ├── media/
│   │   │   │   └── settings/
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Styles globaux
│   ├── components/
│   │   ├── ui/             # Composants de base
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── layout/         # Composants de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── features/       # Composants métier
│   │   │   ├── PrayerWidget.tsx
│   │   │   ├── MawaqitEmbed.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── DonationCTA.tsx
│   │   └── admin/          # Composants admin
│   │       ├── Dashboard.tsx
│   │       ├── ContentEditor.tsx
│   │       └── MediaLibrary.tsx
│   ├── lib/
│   │   ├── supabase/       # Configuration Supabase
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── utils/          # Fonctions utilitaires
│   │   └── constants/      # Constantes du projet
│   ├── hooks/              # Custom React hooks
│   ├── types/              # Types TypeScript
│   └── styles/             # Fichiers CSS additionnels
├── .env.local              # Variables d'environnement
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── PROJECT_TRACKING.md     # Ce fichier
```

---

## 🔧 Actions Réalisées

### 10 Avril 2026 - Initialisation
| Heure | Action | Détails | Statut |
|-------|--------|---------|--------|
| - | Création repository GitHub | `mosquee-bilal-neuville` | ✅ Fait |
| - | Git init local | Initialisation du repo | ✅ Fait |
| - | Premier commit | 19 fichiers (templates Stitch) | ✅ Fait |
| - | Push vers GitHub | Repository en ligne | ✅ Fait |
| - | Analyse templates | Light mode + Dark mode + PRD | ✅ Fait |
| - | Création fichier de suivi | PROJECT_TRACKING.md | ✅ Fait |

### 10 Avril 2026 - Configuration des couleurs
| Heure | Action | Détails | Statut |
|-------|--------|---------|--------|
| - | Sous-étape 2.1 | Configuration des couleurs Tailwind | ✅ Fait |
| - | Création globals.css | Variables CSS Light mode (Sakinah UI) | ✅ Fait |
| - | Création globals.css | Variables CSS Dark mode (Saphir Ambre) | ✅ Fait |
| - | tailwind.config.ts | Mapping des couleurs via CSS variables | ✅ Fait |
| - | Hook useTheme | Gestion du thème avec localStorage | ✅ Fait |
| - | Composant ThemeToggle | Bouton de bascule light/dark | ✅ Fait |

### 10 Avril 2026 - Architecture i18n
| Heure | Action | Détails | Statut |
|-------|--------|---------|--------|
| - | Sous-étape 1.4 | Installation de next-intl | ✅ Fait |
| - | Configuration i18n | locales.ts, request.mts, middleware.mts | ✅ Fait |
| - | Middleware | Détection automatique de la langue | ✅ Fait |
| - | Messages FR | Traductions françaises complètes | ✅ Fait |
| - | Messages AR | Traductions arabes complètes | ✅ Fait |
| - | Composant LocaleSwitcher | Sélecteur de langue | ✅ Fait |

### 10 Avril 2026 - Correction du routage
| Heure | Action | Détails | Statut |
|-------|--------|---------|--------|
| - | Sous-étape 2.4 | Correction définitive du routage 404 | ✅ Fait |
| - | Structure statique | Remplacement de [locale] par fr/ et ar/ | ✅ Fait |
| - | Suppression middleware | Cause des conflits de routage | ✅ Fait |
| - | Layouts dédiés | setRequestLocale pour chaque langue | ✅ Fait |
| - | Affichage validé | Site fonctionnel sur /fr | ✅ Fait |
| - | Commit & Push | Sauvegarde sur GitHub | ✅ Fait |

---

## 📝 Notes & Décisions

### Design
- **Approche mobile-first** : Priorité à l'expérience mobile
- **Dark mode natif** : Pas un afterthought, mais un design system complet
- **Glassmorphism** : Pour les éléments flottants (nav, modals)
- **Typography** : Noto Serif pour le spirituel, Inter/Manrope pour le fonctionnel

### Technique
- **Next.js App Router** : Dernière architecture
- **Server Components** : Maximum de server components
- **Supabase** : Backend as a Service avec RLS pour la sécurité
- **TypeScript** : Typage strict pour la maintenabilité
- **i18n (next-intl)** : Architecture complète FR/AR avec support RTL

### Internationalisation
- **Default locale** : Français (`/` ou `/fr`)
- **Locale arabe** : `/ar` avec support RTL automatique
- **Messages** : Fichiers JSON dans `i18n/messages/`
- **Middleware** : Détection automatique de la langue du navigateur
- **LocaleSwitcher** : Composant pour changer de langue manuellement

### À Définir
- [ ] Stratégie de déploiement (Vercel, Netlify ?)
- [ ] Nom de domaine
- [ ] Configuration Supabase (projet à créer)
- [ ] Images du site (photos de la mosquée ?)
- [ ] Contenu initial (articles, événements)
- [ ] **Reprise demain :** Implémentation du Header et du Design System visuel

---

## 🚀 Prochaines Étapes Immédiates

1. **Initialisation Next.js** : `npx create-next-app@latest`
2. **Configuration Tailwind** : Custom theme avec nos palettes
3. **Création du layout de base** : Header, Footer, Navigation
4. **Page d'accueil** : Hero, Prayer Widget, Mawaqit, News

---

## 📞 Ressources

### Templates de Référence
- Light Mode : `stitch_mosquee_bilal_neuville/accueil_version_moderne_horizontale/code.html`
- Dark Mode : `stitch_mosquee_bilal_neuville/saphir_ambre_dark_mode/DESIGN.md`
- Light Mode Design : `stitch_mosquee_bilal_neuville/sakinah_ui_light_mode/DESIGN.md`
- PRD : `stitch_mosquee_bilal_neuville/prd_mosqu_e_bilal.html`

### Liens Utiles
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Mawaqit Widget](https://mawaqit.net)

---

*Dernière mise à jour : 10 Avril 2026*
