import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ListingCard from "./ListingCard";
import type { Listing } from "@/types/database";

const baseListing: Listing = {
  id: "listing-1",
  seller_id: "seller-1",
  title: "Vintage Camera",
  price: 149.99,
  description: "A beautiful 1970s film camera in excellent condition.",
  category: "electronics",
  image_urls: ["https://example.com/camera.jpg"],
  status: "active",
  created_at: "2024-01-01T00:00:00Z",
};

describe("ListingCard", () => {
  it("renders the listing title", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByText("Vintage Camera")).toBeInTheDocument();
  });

  it("renders the formatted price", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByText("$149.99")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<ListingCard listing={baseListing} />);
    expect(
      screen.getByText("A beautiful 1970s film camera in excellent condition.")
    ).toBeInTheDocument();
  });

  it("links to the correct listing detail page", () => {
    render(<ListingCard listing={baseListing} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/listings/listing-1");
  });

  it("renders the category label", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  it("renders as an accessible link with discernible text", () => {
    render(<ListingCard listing={baseListing} />);
    const link = screen.getByRole("link", { name: /Vintage Camera/i });
    expect(link).toBeInTheDocument();
  });

  it("handles zero price without crashing", () => {
    render(<ListingCard listing={{ ...baseListing, price: 0 }} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("handles a very long description without error", () => {
    const longDesc = "x".repeat(500);
    render(<ListingCard listing={{ ...baseListing, description: longDesc }} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("shows 'No image' placeholder when image_urls is empty", () => {
    render(<ListingCard listing={{ ...baseListing, image_urls: [] }} />);
    expect(screen.getByText("No image")).toBeInTheDocument();
  });
});
