-- Migration Profiles - Inscription visiteurs (21 avril 2026)
-- Ajout des colonnes telephone et adresse sur profiles pour :
--   - Pré-remplir les formulaires d'inscription (Cours Mosquée, École Arabe, Sorties)
--   - Gestion du profil visiteur via ProfileModal (header)

ALTER TABLE profiles ADD COLUMN telephone text;
ALTER TABLE profiles ADD COLUMN adresse text;
