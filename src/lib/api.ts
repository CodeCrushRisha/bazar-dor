const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export type Product = {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  unit: string;
  category: string;
  todayPrice: number;
  changePercent: number;
  description?: string;
  markets?: {
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

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return (data?.data ?? data) as T;
}

export const api = {
  getProducts: () => fetcher<Product[]>("/products"),
  getProduct: (slug: string) => fetcher<Product>(`/products/${slug}`),
  getCategories: () => fetcher<Category[]>("/categories"),
  getCategory: (slug: string) => fetcher<Category>(`/categories/${slug}`),
  getProductsByCategory: (slug: string) =>
    fetcher<Product[]>(`/products?category=${slug}`),
};