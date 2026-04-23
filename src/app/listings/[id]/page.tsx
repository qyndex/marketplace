import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import type { ListingWithSeller, ReviewWithReviewer } from "@/types/database";
import { CATEGORY_LABELS } from "@/types/database";
import BuyButton from "@/components/BuyButton";

interface Props {
  params: { id: string };
}

export default async function ListingDetail({ params }: Props) {
  const supabase = createServerClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("id", params.id)
    .single();

  if (error || !listing) return notFound();

  const typedListing = listing as unknown as ListingWithSeller;

  // Fetch reviews for this listing (via orders)
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("listing_id", params.id);

  let reviews: ReviewWithReviewer[] = [];
  if (orders && orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*, profiles(*)")
      .in("order_id", orderIds)
      .order("created_at", { ascending: false });
    reviews = (reviewData ?? []) as unknown as ReviewWithReviewer[];
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const imageUrl = typedListing.image_urls?.[0];

  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link href="/" className="text-blue-600 hover:underline text-sm" aria-label="Back to listings">
        &larr; Back to listings
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={typedListing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {CATEGORY_LABELS[typedListing.category] ?? typedListing.category}
          </span>
          <h1 className="text-2xl font-bold mt-1">{typedListing.title}</h1>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${Number(typedListing.price).toFixed(2)}
          </p>

          {typedListing.status === "sold" && (
            <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              Sold
            </span>
          )}

          <p className="text-gray-600 mt-4 leading-relaxed">{typedListing.description}</p>

          {typedListing.status === "active" && (
            <BuyButton listingId={typedListing.id} price={Number(typedListing.price)} />
          )}

          {/* Seller info */}
          {typedListing.profiles && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">Seller</p>
              <p className="font-semibold">{typedListing.profiles.full_name ?? "Anonymous"}</p>
              {typedListing.profiles.bio && (
                <p className="text-sm text-gray-600 mt-1">{typedListing.profiles.bio}</p>
              )}
            </div>
          )}

          {/* Rating summary */}
          {avgRating !== null && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-yellow-500" aria-hidden="true">
                {"★".repeat(Math.round(avgRating))}
                {"☆".repeat(5 - Math.round(avgRating))}
              </span>
              <span className="text-sm text-gray-600">
                {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      {reviews.length > 0 && (
        <section className="mt-12" aria-label="Reviews">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.profiles?.full_name ?? "Anonymous"}</p>
                  <span className="text-yellow-500 text-sm" aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
