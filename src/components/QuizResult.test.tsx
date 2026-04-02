import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizResult } from "./QuizResult";
import { PASSING_SCORE, QUIZ_QUESTIONS } from "../lib/score";

function renderResult(score: number, overrides: Partial<React.ComponentProps<typeof QuizResult>> = {}) {
  const onRetry = vi.fn();
  render(
    <QuizResult
      levelId={1}
      levelTitle="Grammar basics"
      score={score}
      onRetry={onRetry}
      {...overrides}
    />
  );
  return { onRetry };
}

// ── Pass / fail status ───────────────────────────────────────────────────────

describe("pass / fail status", () => {
  it("shows 'ผ่าน' when score equals the passing threshold", () => {
    renderResult(PASSING_SCORE); // 3
    expect(screen.getByTestId("result-status")).toHaveTextContent("ผ่าน");
  });

  it("shows 'ผ่าน' when score is above the passing threshold", () => {
    renderResult(4);
    expect(screen.getByTestId("result-status")).toHaveTextContent("ผ่าน");
  });

  it("shows 'ผ่าน' for a perfect score", () => {
    renderResult(QUIZ_QUESTIONS); // 5
    expect(screen.getByTestId("result-status")).toHaveTextContent("ผ่าน");
  });

  it("shows 'ไม่ผ่าน' when score is below the passing threshold", () => {
    renderResult(PASSING_SCORE - 1); // 2
    expect(screen.getByTestId("result-status")).toHaveTextContent("ไม่ผ่าน");
  });

  it("shows 'ไม่ผ่าน' for a zero score", () => {
    renderResult(0);
    expect(screen.getByTestId("result-status")).toHaveTextContent("ไม่ผ่าน");
  });

  it("result icon has data-passed=true when passed", () => {
    renderResult(3);
    expect(screen.getByTestId("result-icon")).toHaveAttribute("data-passed", "true");
  });

  it("result icon has data-passed=false when failed", () => {
    renderResult(2);
    expect(screen.getByTestId("result-icon")).toHaveAttribute("data-passed", "false");
  });
});

// ── Score display ────────────────────────────────────────────────────────────

describe("score display", () => {
  it("shows the correct score out of 5", () => {
    renderResult(4);
    expect(screen.getByTestId("result-score")).toHaveTextContent("4 / 5");
  });

  it("shows '0 / 5' for a zero score", () => {
    renderResult(0);
    expect(screen.getByTestId("result-score")).toHaveTextContent("0 / 5");
  });

  it("shows '5 / 5' for a perfect score", () => {
    renderResult(5);
    expect(screen.getByTestId("result-score")).toHaveTextContent("5 / 5");
  });
});

// ── Star rating ──────────────────────────────────────────────────────────────

describe("star rating", () => {
  function getFilledStars() {
    return screen
      .getAllByTestId(/^star-\d$/)
      .filter((s) => s.getAttribute("data-filled") === "true");
  }

  it("shows 3 filled stars for a perfect score (5/5)", () => {
    renderResult(5);
    expect(getFilledStars()).toHaveLength(3);
  });

  it("shows 2 filled stars for a passing score (3/5)", () => {
    renderResult(3);
    expect(getFilledStars()).toHaveLength(2);
  });

  it("shows 2 filled stars for score 4/5", () => {
    renderResult(4);
    expect(getFilledStars()).toHaveLength(2);
  });

  it("shows 1 filled star for score 1/5", () => {
    renderResult(1);
    expect(getFilledStars()).toHaveLength(1);
  });

  it("shows 1 filled star for score 2/5", () => {
    renderResult(2);
    expect(getFilledStars()).toHaveLength(1);
  });

  it("shows 0 filled stars for a zero score", () => {
    renderResult(0);
    expect(getFilledStars()).toHaveLength(0);
  });

  it("always renders exactly 3 star elements", () => {
    renderResult(3);
    expect(screen.getAllByTestId(/^star-\d$/)).toHaveLength(3);
  });
});

// ── Level heading ────────────────────────────────────────────────────────────

describe("level heading", () => {
  it("shows the level ID and title in the heading", () => {
    renderResult(3, { levelId: 4, levelTitle: "Advanced" });
    expect(screen.getByText("ด่าน 4: Advanced")).toBeInTheDocument();
  });
});

// ── Retry button ─────────────────────────────────────────────────────────────

describe("retry button", () => {
  it("renders a retry button with Thai label", () => {
    renderResult(3);
    expect(screen.getByTestId("button-retry")).toHaveTextContent("ลองใหม่");
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const { onRetry } = renderResult(2);
    await user.click(screen.getByTestId("button-retry"));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("retry button is shown regardless of pass/fail", () => {
    renderResult(5); // pass
    expect(screen.getByTestId("button-retry")).toBeInTheDocument();
  });
});
