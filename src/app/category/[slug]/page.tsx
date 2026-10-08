"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import SortDropdown from "@/components/SortDropdown";
import { sortByPrice, toBn } from "@/lib/utils";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [catResult, prodsResult] = await Promise.allSettled([
        api.getCategory(slug),
        api.getProductsByCategory(slug),
      ]);

      if (cancelled) return;

      const catData =
        catResult.status === "fulfilled" ? catResult.value : null;
      const prodsData =
        prodsResult.status === "fulfilled" ? prodsResult.value : [];

      if (!catData && prodsData.length > 0) {
        setCategory({
          slug,
          name: prodsData[0].categoryNameBn,
          icon: prodsData[0].emoji,
        });
      } else {
        setCategory(catData);
      }
      setProducts(prodsData);
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sorted = useMemo(
    () => sortByPrice(products, sort as "default" | "asc" | "desc"),
    [products, sort]
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">
          ক্যাটাগরি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-gray-500 mb-6">
          আপনি যে ক্যাটাগরিটি খুঁজছেন তা বিদ্যমান নেই।
        </p>
        <Link
          href="/"
          className="btn bg-green-600 hover:bg-green-700 text-white border-0"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="card bg-white rounded-2xl shadow-sm mb-6">
        <div className="card-body flex-row items-center gap-4">
          <div className="text-4xl">{category.icon}</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-sm text-gray-500">
              এই ক্যাটাগরির সর্বশেষ দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          মোট {toBn(sorted.length)} টি পণ্য দেখানো হচ্ছে
        </p>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 mb-6">
            এই ক্যাটাগরিতে কোনো পণ্য নেই।
          </p>
          <Link
            href="/"
            className="btn bg-green-600 hover:bg-green-700 text-white border-0"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}