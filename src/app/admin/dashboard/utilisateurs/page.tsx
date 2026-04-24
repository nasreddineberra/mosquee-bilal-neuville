'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Mail, Shield, Plus, Trash2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { FloatInput, FloatSelect } from '@/components/FloatField';

type Role = 'administrateur' | 'editeur' | 'gestionnaire_obseques';

type Utilisateur = {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  role: Role;
  created_at: string;
};

const ROLE_META: Record<Role, { label: string; badge: string }> = {
  administrateur: { label: 'Administrateur', badge: 'bg-primary text-on-primary' },
  editeur: { label: 'Éditeur', badge: 'bg-tertiary text-white' },
  gestionnaire_obseques: { label: 'Gestionnaire obsèques', badge: 'bg-secondary text-white' },
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function UtilisateursAdminPage() {
  const supabase = createClient();
  const { user } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [downgradeUser, setDowngradeUser] = useState<Utilisateur | null>(null);

  // Modale ajout
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', role: 'editeur' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const fetchUtilisateurs = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, email, prenom, nom, role, created_at')
      .in('role', ['administrateur', 'editeur', 'gestionnaire_obseques'])
      .order('created_at', { ascending: false });
    if (err) {
      setError('Impossible de charger les utilisateurs.');
    } else {
      setUtilisateurs((data ?? []) as Utilisateur[]);
      setError('');
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchUtilisateurs(); }, [fetchUtilisateurs]);

  const updateRole = async (userId: string, role: Role | 'visiteur') => {
    setProcessingId(userId);
    setError('');
    const res = await fetch('/api/admin/update-user-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    const json = await res.json();
    setProcessingId(null);
    if (!res.ok) { setError(json.error || 'Erreur.'); return; }
    fetchUtilisateurs();
  };

  const handleDowngrade = async () => {
    if (!downgradeUser) return;
    await updateRole(downgradeUser.id, 'visiteur');
    setDowngradeUser(null);
  };

  const handleRoleSelectChange = (u: Utilisateur, value: string) => {
    if (value === 'visiteur') {
      setDowngradeUser(u);
    } else {
      updateRole(u.id, value as Role);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setProcessingId(deleteId);
    const res = await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: deleteId }),
    });
    const json = await res.json();
    setProcessingId(null);
    setDeleteId(null);
    if (!res.ok) { setError(json.error || 'Erreur lors de la suppression.'); return; }
    fetchUtilisateurs();
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    const res = await fetch('/api/admin/invite-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addForm.email.trim().toLowerCase(), role: addForm.role }),
    });
    const json = await res.json();
    setAddLoading(false);
    if (!res.ok) { setAddError(json.error || 'Erreur lors de l\'invitation.'); return; }
    setAddSuccess(`Invitation envoyée à ${addForm.email}.`);
    setAddForm({ email: '', role: 'editeur' });
    fetchUtilisateurs();
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? utilisateurs.filter((u) => `${u.prenom ?? ''} ${u.nom ?? ''} ${u.email}`.toLowerCase().includes(q))
    : utilisateurs;

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Gestion des utilisateurs
          </h1>
          <p className="text-on-surface/60 font-medium">Administrateurs, éditeurs et gestionnaires obsèques du back-office.</p>
        </div>
        <button
          onClick={() => { setAddOpen(true); setAddError(''); setAddSuccess(''); }}
          className="flex items-center gap-2 card-green text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[var(--color-card-border)]">
        <div className="px-8 py-6 flex items-center justify-between gap-4 border-b border-outline-variant/10">
          <h3 className="text-lg font-bold text-on-surface">Comptes</h3>
          <div className="w-56">
            <FloatInput id="search-utilisateurs" label="Rechercher…" value={search} onChange={setSearch} compact />
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-4 bg-error-container/20 border border-error/20 rounded-xl p-3">
            <p className="text-error text-sm text-center">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="card-green text-[10px] uppercase tracking-widest font-extrabold text-white/70">
              <tr>
                <th className="px-8 py-1.5">Utilisateur</th>
                <th className="px-4 py-1.5">Inscrit le</th>
                <th className="px-4 py-1.5">Rôle</th>
                <th className="px-8 py-1.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-8 text-center text-sm text-on-surface/60">Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-8 text-center text-sm text-on-surface/60">Aucun utilisateur.</td></tr>
              ) : (
                filtered.map((u) => {
                  const isMe = user?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-8 py-1.5">
                        <p className="text-sm font-bold text-on-surface flex items-center gap-2">
                          {u.prenom || u.nom ? `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() : <span className="text-on-surface/40">—</span>}
                          {isMe && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Vous</span>}
                        </p>
                        <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" /> {u.email}
                        </p>
                      </td>
                      <td className="px-4 py-1.5">
                        <p className="text-xs text-on-surface/70">{formatDate(u.created_at)}</p>
                      </td>
                      <td className="px-4 py-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-flex items-center gap-1 ${ROLE_META[u.role].badge}`}>
                          <Shield className="w-3 h-3" />
                          {ROLE_META[u.role].label}
                        </span>
                      </td>
                      <td className="px-8 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isMe ? (
                            <span className="text-xs text-on-surface/30">—</span>
                          ) : (
                            <>
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleSelectChange(u, e.target.value)}
                                disabled={processingId === u.id}
                                className="px-3 py-1.5 text-xs font-medium rounded-full bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                              >
                                <option value="editeur">Éditeur</option>
                                <option value="gestionnaire_obseques">Gestionnaire obsèques</option>
                                <option value="administrateur">Administrateur</option>
                                <option value="visiteur">— Retirer les droits (visiteur)</option>
                              </select>
                              <button
                                onClick={() => setDeleteId(u.id)}
                                disabled={processingId === u.id}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface/40 hover:bg-error/10 hover:text-error transition-colors disabled:opacity-50"
                                aria-label="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale ajout */}
      {addOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md animate-slide-up border border-primary">
            <div className="card-green rounded-t-2xl p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Inviter un utilisateur</h2>
              {!addLoading && (
                <button onClick={() => setAddOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" aria-label="Fermer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              {addSuccess ? (
                <div className="text-center py-4">
                  <p className="text-sm text-primary font-medium">{addSuccess}</p>
                  <button onClick={() => setAddOpen(false)} className="mt-4 card-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95">Fermer</button>
                </div>
              ) : (
                <form onSubmit={handleAdd} className="space-y-4">
                  <FloatInput id="add-email" label="Email" type="email" value={addForm.email} onChange={(v) => setAddForm({ ...addForm, email: v })} required transform="lowercase" />
                  <FloatSelect
                    id="add-role"
                    label="Rôle"
                    value={addForm.role}
                    onChange={(v) => setAddForm({ ...addForm, role: v })}
                    required
                    options={[
                      { value: 'editeur', label: 'Éditeur' },
                      { value: 'gestionnaire_obseques', label: 'Gestionnaire obsèques' },
                      { value: 'administrateur', label: 'Administrateur' },
                    ]}
                  />
                  {addError && (
                    <div className="bg-error-container/20 border border-error/20 rounded-xl p-3">
                      <p className="text-error text-sm">{addError}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setAddOpen(false)} disabled={addLoading} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
                    <button type="submit" disabled={!isEmailValid || addLoading} className={`px-8 py-2.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${isEmailValid && !addLoading ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}>
                      {addLoading ? 'Envoi…' : 'Inviter'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale confirmation rétrogradation en visiteur */}
      {downgradeUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-up border border-[var(--color-card-border)]">
            <Shield className="w-10 h-10 text-tertiary mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Retirer les droits ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">
              <strong>{downgradeUser.prenom ?? ''} {downgradeUser.nom ?? ''}</strong> deviendra un simple visiteur et n&apos;apparaîtra plus dans cette liste. Le compte sera retrouvé dans <strong>Gestion des visiteurs → Comptes visiteurs</strong>.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDowngradeUser(null)} disabled={!!processingId} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleDowngrade} disabled={!!processingId} className="px-6 py-2.5 rounded-full text-sm font-bold bg-tertiary text-white hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                {processingId ? 'Traitement…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale confirmation suppression */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-up border border-[var(--color-card-border)]">
            <Trash2 className="w-10 h-10 text-error mx-auto mb-3" />
            <h3 className="text-lg font-serif text-on-surface mb-2">Supprimer ce compte ?</h3>
            <p className="text-sm text-on-surface/60 mb-6">Cette action est irréversible. Le compte sera définitivement supprimé.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteId(null)} disabled={!!processingId} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface/60 hover:bg-surface-container transition-colors">Annuler</button>
              <button onClick={handleDelete} disabled={!!processingId} className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
                {processingId ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
