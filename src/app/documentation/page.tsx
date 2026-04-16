'use client';

import { useState } from 'react';
import { Building, BookOpen, ScrollText, BookMarked, Moon, CircleHelp, ChevronRight, X, BookOpenCheck, Users, MessageSquareHeart, Star, UserStar } from 'lucide-react';
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
    icon: Star,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '1-1',
        title: 'La Shahada - La profession de foi',
        content: `La Shahada est le tout premier pilier de l'Islam. C'est une phrase simple mais d'une profondeur immense que chaque musulman prononce avec sincérité :

« Ach-hadou an lâ ilâha illallâh, wa ach-hadou anna Muhammadan Rasûlullâh »
Ce qui signifie : « Je témoigne qu'il n'y a de divinité qu'Allah, et je témoigne que Muhammad est le messager d'Allah. »

Cette déclaration se compose de deux parties. La première affirme l'unicité de Dieu : il n'existe qu'un seul Dieu, Allah, sans associé ni semblable, et c'est à Lui seul que le croyant adresse ses prières et son adoration. La seconde reconnaît que le Prophète Muhammad ﷺ est le dernier messager envoyé par Dieu à l'humanité, et que ses enseignements sont la voie à suivre.

Prononcer la Shahada avec conviction suffit pour entrer en Islam. Mais elle ne se limite pas à des mots : elle engage le croyant dans toute sa vie, dans ses actes, ses convictions et ses relations avec les autres.`,
      },
      {
        id: '1-2',
        title: 'La Salat - La prière rituelle',
        content: `La Salat est le deuxième pilier de l'Islam. C'est le lien direct entre le croyant et son Créateur, un moment privilégié que le musulman vit cinq fois par jour, sans aucun intermédiaire.

Les cinq prières quotidiennes rythment la journée du croyant :
- **Fajr** - la prière de l'aube
- **Dhuhr** - la prière de la mi-journée
- **Asr** - la prière de l'après-midi
- **Maghrib** - la prière du coucher du soleil
- **Isha** - la prière du soir

Avant chaque prière, le musulman effectue les ablutions (wudu), un rituel de purification à l'eau qui prépare le corps et l'esprit. La prière elle-même se compose de gestes précis (se tenir debout, s'incliner, se prosterner) accompagnés de récitations coraniques.

Le Coran enseigne que la prière préserve du mal : « En vérité, la prière préserve de la turpitude et du blâmable. » (Coran 29:45). Elle est aussi un moment de paix intérieure, où le croyant se recentre et se rappelle ce qui compte vraiment.`,
      },
      {
        id: '1-3',
        title: 'La Zakat - L\'aumône légale',
        content: `La Zakat est le troisième pilier de l'Islam. C'est une contribution financière obligatoire que chaque musulman disposant d'un certain niveau de richesse verse une fois par an pour aider ceux qui en ont besoin.

Concrètement, comment ça fonctionne ? Si un musulman possède une épargne supérieure à un seuil minimum appelé "nissab" (l'équivalent d'environ 85 grammes d'or) depuis une année complète, il doit en donner 2,5 % aux personnes dans le besoin.

Les bénéficiaires sont clairement définis par le Coran (sourate 9, verset 60) : les pauvres, les nécessiteux, les personnes endettées, les voyageurs en difficulté, et d'autres catégories précises.

La Zakat n'est pas un simple impôt. Pour le croyant, c'est un acte d'adoration qui purifie l'âme et les biens. Elle rappelle que la richesse est un bienfait confié par Dieu, et qu'il est du devoir de chacun de partager avec les plus vulnérables. C'est l'un des fondements de la solidarité en Islam.`,
      },
      {
        id: '1-4',
        title: 'Le Siyam - Le jeûne du Ramadan',
        content: `Le Siyam est le quatrième pilier de l'Islam. Chaque année, durant le mois de Ramadan, les musulmans du monde entier jeûnent du lever au coucher du soleil. C'est l'un des moments les plus forts de la vie spirituelle musulmane.

En pratique, le jeûneur s'abstient de manger, de boire et d'avoir des relations intimes depuis l'apparition de l'aube (Fajr) jusqu'au coucher du soleil (Maghrib). Le jeûne concerne tout musulman adulte et en bonne santé. Les personnes malades, les femmes enceintes, les voyageurs ou les personnes âgées fragiles en sont dispensés.

Le mois de Ramadan occupe une place particulière car c'est durant ce mois que le Coran a commencé à être révélé au Prophète Muhammad ﷺ. Le Prophète a dit : « Quand Ramadan arrive, les portes du paradis sont ouvertes, les portes de l'enfer sont fermées, et les démons sont enchaînés. »

Mais le Ramadan ne se résume pas à la privation de nourriture. C'est avant tout un mois de spiritualité intense, de générosité, de partage et de rapprochement avec Dieu. Les soirées sont marquées par la rupture du jeûne (iftar), souvent partagée en famille ou en communauté, et par des prières nocturnes spéciales appelées Tarawih.`,
      },
      {
        id: '1-5',
        title: 'Le Hajj - Le pèlerinage à La Mecque',
        content: `Le Hajj est le cinquième et dernier pilier de l'Islam. C'est un voyage spirituel unique que tout musulman adulte doit accomplir au moins une fois dans sa vie, à condition d'en avoir les moyens physiques et financiers.

Chaque année, des millions de musulmans venus du monde entier convergent vers La Mecque, en Arabie Saoudite, durant le mois de Dhu al-Hijja (le dernier mois du calendrier islamique). Pendant quelques jours, riches et pauvres, hommes et femmes, se retrouvent côte à côte, vêtus simplement, unis dans la même dévotion. C'est l'un des plus grands rassemblements humains au monde.

Les rites principaux du Hajj comprennent :
- Le Tawaf - tourner sept fois autour de la Kaaba, le sanctuaire sacré reconstruit par le prophète Ibrahim et son fils Ismaïl
- Le Sa'i - parcourir sept fois la distance entre les monts Safa et Marwa, en souvenir de Hajar cherchant de l'eau pour son fils Ismaïl
- La station à Arafat - un moment de recueillement intense où les pèlerins invoquent Dieu

Le Hajj symbolise l'égalité de tous les êtres humains devant Dieu. Il efface les distinctions sociales et rappelle que chacun retournera à son Créateur. Pour beaucoup de musulmans, c'est l'expérience spirituelle la plus marquante de leur vie.`,
      },
      {
        id: '1-6',
        title: 'Les 6 piliers de la foi (Arkan al-Iman)',
        content: `En plus des cinq piliers pratiques de l'Islam, la foi musulmane repose sur six croyances fondamentales. Elles constituent ce que l'on appelle les "piliers de la foi" et représentent ce que tout musulman croit au plus profond de son coeur.

**1. La foi en Dieu (Allah)**
Croire qu'il n'existe qu'un seul Dieu, Créateur de toute chose, sans associé ni semblable. C'est le fondement même de l'Islam.

**2. La foi en Ses anges**
Les anges sont des créatures de lumière créées par Dieu. Ils accomplissent des missions précises : l'ange Gabriel (Djibril) a transmis la révélation aux prophètes, l'ange Mikail est chargé de la subsistance, et d'autres veillent sur chaque être humain.

**3. La foi en Ses livres révélés**
Dieu a envoyé des livres pour guider l'humanité. Les musulmans croient aux Feuillets d'Ibrahim (Abraham), à la Torah révélée à Moussa (Moïse), aux Psaumes (Zabour) révélés à Dawud (David), à l'Évangile (Injil) révélé à 'Issa (Jésus), et au Coran révélé à Muhammad ﷺ, considéré comme le dernier message divin.

**4. La foi en Ses prophètes**
Dieu a envoyé des prophètes à chaque peuple pour les guider. Du premier, Adam, au dernier, Muhammad ﷺ, tous portaient le même message essentiel : adorer Dieu seul. Les musulmans les respectent et les honorent tous sans distinction.

**5. La foi au Jour dernier**
Chaque être humain sera ressuscité après la mort pour rendre compte de ses actes devant Dieu. Ce jour de jugement mène soit au Paradis, soit à l'Enfer. Cette croyance donne un sens profond à la vie terrestre et encourage le croyant à faire le bien.

**6. La foi au destin (Al-Qadr)**
Tout ce qui se produit dans l'univers se fait selon la science et la volonté de Dieu. Cela ne supprime pas le libre arbitre de l'homme, mais rappelle que Dieu connaît toute chose et que rien n'échappe à Sa sagesse. Le croyant est invité à faire de son mieux tout en acceptant avec sérénité ce qui lui arrive.`,
      },
    ],
  },
  {
    id: 2,
    title: 'Le Coran',
    subtitle: 'Révélation, récitation et compréhension',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '2-1',
        title: 'Introduction au Coran',
        content: `Le Coran est le livre sacré de l'Islam. Pour les musulmans, il s'agit de la parole de Dieu, révélée au Prophète Muhammad ﷺ par l'intermédiaire de l'ange Gabriel (Djibril) sur une période d'environ 23 ans, entre l'an 610 et l'an 632 de notre ère.

Le Coran se compose de 114 sourates (chapitres), elles-mêmes divisées en versets appelés "ayat". Certaines sourates sont très courtes, comme Al-Kawthar qui ne compte que 3 versets, tandis que d'autres sont beaucoup plus longues, comme Al-Baqara qui en contient 286.

La toute première révélation a eu lieu dans la grotte de Hira, près de La Mecque, lorsque l'ange Gabriel est apparu au Prophète Muhammad ﷺ et lui a dit : « Lis, au nom de ton Seigneur qui a créé... » (sourate Al-Alaq). Ce moment marque le début de la mission prophétique.

Le Coran a été révélé en langue arabe. Il est récité dans sa langue originale lors des prières, mais il existe de nombreuses traductions dans toutes les langues du monde pour permettre à chacun d'en comprendre le sens. Une particularité remarquable du Coran est qu'il a été préservé intact depuis sa révélation, à la fois par écrit et par la mémorisation orale. Aujourd'hui encore, des millions de musulmans à travers le monde le connaissent par coeur.`,
      },
      {
        id: '2-2',
        title: 'La révélation et la compilation',
        content: `Le Coran n'a pas été révélé en une seule fois. Sa révélation s'est étalée sur environ 23 ans, au fil des événements vécus par le Prophète Muhammad ﷺ et la communauté musulmane. Chaque passage venait apporter une réponse, un enseignement ou un réconfort en lien avec les circonstances du moment.

On distingue deux grandes périodes de révélation. Les sourates révélées à La Mecque abordent principalement la foi en un Dieu unique, la morale, les récits des prophètes et la vie après la mort. Les sourates révélées à Médine traitent davantage de la vie en société, des lois et de l'organisation de la communauté.

Du vivant du Prophète Muhammad ﷺ, le Coran était mémorisé par de nombreux compagnons et écrit sur divers supports (parchemins, os plats, feuilles de palmier). Après la mort du Prophète Muhammad ﷺ, le premier calife Abu Bakr a confié à Zayd ibn Thabit la mission de rassembler l'ensemble du Coran en un seul volume, appelé "mushaf".

Quelques années plus tard, le troisième calife Uthman a fait reproduire ce volume en plusieurs exemplaires officiels, distribués dans les différentes provinces du monde musulman. C'est ainsi que le texte coranique a été préservé de manière uniforme jusqu'à nos jours.`,
      },
      {
        id: '2-3',
        title: 'Le Tajwid - Les règles de récitation',
        content: `Le Tajwid est l'art de réciter le Coran de manière correcte et harmonieuse. Ce mot signifie "embellissement" en arabe. Il s'agit d'un ensemble de règles qui permettent de prononcer chaque lettre du Coran avec précision, en respectant les sons, les pauses et les rythmes voulus.

Pourquoi est-ce si important ? Parce que le Coran a été révélé en arabe et que chaque lettre compte. Une mauvaise prononciation peut parfois changer le sens d'un mot. Le Tajwid garantit que le texte est récité tel qu'il a été transmis par le Prophète Muhammad ﷺ.

Parmi les règles principales, on trouve :
- La Madd (prolongation) - certaines voyelles sont allongées de 2, 4 ou 6 temps selon le contexte
- Le Ghunna (nasalisation) - un son nasal produit lors de la prononciation de certaines lettres
- L'Idgham (assimilation) - la fusion de certaines lettres avec celles qui les suivent
- L'Ikhfa (dissimulation) - une prononciation atténuée entre deux lettres

Le Tajwid s'apprend idéalement auprès d'un enseignant qualifié, qui corrige la prononciation en temps réel. De nombreuses mosquées, dont la Mosquée Bilal, proposent des cours de Tajwid pour tous les niveaux.`,
      },
      {
        id: '2-4',
        title: 'Le Tafsir - Comprendre le Coran',
        content: `Le Tafsir, c'est l'explication et l'interprétation du Coran. Ce mot arabe signifie "éclaircissement". Cette science permet de comprendre le sens des versets, le contexte dans lequel ils ont été révélés et les enseignements que l'on peut en tirer.

Le Coran a été révélé dans des circonstances précises, et connaître ces circonstances aide à mieux saisir la portée de chaque passage. Par exemple, certains versets répondaient à des questions posées directement au Prophète Muhammad ﷺ par ses compagnons ou par d'autres personnes.

Il existe deux grandes approches du Tafsir. La première, appelée Tafsir bil-Ma'thur, consiste à expliquer le Coran par le Coran lui-même, puis par les paroles du Prophète Muhammad ﷺ, puis par les explications de ses compagnons. C'est la méthode la plus traditionnelle. La seconde, appelée Tafsir bil-Ra'y, fait appel à l'effort intellectuel des savants, tout en restant encadrée par la maîtrise de la langue arabe et des sciences islamiques.

Parmi les grands ouvrages de Tafsir qui font référence, on peut citer celui d'Ibn Kathir, celui d'At-Tabari et celui d'Al-Qurtubi. Ces oeuvres monumentales sont étudiées dans les universités islamiques du monde entier et restent accessibles à toute personne souhaitant approfondir sa compréhension du Coran.`,
      },
      {
        id: '2-5',
        title: 'La mémorisation du Coran (Hifz)',
        content: `La mémorisation du Coran est l'une des traditions les plus anciennes et les plus remarquables de l'Islam. La personne qui mémorise l'intégralité du Coran est appelée "Hafiz" (ou "Hafiza" pour une femme). Il existe aujourd'hui des millions de Hafiz à travers le monde, perpétuant une chaîne de transmission ininterrompue depuis l'époque du Prophète Muhammad ﷺ.

Le Prophète Muhammad ﷺ a dit : « Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. » Cette parole montre à quel point la mémorisation et la transmission du Coran occupent une place centrale dans la vie spirituelle musulmane.

Comment se lancer dans la mémorisation ? Il est recommandé de suivre quelques étapes simples :
- Maîtriser d'abord la lecture en arabe et les bases du Tajwid
- Se faire accompagner par un enseignant qui vérifie et corrige la récitation
- Commencer par les sourates les plus courtes, situées à la fin du Coran (le Juz' Amma)
- Privilégier la régularité plutôt que la quantité : quelques versets chaque jour valent mieux qu'un effort intense mais irrégulier
- Réviser quotidiennement ce qui a déjà été mémorisé, car la révision est la clé de la rétention

La mémorisation du Coran est accessible à tous, quel que soit l'âge. Beaucoup d'enfants commencent dès leur plus jeune âge, mais il n'est jamais trop tard pour s'y mettre. La Mosquée Bilal propose des cours pour enfants et adultes.`,
      },
    ],
  },
  {
    id: 3,
    title: 'La Sira',
    subtitle: 'La vie du Prophète Muhammad ﷺ',
    icon: ScrollText,
    image: 'https://images.unsplash.com/photo-1695875866698-05897b9b21a3?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '3-1',
        title: 'Naissance et jeunesse de Muhammad ﷺ',
        content: `Muhammad ibn Abdallah est né à La Mecque vers l'an 570 de notre ère, une année connue sous le nom de "l'Année de l'Éléphant". Il appartenait au clan des Banu Hashim, l'une des familles les plus respectées de la tribu de Quraysh.

Son enfance fut marquée par la perte précoce de ses parents. Son père Abdallah mourut avant même sa naissance, et sa mère Amina décéda alors qu'il n'avait que six ans. Le jeune Muhammad fut alors recueilli par son grand-père Abdul Muttalib, puis, après la mort de celui-ci, par son oncle Abu Talib, qui l'éleva avec affection et le protégea tout au long de sa vie.

Malgré ces épreuves, Muhammad ﷺ se distingua très tôt par son caractère exemplaire. Dès sa jeunesse, les habitants de La Mecque le surnommèrent "Al-Amin", ce qui signifie "le digne de confiance". On lui confiait des biens en dépôt et on faisait appel à lui pour arbitrer les différends, tant sa droiture était reconnue de tous.

À l'âge de 25 ans, il épousa Khadija bint Khuwaylid, une veuve et commerçante respectée de La Mecque. Leur union fut fondée sur l'amour et un profond respect mutuel. Elle occupe une place toute particulière dans l'histoire de l'Islam car elle fut la toute première personne à croire en la mission prophétique de Muhammad ﷺ.`,
      },
      {
        id: '3-2',
        title: 'La première révélation et la mission',
        content: `Avant de recevoir la révélation, Muhammad ﷺ avait l'habitude de se retirer dans la grotte de Hira, située sur le mont Nur, près de La Mecque, pour méditer et réfléchir loin de l'agitation de la ville.

C'est là, en l'an 610, alors qu'il avait quarante ans, que l'ange Gabriel (Djibril) lui apparut pour la première fois. L'ange lui dit : « Lis ! » (Iqra). Muhammad ﷺ, qui ne savait ni lire ni écrire, répondit qu'il ne pouvait pas. Après l'avoir étreint trois fois, l'ange lui récita les premiers versets de la sourate Al-Alaq : « Lis, au nom de ton Seigneur qui a créé... » Ce fut le début de la révélation du Coran.

Bouleversé par cette expérience, Muhammad ﷺ rentra chez lui en tremblant. Son épouse Khadija le réconforta avec douceur et l'emmena chez son cousin Waraqa ibn Nawfal, un homme lettré et connaisseur des écritures anciennes, qui reconnut les signes d'une mission prophétique.

Les premières personnes à croire en son message furent Khadija, son jeune cousin Ali ibn Abi Talib, son ami proche Abu Bakr et Zayd ibn Haritha. Pendant les trois premières années, la prédication resta discrète, dans un cercle restreint de proches. Puis, à partir de la quatrième année, Muhammad ﷺ commença à prêcher publiquement l'unicité de Dieu, ce qui provoqua une forte opposition de la part des notables de La Mecque, attachés à leurs idoles et à leurs intérêts.`,
      },
      {
        id: '3-3',
        title: 'L\'Hégire - De La Mecque à Médine',
        content: `L'année 619 est connue dans l'histoire de l'Islam comme "l'Année de la tristesse". Le Prophète Muhammad ﷺ perdit deux êtres qui lui étaient très chers : son épouse Khadija, son premier soutien et sa confidente, et son oncle Abu Talib, qui l'avait protégé face aux persécutions des Mecquois. Ces deux pertes furent un moment d'épreuve intense.

C'est dans ce contexte difficile qu'eut lieu un événement miraculeux : le Voyage nocturne (Isra' et Mi'raj). En une seule nuit, Dieu fit voyager Son Prophète de La Mecque à Jérusalem, puis l'éleva à travers les cieux. C'est au cours de cette ascension que les cinq prières quotidiennes furent prescrites aux musulmans.

Malgré cela, la situation à La Mecque devenait de plus en plus dangereuse pour les musulmans. Les persécutions s'intensifiaient et la vie du Prophète Muhammad ﷺ était directement menacée. En l'an 622, il prit la décision d'émigrer vers la ville de Médine (alors appelée Yathrib), accompagné de son fidèle compagnon Abu Bakr. Ils se cachèrent trois jours dans la grotte de Thawr pour échapper à leurs poursuivants, avant d'atteindre Médine, où ils furent accueillis avec une immense joie par les habitants.

Cet événement, appelé l'Hégire (l'émigration), est si important qu'il marque le début du calendrier islamique. L'an 1 de l'Hégire correspond à cette année 622 de notre ère. À Médine, le Prophète Muhammad ﷺ put enfin établir une communauté musulmane organisée, fondée sur la fraternité, la justice et la solidarité.`,
      },
      {
        id: '3-4',
        title: 'Le caractère du Prophète Muhammad ﷺ',
        content: `Le Coran dit : « Vous avez dans le Messager de Dieu un excellent modèle à suivre. » (Coran 33:21). En effet, au-delà de sa mission prophétique, Muhammad ﷺ était admiré par tous ceux qui le côtoyaient pour ses qualités humaines exceptionnelles.

Sa douceur et sa miséricorde étaient légendaires. Il n'a jamais frappé qui que ce soit, ni une femme, ni un enfant, ni un serviteur. Il disait : « Je n'ai été envoyé que comme miséricorde pour les mondes. » Même envers ceux qui lui faisaient du tort, il répondait par la patience et le pardon, priant pour que Dieu les guide.

Son humilité était remarquable. Bien qu'il soit le chef de la communauté, il vivait simplement. Il réparait lui-même ses sandales, recousait ses vêtements et participait aux tâches ménagères. Il n'aimait pas que les gens se lèvent à son arrivée et s'asseyait là où il trouvait de la place, sans chercher une position d'honneur.

Sa générosité était sans limite. Son compagnon Jabir ibn Abdallah rapporte : « Le Prophète ﷺ n'a jamais refusé quoi que ce soit à quelqu'un qui lui demandait. » Il donnait tout ce qu'il possédait, au point de dormir parfois le ventre vide.

Son sourire aussi le caractérisait. Abdullah ibn al-Harith raconte : « Je n'ai jamais vu quelqu'un sourire plus que le Prophète ﷺ. » Il accueillait chaque personne avec bienveillance, se tournant entièrement vers son interlocuteur.

Lorsqu'on demanda un jour à son épouse Aïcha de décrire son caractère, elle répondit simplement : « Son caractère, c'était le Coran. »`,
      },
      {
        id: '3-5',
        title: 'L\'adieu du Prophète Muhammad ﷺ',
        content: `En l'an 10 de l'Hégire (632 de notre ère), le Prophète Muhammad ﷺ accomplit son unique pèlerinage à La Mecque. Plus de cent mille compagnons l'accompagnèrent dans ce voyage historique, pressentant qu'il s'agissait d'un moment unique.

C'est lors de ce pèlerinage qu'il prononça le célèbre "Discours de l'Adieu", considéré comme l'un des plus grands discours de l'histoire. Il y rappela les principes fondamentaux de l'Islam : « Vos vies, vos biens et votre honneur sont sacrés et inviolables. Traitez vos femmes avec bonté. J'ai laissé parmi vous deux choses : si vous vous y tenez, vous ne vous égarerez jamais - la Parole de Dieu et la tradition de Son Prophète. »

À la fin de ce pèlerinage, un verset du Coran fut révélé : « Aujourd'hui, J'ai parachevé pour vous votre religion, J'ai accompli Mon bienfait sur vous, et J'ai agréé l'Islam comme religion pour vous. » (Coran 5:3). Ce verset marquait l'accomplissement du message divin.

Quelques mois plus tard, de retour à Médine, le Prophète Muhammad ﷺ tomba gravement malade. Il mourut le 12 Rabi' al-Awwal de l'an 11 de l'Hégire, dans les bras de son épouse Aïcha. La communauté fut plongée dans une immense tristesse.

C'est alors que son compagnon Abu Bakr prononça ces paroles restées célèbres : « Quiconque adorait Muhammad, qu'il sache que Muhammad est mort. Quiconque adore Dieu, qu'il sache que Dieu est vivant et ne mourra jamais. »`,
      },
    ],
  },
  {
    id: 4,
    title: 'Les Hadiths',
    subtitle: 'Paroles, actes et approbations du Prophète ﷺ',
    icon: BookMarked,
    image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '4-1',
        title: 'Qu\'est-ce qu\'un hadith ?',
        content: `Dans l'Islam, un hadith est un récit qui rapporte ce que le Prophète Muhammad ﷺ a dit, fait ou approuvé. L'ensemble de ces récits forme ce que l'on appelle la Sunna, qui est la deuxième source de guidance pour les musulmans après le Coran.

Pour bien comprendre, prenons un exemple concret. Le Prophète Muhammad ﷺ a dit : « Les actes ne valent que par les intentions, et chaque personne n'obtiendra que ce qu'elle a eu l'intention de faire. » Ce hadith, rapporté par le compagnon Umar ibn al-Khattab, est l'un des plus célèbres de l'Islam.

Chaque hadith se compose de deux parties. La première est la chaîne de transmission (isnad) : c'est la liste des personnes qui se sont transmis ce récit de génération en génération, en remontant jusqu'au Prophète Muhammad ﷺ. La seconde est le texte lui-même (matn), c'est-à-dire le contenu de la parole ou la description de l'acte.

Tous les hadiths ne se valent pas. Les savants musulmans ont développé une science très rigoureuse pour vérifier l'authenticité de chaque récit. Ils classent les hadiths en plusieurs catégories :
- Sahih (authentique) - la chaîne de transmission est continue et tous les transmetteurs sont fiables
- Hasan (bon) - légèrement inférieur en qualité mais considéré comme acceptable
- Da'if (faible) - il y a une défaillance dans la chaîne de transmission
- Mawdu' (forgé) - le hadith a été inventé et il est catégoriquement rejeté

Cette science du hadith témoigne du soin immense que les savants musulmans ont apporté à la préservation fidèle des enseignements du Prophète Muhammad ﷺ.`,
      },
      {
        id: '4-2',
        title: 'Les grands recueils de hadiths',
        content: `Après la mort du Prophète Muhammad ﷺ, ses paroles et ses actes ont été transmis oralement de génération en génération. Mais très vite, les savants musulmans ont ressenti le besoin de les mettre par écrit pour les préserver fidèlement.

Aux 2ème et 3ème siècles de l'Hégire (soit environ 200 à 300 ans après la mort du Prophète ﷺ), de grands savants ont consacré leur vie entière à collecter, vérifier et classer les hadiths. Leur travail était extrêmement rigoureux : pour chaque hadith, ils vérifiaient toute la chaîne de transmission (appelée "isnad"), c'est-à-dire la liste des personnes qui se sont transmis le hadith les unes aux autres, depuis le Prophète ﷺ jusqu'à eux.

Ce travail colossal a donné naissance à six grands recueils, appelés "Al-Kutub al-Sitta" (les Six Livres). Ce sont les recueils les plus fiables et les plus respectés dans le monde musulman :

- Sahih al-Bukhari, compilé par l'Imam al-Bukhari (mort en 870). C'est le recueil le plus célèbre, considéré comme le livre le plus authentique après le Coran.
- Sahih Muslim, compilé par l'Imam Muslim (mort en 875). Il est le deuxième recueil en termes de fiabilité.
- Sunan Abi Dawud, compilé par l'Imam Abu Dawud (mort en 889).
- Sunan al-Tirmidhi, compilé par l'Imam al-Tirmidhi (mort en 892).
- Sunan al-Nasa'i, compilé par l'Imam al-Nasa'i (mort en 915).
- Sunan Ibn Majah, compilé par l'Imam Ibn Majah (mort en 887).

Aujourd'hui, les deux premiers recueils sont les plus étudiés dans les écoles islamiques du monde entier et constituent, avec le Coran, la base de la compréhension de l'Islam.

Il existe également un petit recueil très célèbre : les 40 hadiths de l'Imam Nawawi (13ème siècle). Ce livre rassemble les hadiths les plus importants, ceux qui résument les grands principes de l'Islam. C'est souvent le premier livre de hadiths que l'on étudie quand on commence à apprendre, et il est disponible en librairie islamique et en ligne dans de nombreuses traductions commentées.`,
      },
      {
        id: '4-3',
        title: 'Les 40 hadiths de l\'Imam Nawawi',
        content: `Les 40 hadiths de l'Imam Nawawi est un petit recueil compilé par l'Imam al-Nawawi, un grand savant du 13ème siècle. L'idée de ce recueil est simple et belle : rassembler en un seul livre les hadiths les plus importants, ceux qui résument les grands principes de l'Islam.

C'est pour cette raison qu'il est souvent le premier livre de hadiths que l'on étudie quand on commence à apprendre. Voici quelques-uns de ces hadiths célèbres :

- **Hadith 1 - L'intention :** « Les actes ne valent que par les intentions, et chaque personne n'obtiendra que ce qu'elle a eu l'intention de faire. » Ce hadith enseigne que ce qui compte, ce n'est pas seulement ce que l'on fait, mais pourquoi on le fait.

- **Hadith 2 - Les fondements :** « L'Islam est fondé sur cinq choses : témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est Son messager, accomplir la prière, acquitter la Zakat, accomplir le pèlerinage et jeûner le Ramadan. » Ce hadith résume les cinq piliers de l'Islam.

- **Hadith 6 - Le licite et l'illicite :** « Le licite est évident et l'illicite est évident, et entre les deux il y a des choses douteuses. » Ce hadith encourage le croyant à rester prudent face aux situations ambiguës.

- **Hadith 9 - La facilité :** « Ce dont je vous ai interdit, abstenez-vous-en ; ce que je vous ai ordonné, accomplissez-en ce que vous pouvez. » Ce hadith montre que l'Islam est une religion de facilité et de mesure.

Ces 40 hadiths sont disponibles en librairie islamique et en ligne dans de nombreuses traductions commentées. C'est une excellente lecture pour quiconque souhaite découvrir les enseignements du Prophète Muhammad ﷺ.`,
      },
      {
        id: '4-4',
        title: 'Le hadith de Djibril (Gabriel)',
        content: `Le hadith de Djibril (Gabriel) est l'un des hadiths les plus importants de l'Islam. Il est souvent surnommé "la mère de la Sunna" car, à lui seul, il résume les fondements de toute la religion.

Ce hadith raconte une scène extraordinaire. Un jour, alors que le Prophète Muhammad ﷺ était assis avec ses compagnons, un homme aux vêtements d'une blancheur éclatante apparut. Personne ne le connaissait, et il ne portait aucune trace de voyage. Il s'assit en face du Prophète Muhammad ﷺ et lui posa trois grandes questions :

**« Informe-moi de l'Islam. »**
Le Prophète Muhammad ﷺ répondit : « L'Islam, c'est de témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est Son messager, d'accomplir la prière, d'acquitter la Zakat, de jeûner le Ramadan et d'accomplir le pèlerinage si tu en as les moyens. »

**« Informe-moi de l'Iman (la foi). »**
Le Prophète Muhammad ﷺ répondit : « C'est de croire en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour Dernier, et de croire au destin, qu'il soit bon ou mauvais. »

**« Informe-moi de l'Ihsan (l'excellence). »**
Le Prophète Muhammad ﷺ répondit : « C'est d'adorer Allah comme si tu Le voyais, car si tu ne Le vois pas, Lui te voit. »

Après le départ de cet homme mystérieux, le Prophète Muhammad ﷺ révéla à ses compagnons que c'était l'ange Djibril (Gabriel), venu leur enseigner leur religion.

Ce hadith est remarquable car il définit les trois niveaux de la vie spirituelle en Islam : l'Islam (les actes), l'Iman (la foi intérieure) et l'Ihsan (l'excellence dans l'adoration). Il est rapporté par le compagnon Umar ibn al-Khattab et se trouve dans le Sahih Muslim.`,
      },
    ],
  },
  {
    id: 5,
    title: 'La Prière',
    subtitle: 'Guide complet de la Salat',
    icon: BookOpenCheck,
    image: 'https://images.unsplash.com/photo-1761939998934-f416e51f2686?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '5-1',
        title: 'Les conditions de validité de la prière',
        content: `La prière (Salat) est le deuxième pilier de l'Islam et le lien direct entre le croyant et Dieu. Pour qu'elle soit valide, certaines conditions doivent être réunies avant de commencer. Voici les principales :

**1. Être musulman**
La prière est un acte d'adoration propre aux musulmans. C'est la base de toute pratique spirituelle en Islam.

**2. Avoir l'âge et la raison**
La prière est obligatoire pour tout musulman adulte et sain d'esprit. Le Prophète Muhammad ﷺ a encouragé les parents à apprendre la prière à leurs enfants dès l'âge de 7 ans, afin qu'ils s'y habituent progressivement.

**3. La pureté rituelle (Tahara)**
Avant chaque prière, le croyant doit être en état de pureté. Cela se fait par les ablutions (Wudu), un rituel de purification avec de l'eau. En cas d'absence d'eau, une purification symbolique avec de la terre propre (Tayammum) est autorisée.

**4. La propreté du corps, des vêtements et du lieu**
Le corps, les vêtements portés et l'endroit où l'on prie doivent être propres et exempts de toute impureté.

**5. La couverture du corps**
Pour l'homme, le corps doit être couvert du nombril jusqu'aux genoux inclus. Pour la femme, tout le corps doit être couvert sauf le visage et les mains.

**6. Se tourner vers la Qibla**
Le croyant doit faire face à la direction de la Kaaba, à La Mecque. En France, cette direction est approximativement vers le sud-est.

**7. Respecter le temps de la prière**
Chaque prière a un horaire précis, lié à la position du soleil. Il est important de prier dans le temps imparti pour chaque prière.

**8. L'intention (Niyya)**
Avant de commencer, le croyant formule l'intention dans son cœur de prier pour Dieu. Il n'est pas nécessaire de la prononcer à voix haute, l'essentiel est la sincérité du cœur.`,
      },
      {
        id: '5-2',
        title: 'Les ablutions (Wudu) - étape par étape',
        content: `Les ablutions (Wudu) sont un rituel de purification avec de l'eau que le musulman accomplit avant chaque prière et avant la lecture du Coran. C'est un moment de préparation spirituelle, où le croyant se purifie le corps et l'esprit avant de se présenter devant Dieu.

Voici les étapes à suivre :

1. Prononcer **Bismillah** (Au nom de Dieu) pour commencer.

2. **Laver les mains** 3 fois.

3. **Se rincer la bouche** 3 fois.

4. **Se rincer les narines** 3 fois.

5. **Laver le visage** 3 fois, d'une oreille à l'autre et du front au menton.

6. **Laver le bras droit** jusqu'au coude 3 fois, puis le bras gauche de la même manière.

7. **Essuyer la tête** avec les mains mouillées, de l'avant vers l'arrière puis retour, une seule fois.

8. **Essuyer les oreilles** (intérieur et extérieur) une seule fois.

9. **Laver le pied droit** jusqu'à la cheville 3 fois, puis le pied gauche de la même manière.

10. **Terminer par une invocation** : « Ach-hadou an lâ ilâha illallâh, wa ach-hadou anna Muhammadan 'abdouhou wa Rasûlouhou » (Je témoigne qu'il n'y a de divinité qu'Allah et que Muhammad est Son serviteur et messager).

**Ce qui annule les ablutions :**
- Les besoins naturels (urines, selles, gaz)
- Le sommeil profond
- La perte de conscience
- Les relations intimes

Lorsque les ablutions sont annulées, il suffit de les refaire avant la prochaine prière.`,
      },
      {
        id: '5-3',
        title: 'Les étapes de la prière',
        content: `La prière en Islam suit un enchaînement précis de gestes et de paroles. Chaque mouvement a une signification spirituelle et exprime l'humilité du croyant devant son Créateur.

Une unité de prière s'appelle une "rak'a". Elle se compose d'une station debout (avec récitation du Coran), d'une inclinaison, puis de deux prosternations avec une position assise entre les deux. Le Tashahhud (attestation de foi) se récite en position assise à la fin de la 2ème rak'a et systématiquement à la dernière rak'a de chaque prière.

**Nombre de rak'at (unités) par prière :**

- **Fajr** (aube) - 2 rak'at
- **Dhuhr** (mi-journée) - 4 rak'at
- **Asr** (après-midi) - 4 rak'at
- **Maghrib** (coucher du soleil) - 3 rak'at
- **Isha** (nuit) - 4 rak'at + 2 rak'at (Chaf') + 1 rak'a (Witr). Le Chaf' & Witr (combinaison de deux prières surérogatoires) se prie après la prière obligatoire de l'Isha.

La prière se termine par le Taslim : tourner la tête à droite puis à gauche en disant « As-salamu alaykum wa rahmatullah » (Que la paix et la miséricorde de Dieu soient sur vous).

Pour apprendre les positions et les gestes en détail, nous vous recommandons de consulter une illustration des positions de prière ou de demander à un membre de la mosquée de vous accompagner.`,
      },
      {
        id: '5-4',
        title: 'La prière du vendredi (Joumou\'a)',
        content: `Le vendredi est un jour très important en Islam. C'est le jour où les musulmans se rassemblent à la mosquée pour accomplir ensemble la prière de Joumou'a (le vendredi). Cette prière remplace la prière du Dhuhr (mi-journée) et elle est obligatoire pour tout homme musulman adulte en bonne santé.

Allah dit dans le Coran : « Ô les croyants ! Quand on appelle à la prière du vendredi, accourez à l'invocation d'Allah et laissez tout négoce. » (Sourate 62, verset 9)

La prière du vendredi se distingue par deux sermons (khutba) prononcés par l'imam avant la prière. Ces sermons sont un moment d'enseignement, de rappel et de conseil pour la communauté.

**Ce qui est recommandé le vendredi :**
- Se laver (le ghusl du vendredi)
- Porter de beaux vêtements
- Lire la sourate Al-Kahf
- Envoyer beaucoup de salutations sur le Prophète Muhammad ﷺ
- Faire beaucoup d'invocations (dua), car le vendredi comporte une heure bénie où les prières sont exaucées

**À la Mosquée Bilal :**
Veuillez vous reporter aux horaires sur la page d'accueil afin de connaître l'heure exacte du premier sermon. Il est recommandé d'arriver tôt pour profiter pleinement de ce moment de recueillement.`,
      },
    ],
  },
  {
    id: 6,
    title: 'Le Jeûne',
    subtitle: 'Ramadan et jours de jeûne recommandés',
    icon: Moon,
    image: 'https://images.unsplash.com/photo-1590250998460-ebbc33182ce7?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '6-1',
        title: 'Les piliers et conditions du jeûne',
        content: `Le jeûne est le quatrième pilier de l'Islam. Allah dit dans le Coran : « Ô les croyants ! On vous a prescrit le jeûne comme on l'a prescrit à ceux d'avant vous, ainsi atteindrez-vous la piété. » (Sourate 2, verset 183)

Le jeûne consiste à s'abstenir de manger, de boire et d'avoir des relations intimes, du lever du soleil (Fajr) jusqu'au coucher du soleil (Maghrib). Mais au-delà de l'aspect physique, le jeûne est avant tout un exercice spirituel : il apprend la patience, la maîtrise de soi et la gratitude envers Dieu.

**Les deux piliers du jeûne :**
1. **L'intention (Niyya)** - elle doit être formulée dans le cœur chaque nuit avant l'aube.
2. **L'abstinence** - de tout ce qui rompt le jeûne, du Fajr au Maghrib.

**Qui doit jeûner ?**
Le jeûne est obligatoire pour tout musulman adulte, sain d'esprit et en bonne santé. Sont exemptés : les malades, les voyageurs, les femmes enceintes ou allaitantes, et les personnes âgées qui ne peuvent pas supporter le jeûne. Ceux qui sont temporairement exemptés doivent rattraper les jours manqués plus tard.

**Le jeûne, bien plus qu'une privation**
Le jeûne ne se limite pas à ne pas manger ni boire. C'est aussi un moment pour se rapprocher de Dieu, multiplier les bonnes actions, être généreux avec les autres et prendre conscience de la situation de ceux qui ont faim au quotidien. Le Prophète Muhammad ﷺ a dit : « Celui qui ne délaisse pas le mensonge et la mauvaise conduite, Allah n'a nul besoin qu'il délaisse sa nourriture et sa boisson. » (Bukhari)

Le jeûne est donc une école de discipline intérieure, qui forme le croyant à la maîtrise de soi et à la bienveillance envers les autres.`,
      },
      {
        id: '6-2',
        title: 'Le Ramadan - Le mois béni',
        content: `Le Ramadan est le neuvième mois du calendrier islamique (calendrier lunaire). C'est durant ce mois que le Coran a été révélé pour la première fois au Prophète Muhammad ﷺ. C'est pour cette raison que ce mois est si spécial pour les musulmans du monde entier.

Le Prophète Muhammad ﷺ a dit : « Quand Ramadan arrive, les portes du Paradis sont ouvertes, les portes de l'Enfer sont fermées et les démons sont enchaînés. » (Bukhari, Muslim)

**Le programme spirituel du Ramadan :**

Le mois de Ramadan se divise en trois périodes de dix jours, chacune avec une dimension spirituelle particulière :

- **Les 10 premiers jours** - La miséricorde (Rahma). C'est le moment d'intensifier la prière, la récitation du Coran et les actes de charité.

- **Les 10 jours du milieu** - Le pardon (Maghfira). Le croyant multiplie les actes d'adoration et demande le pardon à Dieu.

- **Les 10 derniers jours** - L'affranchissement du Feu. C'est la période la plus intense. Le Prophète Muhammad ﷺ se retirait en I'tikaf (retraite spirituelle à la mosquée) et redoublait d'efforts dans l'adoration.

**Les pratiques recommandées durant le Ramadan :**
- Le Suhur - le repas pris avant l'aube, fortement recommandé par le Prophète Muhammad ﷺ
- L'Iftar - la rupture du jeûne au coucher du soleil, traditionnellement avec des dattes et de l'eau
- Les Tarawih - prières nocturnes accomplies en groupe à la mosquée après la prière de l'Isha
- La lecture du Coran - il est de tradition de lire le Coran en entier durant ce mois
- La Sadaqa - les aumônes et les bonnes œuvres sont particulièrement encouragées

**La Zakat al-Fitr**
À la fin du mois de Ramadan, chaque musulman doit s'acquitter de la Zakat al-Fitr, une aumône obligatoire versée avant la prière de l'Aïd al-Fitr. Elle a pour but de purifier le jeûne et de permettre aux plus démunis de célébrer la fête de l'Aïd.`,
      },
      {
        id: '6-3',
        title: 'Laylat al-Qadr - La nuit du destin',
        content: `Laylat al-Qadr (la Nuit du Destin) est la nuit la plus importante de toute l'année pour les musulmans. C'est durant cette nuit que le Coran a été révélé pour la première fois au Prophète Muhammad ﷺ.

Allah dit dans le Coran : « Nous l'avons certes révélé pendant la Nuit du Destin. Et qui te dira ce qu'est la Nuit du Destin ? La Nuit du Destin est meilleure que mille mois. » (Sourate 97, versets 1-3)

Autrement dit, les actes d'adoration accomplis durant cette seule nuit valent plus que ceux de mille mois (soit plus de 83 ans). C'est un cadeau immense que Dieu offre à ceux qui la recherchent avec sincérité.

**Quand est-elle ?**
Le Prophète Muhammad ﷺ a dit : « Cherchez Laylat al-Qadr dans les nuits impaires des dix dernières nuits de Ramadan. » Il s'agit donc des nuits du 21, 23, 25, 27 et 29 du mois de Ramadan. La majorité des savants estiment qu'elle se situe probablement la nuit du 27.

**Comment passer cette nuit ?**
Le Prophète Muhammad ﷺ redoublait d'efforts durant les dix dernières nuits de Ramadan. Il demeurait éveillé toute la nuit en prière, en récitation du Coran et en invocations. Il est recommandé de :
- Prier le Qiyam al-Layl (prière de nuit)
- Réciter le Coran
- Faire beaucoup d'invocations (dua)
- Demander le pardon à Dieu (Istighfar)

**L'invocation recommandée :**
Aïcha, l'épouse du Prophète Muhammad ﷺ, lui demanda quelle invocation faire durant cette nuit. Il répondit : « Dis : Allahumma innaka 'Afuwwun Karimun tuhibbul-'afwa fa'fu 'anni » - « Ô Allah, Tu aimes effacer les péchés, efface donc les miens. »`,
      },
      {
        id: '6-4',
        title: 'Les jeûnes recommandés hors Ramadan',
        content: `En dehors du mois de Ramadan, l'Islam encourage le croyant à jeûner certains jours de l'année. Ces jeûnes sont volontaires (surérogatoires) et constituent un moyen supplémentaire de se rapprocher de Dieu et d'obtenir des récompenses.

**1. Les six jours de Shawwal**
Shawwal est le mois qui suit directement le Ramadan. Le Prophète Muhammad ﷺ a dit : « Quiconque jeûne Ramadan, puis fait suivre de six jours de Shawwal, c'est comme s'il avait jeûné toute l'année. » (Muslim)

**2. Le jeûne de 'Ashura (10 Muharram)**
Ce jeûne correspond au jour où Allah a sauvé Moussa (Moïse) et son peuple de Pharaon. Il permet d'expier les péchés de l'année précédente. Il est recommandé de jeûner aussi le 9 Muharram.

**3. Le jeûne du jour de 'Arafa (9 Dhu al-Hijja)**
Le jour de 'Arafa est le jour le plus important du pèlerinage (Hajj). Pour ceux qui ne font pas le pèlerinage, jeûner ce jour permet d'expier les péchés de l'année passée et de l'année à venir. (Muslim)

**4. Les trois jours blancs (Ayyam al-Bid)**
Ce sont les 13, 14 et 15 de chaque mois du calendrier lunaire. Le Prophète Muhammad ﷺ recommandait de les jeûner régulièrement.

**5. Le lundi et le jeudi**
Le Prophète Muhammad ﷺ jeûnait ces deux jours car ce sont les jours où les œuvres des croyants sont présentées à Dieu.

**6. Le jeûne de Dawud**
Jeûner un jour sur deux. C'est le jeûne le plus aimé par Allah, mais aussi le plus exigeant. Il porte le nom du prophète Dawud (David) qui le pratiquait.`,
      },
    ],
  },
  {
    id: 7,
    title: 'Quelques Prophètes',
    subtitle: '12 prophètes parmi les 25 mentionnés dans le Coran',
    icon: UserStar,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '7-1',
        title: 'Adam',
        content: `Adam est le premier homme créé par Allah et le premier prophète de l'Islam. Sa création est un événement majeur raconté dans le Coran. Allah a façonné Adam à partir d'argile, puis lui a insufflé de Son esprit, lui donnant ainsi la vie. Il lui a ensuite enseigné le nom de toutes les choses, un savoir qu'Allah n'avait donné à aucune autre créature, pas même aux anges.

Allah a ensuite ordonné aux anges de se prosterner devant Adam, en signe d'honneur. Tous les anges ont obéi, sauf Iblis (Satan), qui a refusé par orgueil. Il a dit : « Je suis meilleur que lui, Tu m'as créé de feu et Tu l'as créé d'argile. » (Sourate 7, verset 12). C'est à partir de ce moment qu'Iblis est devenu l'ennemi de l'homme, jurant de le détourner du droit chemin jusqu'au Jour du Jugement.

Adam a été placé au Paradis avec son épouse Hawwa (Ève). Allah leur a permis de profiter de tout ce qui s'y trouvait, à une seule condition : ne pas s'approcher d'un arbre en particulier. Mais Iblis les a trompés par de belles paroles, leur faisant croire que cet arbre leur donnerait l'éternité. Adam et Hawwa ont mangé du fruit et ont immédiatement ressenti la honte de leur désobéissance.

Conscients de leur faute, ils ont imploré le pardon de Dieu en disant : « Notre Seigneur, nous nous sommes fait du tort à nous-mêmes. Et si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons certainement parmi les perdants. » (Sourate 7, verset 23). Allah, dans Son infinie miséricorde, a accepté leur repentir.

Adam et Hawwa ont ensuite été envoyés sur terre pour y vivre, y adorer Dieu et y fonder l'humanité. Adam est ainsi le père de tous les êtres humains, quelles que soient leurs origines. Son histoire enseigne des leçons fondamentales : la dignité de l'être humain aux yeux de Dieu, le danger de l'orgueil, l'importance de reconnaître ses erreurs et la grandeur du repentir sincère.`,
      },
      {
        id: '7-2',
        title: 'Nouh (Noé)',
        content: `Nouh (Noé) est l'un des cinq prophètes dotés de la plus grande détermination (Ulul Azm). Il a été envoyé par Allah à un peuple qui avait sombré dans l'idolâtrie, adorant des statues au lieu d'adorer Dieu seul.

Nouh a prêché à son peuple pendant 950 ans, les appelant jour et nuit, en public et en privé, à revenir à l'adoration d'un Dieu unique. Malgré tous ses efforts et sa patience immense, seule une poignée de personnes a cru en son message. Les chefs de son peuple le rejetaient, se moquaient de lui et menaçaient ceux qui le suivaient.

Face à l'obstination de son peuple, Allah a ordonné à Nouh de construire une arche, un immense navire, en pleine terre. Les gens se moquaient encore plus de lui, ne comprenant pas pourquoi il construisait un bateau loin de la mer. Mais Nouh obéissait à Dieu avec une confiance absolue.

Quand l'arche fut terminée, Allah a déclenché le Déluge. Les eaux ont jailli de la terre et le ciel a déversé une pluie torrentielle. Nouh a fait monter à bord les croyants ainsi qu'un couple de chaque espèce animale. Son propre fils a refusé de monter, pensant qu'il pourrait se réfugier sur une montagne. Nouh l'a supplié, mais son fils a refusé et a péri dans les flots.

Cet épisode est l'un des plus émouvants du Coran. Nouh a demandé à Allah pourquoi son fils n'avait pas été sauvé, et Allah lui a répondu : « Il n'est pas de ta famille, car il a commis un acte infâme. » (Sourate 11, verset 46). Cette réponse enseigne que le lien avec Dieu passe par la foi et non par les liens du sang.

L'histoire de Nouh illustre la patience dans l'épreuve, la persévérance dans la prédication et la justice divine. Elle rappelle que la foi sincère est le seul véritable refuge.`,
      },
      {
        id: '7-3',
        title: 'Ibrahim (Abraham)',
        content: `Ibrahim (Abraham) occupe une place exceptionnelle en Islam. Il est surnommé "Khalilullah" (l'ami intime d'Allah) et "le père des prophètes", car de sa descendance sont issus de nombreux prophètes, dont Ismaïl, Ishaq, Yacoub, Moussa, 'Issa et Muhammad ﷺ. Il fait partie des cinq prophètes dotés de la plus grande détermination (Ulul Azm).

Dès son jeune âge, Ibrahim a rejeté l'idolâtrie de son peuple et de son propre père, qui fabriquait des statues. Par la réflexion et l'observation de la nature, il a compris qu'il n'y avait qu'un seul Dieu, Créateur des cieux et de la terre. Un jour, il a brisé toutes les idoles de son peuple sauf la plus grande, pour leur démontrer que ces statues ne pouvaient ni se défendre ni leur être utiles.

Furieux, son peuple l'a jeté dans un immense bûcher. Mais Allah a ordonné au feu : « Ô feu, sois fraîcheur et paix pour Ibrahim. » (Sourate 21, verset 69). Ibrahim est sorti indemne, confirmant la protection divine accordée à ceux qui croient sincèrement.

Ibrahim a été soumis à de nombreuses épreuves tout au long de sa vie, et il les a toutes surmontées avec une foi inébranlable. La plus grande de toutes fut l'ordre d'Allah de sacrifier son fils Ismaïl. Ibrahim et Ismaïl se sont tous deux soumis à la volonté de Dieu avec une confiance totale. Au moment du sacrifice, Allah a remplacé Ismaïl par un bélier. C'est cet événement que les musulmans commémorent chaque année lors de l'Aïd al-Adha (la fête du sacrifice).

Ibrahim a également construit, avec son fils Ismaïl, la Kaaba à La Mecque, le premier lieu de culte dédié à l'adoration d'un Dieu unique, vers lequel les musulmans se tournent pour prier. Il a invoqué Allah pour que cette terre soit un lieu de paix et de sécurité.

L'histoire d'Ibrahim enseigne la soumission totale à Dieu, le courage de la vérité face à l'injustice et la confiance absolue en la sagesse divine.`,
      },
      {
        id: '7-4',
        title: 'Ismaïl (Ismaël)',
        content: `Ismaïl est le fils aîné d'Ibrahim et de Hajar (Agar). Son histoire est étroitement liée à celle de son père et aux origines de La Mecque.

Alors qu'Ismaïl était encore un nourrisson, Allah a ordonné à Ibrahim d'emmener Hajar et leur fils dans une vallée désertique et aride, à l'emplacement de ce qui deviendra La Mecque. Ibrahim les a laissés là avec quelques provisions, s'en remettant entièrement à la volonté de Dieu. Hajar lui a demandé : « Est-ce Allah qui t'a ordonné cela ? » Ibrahim a répondu oui. Elle a alors dit : « Alors Il ne nous abandonnera pas. »

Quand l'eau et les provisions furent épuisées, Hajar, désespérée, a couru sept fois entre les monts Safa et Marwa à la recherche d'eau ou de secours. C'est ce va-et-vient que les pèlerins reproduisent encore aujourd'hui lors du Hajj et de la 'Omra, dans le rite appelé le Sa'i. Allah a alors fait jaillir une source d'eau sous les pieds du bébé Ismaïl : c'est la source de Zamzam, qui coule encore aujourd'hui à La Mecque.

Plus tard, Ismaïl a grandi dans cette région et a aidé son père Ibrahim à construire la Kaaba. Il s'est soumis avec une foi totale lorsque son père lui a annoncé l'ordre divin du sacrifice, montrant un courage et une obéissance remarquables.

Le Coran le décrit comme « fidèle à sa promesse » (Sourate 19, verset 54). Le Prophète Muhammad ﷺ descend de la lignée d'Ismaïl, ce qui fait de lui un ancêtre direct du dernier messager de Dieu.`,
      },
      {
        id: '7-5',
        title: 'Ishaq (Isaac)',
        content: `Ishaq (Isaac) est le deuxième fils d'Ibrahim, né de son épouse Sarah. Sa naissance est en elle-même un miracle, car elle a été annoncée par des anges alors que ses deux parents étaient très âgés. Sarah, surprise, a ri en entendant la nouvelle, ne pouvant croire qu'elle aurait un enfant à son âge. Mais Allah lui a confirmé cette bonne nouvelle.

Le Coran dit : « Nous lui fîmes la bonne annonce d'Ishaq comme prophète parmi les vertueux. » (Sourate 37, verset 112)

Ishaq a grandi dans la foi et la piété, suivant le chemin de son père Ibrahim. Il est devenu lui-même un prophète et un homme de bien. Il est le père de Yacoub (Jacob), qui donnera naissance aux douze tribus d'Israël.

Ainsi, de la descendance d'Ibrahim, deux grandes lignées prophétiques sont nées : celle d'Ismaïl, dont descend le Prophète Muhammad ﷺ, et celle d'Ishaq, dont descendent de nombreux prophètes envoyés aux enfants d'Israël, comme Moussa (Moïse), Dawud (David), Sulayman (Salomon) et 'Issa (Jésus).`,
      },
      {
        id: '7-6',
        title: 'Yacoub (Jacob)',
        content: `Yacoub (Jacob) est le fils d'Ishaq et le petit-fils d'Ibrahim. Il est également appelé "Israïl" dans la tradition islamique, et c'est de son nom que vient l'expression "les enfants d'Israël" (Banu Israïl), désignant l'ensemble de ses descendants.

Yacoub a été un prophète pieux et dévoué, qui a consacré sa vie à transmettre le message du monothéisme à ses enfants et à sa famille. Sur son lit de mort, il a rassemblé ses douze fils et leur a demandé : « Qu'adorerez-vous après moi ? » Ils ont répondu : « Nous adorerons ton Dieu et le Dieu de tes pères Ibrahim, Ismaïl et Ishaq, un Dieu unique, et à Lui nous sommes soumis. » (Sourate 2, verset 133). Ce passage montre l'importance qu'il accordait à la transmission de la foi.

Yacoub a vécu une épreuve immense lorsque ses fils, jaloux de l'amour que leur père portait à Youssouf, ont éloigné ce dernier de lui. Ils ont prétendu qu'un loup l'avait dévoré. Yacoub, bien qu'accablé de chagrin, n'a jamais perdu espoir en la miséricorde de Dieu. Il a dit : « Je ne me plains qu'à Allah de mon tourment et de mon chagrin. » (Sourate 12, verset 86)

Des années plus tard, Yacoub a retrouvé son fils Youssouf en Égypte, où ce dernier était devenu un haut dignitaire. Quand il a appris que son fils était vivant, sa vue, qu'il avait perdue à force de pleurer, lui a été miraculeusement rendue.

L'histoire de Yacoub enseigne la patience face aux épreuves les plus douloureuses, la confiance inébranlable en Dieu et l'espoir qui ne s'éteint jamais.`,
      },
      {
        id: '7-7',
        title: 'Youssouf (Joseph)',
        content: `L'histoire de Youssouf (Joseph) est la seule dans le Coran à être racontée en intégralité dans une seule sourate (sourate 12), qu'Allah qualifie Lui-même de « le plus beau des récits ». C'est une histoire riche en émotions, en épreuves et en leçons.

Youssouf était le fils de Yacoub et était doté d'une beauté exceptionnelle. Enfant, il a fait un rêve dans lequel onze étoiles, le soleil et la lune se prosternaient devant lui. Son père a compris que ce rêve annonçait un grand destin et lui a conseillé de ne pas le raconter à ses frères.

Mais les frères de Youssouf étaient jaloux de l'amour que leur père lui portait. Ils ont comploté contre lui et l'ont jeté dans un puits. Ils sont revenus vers leur père en prétendant qu'un loup l'avait dévoré, ramenant sa tunique tachée de faux sang.

Youssouf a été recueilli par une caravane de passage et vendu comme esclave en Égypte, dans la maison d'un haut dignitaire. Là, il a dû affronter une nouvelle épreuve : la femme de son maître a tenté de le séduire, mais Youssouf a refusé par crainte de Dieu. Accusé injustement, il a été jeté en prison pendant plusieurs années.

En prison, Youssouf a interprété les rêves de ses compagnons de cellule avec une justesse remarquable. Sa réputation est arrivée jusqu'au roi d'Égypte, qui lui a demandé d'interpréter un rêve troublant. Youssouf a prédit sept années d'abondance suivies de sept années de famine, et a proposé un plan pour y faire face. Impressionné, le roi l'a nommé à la tête des réserves du pays.

C'est durant la famine que ses frères sont venus en Égypte chercher des provisions. Après plusieurs rencontres, Youssouf s'est fait reconnaître et les a pardonnés avec une générosité immense, disant : « Pas de reproche à vous faire aujourd'hui. Qu'Allah vous pardonne. » (Sourate 12, verset 92). La famille a été réunie et le rêve d'enfance de Youssouf s'est accompli.

L'histoire de Youssouf enseigne que la patience, la confiance en Dieu et la droiture finissent toujours par triompher, même après les épreuves les plus difficiles.`,
      },
      {
        id: '7-8',
        title: 'Moussa (Moïse)',
        content: `Moussa (Moïse) est le prophète le plus mentionné dans le Coran, cité plus de 130 fois. Il fait partie des cinq prophètes dotés de la plus grande détermination (Ulul Azm). Son histoire est l'un des récits les plus puissants du Coran, illustrant le combat entre la vérité et la tyrannie.

L'histoire de Moussa commence par un miracle. Pharaon, roi d'Égypte, avait ordonné de tuer tous les garçons nouveau-nés des enfants d'Israël. La mère de Moussa, inspirée par Allah, a déposé son bébé dans un coffre sur le Nil. Le coffre a été recueilli par la famille de Pharaon, et c'est ainsi que Moussa a grandi dans le palais même de celui qui voulait sa mort.

Devenu adulte, Moussa a dû fuir l'Égypte après avoir accidentellement tué un homme. Il s'est réfugié à Madian, où il a vécu plusieurs années en berger. C'est là qu'Allah lui a parlé directement au mont Sinaï, à travers un buisson ardent. Allah lui a confié une mission : retourner en Égypte et affronter Pharaon pour libérer les enfants d'Israël de l'esclavage.

Moussa est retourné en Égypte avec son frère Haroun (Aaron) et a demandé à Pharaon de laisser partir les enfants d'Israël. Pharaon a refusé. Allah a envoyé neuf signes miraculeux (les plaies), mais Pharaon s'est obstiné dans son orgueil et sa tyrannie.

Finalement, Moussa a conduit les enfants d'Israël hors d'Égypte. Pharaon les a poursuivis avec son armée jusqu'à la mer. Allah a ordonné à Moussa de frapper la mer avec son bâton : les eaux se sont ouvertes, créant un passage. Les enfants d'Israël ont traversé sains et saufs, tandis que Pharaon et son armée ont été engloutis par les flots.

Après la traversée, Allah a révélé à Moussa la Torah sur les Tablettes au mont Sinaï. Moussa est surnommé "Kalimullah" (celui à qui Allah a parlé directement), un honneur unique parmi les prophètes.

L'histoire de Moussa enseigne le courage face à l'injustice, la confiance en Dieu dans les moments les plus désespérés et la victoire de la vérité sur la tyrannie.`,
      },
      {
        id: '7-9',
        title: 'Dawud (David)',
        content: `Dawud (David) est à la fois roi et prophète. Allah lui a révélé les Psaumes (Zabour), l'un des quatre livres sacrés mentionnés dans le Coran avec les Feuillets d'Ibrahim (Abraham), la Torah de Moussa (Moïse) et l'Évangile de 'Issa (Jésus).

Dawud est connu pour sa voix d'une beauté extraordinaire. Quand il récitait les louanges à Allah, les montagnes et les oiseaux glorifiaient Dieu avec lui. Le Coran dit : « Nous avons assujetti les montagnes à glorifier Allah avec lui, ainsi que les oiseaux. » (Sourate 21, verset 79)

Avant de devenir roi, Dawud s'est illustré par un acte de bravoure qui a marqué l'histoire. Encore jeune, il a affronté le géant Jalout (Goliath), un guerrier redoutable que personne n'osait défier. Avec la permission d'Allah, Dawud l'a vaincu, démontrant que la foi et le courage peuvent triompher de la force brute.

Devenu roi des enfants d'Israël, Dawud a gouverné avec justice et sagesse. Allah lui avait donné la capacité de juger avec équité entre les gens. Il était également un artisan habile, à qui Allah avait appris à façonner le fer pour en faire des cottes de mailles.

Dawud était aussi connu pour son adoration intense. Le Prophète Muhammad ﷺ a dit que le jeûne le plus aimé par Allah est le jeûne de Dawud : jeûner un jour sur deux. Et la prière la plus aimée par Allah est celle de Dawud : il dormait la moitié de la nuit, priait le tiers et dormait le sixième restant.

L'histoire de Dawud enseigne que la royauté et le pouvoir doivent être au service de la justice, de la foi et de la gratitude envers Dieu.`,
      },
      {
        id: '7-10',
        title: 'Sulayman (Salomon)',
        content: `Sulayman (Salomon) est le fils de Dawud. Comme son père, il était à la fois roi et prophète. Mais Allah lui a accordé un royaume d'une puissance et d'une splendeur sans précédent, avec des pouvoirs qu'aucun autre être humain n'a jamais reçus.

Allah a soumis le vent à Sulayman, qui pouvait parcourir en un matin la distance d'un mois de marche. Il lui a donné le commandement des djinns, qui travaillaient sous ses ordres pour construire des édifices, plonger dans les mers et accomplir toutes sortes de tâches. Allah lui a également donné la compréhension du langage des animaux, des oiseaux et même des fourmis.

Le Coran raconte un épisode célèbre : un jour, en marchant avec son armée, Sulayman a entendu une fourmi avertir les autres fourmis de se mettre à l'abri pour ne pas être écrasées. Sulayman a souri et a invoqué Dieu avec humilité : « Mon Seigneur, inspire-moi pour que je rende grâce au bienfait dont Tu m'as comblé. » (Sourate 27, verset 19)

L'histoire de Sulayman avec la Reine de Saba (Bilqis) est également remarquable. Cette reine puissante adorait le soleil. Sulayman l'a invitée à venir le voir et, par sa sagesse et ses démonstrations de la puissance de Dieu, il l'a amenée à reconnaître la vérité du monothéisme. Elle a dit : « Mon Seigneur, je me suis fait du tort à moi-même. Je me soumets avec Sulayman à Allah, Seigneur de l'univers. » (Sourate 27, verset 44)

Malgré tout ce pouvoir immense, Sulayman est resté un serviteur humble et reconnaissant envers Allah. Son histoire enseigne que les bienfaits de Dieu sont un test, et que la vraie grandeur réside dans l'humilité et la gratitude.`,
      },
      {
        id: '7-11',
        title: 'Younus (Jonas)',
        content: `Younus (Jonas), surnommé "Dhun-Nun" (l'homme au poisson), est un prophète dont l'histoire est à la fois dramatique et profondément émouvante.

Allah a envoyé Younus au peuple de Ninive (dans l'actuel Irak) pour les appeler à adorer Dieu seul. Mais son peuple a refusé son message et l'a rejeté. Découragé et frustré, Younus a quitté sa ville sans attendre la permission d'Allah, pensant que sa mission avait échoué.

Il a embarqué sur un navire, mais une violente tempête s'est levée. Les marins, pensant qu'un passager portait malheur, ont tiré au sort pour savoir qui devait être jeté à la mer. Le sort est tombé sur Younus. Il a été jeté dans les flots et avalé par un énorme poisson.

Dans le ventre du poisson, plongé dans les ténèbres, Younus a réalisé son erreur. Il s'est tourné vers Dieu avec une invocation devenue célèbre : « Lâ ilâha illâ Anta, Subhanaka, innî kuntu mina-dhalimîn » - « Il n'y a de divinité que Toi, gloire à Toi, j'ai été parmi les injustes. » (Sourate 21, verset 87)

Allah a accepté son repentir et a ordonné au poisson de le rejeter sur le rivage. Younus est sorti affaibli mais vivant, et Allah a fait pousser une plante pour le protéger du soleil pendant sa convalescence.

Pendant ce temps, le peuple de Ninive, voyant les signes de la colère divine approcher, s'est repenti sincèrement. C'est le seul peuple dans le Coran qui a été épargné du châtiment après l'avertissement, grâce à la sincérité de son repentir.

L'histoire de Younus enseigne que nul ne doit désespérer de la miséricorde de Dieu, et que le repentir sincère est toujours accepté, quelles que soient les circonstances.`,
      },
      {
        id: '7-12',
        title: '\'Issa (Jésus)',
        content: `'Issa (Jésus), fils de Maryam (Marie), occupe une place très importante en Islam. Il fait partie des cinq prophètes dotés de la plus grande détermination (Ulul Azm). Pour les musulmans, il est un prophète et un messager d'Allah, et non le fils de Dieu. Cette distinction est fondamentale dans la croyance islamique.

La naissance de 'Issa est un miracle unique dans l'histoire de l'humanité. Il est né sans père, par la seule volonté de Dieu. Le Coran dit : « Pour Allah, 'Issa est comme Adam qu'Il créa de poussière, puis Il lui dit "Sois", et il fut. » (Sourate 3, verset 59). Sa mère Maryam est la seule femme mentionnée par son nom dans le Coran, et une sourate entière lui est consacrée (sourate 19).

Maryam était une femme d'une piété exceptionnelle. Quand l'ange Djibril (Gabriel) lui a annoncé qu'elle aurait un fils sans père, elle a été bouleversée. Mais Allah l'a rassurée, et 'Issa est né miraculeusement. Nouveau-né, il a parlé depuis son berceau pour défendre l'honneur de sa mère et annoncer sa mission : « Je suis le serviteur d'Allah. Il m'a donné le Livre et m'a désigné prophète. » (Sourate 19, verset 30)

Allah a accordé à 'Issa de nombreux miracles : il guérissait les aveugles et les lépreux, ressuscitait les morts avec la permission d'Allah, et façonnait des oiseaux d'argile auxquels il insufflait la vie. Tous ces miracles étaient des signes de la puissance de Dieu, et non de la divinité de 'Issa.

'Issa a prêché le monothéisme pur et a apporté l'Évangile (Injil) à son peuple. Mais la plupart l'ont rejeté et ont comploté pour le tuer. Selon le Coran, 'Issa n'a pas été crucifié ni tué, mais Allah l'a élevé vers Lui : « Ils ne l'ont ni tué ni crucifié, mais ce n'était qu'un faux-semblant. » (Sourate 4, verset 157)

Les musulmans croient que 'Issa reviendra sur terre à la fin des temps, avant le Jour du Jugement, pour rétablir la justice et la vérité. Son retour est l'un des signes majeurs de la fin des temps en Islam.`,
      },
    ],
  },
  {
    id: 8,
    title: 'FAQ',
    subtitle: 'Questions fréquentes sur l\'Islam',
    icon: CircleHelp,
    image: 'https://images.unsplash.com/photo-1578317260247-c8910c87a5a2?w=600&auto=format&fit=crop&q=80',
    topics: [
      {
        id: '8-1',
        title: 'Comment se convertir à l\'Islam ?',
        content: `Entrer en Islam est un acte simple et profond à la fois. Il suffit de prononcer la Shahada (la profession de foi) avec sincérité et conviction :

« Ach-hadou an lâ ilâha illallâh, wa ach-hadou anna Muhammadan Rasûlullâh »
Ce qui signifie : « Je témoigne qu'il n'y a de divinité qu'Allah, et je témoigne que Muhammad est Son messager. »

C'est tout. Il n'est pas nécessaire d'être devant un imam ou dans une mosquée pour prononcer cette déclaration. Cependant, il est vivement recommandé de se faire accompagner par une communauté bienveillante, qui pourra vous guider dans vos premiers pas.

**Après la Shahada :**
Il n'y a aucune précipitation. L'Islam est une religion de facilité et de progression. Voici les étapes recommandées :
- Apprendre les bases : les ablutions (Wudu) et la prière (Salat)
- Découvrir les cinq piliers de l'Islam et les piliers de la foi
- Progresser à son rythme, sans se surcharger
- Trouver une communauté pour vous soutenir et répondre à vos questions

**Et les péchés passés ?**
Le Prophète Muhammad ﷺ a dit que la conversion efface tout ce qui précède. Celui qui entre en Islam commence une page entièrement vierge, comme un nouveau-né. C'est un nouveau départ offert par la miséricorde de Dieu.

**Vous souhaitez en savoir plus ?**
La Mosquée Bilal accueille avec joie toute personne souhaitant découvrir l'Islam ou envisageant la conversion. Notre équipe est disponible en toute discrétion et bienveillance. N'hésitez pas à nous contacter via le formulaire de contact de ce site.`,
      },
      {
        id: '8-2',
        title: 'Qu\'est-ce que le halal ?',
        content: `Le mot "halal" est un terme arabe qui signifie "permis" ou "licite". Son opposé est "haram", qui signifie "interdit". En Islam, ces deux notions s'appliquent à tous les domaines de la vie : l'alimentation, les finances, les relations et les comportements.

**Le halal alimentaire**
Dans la vie quotidienne, le halal est souvent associé à l'alimentation. De manière générale, tout est permis sauf ce qui est explicitement interdit. Les viandes de bœuf, d'agneau, de poulet et le poisson sont halal, ainsi que tous les fruits, légumes et céréales. Pour que la viande soit considérée comme halal, l'animal doit être abattu selon les règles islamiques (Dhabh) : l'animal doit être vivant et sain, l'égorgement se fait avec un couteau tranchant en prononçant le nom d'Allah, afin de minimiser la souffrance de l'animal.

**Ce qui est interdit (haram) :**
- Le porc et tous ses dérivés
- Le sang
- Les animaux morts sans abattage rituel
- L'alcool et toutes les substances enivrantes
- Les animaux offerts à d'autres qu'Allah

**La règle de base :** en cas de doute sur un aliment, le musulman s'abstient, par précaution.

**Le halal au-delà de la nourriture**
Le concept de halal dépasse largement l'alimentation. Il s'applique aussi aux finances : l'Islam interdit le riba (l'intérêt usuraire), et encourage des transactions justes et transparentes. Il s'applique également aux comportements : l'honnêteté, le respect de la parole donnée, la bienveillance envers les autres sont autant de comportements "halal" encouragés par l'Islam.`,
      },
      {
        id: '8-3',
        title: 'Comment apprendre à prier ?',
        content: `Apprendre la prière est la première priorité pour tout nouveau musulman, et c'est plus simple qu'on ne le pense. Voici un parcours étape par étape pour y arriver :

**Étape 1 - Apprendre les ablutions (Wudu)**
Sans les ablutions, la prière n'est pas valide. Consultez la section "La Prière" de ce site pour apprendre les étapes du Wudu. C'est un rituel simple qui s'apprend en quelques minutes.

**Étape 2 - Mémoriser la sourate Al-Fatiha**
La sourate Al-Fatiha (l'Ouverture) est la première sourate du Coran. Elle est composée de 7 versets courts et doit être récitée dans chaque unité de prière (rak'a). Prenez le temps de la mémoriser à votre rythme, en l'écoutant et en la répétant.

**Étape 3 - Apprendre les mouvements et les formules de base**
La prière se compose de gestes simples (debout, inclinaison, prosternation, assis) accompagnés de formules courtes. Les principales sont :
- « Allahu Akbar » (Dieu est le plus grand) pour les transitions
- « Subhana Rabbiyal-Azim » pendant l'inclinaison
- « Subhana Rabbiyal-A'la » pendant la prosternation
- Le Tashahhud et le Taslim pour terminer la prière

**Étape 4 - Pratiquer avec quelqu'un**
Le meilleur moyen d'apprendre est de prier aux côtés d'un musulman expérimenté qui pourra vous corriger avec bienveillance. N'hésitez pas à demander de l'aide à la mosquée.

**L'essentiel à retenir :**
Le Prophète Muhammad ﷺ a dit : « Allah n'impose à une âme que ce qu'elle peut supporter. » Commencez par ce que vous pouvez et progressez à votre rythme. Dieu regarde la sincérité du cœur avant la perfection du geste. Des applications comme "Mawaqit" peuvent vous aider avec les horaires de prière et les guides pratiques.`,
      },
      {
        id: '8-4',
        title: 'Islam et vie en Occident',
        content: `L'Islam est une religion universelle qui peut être pratiquée dans tout contexte et dans tout pays. Vivre sa foi en Occident est tout à fait compatible avec les principes de l'Islam, et des millions de musulmans le font au quotidien en conciliant leur pratique religieuse avec leur vie professionnelle et sociale.

**Les principes fondamentaux restent les mêmes :**
Où que l'on vive, les piliers de l'Islam (la prière, le jeûne, la Zakat, etc.) ne changent pas. Ce qui peut varier, ce sont les modalités pratiques. Par exemple, les horaires de prière s'adaptent naturellement au fuseau horaire et à la position du soleil de chaque pays.

**La vie professionnelle et sociale**
Travailler dans un environnement non-musulman n'est pas interdit en Islam. Le musulman est encouragé à être un exemple de droiture, d'honnêteté et de bon comportement dans son milieu professionnel. Le Prophète Muhammad ﷺ a dit : « Le meilleur d'entre vous est celui qui est le plus utile aux autres. »

**Les finances**
L'Islam interdit le riba (l'intérêt usuraire). Des solutions de finance islamique existent de plus en plus en France et en Europe : banques participatives, assurances Takaful, épargne éthique. Ces alternatives permettent de gérer ses finances en accord avec ses convictions.

**Les réseaux sociaux et Internet**
Comme tout outil, ils sont neutres en eux-mêmes. Ce qui compte, c'est l'usage qu'on en fait : partager du savoir, communiquer sainement, apprendre est encouragé. Ce qui est interdit dans la vie réelle reste interdit en ligne. De nombreuses chaînes YouTube comme "Darifton Prod" proposent des vidéos en français pour vous aider à mieux comprendre les fondements de cette religion. Pour approfondir, n'hésitez pas à vous rapprocher de votre mosquée de proximité.

**Face au doute ou aux questions**
Le doute est humain et l'Islam encourage la réflexion et la recherche de connaissance. Le Prophète Muhammad ﷺ a dit : « Demandez, car c'est la guérison de l'ignorance. » N'hésitez jamais à poser vos questions à un imam ou à une personne de confiance.`,
      },
      {
        id: '8-5',
        title: 'Où apprendre l\'arabe et le Coran ?',
        content: `Apprendre l'arabe et le Coran est un voyage passionnant, accessible à tous, quel que soit votre âge ou votre niveau de départ. La Mosquée Bilal propose plusieurs programmes d'apprentissage pour vous accompagner.

**Cours de Tajwid (récitation du Coran) :**
Le Tajwid est l'art de réciter le Coran correctement, en respectant la prononciation de chaque lettre. La Mosquée Bilal propose des cours pour adultes et enfants, avec deux niveaux : débutant et intermédiaire.

**Atelier d'initiation à la langue arabe :**
Destiné aux adultes débutants, cet atelier a pour objectif d'apprendre les bases de la lecture et de l'écriture arabe. Aucun prérequis n'est nécessaire.

**Cours pour enfants :**
Les enfants peuvent apprendre l'alphabet arabe, mémoriser les courtes sourates du Coran et découvrir les bases de la prière et de la foi, dans un cadre adapté et bienveillant.

**Inscriptions :**
Pour connaître les horaires, les tarifs et les modalités d'inscription, contactez le secrétariat de la mosquée ou utilisez le formulaire de contact de ce site.

**Ressources en ligne pour compléter votre apprentissage :**
- Quran.com - lecture et écoute du Coran avec traduction en français
- Sunnah.com - accès aux grands recueils de hadiths
- De nombreuses chaînes YouTube proposent des tutoriels en français pour apprendre l'arabe et le Tajwid mais il est préférable de vous rapprocher d'un(e) enseignant(e) qualifié(e).

N'hésitez pas à faire le premier pas. Chaque lettre du Coran que vous apprenez à lire est une récompense auprès de Dieu.`,
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
              <MessageSquareHeart className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-serif text-primary uppercase tracking-wider">
                C&apos;est quoi l&apos;Islam ?
              </h1>
            </div>
            <p className="text-on-surface/60 text-sm">
              Découvrez les bases de l&apos;Islam à travers des explications simples et accessibles. Cette page n&apos;a pas vocation à être exhaustive mais vous invite à mieux comprendre les fondements de cette religion. Pour approfondir, n&apos;hésitez pas à vous rapprocher de votre mosquée de proximité.
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
                  {cat.image && (
                    <div
                      className="w-full h-24"
                      style={{
                        backgroundImage: `url(${cat.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <h2 className="text-sm font-bold text-primary uppercase tracking-wider leading-tight">
                        {cat.title}
                      </h2>
                    </div>
                    <p className="text-[11px] text-on-surface/50 mb-3 leading-snug">{cat.subtitle}</p>

                    <ul className={cat.id === 7 ? 'grid grid-cols-2 gap-x-2' : 'space-y-0.5'}>
                      {cat.topics.map((topic) => (
                        <li key={topic.id}>
                          <button
                            onClick={() => setSelectedTopic(topic)}
                            className="w-full text-left flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-surface-container transition-colors group/item"
                          >
                            <ChevronRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5 group-hover/item:translate-x-0.5 transition-transform" />
                            <span className="text-xs text-on-surface/65 group-hover/item:text-primary transition-colors leading-snug whitespace-nowrap">
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
