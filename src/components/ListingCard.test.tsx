import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ListingCard from "./ListingCard";

const baseListing = {
  id: "listing-1",
  title: "Vintage Camera",
  price: 149.99,
  description: "A beautiful 1970s film camera in excellent condition.",
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

  it("renders as an accessible link with discernible text", () => {
    render(<ListingCard listing={baseListing} />);
    // The anchor wraps meaningful content so an accessible name is derivable
    const link = screen.getByRole("link", { name: /Vintage Camera/i });
    expect(link).toBeInTheDocument();
  });

  it("handles zero price without crashing", () => {
    render(<ListingCard listing={{ ...baseListing, price: 0 }} />);
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("handles a very long description without error", () => {
    const longDesc = "x".repeat(500);
    render(<ListingCard listing={{ ...baseListing, description: longDesc }} />);
    // Component uses line-clamp-2 but must still render without throwing
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
