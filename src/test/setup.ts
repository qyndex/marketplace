import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next/navigation for components that use useRouter / useSearchParams
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock next/font/google — it performs network calls at build time
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
}));
