-- Migration Demandes d'accès - Contact (21 avril 2026)
-- Ajout telephone + adresse sur demandes_acces pour :
--   - Collecter les infos contact dès la demande
--   - Pré-remplir le profil lors de la validation (création auth user)

ALTER TABLE demandes_acces ADD COLUMN telephone text;
ALTER TABLE demandes_acces ADD COLUMN adresse text;
