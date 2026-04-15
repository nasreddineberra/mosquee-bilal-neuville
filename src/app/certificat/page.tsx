import Link from 'next/link';
import { Award, CheckCircle, FileText, Users, Heart, Plane, BookOpen, ChevronLeft } from 'lucide-react';

export default function CertificatPage() {
  return (
    <div className="bg-background pt-8 pb-2 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Retour accueil */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface/50 hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
              Certificat de conversion
            </h1>
          </div>
          <p className="text-on-surface/60 text-sm">
            Démarches, utilité et obtention du certificat de conversion à l&apos;islam à la Mosquée Bilal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Section 1 - Qu'est-ce que le certificat ? */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Qu&apos;est-ce que le certificat ?</h2>
            </div>
            <p className="text-on-surface/70 text-sm leading-relaxed mb-3">
              Le certificat de conversion à l&apos;islam est un document officiel attestant qu&apos;une personne a embrassé la religion musulmane en prononçant la <span className="text-primary font-semibold">Chahada</span> - la profession de foi islamique.
            </p>
            <p className="text-on-surface/70 text-sm leading-relaxed mb-3">
              La Chahada consiste à déclarer sincèrement : <span className="italic text-on-surface">"Il n&apos;y a de divinité digne d&apos;adoration qu&apos;Allah, et Muhammad ﷺ est Son messager."</span>
            </p>
            <p className="text-on-surface/70 text-sm leading-relaxed">
              Ce certificat est délivré gratuitement par la mosquée après la prononciation de la Chahada en présence de témoins musulmans. Il est valable à vie et ne comporte pas de date d&apos;expiration.
            </p>
          </div>

          {/* Section 2 - À quoi sert-il ? */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">À quoi sert-il ?</h2>
            </div>
            <p className="text-on-surface/70 text-sm leading-relaxed mb-4">
              Ce document est indispensable dans plusieurs démarches de la vie musulmane :
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface/70">
                  <span className="font-semibold text-on-surface">Mariage islamique</span> - requis pour se marier selon le rite musulman avec un(e) conjoint(e) musulman(e).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Plane className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface/70">
                  <span className="font-semibold text-on-surface">Pèlerinage (Hajj et Omra)</span> - exigé par les autorités saoudiennes pour accéder aux Lieux Saints de La Mecque.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface/70">
                  <span className="font-semibold text-on-surface">Inhumation musulmane</span>{' '}- permet d&apos;être enterré(e) dans un carré musulman selon les rites islamiques.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-on-surface/70">
                  <span className="font-semibold text-on-surface">Démarches administratives</span> - reconnu dans les pays à majorité musulmane pour diverses procédures officielles.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3 - Comment l'obtenir ? */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Comment l&apos;obtenir à la Mosquée Bilal ?</h2>
            </div>
            <p className="text-on-surface/70 text-sm leading-relaxed mb-4">
              La démarche est simple, bienveillante et entièrement gratuite. Voici les étapes :
            </p>
            <ol className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Se renseigner',
                  desc: 'Prenez contact avec la mosquée pour exprimer votre souhait. Notre équipe vous accueille et répond à toutes vos questions.',
                },
                {
                  step: '2',
                  title: 'Prononcer la Chahada',
                  desc: 'Vous déclarez sincèrement la profession de foi islamique en présence de l\'imam et de témoins musulmans.',
                },
                {
                  step: '3',
                  title: 'Remplir le formulaire',
                  desc: 'Un formulaire administratif simple vous sera remis. Munissez-vous d\'une pièce d\'identité en cours de validité.',
                },
                {
                  step: '4',
                  title: 'Recevoir votre certificat',
                  desc: 'Le certificat vous est remis lors de la même séance ou dans les jours suivants, signé et tamponné par la mosquée.',
                },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step}
                  </span>
                  <span className="text-sm text-on-surface/70">
                    <span className="font-semibold text-on-surface">{title}</span>
                    {' '}- {desc}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Section 4 - CTA Contact */}
          <Link
            href="/infos#contact"
            className="group card-green rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-white" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Besoin d&apos;accompagnement ?</h2>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Vous souhaitez vous convertir à l&apos;islam ou en savoir plus sur le certificat ? L&apos;équipe de la Mosquée Bilal est à votre écoute, avec bienveillance et discrétion.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                N&apos;hésitez pas à nous écrire via le formulaire de contact. Nous vous répondrons dans les meilleurs délais et organiserons une rencontre à votre convenance.
              </p>
            </div>
            <div className="aide-sociale-cta bg-white text-primary py-2.5 rounded-full font-bold text-sm text-center shadow-md transition-all">
              Nous contacter
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
