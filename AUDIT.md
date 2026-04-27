# Audit de sécurité - Mosquée Bilal

**Date de l'audit :** 26 avril 2026
**Branche / commit auditée :** `main` @ `eea8af5`
**Auditeur :** Claude Opus 4.7 (mode expert sécurité)
**Méthodologie :** revue manuelle des routes API, middleware, RLS Supabase, storage policies, auth flow, XSS, validation input, RGPD, headers HTTP

**Légende statut :**
- ⏳ À faire
- 🔧 En cours
- ✅ Corrigé
- ⏭️ Reporté / accepté

---

## Sommaire

| # | Sévérité | Titre | Statut |
|---|----------|-------|--------|
| 1 | 🔴 CRITICAL | User enumeration via `/api/auth/check-email` | ⏳ |
| 2 | 🔴 CRITICAL | MFA non obligatoire à la 1ère connexion (take-over de compte) | ⏳ |
| 3 | 🔴 CRITICAL | RLS profiles avec récursion infinie potentielle | ⏳ |
| 4 | 🔴 CRITICAL | Newsletter - éditeur peut spammer sans rate limit | ⏳ |
| 5 | 🟠 HIGH | Demandes d'accès - pas de CAPTCHA / rate limit | ⏳ |
| 6 | 🟠 HIGH | Login `signInWithPassword` côté client sans rate limit | ⏳ |
| 7 | 🟠 HIGH | Upload obsèques sans validation taille / MIME | ⏳ |
| 8 | 🟠 HIGH | Headers HTTP de sécurité absents | ⏳ |
| 9 | 🟠 HIGH | Open redirect partiel dans `/api/auth/callback` | ⏳ |
| 10 | 🟡 MEDIUM | Bucket Storage `articles` public - hotlinking / scraping | ⏳ |
| 11 | 🟡 MEDIUM | Validation input côté serveur quasi inexistante | ⏳ |
| 12 | 🟡 MEDIUM | Messages d'erreur leak des infos | ⏳ |
| 13 | 🟡 MEDIUM | Iframe Mawaqit sans `sandbox` | ⏳ |
| 14 | 🟡 MEDIUM | Adresses email dans logs (`console.error`) | ⏳ |
| 15 | 🟡 MEDIUM | Pas de session timeout / révocation après inactivité | ⏳ |
| 16 | 🟡 MEDIUM | Récursion potentielle aussi sur `messages`, `activites_*`, `dons` | ⏳ |
| 17 | 🟡 MEDIUM | Pas de validation `numero_contrat`, `montant`, `cotisation_annuelle` | ⏳ |
| 18 | 🟢 LOW | Lock no-op Supabase GoTrue - race condition multi-tab | ⏳ |
| 19 | 🟢 LOW | Aucun monitoring / alerting | ⏳ |
| 20 | 🟢 LOW | Politique de mots de passe non affichée (rotation, historique) | ⏳ |
| 21 | 🟢 LOW | RGPD - pas de gestion explicite du droit à l'oubli | ⏳ |
| 22 | 🟢 LOW | Snapshot organisme `NOT NULL` sans default | ⏳ |
| 23 | 🟢 LOW | Console.log/error dispersés en prod | ⏳ |
| 24 | 🔵 NOTE | Requêtes Supabase en dur côté client (84+) | ⏳ |

---

## 🔴 CRITICAL

### 1. User enumeration via `/api/auth/check-email` ⏳

**Fichier :** `src/app/api/auth/check-email/route.ts`

**Description :** Route publique non rate-limitée qui confirme l'existence de n'importe quel email en base.

**Code en cause :**
```ts
return NextResponse.json({ exists: !!data });
```

**Exploitation :**
- Bruteforce d'emails pour constituer une liste de comptes valides
- Cibler spam, phishing, credential stuffing
- Fuite de la liste des fidèles ayant un compte (atteinte vie privée - sensible pour une mosquée)

**Mitigation :**
- Toujours retourner le même message côté `/connexion` ("Email ou mot de passe incorrect" - fusionner étape email+mdp)
- OU : si l'étape email reste, retourner systématiquement `{ exists: true }` et ne pas vraiment tester
- OU : ajouter rate limiting strict (Upstash, middleware) + CAPTCHA après 3 tentatives
- Logger les IPs qui dépassent un seuil

**Notes correction :**
_(à remplir lors de la correction)_

---

### 2. MFA non obligatoire à la 1ère connexion → take-over de compte ⏳

**Fichier :** `src/app/connexion/page.tsx:89-103`

**Description :** Quand un user invité reçoit son mail et définit son mdp, n'importe qui en possession de cet email + mdp peut configurer **son propre** Google Authenticator la première fois.

**Scénario d'attaque :**
1. Attaquant intercepte le mail invite (mailbox compromise, fuite, screen sharing)
2. Définit le mdp via `/auth/set-password` → accède à `/connexion`
3. Premier login → enrôlement MFA → l'attaquant scanne **son propre** QR code
4. Le vrai user est définitivement verrouillé hors de son compte

**Mitigation :**
- Forcer l'enrôlement MFA dans le flow `/auth/set-password` immédiatement après définition du mdp (avant tout autre login possible)
- OU : exiger une confirmation par email avant l'enrôlement TOTP

**Notes correction :**
_(à remplir lors de la correction)_

---

### 3. RLS profiles avec récursion infinie potentielle ⏳

**Fichier :** `supabase/schema.sql:28-31`

**Code en cause :**
```sql
CREATE POLICY "Lecture tous profils - admins" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );
```

**Description :** La policy interroge `profiles` depuis une policy sur `profiles` → récursion infinie en théorie. Le tracking mentionne une fonction `is_admin()` SECURITY DEFINER qui n'apparaît dans aucune migration versionnée.

**Risque :** Selon comment Postgres se comporte dans cette config :
- (a) la policy fonctionne par chance (sous-requête `auth.uid()` optimisée)
- (b) un admin ne peut PAS voir les autres profils
- (c) edge-case d'exposition

**Mitigation :**
```sql
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean
  LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
$$;
```
Puis remplacer **toutes** les policies `EXISTS (SELECT FROM profiles WHERE ...)` par des appels à `is_admin()` / `is_obseques_manager()`. Versionner cette fonction dans une migration dédiée (`2026-04-XX_security_helpers.sql`).

**Notes correction :**
_(à remplir lors de la correction)_

---

### 4. Newsletter - éditeur peut spammer tous les abonnés sans rate limit ⏳

**Fichier :** `src/app/api/admin/send-newsletter/route.ts:18`

**Code en cause :**
```ts
if (!me || !['administrateur', 'editeur'].includes(me.role)) { ... }
```

**Description :** Un éditeur compromis peut envoyer immédiatement à tous les abonnés sans double-confirmation, en boucle (pas de rate limit, pas de quota), avec du contenu malveillant à toute la communauté.

**Mitigation :**
- Restreindre à `administrateur` uniquement
- Ajouter un compteur "max 1 envoi par jour" (vérification sur `newsletters.date_envoi`)
- Logger l'IP + user_id de chaque envoi
- Ajouter une étape "envoyer à moi-même d'abord" obligatoire

**Notes correction :**
_(à remplir lors de la correction)_

---

## 🟠 HIGH

### 5. Demandes d'accès - pas de CAPTCHA / rate limit ⏳

**Fichier :** `src/app/connexion/page.tsx:160`

**Description :** Insertion publique anonyme via la policy "Insertion demandes - public" (`WITH CHECK (TRUE)`).

**Exploitation :**
- Saturer la table `demandes_acces` (DoS DB)
- Soumettre 1000 fausses demandes pour noyer les vraies
- Polluer les logs admin

**Mitigation :** CAPTCHA (hCaptcha / Cloudflare Turnstile) + rate limit IP côté middleware ou via Edge Function.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 6. Login `signInWithPassword` côté client sans rate limit ⏳

**Fichier :** `src/app/connexion/page.tsx:79`

**Description :** `supabase.auth.signInWithPassword` est appelé directement depuis le browser. Supabase a un rate limit interne basique (~30/h par IP).

**Exploitation :**
- Bruteforcer un mdp connu (depuis check-email)
- Distribuer l'attaque sur plusieurs IPs

**Mitigation :** Implémenter un middleware de rate limit applicatif (compter par email, lockout 5 min après 5 échecs). Surveiller `auth.audit_log_entries`.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 7. Upload obsèques sans validation taille / MIME ⏳

**Fichier :** `src/app/admin/dashboard/obseques/page.tsx:498-515`

**Code en cause :**
```ts
const ext = file.name.split('.').pop() ?? 'bin';
const path = `${dossierAdhesion.id}/${Date.now()}.${ext}`;
const { error: uploadErr } = await supabase.storage.from('obseques-documents').upload(path, file);
```

**Description :** Aucune validation :
- **Taille fichier** → un manager malveillant peut uploader 10 GB → coût/storage Supabase
- **Type MIME** → upload .exe, .html (XSS via signed URL ouverte dans browser), .svg (vecteur XSS)
- **Extension validée par split** → `file.exe.pdf` passe en .pdf
- **Chemin** → `Date.now()` collision possible (peu probable mais théorique)

**Mitigation :**
```ts
const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png'];
if (file.size > MAX_SIZE) return error;
if (!ALLOWED.includes(file.type)) return error;
const path = `${dossierAdhesion.id}/${crypto.randomUUID()}.${getExtFromMime(file.type)}`;
```

**Notes correction :**
_(à remplir lors de la correction)_

---

### 8. Headers HTTP de sécurité absents ⏳

**Fichier :** `next.config.mjs`

**Description :** Aucun `headers()` configuré. Le site n'envoie pas :
- `Strict-Transport-Security` (HTTPS forcé futurs visites)
- `X-Frame-Options: SAMEORIGIN` (anti-clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (anti-XSS profond)
- `Permissions-Policy` (limite features browser)

**Mitigation :** Ajouter dans `next.config.mjs` :
```js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  }];
}
```
CSP : à concevoir séparément (iframes Mawaqit + Supabase à autoriser).

**Notes correction :**
_(à remplir lors de la correction)_

---

### 9. Open redirect partiel dans `/api/auth/callback` ⏳

**Fichier :** `src/app/api/auth/callback/route.ts:10,31`

**Code en cause :**
```ts
const next = searchParams.get('next') ?? '/admin/dashboard';
return NextResponse.redirect(`${origin}${next}`);
```

**Description :** Pas de validation que `next` commence par `/` ou ne contient pas `//`. Avec `?next=//evil.com` ou `?next=\\evil.com` (selon browsers), une redirection vers domaine externe peut être obtenue → phishing post-auth.

**Mitigation :**
```ts
const next = searchParams.get('next') ?? '/admin/dashboard';
const safeNext = next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')
  ? next
  : '/admin/dashboard';
return NextResponse.redirect(`${origin}${safeNext}`);
```

(La page `/connexion` valide déjà bien : `next.startsWith('/')`. Faire pareil ici.)

**Notes correction :**
_(à remplir lors de la correction)_

---

## 🟡 MEDIUM

### 10. Bucket Storage `articles` public - hotlinking / scraping ⏳

**Description :** Le bucket public expose toutes les images via URLs prédictibles ou listables.

**Risques :**
- Bande passante consommée par hotlinking externe
- Scraping facile

**Mitigation :** Config Supabase Storage CORS + `Cache-Control` headers + Cloudflare devant.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 11. Validation input côté serveur quasi inexistante ⏳

**Description :** Toutes les routes API parsent `request.json()` et insèrent directement en DB sans schema (Zod, Yup, Valibot).

**Risques (en cas de bypass du frontend) :**
- Champs trop longs → erreur PostgreSQL → 500 leak
- Types incorrects → comportement imprévisible
- Champs supplémentaires (mass-assignment) → si une table a un champ non-attendu, il peut être set

**Exemple :** `api/admin/refuse-demande/route.ts` ligne 6 - `demandeId` n'est pas validé comme uuid.

**Mitigation :** Ajouter `zod` partout :
```ts
const Schema = z.object({ demandeId: z.string().uuid() });
const { demandeId } = Schema.parse(await request.json());
```

**Notes correction :**
_(à remplir lors de la correction)_

---

### 12. Messages d'erreur leak des infos ⏳

**Fichiers :** `refuse-demande`, `send-newsletter`, `delete-user`, autres

**Description :** Plusieurs routes renvoient `error: err.message` directement. Les erreurs Supabase peuvent contenir des détails de schéma DB / contraintes / IDs internes.

**Mitigation :** Logger côté serveur (déjà fait), renvoyer un message générique côté client.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 13. Iframe Mawaqit sans `sandbox` ⏳

**Fichier :** `src/components/HeroSection.tsx:107-112`

**Code en cause :**
```tsx
<iframe src="//mawaqit.net/..." />
```

**Risques (si Mawaqit compromis) :**
- Exécution scripts dans le contexte iframe
- Tentative `top.location` redirection (bloquée par X-Frame-Options du parent si fixé)

**Mitigation :**
```tsx
<iframe sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
```
(`allow-scripts` requis pour Mawaqit, mais pas `allow-top-navigation`)

**Notes correction :**
_(à remplir lors de la correction)_

---

### 14. Adresses email dans logs (`console.error`) ⏳

**Description :** Les routes `send-newsletter`, `validate-demande`, etc. logguent des emails. Si les logs serveur sont exposés (Vercel, hébergement non sécurisé, accès partagé), exposition de données personnelles → RGPD.

**Mitigation :** Masquer les emails (`u**@example.com`) dans les logs ou utiliser une lib de logging avec niveau (winston, pino) + désactiver verbose en prod.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 15. Pas de session timeout / révocation après inactivité ⏳

**Description :** Supabase JWT expire en 1h, refresh token longue durée. Pas de mécanisme côté app pour forcer logout après X minutes d'inactivité, ni pour révoquer toutes les sessions d'un user (utile si compte volé).

**Mitigation :** Page profil avec bouton "Déconnecter toutes les sessions" via `admin.auth.admin.signOut(userId, 'global')`.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 16. Récursion potentielle aussi sur `messages`, `activites_*`, `dons` ⏳

**Description :** Mêmes patterns `EXISTS (SELECT FROM profiles ...)` que pour le point #3. À corriger en même temps via les helpers `is_admin()` / `is_editor_or_admin()`.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 17. Pas de validation `numero_contrat`, `montant`, `cotisation_annuelle` ⏳

**Description :** Dans la modale obsèques, `cotisation_annuelle: Number(adhForm.cotisation_annuelle) || 0` accepte des valeurs négatives, infinies, NaN. Idem pour `montant` paiement.

**Mitigation :**
- Niveau DB : `numeric(10,2) CHECK (montant > 0)`
- Niveau app : validation Zod (`z.number().positive().finite()`)

**Notes correction :**
_(à remplir lors de la correction)_

---

## 🟢 LOW

### 18. Lock no-op Supabase GoTrue - race condition multi-tab ⏳

**Fichier :** `src/lib/supabase/client.ts`

**Description :** Le lock GoTrue est désactivé. Si deux onglets refresh le token simultanément, dernière écriture localStorage gagne → potentiel logout intempestif.

**Statut décision :** Acceptable selon décision utilisateur (admin mono-tab dans la majorité des cas), à reverter si problèmes.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 19. Aucun monitoring / alerting ⏳

**Description :** Pas de Sentry, pas de log centralisé, pas d'alerte sur :
- Tentatives de login échouées en masse
- Erreurs 500 répétées
- Téléchargements documents obsèques anormaux

**Mitigation :** Intégrer Sentry (free tier 5k events/mois) + dashboard Supabase logs.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 20. Politique de mots de passe non affichée (rotation, historique) ⏳

**Description :** La page `/auth/set-password` affiche les règles mais pas l'historique (réutilisation interdite ?). Pas de rotation forcée.

**Mitigation :** Documenter la politique dans CGU. Implémenter rotation 12 mois si requis.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 21. RGPD - pas de gestion explicite du droit à l'oubli ⏳

**Description :** La suppression de compte existe mais l'examen détaillé du nettoyage manque :
- `ON DELETE CASCADE` en place sur les sous-tables obsèques ✅
- `adhesions_obseques.user_id` est `ON DELETE SET NULL` → l'adhésion reste avec user_id null (orphelin, peut être voulu pour traçabilité, à documenter RGPD)
- `auth.users` reste après suppression profile ?

**Mitigation :** Documenter le flux de suppression RGPD-compliant. Vérifier que `delete-user` API supprime bien aussi `auth.users`.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 22. Snapshot organisme `NOT NULL` sans default ⏳

**Description :** Si la migration est exécutée sur une table `adhesions_obseques` existante avec des lignes sans `organisme_nom_historique`, l'ALTER échoue. Idempotent mais pas safe en migration de données réelle.

**Statut :** Pas critique car table neuve actuellement. À garder à l'esprit pour les migrations futures.

**Notes correction :**
_(à remplir lors de la correction)_

---

### 23. Console.log/error dispersés en prod ⏳

**Description :** Environ 15 `console.log` / `console.error` traînent en prod. Verbosité utile en dev, à filtrer en prod.

**Mitigation :**
- Wrapper `logger.info()` / `logger.error()` avec niveau env
- OU : config Next.js `compiler: { removeConsole: { exclude: ['error'] } }` en prod

**Notes correction :**
_(à remplir lors de la correction)_

---

## 🔵 NOTE D'ARCHITECTURE

### 24. Requêtes Supabase en dur côté client (84+ occurrences) ⏳

**Constat :** 84+ appels `supabase.from('table').select(...)` directement dans des composants `'use client'`, exposés dans le bundle JS du browser.

**Tables sensibles concernées (10 fichiers identifiés) :**
- `src/app/admin/dashboard/communication/page.tsx`
- `src/app/admin/dashboard/hadiths/page.tsx`
- `src/app/admin/dashboard/layout.tsx`
- `src/app/admin/dashboard/obseques/page.tsx`
- `src/app/connexion/page.tsx`
- `src/app/mon-adhesion/page.tsx`
- `src/app/mon-profil/page.tsx`
- `src/components/Header.tsx`
- `src/components/HeroSection.tsx`
- `src/components/ProfileModal.tsx`

**Pourquoi ce N'EST PAS une faille en soi :**
Le modèle Supabase repose sur le principe "sécurité = RLS au niveau DB, pas secret du code client". Les noms de tables / colonnes / filters sont conçus pour être publics, comme une API REST documentée. Un attaquant qui ouvre les devtools voit les requêtes, mais peut aussi scanner directement `https://ugbkbsorcrmnhfplprkb.supabase.co/rest/v1/...` avec la clé anon.

**Pourquoi ça PEUT devenir un problème dans ce projet :**

Trois cas où le code en dur côté client devient dangereux :

**Cas 1 — Filtre client utilisé comme sécurité (anti-pattern)**
```ts
supabase.from('adhesions_obseques').select('*').eq('user_id', user.id)
```
Si quelqu'un compte sur `.eq('user_id', user.id)` pour limiter l'accès, c'est faux : un attaquant retire le filter, et seule la RLS protège. Heureusement, dans ce projet, la RLS sur `adhesions_obseques` a la double policy (manager + owner) → OK ici.

**Cas 2 — Tables sans RLS appropriée (vrai trou potentiel)**
Les points #3 et #16 identifient des policies avec récursion potentielle (`Lecture tous profils - admins`). Un visiteur connecté pourrait scanner toute la table `profiles` si la policy ne fonctionne pas correctement. Testable trivialement en console :
```js
// copié-collé depuis le code admin, exécuté en visiteur
supabase.from('profiles').select('id, email, nom, prenom, role, telephone, adresse, newsletter_opt_in')
```
Si la RLS rejette → 0 ligne. Si elle laisse passer → fuite massive.

**Cas 3 — Données sensibles exposées par bug RLS**
La table `demandes_acces` a la policy "Lecture demandes - admins". Mais l'INSERT est public. Si une policy SELECT était mal écrite, un attaquant pourrait lire toutes les demandes (emails + téléphones + adresses).

**Test à faire en priorité :**
Connecté avec un compte **visiteur**, ouvrir la console browser :
```js
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient(
  'https://ugbkbsorcrmnhfplprkb.supabase.co',
  '<NEXT_PUBLIC_SUPABASE_ANON_KEY>',
);
console.log('profiles:', (await sb.from('profiles').select('*')).data?.length);
console.log('adhesions:', (await sb.from('adhesions_obseques').select('*')).data?.length);
console.log('demandes:', (await sb.from('demandes_acces').select('*')).data?.length);
console.log('newsletters:', (await sb.from('newsletters').select('*')).data?.length);
console.log('paiements:', (await sb.from('adhesions_obseques_paiements').select('*')).data?.length);
console.log('documents:', (await sb.from('adhesions_obseques_documents').select('*')).data?.length);
```

**Résultat attendu (RLS bien faite) :** `0 profils, 0 ou 1 adhesion (la sienne), 0 demandes, 0 newsletters, 0 paiements, 0 documents`.

**Si autre chose remonte → fuite de données réelle.**

**Recommandations :**
1. **Test ci-dessus à faire en priorité** — c'est 5 minutes et ça révèle les fuites réelles
2. **Audit RLS table par table** : pour chaque `CREATE POLICY`, vérifier que les 4 opérations (SELECT/INSERT/UPDATE/DELETE) sont couvertes (ce qui n'est pas le cas partout dans `schema.sql`)
3. **Migrer les requêtes les plus sensibles côté serveur** (Server Components ou route API avec service_role key) : pour ces requêtes-là, RLS bypassée mais pas exposées au client. À considérer pour `adhesions_obseques`, `adhesions_obseques_documents`, `newsletters`
4. **Fonction `is_admin()` SECURITY DEFINER** pour casser les récursions (lié au point #3)

**Notes correction :**
_(à remplir lors de la correction)_

---

## Priorisation recommandée

| Ordre | Action | Effort | Impact |
|-------|--------|--------|--------|
| 1 | Test RLS visiteur (#24) — 5 min, révèle les fuites réelles | XS | 🔴 |
| 2 | Forcer MFA dans `/auth/set-password` (#2) | M | 🔴 |
| 3 | Headers HTTP sécurité (#8) | S | 🔴 |
| 4 | Validation taille/MIME upload obsèques (#7) | S | 🟠 |
| 5 | Fixer policies RLS profiles via `is_admin()` SECURITY DEFINER (#3, #16) | M | 🔴 |
| 6 | Rate limit + CAPTCHA `/connexion` + `/api/auth/check-email` (#1, #5, #6) | L | 🔴 |
| 7 | Restreindre `send-newsletter` à admin + 1/jour (#4) | S | 🟠 |
| 8 | Open redirect callback (#9) | XS | 🟠 |
| 9 | Validation Zod sur toutes les routes API (#11) | M | 🟡 |
| 10 | Sanitize messages d'erreur (#12) | S | 🟡 |
| 11 | Sandbox iframe Mawaqit (#13) | XS | 🟡 |
| 12 | Reste (LOW + Notes) au fil de l'eau | - | 🟢 |

Effort : XS = <30min, S = 1h, M = 2-4h, L = >1 journée

---

## Suivi global

**Total :** 24 points
**À faire (⏳) :** 24
**En cours (🔧) :** 0
**Corrigés (✅) :** 0
**Reportés (⏭️) :** 0

**Couverture par sévérité :**
- 🔴 CRITICAL : 0/4
- 🟠 HIGH : 0/5
- 🟡 MEDIUM : 0/8
- 🟢 LOW : 0/6
- 🔵 NOTE : 0/1
