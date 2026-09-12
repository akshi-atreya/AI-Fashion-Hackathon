import { Garment } from '../types/fashion';

export const LUXURY_GARMENTS: Garment[] = [
  {
    id: 'garment-1',
    name: 'Le Smoking Grain de Poudre Jacket',
    category: 'Tuxedo',
    price: '$3,890',
    description: 'Single-breasted tuxedo jacket crafted from structured grain de poudre wool with silk satin peak lapels, padded sharp shoulders, and silk covered buttons.',
    material: '100% Virgin Wool, Silk Satin Trim',
    details: [
      'Iconic Saint Laurent silhouette',
      'High peak lapels in contrast duchess satin',
      'Padded architectural shoulders',
      'Silk twill interior lining with double welt pockets'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Sharp Tailored',
    color: 'Noir Profond',
    hotspot: { x: 50, y: 38, label: 'Le Smoking Jacket — $3,890' }
  },
  {
    id: 'garment-2',
    name: 'Backless Draped Silk Mousseline Gown',
    category: 'Gown',
    price: '$5,200',
    description: 'Floor-sweeping column gown in sheer noir silk mousseline with an open plunge back, halter neckline, and cascading fluid asymmetric drape.',
    material: '100% Mulberry Silk Mousseline',
    details: [
      'Dramatic low-cut spine with delicate halter fastening',
      'Hand-pleated bodice cascading into a train',
      'Double silk georgette lining',
      'Made in Paris Atelier'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Fluid & Draped',
    color: 'Midnight Obsidian',
    hotspot: { x: 50, y: 55, label: 'Silk Mousseline Gown — $5,200' }
  },
  {
    id: 'garment-3',
    name: 'Double-Breasted Sculptural Leather Trench',
    category: 'Outerwear',
    price: '$6,900',
    description: 'Maxi double-breasted coat cut from glazed calfskin leather with storm flaps, epaulettes, and a wide belted waist for an imposing cinematic presence.',
    material: '100% Glazed Calfskin Leather',
    details: [
      'Floor-skimming silhouette',
      'Gunmetal hardware and horn buttons',
      'Removable oversized buckle belt',
      'Cupro satin lining'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Oversized Structured',
    color: 'Gloss Noir',
    hotspot: { x: 48, y: 45, label: 'Sculptural Leather Trench — $6,900' }
  },
  {
    id: 'garment-4',
    name: 'Lavallière Sheer Silk Georgette Blouse',
    category: 'Blouse',
    price: '$1,950',
    description: 'Transparent silk georgette shirt featuring a voluminous lavallière tie collar, concealed mother-of-pearl placket, and bishop sleeves.',
    material: '100% Silk Georgette',
    details: [
      'Self-tie neck bow that drapes to waist',
      'Semi-sheer whisperweight weave',
      'French cuffs with tonal cufflinks',
      'Signature YSL Parisian bohemianism'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Fluid & Draped',
    color: 'Smoked Noir',
    hotspot: { x: 50, y: 32, label: 'Lavallière Silk Blouse — $1,950' }
  },
  {
    id: 'garment-5',
    name: 'Archival Suede Nocturne Oversized Blazer',
    category: 'Outerwear',
    price: '$4,450',
    description: 'Sumptuous velvety calf suede blazer in deep espresso noir with drop shoulders, wide notch lapels, and horn front fastening.',
    material: '100% Velvety Calf Suede',
    details: [
      'Unstructured relaxed drape with boxy proportions',
      'Buttery soft hand-feel',
      'Flap pockets with welt chest pocket',
      'Tone-on-tone pick stitching'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Oversized Structured',
    color: 'Espresso Noir',
    hotspot: { x: 52, y: 42, label: 'Suede Nocturne Blazer — $4,450' }
  },
  {
    id: 'garment-6',
    name: 'Liquid Velvet High-Waist Flaneur Trousers',
    category: 'Tailoring',
    price: '$2,150',
    description: 'High-rise wide-leg trousers in lustrous midnight silk-blend velvet with deep front inverted pleats and pressed creases.',
    material: '82% Viscose, 18% Silk Velvet',
    details: [
      'Ultra high-rise elongated waistline',
      'Floor-grazing pooling hem',
      'Concealed hook and bar closure',
      'Side slash pockets and back jetted pockets'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Sharp Tailored',
    color: 'Pure Noir',
    hotspot: { x: 50, y: 72, label: 'Velvet Flaneur Trousers — $2,150' }
  },
  {
    id: 'garment-7',
    name: 'Cassandre Pointed Stiletto Booties',
    category: 'Accessories',
    price: '$1,850',
    description: 'Ultra-pointed ankle boots in polished patent leather featuring an 110mm lacquered stiletto heel and minimal architectural seams.',
    material: '100% Patent Calfskin, Leather Sole',
    details: [
      'Razor-sharp pointed toe profile',
      'Inner side zip closure',
      '110mm sculptural heel',
      'Handcrafted in Italy'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Sharp Tailored',
    color: 'Patent Black',
    hotspot: { x: 50, y: 92, label: 'Pointed Stiletto Booties — $1,850' }
  },
  {
    id: 'garment-8',
    name: 'Sculptural Asymmetric Chiffon Cape Dress',
    category: 'Gown',
    price: '$4,800',
    description: 'Mini dress sculpted with an integrated one-shoulder dramatic chiffon cape that trails the floor as you move, capturing raw runway drama.',
    material: '100% Silk Crepe & Chiffon',
    details: [
      'Asymmetric single sleeve cape',
      'Body-contouring tailored mini slip underlayer',
      'Invisible side zipper',
      'Paris Runway Edition'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    tryOnOverlayUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    silhouette: 'Sculptural Hourglass',
    color: 'Carbon Noir',
    hotspot: { x: 51, y: 50, label: 'Asymmetric Cape Dress — $4,800' }
  }
];
