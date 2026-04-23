import { HeartHandshake, Goal, ShieldCheck, HandHeart } from 'lucide-react';
import DonsList from '@/components/DonsList';
import { createClient } from '@/lib/supabase/server';

type Don = {
  id: string;
  titre: string;
  resume: string | null;
  description: string | null;
  lien_externe: string | null;
  a_la_une: boolean;
  image_url: string | null;
};

export const revalidate = 60;

export default async function DonsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('dons')
    .select('id, titre, resume, description, lien_externe, a_la_une, images(url)')
    .eq('actif', true)
    .order('a_la_une', { ascending: false })
    .order('position', { ascending: true, nullsFirst: false })
    .order('date_parution', { ascending: false });

  type Row = Omit<Don, 'image_url'> & { images: { url: string } | { url: string }[] | null };
  const dons: Don[] = ((data ?? []) as Row[]).map((r) => {
    const img = Array.isArray(r.images) ? r.images[0] : r.images;
    return { ...r, image_url: img?.url ?? null };
  });
  const featured = dons.find((d) => d.a_la_une) ?? null;
  const projets = dons.filter((d) => !d.a_la_une);

  return (
    <div className="bg-background pt-8 pb-2 px-4">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
              Dons
            </h1>
          </div>
          <p className="text-on-surface/60 text-sm">
            Soutenez les projets de la Mosquée Bilal via des plateformes de collecte sécurisées.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Col 1 - Pourquoi donner + Plateformes */}
          <div className="space-y-3">
            {/* Pourquoi donner ? */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HandHeart className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Pourquoi donner ?</h2>
              </div>
              <p className="text-on-surface/70 text-sm leading-relaxed mb-3">
                Le don occupe une place centrale dans l&apos;islam. La <span className="text-primary font-semibold">sadaqa</span> (aumône volontaire) et la <span className="text-primary font-semibold">zakat</span> (aumône obligatoire) sont des actes de foi qui purifient les biens et renforcent la solidarité au sein de la communauté.
              </p>
              <p className="text-on-surface/70 text-sm leading-relaxed mb-3">
                Le Prophète Muhammad ﷺ a dit : <span className="italic text-on-surface">&quot;La sadaqa n&apos;a jamais diminué une richesse.&quot;</span> (Muslim)
              </p>
              <p className="text-on-surface/70 text-sm leading-relaxed">
                Chaque contribution, quelle que soit sa taille, permet de maintenir et développer les activités de la mosquée : cours, événements, entretien des locaux, aide sociale et projets communautaires.
              </p>
            </div>

            {/* Plateformes de confiance */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Plateformes de confiance</h2>
              </div>
              <p className="text-on-surface/70 text-sm leading-relaxed mb-4">
                Tous les dons sont collectés via des plateformes reconnues et sécurisées.
              </p>
              <ul className="space-y-3 mb-4">
                {[
                  { title: 'Paiement 100% sécurisé', desc: 'Transactions chiffrées et protégées par les standards bancaires.' },
                  { title: 'Transparence totale', desc: 'Suivi en temps réel des collectes et de l\'utilisation des fonds.' },
                  { title: 'Reçu fiscal automatique', desc: 'Un reçu fiscal vous est délivré pour votre déclaration d\'impôts (déduction de 66% du montant).' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-on-surface/70">
                      <span className="font-semibold text-on-surface">{item.title}</span> - {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2 - Nos projets */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Goal className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Nos projets</h2>
            </div>

            <DonsList featured={featured} projets={projets} />
          </div>

        </div>
      </div>
    </div>
  );
}
