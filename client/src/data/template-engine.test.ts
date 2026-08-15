import { describe, expect, it } from "vitest";
import { makeChoices, templateGenerators } from "./template-engine";

describe("makeChoices", () => {
  it("returns four unique numeric choices including the correct answer", () => {
    for (let i = 0; i < 30; i++) {
      const [choices, index] = makeChoices(10, 4);
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices[index]).toBe("10");
    }
  });

  it("still completes when the correct answer is small", () => {
    const [choices, index] = makeChoices(1, 2);
    expect(choices).toHaveLength(4);
    expect(new Set(choices).size).toBe(4);
    expect(choices[index]).toBe("1");
  });
});

describe("template generators", () => {
  it("each generator returns a valid question", () => {
    for (const gen of templateGenerators) {
      for (let i = 0; i < 5; i++) {
        const q = gen.generate();
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(4);
        expect(q.explanation.length).toBeGreaterThan(0);
        expect(q.question.length).toBeGreaterThan(0);
      }
    }
  });
});
