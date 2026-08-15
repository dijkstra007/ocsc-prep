/**
 * Quiz Manager: รวม Template Engine + Question Pool + Shuffle
 * สร้างชุดข้อสอบ dynamic ทุกครั้งที่เรียก generateQuiz()
 */

import type { MissedQuestion } from "@/lib/progress";
import type { Degree } from "@/lib/score";
import { passingPercent } from "@/lib/score";
import type { Question, QuizCategory } from "./questions";
import { templateGenerators } from "./template-engine";
import { questionPools } from "./question-pool";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** สลับลำดับตัวเลือกของข้อสอบจาก pool (shuffle choices) */
export function shuffleChoices(q: Question): Question {
  const indices = q.choices.map((_, i) => i);
  const shuffledIndices = shuffle(indices);
  const newChoices = shuffledIndices.map((i) => q.choices[i]);
  const newAnswer = shuffledIndices.indexOf(q.answer);
  return { ...q, choices: newChoices, answer: newAnswer };
}

interface SubSection {
  type: "template" | "pool";
  templateIds?: string[];
  poolTopic?: string;
  count: number;
}

export interface CategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  totalScore: number;
  sections: SubSection[];
}

export const categoryConfigs: CategoryConfig[] = [
  {
    id: "analytical",
    title: "ความสามารถในการคิดวิเคราะห์",
    subtitle: "คณิตศาสตร์ + ภาษาไทย",
    icon: "brain",
    color: "blue",
    totalScore: 100,
    sections: [
      {
        type: "template",
        templateIds: ["discount", "work-rate", "average", "distance", "percentage", "profit", "ratio"],
        count: 5,
      },
      {
        type: "template",
        templateIds: ["arith-series", "geo-series", "inc-diff", "square-series"],
        count: 3,
      },
      {
        type: "template",
        templateIds: ["symbol-cond"],
        count: 2,
      },
      { type: "pool", poolTopic: "อุปมาอุปไมย", count: 2 },
      { type: "pool", poolTopic: "การเรียงประโยค", count: 1 },
      { type: "pool", poolTopic: "บทความ (ไทย)", count: 1 },
      { type: "pool", poolTopic: "การใช้ภาษาไทย", count: 1 },
    ],
  },
  {
    id: "english",
    title: "ภาษาอังกฤษ",
    subtitle: "Grammar, Vocabulary, Reading",
    icon: "globe",
    color: "purple",
    totalScore: 50,
    sections: [
      { type: "pool", poolTopic: "Grammar", count: 6 },
      { type: "pool", poolTopic: "Vocabulary", count: 4 },
      { type: "pool", poolTopic: "Conversation", count: 3 },
      { type: "pool", poolTopic: "Reading", count: 2 },
    ],
  },
  {
    id: "civil-servant",
    title: "ความรู้และลักษณะการเป็นข้าราชการที่ดี",
    subtitle: "กฎหมาย + จริยธรรม",
    icon: "scale",
    color: "green",
    totalScore: 50,
    sections: [
      { type: "pool", poolTopic: "กฎหมาย+จริยธรรม", count: 15 },
    ],
  },
];

function generateSection(section: SubSection): Question[] {
  if (section.type === "template") {
    const matchingGens = templateGenerators.filter(
      (g) => section.templateIds?.includes(g.id),
    );
    if (matchingGens.length === 0) return [];

    const questions: Question[] = [];
    if (section.count <= matchingGens.length) {
      const picked = pickRandom(matchingGens, section.count);
      picked.forEach((g) => questions.push({ ...g.generate(), topic: g.topic }));
    } else {
      const allGens = shuffle(matchingGens);
      for (let i = 0; i < section.count; i++) {
        const g = allGens[i % allGens.length];
        questions.push({ ...g.generate(), topic: g.topic });
      }
    }
    return questions;
  }

  const pool = questionPools.find((p) => p.topic === section.poolTopic);
  if (!pool) return [];

  const picked = pickRandom(pool.questions, section.count);
  return picked.map((q) => shuffleChoices({ ...q, topic: pool.topic }));
}

function toCategory(config: CategoryConfig, questions: Question[], degree: Degree): QuizCategory {
  const questionsWithIds = questions.map((q, i) => ({
    ...q,
    id: i + 1,
  }));
  return {
    id: config.id,
    title: config.title,
    subtitle: config.subtitle,
    icon: config.icon,
    color: config.color,
    totalScore: config.totalScore,
    passingPercent: passingPercent(config.id, degree),
    questions: questionsWithIds,
  };
}

export function generateAllQuizzes(degree: Degree = "bachelor"): QuizCategory[] {
  return categoryConfigs.map((config) => {
    const allQuestions: Question[] = [];
    config.sections.forEach((section) => {
      allQuestions.push(...generateSection(section));
    });
    return toCategory(config, allQuestions, degree);
  });
}

export function generateQuiz(categoryId: string, degree: Degree = "bachelor"): QuizCategory | null {
  const config = categoryConfigs.find((c) => c.id === categoryId);
  if (!config) return null;

  const allQuestions: Question[] = [];
  config.sections.forEach((section) => {
    allQuestions.push(...generateSection(section));
  });
  return toCategory(config, allQuestions, degree);
}

export function generateReviewQuiz(
  items: MissedQuestion[],
  degree: Degree = "bachelor",
): QuizCategory | null {
  if (items.length === 0) return null;
  const questions = shuffle(items).map((m, i) =>
    shuffleChoices({
      id: i + 1,
      question: m.question,
      choices: [...m.choices],
      answer: m.answer,
      explanation: m.explanation,
      topic: m.topic,
      poolKey: m.poolKey,
    }),
  );
  return {
    id: "review",
    title: "ฝึกข้อที่ผิด",
    subtitle: "ทบทวนจากข้อที่ตอบผิด",
    icon: "rotate",
    color: "blue",
    totalScore: questions.length,
    passingPercent: passingPercent("review", degree),
    questions,
  };
}

export function getCategoryMeta(degree: Degree = "bachelor") {
  return categoryConfigs.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    icon: c.icon,
    color: c.color,
    totalScore: c.totalScore,
    passingPercent: passingPercent(c.id, degree),
    questionCount: c.sections.reduce((sum, s) => sum + s.count, 0),
  }));
}

export function getContentStats() {
  const poolCount = questionPools.reduce((sum, p) => sum + p.questions.length, 0);
  return {
    poolCount,
    templateCount: templateGenerators.length,
    pools: questionPools.map((p) => ({
      topic: p.topic,
      category: p.category,
      count: p.questions.length,
    })),
  };
}

export function collectMissed(
  categoryId: string,
  questions: Question[],
  answers: Record<number, number | null | undefined>,
): MissedQuestion[] {
  return questions
    .filter((q) => answers[q.id] !== q.answer)
    .map((q) => ({
      poolKey: q.poolKey || `text:${q.question.slice(0, 120)}`,
      topic: q.topic || "",
      categoryId,
      question: q.question,
      choices: q.choices,
      answer: q.answer,
      explanation: q.explanation,
    }));
}
