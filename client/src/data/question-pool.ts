/**
 * Question Pool: คลังข้อสอบสำหรับวิชาที่ไม่ใช่คำนวณ
 * ระบบจะสุ่มหยิบมาแสดง + สลับลำดับตัวเลือก
 */

import type { Question } from "./questions";
import {
  analogyPool,
  readingThaiPool,
  sentenceOrderPool,
  thaiUsagePool,
} from "./pools/thai";
import {
  conversationPool,
  grammarPool,
  readingEngPool,
  vocabPool,
} from "./pools/english";
import { civilServantPool } from "./pools/civil";

export interface PoolCategory {
  topic: string;
  category: string; // analytical | english | civil-servant
  questions: Question[];
}

export const questionPools: PoolCategory[] = [
  { topic: "อุปมาอุปไมย", category: "analytical", questions: analogyPool },
  { topic: "การเรียงประโยค", category: "analytical", questions: sentenceOrderPool },
  { topic: "บทความ (ไทย)", category: "analytical", questions: readingThaiPool },
  { topic: "การใช้ภาษาไทย", category: "analytical", questions: thaiUsagePool },
  { topic: "Grammar", category: "english", questions: grammarPool },
  { topic: "Vocabulary", category: "english", questions: vocabPool },
  { topic: "Conversation", category: "english", questions: conversationPool },
  { topic: "Reading", category: "english", questions: readingEngPool },
  { topic: "กฎหมาย+จริยธรรม", category: "civil-servant", questions: civilServantPool },
];
