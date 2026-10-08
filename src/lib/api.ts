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
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
};

type RawCategory = {
  id?: string;
  slug: string;
  nameBn: string;
  icon: string;
};

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
  markets: {
    bazar: string;
    district: string;
    min: number;
    max: number;
    avg: number;
  }[];
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
};

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
  return {
    slug: raw.slug,
    name: raw.nameBn,
    icon: raw.icon,
  };
}

// In-memory cache with TTL
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function getJson<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;

  // Return cached data if fresh
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (res.status === 429) {
      // Rate limited — use expired cache if available
      if (cached) {
        console.warn("429 — using expired cache for", url);
        return cached.data as T;
      }
      throw new Error(
        "API rate limit exceeded. Please wait a few minutes and try again."
      );
    }

    if (!res.ok) {
      throw new Error(`API error: ${res.status} on ${url}`);
    }

    const data = await res.json();
    cache.set(url, { data, timestamp: Date.now() });
    return data as T;
  } catch (err) {
    // Network error — fall back to cache
    if (cached) {
      console.warn("Network error — using cache for", url);
      return cached.data as T;
    }
    throw err;
  }
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const raw = await getJson<RawProduct[]>("/products");
    return (raw ?? []).map(normalizeProduct);
  },

  getProduct: async (slug: string): Promise<Product> => {
    // API doesn't support /products/:slug — fetch all and filter
    const raw = await getJson<RawProduct[]>("/products");
    const found = (raw ?? []).find((p) => p.slug === slug);
    if (!found) throw new Error(`Product not found: ${slug}`);
    return normalizeProduct(found);
  },

  getCategories: async (): Promise<Category[]> => {
    const raw = await getJson<RawCategory[]>("/categories");
    return (raw ?? []).map(normalizeCategory);
  },

  getCategory: async (slug: string): Promise<Category> => {
    const raw = await getJson<RawCategory>(`/categories/${slug}`);
    return normalizeCategory(raw);
  },

  getProductsByCategory: async (slug: string): Promise<Product[]> => {
    const raw = await getJson<RawProduct[]>(`/products?category=${slug}`);
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeProduct);
  },
};