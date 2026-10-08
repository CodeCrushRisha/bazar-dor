import { api } from "@/lib/api";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Suspense } from "react";
import { toBn } from "@/lib/utils";

async function ProductSections() {
  const products = await api.getProducts();
  const risers = [...products]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 6);
  const fallers = [...products]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 6);

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-500">▲</span> আজ দাম বেড়েছে
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {risers.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-green-600">▼</span> আজ দাম কমেছে
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fallers.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section
        id="সব-পণ্য"
        className="max-w-6xl mx-auto px-4 py-8 scroll-mt-40"
      >
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="text-sm text-gray-500 mb-4">
          মোট {toBn(products.length)} টি পণ্য দেখানো হচ্ছে
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <ProductSections />
      </Suspense>
    </>
  );
}