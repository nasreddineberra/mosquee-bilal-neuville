-- Migration Dons - Contenu (22 avril 2026)
-- - Rename texte -> description (si existant)
-- - Ajout resume (70 char cote app), date_parution, position
-- - Un seul don peut etre a_la_une (unique index partiel)
-- Idempotent : reexecutable sans erreur

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dons' AND column_name = 'texte'
  ) THEN
    ALTER TABLE dons RENAME COLUMN texte TO description;
  END IF;
END $$;

ALTER TABLE dons ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE dons ADD COLUMN IF NOT EXISTS resume text;
ALTER TABLE dons ADD COLUMN IF NOT EXISTS date_parution date DEFAULT CURRENT_DATE;
ALTER TABLE dons ADD COLUMN IF NOT EXISTS position integer;
ALTER TABLE dons ADD COLUMN IF NOT EXISTS image_id uuid REFERENCES images(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS dons_unique_a_la_une
  ON dons(a_la_une) WHERE a_la_une = true;

CREATE INDEX IF NOT EXISTS dons_position_idx ON dons(position);
