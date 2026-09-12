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

export interface TryOnRequest {
  userImage: string; // base64 / dataURL
  productId: string;
  notes?: string;
  consentAcknowledged?: boolean;
}

export interface TryOnResponse {
  tryOnImage: string;
  cached: boolean;
  confidenceScore: number;
  stylingNotes: string[];
  disclaimer: string;
  uncertaintyFlags: string[];
  garment: Product;
}

export interface QuizSubmission {
  coreRequest?: CoreRequestType;
  budget: BudgetTier;
  style: FashionStyle;
  category: GarmentCategory;
  gender: GenderPreference;
  size: string;
  occasion?: string;
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
}

export interface ProductCandidateFact {
  retailer: string;
  url: string;
  variant_id: string;
  price: number | null;
  currency: string;
  availability: string;
  size_available: string[];
  shipping: { estimateDays?: number; cost?: number };
  returns: { windowDays?: number; method?: string };
  facts_as_of: string;
}

/**
 * AI Context Template matching Section "AI context template" in the checklist
 */
export interface AIContextPayload {
  request: {
    item: string;
    occasion: string;
    dress_code: string;
    location: string;
    event_date: string;
    desired_impression: string[];
  };
  constraints: {
    budget: {
      amount: number;
      currency: string;
      scope: 'item' | 'look';
      includes_shipping: boolean;
    };
    deadline?: string;
    excluded_materials: string[];
    retailer_exclusions: string[];
  };
  style: {
    likes: string[];
    dislikes: string[];
    color_preferences: string[];
  };
  fit: {
    sizes: {
      tops: string;
      bottoms: string;
      shoes: string;
    };
    fit_preferences: string[];
    comfort_needs: string[];
    modesty_preferences: string[];
  };
  wardrobe: {
    owned_items: string[];
    must_pair_with: string[];
    needs: string[];
  };
  photo: {
    try_on_requested: boolean;
    asset_id: string | null;
    purpose_consent: string[];
    retention_until: string | null;
  };
  shopping: {
    region: string;
    shipping_postal_region: string;
    sale_ok: boolean;
    rental_or_resale_ok: boolean;
  };
  product_candidates: ProductCandidateFact[];
  ranking_policy: {
    hard_constraints_first: boolean;
    sponsored_placement_allowed: boolean;
    explain_reasons: boolean;
  };
  response_requirements: {
    show_exact_variant: boolean;
    flag_uncertainty: boolean;
    label_paid_results: boolean;
    offer_alternatives: boolean;
  };
}
