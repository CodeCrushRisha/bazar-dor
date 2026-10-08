"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending)
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="skeleton h-40 w-full" />
      </div>
    );
  if (!session) return null;

  const logout = async () => {
    await signOut();
    toast.success("সাইন আউট হয়েছে");
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="text-sm text-gray-500 mb-6">
        আপনার অ্যাকাউন্ট তথ্য এখানে দেখুন।
      </p>

      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body flex-row items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16">
              <span className="text-2xl">{session.user.name?.[0] ?? "U"}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg">{session.user.name}</div>
            <div className="text-sm text-gray-500">{session.user.email}</div>
          </div>
          <button
            onClick={logout}
            className="btn btn-outline btn-error btn-sm"
          >
            সাইন আউট
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="font-bold mb-2">তথ্য</h2>
          <Link href="/profile/update" className="btn btn-primary">
            আপডেট
          </Link>
        </div>
      </div>
    </div>
  );
}