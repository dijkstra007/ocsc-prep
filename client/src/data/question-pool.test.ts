import { describe, expect, it } from "vitest";
import { questionPools } from "./question-pool";

describe("question pool invariants", () => {
  const keys = new Set<string>();

  for (const pool of questionPools) {
    describe(pool.topic, () => {
      it("has questions", () => {
        expect(pool.questions.length).toBeGreaterThan(0);
      });

      it("meets size targets for thin topics", () => {
        if (pool.topic === "Reading") expect(pool.questions.length).toBeGreaterThanOrEqual(15);
        if (pool.topic === "กฎหมาย+จริยธรรม") expect(pool.questions.length).toBeGreaterThanOrEqual(40);
        if (pool.topic === "บทความ (ไทย)" || pool.topic === "การใช้ภาษาไทย" || pool.topic === "การเรียงประโยค") {
          expect(pool.questions.length).toBeGreaterThanOrEqual(12);
        }
      });

      it("has four unique choices, valid answers, explanations, and unique poolKeys", () => {
        for (const q of pool.questions) {
          expect(q.choices, q.question).toHaveLength(4);
          expect(new Set(q.choices).size, q.question).toBe(4);
          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(q.answer).toBeLessThan(4);
          expect(q.explanation.trim().length).toBeGreaterThan(0);
          expect(q.poolKey).toBeTruthy();
          expect(keys.has(q.poolKey!)).toBe(false);
          keys.add(q.poolKey!);
        }
      });
    });
  }
});
