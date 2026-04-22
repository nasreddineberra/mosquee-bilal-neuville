'use strict';

const { chromium } = require('@playwright/test');
const path = require('path');
const readline = require('readline');

const BASE = 'http://localhost:3000';
const OUT  = path.join(__dirname, '..', 'Rapport-Mosquee-Bilal.pdf');

function waitForEnter(msg) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(msg, () => { rl.close(); resolve(); });
  });
}

async function shot(page, label) {
  await page.waitForTimeout(800);
  const buf = await page.screenshot({ type: 'jpeg', quality: 82 });
  process.stdout.write('  ✓ ' + label + '\n');
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

// ─────────────────────────────────────────────────────────────────────────────
// RAPPORT HTML
// ─────────────────────────────────────────────────────────────────────────────
function buildReport(s) {
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
@page { size: A4; margin: 0; }
body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1a1a1a; font-size: 12px; line-height: 1.6; background: white; }

.page {
  width: 210mm;
  min-height: 297mm;
  padding: 16mm 18mm;
  page-break-after: always;
  overflow: hidden;
  position: relative;
}
.page-last { page-break-after: auto; }

/* ── Couverture ── */
.cover {
  background: linear-gradient(150deg, #022c22 0%, #064E3B 50%, #065F46 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24mm 22mm;
}
.cover-logo { font-size: 52px; margin-bottom: 6mm; }
.cover h1 { font-size: 34px; font-weight: 800; line-height: 1.15; margin-bottom: 3mm; }
.cover .subtitle { font-size: 15px; opacity: 0.75; margin-bottom: 18mm; }
.cover .tagline { font-size: 13px; font-style: italic; opacity: 0.7; margin-bottom: 14mm; background: rgba(255,255,255,0.08); border-left: 3px solid rgba(255,255,255,0.4); padding: 4mm 5mm; border-radius: 0 6px 6px 0; }
.cover .meta { border-top: 1px solid rgba(255,255,255,0.2); padding-top: 7mm; font-size: 11.5px; opacity: 0.8; }
.cover .meta p { margin-bottom: 2mm; }
.cover .meta .author { font-weight: 700; font-size: 13px; opacity: 1; margin-top: 4mm; }

/* ── Typographie ── */
h1.pt { font-size: 21px; color: #064E3B; font-weight: 800; }
.ptbar { border-left: 4px solid #064E3B; padding-left: 4mm; margin-bottom: 7mm; }
h2 { font-size: 14.5px; color: #064E3B; font-weight: 700; margin: 6mm 0 2.5mm; }
h3 { font-size: 12.5px; color: #064E3B; font-weight: 700; margin: 4mm 0 1.5mm; }
p  { font-size: 11.5px; color: #374151; line-height: 1.65; margin-bottom: 2.5mm; }
ul.plain { margin: 2mm 0 3mm 5mm; }
ul.plain li { font-size: 11.5px; color: #374151; line-height: 1.8; list-style: disc; }

/* ── Sommaire ── */
.toc-cat { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin: 5mm 0 1mm; }
.toc-row { display: flex; justify-content: space-between; align-items: center; padding: 2.5mm 0; border-bottom: 1px dotted #e5e7eb; font-size: 11.5px; }
.toc-row .n { color: #064E3B; font-weight: 700; min-width: 7mm; }
.toc-row .pg { color: #9ca3af; font-size: 10px; min-width: 8mm; text-align: right; }

/* ── Screenshot ── */
.sc { width: 100%; display: block; border-radius: 7px; border: 1px solid #e5e7eb; box-shadow: 0 2px 10px rgba(0,0,0,0.07); margin-top: 3mm; }

/* ── Cards highlight ── */
.hgrid { display: flex; gap: 4mm; margin: 3mm 0; }
.hbox { flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 4mm 5mm; }
.hbox h4 { font-size: 11px; color: #064E3B; font-weight: 700; margin-bottom: 1.5mm; }
.hbox p  { font-size: 11px; color: #374151; margin: 0; }

/* ── Grille architecture ── */
.agrid { display: flex; gap: 4mm; margin: 3mm 0; }
.abox { flex: 1; border: 1.5px solid #064E3B; border-radius: 8px; padding: 4mm; }
.abox h4 { font-size: 11px; color: #064E3B; font-weight: 700; margin-bottom: 2mm; }
.abox ul { list-style: none; font-size: 10.5px; color: #374151; }
.abox ul li { padding: 0.8mm 0; }
.abox ul li::before { content: '• '; color: #064E3B; }

/* ── Schéma flux ── */
.flow { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 5mm; margin: 3mm 0; display: flex; justify-content: center; align-items: center; gap: 5mm; }
.flow-node { background: #064E3B; color: white; padding: 3mm 5mm; border-radius: 6px; font-size: 10.5px; font-weight: 600; text-align: center; line-height: 1.4; }
.flow-node span { display: block; font-size: 8.5px; opacity: 0.7; font-weight: 400; margin-top: 1mm; }
.flow-arrow { color: #9ca3af; font-size: 14px; }

/* ── Checklist ── */
.cl { list-style: none; margin: 2mm 0; }
.cl li { font-size: 11.5px; line-height: 1.7; padding-left: 6mm; position: relative; }
.cl li::before { position: absolute; left: 0; font-weight: 700; }
.cl li.ok { color: #374151; }
.cl li.ok::before { content: '\\2713'; color: #064E3B; }
.cl li.nd { color: #9ca3af; }
.cl li.nd::before { content: '\\25CB'; color: #d97706; }

/* ── Barre de progression ── */
.prog-wrap { margin: 3mm 0 5mm; }
.prog-lbl { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 1.5mm; }
.prog-bar { height: 9px; background: #e5e7eb; border-radius: 5px; overflow: hidden; }
.prog-fill { height: 100%; background: linear-gradient(90deg, #064E3B, #059669); border-radius: 5px; }
.prog-sub { font-size: 9.5px; color: #6b7280; margin-top: 1.5mm; }

/* ── Callout ── */
.callout { background: #064E3B; color: white; border-radius: 8px; padding: 4mm 6mm; margin: 4mm 0; }
.callout p { color: rgba(255,255,255,0.9); font-size: 11px; margin: 0; }

/* ── Divider ── */
hr { border: none; border-top: 1px solid #e5e7eb; margin: 5mm 0; }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════ PAGE 1 : COUVERTURE -->
<div class="page cover">
  <div>
    <div class="cover-logo">&#x1F54C;</div>
    <h1>Mosquée Bilal<br>Neuville-sur-Saône</h1>
    <div class="subtitle">Rapport de présentation du site web</div>
    <div class="tagline">
      « Un espace numérique moderne au service de la communauté — pour informer,
      éduquer, organiser et rapprocher. »
    </div>
  </div>
  <div class="meta">
    <p>Association ACM — 10 Avenue Auguste Wissel, 69250 Neuville-sur-Saône</p>
    <p>Tél. 04 78 49 85 22</p>
    <p>Date du rapport : ${date}</p>
    <p class="author">Développé par Nasr-Eddine BERRA</p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 2 : SOMMAIRE -->
<div class="page">
  <div class="ptbar"><h1 class="pt">Sommaire</h1></div>

  <div class="toc-cat">Présentation</div>
  <div class="toc-row"><span><span class="n">1.</span> Contexte et objectifs du projet</span><span class="pg">3</span></div>

  <div class="toc-cat">Site public — pages accessibles à tous</div>
  <div class="toc-row"><span><span class="n">2.</span> Page d'accueil</span><span class="pg">4</span></div>
  <div class="toc-row"><span><span class="n">3.</span> Actualités</span><span class="pg">5</span></div>
  <div class="toc-row"><span><span class="n">4.</span> Activités et inscriptions en ligne</span><span class="pg">6</span></div>
  <div class="toc-row"><span><span class="n">5.</span> Documentation Islam</span><span class="pg">7</span></div>
  <div class="toc-row"><span><span class="n">6.</span> Infos pratiques &amp; Contact</span><span class="pg">8</span></div>
  <div class="toc-row"><span><span class="n">7.</span> Dons</span><span class="pg">8</span></div>
  <div class="toc-row"><span><span class="n">8.</span> Certificat de conversion</span><span class="pg">9</span></div>

  <div class="toc-cat">Espace d'administration — réservé à l'équipe</div>
  <div class="toc-row"><span><span class="n">9.</span> Tableau de bord</span><span class="pg">10</span></div>
  <div class="toc-row"><span><span class="n">10.</span> Gestion des articles</span><span class="pg">11</span></div>
  <div class="toc-row"><span><span class="n">11.</span> Gestion des activités</span><span class="pg">12</span></div>
  <div class="toc-row"><span><span class="n">12.</span> Gestion des inscriptions</span><span class="pg">13</span></div>
  <div class="toc-row"><span><span class="n">13.</span> Gestion des comptes</span><span class="pg">14</span></div>
  <div class="toc-row"><span><span class="n">14.</span> Gestion des membres (visiteurs)</span><span class="pg">15</span></div>

  <div class="toc-cat">Aspects techniques et organisationnels</div>
  <div class="toc-row"><span><span class="n">15.</span> Architecture technique</span><span class="pg">16</span></div>
  <div class="toc-row"><span><span class="n">16.</span> Sécurité et protection des données (RGPD)</span><span class="pg">17</span></div>
  <div class="toc-row"><span><span class="n">17.</span> État d'avancement et prochaines étapes</span><span class="pg">18</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 3 : CONTEXTE -->
<div class="page">
  <div class="ptbar"><h1 class="pt">1. Contexte et objectifs du projet</h1></div>

  <h2>Pourquoi ce projet ?</h2>
  <p>L'Association ACM, qui gère la Mosquée Bilal de Neuville-sur-Saône, souhaitait se doter d'un espace numérique à la hauteur de son engagement envers la communauté. L'objectif était de créer un site moderne, accessible depuis tous les appareils (ordinateur, téléphone, tablette), qui serve à la fois les fidèles et l'équipe administrative.</p>
  <p>Le projet a été initié le <strong>11 avril 2026</strong> et développé en phases successives, avec des validations régulières à chaque étape.</p>

  <h2>Les quatre piliers du projet</h2>
  <div class="hgrid">
    <div class="hbox">
      <h4>&#127760; Informer</h4>
      <p>Publier actualités, événements et annonces. Tenir la communauté informée en temps réel.</p>
    </div>
    <div class="hbox">
      <h4>&#128218; Éduquer</h4>
      <p>Mettre à disposition une bibliothèque de ressources pédagogiques sur l'Islam, gratuite et accessible à tous.</p>
    </div>
  </div>
  <div class="hgrid">
    <div class="hbox">
      <h4>&#128203; Organiser</h4>
      <p>Gérer les inscriptions aux cours, à l'école arabe et aux sorties culturelles depuis un outil centralisé.</p>
    </div>
    <div class="hbox">
      <h4>&#128274; Sécuriser</h4>
      <p>Protéger les données des membres, conformément au RGPD. Accès restreint selon les rôles de chacun.</p>
    </div>
  </div>

  <h2>En chiffres</h2>
  <div class="agrid">
    <div class="abox">
      <h4>&#128197; Durée</h4>
      <ul>
        <li>Démarré le 11 avril 2026</li>
        <li>15 sessions de travail</li>
        <li>Développement continu</li>
      </ul>
    </div>
    <div class="abox">
      <h4>&#128196; Pages créées</h4>
      <ul>
        <li>9 pages publiques</li>
        <li>7 sections d'administration</li>
        <li>Responsive mobile/desktop</li>
      </ul>
    </div>
    <div class="abox">
      <h4>&#9881; Fonctionnalités</h4>
      <ul>
        <li>Gestion de contenu</li>
        <li>Inscriptions en ligne</li>
        <li>Authentification sécurisée 2FA</li>
      </ul>
    </div>
  </div>

  <div class="callout" style="margin-top: 6mm;">
    <p>Le site est conçu pour être utilisable sans aucune connaissance technique. Les administrateurs et éditeurs gèrent le contenu depuis une interface simple et intuitive, comme un outil bureautique.</p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 4 : ACCUEIL -->
<div class="page">
  <div class="ptbar"><h1 class="pt">Site public — Pages accessibles à tous</h1></div>

  <h2>2. Page d'accueil</h2>
  <p>La page d'accueil est la vitrine numérique de la mosquée. Elle présente en temps réel les <strong>dernières actualités</strong> publiées par l'équipe, intègre les <strong>horaires de prière</strong> via un widget automatiquement mis à jour chaque jour selon la date et la localisation (Neuville-sur-Saône), et propose des accès rapides vers les sections du site les plus utiles.</p>
  <p>Le design s'adapte automatiquement à tous les types d'écrans et respecte les préférences de l'utilisateur (mode clair ou mode sombre).</p>
  <img class="sc" src="${s.accueil}" alt="Page d'accueil">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 5 : ACTUALITES -->
<div class="page">
  <h2>3. Actualités</h2>
  <p>La page des actualités centralise l'ensemble des <strong>articles publiés</strong> par l'équipe de la mosquée : annonces importantes, événements à venir, informations communautaires. Les visiteurs peuvent filtrer les articles par catégorie et les consulter en détail dans une fenêtre superposée, sans quitter la page.</p>
  <p>Les articles <strong>mis à la une</strong> par l'administrateur sont affichés en priorité. L'ordre d'affichage est entièrement maîtrisé par l'équipe.</p>
  <img class="sc" src="${s.actualites}" alt="Page Actualités">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 6 : ACTIVITES -->
<div class="page">
  <h2>4. Activités et inscriptions en ligne</h2>
  <p>Cette page présente l'ensemble des activités proposées par la mosquée, organisées en trois catégories :</p>
  <ul class="plain" style="margin-bottom: 3mm;">
    <li><strong>Cours du soir et tajwid</strong> — apprentissage du Coran et de la récitation</li>
    <li><strong>École arabe pour enfants</strong> — cours de langue arabe pour les plus jeunes</li>
    <li><strong>Sorties culturelles</strong> — événements et sorties organisés par l'association</li>
  </ul>
  <p>Les membres connectés peuvent <strong>s'inscrire directement en ligne</strong>, sans avoir à contacter la mosquée par téléphone. Les inscriptions sont immédiatement visibles dans l'espace d'administration pour traitement.</p>
  <img class="sc" src="${s.activites}" alt="Page Activités">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 7 : DOC -->
<div class="page">
  <h2>5. Documentation Islam</h2>
  <p>Une bibliothèque de ressources pédagogiques entièrement rédigée en français, conçue pour être <strong>accessible à tous</strong> — croyants, nouveaux convertis ou personnes souhaitant en apprendre davantage sur l'Islam dans un cadre bienveillant.</p>
  <p>Le contenu est organisé en <strong>8 thématiques</strong> couvrant <strong>45 sujets</strong> détaillés (les cinq piliers, la prière, le jeûne, la zakât, le pèlerinage, les valeurs islamiques…), rédigés avec un ton pédagogique et accessible à tous les niveaux.</p>
  <img class="sc" src="${s.documentation}" alt="Documentation Islam">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 8 : INFOS + DONS -->
<div class="page">
  <h2>6. Infos pratiques &amp; Contact</h2>
  <p>Toutes les informations pratiques en un seul endroit : <strong>adresse</strong> (10 avenue Auguste Wissel, 69250 Neuville-sur-Saône), <strong>numéro de téléphone</strong> (04 78 49 85 22), <strong>formulaire de contact</strong> direct, et informations sur les <strong>aides sociales</strong> disponibles auprès de l'association.</p>
  <img class="sc" src="${s.infos}" alt="Infos pratiques">

  <h2 style="margin-top:5mm;">7. Dons</h2>
  <p>La page des dons présente l'importance du don en Islam et les différentes façons de soutenir l'association : <strong>plateformes de don en ligne</strong> acceptées et <strong>projets de l'association</strong> financés par les contributions de la communauté. Une page sobre et digne, en accord avec les valeurs islamiques.</p>
  <img class="sc" src="${s.don}" alt="Page Dons">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 9 : CERTIFICAT -->
<div class="page">
  <h2>8. Certificat de conversion</h2>
  <p>Une page dédiée à l'accompagnement des personnes souhaitant embrasser l'Islam. Elle explique les <strong>démarches pour obtenir un certificat de conversion</strong> auprès de la Mosquée Bilal, présente les étapes à suivre et propose un formulaire de demande en ligne. La mosquée s'engage à accompagner chaque personne dans cette démarche importante avec bienveillance et discrétion.</p>
  <img class="sc" src="${s.certificat}" alt="Certificat de conversion">

  <div class="callout" style="margin-top: 5mm;">
    <p>L'ensemble du site public est accessible sans création de compte. La création d'un compte (espace membre) est uniquement nécessaire pour s'inscrire aux activités en ligne.</p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 10 : DASHBOARD -->
<div class="page">
  <div class="ptbar"><h1 class="pt">Espace d'administration — Réservé à l'équipe</h1></div>
  <p style="margin-bottom:5mm;">L'espace d'administration est protégé par un identifiant, un mot de passe et un <strong>code de sécurité à usage unique</strong> (double authentification). Il est accessible uniquement aux personnes autorisées.</p>

  <h2>9. Tableau de bord</h2>
  <p>La page principale de l'administration. Elle offre une <strong>vue synthétique</strong> de l'activité du site et donne accès rapidement à toutes les sections via le menu latéral. D'un coup d'œil, l'administrateur voit ce qui nécessite son attention (demandes en attente, inscriptions à valider, etc.).</p>
  <img class="sc" src="${s.dashboard}" alt="Tableau de bord">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 11 : ARTICLES -->
<div class="page">
  <h2>10. Gestion des articles</h2>
  <p>Interface complète pour gérer les actualités du site. Sans aucune connaissance technique, l'éditeur peut :</p>
  <ul class="plain">
    <li>Rédiger un article avec titre, résumé et contenu</li>
    <li>Choisir ou uploader une image depuis la bibliothèque d'images</li>
    <li>Choisir la catégorie, la date de publication et une date d'expiration automatique</li>
    <li>Mettre un article « à la une » pour le mettre en avant sur la page d'accueil</li>
    <li>Modifier l'ordre d'affichage des articles</li>
    <li>Prévisualiser l'article avant de le publier</li>
    <li>Activer ou désactiver la visibilité d'un article en un clic</li>
  </ul>
  <img class="sc" src="${s.articles}" alt="Gestion des articles">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 12 : ACTIVITES ADMIN -->
<div class="page">
  <h2>11. Gestion des activités</h2>
  <p>Permet de créer et gérer toutes les activités proposées par la mosquée, réparties en trois catégories : <strong>cours du soir et tajwid</strong>, <strong>école arabe pour enfants</strong>, et <strong>sorties culturelles</strong>.</p>
  <p>Pour chaque activité, l'administrateur définit le titre, la description, le tarif, les horaires et toutes les informations pratiques. Les modifications sont visibles instantanément sur le site public, sans aucune intervention technique.</p>
  <img class="sc" src="${s.activitesAdmin}" alt="Gestion des activités">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 13 : INSCRIPTIONS -->
<div class="page">
  <h2>12. Gestion des inscriptions</h2>
  <p>Centralise toutes les demandes d'inscription reçues depuis le site. L'administrateur peut :</p>
  <ul class="plain">
    <li>Filtrer par type d'activité (cours, école arabe, sortie) et par statut (en attente, validée, refusée, annulée)</li>
    <li>Consulter les coordonnées complètes de chaque inscrit</li>
    <li>Pour l'école arabe : voir la liste détaillée des enfants (prénom, nom, date de naissance, niveau)</li>
    <li>Valider ou refuser chaque inscription en un clic</li>
  </ul>
  <p>Plus besoin de gérer les inscriptions par téléphone ou par papier : tout est centralisé et accessible depuis n'importe quel ordinateur.</p>
  <img class="sc" src="${s.inscriptions}" alt="Gestion des inscriptions">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 14 : UTILISATEURS -->
<div class="page">
  <h2>13. Gestion des comptes administrateurs et éditeurs</h2>
  <p>Permet de gérer les personnes ayant accès à l'espace d'administration. Il existe deux niveaux :</p>
  <div class="hgrid" style="margin-bottom:3mm;">
    <div class="hbox">
      <h4>Administrateur</h4>
      <p>Accès complet à toutes les fonctions, y compris la gestion des comptes et des membres.</p>
    </div>
    <div class="hbox">
      <h4>Éditeur</h4>
      <p>Peut créer et modifier du contenu (articles, activités) mais n'a pas accès à la gestion des comptes.</p>
    </div>
  </div>
  <p>Un administrateur peut <strong>inviter un nouveau collaborateur par email</strong> (il reçoit un lien d'activation automatique), modifier son rôle ou supprimer son compte.</p>
  <img class="sc" src="${s.utilisateurs}" alt="Gestion des utilisateurs">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 15 : VISITEURS -->
<div class="page">
  <h2>14. Gestion des membres (visiteurs)</h2>

  <h3>Demandes d'accès</h3>
  <p>Lorsqu'un fidèle souhaite créer un compte pour s'inscrire aux activités en ligne, il soumet une demande depuis la page de connexion. L'administrateur examine la demande et peut la <strong>valider ou la refuser</strong>. En cas de validation, un email d'activation est automatiquement envoyé au demandeur avec un lien pour définir son mot de passe.</p>
  <img class="sc" src="${s.visiteursDemandes}" alt="Demandes d'accès">

  <h3 style="margin-top:4mm;">Comptes membres actifs</h3>
  <p>Liste l'ensemble des membres ayant un compte actif. L'administrateur peut supprimer un compte à la demande du membre concerné, conformément au <strong>droit à l'effacement prévu par le RGPD</strong>. Toutes les données personnelles associées au compte sont alors supprimées définitivement.</p>
  <img class="sc" src="${s.visiteursComptes}" alt="Comptes visiteurs">
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 16 : ARCHI -->
<div class="page">
  <div class="ptbar"><h1 class="pt">15. Architecture technique</h1></div>
  <p>Le site repose sur des technologies modernes, robustes et économiques. Voici une présentation simplifiée des composants qui font fonctionner l'ensemble.</p>

  <div class="flow" style="margin:4mm 0 5mm;">
    <div class="flow-node">Visiteur / Fidèle<span>Navigateur web</span></div>
    <div class="flow-arrow">&#9654;</div>
    <div class="flow-node">Site web<span>Next.js sur Vercel</span></div>
    <div class="flow-arrow">&#9654;</div>
    <div class="flow-node">Base de données<span>Supabase (PostgreSQL)</span></div>
    <div class="flow-arrow">&#9654;</div>
    <div class="flow-node">Stockage images<span>Supabase Storage</span></div>
  </div>

  <div class="agrid">
    <div class="abox">
      <h4>&#128187; Site web</h4>
      <ul>
        <li>Next.js 16 (framework)</li>
        <li>React 19 (interface)</li>
        <li>TypeScript (fiabilité)</li>
        <li>Design adaptatif (Tailwind)</li>
        <li>Hébergement Vercel</li>
      </ul>
    </div>
    <div class="abox">
      <h4>&#128451; Base de données</h4>
      <ul>
        <li>PostgreSQL sécurisé</li>
        <li>Authentification intégrée</li>
        <li>Accès contrôlé par rôles</li>
        <li>Sauvegardes automatiques</li>
        <li>Supabase (service cloud)</li>
      </ul>
    </div>
    <div class="abox">
      <h4>&#128247; Stockage</h4>
      <ul>
        <li>Images des articles</li>
        <li>Bibliothèque réutilisable</li>
        <li>Optimisation automatique</li>
        <li>Format WebP (léger)</li>
        <li>Accès public sécurisé</li>
      </ul>
    </div>
  </div>

  <h2 style="margin-top:5mm;">Coûts d'hébergement</h2>
  <div class="hgrid">
    <div class="hbox">
      <h4>&#128154; Actuellement (développement)</h4>
      <p>Supabase gratuit : 500 Mo de base de données, 1 Go de stockage. Vercel gratuit : hébergement du site. Suffisant pour les tests et la validation.</p>
    </div>
    <div class="hbox">
      <h4>&#128200; En production (estimatif)</h4>
      <p>Supabase Pro : ~25 $/mois. Vercel Pro : ~20 $/mois. Nom de domaine (ex. mosquee-bilal.fr) : ~15 €/an chez OVH, Gandi ou Infomaniak.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 17 : SECURITE -->
<div class="page">
  <div class="ptbar"><h1 class="pt">16. Sécurité et protection des données (RGPD)</h1></div>

  <h2>Sécurité des accès</h2>
  <div class="hgrid">
    <div class="hbox">
      <h4>&#128272; Double authentification (2FA)</h4>
      <p>Chaque administrateur utilise une application d'authentification (ex. Google Authenticator) en plus de son mot de passe. Même si un mot de passe est compromis, le compte reste inaccessible sans le code secondaire.</p>
    </div>
    <div class="hbox">
      <h4>&#128101; Accès par rôles</h4>
      <p>Trois niveaux : <strong>Administrateur</strong> (accès complet), <strong>Éditeur</strong> (contenu uniquement), <strong>Visiteur</strong> (inscriptions uniquement). Chaque utilisateur ne voit que ce qui le concerne.</p>
    </div>
  </div>
  <div class="hgrid" style="margin-top:2mm;">
    <div class="hbox">
      <h4>&#128274; Données chiffrées</h4>
      <p>Toutes les communications sont chiffrées (HTTPS/TLS). Les mots de passe ne sont jamais stockés en clair dans la base de données.</p>
    </div>
    <div class="hbox">
      <h4>&#128373; Validation manuelle</h4>
      <p>La création d'un compte membre n'est pas automatique : chaque demande est examinée et validée manuellement par un administrateur avant activation.</p>
    </div>
  </div>

  <h2 style="margin-top:5mm;">Conformité RGPD</h2>
  <p>Le Règlement Général sur la Protection des Données impose des obligations aux organisations collectant des données personnelles. Mesures en place :</p>
  <ul class="cl" style="margin-top:2mm;">
    <li class="ok">Page <strong>Politique de confidentialité</strong> complète et accessible depuis toutes les pages</li>
    <li class="ok">Page <strong>Mentions légales</strong> conforme</li>
    <li class="ok"><strong>Droit à l'effacement</strong> : suppression intégrale d'un compte et de ses données sur demande</li>
    <li class="ok">Collecte de données <strong>limitée au strict nécessaire</strong> (nom, email, téléphone optionnel)</li>
    <li class="ok">Accès aux données personnelles <strong>restreint par rôle</strong></li>
    <li class="ok">Pas d'inscription automatique — <strong>validation humaine</strong> obligatoire</li>
    <li class="ok">Mots de passe <strong>jamais stockés en clair</strong>, chiffrés côté serveur</li>
  </ul>
</div>

<!-- ═══════════════════════════════════════════════════════════ PAGE 18 : AVANCEMENT -->
<div class="page page-last">
  <div class="ptbar"><h1 class="pt">17. État d'avancement et prochaines étapes</h1></div>

  <div class="prog-wrap">
    <div class="prog-lbl">Avancement global du projet</div>
    <div class="prog-bar"><div class="prog-fill" style="width:78%;"></div></div>
    <div class="prog-sub">78 % — Phase 3 (back-office) en cours de finalisation</div>
  </div>

  <h2>Fonctionnalités terminées</h2>
  <ul class="cl">
    <li class="ok">Site public complet (9 pages, responsive, mode clair/sombre)</li>
    <li class="ok">Horaires de prière dynamiques (widget Mawaqit intégré)</li>
    <li class="ok">Système d'authentification sécurisé avec double facteur (2FA)</li>
    <li class="ok">Gestion des articles (rédaction, images, mise en avant, réordonnancement)</li>
    <li class="ok">Gestion des activités (cours mosquée, école arabe, sorties)</li>
    <li class="ok">Inscriptions en ligne avec back-office de suivi et validation</li>
    <li class="ok">Gestion des comptes administrateurs et éditeurs (invitation par email)</li>
    <li class="ok">Gestion des membres visiteurs (demandes d'accès, validation, RGPD)</li>
    <li class="ok">Pages légales (mentions légales, politique de confidentialité RGPD)</li>
    <li class="ok">Certificat de conversion — formulaire en ligne</li>
  </ul>

  <h2 style="margin-top:4mm;">Fonctionnalités restantes (3)</h2>
  <ul class="cl">
    <li class="nd"><strong>Module de communication</strong> — messagerie pour contacter les membres depuis l'administration</li>
    <li class="nd"><strong>Gestion des dons</strong> — tableau de suivi et liens vers les plateformes de collecte</li>
    <li class="nd"><strong>Expiration automatique des articles</strong> — archivage auto à date dépassée</li>
  </ul>

  <h2 style="margin-top:4mm;">Prochaines étapes recommandées</h2>
  <div class="agrid">
    <div class="abox">
      <h4>1. Finalisation</h4>
      <ul>
        <li>Module communication</li>
        <li>Gestion des dons</li>
        <li>Expiration articles</li>
        <li>Tests complets</li>
      </ul>
    </div>
    <div class="abox">
      <h4>2. Mise en ligne</h4>
      <ul>
        <li>Acquisition d'un nom de domaine</li>
        <li>Configuration email professionnel</li>
        <li>Déploiement sur Vercel</li>
        <li>Configuration Supabase production</li>
      </ul>
    </div>
    <div class="abox">
      <h4>3. Lancement</h4>
      <ul>
        <li>Formation des éditeurs</li>
        <li>Saisie du contenu définitif</li>
        <li>Annonce à la communauté</li>
        <li>Collecte des retours</li>
      </ul>
    </div>
  </div>

  <div class="callout" style="margin-top:5mm;">
    <p>Le site est d'ores et déjà fonctionnel et pleinement testable. La mise en production peut intervenir dès la finalisation des 3 fonctionnalités restantes et l'acquisition d'un nom de domaine. L'ensemble du projet est livré avec son code source complet et documenté.</p>
  </div>
</div>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  // ── Phase 1 : captures (navigateur visible pour la connexion 2FA) ──────────
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const s = {};

  console.log('\n══ Phase 1 : captures d\'ecran ══\n');
  console.log('Pages publiques...\n');

  await page.goto(BASE + '/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.accueil = await shot(page, 'Accueil');

  await page.goto(BASE + '/actualites');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.actualites = await shot(page, 'Actualites');

  await page.goto(BASE + '/activites');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.activites = await shot(page, 'Activites');

  await page.goto(BASE + '/documentation');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.documentation = await shot(page, 'Documentation Islam');

  await page.goto(BASE + '/infos');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.infos = await shot(page, 'Infos pratiques');

  await page.goto(BASE + '/don');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.don = await shot(page, 'Dons');

  await page.goto(BASE + '/certificat');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.certificat = await shot(page, 'Certificat de conversion');

  console.log('\n══ Connexion admin requise ══');
  console.log('------------------------------------------------------------');
  console.log('Un navigateur va s\'ouvrir sur la page de connexion.');
  console.log('Connectez-vous avec votre email, mot de passe et code 2FA.');
  console.log('Attendez d\'etre redirige vers le tableau de bord.');
  console.log('------------------------------------------------------------');
  await page.goto(BASE + '/admin');
  await waitForEnter('\nAppuyez sur Entree une fois connecte et sur le tableau de bord > ');

  console.log('\nPages back-office...\n');

  await page.goto(BASE + '/admin/dashboard');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.dashboard = await shot(page, 'Tableau de bord');

  await page.goto(BASE + '/admin/dashboard/articles');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.articles = await shot(page, 'Articles');

  await page.goto(BASE + '/admin/dashboard/activites');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.activitesAdmin = await shot(page, 'Activites (admin)');

  await page.goto(BASE + '/admin/dashboard/inscriptions');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.inscriptions = await shot(page, 'Inscriptions');

  await page.goto(BASE + '/admin/dashboard/utilisateurs');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.utilisateurs = await shot(page, 'Utilisateurs');

  await page.goto(BASE + '/admin/dashboard/visiteurs');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1200);
  s.visiteursDemandes = await shot(page, 'Visiteurs - Demandes');

  try {
    await page.getByRole('button', { name: 'Comptes visiteurs' }).click();
    await page.waitForTimeout(700);
    s.visiteursComptes = await shot(page, 'Visiteurs - Comptes');
  } catch {
    s.visiteursComptes = s.visiteursDemandes;
  }

  await browser.close();
  console.log('\nToutes les captures effectuees.');

  // ── Phase 2 : generation PDF (navigateur headless) ─────────────────────────
  console.log('\n══ Phase 2 : generation du PDF ══\n');
  const hBrowser = await chromium.launch({ headless: true });
  const hCtx = await hBrowser.newContext();
  const hPage = await hCtx.newPage();
  await hPage.setContent(buildReport(s), { waitUntil: 'networkidle' });
  await hPage.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await hBrowser.close();

  console.log('✅  PDF genere : ' + OUT + '\n');
}

main().catch(err => { console.error(err); process.exit(1); });
