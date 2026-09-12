export interface Garment {
  id: string;
  name: string;
  category: 'Tuxedo' | 'Gown' | 'Outerwear' | 'Blouse' | 'Tailoring' | 'Accessories';
  price: string;
  description: string;
  material: string;
  details: string[];
  imageUrl: string;
  tryOnOverlayUrl?: string;
  silhouette: string;
  color: string;
  hotspot?: { x: number; y: number; label: string };
}

export interface ModelPreset {
  id: string;
  name: string;
  title: string;
  gender: 'women' | 'men' | 'editorial';
  height: string;
  stats: string;
  imageUrl: string;
  silhouetteMask?: string;
  pose: string;
}

export interface TrendItem {
  id: string;
  title: string;
  season: string;
  tag: string;
  description: string;
  keyElements: string[];
  palette: { name: string; hex: string }[];
  imageUrl: string;
  runwayReference: string;
}

export interface VogueArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Runway' | 'Celebrity' | 'Trends' | 'Culture';
  author: string;
  date: string;
  readTime: string;
  url: string;
  imageUrl: string;
  summary: string;
  fullContent: string[];
  keyQuotes?: string[];
}

export interface StyleQuestionnaire {
  archetype: string;
  occasion: string;
  silhouette: string;
  colorPalette: string;
  customNotes: string;
}

export interface RecommendationResult {
  id: string;
  collectionName: string;
  styleVerdict: string;
  heroPiece: Garment;
  pairingNotes: string[];
  shoes: string;
  accessories: string[];
  fragrance: string;
  curatorInsight: string;
  vogueTrendAffiliation: string;
  matchScore: number;
}
