"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, Product } from "@/lib/api";
import { formatChange, toBn } from "@/lib/utils";
import SkeletonCard from "@/components/SkeletonCard";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getProduct(slug)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">পণ্য খুঁজে পাওয়া যায়নি</h1>
        <Link href="/" className="btn btn-primary">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const ch = formatChange(product.changePercent);
  const markets = product.markets ?? [];
  const min = markets.length
    ? Math.min(...markets.map((m) => m.min))
    : product.todayPrice;
  const max = markets.length
    ? Math.max(...markets.map((m) => m.max))
    : product.todayPrice;
  const avg = markets.length
    ? Math.round(markets.reduce((s, m) => s + m.avg, 0) / markets.length)
    : product.todayPrice;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">
          হোম
        </Link>{" "}
        ›{" "}
        <Link
          href={`/category/${product.category}`}
          className="hover:underline"
        >
          {product.category}
        </Link>{" "}
        › <span>{product.name}</span>
      </nav>

      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl">{product.emoji}</div>
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-sm text-gray-500">
                  {product.unit} • {product.category}
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              {product.description ??
                "বাজারে আজকের দাম ও পরিবর্তনের সারসংক্ষেপ।"}
            </p>
          </div>
          <div className="bg-base-200 rounded-xl p-5 text-center min-w-40">
            <div className="text-xs text-gray-500">আজকের দাম</div>
            <div className="text-2xl font-bold">
              {toBn(product.todayPrice)} টাকা
            </div>
            <div className="text-xs text-gray-500">টাকা / {product.unit}</div>
            <div className={`text-sm font-semibold mt-1 ${ch.color}`}>
              {ch.text}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h2 className="font-bold text-lg mb-3">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "সর্বনিম্ন দাম", value: min, note: "সর্বনিম্ন বাজার" },
              { label: "সর্বোচ্চ দাম", value: max, note: "সর্বোচ্চ বাজার" },
              { label: "গড় দাম", value: avg, note: "সব বাজারের গড়" },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-base-300 rounded-xl p-4"
              >
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-2xl font-bold text-primary">
                  {toBn(s.value)} টাকা
                </div>
                <div className="text-xs text-gray-500">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="font-bold text-lg mb-3">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বোচ্চ</th>
                  <th>গড়</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m, i) => (
                  <tr key={i}>
                    <td>{m.bazar}</td>
                    <td>{m.district}</td>
                    <td>{toBn(m.min)} টাকা</td>
                    <td>{toBn(m.max)} টাকা</td>
                    <td>{toBn(m.avg)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}