import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";
import { createServerClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/database";

interface PageProps {
  searchParams: { category?: string };
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const supabase = createServerClient();

  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20);

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data: listings, error } = await query;

  if (error) {
    console.error("Failed to load listings:", error.message);
  }

  const typedListings: Listing[] = listings ?? [];

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
      <p className="text-gray-500 mb-6">
        Discover unique items from trusted sellers
      </p>
      <SearchBar />
      <CategoryFilter activeCategory={searchParams.category} />
      {typedListings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No listings found</p>
          <p className="text-sm mt-1">Try a different category or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {typedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
