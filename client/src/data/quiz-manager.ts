/**
 * Quiz Manager: รวม Template Engine + Question Pool + Shuffle
 * สร้างชุดข้อสอบ dynamic ทุกครั้งที่เรียก generateQuiz()
 */

import type { Question, QuizCategory } from "./questions";
import { templateGenerators } from "./template-engine";
import { questionPools } from "./question-pool";

// === Utility ===
function shuffle<T>(arr: T[]): T[] {
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
function shuffleChoices(q: Question): Question {
  const indices = q.choices.map((_, i) => i);
  const shuffledIndices = shuffle(indices);
  const newChoices = shuffledIndices.map((i) => q.choices[i]);
  const newAnswer = shuffledIndices.indexOf(q.answer);
  return { ...q, choices: newChoices, answer: newAnswer };
}

// =============================================
// Category configs: กำหนดจำนวนข้อและสัดส่วนแต่ละหมวดย่อย
// =============================================

interface SubSection {
  type: "template" | "pool";
  /** สำหรับ template: id ของ template generator */
  templateIds?: string[];
  /** สำหรับ pool: topic ของ pool */
  poolTopic?: string;
  /** จำนวนข้อที่ต้องการจากหมวดนี้ */
  count: number;
}

interface CategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  totalScore: number;
  passingPercent: number;
  sections: SubSection[];
}

const categoryConfigs: CategoryConfig[] = [
  {
    id: "analytical",
    title: "ความสามารถในการคิดวิเคราะห์",
    subtitle: "คณิตศาสตร์ + ภาษาไทย",
    icon: "brain",
    color: "blue",
    totalScore: 100,
    passingPercent: 60,
    sections: [
      // คณิตศาสตร์ — 5 ข้อจาก template (สุ่มจาก 7 ประเภท)
      {
        type: "template",
        templateIds: ["discount", "work-rate", "average", "distance", "percentage", "profit", "ratio"],
        count: 5,
      },
      // อนุกรม — 3 ข้อจาก template (สุ่มจาก 4 ประเภท)
      {
        type: "template",
        templateIds: ["arith-series", "geo-series", "inc-diff", "square-series"],
        count: 3,
      },
      // เงื่อนไขสัญลักษณ์ — 2 ข้อจาก template
      {
        type: "template",
        templateIds: ["symbol-cond"],
        count: 2,
      },
      // อุปมาอุปไมย — 2 ข้อจาก pool
      { type: "pool", poolTopic: "อุปมาอุปไมย", count: 2 },
      // การเรียงประโยค — 1 ข้อจาก pool
      { type: "pool", poolTopic: "การเรียงประโยค", count: 1 },
      // บทความ (ไทย) — 1 ข้อจาก pool
      { type: "pool", poolTopic: "บทความ (ไทย)", count: 1 },
      // การใช้ภาษาไทย — 1 ข้อจาก pool
      { type: "pool", poolTopic: "การใช้ภาษาไทย", count: 1 },
    ], // total: 5+3+2+2+1+1+1 = 15 ข้อ
  },
  {
    id: "english",
    title: "ภาษาอังกฤษ",
    subtitle: "Grammar, Vocabulary, Reading",
    icon: "globe",
    color: "purple",
    totalScore: 50,
    passingPercent: 50,
    sections: [
      // Grammar — 6 ข้อจาก pool (15 ข้อในคลัง)
      { type: "pool", poolTopic: "Grammar", count: 6 },
      // Vocabulary — 4 ข้อจาก pool (10 ข้อในคลัง)
      { type: "pool", poolTopic: "Vocabulary", count: 4 },
      // Conversation — 3 ข้อจาก pool (6 ข้อในคลัง)
      { type: "pool", poolTopic: "Conversation", count: 3 },
      // Reading — 2 ข้อจาก pool (4 ข้อในคลัง)
      { type: "pool", poolTopic: "Reading", count: 2 },
    ], // total: 6+4+3+2 = 15 ข้อ
  },
  {
    id: "civil-servant",
    title: "ความรู้และลักษณะการเป็นข้าราชการที่ดี",
    subtitle: "กฎหมาย + จริยธรรม",
    icon: "scale",
    color: "green",
    totalScore: 50,
    passingPercent: 60,
    sections: [
      // กฎหมาย+จริยธรรม — 15 ข้อจาก pool (18 ข้อในคลัง)
      { type: "pool", poolTopic: "กฎหมาย+จริยธรรม", count: 15 },
    ],
  },
];

// =============================================
// Core: สร้างข้อสอบจาก config
// =============================================

function generateSection(section: SubSection): Question[] {
  if (section.type === "template") {
    // สุ่มเลือก template generators ตาม count
    const matchingGens = templateGenerators.filter(
      (g) => section.templateIds?.includes(g.id)
    );

    if (matchingGens.length === 0) return [];

    const questions: Question[] = [];
    // ถ้า count มากกว่าจำนวน generator → ใช้ซ้ำได้ (ตัวเลขต่างกัน)
    if (section.count <= matchingGens.length) {
      const picked = pickRandom(matchingGens, section.count);
      picked.forEach((g) => questions.push(g.generate()));
    } else {
      // ใช้ทุก generator ก่อน แล้วสุ่มเพิ่ม
      const allGens = shuffle(matchingGens);
      for (let i = 0; i < section.count; i++) {
        questions.push(allGens[i % allGens.length].generate());
      }
    }
    return questions;
  }

  // Pool type: สุ่มจากคลังข้อสอบ + shuffle ตัวเลือก
  const pool = questionPools.find((p) => p.topic === section.poolTopic);
  if (!pool) return [];

  const picked = pickRandom(pool.questions, section.count);
  return picked.map(shuffleChoices);
}

// =============================================
// Public API
// =============================================

/** สร้างชุดข้อสอบใหม่ทั้ง 3 วิชา */
export function generateAllQuizzes(): QuizCategory[] {
  return categoryConfigs.map((config) => {
    const allQuestions: Question[] = [];

    config.sections.forEach((section) => {
      allQuestions.push(...generateSection(section));
    });

    // Assign sequential IDs
    const questionsWithIds = allQuestions.map((q, i) => ({
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
      passingPercent: config.passingPercent,
      questions: questionsWithIds,
    };
  });
}

/** สร้างชุดข้อสอบสำหรับวิชาเดียว */
export function generateQuiz(categoryId: string): QuizCategory | null {
  const config = categoryConfigs.find((c) => c.id === categoryId);
  if (!config) return null;

  const allQuestions: Question[] = [];
  config.sections.forEach((section) => {
    allQuestions.push(...generateSection(section));
  });

  const questionsWithIds = allQuestions.map((q, i) => ({
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
    passingPercent: config.passingPercent,
    questions: questionsWithIds,
  };
}

/** เอาข้อมูลวิชาทั้งหมด (ไม่มีโจทย์ — สำหรับหน้า Home) */
export function getCategoryMeta() {
  return categoryConfigs.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    icon: c.icon,
    color: c.color,
    totalScore: c.totalScore,
    passingPercent: c.passingPercent,
    questionCount: c.sections.reduce((sum, s) => sum + s.count, 0),
  }));
}
