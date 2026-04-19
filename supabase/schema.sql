-- ============================================================
-- MOSQUÉE BILAL — Schema SQL
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('administrateur', 'editeur', 'visiteur');
CREATE TYPE article_category AS ENUM ('Vie de la mosquée', 'Événements', 'Cours', 'Communauté');
CREATE TYPE demande_statut AS ENUM ('en_attente', 'validee', 'refusee');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       user_role NOT NULL DEFAULT 'visiteur',
  nom        TEXT,
  prenom     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture profil personnel" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Lecture tous profils - admins" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );

CREATE POLICY "Modification profil personnel" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger : création automatique du profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ARTICLES
-- ============================================================
CREATE TABLE articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre            TEXT NOT NULL,
  summary          TEXT NOT NULL,
  contenu          TEXT NOT NULL,
  category         article_category NOT NULL,
  actif            BOOLEAN NOT NULL DEFAULT FALSE,
  a_la_une         BOOLEAN NOT NULL DEFAULT FALSE,
  date_parution    DATE NOT NULL DEFAULT CURRENT_DATE,
  date_expiration  DATE,
  position         INTEGER NOT NULL DEFAULT 0,
  created_by       UUID REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique articles actifs" ON articles
  FOR SELECT USING (actif = TRUE);

CREATE POLICY "Lecture tous articles - admins et editeurs" ON articles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrateur', 'editeur'))
  );

CREATE POLICY "Écriture articles - admins et editeurs" ON articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrateur', 'editeur'))
  );

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expediteur_id    UUID REFERENCES profiles(id),
  destinataire_id  UUID REFERENCES profiles(id), -- NULL = broadcast
  sujet            TEXT NOT NULL,
  contenu          TEXT NOT NULL,
  lu               BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture messages personnels" ON messages
  FOR SELECT USING (
    auth.uid() = expediteur_id OR
    auth.uid() = destinataire_id OR
    destinataire_id IS NULL OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrateur', 'editeur'))
  );

CREATE POLICY "Écriture messages - admins et editeurs" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrateur', 'editeur'))
  );

-- ============================================================
-- ACTIVITÉS — COURS MOSQUÉE + TAJWID
-- ============================================================
CREATE TABLE activites_cours_tajwid (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre         TEXT NOT NULL,
  description   TEXT,
  niveau        TEXT,
  horaire       TEXT,
  places_max    INTEGER,
  places_prises INTEGER NOT NULL DEFAULT 0,
  actif         BOOLEAN NOT NULL DEFAULT FALSE,
  date_debut    DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activites_cours_tajwid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique cours actifs" ON activites_cours_tajwid
  FOR SELECT USING (actif = TRUE);

CREATE POLICY "Gestion cours - admins" ON activites_cours_tajwid
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );

-- ============================================================
-- ACTIVITÉS — ÉCOLE ARABE
-- ============================================================
CREATE TABLE activites_ecole_arabe (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre         TEXT NOT NULL,
  description   TEXT,
  niveau        TEXT,
  horaire       TEXT,
  places_max    INTEGER,
  places_prises INTEGER NOT NULL DEFAULT 0,
  actif         BOOLEAN NOT NULL DEFAULT FALSE,
  date_debut    DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activites_ecole_arabe ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique école arabe actifs" ON activites_ecole_arabe
  FOR SELECT USING (actif = TRUE);

CREATE POLICY "Gestion école arabe - admins" ON activites_ecole_arabe
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );

-- ============================================================
-- ACTIVITÉS — SORTIES
-- ============================================================
CREATE TABLE activites_sorties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       TEXT NOT NULL,
  description TEXT,
  date_sortie DATE,
  lieu        TEXT,
  places_max  INTEGER,
  tarif       NUMERIC(10,2),
  actif       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activites_sorties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique sorties actives" ON activites_sorties
  FOR SELECT USING (actif = TRUE);

CREATE POLICY "Gestion sorties - admins" ON activites_sorties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );

-- ============================================================
-- DONS
-- ============================================================
CREATE TABLE dons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre         TEXT NOT NULL,
  texte         TEXT,
  lien_externe  TEXT NOT NULL,
  a_la_une      BOOLEAN NOT NULL DEFAULT FALSE,
  actif         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique dons actifs" ON dons
  FOR SELECT USING (actif = TRUE);

CREATE POLICY "Gestion dons - admins" ON dons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );

-- ============================================================
-- DEMANDES D'ACCÈS
-- ============================================================
CREATE TABLE demandes_acces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  nom         TEXT NOT NULL,
  prenom      TEXT NOT NULL,
  message     TEXT,
  statut      demande_statut NOT NULL DEFAULT 'en_attente',
  traite_par  UUID REFERENCES profiles(id),
  traite_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE demandes_acces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertion demandes - public" ON demandes_acces
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Lecture demandes - admins" ON demandes_acces
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );

CREATE POLICY "Modification demandes - admins" ON demandes_acces
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur')
  );
