import { describe, it, expect } from "vitest";
import {
  getStarRating,
  getDefaultStarRating,
  QUIZ_QUESTIONS,
  PASSING_SCORE,
} from "./score";

describe("getStarRating", () => {
  const total = QUIZ_QUESTIONS; // 5
  const passing = PASSING_SCORE; // 3

  it("returns 3 stars for a perfect score", () => {
    expect(getStarRating(5, total, passing)).toBe(3);
  });

  it("returns 2 stars when score equals the passing threshold", () => {
    expect(getStarRating(3, total, passing)).toBe(2);
  });

  it("returns 2 stars when score is above passing but below perfect", () => {
    expect(getStarRating(4, total, passing)).toBe(2);
  });

  it("returns 1 star when score is below passing but at least 1", () => {
    expect(getStarRating(1, total, passing)).toBe(1);
    expect(getStarRating(2, total, passing)).toBe(1);
  });

  it("returns 0 stars for a zero score", () => {
    expect(getStarRating(0, total, passing)).toBe(0);
  });

  it("boundary: perfect score wins over passing (score === total === passing)", () => {
    // When total equals passing the perfect-score branch wins
    expect(getStarRating(3, 3, 3)).toBe(3);
  });

  it("works with custom total and passing values", () => {
    // 10-question quiz, 6 to pass
    expect(getStarRating(10, 10, 6)).toBe(3);
    expect(getStarRating(8, 10, 6)).toBe(2);
    expect(getStarRating(6, 10, 6)).toBe(2);
    expect(getStarRating(3, 10, 6)).toBe(1);
    expect(getStarRating(0, 10, 6)).toBe(0);
  });
});

describe("getDefaultStarRating", () => {
  it("uses QUIZ_QUESTIONS=5 and PASSING_SCORE=3 as defaults", () => {
    expect(getDefaultStarRating(5)).toBe(3);
    expect(getDefaultStarRating(4)).toBe(2);
    expect(getDefaultStarRating(3)).toBe(2);
    expect(getDefaultStarRating(2)).toBe(1);
    expect(getDefaultStarRating(1)).toBe(1);
    expect(getDefaultStarRating(0)).toBe(0);
  });

  it("covers every possible quiz outcome (0–5 correct answers)", () => {
    const results = [0, 1, 2, 3, 4, 5].map(getDefaultStarRating);
    expect(results).toEqual([0, 1, 1, 2, 2, 3]);
  });
});
