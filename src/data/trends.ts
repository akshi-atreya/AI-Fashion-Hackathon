import { TrendItem } from '../types/fashion';

export const RUNWAY_TRENDS: TrendItem[] = [
  {
    id: 'trend-le-smoking',
    title: 'The Neo-Smoking Resurgence',
    season: 'Fall/Winter 2026',
    tag: 'Haute Tailoring',
    description: 'A sharp, sensual revival of Yves Saint Laurent’s iconic 1966 Le Smoking. Exaggerated peak lapels, razor-padded shoulder pads, and bare-skin underpinnings redefine power dressing for the nocturnal era.',
    keyElements: ['Grain de Poudre Wool', 'Contrast Silk Lapels', 'Deep V-Necklines', 'Cigarette Pant Cuts'],
    palette: [
      { name: 'Obsidian Noir', hex: '#0a0a0a' },
      { name: 'Duchess White', hex: '#f4f4f4' },
      { name: 'Satin Sheen', hex: '#262626' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    runwayReference: 'Paris Runway: Grand Palais Éphémère'
  },
  {
    id: 'trend-supple-suede',
    title: 'Sumptuous Suede & Archival Outerwear',
    season: 'Autumn Preview 2026',
    tag: 'Textural Luxury',
    description: 'Velvety calfskins and tactile suede jackets have officially overtaken stiff trench coats. Layered over sheer silk dresses or tailored trousers, they balance utilitarian warmth with effortless Parisian insouciance.',
    keyElements: ['Espresso & Cognac Hues', 'Oversized Trench Proportions', 'Horn Fastenings', 'Unfinished Hemlines'],
    palette: [
      { name: 'Deep Espresso', hex: '#2b1d14' },
      { name: 'Smoked Suede', hex: '#5c4838' },
      { name: 'Charcoal Black', hex: '#161616' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    runwayReference: 'Vogue Forecast: Milan & Paris Showrooms'
  },
  {
    id: 'trend-sheer-chiffon',
    title: 'Diaphanous Noir & Sheer Architecture',
    season: 'Winter Nocturne 2026',
    tag: 'Sensual Draping',
    description: 'Transparent silk mousselines and micro-ribbed sheer jerseys styled in monochromatic layers. It celebrates the play between exposure and protection, with cascading train capes and open-back column gowns.',
    keyElements: ['Mulberry Silk Mousseline', 'Halter Plunges', 'Integrated Capes', 'Translucent Volume'],
    palette: [
      { name: 'Smoked Noir', hex: '#121212' },
      { name: 'Midnight Violet', hex: '#1a1423' },
      { name: 'Gunmetal Silver', hex: '#9e9e9e' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
    runwayReference: 'Couture Week: Place Vendôme Showcase'
  },
  {
    id: 'trend-liquid-leather',
    title: 'Glazed Calfskin & Imposing Volumes',
    season: 'Current Runway',
    tag: 'Architectural Edge',
    description: 'High-gloss patent surfaces and supple glazed lambskins molded into sculptural floor-length coats and high-rise trousers. The finish reflects night city lights with sharp cinematic drama.',
    keyElements: ['Floor-Sweeping Maxi Coats', 'Belted Hourglasses', 'Lacquered Stiletto Accents', 'Minimal Seams'],
    palette: [
      { name: 'Patent Noir', hex: '#050505' },
      { name: 'Oil Slick Sheen', hex: '#1c1f24' },
      { name: 'Platinum Chrome', hex: '#d9d9d9' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
    runwayReference: 'Yves Saint Laurent Trocadéro Runway'
  }
];
