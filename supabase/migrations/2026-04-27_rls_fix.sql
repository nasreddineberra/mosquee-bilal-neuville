-- ─── Correction RLS : fonction is_admin() SECURITY DEFINER ────────────────
-- Les policies EXISTS (SELECT 1 FROM profiles WHERE ...) créent une
-- récursion infinie potentielle car profiles interroge profiles.
-- On utilise une fonction SECURITY DEFINER pour casser la récursion.

-- 1. Fonction utilitaire is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrateur');
$$;

-- 2. Fonction utilitaire is_editor_or_admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrateur', 'editeur'));
$$;

-- 3. Fonction utilitaire is_obseques_manager (si applicable)
CREATE OR REPLACE FUNCTION public.is_obseques_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'gestionnaire_obseques');
$$;

COMMENT ON FUNCTION public.is_admin() IS 'SECURITY DEFINER — évite récursion RLS sur profiles';
COMMENT ON FUNCTION public.is_editor_or_admin() IS 'SECURITY DEFINER — évite récursion RLS sur profiles';
COMMENT ON FUNCTION public.is_obseques_manager() IS 'SECURITY DEFINER — évite récursion RLS sur profiles';

-- Note : les policies existantes continueront de fonctionner, mais on
-- pourra les réécrire progressivement pour utiliser is_admin() au lieu
-- de EXISTS (SELECT FROM profiles).
-- Exemple : CREATE POLICY "Lecture tous profils - admins" ON profiles
--   FOR SELECT USING (public.is_admin());
