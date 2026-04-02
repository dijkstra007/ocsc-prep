import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashcardPage, type FlashcardWord } from "./FlashcardPage";

const WORDS: FlashcardWord[] = [
  { english: "enough", thai: "เพียงพอ" },
  { english: "join", thai: "เข้าร่วม" },
  { english: "meeting", thai: "การประชุม" },
];

function renderPage(overrides: Partial<React.ComponentProps<typeof FlashcardPage>> = {}) {
  const onStartQuiz = vi.fn();
  render(
    <FlashcardPage
      levelId={1}
      levelTitle="ด่าน 1"
      levelSubtitle="Grammar basics"
      words={WORDS}
      onStartQuiz={onStartQuiz}
      {...overrides}
    />
  );
  return { onStartQuiz };
}

// ── Initial render ───────────────────────────────────────────────────────────

describe("initial render", () => {
  it("shows the first card's English side by default", () => {
    renderPage();
    expect(screen.getByTestId("card-front")).toHaveTextContent("enough");
    expect(screen.queryByTestId("card-back")).not.toBeInTheDocument();
  });

  it("shows '1 / 3' counter on the first card", () => {
    renderPage();
    expect(screen.getByTestId("card-counter")).toHaveTextContent("1 / 3");
  });

  it("disables the Previous button on the first card", () => {
    renderPage();
    expect(screen.getByTestId("button-prev")).toBeDisabled();
  });

  it("enables the Next button on the first card", () => {
    renderPage();
    expect(screen.getByTestId("button-next")).not.toBeDisabled();
  });

  it("does NOT show the Start Quiz button until the last card", () => {
    renderPage();
    expect(screen.queryByTestId("button-start-quiz")).not.toBeInTheDocument();
  });

  it("renders the level title", () => {
    renderPage();
    expect(screen.getByText("ด่าน 1")).toBeInTheDocument();
  });
});

// ── Card flipping ────────────────────────────────────────────────────────────

describe("card flipping", () => {
  it("reveals the Thai side when the card is clicked", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("flashcard"));
    expect(screen.getByTestId("card-back")).toHaveTextContent("เพียงพอ");
    expect(screen.queryByTestId("card-front")).not.toBeInTheDocument();
  });

  it("flips back to English when clicked a second time", async () => {
    const user = userEvent.setup();
    renderPage();
    const card = screen.getByTestId("flashcard");
    await user.click(card);
    await user.click(card);
    expect(screen.getByTestId("card-front")).toHaveTextContent("enough");
  });

  it("flips the card when Space is pressed", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.keyboard(" ");
    expect(screen.getByTestId("card-back")).toBeInTheDocument();
  });

  it("flips the card when Enter is pressed", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("card-back")).toBeInTheDocument();
  });
});

// ── Navigation ───────────────────────────────────────────────────────────────

describe("navigation", () => {
  it("advances to the next card when Next is clicked", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("button-next"));
    expect(screen.getByTestId("card-front")).toHaveTextContent("join");
    expect(screen.getByTestId("card-counter")).toHaveTextContent("2 / 3");
  });

  it("goes back to the previous card when Previous is clicked", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("button-next"));
    await user.click(screen.getByTestId("button-prev"));
    expect(screen.getByTestId("card-front")).toHaveTextContent("enough");
    expect(screen.getByTestId("card-counter")).toHaveTextContent("1 / 3");
  });

  it("resets the flip when navigating to the next card", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("flashcard")); // flip to Thai
    await user.click(screen.getByTestId("button-next")); // advance
    expect(screen.getByTestId("card-front")).toBeInTheDocument(); // back to English side
  });

  it("navigates with ArrowRight keyboard shortcut", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("card-counter")).toHaveTextContent("2 / 3");
  });

  it("navigates with ArrowLeft keyboard shortcut", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("button-next")); // go to card 2
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByTestId("card-counter")).toHaveTextContent("1 / 3");
  });
});

// ── Last card behaviour ──────────────────────────────────────────────────────

describe("last card", () => {
  beforeEach(async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("button-next")); // card 2
    await user.click(screen.getByTestId("button-next")); // card 3 (last)
  });

  it("shows the Start Quiz button on the last card", () => {
    expect(screen.getByTestId("button-start-quiz")).toBeInTheDocument();
  });

  it("disables the Next button on the last card", () => {
    expect(screen.getByTestId("button-next")).toBeDisabled();
  });

  it("enables the Previous button on the last card", () => {
    expect(screen.getByTestId("button-prev")).not.toBeDisabled();
  });

  it("calls onStartQuiz when the Start Quiz button is clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByTestId("button-start-quiz");
    const handler = vi.fn();
    button.addEventListener("click", handler);
    await user.click(button);
    expect(handler).toHaveBeenCalledOnce();
  });
});

// ── Progress bar ─────────────────────────────────────────────────────────────

describe("progress bar", () => {
  it("starts at ~33% on the first of three cards", () => {
    renderPage();
    const bar = screen.getByTestId("progress-bar");
    expect(bar).toHaveAttribute("aria-valuenow", "33.33333333333333");
  });

  it("reaches 100% on the last card", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("button-next"));
    await user.click(screen.getByTestId("button-next"));
    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
  });
});

// ── Edge cases ───────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("renders nothing when words array is empty", () => {
    const { container } = render(
      <FlashcardPage
        levelId={1}
        levelTitle="Empty"
        levelSubtitle=""
        words={[]}
        onStartQuiz={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows both Prev disabled and Start Quiz button for a single-card deck", () => {
    render(
      <FlashcardPage
        levelId={1}
        levelTitle="Single"
        levelSubtitle=""
        words={[{ english: "only", thai: "เดียว" }]}
        onStartQuiz={vi.fn()}
      />
    );
    expect(screen.getByTestId("button-prev")).toBeDisabled();
    expect(screen.getByTestId("button-next")).toBeDisabled();
    expect(screen.getByTestId("button-start-quiz")).toBeInTheDocument();
  });
});
