"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { api, Category, Product } from "@/lib/api";
import { bnDate, toBn, formatChange } from "@/lib/utils";
import toast from "react-hot-toast";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ticker, setTicker] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api
      .getProducts()
      .then((p) => setTicker(p.slice(0, 10)))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <div>
            <div className="font-bold text-lg text-primary">বাজার দর</div>
            <div className="text-[10px] text-gray-500">{bnDate()}</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {!session ? (
            <>
              <Link href="/signin" className="btn btn-ghost btn-sm">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                সাইন আপ
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-2"
              >
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-7">
                    <span>{session.user.name?.[0] ?? "U"}</span>
                  </div>
                </div>
                <span className="hidden sm:inline">{session.user.name}</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-56 p-2 mt-2"
              >
                <li className="px-3 py-2 border-b">
                  <div className="font-semibold">{session.user.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </div>
                </li>
                <li>
                  <Link href="/profile">
                    <User size={16} /> আমার প্রোফাইল
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut size={16} /> সাইন আউট
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          className="md:hidden btn btn-ghost btn-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      <div className="bg-base-100 border-t">
        <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`badge badge-lg gap-1 whitespace-nowrap ${
                  active ? "badge-primary text-primary-content" : "badge-ghost"
                }`}
              >
                <span>{c.icon}</span> {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex gap-2">
          {!session ? (
            <>
              <Link href="/signin" className="btn btn-ghost btn-sm flex-1">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm flex-1">
                সাইন আপ
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="btn btn-ghost btn-sm flex-1">
                প্রোফাইল
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-error btn-outline btn-sm flex-1"
              >
                সাইন আউট
              </button>
            </>
          )}
        </div>
      )}

      <div className="bg-base-200 border-t overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker py-1.5">
          {[...ticker, ...ticker].map((p, i) => {
            const ch = formatChange(p.changePercent);
            return (
              <span key={i} className="mx-4 text-xs flex items-center gap-1">
                <span>{p.emoji}</span>
                <span>{p.name}</span>
                <span className="font-semibold">
                  {toBn(p.todayPrice)} টাকা/{p.unit}
                </span>
                <span className={ch.color}>{ch.text}</span>
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}