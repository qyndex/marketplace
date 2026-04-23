"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";

interface Props {
  listingId: string;
  price: number;
}

export default function BuyButton({ listingId, price }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBuy = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: orderError } = await supabase.from("orders").insert({
      buyer_id: user.id,
      listing_id: listingId,
      status: "pending",
      total: price,
    });

    if (orderError) {
      setError(orderError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        Order placed! <a href="/orders" className="underline font-medium">View your orders</a>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={`Buy this item for $${price.toFixed(2)}`}
      >
        {loading ? "Placing order..." : `Buy Now — $${price.toFixed(2)}`}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
