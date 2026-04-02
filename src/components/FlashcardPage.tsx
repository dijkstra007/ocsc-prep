import { useState, useEffect, useCallback } from "react";

export interface FlashcardWord {
  english: string;
  thai: string;
}

export interface FlashcardPageProps {
  levelId: number;
  levelTitle: string;
  levelSubtitle: string;
  words: FlashcardWord[];
  onStartQuiz: () => void;
}

export function FlashcardPage({
  levelTitle,
  words,
  onStartQuiz,
}: FlashcardPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const total = words.length;
  const current = words[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, total]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d") goNext();
      else if (e.key === "ArrowLeft" || e.key === "a") goPrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, flip]);

  if (!current) return null;

  return (
    <div>
      <h1>{levelTitle}</h1>

      <div
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        data-testid="progress-bar"
        style={{ width: `${progressPercent}%` }}
      />

      <p data-testid="card-counter">
        {currentIndex + 1} / {total}
      </p>

      <div
        role="button"
        tabIndex={0}
        onClick={flip}
        onKeyDown={(e) => e.key === "Enter" && flip()}
        data-testid="flashcard"
        aria-label={isFlipped ? "Show English" : "Show Thai"}
      >
        {isFlipped ? (
          <span data-testid="card-back">{current.thai}</span>
        ) : (
          <span data-testid="card-front">{current.english}</span>
        )}
      </div>

      <button
        onClick={goPrev}
        disabled={isFirst}
        data-testid="button-prev"
        aria-label="Previous card"
      >
        Previous
      </button>

      <button
        onClick={goNext}
        disabled={isLast}
        data-testid="button-next"
        aria-label="Next card"
      >
        Next
      </button>

      {isLast && (
        <button onClick={onStartQuiz} data-testid="button-start-quiz">
          Start Quiz
        </button>
      )}
    </div>
  );
}
