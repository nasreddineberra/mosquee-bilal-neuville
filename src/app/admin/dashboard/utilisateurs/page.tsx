'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

type Role = 'administrateur' | 'editeur' | 'visiteur';

type Utilisateur = {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  adresse: string | null;
  role: Role;
  created_at: string;
};

const ROLE_META: Record<Role, { label: string; badge: string }> = {
  administrateur: { label: 'Administrateur', badge: 'bg-primary text-on-primary' },
  editeur: { label: 'Éditeur', badge: 'bg-tertiary text-white' },
  visiteur: { label: 'Visiteur', badge: 'bg-primary/10 text-primary' },
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
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchUtilisateurs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, email, prenom, nom, telephone, adresse, role, created_at')
      .order('created_at', { ascending: false });
    if (roleFilter !== 'all') query = query.eq('role', roleFilter);
    const { data, error: err } = await query;
    if (err) {
      setError('Impossible de charger les utilisateurs.');
    } else {
      setUtilisateurs((data ?? []) as Utilisateur[]);
      setError('');
    }
    setLoading(false);
  }, [supabase, roleFilter]);

  useEffect(() => { fetchUtilisateurs(); }, [fetchUtilisateurs]);

  const updateRole = async (userId: string, role: Role) => {
    setProcessingId(userId);
    setError('');
    const res = await fetch('/api/admin/update-user-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    const json = await res.json();
    setProcessingId(null);
    if (!res.ok) {
      setError(json.error || 'Erreur.');
      return;
    }
    fetchUtilisateurs();
  };

  const roleFilters: { key: 'all' | Role; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'administrateur', label: 'Administrateurs' },
    { key: 'editeur', label: 'Éditeurs' },
    { key: 'visiteur', label: 'Visiteurs' },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Gestion des utilisateurs
          </h1>
          <p className="text-on-surface/60 font-medium">
            Liste des comptes et attribution des rôles.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between gap-4 border-b border-outline-variant/10">
          <h3 className="text-lg font-bold text-on-surface">Comptes</h3>
          <div className="flex gap-2">
            {roleFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setRoleFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                  roleFilter === f.key
                    ? 'bg-primary text-on-primary'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-4 bg-error-container/20 border border-error/20 rounded-xl p-3">
            <p className="text-error text-sm text-center">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest font-extrabold text-on-surface/40">
              <tr>
                <th className="px-8 py-4">Utilisateur</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Inscrit le</th>
                <th className="px-4 py-4">Rôle</th>
                <th className="px-8 py-4 text-right">Changer le rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-8 text-center text-sm text-on-surface/60">Chargement…</td></tr>
              ) : utilisateurs.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-8 text-center text-sm text-on-surface/60">Aucun utilisateur.</td></tr>
              ) : (
                utilisateurs.map((u) => {
                  const isMe = user?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-on-surface flex items-center gap-2">
                          {u.prenom || u.nom ? `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() : <span className="text-on-surface/40">—</span>}
                          {isMe && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Vous</span>}
                        </p>
                        <p className="text-xs text-on-surface/60 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" /> {u.email}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        {u.telephone ? (
                          <p className="text-xs text-on-surface/70 flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> {u.telephone}
                          </p>
                        ) : (
                          <p className="text-xs text-on-surface/30">—</p>
                        )}
                        {u.adresse && (
                          <p className="text-xs text-on-surface/70 flex items-start gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {u.adresse}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-xs text-on-surface/70">{formatDate(u.created_at)}</p>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-flex items-center gap-1 ${ROLE_META[u.role].badge}`}>
                          <Shield className="w-3 h-3" />
                          {ROLE_META[u.role].label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {isMe ? (
                          <span className="text-xs text-on-surface/30">—</span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value as Role)}
                            disabled={processingId === u.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                          >
                            <option value="visiteur">Visiteur</option>
                            <option value="editeur">Éditeur</option>
                            <option value="administrateur">Administrateur</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
