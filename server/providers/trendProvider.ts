import { Trend } from '../types';

export interface TrendProvider {
  name: string;
  getTrends(limit?: number): Promise<Trend[]>;
}

const CURATED_VOGUE_TRENDS: Trend[] = [
  {
    id: 'trend-01',
    title: 'Every Celebrity On the Front Row at New York Fashion Week',
    source: 'Vogue',
    url: 'https://www.vogue.com/slideshow/celebrities-front-row-new-york-fashion-week-spring-2027',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    summary: 'The front rows at NYFW embraced an unapologetic dark elegance: sculptural monochrome suits, draped liquid silks, and oversized outerwear.',
    geminiTakeaway: 'Style tip: Pair relaxed straight trousers with a structured blazer to emulate front-row tailoring without over-dressing.',
    category: 'Runway',
    publishedAt: 'September 2026'
  },
  {
    id: 'trend-02',
    title: 'Sumptuous and Supple—The Suede Jackets We’re Eyeing for Fall',
    source: 'Vogue',
    url: 'https://www.vogue.com/article/suede-jackets',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    summary: 'Suede outerwear has surged to the forefront. Buttery calf suede and espresso tones are replacing stiff utility coats.',
    geminiTakeaway: 'Style tip: Suede brings tactile depth to minimalist outfits. Try an oversized suede bomber over neutral knitwear.',
    category: 'Trends',
    publishedAt: 'September 2026'
  },
  {
    id: 'trend-03',
    title: 'Meet the Fashion Collector Obsessed With McQueen and Ann Demeulemeester',
    source: 'Vogue',
    url: 'https://www.vogue.com/article/tanya-ravichandran-collector-mcqueen-ann-demeulemeester',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    summary: 'A rare glimpse into an archive devoted to dark romanticism and avant-garde Belgian tailoring.',
    geminiTakeaway: 'Style tip: Asymmetrical hemlines and poet shirt collars add poetic weight to modern streetwear.',
    category: 'Culture',
    publishedAt: 'September 2026'
  },
  {
    id: 'trend-04',
    title: 'Dua Lipa and Callum Turner Bring Their Newlywed Energy to NYFW',
    source: 'Vogue',
    url: 'https://www.vogue.com/article/dua-lipa-and-callum-turner-bring-their-newlywed-energy-to-new-york-fashion-week',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    summary: 'The couple showcased late-90s minimalist chic in oversized glossy leather trenches and tonal charcoal blazers.',
    geminiTakeaway: 'Style tip: Monochromatic leather outerwear combined with clean basics creates an effortless high-fashion silhouette.',
    category: 'Celebrity',
    publishedAt: 'September 2026'
  },
  {
    id: 'trend-05',
    title: 'Princess Diana’s Iconic “Revenge Dress” Is Going Up for Auction',
    source: 'Vogue',
    url: 'https://www.vogue.com/article/princess-diana-revenge-dress-auction',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    summary: 'The defining black off-the-shoulder silk dress returns to international auction, celebrating timeless nocturnal power dressing.',
    geminiTakeaway: 'Style tip: A classic little black dress with architectural neckline remains the most potent evening garment in history.',
    category: 'Culture',
    publishedAt: 'September 2026'
  }
];

export class VogueTrendProvider implements TrendProvider {
  public name = 'VogueTrendProvider';

  async getTrends(limit: number = 6): Promise<Trend[]> {
    // In production with live network, this can fetch from Vogue RSS /feed/rss
    // and call Gemini API to extract bulleted takeaways.
    // For fast, resilient responses, return curated Vogue data:
    return CURATED_VOGUE_TRENDS.slice(0, limit);
  }
}

export function getTrendProvider(): TrendProvider {
  return new VogueTrendProvider();
}
