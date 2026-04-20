# Mosquée Bilal - Fichier de Suivi du Projet

**Date de début :** 11 avril 2026
**Dernière mise à jour :** 21 avril 2026 (Session 12)
**Statut :** Phase 3 en cours (back-office)
**Architecture :** Next.js 16 + React 19 + Tailwind CSS 3.4 + TypeScript + Supabase

---

## Vue d'ensemble du Projet

### Vision
Créer une plateforme numérique moderne, apaisante et fonctionnelle pour la Mosquée Bilal. Le site sert de pont entre l'association et la communauté, tout en facilitant la gestion interne.

### Objectifs
- **Informer :** Horaires de prière, actualités, événements
- **Éduquer :** Documentation sur l'Islam
- **Gérer :** Interface d'administration robuste (CMS maison)
- **Sécuriser :** Architecture Supabase (Auth + RLS + TOTP 2FA)

---

## Sitemap

### Front-office (Public)
| Page | Route | Statut |
|------|-------|--------|
| Accueil | `/` | Finalisé |
| Actualités | `/actualites` | Finalisé |
| Activités | `/activites` | Finalisé |
| Documentation Islam | `/documentation` | Finalisé |
| Infos pratiques + Contact | `/infos` | Finalisé |
| Dons | `/don` | Finalisé |
| Certificat de conversion | `/certificat` | Finalisé |
| Mentions légales | `/mentions-legales` | Finalisé |
| Confidentialité (RGPD) | `/confidentialite` | Finalisé |

### Back-office (Admin)
| Page | Route | Statut |
|------|-------|--------|
| Connexion (email + mdp + 2FA) | `/admin` | Finalisé |
| Dashboard | `/admin/dashboard` | Finalisé |
| Articles (CRUD) | `/admin/dashboard/articles` | Finalisé |
| Communication | `/admin/dashboard/communication` | A faire |
| Activités | `/admin/dashboard/activites` | A faire |
| Dons | `/admin/dashboard/dons` | A faire |
| Gestion utilisateurs | `/admin/dashboard/utilisateurs` | A faire |
| Gestion visiteurs | `/admin/dashboard/visiteurs` | A faire |

---

## Design System

### Light Mode - "The Living Sanctuary" (Sakinah UI)
| Token | Couleur | Hex |
|-------|---------|-----|
| Primary | Emeraude profond | `#064E3B` |
| On Primary | Blanc | `#FFFFFF` |
| Secondary | Neutre chaud | `#5E5E5C` |
| Tertiary | Or mat | `#B45309` |
| Background | Blanc bleute | `#F9F9FF` |
| Surface Container Lowest | Blanc pur | `#FFFFFF` |
| On Surface | Gris ardoise | `#111C2D` |

### Dark Mode - "The Celestial Sanctuary" (Saphir et Ambre)
| Token | Couleur | Hex |
|-------|---------|-----|
| Primary | Bleu argent | `#BEC6E0` |
| Primary Container | Midnight | `#0F172A` |
| Tertiary (Ambre) | Ambre dore | `#FFB95F` |
| Background | Midnight profond | `#0B1326` |
| On Surface | Blanc cassis | `#F8FAFC` |

### Typographie
- **Titres :** Noto Serif
- **Corps :** Inter (light) / Manrope (dark)

### Classes CSS custom
- `.card-green` : gradient primary → primary-container (fond vert pour cards "a la une" et CTA)
- `.card-green-link` + `.card-green-btn` : hover outline ambre + bouton fleche
- `.card-border` : pseudo-element ::after pour bordure visible par-dessus images
- `.logo-invert` : logo en negatif en dark mode
- `.btn-admin-link` : bouton "Acces reserve" header avec effet ambre au hover

---

## Specifications Techniques

| Element | Technologie |
|---------|-------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 3.4 |
| Langage | TypeScript |
| Backend | Supabase (PostgreSQL + Auth + RLS + Storage) |
| Auth | Supabase Auth + TOTP MFA (Google Authenticator) |
| Widget priere | Iframe Mawaqit (mawaqit.net) |

---

## Base de Données Supabase

### Tables
| Table | Colonnes principales |
|-------|---------------------|
| `profiles` | id (= auth.users.id), email, role (enum: administrateur/editeur/visiteur), nom, prenom |
| `articles` | id, titre, summary, contenu, category (enum), actif, a_la_une, date_parution, date_expiration, position, image_id (FK images) |
| `images` | id, url, created_at, created_by (FK auth.users) |
| `messages` | id, expediteur_id, destinataire_id, sujet, contenu, lu |
| `activites_cours_tajwid` | id, titre, description, niveau, horaire, places_max, places_prises, actif, date_debut |
| `activites_ecole_arabe` | id, titre, description, niveau, horaire, places_max, places_prises, actif, date_debut |
| `activites_sorties` | id, titre, description, date_sortie, lieu, places_max, tarif, actif |
| `dons` | id, titre, texte, lien_externe, a_la_une, actif |
| `demandes_acces` | id, email, nom, prenom, message, statut (enum), traite_par, traite_at |

### RLS (Row Level Security)
- `articles` : lecture publique si `actif = true` ; ecriture par administrateur ou editeur
- `images` : lecture publique ; insert/delete admin uniquement
- `profiles` : chaque utilisateur voit son profil ; admins voient tout. Fonction `is_admin()` SECURITY DEFINER pour eviter la recursivite
- `messages` : lecture par expediteur, destinataire ou admins
- `activites_*` / `dons` : lecture publique si `actif = true` ; ecriture par administrateur

### Storage
- Bucket `articles` : public, policies RLS (upload/delete admin uniquement)
- Bibliotheque d'images reutilisables : table `images` + upload via modale admin
- Fallback par categorie : constante `CATEGORY_IMAGES` dans `src/lib/images.ts` si pas d'image custom

### Trigger
- `on_auth_user_created` → `handle_new_user()` SECURITY DEFINER : cree automatiquement un enregistrement dans `profiles` a la creation d'un utilisateur Supabase

---

## Authentification - Flow

```
Etape 1 : Email
  → inconnu → "Adresse email non reconnue."
  → connu   → Etape 2

Etape 2 : Mot de passe
  → incorrect → message d'erreur
  → correct   → Etape 3

Etape 3a (1ere connexion - MFA non configure)
  → Affichage QR code Google Authenticator a scanner
  → Champ code 6 chiffres pour confirmer l'enrolement
  → Acces dashboard

Etape 3b (connexions suivantes - MFA configure)
  → Champ code 6 chiffres Google Authenticator
  → Acces dashboard
```

APIs Supabase MFA TOTP :
- `mfa.enroll({ factorType: 'totp' })` → QR code SVG + secret
- `mfa.listFactors()` → detecte si 2FA deja configure
- `mfa.challenge({ factorId })` + `mfa.verify({ factorId, challengeId, code })`

---

## Menu Administration

```
Dashboard
Edition                          (administrateur + editeur)
  Articles
  Communication
Administration                   (administrateur uniquement)
  Activites
  Dons
  Gestion des utilisateurs
  Gestion des visiteurs
```

---

## Journal des Sessions

### Session 1 - 11 avril 2026 - Initialisation
1. Nettoyage projet precedent, configuration Tailwind CSS 3.4 (downgrade depuis v4)
2. Composants de base : Header, Footer, ThemeToggle, ThemeProvider
3. Tokens de couleur CSS dans `tailwind.config.js`
4. Pages de navigation initiales : `/actualites`, `/activites`, `/documentation`, `/infos`
5. Widget Mawaqit (iframe), HeroSection bento grid
6. Dashboard admin initial (mode demo) avec faux CRUD hadiths

### Session 2 - 11 avril 2026 - Corrections UI
1. Logo 64px (header) et 128px (admin login), `.logo-invert` dark mode
2. Header : suppression champ recherche, slogan masque sous lg
3. Page Infos : transport TCL avec lignes bus colorees, Google Maps integre
4. Icone localisation MawaqitWidget → lien `/infos`
5. Formulaire contact (page Infos) : style card-green

### Sessions 3-4 - 13-14 avril 2026 - Actualites et Documentation
1. Page Actualites : 2 articles "a la une" en 1/2 largeur (card-green), grille 4 colonnes
2. Classe `.card-border` pour bordure visible par-dessus images
3. Page Documentation Islam : 8 cards, 45 topics avec contenus detailles en francais
4. Rendu texte enrichi : `**gras**` parse en `<strong>`
5. Réécriture complète des textes avec ton accessible et pedagogique
6. Titre page : "C'est quoi l'Islam ?"

### Sessions 5-6 - 15-16 avril 2026 - Front-office complet
**Session 7 :**
1. Page `/certificat` creee (4 sections + CTA card-green)
2. Page accueil restructuree : Cours+Islam | Certificat | Contact+Assurances
3. Chevrons uniformes w-6/h-6 avec hover primary sur toutes les cards
4. 3e card actualite sur la page d'accueil

**Session 8 :**
1. Page `/don` creee : Pourquoi donner + Plateformes + Projets + CTA
2. Composants FloatField centralises : FloatInput, FloatTextarea, FloatSelect
3. Transforms de saisie : capitalize, uppercase, lowercase, phone
4. Formulaires Contact et Aide Sociale migres vers FloatField
5. Page Admin Login : suppression mode demo, ajout modal demande d'acces visiteur

**Session 9 :**
1. Effet hover card-green : `.card-green-link` + `.card-green-btn` (outline ambre + fleche)
2. Bouton "Acces reserve" (header) : `.btn-admin-link` avec effet ambre
3. Icones mises a jour (lucide-react) sur toutes les pages
4. Numeros reels : tel 04 78 49 85 22, adresse 10 Avenue Auguste Wissel 69250 Neuville-sur-Saone
5. Pages `/mentions-legales` et `/confidentialite` creees
6. Footer : copyright "© 2026 Association ACM - Mosquee Bilal"

### Session 10 - 19-20 avril 2026 - Back-office complet (Phase 3 debut)

**Infrastructure Supabase :**
1. `.env.local` : credentials Supabase (non commite)
2. `src/lib/supabase/client.ts` : client navigateur (`createBrowserClient`)
3. `src/lib/supabase/server.ts` : client serveur + client admin (service role)
4. `supabase/schema.sql` : 8 tables, enums, RLS, trigger `on_auth_user_created`
5. Bucket Storage `articles` cree
6. Correction RLS : fonction `is_admin()` SECURITY DEFINER pour eviter recursivite
7. Trigger reecrit avec `ON CONFLICT DO NOTHING` + `EXCEPTION WHEN OTHERS THEN RETURN NEW`

**Authentification :**
1. `src/app/api/auth/check-email/route.ts` : verifie si email existe en DB
2. `src/app/api/auth/callback/route.ts` : echange code Supabase contre session
3. `src/app/admin/page.tsx` : login 4 etapes (email → mdp → enrol QR → verification TOTP)
4. `middleware.ts` : protection `/admin/*`, redirect selon role
5. `src/context/AuthContext.tsx` : remplace mock par Supabase Auth reel

**Layout Admin :**
1. `src/app/admin/dashboard/layout.tsx` : sidebar fixe w-64, menu hierarchique avec sections pliables
2. Flag `adminOnly` sur section Administration
3. Profil utilisateur (nom + role) en bas de sidebar
4. Titre onglet : "Administration - Mosquee Bilal"

**CRUD Articles :**
1. `src/app/admin/dashboard/articles/page.tsx` : liste, creation, edition, suppression
2. Composant `Toggle` avec prop `light` pour visibilite sur fond card-green
3. Limite 2 articles "a la une" simultanement (uneCount exclu l'article en edition)
4. Lignes "a la une" stylisees en card-green avec icones et texte blancs
5. Bouton Apercu (ScanEye) : ouvre ArticleModal avec les donnees du formulaire en cours
6. Transforms : titre en MAJUSCULES, resume avec majuscule debut de phrase
7. Suppression avec modal de confirmation

**Liaisons public :**
1. `src/app/actualites/page.tsx` : donnees depuis Supabase (remplace tableau statique)
2. Correction : message "Aucun article" masque si des articles "a la une" sont presents
3. `src/components/HeroSection.tsx` : 3 derniers articles actifs depuis Supabase, modale article
4. `src/components/ArticleModal.tsx` : id change de `number` en `string` (UUID), hauteur image reduite

**Composants FloatField (ajouts) :**
1. Transform `upperall` : tout en majuscules sans filtrage des caracteres
2. Transform `sentence` : majuscule au debut de chaque phrase
3. `FloatTextarea` : accept maintenant la prop `transform`

### Session 11 - 20 avril 2026 - Bibliotheque d'images + UX articles

**Bibliotheque d'images reutilisables :**
1. Table `images` creee (id, url, created_at, created_by) + RLS (lecture publique, insert/delete admin)
2. Colonne `image_id` (FK `images`) ajoutee sur `articles`
3. `src/lib/images.ts` : helper `getArticleImage` (image custom ou fallback categorie) + `optimizeImage` (canvas client-side, redimension max 1200px, WebP qualite 85%, max 1 Mo)
4. Composant `src/components/ImagePicker.tsx` : modale grille thumbnails, upload avec optimisation, suppression depuis bibliotheque
5. Integration modale admin article : bouton "Choisir une image" + "Retirer" + apercu
6. `next.config.mjs` : hostname `ugbkbsorcrmnhfplprkb.supabase.co` ajoute aux remotePatterns
7. Policies Storage bucket `articles` : public en lecture, upload/delete admin via `is_admin()`

**Reordonnancement articles (admin) :**
1. Chevrons Up/Down en debut de ligne sur `/admin/dashboard/articles`
2. Actifs uniquement (inactifs non reordonnables)
3. 2 groupes separes : "a la une" et "autres actifs" (les a la une restent toujours en haut)
4. `handleMove` : ecrit `position = 0,1,2...` sur tout le groupe concerne (batch Promise.all)
5. Tri `a_la_une DESC, actif DESC, position ASC, date_parution DESC` applique sur admin, `/actualites` et `HeroSection`

**Refonte card "Dernieres actualites" (accueil) :**
1. Hauteur contrainte a 188px (= 560 Mawaqit - 360 Hero - 12 gap) en desktop
2. Image passee en haut de sub-card (h-1/4), texte sur 3/4 en dessous
3. Header sub-card : categorie a gauche + date a droite (meme couleur `text-tertiary`)
4. Titre en `line-clamp-3`, resume en `line-clamp-2`
5. Tri `a_la_une DESC` ajoute sur la requete HeroSection (respect de l'ordre admin)

**Autres corrections :**
1. `ArticleModal` : `whitespace-pre-line` sur les paragraphes pour preserver les sauts de ligne simples
2. Favicon : `src/app/icon.png` (convention Next.js App Router, genere automatiquement les balises)
3. Titre onglet admin : `useEffect` deps `[] → [pathname]` pour re-appliquer a chaque navigation
4. SQL seed fourni a l'utilisateur : 5 articles demo (nouveau site, pre-inscriptions ecole, stationnement, conferences dimanche, fete fin d'annee)

### Session 12 - 21 avril 2026 - Corrections UX articles et filtres

**Filtres page /actualites :**
1. Correction : filtre categorie s'applique desormais aussi aux articles "a la une" (avant seuls les articles normaux etaient filtres)
2. Simplification logique : `featuredArticles` et `otherArticles` filtres en meme temps selon `activeCategory`
3. Condition message "aucun article" simplifiee (`!showFeatured && filteredArticles.length === 0`)

**Formulaire admin articles :**
1. Champ resume : FloatTextarea remplace par FloatInput (1 ligne, pas de retour chariot possible)
2. Limite 70 caracteres sur le resume (`maxLength={70}`, label mis a jour)
3. `FloatField.tsx` : ajout prop `maxLength` sur `FloatInput`

**Titre onglet admin :**
1. `useEffect` ajout sur `/admin/page.tsx` (login) - titre defini des la page de connexion
2. Couverture complete : `/admin` (login) + tout `/admin/dashboard/*`

**ImagePicker :**
1. Images bibliotheque : hauteur reduite de `aspect-video` a `h-20` (80px fixe)

---

## Ordre d'implementation Phase 3

- [x] 3.1 Config Supabase - tables SQL + RLS + bucket Storage
- [x] 3.2 Auth / Login - email-first + 2FA Google Authenticator (TOTP)
- [x] 3.3 Middleware - protection routes `/admin/*`
- [x] 3.4 Layout admin - sidebar menu hierarchique (Dashboard, Edition, Administration)
- [x] 3.5 Admin Articles - CRUD complet + liaison page `/actualites`
- [ ] 3.6 Admin Utilisateurs - validation demandes d'acces + gestion roles
- [ ] 3.7 Admin Communication - messagerie visiteurs
- [ ] 3.8 Admin Activites - Cours+Tajwid, Ecole Arabe, Sorties
- [ ] 3.9 Admin Dons - CRUD + lien externe
- [ ] 3.10 Edge Function - cron expiration articles (actif = false si date_expiration < today)

---

## Notes et Decisions

- **Tailwind CSS :** v3.4 (downgrade depuis v4, incompatible avec chemin contenant `#`)
- **Images articles :** bibliotheque reutilisable (table `images`) + fallback par categorie (`CATEGORY_IMAGES` dans `src/lib/images.ts`)
- **Optimisation images :** client-side avant upload (canvas, WebP 85%, max 1200px, max 1 Mo)
- **Ratio recommande uploads :** 16:9 (1200x675) - sujet centre pour survivre aux recadrages
- **Tirets :** Toujours tiret standard (-), jamais tiret cadratin
- **Commits :** En fin de journee uniquement
- **Sous-etapes :** Chaque sous-etape validee par l'utilisateur avant developpement
- **Turbopack :** bloque par politique WDAC d'entreprise (evenement 3033, signature non "Enterprise") - fallback webpack si necessaire

## Commandes utiles

```bash
npm run dev      # Serveur de developpement
npm run build    # Build production
npm run start    # Lancer en production
```

**URL locale :** http://localhost:3000
**Supabase project :** https://ugbkbsorcrmnhfplprkb.supabase.co
