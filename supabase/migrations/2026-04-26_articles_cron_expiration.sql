-- Cron quotidien : desactivation automatique des articles expires
-- Met actif=false sur les articles dont la date_expiration est passee
-- Aucune suppression : le contenu est conserve, seulement la visibilite publique change

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Supprimer le job s'il existe deja (pour permettre re-execution de cette migration)
SELECT cron.unschedule('expire-articles')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-articles');

-- Programmation quotidienne a 02h00 UTC (~ 04h00 Paris ete / 03h00 hiver)
SELECT cron.schedule(
  'expire-articles',
  '0 2 * * *',
  $$
    UPDATE articles
    SET actif = false
    WHERE actif = true
      AND date_expiration IS NOT NULL
      AND date_expiration < CURRENT_DATE;
  $$
);
