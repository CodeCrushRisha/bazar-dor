import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./fallback";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

type RawProduct = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
  markets: { market: string; division: string; min: number; max: number }[];
};

type RawCategory = { id?: string; slug: string; nameBn: string; icon: string };

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  categoryNameBn: string;
  description?: string;
  emoji: string;
  unit: string;
  todayPrice: number;
  changePercent: number;
  markets: { bazar: string; district: string; min: number; max: number; avg: number }[];
};

export type Category = { slug: string; name: string; icon: string };

function normalizeProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.nameBn,
    category: raw.category,
    categoryNameBn: raw.categoryNameBn,
    emoji: raw.image,
    unit: raw.unit,
    todayPrice: raw.today,
    changePercent: raw.change.pct,
    markets: (raw.markets ?? []).map((m) => ({
      bazar: m.market,
      district: m.division,
      min: m.min,
      max: m.max,
      avg: Math.round((m.min + m.max) / 2),
    })),
  };
}

function normalizeCategory(raw: RawCategory): Category {
  return { slug: raw.slug, name: raw.nameBn, icon: raw.icon };
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000;

async function tryFetch<T>(path: string): Promise<T | null> {
  const url = `${BASE_URL}${path}`;
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data as T;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    cache.set(url, { data, timestamp: Date.now() });
    return data as T;
  } catch {
    return null;
  }
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const raw = await tryFetch<RawProduct[]>("/products");
    if (raw && Array.isArray(raw)) return raw.map(normalizeProduct);
    return FALLBACK_PRODUCTS;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const raw = await tryFetch<RawProduct[]>("/products");
    const all = raw && Array.isArray(raw) ? raw.map(normalizeProduct) : FALLBACK_PRODUCTS;
    const found = all.find((p) => p.slug === slug);
    if (!found) throw new Error(`Product not found: ${slug}`);
    return found;
  },

  getCategories: async (): Promise<Category[]> => {
    const raw = await tryFetch<RawCategory[]>("/categories");
    if (raw && Array.isArray(raw)) return raw.map(normalizeCategory);
    return FALLBACK_CATEGORIES;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const raw = await tryFetch<RawCategory>(`/categories/${slug}`);
    if (raw) return normalizeCategory(raw);
    const found = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
    if (!found) throw new Error(`Category not found: ${slug}`);
    return found;
  },

  getProductsByCategory: async (slug: string): Promise<Product[]> => {
    const all = await api.getProducts();
    return all.filter((p) => p.category === slug);
  },
};