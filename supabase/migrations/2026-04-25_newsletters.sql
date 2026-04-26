-- Historique des newsletters envoyees
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sujet TEXT NOT NULL,
  corps TEXT NOT NULL,
  expediteur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nb_destinataires INTEGER NOT NULL DEFAULT 0,
  date_envoi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletters_date_envoi
  ON newsletters (date_envoi DESC);

ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletters_admin_editeur_all" ON newsletters;
CREATE POLICY "newsletters_admin_editeur_all"
  ON newsletters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('administrateur', 'editeur')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('administrateur', 'editeur')
    )
  );
