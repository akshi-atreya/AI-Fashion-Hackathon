export type BudgetTier = 'low' | 'medium' | 'high';
export type FashionStyle = 'casual' | 'formal' | 'streetwear' | 'business' | 'athleisure';
export type GarmentCategory = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'outfit';
export type GenderPreference = 'women' | 'men' | 'unisex';

export type CoreRequestType = 'specific_item' | 'full_outfit' | 'replacement' | 'inspiration' | 'wardrobe_match';
export type DressCode = 'formal' | 'business_formal' | 'business_casual' | 'smart_casual' | 'creative' | 'casual';
export type DesiredImpression = 'polished' | 'approachable' | 'authoritative' | 'understated' | 'bold_statement';
export type ModestyPreference = 'standard' | 'high_coverage' | 'modest_neckline' | 'long_sleeve' | 'maxi_length';
export type ComfortNeed =
  | 'high_stretch'
  | 'breathable_natural'
  | 'structured_tailored'
  | 'sensitive_skin'
  | 'temperature_adaptive'
  | 'extended_wear'
  | 'flat_or_low_heel';

export type SilhouettePreference = 'relaxed_oversized' | 'slim_tailored' | 'classic_regular' | 'draped_flowy';

export type BodyType = 'hourglass' | 'athletic' | 'pear' | 'rectangle' | 'oval';

export interface BodyTypeAnalysis {
  bodyType: BodyType;
  label: string;
  confidence: number;
  proportions: {
    shoulderToWaist: string;
    waistToHip: string;
    verticalBalance: string;
  };
  summary: string;
  bestSilhouettes: string[];
  stylingAdvice: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: 'Zara' | 'Calvin Klein' | 'Michael Kors';
  budgetTier: BudgetTier;
  price: number;
  currency: string;
  category: GarmentCategory;
  styles: FashionStyle[];
  gender: GenderPreference;
  imageUrl: string;
  productUrl: string;
  description: string;
  sizes: string[];
  color: string;
  inStock: boolean;
  factsAsOf?: string;
  shippingEstimate?: string;
  returnWindowDays?: number;
  materialComposition?: string;
  flatteringBodyTypes?: BodyType[];
}

export interface Trend {
  id: string;
  title: string;
  source: 'Vogue';
  url: string;
  imageUrl: string;
  summary: string;
  geminiTakeaway: string;
  category: string;
  publishedAt: string;
}

export interface QuizState {
  coreRequest?: CoreRequestType;
  budget: BudgetTier;
  style: FashionStyle;
  category: GarmentCategory;
  gender: GenderPreference;
  size: string;
  occasion: string;
  dressCode?: DressCode;
  desiredImpression?: DesiredImpression[];
  modestyPreferences?: ModestyPreference[];
  comfortNeeds?: ComfortNeed[];
  silhouettePreference?: SilhouettePreference;
  comfortLevelDescription?: string;
  ownedItemsToPair?: string[];
  excludedMaterials?: string[];
  bodyType?: BodyType;
  bodyTypeAnalysis?: BodyTypeAnalysis;
  completed: boolean;
}

export interface TryOnResult {
  tryOnImage: string;
  cached: boolean;
  confidenceScore: number;
  stylingNotes: string[];
  disclaimer: string;
  uncertaintyFlags: string[];
  garment: Product;
}
