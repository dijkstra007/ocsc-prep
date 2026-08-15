export type Degree = "bachelor" | "master";

export const EXAM_DURATION_SECONDS = 3 * 60 * 60;
export const PRACTICE_TIMER_SECONDS = 20 * 60;
export const TOTAL_EXAM_SCORE = 200;

export function correctCount(
  questions: { id: number; answer: number }[],
  answers: Record<number, number | null | undefined>,
): number {
  return questions.reduce((sum, q) => (answers[q.id] === q.answer ? sum + 1 : sum), 0);
}

export function percent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function passingPercent(categoryId: string, degree: Degree): number {
  if (categoryId === "analytical") return degree === "master" ? 65 : 60;
  if (categoryId === "english") return 50;
  if (categoryId === "civil-servant") return 60;
  return 60;
}

export function passed(scorePercent: number, categoryId: string, degree: Degree): boolean {
  return scorePercent >= passingPercent(categoryId, degree);
}

export function weightedPoints(correct: number, total: number, totalScore: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * totalScore);
}

export function examPassed(
  subjectResults: { categoryId: string; percent: number }[],
  degree: Degree,
): boolean {
  if (subjectResults.length === 0) return false;
  return subjectResults.every((s) => passed(s.percent, s.categoryId, degree));
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}
