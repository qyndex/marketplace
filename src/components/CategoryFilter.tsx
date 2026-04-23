"use client";

import Link from "next/link";
import { CATEGORY_LABELS, type ListingCategory } from "@/types/database";

interface Props {
  activeCategory?: string;
}

const categories = Object.entries(CATEGORY_LABELS) as [ListingCategory, string][];

export default function CategoryFilter({ activeCategory }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-4" role="navigation" aria-label="Category filter">
      <Link
        href="/"
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-current={!activeCategory ? "page" : undefined}
      >
        All
      </Link>
      {categories.map(([value, label]) => (
        <Link
          key={value}
          href={`/?category=${value}`}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-current={activeCategory === value ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
