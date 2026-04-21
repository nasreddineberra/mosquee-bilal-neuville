-- Migration Inscriptions - Contexte (21 avril 2026)
-- Ajout des colonnes pour gerer les 3 workflows d'inscription :
--   - Cours Mosquee : user_id seul (self-inscription, 1 user = N inscriptions possibles)
--   - Ecole Arabe : user_id (parent) + enfants jsonb [{ prenom, nom, date_naissance, niveau }]
--   - Sorties : user_id + nb_participants (famille entiere)
-- adresse : en plus de celle du profil, utilisee pour contact specifique inscription

ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS enfants jsonb;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS nb_participants integer;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS adresse text;

CREATE INDEX IF NOT EXISTS inscriptions_user_id_idx ON inscriptions(user_id);
CREATE INDEX IF NOT EXISTS inscriptions_activite_idx ON inscriptions(activite_type, activite_id);
