const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Raw API shape (যেভাবে API থেকে আসে)
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
  slug: string;
  nameBn: string;
  icon: string;
};

// Cleaned shape (আমাদের app-এ যেভাবে ব্যবহার করবো)
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
    markets: raw.markets.map((m) => ({
      bazar: m.market,
      district: m.division,
      min: m.min,
      max: m.max,
      avg: Math.round((m.min + m.max) / 2),
    })),
  };
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const raw = await getJson<RawProduct[]>("/products");
    return raw.map(normalizeProduct);
  },

  getProduct: async (slug: string): Promise<Product> => {
    const raw = await getJson<RawProduct>(`/products/${slug}`);
    return normalizeProduct(raw);
  },

  getCategories: async (): Promise<Category[]> => {
    const raw = await getJson<RawCategory[]>("/categories");
    return raw.map((c) => ({ slug: c.slug, name: c.nameBn, icon: c.icon }));
  },

  getCategory: async (slug: string): Promise<Category> => {
    const raw = await getJson<RawCategory>(`/categories/${slug}`);
    return { slug: raw.slug, name: raw.nameBn, icon: raw.icon };
  },

  getProductsByCategory: async (slug: string): Promise<Product[]> => {
    const raw = await getJson<RawProduct[]>(`/products?category=${slug}`);
    return raw.map(normalizeProduct);
  },
};