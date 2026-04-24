-- Ajout numero_contrat (contrat cadre entre la mosquee et l'organisme partenaire)
-- Distinct de :
-- - organismes_obseques.numero_identification (SIRET de l'organisme)
-- - adhesions_obseques.reference_contrat (numero de police individuelle chez l'organisme)
-- Idempotent

ALTER TABLE organismes_obseques ADD COLUMN IF NOT EXISTS numero_contrat text;
