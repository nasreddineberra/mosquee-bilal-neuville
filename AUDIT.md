# Audit du Projet - Mosquée Bilal
**Date de dernière mise à jour :** 16 avril 2026 (Session 8)
**Branche :** main
**Auditeur :** Claude Code (Opus 4.6)

---

## Résumé Exécutif

Le projet est en **Phase 2 finalisée**. La maquette complète du site est terminée : toutes les pages front-office sont créées avec un design cohérent en light et dark mode. Les composants de formulaire sont centralisés et réutilisables. Il reste à connecter les formulaires, intégrer Supabase et renseigner les vraies données.

| Domaine | Statut | Score |
|---------|--------|-------|
| Structure & Config | ✅ Solide | 9/10 |
| Front-office (UI) | ✅ Finalisé | 9/10 |
| Back-office (Admin) | 🟡 Partiel | 5/10 |
| Backend / Data | ❌ Simulé | 1/10 |
| Accessibilité | 🟡 Partiel | 5/10 |
| Performance | 🟡 À évaluer | -/10 |

---

## Journal des Sessions

### Session 8 - 16 avril 2026

#### Page Dons (`/don`) - Création complète
- [x] **Structure 2 colonnes** : Col 1 (Pourquoi donner + Plateformes de confiance), Col 2 (Nos projets)
- [x] **Card CTA "Soutenir la mosquée"** en tête de col 2 : card-green + aide-sociale-cta + heart-pulse
- [x] **3 projets** en grille 2 colonnes : Programmes éducatifs, Actions sociales, Événements communautaires
- [x] **Plateformes** : badges HelloAsso et GoFundMe (sans lien, juste indicatifs)
- [x] **Card Soutenir (accueil)** pointe désormais vers `/don` (Link au lieu de `<a href="#">`)

#### Composants de formulaire centralisés (`FloatField.tsx`)
- [x] **FloatInput** : champ avec label flottant, bordure card-border, prop `transform` et `error`
- [x] **FloatTextarea** : textarea avec label flottant
- [x] **FloatSelect** : select avec label flottant + chevron
- [x] **Transforms disponibles** : `capitalize` (1re lettre majuscule par mot, lettres uniquement), `uppercase` (tout majuscules, lettres uniquement), `lowercase` (tout minuscules), `phone` (+ autorisé en début + chiffres uniquement), `none`
- [x] **Validation email** : contour rouge si format non conforme (`error` prop)

#### Page Infos - Refonte formulaire de contact
- [x] **Tous les champs en FloatInput/FloatTextarea** avec transforms appliqués
- [x] **Tous les champs obligatoires** avec astérisque rouge
- [x] **Validation email** avec contour rouge si non conforme
- [x] **Bouton grisé** tant que tous les champs ne sont pas remplis + email valide
- [x] **Dernière ligne** : "* obligatoire" à gauche + bouton "Envoyer le message" à droite
- [x] **Photo mosquée** dans card Accès avec `position: absolute` (ne modifie pas la hauteur)
- [x] **Styles uniformisés** Horaires/Contact identiques au style Adresse
- [x] **Card Services en 2 colonnes** avec hover cursor-pointer

#### Page Activités - Refonte formulaire Aide Sociale
- [x] **Tous les champs en FloatInput/FloatSelect/FloatTextarea**
- [x] **Mêmes transforms et validations** que le formulaire de contact
- [x] **Bouton grisé** + "* obligatoire" + bouton à droite
- [x] **Reset du formulaire** à la fermeture du modal

#### Page Admin Login - Refonte
- [x] **Suppression card "Mode démo"**
- [x] **Champs en FloatInput** : email (lowercase + validation rouge), mot de passe (avec icône oeil Eye/EyeOff)
- [x] **Bouton grisé** si champs non valides
- [x] **Bouton "Demander un accès visiteur"** ajouté
- [x] **Modal accès visiteur** : formulaire FloatInput (Prénom, Nom, Email, Téléphone) + validation + message de confirmation

#### Nettoyage
- [x] **Suppression page `/contact`** (doublon avec `/infos`)
- [x] **Correction lien QuickLinks** : `/contact` -> `/infos`

---

### Session 7 - 15 avril 2026

#### Page Certificat (`/certificat`) - Création complète
- [x] **4 sections** : Qu'est-ce que le certificat, À quoi sert-il, Comment l'obtenir, CTA Contact
- [x] **Lien retour accueil** en haut de page
- [x] **CTA** : card-green avec aide-sociale-cta, redirige vers `/infos#contact`

#### Refonte page Infos
- [x] **Nouvelle structure** : Col 1 (Horaires + Contact empilés), Col 2-3 (Accès + Map fusionnés)
- [x] **Horaires simplifiés** : "Lundi - Dimanche" / "Prière du Vendredi"
- [x] **Formulaire contact** : ajout `id="contact"` + `scroll-mt-24` pour ancrage

#### Refonte accueil (HeroSection)
- [x] **3e card actualité** ajoutée (Collecte Zakat al-Fitr)
- [x] **Dernière ligne restructurée** : Cours+Islam | Certificat | Contact+Assurances
- [x] **Chevrons uniformes** w-6/h-6 avec hover primary sur toutes les cards
- [x] **Menu** : "Don" renommé en "Dons"
- [x] **Hover Aide Sociale** : bouton #F59E0B (light) / #0F172A (dark) via CSS globals

#### Page Actualités
- [x] **"Lire l'article"** ancré en bas des cards (mt-auto pt-3)

**Commit :** `8e6236c` - pushé sur GitHub

---

### Session 6 - 14 avril 2026

#### Page Documentation Islam - Réécriture complète des textes
- [x] **45 topics réécrits** sur 8 cards avec un ton ludique, empathique et pédagogique
- [x] **Card 1** : Les fondements de l'Islam (6 topics)
- [x] **Card 2** : Le Coran (5 topics)
- [x] **Card 3** : La Sira (5 topics)
- [x] **Card 4** : Les Hadiths (4 topics)
- [x] **Card 5** : La Prière (4 topics)
- [x] **Card 6** : Le Jeûne (4 topics)
- [x] **Card 7** : Quelques Prophètes (12 topics détaillés)
- [x] **Card 8** : FAQ (5 topics)

**Commit :** `40346d9` - pushé sur GitHub

---

### Session 5 - 13 avril 2026

#### Page Actualités - Refonte des cards grille
- [x] 2 articles à la une en layout card-green
- [x] Bordure visible via `.card-border` (pseudo-élément ::after)

#### Page Documentation Islam - Création complète
- [x] 7 cards thématiques avec modales par sujet

**Commit :** `ddfcca7` - pushé sur GitHub

---

### Sessions 1 à 4 - 11-12 avril 2026 (résumé)
- [x] Infrastructure Next.js 16 + Tailwind CSS 3.4 + TypeScript
- [x] Design system complet (tokens Light/Dark)
- [x] Header responsive + ThemeToggle + menu mobile
- [x] Footer complet
- [x] Bento grid page d'accueil
- [x] Pages : `/actualites`, `/activites`, `/documentation`, `/infos`
- [x] Admin : connexion, dashboard, CRUD Hadiths en mémoire
- [x] LayoutShell pour isoler l'admin du layout public

---

## Ce qui RESTE À FAIRE

### CRITIQUE - Bloquant pour la mise en production

#### P0 - Numéro de téléphone réel
- **Fichier :** `src/app/infos/page.tsx` - affiché `04 XX XX XX XX`
- **Action :** Remplacer par le vrai numéro

#### P0 - Liens plateformes de dons
- **Fichier :** `src/app/don/page.tsx` - `href="#"` sur les projets et CTA
- **Action :** Renseigner les URLs HelloAsso / GoFundMe réelles

#### P0 - Formulaires non connectés
- **Fichiers :** `src/app/infos/page.tsx`, `src/components/AideSocialeModal.tsx`, `src/app/admin/page.tsx`
- **Action :** Intégrer Resend / EmailJS / Formspree ou Supabase Edge Function

#### P0 - Authentification Admin simulée
- **Fichier :** `src/context/AuthContext.tsx`
- **Action :** Connecter Supabase Auth avant tout déploiement public

---

### HAUTE PRIORITÉ - Phase 3

#### Front-office

| Item | Fichier | Description |
|------|---------|-------------|
| Coordonnées Maps réelles | `src/app/infos/page.tsx` | Coordonnées Google Maps approximatives |
| Images actualités réelles | `/actualites/page.tsx` | Placeholders Unsplash |
| Page 404 | - | Aucune page d'erreur personnalisée |

#### Back-office Admin

| Item | Fichier | Description |
|------|---------|-------------|
| CRUD Actualités | `/admin/dashboard/news/page.tsx` | Placeholder |
| CRUD Événements | `/admin/dashboard/events/page.tsx` | Placeholder |
| Médiathèque | `/admin/dashboard/media/page.tsx` | Placeholder |
| Paramètres / Rôles | `/admin/dashboard/settings/page.tsx` | Placeholder |
| Persistance Hadiths | `/admin/dashboard/hadiths/page.tsx` | CRUD en mémoire |

---

### MOYENNE PRIORITÉ - Phase 4

#### Backend Supabase
- [ ] Créer projet Supabase (PostgreSQL)
- [ ] Tables : `articles`, `events`, `hadiths`, `media`, `users`
- [ ] Row Level Security (RLS) activée
- [ ] Variables d'environnement `.env.local`
- [ ] Remplacer `AuthContext` simulé par `@supabase/ssr`
- [ ] API Routes Next.js pour CRUD
- [ ] Upload images via Supabase Storage

#### SEO & Performance
- [ ] Metadata `<head>` pour chaque page
- [ ] `sitemap.xml` dynamique
- [ ] `robots.txt`
- [ ] Audit Lighthouse

---

### FAIBLE PRIORITÉ - Améliorations

- [ ] Animation skeleton pour le widget Mawaqit
- [ ] Mode "Ramadan" avec thème spécial
- [ ] Tests unitaires et E2E
- [ ] Audit sécurité : XSS, CSP Headers

---

## Pages du Site - État Complet

| Page | Route | Statut | Notes |
|------|-------|--------|-------|
| Accueil | `/` | ✅ Finalisé | Bento grid, Mawaqit, actualités, hadith, CTA |
| Actualités | `/actualites` | ✅ Finalisé | 2 à la une + grille, modale article |
| Activités | `/activites` | ✅ Finalisé | Tajwid, Arabe, Sorties, Aide Sociale (modal) |
| Documentation Islam | `/documentation` | ✅ Finalisé | 8 cards, 45 topics, modales |
| Infos pratiques | `/infos` | ✅ Finalisé | Horaires, Contact, Accès+Map, Formulaire, Services |
| Dons | `/don` | ✅ Finalisé | Pourquoi donner, Plateformes, Projets, CTA |
| Certificat | `/certificat` | ✅ Finalisé | Définition, utilité, étapes, CTA contact |
| Admin Login | `/admin` | ✅ Finalisé | Login + demande accès visiteur |
| Admin Dashboard | `/admin/dashboard` | 🟡 Partiel | Stats placeholder, CRUD hadiths en mémoire |

---

## Composants Réutilisables

| Composant | Fichier | Description |
|-----------|---------|-------------|
| FloatInput | `src/components/FloatField.tsx` | Input avec label flottant, transform, error |
| FloatTextarea | `src/components/FloatField.tsx` | Textarea avec label flottant |
| FloatSelect | `src/components/FloatField.tsx` | Select avec label flottant + chevron |
| DailyReminder | `src/components/DailyReminder.tsx` | Hadith du jour |
| AideSocialeModal | `src/components/AideSocialeModal.tsx` | Modal aide sociale |
| ThemeProvider | `src/components/ThemeProvider.tsx` | Gestion thème light/dark |

---

## Notes Techniques Importantes

### Composants FloatField - Transforms
- `capitalize` : 1re lettre majuscule par mot, n'accepte que lettres/espaces/tirets
- `uppercase` : tout majuscules, n'accepte que lettres/espaces/tirets
- `lowercase` : tout minuscules
- `phone` : `+` autorisé en début uniquement + chiffres
- `none` : saisie libre

### CSS Variables & Tailwind Opacity
Les couleurs sont en hex dans `globals.css`. Le modificateur d'opacité Tailwind (`bg-primary/20`) ne fonctionne pas avec ce format.

### Hover Aide Sociale / Soutenir
`.aide-sociale-cta` dans `globals.css` : light = #F59E0B, dark = #0F172A au hover du groupe parent.

### Animation Heartbeat
`.heart-pulse` dans `globals.css` : battement 3s repos / 1s hover, oscillation blanc -> #F59E0B.

### Structure Bento Grid (HeroSection)
```
Row 1 : Hero image (col-span-2) | Mawaqit (row-span-2)
Row 2 : Dernières actualités (col-span-2) | (Mawaqit continue)
Row 3 : Hadith du jour (col-span-2) | Soutenir les projets
Row 4 : Cours+Islam (stacked) | Certificat | Contact+Assurances (stacked)
```

---

*Dernière mise à jour : 16 avril 2026 - Session 8*
