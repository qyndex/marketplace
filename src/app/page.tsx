import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";

export default async function MarketplacePage() {
  const listings = await prisma.listing.findMany({
    where: { status: "active" },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </main>
  );
}
