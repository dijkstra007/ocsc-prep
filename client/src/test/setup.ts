import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  window.localStorage.clear();
});
