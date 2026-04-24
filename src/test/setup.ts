import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Mock next/navigation for components that use useRouter / useSearchParams
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock next/font/google — it performs network calls at build time
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
}));

// Mock next/link — renders a plain <a> tag
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) =>
    React.createElement("a", { href, ...props }, children),
}));
