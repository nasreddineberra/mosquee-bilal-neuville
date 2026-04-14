# Audit du Projet — Mosquée Bilal
**Date de dernière mise à jour :** 14 avril 2026 (Session 6)
**Branche :** main
**Auditeur :** Claude Code (Opus 4.6)

---

## Résumé Exécutif

Le projet est en **Phase 2 avancée**. La page d'accueil est finalisée. Les pages Actualités et Documentation Islam sont complètes. Il reste à créer la page Don, connecter le formulaire de contact, et démarrer l'intégration Supabase.

| Domaine | Statut | Score |
|---------|--------|-------|
| Structure & Config | ✅ Solide | 9/10 |
| Front-office (UI) | 🟡 Avancé | 8/10 |
| Back-office (Admin) | 🟡 Partiel | 4/10 |
| Backend / Data | ❌ Simulé | 1/10 |
| Accessibilité | 🟡 Partiel | 5/10 |
| Performance | 🟡 À évaluer | -/10 |

---

## Journal des Sessions

### Session 6 — 14 avril 2026

#### Page Documentation Islam — Réécriture complète des textes
- [x] **45 topics réécrits** sur 8 cards avec un ton ludique, empathique et pédagogique
- [x] **Card 1** : Les fondements de l'Islam (6 topics) — Shahada, Salat, Zakat, Siyam, Hajj, Piliers de la foi
- [x] **Card 2** : Le Coran (5 topics) — Qu'est-ce que le Coran, Révélation, Tajwid, Structure, Thèmes
- [x] **Card 3** : La Sira (5 topics) — Naissance, Révélation, Hégire, Médine, L'adieu du Prophète
- [x] **Card 4** : Les Hadiths (4 topics) — Qu'est-ce qu'un hadith, Grands recueils + 40 hadiths Nawawi, Hadith de Djibril (Gabriel)
- [x] **Card 5** : La Prière (4 topics) — Conditions, Ablutions (étapes espacées), Étapes + rak'at par prière + Chaf' & Witr, Joumou'a
- [x] **Card 6** : Le Jeûne (4 topics) — Piliers/conditions, Ramadan + Zakat al-Fitr, Laylat al-Qadr, Jeûnes hors Ramadan
- [x] **Card 7** : Quelques Prophètes (12 topics détaillés) — Adam, Nouh, Ibrahim, Ismaïl, Ishaq, Yacoub, Youssouf, Moussa, Dawud, Sulayman, Younus, 'Issa
- [x] **Card 8** : FAQ (5 topics) — Conversion, Halal, Apprendre à prier (Mawaqit), Islam en Occident (Darifton Prod), Apprendre l'arabe

#### Modifications complémentaires
- [x] **Titre page** changé : "C'est quoi l'Islam ?" avec icône MessageSquareHeart
- [x] **Sous-titre Card 4** : "Paroles, actes et approbations du Prophète ﷺ"
- [x] **Nouvelles images** : Card La Sira (calligraphie Muhammad), Card La Prière (homme priant), Card Le Jeûne (lanterne), Card FAQ (bokeh doré)
- [x] **Remplacement systématique** de tous les "—" par "-"
- [x] **Formulaire contact** (page Infos) : header en card-green style AideSocialeModal

**Commit :** `40346d9` — pushé sur GitHub

---

### Session 5 — 13 avril 2026

#### Page Actualités — Refonte des cards grille
- [x] **2 articles à la une** : layout 2 × 1/2, style `card-green`, photo 1/3 + texte 2/3
- [x] **Hauteurs réduites** d'1/3 : `h-[120px]` (featured) / `h-[96px]` (grille)
- [x] **Gap image résolu** : remplacement `<button>` par `<div>` + `cursor-pointer` + `background-image` CSS inline
- [x] **ArticleModal** : ajout `imagePosition?: string` et `featured?: boolean` sur l'interface `Article`

#### Page Documentation Islam — Création complète
- [x] **7 thèmes** : Fondements de l'Islam, Le Coran, La Sira, Les Hadiths, La Prière, Le Jeûne, FAQ
- [x] **4 à 6 sujets par thème** avec contenus détaillés rédigés en français
- [x] **Modale par sujet** — non fermable depuis l'extérieur (uniquement bouton ✕)
- [x] **Parsing texte enrichi** : `**gras**` → `<strong>` via `parseContent()`
- [x] **Style cohérent** avec les cards Actualités (`bg-surface-container-lowest shadow-sm rounded-2xl`)
- [x] **Grille responsive** : 1 → 2 → 4 colonnes (`lg:grid-cols-4`)
- [x] **Titre page** : "Documentation sur l'Islam" (icône + serif uppercase)

#### Correction globale — Bordure visible sur cards avec image
- [x] **Classe `.card-border`** ajoutée dans `globals.css` : pseudo-élément `::after` superposé (`position: absolute; inset: 0; border-radius: inherit; border: 1px solid var(--color-card-border); pointer-events: none; z-index: 10`)
- [x] Appliquée sur les cards grille Actualités et les cards Documentation
- [x] Bordure visible en light (émeraude) et dark mode (ambre), par-dessus les images

**Commit :** `ddfcca7` — pushé sur GitHub (`b55dcaa..ddfcca7`)

---

### Session 4 — 12 avril 2026 (autre ordinateur)
- [x] Thème dark/light cohérent sur l'ensemble du site
- [x] Navigation SPA
- [x] Formulaires mis à jour
- [x] Commit `2c7fd51` — pushé sur GitHub

---

### Session 3 — 12 avril 2026

#### Corrections et améliorations HeroSection (page d'accueil)
- [x] **ThemeProvider** : suppression du `return null` qui causait une page blanche au chargement
- [x] **LayoutShell** : nouveau composant client qui isole Header/Footer du périmètre admin
- [x] **Uniformisation des titres de cards** : toutes les cards ont désormais icône + uppercase + tracking-wider
- [x] **Card "Dernières actualités"** : photos Unsplash réelles (gauche, hauteur max), date JJ/MM, titre, résumé
- [x] **DailyReminder** : version compacte horizontale, titre uniformisé (icône crayon + uppercase)
- [x] **Suppression QuickLinks et NewsSection** de la page d'accueil
- [x] **Mawaqit widget** : `row-span-2`, hauteur `h-[560px]`, scrollbar supprimée (`scrolling="no"`)
- [x] **Card "Soutenir les projets"** : cœur battant à gauche du titre (5s repos / 2s survol), oscillation couleur blanc→#F59E0B
- [x] **Bordures des cards** : variable CSS `--color-card-border` (primary en light / #F59E0B en dark)
- [x] **Espacement** : `gap-3`, `py-2` sur la section
- [x] **Accès rapide** : chevron `›` en haut à droite des cards Actualités, Conférences, Cours
- [x] **Card Contact** : renommée "Contact et infos pratiques", redirige vers `/infos`
- [x] **Image hero** : images `mosquee-hero-light.png` et `mosquee-hero-dark.png` selon le thème actif
- [x] **Badge "Que la paix soit sur vous"** : couleur texte fixée en `#A9824D` via inline style (CSS variable incompatible avec l'opacité Tailwind)
- [x] **Footer** : suppression du `mt-12` (espace au-dessus)
- [x] **iframe.d.ts** : déclaration TypeScript pour supprimer le hint `scrolling` deprecated

#### Page "Contact et Infos pratiques" (`/infos`)
- [x] Titre page → "Contact et Infos pratiques"
- [x] Sous-titre → "Accès, horaires, contact, services et informations utiles."
- [x] Formulaire de contact ajouté : Prénom + Nom, Email + Téléphone, Sujet, Message (6 lignes)
- [x] Restructuration en 2 lignes :
  - Ligne 1 (3 colonnes) : Horaires | Accès | Plan d'accès
  - Ligne 2 (2 colonnes) : Formulaire de contact | Services
- [x] 7 services mis à jour : Prières/Janaza, Prière de l'Aïd, Salle d'ablutions, Iftar Ramadan, Espace femmes, Cours adultes/enfants, Parking PMR
- [x] Tous les titres de section uniformisés : icône + uppercase + tracking-wider

#### Header
- [x] "Infos pratiques" → "Don" (href `/don`)
- [x] "Contact" redirige vers `/infos`

---

### Sessions 1 & 2 — 12 avril 2026 (résumé)
- [x] Mise en place infrastructure Next.js 16 + Tailwind CSS 3.4 + TypeScript
- [x] Design system complet (tokens Light/Dark, polices Noto Serif + Inter)
- [x] Header responsive + ThemeToggle + menu mobile
- [x] Footer complet
- [x] Bento grid page d'accueil (Hero + Mawaqit + Actualités + Hadith + CTA)
- [x] Pages : `/actualites`, `/activites`, `/documentation`, `/infos`, `/contact`
- [x] Admin : connexion, dashboard, CRUD Hadiths en mémoire
- [x] LayoutShell pour isoler l'admin du layout public
- [x] Proxy.ts (protection routes admin par cookie)

---

## Ce qui RESTE À FAIRE

### CRITIQUE — Bloquant pour la mise en production

#### P0 — Vraie photo de la mosquée
- Image hero actuellement : `1776010632-light-mode.png` / `1776010632-dark-mode.png`
- Dimensions recommandées pour un affichage sans rognage : **1200 × 520 px** (ratio 2.3:1)
- Ces images sont en place mais la photo de la vraie mosquée reste à fournir

#### P0 — Numéro de téléphone réel
- **Fichier :** `src/app/infos/page.tsx` — affiché `04 XX XX XX XX`
- **Action :** Remplacer par le vrai numéro

#### P0 — Lien Don
- **Fichier :** `src/components/HeroSection.tsx` — `href="#"`
- La page `/don` dans le menu est également à créer
- **Action :** Définir l'URL HelloAsso ou autre plateforme de don

#### P0 — Formulaire Contact non connecté
- **Fichier :** `src/app/infos/page.tsx` — `<form>` sans handler
- **Action :** Intégrer Resend / EmailJS / Formspree ou Supabase Edge Function

#### P0 — Authentification Admin simulée
- **Fichier :** `src/context/AuthContext.tsx`
- **Action :** Connecter Supabase Auth avant tout déploiement public

---

### HAUTE PRIORITÉ — Phase 2

#### Front-office

| Item | Fichier | Description |
|------|---------|-------------|
| Page `/don` | À créer | Nouveau lien dans le menu — page de don à créer |
| Coordonnées Maps réelles | `src/app/infos/page.tsx:82` | Coordonnées Google Maps approximatives (`4.834/45.832`) |
| Images actualités réelles | `/actualites/page.tsx` | Toutes les images sont des placeholders Unsplash |
| Liens documentation | `/documentation/page.tsx` | Tous les liens pointent vers `#` |
| Page 404 | — | Aucune page d'erreur personnalisée |
| Countdown prière dynamique | `HeroSection.tsx` | Prévu dans le tracking mais absent |

#### Back-office Admin

| Item | Fichier | Description |
|------|---------|-------------|
| CRUD Actualités | `/admin/dashboard/news/page.tsx` | Placeholder, non développé |
| CRUD Événements | `/admin/dashboard/events/page.tsx` | Placeholder, non développé |
| Médiathèque | `/admin/dashboard/media/page.tsx` | Probablement placeholder |
| Paramètres / Rôles | `/admin/dashboard/settings/page.tsx` | Probablement placeholder |
| Persistance Hadiths | `/admin/dashboard/hadiths/page.tsx` | CRUD en mémoire — données perdues au refresh |

---

### MOYENNE PRIORITÉ — Phase 3 & 4

#### Backend Supabase (Phase 3)
- [ ] Créer projet Supabase (PostgreSQL)
- [ ] Tables : `articles`, `events`, `hadiths`, `media`, `users`
- [ ] Row Level Security (RLS) activée
- [ ] Variables d'environnement `.env.local`
- [ ] Remplacer `AuthContext` simulé par `@supabase/ssr`
- [ ] API Routes Next.js pour CRUD
- [ ] Upload images via Supabase Storage

#### Pages à créer
- [ ] `/don` — Page de don (HelloAsso embed ou lien externe)
- [ ] Pages détail article `/actualites/[slug]`
- [ ] Pages détail catégorie documentation `/documentation/[category]`
- [ ] Page Événements

#### SEO & Performance
- [ ] Metadata `<head>` pour chaque page (title, description, OG)
- [ ] `sitemap.xml` dynamique
- [ ] `robots.txt`
- [ ] Audit Lighthouse (performance, a11y)

---

### FAIBLE PRIORITÉ — Améliorations

- [ ] Animation skeleton pour le widget Mawaqit
- [ ] Transition de thème plus fluide
- [ ] Dark mode : vérifier tous les tokens sur chaque page
- [ ] Mode "Ramadan" avec thème spécial
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] Audit sécurité : XSS, CSP Headers

---

## Anomalies Connues

| Sévérité | Fichier | Problème |
|----------|---------|---------|
| 🔴 HIGH | `src/context/AuthContext.tsx` | Auth simulée — accepte tout identifiant |
| 🟡 MED | `src/app/infos/page.tsx` | Coordonnées Google Maps approximatives |
| 🟢 LOW | `src/app/documentation/page.tsx` | Contenus statiques — à terme brancher sur Supabase |
| 🟡 MED | Toutes pages admin (sauf hadiths) | Données 100% statiques/fake |
| 🟢 LOW | `src/components/HeroSection.tsx` | `scrolling="no"` sur iframe : hint TypeScript (inoffensif, géré par `iframe.d.ts`) |
| 🟢 LOW | `tailwind.config.ts` + `globals.css` | CSS variables hex incompatibles avec l'opacité Tailwind (`/xx`) — contourné par inline style |

---

## Notes Techniques Importantes

### CSS Variables & Tailwind Opacity
Les couleurs du design system sont définies en `var(--color-xxx)` avec des valeurs **hex** dans `globals.css`. Le modificateur d'opacité Tailwind (`bg-primary/20`) **ne fonctionne pas** avec ce format — Tailwind a besoin de canaux RGB séparés. Contournement : utiliser `style={{ backgroundColor: 'rgba(...)' }}` pour les cas d'opacité dynamique.

### Image Hero & Thème
- `public/images/mosquee-hero-light.png` → affiché en mode clair
- `public/images/mosquee-hero-dark.png` → affiché en mode sombre
- Dimensions idéales : **1200 × 520 px** (ratio 2.3:1 = ratio exact de la card `h-[360px]` à pleine largeur)
- Le composant `HeroSection` utilise `useTheme()` pour switcher dynamiquement

### Animation Heartbeat
- Définie dans `globals.css` : `@keyframes heartbeat` avec oscillation scale + color (blanc → #F59E0B)
- Classes CSS : `.heart-pulse` (5s repos) / `.group:hover .heart-pulse` (2s survol)

### Structure Bento Grid (HeroSection)
```
Row 1 : Hero image (col-span-2) | Mawaqit (row-span-2)
Row 2 : Dernières actualités (col-span-2) | (Mawaqit continue)
Row 3 : Hadith du jour (col-span-2) | Soutenir les projets
Row 4 : Conférences | Cours & Activités | Contact+Assurances (stacked)
```

---

## Plan d'Action Recommandé — Prochaine Session

### Sprint Prioritaire
1. **Créer la page `/don`** — lien dans le menu, page à définir avec le client
2. **Renseigner les vraies coordonnées** (téléphone, Google Maps réel)
3. **Connecter le formulaire de contact** (EmailJS ou Formspree en attendant Supabase)
4. **Fournir la vraie photo de la mosquée** (1200×520px, light + dark si besoin)
5. **Commencer Supabase** : créer le projet, brancher l'auth admin

---

## Fichiers Clés

| Fichier | Rôle | Priorité |
|---------|------|----------|
| [src/components/HeroSection.tsx](src/components/HeroSection.tsx) | Page d'accueil — bento grid | Quasi finalisé |
| [src/components/DailyReminder.tsx](src/components/DailyReminder.tsx) | Hadith du jour | À brancher sur Supabase |
| [src/app/infos/page.tsx](src/app/infos/page.tsx) | Contact & Infos | Formulaire à connecter |
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | Auth — à remplacer | P0 avant prod |
| [src/app/admin/dashboard/news/page.tsx](src/app/admin/dashboard/news/page.tsx) | CRUD à développer | Sprint 3 |
| [src/app/globals.css](src/app/globals.css) | Tokens design + animations | Vigilance |
| [tailwind.config.ts](tailwind.config.ts) | Design system | Ne pas casser |

---

*Dernière mise à jour : 14 avril 2026 — Session 6*
