import { getStarRating, QUIZ_QUESTIONS, PASSING_SCORE } from "../lib/score";

export interface QuizResultProps {
  levelId: number;
  levelTitle: string;
  score: number;
  onRetry: () => void;
}

export function QuizResult({ levelId, levelTitle, score, onRetry }: QuizResultProps) {
  const passed = score >= PASSING_SCORE;
  const stars = getStarRating(score, QUIZ_QUESTIONS, PASSING_SCORE);

  return (
    <div data-testid="quiz-result">
      <h1>{`ด่าน ${levelId}: ${levelTitle}`}</h1>

      <div
        data-testid="result-icon"
        data-passed={passed}
        aria-label={passed ? "ผ่าน" : "ไม่ผ่าน"}
      />

      <p data-testid="result-status">{passed ? "ผ่าน" : "ไม่ผ่าน"}</p>

      <p data-testid="result-score">
        {score} / {QUIZ_QUESTIONS}
      </p>

      <div data-testid="star-rating" aria-label={`${stars} ดาว`}>
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            data-testid={`star-${i}`}
            data-filled={i < stars}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>

      <button onClick={onRetry} data-testid="button-retry">
        ลองใหม่
      </button>
    </div>
  );
}
