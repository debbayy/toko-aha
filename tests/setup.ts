// Menambahkan matcher seperti `toBeInTheDocument()` ke `expect`.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Bersihkan DOM setelah setiap test agar test tidak saling mempengaruhi.
afterEach(() => {
  cleanup();
});
