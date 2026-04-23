export interface Hadith {
  id: string;
  texte: string;
  narrateur: string | null;
  source: string | null;
  actif: boolean;
  created_at: string;
  updated_at: string;
}
