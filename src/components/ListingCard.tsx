interface Props {
  listing: { id: string; title: string; price: number; description: string };
}

export default function ListingCard({ listing }: Props) {
  return (
    <a href={`/listings/${listing.id}`} className="border rounded-lg p-4 hover:shadow-md">
      <h3 className="font-semibold">{listing.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{listing.description}</p>
      <p className="mt-2 font-bold">${listing.price}</p>
    </a>
  );
}
