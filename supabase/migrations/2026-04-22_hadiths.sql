-- Migration Hadiths (22 avril 2026)
-- Table hadiths + RLS (lecture publique si actif, write admin/editeur) + seed 7 hadiths
-- Idempotent : reexecutable sans erreur

CREATE TABLE IF NOT EXISTS hadiths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  texte text NOT NULL,
  narrateur text,
  source text,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hadiths_actif_idx ON hadiths(actif);

ALTER TABLE hadiths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hadiths_public_read" ON hadiths;
CREATE POLICY "hadiths_public_read" ON hadiths
  FOR SELECT USING (actif = true);

DROP POLICY IF EXISTS "hadiths_admin_editor_read_all" ON hadiths;
CREATE POLICY "hadiths_admin_editor_read_all" ON hadiths
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('administrateur', 'editeur'))
  );

DROP POLICY IF EXISTS "hadiths_admin_editor_insert" ON hadiths;
CREATE POLICY "hadiths_admin_editor_insert" ON hadiths
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('administrateur', 'editeur'))
  );

DROP POLICY IF EXISTS "hadiths_admin_editor_update" ON hadiths;
CREATE POLICY "hadiths_admin_editor_update" ON hadiths
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('administrateur', 'editeur'))
  );

DROP POLICY IF EXISTS "hadiths_admin_editor_delete" ON hadiths;
CREATE POLICY "hadiths_admin_editor_delete" ON hadiths
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('administrateur', 'editeur'))
  );

-- Seed uniquement si la table est vide
INSERT INTO hadiths (texte, narrateur, source, actif)
SELECT * FROM (VALUES
  ('Les actes ne valent que par leurs intentions, et chaque personne ne sera recompensee que selon ce qu''elle aura eu en vue.', 'Omar ibn Al-Khattab (رضي الله عنه)', 'Al-Bukhari n°1 & Muslim n°1907', true),
  ('Nul d''entre vous ne croit vraiment que lorsqu''il aime pour son frere ce qu''il aime pour lui-meme.', 'Anas ibn Malik (رضي الله عنه)', 'Al-Bukhari n°13 & Muslim n°45', true),
  ('Le musulman est celui dont les autres musulmans sont en paix, de sa langue et de sa main.', 'Abdullah ibn Amr (رضي الله عنه)', 'Al-Bukhari n°10 & Muslim n°40', true),
  ('Celui qui croit en Allah et au Jour Dernier, qu''il dise du bien ou qu''il se taise.', 'Abu Hurayra (رضي الله عنه)', 'Al-Bukhari n°6018 & Muslim n°47', true),
  ('Faites le bien de maniere parfaite, car Allah a prescrit de bien faire toute chose.', 'Shaddad ibn Aws (رضي الله عنه)', 'Muslim n°1955', true),
  ('La religion, c''est le conseil sincere.', 'Tamim Ad-Dari (رضي الله عنه)', 'Muslim n°55', true),
  ('Ce qui est licite est clair, et ce qui est illicite est clair, et entre les deux se trouvent des choses douteuses que beaucoup de gens ignorent.', 'An-Nu''man ibn Bashir (رضي الله عنه)', 'Al-Bukhari n°52 & Muslim n°1596', true)
) AS t(texte, narrateur, source, actif)
WHERE NOT EXISTS (SELECT 1 FROM hadiths);
