"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn.email({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "সাইন ইন ব্যর্থ হয়েছে");
    } else {
      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.push(redirect);
      router.refresh();
    }
  };

  const social = async (provider: "google" | "github") => {
    await signIn.social({ provider, callbackURL: redirect });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-2">সাইন ইন</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
      </p>
      <form
        onSubmit={submit}
        className="card bg-white rounded-2xl shadow-sm p-6 space-y-4"
      >
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
        <button
          disabled={loading}
          className="btn w-full bg-green-600 hover:bg-green-700 text-white border-0"
        >
          {loading ? <span className="loading loading-spinner" /> : "সাইন ইন"}
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
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="link link-primary">
            সাইন আপ করুন
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="card bg-white rounded-2xl shadow-sm p-6">
            <div className="skeleton h-8 w-32 mx-auto mb-4" />
            <div className="skeleton h-12 w-full mb-4" />
            <div className="skeleton h-12 w-full mb-4" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}