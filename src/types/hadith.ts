// Type pour la future table `hadiths` dans Supabase
export interface Hadith {
  id: string;
  text: string;
  source: string; // ex: "Al-Bukhari n°1 & Muslim n°1907"
  narrator: string; // ex: "Omar ibn Al-Khattab"
  is_active: boolean; // affiché ou masqué côté public
  created_at: string;
  updated_at: string;
  created_by?: string; // UUID de l'utilisateur Supabase
}
