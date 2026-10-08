"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user.name ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    const { error } = await updateUser({ name });
    setLoading(false);
    if (error) toast.error(error.message ?? "আপডেট ব্যর্থ");
    else {
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">তথ্য আপডেট করুন</h1>
      <form
        onSubmit={submit}
        className="card bg-base-100 shadow-sm p-6 space-y-4"
      >
        <div>
          <label className="label">নাম</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <span className="loading loading-spinner" />
          ) : (
            "তথ্য আপডেট করুন"
          )}
        </button>
      </form>
    </div>
  );
}