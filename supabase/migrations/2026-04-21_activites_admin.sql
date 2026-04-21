-- Migration Activites - Admin (21 avril 2026)

-- === Etape 1 (deja executee) : rename, enum statut, colonnes position, table inscriptions ===

-- CREATE TYPE activite_statut AS ENUM ('ouvert', 'complet', 'bientot');
--
-- ALTER TABLE activites_cours_tajwid RENAME TO activites_cours_mosquee;
-- ALTER TABLE activites_cours_mosquee ADD COLUMN type text NOT NULL DEFAULT 'Tajwid';
-- ALTER TABLE activites_cours_mosquee ADD COLUMN statut activite_statut NOT NULL DEFAULT 'ouvert';
-- ALTER TABLE activites_cours_mosquee ADD COLUMN position integer NOT NULL DEFAULT 0;
--
-- ALTER TABLE activites_ecole_arabe RENAME COLUMN niveau TO categorie;
-- ALTER TABLE activites_ecole_arabe ADD COLUMN statut activite_statut NOT NULL DEFAULT 'ouvert';
-- ALTER TABLE activites_ecole_arabe ADD COLUMN position integer NOT NULL DEFAULT 0;
--
-- ALTER TABLE activites_sorties ADD COLUMN statut activite_statut NOT NULL DEFAULT 'ouvert';
-- ALTER TABLE activites_sorties ADD COLUMN places_prises integer NOT NULL DEFAULT 0;
-- ALTER TABLE activites_sorties ADD COLUMN position integer NOT NULL DEFAULT 0;
--
-- CREATE TYPE inscription_type AS ENUM ('cours_mosquee', 'ecole_arabe', 'sorties');
-- CREATE TYPE inscription_statut AS ENUM ('en_attente', 'validee', 'refusee', 'annulee');
--
-- CREATE TABLE inscriptions (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   activite_type inscription_type NOT NULL,
--   activite_id uuid NOT NULL,
--   nom text NOT NULL,
--   prenom text NOT NULL,
--   email text NOT NULL,
--   telephone text,
--   message text,
--   statut inscription_statut NOT NULL DEFAULT 'en_attente',
--   created_at timestamptz NOT NULL DEFAULT now()
-- );
--
-- ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "insert public" ON inscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);
-- CREATE POLICY "admin read" ON inscriptions FOR SELECT USING (is_admin());
-- CREATE POLICY "admin update" ON inscriptions FOR UPDATE USING (is_admin());
-- CREATE POLICY "admin delete" ON inscriptions FOR DELETE USING (is_admin());

-- === Etape 2 : tarif optionnel sur Cours Mosquee et Ecole Arabe ===

ALTER TABLE activites_cours_mosquee ADD COLUMN tarif numeric(10,2);
ALTER TABLE activites_ecole_arabe   ADD COLUMN tarif numeric(10,2);

-- === Etape 3 : renommer date_debut -> date_debut_cours (clarification) ===

ALTER TABLE activites_cours_mosquee RENAME COLUMN date_debut TO date_debut_cours;
ALTER TABLE activites_ecole_arabe   RENAME COLUMN date_debut TO date_debut_cours;

-- === Etape 4 : donnees demo Ecole Arabe (4 entrees) et Sorties (3 entrees) ===

INSERT INTO activites_ecole_arabe (titre, categorie, horaire, date_debut_cours, places_max, places_prises, statut, tarif, actif, position)
VALUES
  ('Arabe enfants debutants',     'Enfants (6-10 ans)',      'Mercredi 14h-16h',      '2026-09-09', 20,  8, 'ouvert',  80,  true, 0),
  ('Arabe enfants intermediaire', 'Enfants (11-15 ans)',     'Mercredi 16h-18h',      '2026-09-09', 20, 14, 'ouvert',  80,  true, 1),
  ('Arabe adultes debutants',     'Adultes debutants',       'Dimanche 10h-11h30',    '2026-09-13', 15,  6, 'ouvert',  120, true, 2),
  ('Arabe adultes intermediaire', 'Adultes intermediaire',   'Dimanche 11h30-13h',    '2026-09-13', 15, 15, 'complet', 120, true, 3);

INSERT INTO activites_sorties (titre, description, date_sortie, lieu, places_max, places_prises, tarif, statut, actif, position)
VALUES
  ('Parc de la Tete d Or',   'Journee detente en famille au parc, pique-nique partage.',        '2026-04-26', 'Lyon 6e',             30, 18, 0,   'ouvert', true, 0),
  ('Journee nature',         'Randonnee et activites plein air pour toute la famille.',         '2026-05-17', 'Monts du Lyonnais',   25,  5, 10,  'ouvert', true, 1),
  ('Visite musee',           'Decouverte guidee du Musee des Confluences, adaptee aux enfants.','2026-06-07', 'Musee des Confluences', 20, 0, 8,  'bientot', true, 2);
