// ─── Rôles utilisateur ──────────────────────────────────────────────────────
// Hiérarchie : tout administrateur / editeur / gestionnaire_obseques est aussi visiteur.
// Toute modification de rôles dans la base de données doit être répercutée ici.

export type UserRole = 'administrateur' | 'editeur' | 'gestionnaire_obseques' | 'visiteur';

export const ALL_ROLES: UserRole[] = [
  'administrateur',
  'editeur',
  'gestionnaire_obseques',
  'visiteur',
];

export const INVITABLE_ROLES: UserRole[] = [
  'administrateur',
  'editeur',
  'gestionnaire_obseques',
];

export const ADMIN_ONLY_ROLES: UserRole[] = [
  'administrateur',
];

export const EDITOR_ROLES: UserRole[] = [
  'administrateur',
  'editeur',
];

/**
 * Vérifie si un rôle fait partie des rôles "visiteur+".
 * Un administrateur, editeur ou gestionnaire_obseques est aussi un visiteur.
 */
export function isRole(role: string | null | undefined, target: UserRole): boolean {
  return role === target;
}

/**
 * Vérifie si un rôle est au moins visiteur (tous les rôles le sont).
 * Retourne true pour n'importe quel rôle valide.
 */
export function isAtLeastVisiteur(role: string | null | undefined): boolean {
  if (!role) return false;
  return (ALL_ROLES as readonly string[]).includes(role);
}

/**
 * Vérifie si un rôle est un rôle "administration" (non visiteur).
 * Un administrateur, editeur ou gestionnaire_obseques est considéré comme membre admin.
 */
export function isAdminRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return (INVITABLE_ROLES as readonly string[]).includes(role as UserRole);
}
