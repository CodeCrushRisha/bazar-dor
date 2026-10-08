"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error("পাসওয়ার্ড মিলছে না");
    if (form.password.length < 8)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে");

    setLoading(true);
    const { error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
    } else {
      toast.success("রেজিস্ট্রেশন সফল! সাইন ইন করুন।");
      router.push("/signin");
    }
  };

  const social = async (provider: "google" | "github") => {
    await signIn.social({ provider, callbackURL: "/" });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-2">
        অ্যাকাউন্ট তৈরি করুন
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        দামের বিস্তারিত ও বাজার তুলনা দেখতে রেজিস্টার করুন।
      </p>
      <form
        onSubmit={submit}
        className="card bg-base-100 shadow-sm p-6 space-y-4"
      >
        <div>
          <label className="label">নাম</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input input-bordered w-full"
            placeholder="রেজওয়ান আহমেদ"
          />
        </div>
        <div>
          <label className="label">ইমেইল</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input input-bordered w-full"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">পাসওয়ার্ড</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input input-bordered w-full"
            placeholder="কমপক্ষে ৮ অক্ষর"
          />
        </div>
        <div>
          <label className="label">পাসওয়ার্ড নিশ্চিত করুন</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="input input-bordered w-full"
            placeholder="আবার লিখুন"
          />
        </div>
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <span className="loading loading-spinner" />
          ) : (
            "অ্যাকাউন্ট তৈরি করুন"
          )}
        </button>
        <div className="divider text-xs">অথবা</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => social("google")}
            className="btn btn-outline btn-sm"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => social("github")}
            className="btn btn-outline btn-sm"
          >
            GitHub
          </button>
        </div>
        <p className="text-center text-sm">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="link link-primary">
            সাইন ইন করুন
          </Link>
        </p>
      </form>
      <div className="text-center mt-6">
        <Link href="/" className="link link-hover text-sm">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}