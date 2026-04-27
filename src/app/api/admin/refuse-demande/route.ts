// ─── POST /api/admin/refuse-demande ─────────────────────────────────────────
// Refuse une demande d'accès visiteur (passe son statut à 'refusee').
// Réservé administrateur. Protection CSRF.
// Log l'action dans admin_logs.
import { serverLog } from '@/lib/logger';
import { logAdminAction } from '@/lib/admin-logger';
import { checkOrigin } from '@/lib/csrf';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { demandeId } = await request.json();
    if (!demandeId) {
      return NextResponse.json({ error: 'demandeId manquant' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: me } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (me?.role !== 'administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { error: updateErr } = await admin
      .from('demandes_acces')
      .update({
        statut: 'refusee',
        traite_par: user.id,
        traite_at: new Date().toISOString(),
      })
      .eq('id', demandeId)
      .eq('statut', 'en_attente'); // Ne pas refuser une demande déjà traitée

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    await logAdminAction(user.id, 'refuse_demande', 'demande_acces', demandeId, null);

    return NextResponse.json({ success: true });
  } catch (e) {
    await serverLog('error', '[refuse-demande]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
