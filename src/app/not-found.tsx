import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-4">🧭</div>
      <h1 className="text-3xl font-bold mb-2">
        ৪০৪ — পেজ খুঁজে পাওয়া যায়নি
      </h1>
      <p className="text-gray-500 mb-8">
        আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই।
      </p>
      <Link href="/" className="btn btn-primary">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}