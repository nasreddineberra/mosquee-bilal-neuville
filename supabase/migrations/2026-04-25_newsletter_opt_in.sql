-- Newsletter opt-in (consentement explicite RGPD)
-- Ajoute la colonne sur profiles ET demandes_acces (pour capturer le choix des l'inscription)

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE demandes_acces
  ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN NOT NULL DEFAULT false;

-- Index pour requete admin "envoyer newsletter aux abonnes"
CREATE INDEX IF NOT EXISTS idx_profiles_newsletter
  ON profiles (newsletter_opt_in)
  WHERE newsletter_opt_in = true;

-- RLS : tout utilisateur peut mettre a jour son propre opt-in
-- (les policies existantes sur profiles permettent deja l'update du proprietaire)
