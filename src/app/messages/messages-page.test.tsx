import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MessagesPage from "./page";

// Mock the AuthProvider
const mockUser = { id: "user-1", email: "test@example.com" };
vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({ user: mockUser, loading: false, signOut: vi.fn() }),
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

describe("MessagesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page heading", () => {
    render(<MessagesPage />);
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("shows empty state message when there are no messages", () => {
    render(<MessagesPage />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
  });
});
