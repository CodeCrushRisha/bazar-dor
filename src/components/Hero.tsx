import { bnDate } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="badge badge-success badge-outline mb-3">
              {bnDate()}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-gray-600 mb-5">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গত, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <a href="#সব-পণ্য" className="btn btn-primary">
              সব দাম দেখুন
            </a>
          </div>
          <div className="text-center text-[120px] leading-none select-none">
            🧺
          </div>
        </div>
      </div>
    </section>
  );
}