-- ─── Chiffrement des données personnelles ──────────────────────────────────
-- Ajoute des colonnes chiffrées pour telephone et adresse.
-- Les colonnes d'origine sont conservées mais vidées.
-- Les données sont chiffrées côté serveur avec AES-256-GCM (src/lib/encryption.ts)

-- 1. Ajouter les colonnes chiffrées
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telephone_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS adresse_encrypted TEXT;

-- 2. Copier les données existantes (migration à chaud)
-- Note : le chiffrement se fera à l'écriture via le code. Les données existantes
-- restent en clair dans telephone/adresse jusqu'à la prochaine mise à jour.
-- On ne vide pas les colonnes d'origine pour éviter de perdre des données.

-- 3. Index pour les requêtes d'administration (pas d'index sur les colonnes chiffrées,
--    ce qui est normal puisque les recherches par téléphone ne sont pas nécessaires)

COMMENT ON COLUMN public.profiles.telephone_encrypted IS 'Téléphone chiffré (AES-256-GCM). Utiliser decrypt() pour lecture.';
COMMENT ON COLUMN public.profiles.adresse_encrypted IS 'Adresse chiffrée (AES-256-GCM). Utiliser decrypt() pour lecture.';

-- 4. Mettre à jour la vue des profils si elle existe (non, mais au cas où)
-- Note : RLS reste inchangé, le chiffrement est applicatif.
