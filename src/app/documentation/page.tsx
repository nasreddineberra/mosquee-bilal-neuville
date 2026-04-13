'use client';

import { useState } from 'react';
import { Building, BookOpen, ScrollText, BookMarked, Moon, CircleHelp, ChevronRight, X, BookOpenCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  content: string;
}

interface DocCategory {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  topics: Topic[];
}

const categories: DocCategory[] = [
  {
    id: 1,
    title: 'Les fondements de l\'Islam',
    subtitle: 'Les 5 piliers et les 6 piliers de la foi',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '1-1',
        title: 'La Shahada — La profession de foi',
        content: `La Shahada est le premier pilier de l'Islam : « Ach'hadu an lâ ilâha illallâh wa ach'hadu anna Muhammadan Rasûlullâh » — « Je témoigne qu'il n'y a de divinité qu'Allah, et je témoigne que Muhammad est le messager d'Allah. »

La prononcer avec conviction et sincérité suffit pour entrer en Islam. Elle contient deux parties :

**La première partie — le Tawhid :** « Il n'y a de divinité qu'Allah ». Allah est unique, sans associé ni semblable. Tout culte ne doit être adressé qu'à Lui seul.

**La deuxième partie :** « Muhammad est le messager d'Allah ». Reconnaissance que le Prophète ﷺ est le dernier des prophètes et que ses enseignements constituent la voie à suivre.

La Shahada n'est pas seulement une formule orale. Elle engage toute la vie du croyant : ses actes, ses convictions et ses relations avec les autres et avec Dieu.`,
      },
      {
        id: '1-2',
        title: 'La Salat — La prière rituelle',
        content: `La Salat est le deuxième pilier de l'Islam. Chaque musulman pubère accomplit cinq prières quotidiennes aux moments prescrits :

**Les cinq prières :**
- **Fajr** — prière de l'aube
- **Dhuhr** — prière de la mi-journée
- **Asr** — prière de l'après-midi
- **Maghrib** — prière du coucher du soleil
- **Isha** — prière du soir

La prière est un lien direct entre le serviteur et son Seigneur, sans intermédiaire. Elle rappelle à l'être humain sa nature de créature et préserve du péché : « En vérité, la prière préserve de la turpitude et du blâmable. » (Coran 29:45)

La purification (wudu) est une condition préalable à la prière.`,
      },
      {
        id: '1-3',
        title: 'La Zakat — L\'aumône légale',
        content: `La Zakat est le troisième pilier. Elle consiste en un prélèvement annuel obligatoire sur la richesse des musulmans qui possèdent un minimum (nissab) depuis une année lunaire complète.

**Le nissab :** 85 grammes d'or ou 595 grammes d'argent (ou leur équivalent en liquidités).

**Le taux :** généralement 2,5 % du capital détenu.

**Les bénéficiaires** sont définis par le Coran (9:60) : les pauvres, les nécessiteux, les endettés, les voyageurs en détresse, et d'autres catégories précises.

La Zakat est un acte d'adoration et de purification de l'âme et des biens. Elle crée une solidarité entre les membres de la communauté musulmane et rappelle que la richesse est un dépôt confié par Allah.`,
      },
      {
        id: '1-4',
        title: 'Le Siyam — Le jeûne du Ramadan',
        content: `Le Siyam est le quatrième pilier. Il est obligatoire pour tout musulman pubère, sain d'esprit et en bonne santé durant le mois de Ramadan.

Il consiste à s'abstenir de manger, de boire, d'avoir des relations conjugales et de tout ce qui rompt le jeûne, depuis l'aube (Fajr) jusqu'au coucher du soleil (Maghrib).

**La valeur du Ramadan :** C'est le mois durant lequel le Coran a commencé à être révélé. Le Prophète ﷺ a dit : « Quand Ramadan arrive, les portes du paradis sont ouvertes, les portes de l'enfer sont fermées, et les démons sont enchaînés. »

**Les bénéfices spirituels :** Le jeûne enseigne la patience, la maîtrise de soi et la compassion envers les nécessiteux.

**Les exemptions :** Les malades, les voyageurs, les femmes enceintes ou allaitantes, et les personnes âgées peuvent être exemptés ou autorisés à rattraper ou compenser.`,
      },
      {
        id: '1-5',
        title: 'Le Hajj — Le pèlerinage à La Mecque',
        content: `Le Hajj est le cinquième pilier. Il est obligatoire une fois dans la vie pour tout musulman adulte, sain d'esprit, qui en a les moyens physiques et financiers.

Il se déroule durant le mois de Dhu al-Hijja et comporte plusieurs rites essentiels :

**Les rites principaux :**
1. **L'Ihram** — état de sacralisation avec port d'un vêtement blanc symbolisant l'égalité entre tous
2. **Le Tawaf** — tourner 7 fois autour de la Kaaba
3. **Le Sa'y** — aller-retour 7 fois entre les collines de Safa et Marwa
4. **Le séjour à Arafat** — pilier central du Hajj, le 9 Dhu al-Hijja
5. **La lapidation (Ramy)** — jeter des pierres sur les stèles à Mina
6. **Le sacrifice (Udhiya)** — en commémoration du sacrifice d'Ibrahim

Le Hajj représente l'unité de la Oumma : des millions de musulmans du monde entier, toutes origines confondues, accomplissent les mêmes gestes.`,
      },
      {
        id: '1-6',
        title: 'Les 6 piliers de la foi (Arkan al-Iman)',
        content: `La foi islamique repose sur six piliers, tels qu'enseignés dans le hadith de Djibril :

**1. La foi en Allah**
Croire en l'existence et l'unicité absolue d'Allah, en Ses noms et attributs parfaits.

**2. La foi en Ses anges**
Créatures de lumière qui obéissent parfaitement à Allah. Parmi eux : Djibril, Mikail, Israfil...

**3. La foi en Ses Livres**
Torah (Musa), Psaumes (Dawud), Évangile (Isa), et le Coran (Muhammad ﷺ) — dernier et préservé dans sa forme originelle.

**4. La foi en Ses messagers**
Tous les prophètes depuis Adam jusqu'à Muhammad ﷺ, le dernier d'entre eux.

**5. La foi au Jour Dernier**
La résurrection, le jugement, le paradis (Janna) et l'enfer (Jahannam).

**6. La foi au destin (Qadar)**
Tout ce qui existe est dans la connaissance d'Allah et selon Sa volonté, tout en reconnaissant que l'être humain est doté d'un libre arbitre et est responsable de ses actes.`,
      },
    ],
  },
  {
    id: 2,
    title: 'Le Coran',
    subtitle: 'Révélation, récitation et compréhension',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '2-1',
        title: 'Introduction au Coran',
        content: `Le Coran est la parole d'Allah révélée au Prophète Muhammad ﷺ par l'intermédiaire de l'ange Djibril sur une période d'environ 23 ans (610–632 ap. J.-C.).

**Structure :**
114 sourates (chapitres), divisées en versets (ayat). La plus courte (Al-Kawthar) compte 3 versets ; la plus longue (Al-Baqara) en compte 286.

**La première révélation :**
Les premiers versets révélés furent le début de la sourate Al-Alaq : « Lis, au nom de ton Seigneur qui a créé... » C'était dans la grotte de Hira, en l'an 610.

**Préservation :**
Le Coran est resté intact depuis sa révélation, préservé à la fois par écrit et par mémorisation orale. Des millions de musulmans (hafiz) le mémorisent intégralement de nos jours.

**La langue :**
Le Coran a été révélé en arabe classique. Sa traduction est possible pour la compréhension, mais la récitation liturgique se fait toujours en arabe original.`,
      },
      {
        id: '2-2',
        title: 'La révélation et la compilation',
        content: `**La révélation progressive (Tanzil) :**
Le Coran n'a pas été révélé en une seule fois mais sur environ 23 ans, en réponse aux événements vécus par la communauté musulmane naissante.

**Sourates mecquoises et médinoises :**
- Sourates de La Mecque : foi (Tawhid), morale, histoires des prophètes, vie après la mort
- Sourates de Médine : législation, relations sociales, affaires de la communauté

**La compilation sous Abu Bakr (11 H) :**
Après la mort du Prophète ﷺ, Abu Bakr chargea Zayd ibn Thabit de réunir le Coran en un seul volume (mushaf), à partir des écrits sur parchemins et de la mémoire des Compagnons.

**La standardisation sous Uthman (25 H) :**
Le troisième calife fit reproduire le mushaf en plusieurs exemplaires officiels distribués dans les différentes provinces, assurant l'uniformité du texte coranique pour toutes les générations futures.`,
      },
      {
        id: '2-3',
        title: 'Le Tajwid — Les règles de récitation',
        content: `Le Tajwid est la science qui détermine les règles de prononciation et de récitation correcte du Coran. Réciter avec le Tajwid est une obligation lors de la prière.

**Les principales règles :**

**La Madd (prolongation)** — allongement de certaines voyelles selon des règles précises (2, 4 ou 6 temps).

**Le Ghunna (nasalisation)** — nasalisation du nun et du mim.

**L'Idgham (assimilation)** — fusion de certaines lettres avec celles qui suivent.

**L'Ikhfa (occultation)** — prononciation nasale partielle du nun devant certaines lettres.

**La Qalqala (vibration)** — légère vibration de certaines lettres (ق ط ب ج د) en position sukun.

**Apprendre le Tajwid :**
Il est vivement recommandé de l'apprendre auprès d'un enseignant qualifié qui peut corriger la prononciation en direct. La Mosquée Bilal propose des cours de Tajwid — renseignez-vous auprès du secrétariat.`,
      },
      {
        id: '2-4',
        title: 'Le Tafsir — Comprendre le Coran',
        content: `Le Tafsir est l'exégèse coranique : la science qui explique le sens des versets, leur contexte de révélation (asbab al-nuzul) et leur portée juridique et spirituelle.

**Les méthodes :**

**Tafsir bil-Ma'thur** — expliquer le Coran par le Coran, puis par la Sunna, puis par les Compagnons. C'est la méthode la plus authentique.

**Tafsir bil-Ra'y** — interprétation basée sur l'effort intellectuel, encadrée par la langue arabe et les sciences islamiques.

**Les grands livres de Tafsir :**
- **Tafsir Ibn Kathir** — référence classique, riche en hadiths
- **Tafsir al-Tabari** — l'un des plus anciens et des plus complets
- **Tafsir al-Sa'di** — accessible, recommandé pour les débutants

**Attention :** Le Coran ne doit pas être interprété de façon isolée, sans connaissance des autres sciences islamiques. Appuyez-vous sur des sources reconnues et des savants qualifiés.`,
      },
      {
        id: '2-5',
        title: 'La mémorisation du Coran (Hifz)',
        content: `La mémorisation intégrale du Coran est l'une des plus nobles entreprises. Celui qui mémorise le Coran est appelé **Hafiz**.

**La récompense :**
Le Prophète ﷺ a dit : « Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. » (Bukhari). Le Hafiz intercèdera pour dix membres de sa famille le Jour du Jugement.

**Comment commencer :**
1. Maîtriser la lecture arabe et les bases du Tajwid
2. Choisir un enseignant pour encadrer
3. Commencer par les courtes sourates (Juz' Amma, 30ème partie)
4. La régularité avant tout — quelques versets par jour régulièrement
5. La révision quotidienne (muraja'a) est indispensable

**Conseils :**
- Mémoriser après Fajr, moment de plus grande réceptivité
- Écouter régulièrement les récitations des grands Qurra
- Faire du Coran une compagnie permanente au quotidien

La Mosquée Bilal propose des cours pour enfants et adultes. Contactez-nous pour plus d'informations.`,
      },
    ],
  },
  {
    id: 3,
    title: 'La Sira',
    subtitle: 'La vie du Prophète Muhammad ﷺ',
    icon: ScrollText,
    image: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '3-1',
        title: 'Naissance et jeunesse du Prophète ﷺ',
        content: `**La naissance :**
Muhammad ibn Abdallah naquit à La Mecque vers l'an 570 ap. J.-C. (l'année de l'Éléphant). Il appartenait au clan des Banu Hashim, de la tribu de Quraysh.

**L'orphelin :**
Son père Abdallah mourut avant sa naissance. Sa mère Amina décéda alors qu'il avait 6 ans. Il fut confié à son grand-père Abdul Muttalib, puis à son oncle Abu Talib.

**Al-Amin — L'honnête :**
Dès sa jeunesse, Muhammad ﷺ était connu pour son honnêteté et son intégrité. La communauté mecquoise lui avait donné le surnom d'**Al-Amin** (le digne de confiance).

**Le mariage avec Khadija :**
À l'âge de 25 ans, il épousa Khadija bint Khuwaylid, une veuve commerçante respectée. Ce fut un mariage d'amour et de profond respect mutuel. Khadija fut sa première et unique épouse pendant 25 ans, et la mère de la plupart de ses enfants. Elle fut aussi la première à croire en sa mission prophétique.`,
      },
      {
        id: '3-2',
        title: 'La première révélation et la mission',
        content: `**La retraite spirituelle :**
Avant la révélation, Muhammad ﷺ se retirait dans la grotte de Hira, sur le mont Nur près de La Mecque, pour méditer.

**La nuit du destin (610 ap. J.-C.) :**
À 40 ans, l'ange Djibril lui apparut et dit : « Lis ! » (Iqra). Après trois étreintes, Djibril lui récita les premiers versets de la sourate Al-Alaq.

**Le réconfort de Khadija :**
Tremblant, Muhammad ﷺ rentra chez lui. Khadija le réconforta et l'emmena chez son cousin Waraqa ibn Nawfal, un chrétien lettré qui reconnut la description de la révélation.

**Les débuts de la prédication :**
- Les premières personnes à accepter l'Islam : Khadija, Ali ibn Abi Talib, Zayd ibn Haritha, Abu Bakr
- Les 3 premières années : prédication discrète dans le cercle proche
- À partir de la 4ème année : prédication publique, forte opposition des notables qurayshites`,
      },
      {
        id: '3-3',
        title: 'L\'Hégire — De La Mecque à Médine',
        content: `**La persécution :**
Face à la résistance des Quraysh, les musulmans subirent des persécutions croissantes. Certains furent torturés, d'autres contraints à l'exil.

**L'année de la tristesse (619 ap. J.-C.) :**
Le Prophète ﷺ perdit deux soutiens précieux : son épouse Khadija et son oncle Abu Talib.

**Le voyage nocturne (Isra' et Mi'raj) :**
Allah fit voyager Son Prophète de La Mecque à Jérusalem, puis l'éleva à travers les cieux. C'est lors de ce voyage que les cinq prières furent prescrites.

**L'Hégire (622 ap. J.-C.) :**
Face aux menaces sur sa vie, le Prophète ﷺ émigra vers Médine avec Abu Bakr. Ils se cachèrent trois jours dans la grotte de Thawr avant d'atteindre Médine, où ils furent accueillis avec une immense joie.

Ce départ marque le début du calendrier islamique (an 1 de l'Hégire).`,
      },
      {
        id: '3-4',
        title: 'Le caractère du Prophète ﷺ',
        content: `« Vous avez dans le Messager d'Allah un excellent modèle à suivre. » (Coran 33:21)

**Sa douceur et sa miséricorde :**
Il n'a jamais frappé ni une femme, ni un serviteur. Il disait : « Je n'ai été envoyé que comme miséricorde pour les mondes. »

**Son humilité :**
Malgré sa position, il réparait lui-même ses sandales, recousait ses vêtements, aidait à la maison. Il n'aimait pas que les gens se lèvent à son arrivée.

**Sa générosité :**
Jabir ibn Abdallah rapporte : « Le Prophète ﷺ n'a jamais refusé à quelqu'un qui lui demandait quelque chose. »

**Sa patience :**
Face aux offenses et aux persécutions, il faisait preuve d'une patience remarquable, demandant à Allah de guider ses oppresseurs.

**Son sourire :**
Abdullah ibn al-Harith rapporte : « Je n'ai jamais vu quelqu'un sourire plus que le Prophète ﷺ. »

**Aïcha, interrogée sur son caractère, répondit : « Son caractère, c'était le Coran. »**`,
      },
      {
        id: '3-5',
        title: 'Le dernier pèlerinage et la mort du Prophète ﷺ',
        content: `**Le pèlerinage de l'Adieu (10 H) :**
En l'an 10 de l'Hégire, le Prophète ﷺ accomplit son unique pèlerinage. Plus de 100 000 Compagnons l'accompagnèrent.

**Le discours de l'Adieu (extraits) :**
*« Vos vies, vos biens et votre honneur sont sacrés et inviolables... Traitez vos femmes avec bonté... J'ai laissé parmi vous deux choses : si vous vous y tenez, vous ne vous égarerez jamais — la Parole d'Allah et la Sunna de Son Prophète... »*

À la fin de ce pèlerinage fut révélé : « Aujourd'hui, J'ai parachevé pour vous votre religion. » (Coran 5:3)

**La mort (12 Rabi' al-Awwal, an 11 H) :**
Quelques mois après son retour, le Prophète ﷺ tomba gravement malade. Il mourut dans les bras d'Aïcha, à Médine.

Abu Bakr dit : « Quiconque adorait Muhammad sache que Muhammad est mort. Quiconque adore Allah sache qu'Allah est vivant et ne mourra jamais. »`,
      },
    ],
  },
  {
    id: 4,
    title: 'Les Hadiths',
    subtitle: 'La Sunna — paroles, actes et approbations du Prophète ﷺ',
    icon: BookMarked,
    image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '4-1',
        title: 'Qu\'est-ce qu\'un hadith ?',
        content: `Un **hadith** est un récit rapportant les paroles, les actes ou les approbations du Prophète ﷺ. L'ensemble des hadiths constitue la **Sunna**, deuxième source de la législation islamique après le Coran.

**La structure d'un hadith :**
1. **L'isnad** (chaîne de transmission) — la liste des transmetteurs de génération en génération
2. **Le matn** (le texte) — le contenu du hadith lui-même

**Exemple :** « Umar ibn al-Khattab a dit : J'ai entendu le Messager d'Allah ﷺ dire : *Les actes ne valent que par les intentions...* »

**Les catégories d'authenticité :**
- **Sahih (authentique)** — chaîne continue, transmetteurs fiables et précis
- **Hasan (bon)** — légèrement inférieur en qualité mais acceptable
- **Da'if (faible)** — défaillance dans la chaîne
- **Mawdu' (forgé)** — inventé, catégoriquement rejeté

Les savants ont développé une science rigoureuse pour évaluer chaque transmetteur : sa fiabilité, sa mémoire, ses rencontres avec les autres transmetteurs.`,
      },
      {
        id: '4-2',
        title: 'Les grands recueils de hadiths',
        content: `Les savants des 2ème et 3ème siècles de l'Hégire ont travaillé pour collecter, vérifier et compiler les hadiths du Prophète ﷺ.

**Les Kutub al-Sitta — Les Six Recueils Canoniques :**

**1. Sahih al-Bukhari** (m. 256 H)
Considéré comme le livre le plus authentique après le Coran. Al-Bukhari a sélectionné ~7 275 hadiths parmi plus de 600 000 collectés.

**2. Sahih Muslim** (m. 261 H)
Le deuxième livre le plus authentique. ~7 500 hadiths soigneusement sélectionnés.

**3. Sunan Abu Dawud** — spécialisé dans les questions juridiques

**4. Sunan al-Tirmidhi** — inclut des commentaires sur le degré d'authenticité

**5. Sunan al-Nasa'i** — reconnu pour sa rigueur dans la critique des transmetteurs

**6. Sunan Ibn Majah** — complète la collection sur les questions pratiques

**Al-Muwatta de l'Imam Malik** — l'un des plus anciens recueils compilés.`,
      },
      {
        id: '4-3',
        title: 'Les 40 hadiths de l\'Imam Nawawi',
        content: `**Al-Arba'in al-Nawawiyya** est un recueil de 42 hadiths compilé par l'Imam al-Nawawi (m. 676 H). C'est l'un des textes islamiques les plus étudiés dans le monde entier.

**Quelques hadiths essentiels :**

**Hadith 1 — L'intention :**
*« Les actes ne valent que par les intentions, et chaque homme n'aura que ce qu'il a eu intention de faire... »* (Bukhari, Muslim)

**Hadith 2 — Les fondements de l'Islam :**
*« L'Islam est fondé sur cinq choses : témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est Son messager, accomplir la prière, acquitter la Zakat, accomplir le pèlerinage et jeûner le Ramadan. »* (Bukhari, Muslim)

**Hadith 6 — Le licite et l'illicite :**
*« Le licite est évident et l'illicite est évident, et entre les deux il y a des choses douteuses... »* (Bukhari, Muslim)

**Hadith 9 — Facilité de l'Islam :**
*« Ce dont je vous ai interdit, abstenez-vous-en ; ce que je vous ai ordonné, accomplissez-en ce que vous pouvez. »* (Bukhari, Muslim)

Ces hadiths sont accessibles en librairie islamique et en ligne dans de nombreuses traductions commentées.`,
      },
      {
        id: '4-4',
        title: 'Le hadith de Djibril',
        content: `Le hadith de Djibril est souvent appelé « l'Oumm al-Sunna » car il résume les fondements de la religion.

**Le texte (rapporté par Umar, Sahih Muslim) :**

Un jour que nous étions assis auprès du Prophète ﷺ, apparut un homme aux vêtements d'une blancheur éclatante, sans trace de voyage, qu'aucun d'entre nous ne connaissait. Il s'assit et dit :

*« Ô Muhammad, informe-moi de l'Islam. »*
Il répondit : *« L'Islam, c'est de témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est Son messager, d'accomplir la prière, d'acquitter la Zakat, de jeûner le Ramadan et d'accomplir le pèlerinage si tu en as les moyens. »*

*« Informe-moi de l'Iman. »*
Il répondit : *« C'est de croire en Allah, en Ses anges, en Ses Livres, en Ses messagers, au Jour Dernier et au destin. »*

*« Informe-moi de l'Ihsan. »*
Il répondit : *« C'est d'adorer Allah comme si tu Le voyais, et si tu ne Le vois pas, Lui te voit. »*

Puis il s'en alla. Le Prophète ﷺ dit : « C'était Djibril, qui est venu vous enseigner votre religion. »

Ce hadith présente les trois dimensions : **Islam** (soumission), **Iman** (foi) et **Ihsan** (excellence spirituelle).`,
      },
    ],
  },
  {
    id: 5,
    title: 'La Prière',
    subtitle: 'Guide complet de la Salat',
    icon: BookOpenCheck,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '5-1',
        title: 'Les conditions de validité de la prière',
        content: `**1. L'Islam**
La prière n'est valide que pour un musulman.

**2. La raison et l'âge**
Obligatoire pour tout adulte sain d'esprit. Encouragée dès 7 ans, obligatoire dès 10 ans.

**3. La pureté rituelle (Tahara)**
- **Wudu** (ablutions mineures) — après sommeil, toilettes, etc.
- **Ghusl** (ablutions majeures) — après rapports conjugaux, menstruations, etc.
- **Tayammum** — purification sèche en l'absence d'eau

**4. La pureté du corps, des vêtements et du lieu de prière**
Exempts de toute impureté (najasa).

**5. La couverture de la 'awra**
- Homme : du nombril jusqu'aux genoux inclus
- Femme : tout le corps sauf le visage et les mains

**6. Faire face à la Qibla**
Direction de la Kaaba à La Mecque. En France, approximativement vers le sud-est.

**7. Être dans le temps de la prière**
Chaque prière a son temps prescrit.

**8. L'intention (Niyya)**
L'intention dans le cœur suffit — il n'est pas nécessaire de la prononcer à voix haute.`,
      },
      {
        id: '5-2',
        title: 'Les ablutions (Wudu) — étape par étape',
        content: `Le Wudu est la purification rituelle mineure, nécessaire avant la prière et la lecture du Coran.

**Les étapes recommandées :**

1. Commencer par **Bismillah**
2. **Laver les mains** 3 fois
3. **Se rincer la bouche** 3 fois
4. **Se rincer les narines** 3 fois
5. **Laver le visage** 3 fois (de l'oreille droite à la gauche, du front au menton)
6. **Laver le bras droit** jusqu'au coude 3 fois, puis le gauche
7. **Essuyer la tête** une fois (avant vers arrière puis retour)
8. **Essuyer les oreilles** (intérieur et extérieur) une fois
9. **Laver le pied droit** jusqu'à la cheville 3 fois, puis le gauche
10. **Terminer par la dua** : « Ach'hadu an lâ ilâha illallâh... »

**Ce qui invalide le Wudu :**
- Excréments, urines, vents
- Sommeil profond
- Perte de conscience
- Relations conjugales`,
      },
      {
        id: '5-3',
        title: 'Les étapes de la prière',
        content: `**Avant de commencer :** pureté, face à la Qibla, intention dans le cœur.

**1. Takbirat al-Ihram** — « Allahu Akbar » (lever les mains à hauteur des oreilles) : débute la prière

**2. Station debout (Qiyam) :**
- Réciter la Fatiha (obligatoire)
- Réciter une autre sourate (Sunna)

**3. Inclinaison (Ruku') :**
- « Allahu Akbar » en s'inclinant
- 3 fois : « Subhana Rabbiyal-Azim »
- Se relever : « Sami'allahu liman hamidah — Rabbana wa lakal-hamd »

**4. Prosternation (Sujud) :**
- Poser genoux, mains, front et nez au sol
- 3 fois : « Subhana Rabbiyal-A'la »
- Le nez, le front, les deux mains, les deux genoux et les orteils doivent toucher le sol

**5. Position assise entre les deux prosternations :**
- « Rabbighfirli » (Mon Seigneur, pardonne-moi)

**6. Tashahhud** — position assise finale avec récitation

**7. Taslim — clôture :**
- Droite : « As-salamu alaykum wa rahmatullah »
- Gauche : « As-salamu alaykum wa rahmatullah »`,
      },
      {
        id: '5-4',
        title: 'La prière du vendredi (Joumou\'a)',
        content: `La prière du Vendredi est une obligation individuelle pour tout homme musulman adulte, libre, résident et en bonne santé.

Allah dit : « Ô les croyants ! Quand on appelle à la Salat du vendredi, accourez à l'invocation d'Allah et laissez tout négoce. » (62:9)

**Conditions spécifiques :**
- Se faire en congrégation
- Deux khutbas (sermons) avant la prière
- Se dérouler dans le temps du Dhuhr

**Ce qui est recommandé le vendredi :**
- Se laver (ghusl du vendredi)
- Porter de beaux vêtements
- Lire la sourate Al-Kahf
- Envoyer beaucoup de salutations sur le Prophète ﷺ
- Faire beaucoup de dua à l'heure bénie

**À la Mosquée Bilal :**
Premier sermon à 13h00. Il est recommandé d'arriver tôt pour accomplir la prière de tahiyat al-masjid.

**L'avertissement :**
Le Prophète ﷺ a dit : « Que des gens cessent d'abandonner la prière du Vendredi, ou Allah apposera un sceau sur leurs cœurs. » (Muslim)`,
      },
    ],
  },
  {
    id: 6,
    title: 'Le Jeûne',
    subtitle: 'Ramadan et jours de jeûne recommandés',
    icon: Moon,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '6-1',
        title: 'Les piliers et conditions du jeûne',
        content: `**L'obligation du jeûne :**
« Ô les croyants ! On vous a prescrit le jeûne comme on l'a prescrit à ceux d'avant vous, ainsi atteindrez-vous la piété. » (Coran 2:183)

**Les piliers du jeûne :**
1. **L'intention (Niyya)** — formulée chaque nuit avant l'aube
2. **L'abstinence** — de tout ce qui rompt le jeûne, du Fajr au Maghrib

**Conditions de l'obligation :** être musulman, pubère, sain d'esprit et en bonne santé. Les malades, voyageurs, femmes enceintes ou allaitantes peuvent être exemptés.

**Ce qui rompt le jeûne :**
- Manger et boire délibérément
- Rapports conjugaux
- Vomissements volontaires

**Ce qui ne rompt PAS le jeûne :**
- Oubli (manger par oubli n'invalide pas le jeûne)
- Le bain, le rinçage de la bouche sans avaler
- Les injections médicamenteuses (selon la majorité des savants)
- Le miswak`,
      },
      {
        id: '6-2',
        title: 'Le Ramadan — Le mois béni',
        content: `Le Prophète ﷺ a dit : « Quand Ramadan arrive, les portes du Paradis sont ouvertes, les portes de l'Enfer sont fermées et les démons sont enchaînés. » (Bukhari, Muslim)

**Le programme spirituel du Ramadan :**

**Les 10 premières nuits — La miséricorde (Rahma)**
Intensifier la prière, la récitation du Coran, les dua et les actes de charité.

**Les 10 nuits du milieu — Le pardon (Maghfira)**
Multiplier les actes d'adoration et demander le pardon.

**Les 10 dernières nuits — L'affranchissement du Feu**
Le Prophète ﷺ se retirait en I'tikaf et cherchait Laylat al-Qadr.

**Les pratiques recommandées :**
- **Suhur** — repas de l'aube (fortement recommandé)
- **Iftar** — rupture du jeûne avec dattes et eau
- **Tarawih** — prières nocturnes (8 ou 20 rak'at)
- **Lecture du Coran** — tradition de le compléter durant le mois
- **Sadaqa** — aumônes et bonnes œuvres`,
      },
      {
        id: '6-3',
        title: 'Laylat al-Qadr — La nuit du destin',
        content: `« Nous l'avons certes révélé pendant la Nuit du Destin. La Nuit du Destin est meilleure que mille mois. » (Coran 97:1-3)

**Quand est-elle ?**
Le Prophète ﷺ a dit : « Cherchez Laylat al-Qadr dans les nuits impaires des dix dernières nuits de Ramadan. » Les nuits du 21, 23, 25, 27 et 29. La majorité des savants estiment qu'elle se situe probablement la nuit du 27.

**Comment la passer :**
Le Prophète ﷺ « demeurait éveillé toute la nuit, réveillait ses épouses et se ceignait les reins ». Il est recommandé de :
- Prier le Qiyam al-Layl
- Réciter le Coran
- Faire des dua
- Faire beaucoup d'Istighfar (demande de pardon)

**La dua recommandée :**
Aïcha demanda au Prophète ﷺ quelle dua faire. Il répondit : *« Dis : Allahumma innaka 'Afuwwun Karimun tuhibbul-'afwa fa'fu 'anni »* — « Ô Allah, Tu aimes effacer les péchés, efface donc les miens. »`,
      },
      {
        id: '6-4',
        title: 'Les jeûnes recommandés hors Ramadan',
        content: `**1. Les six jours de Shawwal**
*« Quiconque jeûne Ramadan, puis fait suivre de six jours de Shawwal, c'est comme s'il avait jeûné toute l'année. »* (Muslim)

**2. Le jeûne de 'Ashura (10 Muharram)**
Expie les péchés de l'année précédente. Il est recommandé de jeûner aussi le 9.

**3. Le jeûne de 'Arafa (9 Dhu al-Hijja)**
Pour ceux qui ne font pas le Hajj. *« Je compte sur Allah qu'il expie les péchés de l'année passée et à venir. »* (Muslim)

**4. Les trois jours blancs (Ayyam al-Bid)**
Les 13, 14 et 15 de chaque mois lunaire.

**5. Le lundi et le jeudi**
Le Prophète ﷺ jeûnait ces jours car les œuvres sont présentées à Allah.

**6. Le jeûne de Dawud**
Jeûner un jour sur deux — le jeûne le plus aimé par Allah, mais aussi le plus exigeant.

**La Zakat al-Fitr :**
Aumône obligatoire versée avant la prière de l'Aïd al-Fitr, pour purifier le jeûne et nourrir les pauvres.`,
      },
    ],
  },
  {
    id: 7,
    title: 'FAQ',
    subtitle: 'Questions fréquentes sur l\'Islam',
    icon: CircleHelp,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '7-1',
        title: 'Comment se convertir à l\'Islam ?',
        content: `Pour entrer en Islam, il suffit de prononcer la Shahada avec sincérité et conviction :

**« Ach'hadu an lâ ilâha illallâh, wa ach'hadu anna Muhammadan rasûlullâh »**
*« Je témoigne qu'il n'y a de divinité qu'Allah, et je témoigne que Muhammad est Son messager. »*

C'est tout. Il n'est pas nécessaire d'être devant un imam ou dans une mosquée, bien qu'un accompagnement soit vivement recommandé.

**Après la Shahada :**
- Apprendre les bases : la prière, les ablutions, les piliers de l'Islam
- Progresser à son rythme — l'Islam est une religion de facilité
- Trouver une communauté bienveillante pour vous soutenir

**Et les péchés passés ?**
Le Prophète ﷺ a dit que la conversion efface tout ce qui précède. Vous commencez une page vierge.

**Contactez-nous :**
La Mosquée Bilal accueille avec joie toute personne souhaitant en savoir plus ou envisageant la conversion. Notre équipe est disponible en toute discrétion et bienveillance.`,
      },
      {
        id: '7-2',
        title: 'Qu\'est-ce que le halal ?',
        content: `**Halal (حلال)** signifie « permis » ou « licite ». Son opposé est **haram** (interdit). Ces notions s'appliquent à tous les domaines : nourriture, finance, comportement.

**Le halal alimentaire :**

Ce qui est halal : viandes de bœuf, agneau, poulet, poisson, légumes, fruits — dès lors que l'abattage a été effectué selon les règles islamiques (Dhabh).

**L'abattage islamique :** l'animal doit être vivant et sain, l'égorgement se fait avec un couteau tranchant en prononçant le nom d'Allah.

**Ce qui est haram :**
- Le porc et tous ses dérivés
- Le sang
- Les animaux morts sans abattage rituel
- L'alcool et les substances enivrantes
- Les animaux offerts à d'autres qu'Allah

**La règle de base :** Tout est permis sauf ce qui est explicitement interdit. En cas de doute, s'abstenir.

**Au-delà de la nourriture :** Le halal s'applique aussi aux finances (interdiction du riba — intérêt usuraire) et aux comportements (honnêteté, respect de la parole donnée).`,
      },
      {
        id: '7-3',
        title: 'Comment apprendre à prier ?',
        content: `Apprendre la prière est la première priorité de tout nouveau musulman.

**Étape 1 — Apprendre le Wudu (ablutions)**
Sans Wudu, la prière n'est pas valide. Consultez la section Prière de ce site.

**Étape 2 — Mémoriser Al-Fatiha**
Obligatoire dans chaque rak'a de la prière (7 versets).

**Étape 3 — Apprendre les mouvements et formules de base**
- Le Takbir d'entrée : « Allahu Akbar »
- Les formules du Ruku et du Sujud
- Le Tashahhud et le Taslim

**Étape 4 — Pratiquer avec quelqu'un**
Prier aux côtés d'un musulman expérimenté pour corriger les erreurs.

**Ressources :**
- La Mosquée Bilal propose des cours pour débutants, adultes et enfants
- Des applications comme « Muslim Pro » aident avec les horaires et guides

**L'essentiel :** Le Prophète ﷺ a dit : « Allah n'impose à une âme que ce qu'elle peut supporter. » Commencez par ce que vous pouvez et progressez à votre rythme.`,
      },
      {
        id: '7-4',
        title: 'Islam et vie en Occident',
        content: `L'Islam est une religion universelle qui peut être pratiquée dans tout contexte. Les savants ont développé des règles adaptées à la vie dans des pays non-musulmans (fiqh al-aqalliyyat), tout en préservant les fondamentaux de la foi.

**Les réseaux sociaux et Internet :**
Comme tout outil, ils sont neutres en eux-mêmes. Le critère est leur utilisation : partager du bien, apprendre, communiquer sainement est permis. Ce qui est interdit reste interdit quel que soit le medium.

**L'assurance et la banque :**
L'Islam interdit le riba (intérêt usuraire). Des solutions halal existent : finance islamique, assurances Takaful. Dans les pays où ces alternatives sont limitées, certains savants permettent la nécessité sous conditions strictes.

**Travailler dans un environnement mixte :**
Ce n'est pas interdit en soi. Il faut maintenir les limites islamiques dans les interactions.

**La question du doute :**
Le doute est humain. L'Islam encourage la réflexion et la connaissance. Le Prophète ﷺ a dit : « Demandez, car c'est la guérison de l'ignorance. »`,
      },
      {
        id: '7-5',
        title: 'Où apprendre l\'arabe et le Coran ?',
        content: `La Mosquée Bilal propose plusieurs programmes d'apprentissage.

**Cours de Tajwid :**
- Adultes : chaque samedi matin de 10h à 12h
- Enfants : chaque mercredi de 14h à 16h
- Niveaux débutant et intermédiaire

**Atelier d'initiation à la langue arabe :**
- Pour adultes débutants
- Chaque dimanche matin de 10h à 11h30
- Objectif : lire, écrire et comprendre les bases

**Cours pour enfants :**
- Alphabet arabe, mémorisation des courtes sourates
- Bases de la prière et de la foi

**Inscriptions :** auprès du secrétariat ou via le formulaire de contact de ce site.

**Ressources en ligne :**
- Quran.com — lecture et écoute du Coran avec traduction
- Sunnah.com — accès aux grands recueils de hadiths
- Apprends l'arabe (YouTube) — tutoriels en français

N'hésitez pas à contacter la mosquée pour les horaires, tarifs et modalités d'inscription.`,
      },
    ],
  },
];

function parseContent(text: string) {
  return text.split('\n\n').map((paragraph, i) => {
    const parts = paragraph.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="text-sm text-on-surface/75 leading-relaxed">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-on-surface font-semibold">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

export default function DocumentationPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <>
      <div className="bg-background pt-8 pb-2 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
                Documentation sur l&apos;Islam
              </h1>
            </div>
            <p className="text-on-surface/60 text-sm">
              Articles pédagogiques et ressources pour approfondir vos connaissances.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="card-border group rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Image banner */}
                  <div
                    className="w-full h-24"
                    style={{
                      backgroundImage: `url(${cat.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <h2 className="text-sm font-bold text-primary uppercase tracking-wider leading-tight">
                        {cat.title}
                      </h2>
                    </div>
                    <p className="text-[11px] text-on-surface/50 mb-3 leading-snug">{cat.subtitle}</p>

                    <ul className="space-y-0.5">
                      {cat.topics.map((topic) => (
                        <li key={topic.id}>
                          <button
                            onClick={() => setSelectedTopic(topic)}
                            className="w-full text-left flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-surface-container transition-colors group/item"
                          >
                            <ChevronRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5 group-hover/item:translate-x-0.5 transition-transform" />
                            <span className="text-xs text-on-surface/65 group-hover/item:text-primary transition-colors leading-snug">
                              {topic.title}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Topic Modal — only closable via the X button */}
      {selectedTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop — no onClick */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-[var(--color-card-border)]">
            {/* Close button */}
            <button
              onClick={() => setSelectedTopic(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface/60 hover:text-on-surface transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal content */}
            <div className="p-8 pr-16">
              <h2 className="text-xl md:text-2xl font-serif text-on-surface mb-6 leading-tight">
                {selectedTopic.title}
              </h2>
              <div className="space-y-3">
                {parseContent(selectedTopic.content)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
