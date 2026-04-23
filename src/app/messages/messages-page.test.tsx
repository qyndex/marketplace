import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MessagesPage from "./page";

describe("MessagesPage", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the page heading", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    render(<MessagesPage />);
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("renders a list of messages returned from the API", async () => {
    const messages = [
      {
        id: "msg-1",
        body: "Hello, is this still available?",
        senderId: "user-a",
        createdAt: "2024-01-01T12:00:00Z",
      },
      {
        id: "msg-2",
        body: "Yes, DM me for details.",
        senderId: "user-b",
        createdAt: "2024-01-01T12:05:00Z",
      },
    ];

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(messages), { status: 200 })
    );

    render(<MessagesPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Hello, is this still available?")
      ).toBeInTheDocument();
      expect(screen.getByText("Yes, DM me for details.")).toBeInTheDocument();
    });
  });

  it("renders an empty list gracefully when there are no messages", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    render(<MessagesPage />);
    // Heading still renders; no message rows expected
    await waitFor(() => {
      expect(screen.getByText("Messages")).toBeInTheDocument();
    });
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("fetches from /api/messages on mount", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );
    render(<MessagesPage />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/messages");
    });
  });
});
