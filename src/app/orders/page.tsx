"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { OrderWithDetails } from "@/types/database";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*, listings(*), profiles(*)")
        .eq("buyer_id", user!.id)
        .order("created_at", { ascending: false });

      setOrders((data ?? []) as unknown as OrderWithDetails[]);
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (authLoading) {
    return (
      <main className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto p-8 text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Sign in to view orders</h1>
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No orders yet</p>
          <p className="text-sm mt-1">
            Browse the{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              marketplace
            </Link>{" "}
            to find something you like
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/listings/${order.listing_id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {order.listings?.title ?? "Unknown item"}
                  </Link>
                  <p className="text-lg font-bold mt-1">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Ordered {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
