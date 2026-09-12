import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, BudgetTier } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ProductFilters {
  budget?: BudgetTier;
  category?: string;
  style?: string;
  gender?: string;
  limit?: number;
}

export interface ProductProvider {
  name: string;
  getProducts(filters: ProductFilters): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}

/**
 * MockProductProvider: Swappable provider reading from seed catalog
 * Maps budget tiers strictly to the requested retailers:
 * - low -> Zara
 * - medium -> Calvin Klein
 * - high -> Michael Kors (MKors)
 */
export class MockProductProvider implements ProductProvider {
  public name = 'MockProductProvider (Zara, Calvin Klein, Michael Kors)';
  private products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    try {
      const dataPath = path.join(__dirname, '../data/products.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      this.products = JSON.parse(rawData);
    } catch (err) {
      console.error('[ProductProvider] Failed to load products.json:', err);
      this.products = [];
    }
  }

  async getProducts(filters: ProductFilters): Promise<Product[]> {
    let result = [...this.products];

    // 1. Filter by Budget Tier (Primary Retailer Mapping)
    if (filters.budget) {
      const b = filters.budget.toLowerCase();
      result = result.filter((p) => p.budgetTier.toLowerCase() === b);
    }

    // 2. Filter by Category
    if (filters.category && filters.category !== 'outfit' && filters.category !== 'all') {
      const c = filters.category.toLowerCase();
      result = result.filter((p) => p.category.toLowerCase() === c);
    }

    // 3. Filter by Style
    if (filters.style && filters.style !== 'all') {
      const s = filters.style.toLowerCase();
      result = result.filter((p) => p.styles.some((st) => st.toLowerCase() === s));
    }

    // 4. Filter by Gender
    if (filters.gender && filters.gender !== 'unisex') {
      const g = filters.gender.toLowerCase();
      result = result.filter((p) => p.gender === 'unisex' || p.gender.toLowerCase() === g);
    }

    // If filters were too strict and returned 0, return items matching at least the budget tier
    if (result.length === 0 && filters.budget) {
      result = this.products.filter((p) => p.budgetTier.toLowerCase() === filters.budget?.toLowerCase());
    }

    if (filters.limit && filters.limit > 0) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    const found = this.products.find((p) => p.id === id);
    return found || null;
  }
}

/**
 * Factory to retrieve active product provider (easily switchable via env)
 */
export function getProductProvider(): ProductProvider {
  // In production, check process.env.PRODUCT_PROVIDER_TYPE === 'AFFILIATE' etc.
  return new MockProductProvider();
}
