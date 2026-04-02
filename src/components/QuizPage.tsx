import { useState, useMemo, useCallback } from "react";
import type { FlashcardWord } from "./FlashcardPage";

export const QUIZ_QUESTIONS = 5;

export interface QuizQuestion {
  word: FlashcardWord;
  options: string[];
  correctIndex: number;
}

/** All Thai words available as wrong-answer distractors */
const ALL_THAI_WORDS = [
  "เพียงพอ",
  "เข้าร่วม",
  "การประชุม",
  "มีโอกาส",
  "พิจารณา",
  "ตัดสิน",
  "ผลลัพธ์",
  "สนับสนุน",
  "ปรับปรุง",
  "ทักษะ",
];

/**
 * Picks `QUIZ_QUESTIONS` random words from `words`, then builds a 4-option
 * multiple-choice question for each one using distractors from `allThai`.
 */
export function buildQuizQuestions(
  words: FlashcardWord[],
  allThai: string[] = ALL_THAI_WORDS
): QuizQuestion[] {
  return [...words]
    .sort(() => Math.random() - 0.5)
    .slice(0, QUIZ_QUESTIONS)
    .map((word) => {
      const distractors = allThai
        .filter((t) => t !== word.thai)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [...distractors, word.thai].sort(
        () => Math.random() - 0.5
      );
      return { word, options, correctIndex: options.indexOf(word.thai) };
    });
}

export interface QuizPageProps {
  levelId: number;
  words: FlashcardWord[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizPage({ words, onComplete, onBack }: QuizPageProps) {
  const questions = useMemo(() => buildQuizQuestions(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZ_QUESTIONS).fill(null)
  );
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = questions[currentIndex];

  const selectAnswer = useCallback(
    (choiceIndex: number) => {
      if (isAnswered) return;

      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = choiceIndex;
      setAnswers(updatedAnswers);
      setIsAnswered(true);

      const isCorrect = choiceIndex === questions[currentIndex].correctIndex;
      const newScore = isCorrect ? correctCount + 1 : correctCount;
      setCorrectCount(newScore);

      setTimeout(() => {
        if (currentIndex < QUIZ_QUESTIONS - 1) {
          setCurrentIndex((i) => i + 1);
          setIsAnswered(false);
        } else {
          onComplete(newScore);
        }
      }, 1200);
    },
    [isAnswered, answers, currentIndex, questions, correctCount, onComplete]
  );

  if (!question) return null;

  return (
    <div>
      <button onClick={onBack} data-testid="button-back-quiz">
        Back
      </button>

      <p data-testid="question-counter">
        {currentIndex + 1} / {QUIZ_QUESTIONS}
      </p>

      <p data-testid="question-text">{question.word.english}</p>

      <ul>
        {question.options.map((option, idx) => {
          const userAnswer = answers[currentIndex];
          const isSelected = userAnswer === idx;
          const isCorrect = idx === question.correctIndex;

          let state: "default" | "correct" | "wrong" = "default";
          if (isAnswered) {
            if (isCorrect) state = "correct";
            else if (isSelected) state = "wrong";
          }

          return (
            <li key={idx}>
              <button
                onClick={() => selectAnswer(idx)}
                data-testid={`option-${idx}`}
                data-state={state}
                aria-pressed={isSelected}
                disabled={isAnswered && !isSelected && !isCorrect}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
