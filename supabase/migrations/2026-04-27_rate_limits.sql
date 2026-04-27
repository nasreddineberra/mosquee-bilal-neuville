-- Rate limiting pour les actions admin (envois d'emails, invitations)
-- Chaque ligne représente une action effectuée par un admin à un instant T
-- Le cleanup est fait automatiquement par la fonction checkRateLimit

CREATE TABLE IF NOT EXISTS _rate_limits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes de comptage rapides
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON _rate_limits (admin_id, action_name, created_at DESC);

-- Index pour le cleanup automatique (supprimer les entrées > 24h)
CREATE INDEX IF NOT EXISTS idx_rate_limits_cleanup
  ON _rate_limits (created_at ASC);
