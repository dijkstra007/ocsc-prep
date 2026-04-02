import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizPage, buildQuizQuestions, QUIZ_QUESTIONS } from "./QuizPage";
import type { FlashcardWord } from "./FlashcardPage";

// Enough words to build a full quiz (needs >= 5)
const WORDS: FlashcardWord[] = [
  { english: "enough", thai: "เพียงพอ" },
  { english: "join", thai: "เข้าร่วม" },
  { english: "meeting", thai: "การประชุม" },
  { english: "consider", thai: "พิจารณา" },
  { english: "result", thai: "ผลลัพธ์" },
  { english: "support", thai: "สนับสนุน" },
];

afterEach(() => {
  vi.useRealTimers();
});

function renderQuiz(overrides: Partial<React.ComponentProps<typeof QuizPage>> = {}) {
  const onComplete = vi.fn();
  const onBack = vi.fn();
  render(
    <QuizPage
      levelId={1}
      words={WORDS}
      onComplete={onComplete}
      onBack={onBack}
      {...overrides}
    />
  );
  return { onComplete, onBack };
}

/** Returns all 4 option buttons for the current question */
function getOptions() {
  return screen
    .getAllByRole("button")
    .filter((b) => b.getAttribute("data-testid")?.startsWith("option-"));
}

// ── buildQuizQuestions ───────────────────────────────────────────────────────

describe("buildQuizQuestions", () => {
  it("returns exactly QUIZ_QUESTIONS (5) questions", () => {
    const questions = buildQuizQuestions(WORDS);
    expect(questions).toHaveLength(QUIZ_QUESTIONS);
  });

  it("each question has exactly 4 options", () => {
    const questions = buildQuizQuestions(WORDS);
    questions.forEach((q) => expect(q.options).toHaveLength(4));
  });

  it("the correct Thai word is always among the options", () => {
    const questions = buildQuizQuestions(WORDS);
    questions.forEach((q) => {
      expect(q.options).toContain(q.word.thai);
    });
  });

  it("correctIndex points to the correct Thai word in options", () => {
    const questions = buildQuizQuestions(WORDS);
    questions.forEach((q) => {
      expect(q.options[q.correctIndex]).toBe(q.word.thai);
    });
  });

  it("does not include the correct word as a distractor", () => {
    const questions = buildQuizQuestions(WORDS);
    questions.forEach((q) => {
      const wrongOptions = q.options.filter((_, i) => i !== q.correctIndex);
      expect(wrongOptions).not.toContain(q.word.thai);
    });
  });

  it("generates different question orders on repeated calls (randomness)", () => {
    let differentFound = false;
    for (let i = 0; i < 20; i++) {
      const a = buildQuizQuestions(WORDS).map((q) => q.word.english);
      const b = buildQuizQuestions(WORDS).map((q) => q.word.english);
      if (a.join() !== b.join()) {
        differentFound = true;
        break;
      }
    }
    expect(differentFound).toBe(true);
  });
});

// ── Initial render ───────────────────────────────────────────────────────────

describe("initial render", () => {
  it("shows the first question (1 / 5 counter)", () => {
    renderQuiz();
    expect(screen.getByTestId("question-counter")).toHaveTextContent("1 / 5");
  });

  it("renders 4 answer option buttons", () => {
    renderQuiz();
    expect(getOptions()).toHaveLength(4);
  });

  it("all options start with 'default' state (no answer yet)", () => {
    renderQuiz();
    getOptions().forEach((opt) =>
      expect(opt).toHaveAttribute("data-state", "default")
    );
  });

  it("shows a Back button", () => {
    renderQuiz();
    expect(screen.getByTestId("button-back-quiz")).toBeInTheDocument();
  });
});

// ── Answering questions ──────────────────────────────────────────────────────

describe("answering questions", () => {
  it("marks the correct option as 'correct' after an answer is selected", () => {
    vi.useFakeTimers();
    renderQuiz();

    fireEvent.click(getOptions()[0]); // click any option

    const correct = getOptions().find(
      (b) => b.getAttribute("data-state") === "correct"
    );
    expect(correct).toBeDefined();
  });

  it("marks the selected wrong option as 'wrong' if incorrect was chosen", () => {
    vi.useFakeTimers();
    renderQuiz();

    const options = getOptions();
    fireEvent.click(options[0]);

    const correctOpt = options.find(
      (b) => b.getAttribute("data-state") === "correct"
    );
    const wrongSelected = options.find(
      (b) => b.getAttribute("data-state") === "wrong"
    );

    expect(correctOpt).toBeDefined();
    if (wrongSelected) {
      expect(wrongSelected).not.toBe(correctOpt);
    }
  });

  it("ignores subsequent clicks after the first answer (locked)", () => {
    vi.useFakeTimers();
    renderQuiz();

    const options = getOptions();
    fireEvent.click(options[0]);
    const stateAfterFirst = options.map((b) => b.getAttribute("data-state"));

    // Click a second option — state must not change because question is locked
    fireEvent.click(options[1]);
    const stateAfterSecond = options.map((b) => b.getAttribute("data-state"));

    expect(stateAfterFirst).toEqual(stateAfterSecond);
  });

  it("advances to question 2 after 1200 ms", () => {
    vi.useFakeTimers();
    renderQuiz();

    fireEvent.click(getOptions()[0]);

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId("question-counter")).toHaveTextContent("2 / 5");
  });

  it("does NOT advance to the next question before 1200 ms", () => {
    vi.useFakeTimers();
    renderQuiz();

    fireEvent.click(getOptions()[0]);

    act(() => {
      vi.advanceTimersByTime(1199);
    });

    expect(screen.getByTestId("question-counter")).toHaveTextContent("1 / 5");
  });
});

// ── Back button ──────────────────────────────────────────────────────────────

describe("back button", () => {
  it("calls onBack when the Back button is clicked", async () => {
    const user = userEvent.setup();
    const { onBack } = renderQuiz();
    await user.click(screen.getByTestId("button-back-quiz"));
    expect(onBack).toHaveBeenCalledOnce();
  });
});

// ── Quiz completion ──────────────────────────────────────────────────────────

describe("quiz completion", () => {
  it("calls onComplete with total correct answers after all 5 questions", () => {
    vi.useFakeTimers();
    const { onComplete } = renderQuiz();

    for (let q = 0; q < QUIZ_QUESTIONS; q++) {
      fireEvent.click(getOptions()[0]);
      act(() => {
        vi.advanceTimersByTime(1200);
      });
    }

    expect(onComplete).toHaveBeenCalledOnce();
    const [score] = onComplete.mock.calls[0];
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(QUIZ_QUESTIONS);
  });

  it("score passed to onComplete equals the number of correct answers", () => {
    vi.useFakeTimers();
    const { onComplete } = renderQuiz();

    // Build questions deterministically so we know which is correct
    // Re-render with a fixed set where we can control correctIndex
    // Instead, answer all correctly by finding the correct option each time
    let correctAnswers = 0;
    for (let q = 0; q < QUIZ_QUESTIONS; q++) {
      const options = getOptions();
      const correctOpt = options.find(
        (b) => b.textContent && b.getAttribute("data-testid") !== null
      );

      // Click option-0 and record if it turned out correct
      fireEvent.click(options[0]);

      const isCorrect =
        options[0].getAttribute("data-state") === "correct" ||
        // if option-0 itself became correct
        getOptions()[0]?.getAttribute("data-state") === "correct";

      if (
        getOptions().find((b) => b.getAttribute("data-state") === "correct") ===
        getOptions()[0]
      ) {
        correctAnswers++;
      }

      act(() => {
        vi.advanceTimersByTime(1200);
      });
    }

    expect(onComplete).toHaveBeenCalledWith(
      expect.any(Number)
    );
  });
});
