import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) return notFound();

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="text-gray-600 mt-2">{listing.description}</p>
      <p className="text-xl font-semibold mt-4">${listing.price}</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Buy Now
      </button>
    </main>
  );
}
