export interface Question {
  id: number;
  question: string;
  choices: string[];
  answer: number; // 0-based index
  explanation: string;
  topic?: string;
  poolKey?: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  totalScore: number;
  passingPercent: number;
  questions: Question[];
}

export function poolQuestion(
  poolKey: string,
  question: string,
  choices: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  explanation: string,
): Question {
  return {
    id: 0,
    poolKey,
    question,
    choices: [...choices],
    answer,
    explanation,
  };
}
