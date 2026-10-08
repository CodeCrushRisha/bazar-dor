import type { Product } from "./api";

const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => bnDigits[+d]);
}

export function toBnPrice(n: number): string {
  return toBn(n.toLocaleString("en-US"));
}

export function formatChange(p: number): {
  text: string;
  color: string;
  arrow: string;
} {
  if (p === 0)
    return { text: `— ${toBn("0.0")}%`, color: "text-gray-500", arrow: "—" };
  if (p > 0)
    return {
      text: `▲ ${toBn(p.toFixed(1))}%`,
      color: "text-red-500",
      arrow: "▲",
    };
  return {
    text: `▼ ${toBn(Math.abs(p).toFixed(1))}%`,
    color: "text-green-600",
    arrow: "▼",
  };
}

export function sortByPrice(
  products: Product[],
  order: "default" | "asc" | "desc"
) {
  if (order === "default") return products;
  return [...products].sort((a, b) =>
    order === "asc" ? a.todayPrice - b.todayPrice : b.todayPrice - a.todayPrice
  );
}

export const bnDate = () => {
  const d = new Date();
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const days = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  return `${days[d.getDay()]}, ${toBn(d.getDate())} ${
    months[d.getMonth()]
  }, ${toBn(d.getFullYear())}`;
};