-- Migration Assurance Obseques (24 avril 2026)
-- - Nouveau role gestionnaire_obseques dans enum user_role
-- - Enums metier (formule, statut, type_contrat, lien_parente, moyen_paiement, type_document)
-- - Table organismes_obseques + unique partial index (1 seul actif a la fois)
-- - Table adhesions_obseques (fiche principale) + 4 sous-tables (ayants_droit, contacts_urgence, paiements, documents)
-- - RLS : admin + gestionnaire_obseques full CRUD ; visiteur SELECT sur sa propre fiche
-- Idempotent : reexecutable sans erreur
--
-- IMPORTANT :
-- 1. ALTER TYPE ADD VALUE doit s'executer hors transaction (Supabase SQL Editor le fait automatiquement en autocommit)
-- 2. A executer separement : creer le bucket prive `obseques-documents` via Supabase Dashboard > Storage

-- =====================================================
-- 1. Enum user_role : ajout gestionnaire_obseques
-- =====================================================
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'gestionnaire_obseques';

-- =====================================================
-- 2. Enums metier obseques (idempotents via DO block)
-- =====================================================
DO $$ BEGIN
  CREATE TYPE obseques_formule AS ENUM ('inhumation_france', 'rapatriement', 'autre');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE obseques_statut AS ENUM ('actif', 'suspendu', 'resilie', 'deces');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE obseques_type_contrat AS ENUM ('individuel', 'familial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE obseques_lien_parente AS ENUM ('conjoint', 'enfant', 'parent', 'fratrie', 'autre');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE obseques_moyen_paiement AS ENUM ('especes', 'cheque', 'virement', 'cb');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE obseques_type_document AS ENUM ('cni', 'passeport', 'attestation_domicile', 'autre');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================
-- 3. Table organismes_obseques (historique + 1 seul actif)
-- =====================================================
CREATE TABLE IF NOT EXISTS organismes_obseques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  adresse text,
  telephone text,
  email text,
  numero_identification text,
  contact_referent_nom text,
  contact_referent_telephone text,
  contact_referent_email text,
  notes text,
  date_debut_collaboration date NOT NULL DEFAULT CURRENT_DATE,
  date_fin_collaboration date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Contrainte : un seul organisme actif (date_fin IS NULL) a la fois
CREATE UNIQUE INDEX IF NOT EXISTS organismes_obseques_actif_unique
  ON organismes_obseques ((date_fin_collaboration IS NULL))
  WHERE date_fin_collaboration IS NULL;

-- =====================================================
-- 4. Table adhesions_obseques (fiche principale)
-- =====================================================
CREATE TABLE IF NOT EXISTS adhesions_obseques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  organisme_id uuid REFERENCES organismes_obseques(id) ON DELETE SET NULL,
  organisme_nom_historique text NOT NULL,
  reference_contrat text,
  type_contrat obseques_type_contrat NOT NULL DEFAULT 'individuel',
  -- Identite adherent principal
  nom text NOT NULL,
  prenom text NOT NULL,
  date_naissance date,
  lieu_naissance text,
  nationalite text,
  telephone text,
  email text,
  adresse text,
  -- Volontes
  formule obseques_formule NOT NULL DEFAULT 'inhumation_france',
  pays_inhumation text,
  cimetiere_souhaite text,
  instructions_specifiques text,
  -- Cotisation
  cotisation_annuelle numeric(10,2) NOT NULL DEFAULT 0,
  date_adhesion date NOT NULL DEFAULT CURRENT_DATE,
  statut obseques_statut NOT NULL DEFAULT 'actif',
  -- Notes internes
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adhesions_obseques_user_id_idx ON adhesions_obseques(user_id);
CREATE INDEX IF NOT EXISTS adhesions_obseques_statut_idx ON adhesions_obseques(statut);
CREATE INDEX IF NOT EXISTS adhesions_obseques_nom_prenom_idx ON adhesions_obseques(nom, prenom);

-- =====================================================
-- 5. Sous-tables adhesions_obseques
-- =====================================================
CREATE TABLE IF NOT EXISTS adhesions_obseques_ayants_droit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adhesion_id uuid NOT NULL REFERENCES adhesions_obseques(id) ON DELETE CASCADE,
  nom text NOT NULL,
  prenom text NOT NULL,
  date_naissance date,
  lien_parente obseques_lien_parente NOT NULL DEFAULT 'autre',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ayants_droit_adhesion_idx ON adhesions_obseques_ayants_droit(adhesion_id);

CREATE TABLE IF NOT EXISTS adhesions_obseques_contacts_urgence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adhesion_id uuid NOT NULL REFERENCES adhesions_obseques(id) ON DELETE CASCADE,
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text,
  lien_parente obseques_lien_parente NOT NULL DEFAULT 'autre',
  ordre_priorite integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contacts_urgence_adhesion_idx ON adhesions_obseques_contacts_urgence(adhesion_id);

CREATE TABLE IF NOT EXISTS adhesions_obseques_paiements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adhesion_id uuid NOT NULL REFERENCES adhesions_obseques(id) ON DELETE CASCADE,
  montant numeric(10,2) NOT NULL,
  date_paiement date NOT NULL DEFAULT CURRENT_DATE,
  annee_concernee integer NOT NULL,
  moyen_paiement obseques_moyen_paiement NOT NULL DEFAULT 'especes',
  reference_externe text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS paiements_adhesion_idx ON adhesions_obseques_paiements(adhesion_id);
CREATE INDEX IF NOT EXISTS paiements_annee_idx ON adhesions_obseques_paiements(annee_concernee);

CREATE TABLE IF NOT EXISTS adhesions_obseques_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adhesion_id uuid NOT NULL REFERENCES adhesions_obseques(id) ON DELETE CASCADE,
  url text NOT NULL,
  type obseques_type_document NOT NULL DEFAULT 'autre',
  nom_fichier text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_adhesion_idx ON adhesions_obseques_documents(adhesion_id);

-- =====================================================
-- 6. Fonction helper : is_obseques_manager()
-- =====================================================
CREATE OR REPLACE FUNCTION is_obseques_manager() RETURNS boolean
  LANGUAGE sql SECURITY DEFINER STABLE
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('administrateur', 'gestionnaire_obseques')
  );
$$;

-- =====================================================
-- 7. RLS organismes_obseques
-- =====================================================
ALTER TABLE organismes_obseques ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organismes_manager_read" ON organismes_obseques;
CREATE POLICY "organismes_manager_read" ON organismes_obseques
  FOR SELECT TO authenticated USING (is_obseques_manager());

DROP POLICY IF EXISTS "organismes_manager_insert" ON organismes_obseques;
CREATE POLICY "organismes_manager_insert" ON organismes_obseques
  FOR INSERT TO authenticated WITH CHECK (is_obseques_manager());

DROP POLICY IF EXISTS "organismes_manager_update" ON organismes_obseques;
CREATE POLICY "organismes_manager_update" ON organismes_obseques
  FOR UPDATE TO authenticated USING (is_obseques_manager());

DROP POLICY IF EXISTS "organismes_manager_delete" ON organismes_obseques;
CREATE POLICY "organismes_manager_delete" ON organismes_obseques
  FOR DELETE TO authenticated USING (is_obseques_manager());

-- =====================================================
-- 8. RLS adhesions_obseques (+ sous-tables : acces manager + proprietaire pour SELECT)
-- =====================================================
ALTER TABLE adhesions_obseques ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "adhesions_manager_read" ON adhesions_obseques;
CREATE POLICY "adhesions_manager_read" ON adhesions_obseques
  FOR SELECT TO authenticated USING (is_obseques_manager());

DROP POLICY IF EXISTS "adhesions_owner_read" ON adhesions_obseques;
CREATE POLICY "adhesions_owner_read" ON adhesions_obseques
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "adhesions_manager_insert" ON adhesions_obseques;
CREATE POLICY "adhesions_manager_insert" ON adhesions_obseques
  FOR INSERT TO authenticated WITH CHECK (is_obseques_manager());

DROP POLICY IF EXISTS "adhesions_manager_update" ON adhesions_obseques;
CREATE POLICY "adhesions_manager_update" ON adhesions_obseques
  FOR UPDATE TO authenticated USING (is_obseques_manager());

DROP POLICY IF EXISTS "adhesions_manager_delete" ON adhesions_obseques;
CREATE POLICY "adhesions_manager_delete" ON adhesions_obseques
  FOR DELETE TO authenticated USING (is_obseques_manager());

-- Sous-tables : RLS basee sur l'acces a l'adhesion parente
ALTER TABLE adhesions_obseques_ayants_droit ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhesions_obseques_contacts_urgence ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhesions_obseques_paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhesions_obseques_documents ENABLE ROW LEVEL SECURITY;

-- Ayants droit
DROP POLICY IF EXISTS "ayants_droit_manager_all" ON adhesions_obseques_ayants_droit;
CREATE POLICY "ayants_droit_manager_all" ON adhesions_obseques_ayants_droit
  FOR ALL TO authenticated USING (is_obseques_manager()) WITH CHECK (is_obseques_manager());
DROP POLICY IF EXISTS "ayants_droit_owner_read" ON adhesions_obseques_ayants_droit;
CREATE POLICY "ayants_droit_owner_read" ON adhesions_obseques_ayants_droit
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM adhesions_obseques a WHERE a.id = adhesion_id AND a.user_id = auth.uid())
  );

-- Contacts urgence
DROP POLICY IF EXISTS "contacts_manager_all" ON adhesions_obseques_contacts_urgence;
CREATE POLICY "contacts_manager_all" ON adhesions_obseques_contacts_urgence
  FOR ALL TO authenticated USING (is_obseques_manager()) WITH CHECK (is_obseques_manager());
DROP POLICY IF EXISTS "contacts_owner_read" ON adhesions_obseques_contacts_urgence;
CREATE POLICY "contacts_owner_read" ON adhesions_obseques_contacts_urgence
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM adhesions_obseques a WHERE a.id = adhesion_id AND a.user_id = auth.uid())
  );

-- Paiements
DROP POLICY IF EXISTS "paiements_manager_all" ON adhesions_obseques_paiements;
CREATE POLICY "paiements_manager_all" ON adhesions_obseques_paiements
  FOR ALL TO authenticated USING (is_obseques_manager()) WITH CHECK (is_obseques_manager());
DROP POLICY IF EXISTS "paiements_owner_read" ON adhesions_obseques_paiements;
CREATE POLICY "paiements_owner_read" ON adhesions_obseques_paiements
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM adhesions_obseques a WHERE a.id = adhesion_id AND a.user_id = auth.uid())
  );

-- Documents
DROP POLICY IF EXISTS "documents_manager_all" ON adhesions_obseques_documents;
CREATE POLICY "documents_manager_all" ON adhesions_obseques_documents
  FOR ALL TO authenticated USING (is_obseques_manager()) WITH CHECK (is_obseques_manager());
DROP POLICY IF EXISTS "documents_owner_read" ON adhesions_obseques_documents;
CREATE POLICY "documents_owner_read" ON adhesions_obseques_documents
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM adhesions_obseques a WHERE a.id = adhesion_id AND a.user_id = auth.uid())
  );
