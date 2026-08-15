/**
 * Template Engine: สุ่มตัวเลขสร้างโจทย์คณิตศาสตร์/อนุกรม/เงื่อนไขสัญลักษณ์
 * ทุกครั้งที่เรียก generate() จะได้โจทย์ใหม่ที่ตัวเลข/ค่าเปลี่ยน
 */

import type { Question } from "./questions";

// === Utility ===
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const MAX_DISTRACTOR_ATTEMPTS = 60;

/** Generate 4 unique choices including the correct answer. Returns [choices, correctIndex]. */
export function makeChoices(correct: number, spread: number = 0): [string[], number] {
  const s = Math.max(spread || Math.max(Math.round(Math.abs(correct) * 0.15), 2), 1);
  const others = new Set<number>();
  let attempts = 0;
  while (others.size < 3 && attempts < MAX_DISTRACTOR_ATTEMPTS) {
    attempts += 1;
    const offset = randInt(1, s) * (Math.random() > 0.5 ? 1 : -1);
    const val = correct + offset;
    if (val !== correct && val > 0) others.add(val);
  }
  let n = 1;
  while (others.size < 3) {
    const up = correct + n;
    const down = correct - n;
    if (up !== correct && up > 0) others.add(up);
    if (others.size >= 3) break;
    if (down !== correct && down > 0) others.add(down);
    n += 1;
    if (n > 1000) others.add(Math.max(1, correct) + others.size + 1);
  }
  const allChoices = [correct, ...others];
  const shuffled = shuffle(allChoices);
  return [shuffled.map(fmt), shuffled.indexOf(correct)];
}

function makeChoicesStr(correct: string, pool: string[]): [string[], number] {
  const others = shuffle(pool.filter((p) => p !== correct)).slice(0, 3);
  const allChoices = [correct, ...others];
  const shuffled = shuffle(allChoices);
  return [shuffled, shuffled.indexOf(correct)];
}

// =============================================
// Template generators — each returns a Question
// =============================================

// --- คณิตศาสตร์ ---

function genDiscount(): Question {
  const discountPct = randFrom([10, 15, 20, 25, 30, 40]);
  const originalPrice = randInt(5, 30) * 100; // 500-3000
  const salePrice = originalPrice * (1 - discountPct / 100);
  const [choices, answer] = makeChoices(originalPrice, Math.round(originalPrice * 0.2));

  return {
    id: 0,
    question: `ร้านค้าลดราคาสินค้า ${discountPct}% แล้วขายได้ในราคา ${fmt(salePrice)} บาท ราคาก่อนลดเท่ากับเท่าไร?`,
    choices: choices.map((c) => `${c} บาท`),
    answer,
    explanation: `ลดราคา ${discountPct}% หมายความว่าราคาที่ขายได้ = ${100 - discountPct}% ของราคาเดิม\nสมมติราคาเดิม = x\n${(100 - discountPct) / 100}x = ${fmt(salePrice)}\nx = ${fmt(salePrice)} ÷ ${(100 - discountPct) / 100} = ${fmt(originalPrice)} บาท`,
  };
}

function workRatePairs(): [number, number][] {
  const pairs: [number, number][] = [];
  const as = [3, 4, 5, 6, 8, 10, 12];
  const bs = [4, 6, 8, 10, 12, 15, 20];
  for (const a of as) {
    for (const b of bs) {
      if (a === b) continue;
      const together = (a * b) / (a + b);
      if (Number.isInteger(together) && together > 0) pairs.push([a, b]);
    }
  }
  return pairs;
}

function genWorkRate(): Question {
  const [a, b] = randFrom(workRatePairs());
  const together = (a * b) / (a + b);
  const [choices, answer] = makeChoices(together, 4);

  return {
    id: 0,
    question: `ถ้า A ทำงานคนเดียวเสร็จใน ${a} วัน B ทำคนเดียวเสร็จใน ${b} วัน ถ้า A กับ B ทำงานด้วยกัน จะเสร็จในกี่วัน?`,
    choices: choices.map((c) => `${c} วัน`),
    answer,
    explanation: `A ทำงานได้ 1/${a} ต่อวัน, B ทำงานได้ 1/${b} ต่อวัน\nรวมกัน = 1/${a} + 1/${b} = ${b}/${a * b} + ${a}/${a * b} = ${a + b}/${a * b} = 1/${together} ต่อวัน\nดังนั้นทำงานด้วยกันเสร็จใน ${together} วัน`,
  };
}

function genAverage(): Question {
  let count = 4;
  let avg = 50;
  let newPerson = 70;
  let totalOld = 200;
  let totalNew = 270;
  let newAvg = 54;
  for (let attempt = 0; attempt < 40; attempt++) {
    count = randFrom([4, 5, 6, 8, 10]);
    avg = randInt(40, 70);
    newPerson = avg + randFrom([6, 8, 10, 12, 15, 20]);
    totalOld = count * avg;
    totalNew = totalOld + newPerson;
    const candidate = totalNew / (count + 1);
    if (Number.isInteger(candidate)) {
      newAvg = candidate;
      break;
    }
  }
  const [choices, answer] = makeChoices(newAvg, 5);

  return {
    id: 0,
    question: `น้ำหนักเฉลี่ยของนักเรียน ${count} คน เท่ากับ ${avg} กก. ถ้ามีนักเรียนเพิ่มอีก 1 คน หนัก ${newPerson} กก. น้ำหนักเฉลี่ยใหม่คือเท่าไร?`,
    choices: choices.map((c) => `${c} กก.`),
    answer,
    explanation: `น้ำหนักรวม ${count} คน = ${avg} × ${count} = ${fmt(totalOld)} กก.\nเพิ่มคนที่ ${count + 1} หนัก ${newPerson} กก. → รวม = ${fmt(totalOld)} + ${newPerson} = ${fmt(totalNew)} กก.\nเฉลี่ย = ${fmt(totalNew)} ÷ ${count + 1} = ${newAvg} กก.`,
  };
}

function genDistance(): Question {
  const speed = randFrom([60, 70, 80, 90, 100, 120]);
  const time = randFrom([1.5, 2, 2.5, 3, 3.5, 4]);
  const distance = speed * time;
  
  const [choices, answer] = makeChoices(distance, Math.round(distance * 0.15));

  return {
    id: 0,
    question: `รถยนต์คันหนึ่งวิ่งด้วยความเร็ว ${speed} กม./ชม. เป็นเวลา ${time} ชม. จะวิ่งได้ระยะทางเท่าไร?`,
    choices: choices.map((c) => `${c} กม.`),
    answer,
    explanation: `ระยะทาง = ความเร็ว × เวลา\n= ${speed} × ${time} = ${fmt(distance)} กม.`,
  };
}

function genPercentage(): Question {
  const total = randFrom([200, 250, 300, 400, 500, 600, 800]);
  const pct = randFrom([15, 20, 25, 30, 35, 40, 60, 75]);
  const result = (total * pct) / 100;

  const [choices, answer] = makeChoices(result, Math.round(result * 0.3));

  return {
    id: 0,
    question: `${pct}% ของ ${fmt(total)} เท่ากับเท่าไร?`,
    choices: choices,
    answer,
    explanation: `${pct}% ของ ${fmt(total)} = ${total} × ${pct}/100 = ${total} × ${pct / 100} = ${fmt(result)}`,
  };
}

function genProfit(): Question {
  const cost = randFrom([80, 100, 120, 150, 200, 250, 300]) ;
  const profitPct = randFrom([20, 25, 30, 40, 50]);
  const sellPrice = cost * (1 + profitPct / 100);

  const [choices, answer] = makeChoices(sellPrice, Math.round(sellPrice * 0.15));

  return {
    id: 0,
    question: `ซื้อสินค้ามาในราคา ${fmt(cost)} บาท ต้องการกำไร ${profitPct}% ต้องขายในราคาเท่าไร?`,
    choices: choices.map((c) => `${c} บาท`),
    answer,
    explanation: `ราคาขาย = ต้นทุน × (1 + กำไร%/100)\n= ${fmt(cost)} × ${1 + profitPct / 100} = ${fmt(sellPrice)} บาท`,
  };
}

function genRatio(): Question {
  const rA = randInt(2, 5);
  const rB = randInt(2, 5);
  const total = (rA + rB) * randFrom([5, 10, 15, 20]);
  const partA = (total * rA) / (rA + rB);

  const [choices, answer] = makeChoices(partA, Math.round(partA * 0.3));

  return {
    id: 0,
    question: `แบ่งเงิน ${fmt(total)} บาท ให้ A กับ B ในอัตราส่วน ${rA}:${rB}  A จะได้รับเงินเท่าไร?`,
    choices: choices.map((c) => `${c} บาท`),
    answer,
    explanation: `อัตราส่วนรวม = ${rA} + ${rB} = ${rA + rB}\nส่วนของ A = ${rA}/${rA + rB} × ${fmt(total)} = ${fmt(partA)} บาท`,
  };
}

// --- อนุกรม ---

function genArithmeticSeries(): Question {
  const start = randInt(1, 20);
  const diff = randFrom([2, 3, 4, 5, 6, 7, 8]);
  const terms = Array.from({ length: 6 }, (_, i) => start + i * diff);
  const nextTerm = start + 6 * diff;
  const display = terms.map(fmt).join(", ");

  const [choices, answer] = makeChoices(nextTerm, diff * 3);

  return {
    id: 0,
    question: `จงหาตัวเลขถัดไปในอนุกรม: ${display}, ...`,
    choices,
    answer,
    explanation: `นี่คืออนุกรมเลขคณิต (Arithmetic) ผลต่างคงที่ = ${diff}\nตัวถัดไป = ${fmt(terms[5])} + ${diff} = ${fmt(nextTerm)}`,
  };
}

function genGeometricSeries(): Question {
  const start = randFrom([2, 3, 4, 5]);
  const ratio = randFrom([2, 3]);
  const terms = Array.from({ length: 5 }, (_, i) => start * Math.pow(ratio, i));
  const nextTerm = start * Math.pow(ratio, 5);
  const display = terms.map(fmt).join(", ");

  const [choices, answer] = makeChoices(nextTerm, Math.round(nextTerm * 0.3));

  return {
    id: 0,
    question: `จงหาตัวเลขถัดไปในอนุกรม: ${display}, ...`,
    choices,
    answer,
    explanation: `นี่คืออนุกรมเรขาคณิต (Geometric) อัตราส่วนร่วม = ${ratio}\nแต่ละจำนวน = จำนวนก่อนหน้า × ${ratio}\nตัวถัดไป = ${fmt(terms[4])} × ${ratio} = ${fmt(nextTerm)}`,
  };
}

function genIncreasingDiffSeries(): Question {
  const start = randInt(1, 5);
  const initDiff = randFrom([2, 3, 4]);
  const diffInc = randFrom([1, 2]);
  const terms: number[] = [start];
  for (let i = 1; i <= 5; i++) {
    terms.push(terms[i - 1] + initDiff + (i - 1) * diffInc);
  }
  const nextDiff = initDiff + 5 * diffInc;
  const nextTerm = terms[5] + nextDiff;
  const display = terms.map(fmt).join(", ");
  const diffs = [];
  for (let i = 1; i < terms.length; i++) diffs.push(terms[i] - terms[i - 1]);

  const [choices, answer] = makeChoices(nextTerm, nextDiff * 2);

  return {
    id: 0,
    question: `จงหาตัวเลขถัดไปในอนุกรม: ${display}, ...`,
    choices,
    answer,
    explanation: `ผลต่างระหว่างจำนวน: ${diffs.join(", ")} → เพิ่มขึ้นทีละ ${diffInc}\nดังนั้นผลต่างถัดไปคือ ${nextDiff}\n${fmt(terms[5])} + ${nextDiff} = ${fmt(nextTerm)}`,
  };
}

function genSquareSeries(): Question {
  const offset = randFrom([0, 1, -1]);
  const startN = randFrom([1, 2]);
  const terms = Array.from({ length: 6 }, (_, i) => (startN + i) ** 2 + offset);
  const nextTerm = (startN + 6) ** 2 + offset;
  const display = terms.map(fmt).join(", ");
  const offsetStr = offset > 0 ? ` + ${offset}` : offset < 0 ? ` - ${Math.abs(offset)}` : "";

  const [choices, answer] = makeChoices(nextTerm, 10);

  return {
    id: 0,
    question: `จงหาตัวเลขถัดไปในอนุกรม: ${display}, ...`,
    choices,
    answer,
    explanation: `แต่ละจำนวน = n²${offsetStr} โดย n เริ่มจาก ${startN}\n${terms.map((t, i) => `${startN + i}²${offsetStr} = ${t}`).join(", ")}\nตัวถัดไป = ${startN + 6}²${offsetStr} = ${fmt(nextTerm)}`,
  };
}

// --- เงื่อนไขสัญลักษณ์ ---

function genSymbolCondition(): Question {
  const names = shuffle(["A", "B", "C", "D", "E"]).slice(0, 4);
  const [a, b, c, d] = names;

  const patterns = [
    {
      conditions: `${a} > ${b}, ${b} = ${c}, ${c} > ${d}`,
      stmt1: `${a} > ${d}`,
      stmt2: `${b} > ${d}`,
      s1: true,
      s2: true,
      explain: `จากเงื่อนไข: ${a} > ${b} = ${c} > ${d}\nข้อสรุปที่ 1: ${a} > ${b} = ${c} > ${d} → ${a} > ${d} ✓\nข้อสรุปที่ 2: ${b} = ${c} > ${d} → ${b} > ${d} ✓`,
    },
    {
      conditions: `${a} > ${b}, ${b} > ${c}, ${c} = ${d}`,
      stmt1: `${a} > ${d}`,
      stmt2: `${d} > ${a}`,
      s1: true,
      s2: false,
      explain: `จากเงื่อนไข: ${a} > ${b} > ${c} = ${d}\nข้อสรุปที่ 1: ${a} > ${b} > ${c} = ${d} → ${a} > ${d} ✓\nข้อสรุปที่ 2: ${d} = ${c} < ${b} < ${a} → ${d} > ${a} ✗`,
    },
    {
      conditions: `${a} = ${b}, ${b} < ${c}, ${c} < ${d}`,
      stmt1: `${a} < ${d}`,
      stmt2: `${b} > ${c}`,
      s1: true,
      s2: false,
      explain: `จากเงื่อนไข: ${a} = ${b} < ${c} < ${d}\nข้อสรุปที่ 1: ${a} = ${b} < ${c} < ${d} → ${a} < ${d} ✓\nข้อสรุปที่ 2: ${b} < ${c} → ${b} > ${c} ✗`,
    },
    {
      conditions: `${a} > ${b}, ${c} > ${b}, ${c} < ${d}`,
      stmt1: `${a} > ${d}`,
      stmt2: `${d} > ${b}`,
      s1: false,
      s2: true,
      explain: `จากเงื่อนไข: ${a} > ${b}, ${c} > ${b}, ${c} < ${d}\nข้อสรุปที่ 1: ไม่ทราบความสัมพันธ์ระหว่าง ${a} กับ ${d} → สรุปไม่ได้ ✗\nข้อสรุปที่ 2: ${d} > ${c} > ${b} → ${d} > ${b} ✓`,
    },
  ];

  const p = randFrom(patterns);

  let correctLabel: string;
  if (p.s1 && p.s2) correctLabel = "ข้อสรุปทั้ง 2 ข้อถูก";
  else if (p.s1 && !p.s2) correctLabel = "ข้อสรุปที่ 1 ถูกเพียงข้อเดียว";
  else if (!p.s1 && p.s2) correctLabel = "ข้อสรุปที่ 2 ถูกเพียงข้อเดียว";
  else correctLabel = "ข้อสรุปทั้ง 2 ข้อผิด";

  const allChoices = [
    "ข้อสรุปที่ 1 ถูกเพียงข้อเดียว",
    "ข้อสรุปที่ 2 ถูกเพียงข้อเดียว",
    "ข้อสรุปทั้ง 2 ข้อถูก",
    "ข้อสรุปทั้ง 2 ข้อผิด",
  ];
  const shuffled = shuffle(allChoices);

  return {
    id: 0,
    question: `กำหนดให้ ${p.conditions}\nข้อสรุปที่ 1: ${p.stmt1}\nข้อสรุปที่ 2: ${p.stmt2}\nข้อใดถูกต้อง?`,
    choices: shuffled,
    answer: shuffled.indexOf(correctLabel),
    explanation: p.explain,
  };
}

// =============================================
// Export: registry of all template generators
// =============================================

export interface TemplateGenerator {
  id: string;
  topic: string;        // หมวดย่อย
  category: string;     // analytical | english | civil-servant
  generate: () => Question;
}

export const templateGenerators: TemplateGenerator[] = [
  // คณิตศาสตร์
  { id: "discount",      topic: "คณิตศาสตร์",       category: "analytical", generate: genDiscount },
  { id: "work-rate",     topic: "คณิตศาสตร์",       category: "analytical", generate: genWorkRate },
  { id: "average",       topic: "คณิตศาสตร์",       category: "analytical", generate: genAverage },
  { id: "distance",      topic: "คณิตศาสตร์",       category: "analytical", generate: genDistance },
  { id: "percentage",    topic: "คณิตศาสตร์",       category: "analytical", generate: genPercentage },
  { id: "profit",        topic: "คณิตศาสตร์",       category: "analytical", generate: genProfit },
  { id: "ratio",         topic: "คณิตศาสตร์",       category: "analytical", generate: genRatio },
  // อนุกรม
  { id: "arith-series",  topic: "อนุกรม",           category: "analytical", generate: genArithmeticSeries },
  { id: "geo-series",    topic: "อนุกรม",           category: "analytical", generate: genGeometricSeries },
  { id: "inc-diff",      topic: "อนุกรม",           category: "analytical", generate: genIncreasingDiffSeries },
  { id: "square-series", topic: "อนุกรม",           category: "analytical", generate: genSquareSeries },
  // เงื่อนไขสัญลักษณ์
  { id: "symbol-cond",   topic: "เงื่อนไขสัญลักษณ์", category: "analytical", generate: genSymbolCondition },
];
