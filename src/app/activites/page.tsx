'use client';

import { useState } from 'react';
import { BookOpenCheck, NotebookPen, Users, Handshake, ArrowBigRight } from 'lucide-react';
import AideSocialeModal from '@/components/AideSocialeModal';

export default function ActivitesPage() {
  const [aideSocialeOpen, setAideSocialeOpen] = useState(false);

  return (
    <>
      <div className="bg-background pt-8 pb-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpenCheck className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Activités communautaires</h1>
            </div>
            <p className="text-on-surface/60 text-sm">
              Cours, sorties, services sociaux et programmes éducatifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cours de Tajwid */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpenCheck className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Cours de Tajwid</h3>
              </div>
              <p className="text-on-surface/60 text-sm mb-4">
                Apprenez la récitation coranique avec un enseignant qualifié.
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Niveau</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Créneau</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Places</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Statut</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Débutant</td>
                      <td className="py-2 px-3 text-on-surface/70">Samedi 10h-12h</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">5/15</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Intermédiaire</td>
                      <td className="py-2 px-3 text-on-surface/70">Samedi 14h-16h</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">12/15</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Avancé</td>
                      <td className="py-2 px-3 text-on-surface/70">Dimanche 10h-12h</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">15/15</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-full px-2 py-0.5 rounded-full uppercase">Complet</span></td>
                      <td className="py-2 px-3 text-center text-on-surface/30">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Langue Arabe */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <NotebookPen className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Langue Arabe</h3>
              </div>
              <p className="text-on-surface/60 text-sm mb-4">
                Cours pour enfants et adultes, tous niveaux.
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Public</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Créneau</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Places</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Statut</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Enfants (6-10 ans)</td>
                      <td className="py-2 px-3 text-on-surface/70">Mercredi 14h-16h</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">8/20</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Enfants (11-15 ans)</td>
                      <td className="py-2 px-3 text-on-surface/70">Mercredi 16h-18h</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">14/20</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Adultes débutants</td>
                      <td className="py-2 px-3 text-on-surface/70">Dimanche 10h-11h30</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">6/15</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Adultes intermédiaire</td>
                      <td className="py-2 px-3 text-on-surface/70">Dimanche 11h30-13h</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">15/15</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-full px-2 py-0.5 rounded-full uppercase">Complet</span></td>
                      <td className="py-2 px-3 text-center text-on-surface/30">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sorties */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Sorties</h3>
              </div>
              <p className="text-on-surface/60 text-sm mb-4">
                Activités récréatives et éducatives pour toute la famille.
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Sortie</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Date</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Lieu</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Places</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Statut</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-primary uppercase tracking-wider">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Parc de la Tête d&apos;Or</td>
                      <td className="py-2 px-3 text-on-surface/70">26 avril</td>
                      <td className="py-2 px-3 text-on-surface/70">Lyon 6e</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">18/30</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Journée nature</td>
                      <td className="py-2 px-3 text-on-surface/70">17 mai</td>
                      <td className="py-2 px-3 text-on-surface/70">Monts du Lyonnais</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">5/25</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-open px-2 py-0.5 rounded-full uppercase">Ouvert</span></td>
                      <td className="py-2 px-3 text-center"><a href="#" className="text-xs font-bold text-primary hover:underline">S&apos;inscrire</a></td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-3 text-on-surface">Visite musée</td>
                      <td className="py-2 px-3 text-on-surface/70">7 juin</td>
                      <td className="py-2 px-3 text-on-surface/70">Musée des Confluences</td>
                      <td className="py-2 px-3 text-center text-on-surface/70">0/20</td>
                      <td className="py-2 px-3 text-center"><span className="text-[10px] font-bold badge-soon px-2 py-0.5 rounded-full uppercase">Bientôt</span></td>
                      <td className="py-2 px-3 text-center text-on-surface/30">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aide Sociale-Green card */}
            <button
              onClick={() => setAideSocialeOpen(true)}
              className="text-left card-green card-green-link rounded-2xl p-5 shadow-sm group relative self-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Handshake className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Aide Sociale</h3>
                </div>
                <p className="text-white/80 text-sm mb-6">
                  Accompagnement et soutien pour les membres de la communauté en difficulté. Notre cellule d&apos;aide sociale est à votre écoute.
                </p>
              </div>
              <span className="card-green-btn">
                <ArrowBigRight className="w-4 h-4 fill-white" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AideSocialeModal
        open={aideSocialeOpen}
        onClose={() => setAideSocialeOpen(false)}
      />
    </>
  );
}
