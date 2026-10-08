import Link from "next/link";
import { Product } from "@/lib/api";
import { formatChange, toBn, unitBn } from "@/lib/utils";

export default function ProductCard({ p }: { p: Product }) {
  const ch = formatChange(p.changePercent);
  return (
    <Link
      href={`/product/${p.slug}`}
      className="card bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <div className="text-4xl leading-none">{p.emoji}</div>
          <div>
            <div className="font-semibold text-gray-900">{p.name}</div>
            <div className="text-xs text-gray-500">{unitBn(p.unit)}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-gray-500">আজকের দাম</div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-lg text-gray-900">
              {toBn(p.todayPrice)} টাকা
            </span>
            <span className={`text-xs font-semibold ${ch.color}`}>
              {ch.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}