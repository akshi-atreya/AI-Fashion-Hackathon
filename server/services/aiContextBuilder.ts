import { QuizSubmission, AIContextPayload, Product, ProductCandidateFact } from '../types';

/**
 * Builds the structured AI Context Template according to the
 * "AI Stylist AI Input Checklist" data specification.
 *
 * Enforces privacy rules:
 * - Direct personal identifiers are excluded.
 * - Raw photo binary/base64 is kept out of prompts; only an anonymized asset_id and consent purpose are included.
 * - Permissions, source, freshness, and uncertainty are packaged alongside values.
 */
export function buildAIContextPayload(
  submission: QuizSubmission,
  products: Product[],
  photoAssetId: string | null = null
): AIContextPayload {
  const budgetAmount =
    submission.budget === 'low' ? 99 : submission.budget === 'medium' ? 220 : 950;

  const productCandidates: ProductCandidateFact[] = products.map((p) => ({
    retailer: p.brand,
    url: p.productUrl,
    variant_id: p.id,
    price: p.price,
    currency: p.currency,
    availability: p.inStock ? 'in_stock' : 'out_of_stock',
    size_available: p.sizes,
    shipping: { estimateDays: 3, cost: 0 },
    returns: { windowDays: p.returnWindowDays || 30, method: 'in_store_or_mail' },
    facts_as_of: p.factsAsOf || new Date().toISOString()
  }));

  return {
    request: {
      item: submission.category,
      occasion: submission.occasion || 'everyday',
      dress_code: submission.dressCode || 'smart_casual',
      location: 'US East',
      event_date: new Date().toISOString().split('T')[0],
      desired_impression: submission.desiredImpression || ['polished']
    },
    constraints: {
      budget: {
        amount: budgetAmount,
        currency: 'USD',
        scope: submission.category === 'outfit' ? 'look' : 'item',
        includes_shipping: false
      },
      deadline: undefined,
      excluded_materials: submission.excludedMaterials || [],
      retailer_exclusions: []
    },
    style: {
      likes: [submission.style],
      dislikes: [],
      color_preferences: []
    },
    fit: {
      sizes: {
        tops: submission.size,
        bottoms: submission.size,
        shoes: ''
      },
      fit_preferences: [submission.gender, submission.silhouettePreference, submission.bodyType].filter(Boolean) as string[],
      comfort_needs: submission.comfortNeeds || [],
      modesty_preferences: submission.modestyPreferences || ['standard']
    },
    wardrobe: {
      owned_items: submission.ownedItemsToPair || [],
      must_pair_with: submission.ownedItemsToPair || [],
      needs: submission.category === 'outfit' ? ['top', 'bottom', 'outerwear'] : [submission.category]
    },
    photo: {
      try_on_requested: !!photoAssetId,
      asset_id: photoAssetId ? 'anonymized-session-photo' : null,
      purpose_consent: photoAssetId ? ['try_on_only', 'session_retention_only'] : [],
      retention_until: photoAssetId ? 'end_of_session' : null
    },
    shopping: {
      region: 'US',
      shipping_postal_region: 'US-NY',
      sale_ok: true,
      rental_or_resale_ok: false
    },
    product_candidates: productCandidates,
    ranking_policy: {
      hard_constraints_first: true,
      sponsored_placement_allowed: false,
      explain_reasons: true
    },
    response_requirements: {
      show_exact_variant: true,
      flag_uncertainty: true,
      label_paid_results: true,
      offer_alternatives: true
    }
  };
}
