// ─── POST /api/admin/validate-demande ───────────────────────────────────────
// Valide une demande d'accès visiteur : crée l'utilisateur auth + profil.
// Réservé administrateur. Protection CSRF + rate-limit (10/heure).
// Chiffre les données personnelles (téléphone, adresse) avant insertion.
// Log l'action dans admin_logs.
import { encrypt } from '@/lib/encryption';
import { serverLog } from '@/lib/logger';
import { logAdminAction } from '@/lib/admin-logger';
import { checkOrigin } from '@/lib/csrf';
import { createAdminClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
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

    const allowed = await checkRateLimit(user.id, 'validate_demande', 10, 3600000);
    if (!allowed) {
      return NextResponse.json({ error: 'Trop d\'invitations. Réessaye dans une heure.' }, { status: 429 });
    }

    // Récupérer la demande
    const { data: demande, error: fetchErr } = await admin
      .from('demandes_acces')
      .select('id, email, nom, prenom, telephone, adresse, statut, newsletter_opt_in')
      .eq('id', demandeId)
      .single();

    if (fetchErr || !demande) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });
    }

    if (demande.statut !== 'en_attente') {
      return NextResponse.json({ error: 'Cette demande a déjà été traitée.' }, { status: 400 });
    }

    // Créer l'utilisateur auth
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      demande.email,
      { redirectTo: `${new URL(request.url).origin}/mon-profil` }
    );

    if (inviteErr) {
      return NextResponse.json({ error: inviteErr.message }, { status: 500 });
    }

    // Créer le profil avec données chiffrées
    const { error: profileErr } = await admin.from('profiles').insert({
      id: invited.user.id,
      email: demande.email.toLowerCase().trim(),
      nom: demande.nom?.toUpperCase() ?? null,
      prenom: demande.prenom ?? null,
      telephone_encrypted: encrypt(demande.telephone),
      adresse_encrypted: encrypt(demande.adresse),
      newsletter_opt_in: demande.newsletter_opt_in ?? false,
      role: 'visiteur',
    });

    if (profileErr) {
      // Rollback : supprimer l'utilisateur auth si le profil échoue
      await admin.auth.admin.deleteUser(invited.user.id);
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    // Marquer la demande comme traitée
    await admin.from('demandes_acces').update({
      statut: 'validee',
      traite_par: user.id,
      traite_at: new Date().toISOString(),
    }).eq('id', demandeId);

    await logAdminAction(user.id, 'validate_demande', 'demande_acces', demandeId, {
      email: demande.email,
      user_id: invited.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    await serverLog('error', '[validate-demande]', 'Erreur', { error: e });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
