# 🕌 Mosquée Bilal - Fichier de Suivi du Projet

**Date de début :** 11 avril 2026
**Statut :** En cours
**Architecture :** Next.js 16 + React 19 + Tailwind CSS 3 + TypeScript

---

## 📋 Vue d'ensemble du Projet

### Vision
Créer une plateforme numérique moderne, apaisante et fonctionnelle pour la Mosquée Bilal. Le site sert de pont entre l'association et la communauté, tout en facilitant la gestion interne.

### Objectifs
- **Informer :** Horaires de prière, actualités, événements
- **Éduquer :** Documentation sur l'Islam
- **Gérer :** Interface d'administration robuste (CMS maison)
- **Sécuriser :** Architecture compatible Supabase (Auth + RLS)

### Architecture du Site (Sitemap)

#### Front-office (Public)
| Page | Description |
|------|-------------|
| Accueil | Hero section, Widget Mawaqit, Dernières actus, CTA Dons/Activités |
| Actualités / Événements | Liste filtrable des news et agenda |
| Activités communautaires | Cours, sorties, services sociaux |
| Documentation sur l'Islam | Articles pédagogiques, FAQ |
| Infos pratiques | Accès, horaires, services (obsèques, assurances) |
| Contact | Formulaire et plan |

#### Back-office (Admin)
| Page | Description |
|------|-------------|
| Connexion | Interface sécurisée (Supabase Auth) |
| Dashboard | Statistiques rapides, notifications de messages |
| Gestion de contenu | Liste/Édition des articles, événements, pages |
| Médiathèque | Gestion des images et documents |
| Paramètres | Rôles (Admin, Éditeur, Lecteur), Profil |

---

## 🎨 Design System

### Light Mode - "The Living Sanctuary" (Sakinah UI)
| Token | Couleur | Hex |
|-------|---------|-----|
| Primary | Émeraude profond | `#064E3B` |
| On Primary | Blanc | `#FFFFFF` |
| Primary Container | Émeraude foncé | `#064E3B` |
| Primary Fixed | Menthe clair | `#B0F0D6` |
| Primary Fixed Dim | Menthe dim | `#95D3BA` |
| Secondary | Neutre chaud | `#5E5E5C` |
| Secondary Container | Sable clair | `#E1DFDC` |
| Tertiary | Or mat | `#B45309` |
| Tertiary Container | Brun | `#733100` |
| Tertiary Fixed | Pêche | `#FFDBCA` |
| Tertiary Fixed Dim | Abricot | `#FFB68E` |
| Background | Blanc bleuté | `#F9F9FF` |
| Surface | Blanc bleuté | `#F9F9FF` |
| Surface Container Lowest | Blanc pur | `#FFFFFF` |
| Surface Container Low | Bleu très clair | `#F0F3FF` |
| Surface Container | Bleu clair | `#E7EEFF` |
| Surface Container High | Bleu dim | `#DEE8FF` |
| Surface Container Highest | Bleu dim+ | `#D8E3FB` |
| On Surface | Gris ardoise | `#111C2D` |
| On Surface Variant | Vert gris | `#404944` |
| Outline | Gris vert | `#707974` |
| Outline Variant | Gris bleuté | `#BFC9C3` |

### Dark Mode - "The Celestial Sanctuary" (Saphir & Ambre)
| Token | Couleur | Hex |
|-------|---------|-----|
| Primary | Bleu argent | `#BEC6E0` |
| Primary Container | Midnight | `#0F172A` |
| Tertiary (Ambre) | Ambre doré | `#FFB95F` |
| Background | Midnight profond | `#0B1326` |
| Surface | Midnight | `#0F172A` |
| Surface Container Low | Bleu nuit | `#131B2E` |
| Surface Container High | Ardoise foncé | `#222A3D` |
| Surface Container Highest | Ardoise | `#2D3449` |
| Surface Bright | Ardoise clair | `#31394D` |
| Surface Variant | Ardoise transparent | `rgba(30,41,59,0.5)` |
| On Surface | Blanc cassis | `#F8FAFC` |
| On Surface Variant | Ardoise moyen | `#94A3B8` |
| Outline | Ardoise foncé | `#475569` |
| Outline Variant | Gris foncé | `#45464D` |

### Typographie
- **Titres (Spiritual/Editorial) :** Noto Serif
- **Corps (Fonctionnel) :** Inter (light mode) / Manrope (dark mode)

### Principes de Design
- **"No-Line Rule" :** Pas de bordures 1px solid pour sectionner. Utiliser les changements de couleur de surface.
- **Glassmorphism :** Surface à 60-80% opacité + backdrop-blur 12-20px
- **Élévation tonale :** Hiérarchie par les surfaces empilées, pas par les ombres
- **Ghost Border :** Outline variant à 15-20% opacité si bordure nécessaire
- **Grille asymétrique :** Marges asymétriques, éléments qui débordent

---

## � Spécifications Techniques

| Élément | Technologie |
|---------|-------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Langage | TypeScript |
| Backend (futur) | Supabase (PostgreSQL + Auth + RLS) |
| Intégrations | Iframe Mawaqit (horaires de prière) |
| Accessibilité | Contrastes élevés, navigation clavier, mobile-first |

---

## 🔍 Journal des Actions Détaillé

### PHASE 1 : Initialisation du Projet

#### ✅ Sous-étape 1.1 : Nettoyage et configuration de base
**Date :** 11 avril 2026
**Statut :** ✅ Terminée

**Actions menées :**
1. ✅ Suppression de tous les fichiers du projet précédent (`src/`, `.next/`, `middleware.ts.disabled`)
2. ✅ Arrêt des processus Node.js en cours
3. ✅ Installation de `@tailwindcss/postcss` (dépendance requise pour Tailwind CSS v4)
4. ✅ Mise à jour de `postcss.config.js` : remplacement de `tailwindcss` par `@tailwindcss/postcss`
5. ✅ Mise à jour de `src/app/globals.css` : remplacement de `@tailwind` par `@import "tailwindcss"` (syntaxe v4)

#### ✅ Sous-étape 1.3 : Créer les composants UI de base (Header, Footer, ThemeToggle)
**Date :** 11 avril 2026
**Statut :** ✅ Terminée

**Actions menées :**
1. ✅ Création de `ThemeToggle.tsx` — Bouton toggle clair/sombre avec icônes soleil/lune
2. ✅ Création de `Header.tsx` — Navigation responsive avec logo, liens, recherche, bouton connexion, menu mobile
3. ✅ Création de `Footer.tsx` — Navigation, infos, liens légaux, copyright
4. ✅ Intégration du Header et Footer dans `layout.tsx`
5. ✅ Copie du logo dans `/public/logo.png`
6. ✅ Correction du bug Tailwind v4 → downgrade vers Tailwind CSS v3.4 (compatible chemin avec `#`)
7. ✅ Configuration `tailwind.config.js` avec tous les tokens de couleur CSS custom
8. ✅ Serveur fonctionnel — HTTP 200 sur http://localhost:3000

**Prochaines étapes :**
- [ ] Phase 2 : Connexion Supabase réelle + Base de données
- [ ] Phase 3 : CRUD Actualités/Événements avec Supabase
- [ ] Phase 4 : Médiathèque upload + Rôles utilisateurs

#### ✅ Sous-étape 1.7 : Page Admin - Connexion + Dashboard
**Date :** 11 avril 2026
**Statut :** ✅ Terminée

**Actions menées :**
1. ✅ Création de `AuthContext.tsx` — Contexte d'authentification simulée
2. ✅ Intégration de `AuthProvider` dans `layout.tsx`
3. ✅ Création de `/admin` — Page de connexion avec formulaire (email + mot de passe)
4. ✅ Mode démo : n'importe quel email/mot de passe fonctionne
5. ✅ Création de `/admin/dashboard` — Dashboard complet avec :
   - Stats : 148 articles, 7 événements, 2 481 abonnés
   - Tableau de contenu récent avec statuts (Publié/Brouillon)
   - Rappels admin avec checkboxes
6. ✅ Layout admin avec navigation : Dashboard, Actualités, Événements, Médiathèque, Paramètres
7. ✅ Profil utilisateur + bouton déconnexion
8. ✅ Sous-pages : `/news`, `/events`, `/media`, `/settings` (placeholders)
9. ✅ Toutes les pages admin répondent en HTTP 200

#### ✅ Sous-étape 1.6 : Créer les pages de navigation
**Date :** 11 avril 2026
**Statut :** ✅ Terminée

**Actions menées :**
1. ✅ Création de `/actualites` — Grille de 6 cartes d'actualités placeholder
2. ✅ Création de `/activites` — 4 activités : Tajwid, Arabe, Sorties, Aide Sociale
3. ✅ Création de `/documentation` — 6 catégories : 5 Piliers, Coran, Sira, Hadith, Prière, FAQ
4. ✅ Création de `/infos` — Horaires d'ouverture, Accès, Services (Obsèques, Conseil, Salle)
5. ✅ Création de `/contact` — Formulaire + coordonnées + placeholder carte
6. ✅ Toutes les pages répondent en HTTP 200

#### ✅ Sous-étape 1.5 : Page d'accueil - Widget Mawaqit + Section Actualités
**Date :** 11 avril 2026
**Statut :** ✅ Terminée

**Actions menées :**
1. ✅ Création de `MawaqitWidget.tsx` — Iframe responsive des horaires de prière (mawaqit.net)
2. ✅ Création de `NewsSection.tsx` — 3 cartes d'actualités avec images, badges catégorie, dates, titres
3. ✅ Création de `QuickLinks.tsx` — Liens rapides Cours & Activités, Contact
4. ✅ Intégration dans `page.tsx` : Hero → Mawaqit → QuickLinks → Actualités

#### ✅ Sous-étape 1.4 : Page d'accueil - Hero Section
**Date :** 11 avril 2026
**Statut :** ✅ Terminée

**Actions menées :**
1. ✅ Création de `HeroSection.tsx` — Bento grid avec image hero + carte prochaine prière
2. ✅ Titre : "Mosquée Bilal" / Sous-titre : "Neuville-sur-Saône"
3. ✅ Countdown dynamique vers la prochaine prière (mise à jour toutes les minutes)
4. ✅ Quick Stats : Annonces, Conférence, Communauté, CTA Don
5. ✅ Design fidèle au template Stitch (arrondi 2.5rem, glassmorphism, gradients)
6. ✅ Mise à jour de `page.tsx` pour intégrer le Hero

---

### PHASE 2 : Front-office (À venir)
- [ ] Sous-étape 2.1 : Page d'accueil - Header/Navigation
- [ ] Sous-étape 2.2 : Page d'accueil - Hero Section
- [ ] Sous-étape 2.3 : Page d'accueil - Widget Mawaqit
- [ ] Sous-étape 2.4 : Page d'accueil - Section Actualités
- [ ] Sous-étape 2.5 : Page d'accueil - Footer
- [ ] Sous-étape 2.6 : Page Actualités
- [ ] Sous-étape 2.7 : Page Activités
- [ ] Sous-étape 2.8 : Page Documentation Islam
- [ ] Sous-étape 2.9 : Page Infos pratiques
- [ ] Sous-étape 2.10 : Page Contact

### PHASE 3 : Back-office / Admin (À venir)
- [ ] Sous-étape 3.1 : Page de connexion admin
- [ ] Sous-étape 3.2 : Dashboard admin
- [ ] Sous-étape 3.3 : Gestion de contenu (CRUD articles)
- [ ] Sous-étape 3.4 : Gestion des événements
- [ ] Sous-étape 3.5 : Médiathèque
- [ ] Sous-étape 3.6 : Paramètres

### PHASE 4 : Backend Supabase (Futur)
- [ ] Configuration Supabase
- [ ] Authentification
- [ ] Base de données + RLS
- [ ] API Routes Next.js

---

## � Notes et Décisions

- **Thème par défaut :** Light mode (Sakinah UI). Le choix de l'utilisateur est sauvegardé pour ses prochaines visites.
- **Palette Light Mode :** Dossier `sakinah_ui_light_mode/DESIGN.md`
- **Palette Dark Mode :** Dossier `saphir_ambre_dark_mode/DESIGN.md`
- **Template de référence :** Dossier `stitch_mosquee_bilal_neuville/`
- **Logo :** `images/logos/New-Bilal-Logo.png`

---

## 🚀 Commandes utiles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire pour la production
npm run start    # Lancer en production
```

**URL locale :** http://localhost:3000
