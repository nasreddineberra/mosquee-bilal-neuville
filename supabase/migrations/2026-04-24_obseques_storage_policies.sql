-- Policies RLS du bucket `obseques-documents` (24 avril 2026)
-- Convention de nommage : fichiers stockes sous `{adhesion_id}/{uuid}.{ext}`
-- La racine = adhesion_id (uuid), recuperable via storage.foldername(name)[1]
--
-- Droits :
-- - Manager (admin + gestionnaire_obseques) : CRUD total
-- - Proprietaire (user_id lie a l'adhesion) : SELECT uniquement
-- - Autres : aucun acces
--
-- Idempotent : reexecutable sans erreur

-- =====================================================
-- Manager (admin + gestionnaire_obseques) : full CRUD
-- =====================================================
DROP POLICY IF EXISTS "obseques_docs_manager_select" ON storage.objects;
CREATE POLICY "obseques_docs_manager_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'obseques-documents'
    AND is_obseques_manager()
  );

DROP POLICY IF EXISTS "obseques_docs_manager_insert" ON storage.objects;
CREATE POLICY "obseques_docs_manager_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'obseques-documents'
    AND is_obseques_manager()
  );

DROP POLICY IF EXISTS "obseques_docs_manager_update" ON storage.objects;
CREATE POLICY "obseques_docs_manager_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'obseques-documents'
    AND is_obseques_manager()
  );

DROP POLICY IF EXISTS "obseques_docs_manager_delete" ON storage.objects;
CREATE POLICY "obseques_docs_manager_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'obseques-documents'
    AND is_obseques_manager()
  );

-- =====================================================
-- Proprietaire : SELECT uniquement sur ses propres docs
-- Path convention : `{adhesion_id}/{filename}` ou adhesion_id = premier niveau
-- =====================================================
DROP POLICY IF EXISTS "obseques_docs_owner_select" ON storage.objects;
CREATE POLICY "obseques_docs_owner_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'obseques-documents'
    AND EXISTS (
      SELECT 1 FROM adhesions_obseques a
      WHERE a.id::text = (storage.foldername(name))[1]
        AND a.user_id = auth.uid()
    )
  );
