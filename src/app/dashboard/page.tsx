"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { Listing, Order } from "@/types/database";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [sales, setSales] = useState<(Order & { listings: Listing })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchDashboard() {
      setLoading(true);

      // Fetch user's listings
      const { data: listingsData } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });

      setListings((listingsData ?? []) as Listing[]);

      // Fetch orders for user's listings (sales)
      const { data: salesData } = await supabase
        .from("orders")
        .select("*, listings(*)")
        .in(
          "listing_id",
          (listingsData ?? []).map((l) => l.id)
        )
        .order("created_at", { ascending: false });

      setSales((salesData ?? []) as (Order & { listings: Listing })[]);
      setLoading(false);
    }

    fetchDashboard();
  }, [user]);

  if (authLoading) {
    return (
      <main className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto p-8 text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Sign in to view your dashboard</h1>
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const activeListings = listings.filter((l) => l.status === "active");
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Listings</p>
          <p className="text-2xl font-bold">{activeListings.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">{sales.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <Link
          href="/listings/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          aria-label="Create a new listing"
        >
          + New Listing
        </Link>
      </div>

      {/* Listings */}
      <section aria-label="Your listings">
        <h2 className="text-lg font-bold mb-4">Your Listings</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t created any listings yet.</p>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    ${Number(listing.price).toFixed(2)} &middot;{" "}
                    <span
                      className={
                        listing.status === "active"
                          ? "text-green-600"
                          : listing.status === "sold"
                            ? "text-red-600"
                            : "text-gray-400"
                      }
                    >
                      {listing.status}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(listing.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Sales */}
      {sales.length > 0 && (
        <section className="mt-8" aria-label="Recent sales">
          <h2 className="text-lg font-bold mb-4">Recent Sales</h2>
          <div className="space-y-3">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium">{sale.listings?.title ?? "Unknown item"}</p>
                  <p className="text-sm text-gray-500">
                    ${Number(sale.total).toFixed(2)} &middot; {sale.status}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(sale.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
