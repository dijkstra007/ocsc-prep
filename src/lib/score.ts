/** Total questions per quiz level */
export const QUIZ_QUESTIONS = 5;

/** Minimum correct answers to pass a level */
export const PASSING_SCORE = 3;

/** 0 = no stars, 1 = bronze, 2 = silver, 3 = gold */
export type StarRating = 0 | 1 | 2 | 3;

/**
 * Returns a 0–3 star rating for a quiz attempt.
 *
 * Rules (mirrored from the production bundle):
 *   3 stars  — perfect score (score === total)
 *   2 stars  — passed        (score >= passing)
 *   1 star   — attempted     (score >= 1)
 *   0 stars  — no answers    (score === 0)
 */
export function getStarRating(
  score: number,
  total: number,
  passing: number
): StarRating {
  if (score === total) return 3;
  if (score >= passing) return 2;
  if (score >= 1) return 1;
  return 0;
}

/** Convenience wrapper using the app's default constants */
export function getDefaultStarRating(score: number): StarRating {
  return getStarRating(score, QUIZ_QUESTIONS, PASSING_SCORE);
}
