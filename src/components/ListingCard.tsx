import Link from "next/link";
import type { Listing } from "@/types/database";
import { CATEGORY_LABELS } from "@/types/database";

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const imageUrl = listing.image_urls?.[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
    >
      {imageUrl ? (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {CATEGORY_LABELS[listing.category] ?? listing.category}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{listing.description}</p>
        <p className="mt-2 text-lg font-bold text-gray-900">
          ${Number(listing.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
