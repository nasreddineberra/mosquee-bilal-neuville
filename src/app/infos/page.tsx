'use client';

import { useState } from 'react';
import { Clock, MapPin, Mail, CheckSquare, NotebookTabs } from 'lucide-react';
import { FloatInput, FloatTextarea } from '@/components/FloatField';

export default function InfosPage() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', phone: '', subject: '', message: '' });
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValid = Object.values(form).every((v) => v.trim() !== '') && isEmailValid;

  return (
    <div className="bg-background pt-8 pb-2 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <NotebookTabs className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">Contact et Infos pratiques</h1>
        </div>
        <p className="text-on-surface/60 text-sm mb-8">
          Accès, horaires, contact, services et informations utiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Col 1 — Horaires + Contact */}
          <div className="space-y-3">
            {/* Horaires */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Horaires d&apos;ouverture</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1">Lundi - Dimanche</h4>
                  <p className="text-on-surface/60 text-sm">créneaux des heures de prière</p>
                </div>
                <div className="border-t border-outline-variant/10 pt-3 mt-3">
                  <h4 className="text-sm font-bold text-on-surface mb-1">Prière du Vendredi</h4>
                  <p className="text-on-surface/60 text-sm">heure affichée sur la page d&apos;accueil</p>
                </div>
              </div>
            </div>
            {/* Contact */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Contact</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1">Téléphone</h4>
                  <p className="text-on-surface/60 text-sm">04 XX XX XX XX</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1">Email</h4>
                  <p className="text-on-surface/60 text-sm">contact@mosquee-bilal.fr</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accès + Plan (col-span-2) */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Infos */}
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Accès</h2>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1">Adresse</h4>
                  <p className="text-on-surface/60 text-sm">
                    10 avenue Auguste Wissel<br />
                    69250 Neuville-sur-Saône
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-2">Transport TCL</h4>
                  <p className="text-on-surface/60 text-sm mb-2">
                    Arrêt <strong>Neuville</strong> - Zone tarifaire 1
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">40</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">70</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">82</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">84</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">96</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">97</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-700 text-white">S14</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-800 text-white">JD 185</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-800 text-white">JD 242</span>
                  </div>
                  <p className="text-on-surface/60 text-sm">Petit parking disponible - accès PMR</p>
                </div>
                <div className="flex-1 min-h-0 rounded-xl relative overflow-hidden">
                  <img
                    src="/images/mosquee-bilal-thumbnail.jpg"
                    alt="Mosquée Bilal Neuville-sur-Saône"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Carte */}
              <div className="p-4 min-h-[160px] h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5567!2d4.834!3d45.832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea7f0b0b0b0b%3A0x0!2s10+Avenue+Auguste+Wissel%2C+69250+Neuville-sur-Sa%C3%B4ne!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Plan d'accès Mosquée Bilal"
                  className="w-full h-full rounded-xl"
                />
              </div>
            </div>
          </div>

        </div>

        {/* LIGNE 2 — Contact (gauche) + Services (droite) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* Formulaire de contact */}
          <div id="contact" className="scroll-mt-24 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-primary">
            {/* Header */}
            <div className="card-green rounded-t-xl p-5 flex items-center gap-2">
              <Mail className="w-5 h-5 text-white" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Envoyez-nous un message</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FloatInput id="firstname" label="Prénom" value={form.firstname} onChange={(v) => setForm({ ...form, firstname: v })} required transform="capitalize" />
                  <FloatInput id="lastname" label="Nom" value={form.lastname} onChange={(v) => setForm({ ...form, lastname: v })} required transform="uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FloatInput id="email" label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required transform="lowercase" error={form.email.length > 0 && !isEmailValid} />
                  <FloatInput id="phone" label="Téléphone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required transform="phone" />
                </div>
                <FloatInput id="subject" label="Sujet" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
                <FloatTextarea id="message" label="Message" rows={6} value={form.message} onChange={(v) => setForm({ ...form, message: v })} required />
                <div className="flex items-center justify-between">
                  <span className="text-red-500 text-xs font-medium">* obligatoire</span>
                  <button type="submit" disabled={!isValid} className={`px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isValid ? 'card-green text-white hover:opacity-90' : 'bg-on-surface/10 text-on-surface/30 cursor-not-allowed'}`}>
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Services */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CheckSquare className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                {[
                  { title: 'Prières quotidiennes', desc: 'Les cinq prières quotidiennes dans un cadre serein et accueillant.' },
                  { title: 'Prière mortuaire', desc: 'Salât al-janâza - accompagnement du défunt dans la prière.' },
                  { title: 'Prière de l\'Aïd', desc: 'Célébration de l\'Aïd el-Fitr et l\'Aïd el-Adha en communauté.' },
                  { title: 'Salle d\'ablutions', desc: 'Espace dédié aux ablutions avant la prière.' },
                ].map((service, i) => (
                  <div key={i} className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer">
                    <h4 className="text-sm font-bold text-primary mb-1">{service.title}</h4>
                    <p className="text-on-surface/60 text-xs">{service.desc}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Cours pour adultes et enfants', desc: 'Enseignement du Coran, tajwid, et éducation islamique.' },
                  { title: 'Iftar Ramadan', desc: 'Rupture du jeûne partagée en communauté durant le mois de Ramadan.' },
                  { title: 'Espace pour femmes', desc: 'Salle réservée aux femmes pour la prière et les activités.' },
                  { title: 'Petit parking avec accès PMR', desc: 'Stationnement disponible avec accès aménagé pour les personnes à mobilité réduite.' },
                ].map((service, i) => (
                  <div key={i} className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer">
                    <h4 className="text-sm font-bold text-primary mb-1">{service.title}</h4>
                    <p className="text-on-surface/60 text-xs">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
