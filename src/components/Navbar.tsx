"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600" aria-label="Marketplace home">
          Marketplace
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" aria-hidden="true" />
          ) : user ? (
            <>
              <Link
                href="/listings/new"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                aria-label="Create new listing"
              >
                Sell
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
                aria-label="Your dashboard"
              >
                Dashboard
              </Link>
              <Link
                href="/orders"
                className="text-sm text-gray-600 hover:text-gray-900"
                aria-label="Your orders"
              >
                Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-900"
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                aria-label="Create a new account"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
