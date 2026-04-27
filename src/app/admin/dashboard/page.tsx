'use client';

// ─── Page d'accueil du dashboard admin ───────────────────────────────────────
// Affiche les accès rapides aux différentes sections de gestion.
// Permet de créer un nouveau post rapidement.

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-serif text-on-surface mb-2">
            Gestion du Contenu
          </h1>
          <p className="text-on-surface/60 font-medium">
            Gérez le contenu et la présence numérique de votre mosquée.
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform w-fit">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouveau Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Articles */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm group hover:bg-primary transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary-fixed/30 rounded-2xl group-hover:bg-white/20 transition-colors">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className="text-xs font-bold text-primary group-hover:text-emerald-200">
              +12% vs mois dernier
            </span>
          </div>
          <div className="text-3xl font-serif text-on-surface group-hover:text-white transition-colors">
            148
          </div>
          <div className="text-sm font-medium text-on-surface/50 group-hover:text-emerald-100 transition-colors">
            Articles Publiés
          </div>
        </div>

        {/* Events */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm group hover:bg-tertiary transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-tertiary-fixed/30 rounded-2xl group-hover:bg-white/20 transition-colors">
              <svg
                className="w-6 h-6 text-tertiary group-hover:text-white transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-xs font-bold text-tertiary">
              Attention requise
            </span>
          </div>
          <div className="text-3xl font-serif text-on-surface group-hover:text-white transition-colors">
            7
          </div>
          <div className="text-sm font-medium text-on-surface/50 group-hover:text-tertiary-fixed transition-colors">
            Événements en attente
          </div>
        </div>

        {/* Subscribers */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm group hover:bg-emerald-900 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary-fixed-dim/30 rounded-2xl group-hover:bg-white/20 transition-colors">
              <svg
                className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span className="text-xs font-bold text-primary group-hover:text-emerald-200">
              +42 nouveaux aujourd&apos;hui
            </span>
          </div>
          <div className="text-3xl font-serif text-on-surface group-hover:text-white transition-colors">
            2 481
          </div>
          <div className="text-sm font-medium text-on-surface/50 group-hover:text-emerald-100 transition-colors">
            Abonnés Newsletter
          </div>
        </div>
      </div>

      {/* Content Table + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Content Table */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface">Contenu Récent</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                Tous
              </button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface/50 hover:text-primary transition-all">
                Brouillons
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest font-extrabold text-on-surface/40">
                <tr>
                  <th className="px-8 py-4">Titre</th>
                  <th className="px-4 py-4">Catégorie</th>
                  <th className="px-4 py-4">Statut</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  {
                    title: 'Réflexions sur le Ramadan 2024',
                    category: 'Actualités',
                    status: 'Publié',
                    statusColor: 'bg-primary text-primary',
                  },
                  {
                    title: 'Iftar communautaire des jeunes',
                    category: 'Événements',
                    status: 'Brouillon',
                    statusColor: 'bg-tertiary-fixed text-tertiary',
                  },
                  {
                    title: 'Nouvelles consignes parking',
                    category: 'Infos pratiques',
                    status: 'Publié',
                    statusColor: 'bg-primary text-primary',
                  },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-on-surface">
                        {item.title}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-on-surface/60">
                      {item.category}
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.statusColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-primary hover:bg-primary/5 transition-all">
                          <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-error hover:bg-error/5 transition-all">
                          <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Reminders */}
          <div className="bg-tertiary text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
              </svg>
              Rappels Admin
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border border-white/30 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-tight">
                  Réviser le post de la Khutbah de vendredi.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border border-white/30 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-tight">
                  Approuver 4 demandes d&apos;événements.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-white flex-shrink-0 mt-0.5 flex items-center justify-center bg-white">
                  <svg
                    className="w-3 h-3 text-tertiary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm text-white/50 line-through leading-tight">
                  Mettre à jour les horaires de Ramadan.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
