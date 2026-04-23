import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import { createServerClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/database";

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q ?? "";
  const supabase = createServerClient();

  let results: Listing[] = [];

  if (query.trim()) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      results = data as Listing[];
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <Link href="/" className="text-blue-600 hover:underline text-sm" aria-label="Back to listings">
        &larr; Back
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-4">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <SearchBar />

      {query && results.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No results found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try different keywords or browse all listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
