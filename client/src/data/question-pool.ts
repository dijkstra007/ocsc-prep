/**
 * Question Pool: คลังข้อสอบขนาดใหญ่สำหรับวิชาที่ไม่ใช่คำนวณ
 * ระบบจะสุ่มหยิบมาแสดง + สลับลำดับตัวเลือก
 */

import type { Question } from "./questions";

export interface PoolCategory {
  topic: string;
  category: string; // analytical | english | civil-servant
  questions: Question[];
}

// =============================================
// ภาษาไทย: อุปมาอุปไมย
// =============================================
const analogyPool: Question[] = [
  { id: 0, question: "หมอ : โรงพยาบาล :: ครู : ?", choices: ["นักเรียน", "โรงเรียน", "ห้องเรียน", "ตำรา"], answer: 1, explanation: "ความสัมพันธ์คือ 'อาชีพ : สถานที่ทำงาน'\nหมอทำงานที่โรงพยาบาล → ครูทำงานที่โรงเรียน" },
  { id: 0, question: "ดาว : ท้องฟ้า :: ปลา : ?", choices: ["น้ำ", "ทะเล", "แม่น้ำ", "อาหาร"], answer: 0, explanation: "'สิ่งของ : แหล่งที่อยู่ (กว้าง)'\nดาวอยู่บนท้องฟ้า → ปลาอยู่ในน้ำ (คำกว้างที่สุด)" },
  { id: 0, question: "ปากกา : เขียน :: มีด : ?", choices: ["คม", "ตัด", "เหล็ก", "ครัว"], answer: 1, explanation: "'เครื่องมือ : หน้าที่'\nปากกาใช้เขียน → มีดใช้ตัด" },
  { id: 0, question: "นก : รัง :: คน : ?", choices: ["ครอบครัว", "บ้าน", "หมู่บ้าน", "ห้อง"], answer: 1, explanation: "'สิ่งมีชีวิต : ที่อยู่อาศัย'\nนกอยู่ในรัง → คนอยู่ในบ้าน" },
  { id: 0, question: "ฝน : ร่ม :: แดด : ?", choices: ["หมวก", "เมฆ", "ท้องฟ้า", "ร้อน"], answer: 0, explanation: "'ปรากฏการณ์ : อุปกรณ์ป้องกัน'\nฝนใช้ร่มกัน → แดดใช้หมวกกัน" },
  { id: 0, question: "หนังสือ : ห้องสมุด :: เงิน : ?", choices: ["กระเป๋า", "ธนาคาร", "ตลาด", "ร้านค้า"], answer: 1, explanation: "'สิ่งของ : สถานที่เก็บรักษา (สถาบัน)'\nหนังสือเก็บที่ห้องสมุด → เงินเก็บที่ธนาคาร" },
  { id: 0, question: "ตา : มอง :: หู : ?", choices: ["เสียง", "ฟัง", "ดนตรี", "หูฟัง"], answer: 1, explanation: "'อวัยวะ : การทำหน้าที่'\nตาใช้มอง → หูใช้ฟัง" },
  { id: 0, question: "เมล็ด : ต้นไม้ :: ไข่ : ?", choices: ["อาหาร", "นก", "รัง", "ฟาร์ม"], answer: 1, explanation: "'จุดเริ่มต้น : สิ่งที่เติบโตมา'\nเมล็ดเติบโตเป็นต้นไม้ → ไข่ฟักเป็นนก" },
  { id: 0, question: "หมึก : ทะเล :: ช้าง : ?", choices: ["งาช้าง", "ป่า", "สวนสัตว์", "แอฟริกา"], answer: 1, explanation: "'สัตว์ : ถิ่นที่อยู่ตามธรรมชาติ'\nหมึกอยู่ในทะเล → ช้างอยู่ในป่า" },
  { id: 0, question: "แพทย์ : รักษา :: ทนายความ : ?", choices: ["ศาล", "ว่าความ", "กฎหมาย", "จำเลย"], answer: 1, explanation: "'อาชีพ : กริยาที่ทำ'\nแพทย์ทำหน้าที่รักษา → ทนายความทำหน้าที่ว่าความ" },
  { id: 0, question: "กล้วย : ผลไม้ :: กะเพรา : ?", choices: ["อาหาร", "ผัก", "เครื่องเทศ", "สมุนไพร"], answer: 2, explanation: "'สิ่งเฉพาะ : หมวดหมู่'\nกล้วยเป็นผลไม้ → กะเพราเป็นเครื่องเทศ" },
  { id: 0, question: "ดวงอาทิตย์ : กลางวัน :: ดวงจันทร์ : ?", choices: ["ดาว", "กลางคืน", "มืด", "ท้องฟ้า"], answer: 1, explanation: "'ดวงดาว : ช่วงเวลาที่มองเห็น'\nดวงอาทิตย์เห็นกลางวัน → ดวงจันทร์เห็นกลางคืน" },
];

// =============================================
// ภาษาไทย: การเรียงประโยค
// =============================================
const sentenceOrderPool: Question[] = [
  { id: 0, question: "จงเรียงลำดับประโยคต่อไปนี้:\n1) ทำให้เศรษฐกิจเติบโตอย่างยั่งยืน\n2) รัฐบาลมีนโยบายส่งเสริมการลงทุน\n3) โดยการให้สิทธิประโยชน์ทางภาษี\n4) แก่นักลงทุนทั้งในและต่างประเทศ", choices: ["2-3-4-1", "2-4-3-1", "1-2-3-4", "2-1-3-4"], answer: 0, explanation: "2) ประเด็นหลัก → 3) วิธีการ → 4) กลุ่มเป้าหมาย → 1) ผลลัพธ์" },
  { id: 0, question: "จงเรียงลำดับประโยคต่อไปนี้:\n1) จึงต้องหาทางป้องกัน\n2) โลกร้อนเป็นปัญหาสิ่งแวดล้อม\n3) ที่ส่งผลกระทบต่อทุกประเทศ\n4) โดยลดการปล่อยก๊าซเรือนกระจก", choices: ["2-3-1-4", "1-2-3-4", "2-1-4-3", "2-3-4-1"], answer: 0, explanation: "2) ประเด็นหลัก → 3) ขยายความ → 1) แนวทาง → 4) วิธีการ" },
  { id: 0, question: "จงเรียงลำดับประโยคต่อไปนี้:\n1) ช่วยพัฒนาคุณภาพชีวิตของประชาชน\n2) เทคโนโลยีสารสนเทศ\n3) ได้เข้ามามีบทบาทสำคัญ\n4) ในด้านการศึกษาและสาธารณสุข", choices: ["2-3-4-1", "2-4-3-1", "1-2-3-4", "2-3-1-4"], answer: 0, explanation: "2) ประธาน → 3) กริยา → 4) ขอบเขต → 1) ผลลัพธ์" },
  { id: 0, question: "จงเรียงลำดับประโยคต่อไปนี้:\n1) เป็นสิ่งที่ทุกคนควรตระหนัก\n2) การออมเงิน\n3) เพราะจะช่วยสร้างความมั่นคง\n4) ทางการเงินในระยะยาว", choices: ["2-1-3-4", "2-3-4-1", "1-2-3-4", "2-4-1-3"], answer: 0, explanation: "2) ประเด็นหลัก → 1) ขยายความ → 3) เหตุผล → 4) ขยายเหตุผล" },
  { id: 0, question: "จงเรียงลำดับประโยคต่อไปนี้:\n1) ส่งผลต่อสุขภาพร่างกาย\n2) การนอนหลับไม่เพียงพอ\n3) รวมถึงสมาธิในการทำงาน\n4) และสุขภาพจิตใจ", choices: ["2-1-4-3", "2-3-1-4", "1-2-3-4", "2-4-1-3"], answer: 0, explanation: "2) ประเด็นหลัก → 1) ผลกระทบ 1 → 4) ผลกระทบ 2 → 3) ผลกระทบ 3" },
  { id: 0, question: "จงเรียงลำดับประโยคต่อไปนี้:\n1) เพื่อลดปริมาณขยะ\n2) หลายประเทศออกกฎหมาย\n3) ที่ส่งผลกระทบต่อสิ่งแวดล้อม\n4) ห้ามใช้ถุงพลาสติก", choices: ["2-4-1-3", "2-1-3-4", "1-2-3-4", "2-3-4-1"], answer: 0, explanation: "2) ประธาน → 4) สิ่งที่ทำ → 1) จุดประสงค์ → 3) ขยายความ" },
];

// =============================================
// ภาษาไทย: บทความจับใจความ
// =============================================
const readingThaiPool: Question[] = [
  { id: 0, question: "\"การพัฒนาที่ยั่งยืนหมายถึงการพัฒนาที่สนองความต้องการของคนรุ่นปัจจุบัน โดยไม่ทำลายขีดความสามารถในการสนองความต้องการของคนรุ่นอนาคต\"\n\nข้อใดสรุปใจความสำคัญได้ถูกต้อง?", choices: ["การพัฒนาต้องคำนึงถึงทั้งปัจจุบันและอนาคต", "การพัฒนาต้องเน้นคนรุ่นปัจจุบันเท่านั้น", "การพัฒนาต้องหยุดเพื่อรักษาทรัพยากร", "การพัฒนาเป็นสิ่งที่ไม่จำเป็น"], answer: 0, explanation: "การพัฒนาที่ยั่งยืนต้อง:\n1. สนองความต้องการปัจจุบัน\n2. ไม่ทำลายขีดความสามารถของอนาคต\nจึงต้องคำนึงถึงทั้งสองส่วน" },
  { id: 0, question: "\"การอ่านหนังสือเป็นประจำไม่เพียงแต่ช่วยเพิ่มพูนความรู้ แต่ยังช่วยพัฒนาทักษะการคิดวิเคราะห์ ขยายจินตนาการ และช่วยลดความเครียดได้อีกด้วย\"\n\nข้อใดคือใจความสำคัญ?", choices: ["การอ่านหนังสือมีประโยชน์หลายด้าน", "การอ่านช่วยลดความเครียดเท่านั้น", "คนที่อ่านหนังสือจะฉลาดกว่าเสมอ", "การอ่านหนังสือเป็นงานอดิเรกที่ดีที่สุด"], answer: 0, explanation: "บทความกล่าวถึงประโยชน์ของการอ่านหลายด้าน: เพิ่มความรู้ พัฒนาทักษะคิด ขยายจินตนาการ ลดเครียด" },
  { id: 0, question: "\"ปัจจุบันปัญหาฝุ่น PM2.5 ทวีความรุนแรงขึ้นในหลายจังหวัด สาเหตุหลักมาจากการเผาไร่ การจราจร และโรงงานอุตสาหกรรม ส่งผลกระทบต่อสุขภาพของประชาชนโดยเฉพาะระบบทางเดินหายใจ\"\n\nข้อใดไม่ใช่สาเหตุของ PM2.5 ตามบทความ?", choices: ["การเผาไร่", "การจราจร", "ภัยแล้ง", "โรงงานอุตสาหกรรม"], answer: 2, explanation: "บทความระบุสาเหตุ 3 ประการ: การเผาไร่ การจราจร โรงงานอุตสาหกรรม\n'ภัยแล้ง' ไม่ได้ถูกกล่าวถึง" },
  { id: 0, question: "\"แม้เทคโนโลยี AI จะมีประโยชน์มหาศาล แต่ก็มีข้อควรระวังในเรื่องความเป็นส่วนตัว การแทนที่แรงงานมนุษย์ และอคติที่อาจแฝงอยู่ในระบบ สังคมจึงต้องมีกฎระเบียบที่เหมาะสม\"\n\nผู้เขียนมีจุดยืนอย่างไร?", choices: ["ต่อต้าน AI ทุกรูปแบบ", "สนับสนุน AI โดยไม่มีเงื่อนไข", "สนับสนุน AI แต่ต้องมีกฎระเบียบกำกับ", "ไม่แสดงจุดยืนใดๆ"], answer: 2, explanation: "ผู้เขียนยอมรับว่า AI มีประโยชน์ (ไม่ได้ต่อต้าน) แต่ชี้ข้อควรระวังและเสนอให้มีกฎระเบียบ → สนับสนุนแต่มีเงื่อนไข" },
  { id: 0, question: "\"น้ำเป็นทรัพยากรที่มีจำกัด ทุกคนควรช่วยกันประหยัดน้ำ ไม่ว่าจะเป็นการปิดก๊อกน้ำเมื่อไม่ใช้ ซ่อมท่อน้ำที่รั่ว หรือนำน้ำที่ใช้แล้วมารดน้ำต้นไม้\"\n\nจุดประสงค์ของผู้เขียนคือข้อใด?", choices: ["ให้ข้อมูลเรื่องวิกฤตน้ำ", "ชักชวนให้ประหยัดน้ำ", "เล่าประสบการณ์ส่วนตัว", "วิจารณ์นโยบายน้ำ"], answer: 1, explanation: "ผู้เขียนให้แนวทางปฏิบัติ (ปิดก๊อก ซ่อมท่อ นำน้ำมารดต้นไม้) → จุดประสงค์คือชักชวนให้ประหยัดน้ำ" },
  { id: 0, question: "\"งานวิจัยพบว่าการออกกำลังกายอย่างสม่ำเสมอช่วยลดความเสี่ยงต่อโรคหัวใจ เบาหวาน และภาวะซึมเศร้า ผู้เชี่ยวชาญแนะนำให้ออกกำลังกายอย่างน้อยสัปดาห์ละ 150 นาที\"\n\nข้อใดสรุปได้ถูกต้อง?", choices: ["การออกกำลังกายช่วยลดความเสี่ยงของหลายโรค", "ต้องออกกำลังกายทุกวันจึงจะได้ผล", "การออกกำลังกายรักษาโรคหัวใจได้", "ออกกำลังกาย 150 นาทีต่อวัน"], answer: 0, explanation: "บทความกล่าวว่า 'ลดความเสี่ยง' ไม่ใช่ 'รักษาได้'\nและ 150 นาทีต่อสัปดาห์ ไม่ใช่ต่อวัน" },
];

// =============================================
// ภาษาไทย: การใช้ภาษา
// =============================================
const thaiUsagePool: Question[] = [
  { id: 0, question: "ข้อใดเป็นประโยคที่ใช้ภาษาได้ถูกต้อง?", choices: ["เขาให้ความสำคัญกับการศึกษาเป็นอย่างมาก", "เขาให้ความสำคัญในเรื่องการศึกษามาก", "เขาให้ความสำคัญต่อในเรื่องการศึกษามาก", "เขาให้ความสำคัญถึงการศึกษามาก"], answer: 0, explanation: "'ให้ความสำคัญ' ต้องตามด้วย 'กับ' หรือ 'แก่'" },
  { id: 0, question: "ข้อใดใช้คำเชื่อมได้ถูกต้อง?", choices: ["แม้ว่าฝนตก แต่เขาก็ยังมาทำงาน", "เพราะฝนตก แต่เขาก็ยังมาทำงาน", "ถึงแม้ฝนตก เพราะเขาก็ยังมาทำงาน", "ด้วยว่าฝนตก จึงเขาก็ยังมาทำงาน"], answer: 0, explanation: "'แม้ว่า...แต่...' เป็นสันธานที่ใช้เชื่อมประโยคที่มีเนื้อหาขัดแย้งกัน" },
  { id: 0, question: "คำใดสะกดถูกต้อง?", choices: ["บรรยากาศ", "บันยากาศ", "บรรยากาส", "บันยากาส"], answer: 0, explanation: "'บรรยากาศ' สะกดด้วย รร (ร หัน) + ย + ศ (ศ ศาลา)" },
  { id: 0, question: "สำนวน 'น้ำขึ้นให้รีบตัก' หมายถึงข้อใด?", choices: ["มีโอกาสดีต้องรีบคว้า", "ต้องประหยัดน้ำ", "ต้องรีบทำงานให้เสร็จ", "ต้องเตรียมพร้อมก่อนฝนตก"], answer: 0, explanation: "'น้ำขึ้นให้รีบตัก' เป็นสำนวนที่หมายถึง เมื่อมีโอกาสดีหรือจังหวะเหมาะก็ต้องรีบคว้าไว้" },
  { id: 0, question: "ข้อใดเป็นประโยคความรวม?", choices: ["เขาร้องเพลงและเธอเต้นรำ", "เขาร้องเพลงเพราะมาก", "เขากำลังร้องเพลง", "เพลงที่เขาร้องไพเราะมาก"], answer: 0, explanation: "ประโยคความรวม = มีประโยคหลัก 2 ประโยคเชื่อมด้วยสันธาน 'และ'\n'เขาร้องเพลง' + 'เธอเต้นรำ'" },
];

// =============================================
// ภาษาอังกฤษ: Grammar
// =============================================
const grammarPool: Question[] = [
  { id: 0, question: "If I ______ enough time, I will join the meeting.", choices: ["have", "had", "will have", "having"], answer: 0, explanation: "If-Clause แบบที่ 1: If + Present Simple, will + V1\nดังนั้นใช้ 'have'" },
  { id: 0, question: "She ______ in this company since 2015.", choices: ["works", "worked", "has worked", "is working"], answer: 2, explanation: "'since 2015' → Present Perfect Tense: has/have + V3 = 'has worked'" },
  { id: 0, question: "The report ______ by the committee last week.", choices: ["approved", "was approved", "has approved", "approving"], answer: 1, explanation: "Passive Voice + 'last week' → Past Simple Passive: was + V3 = 'was approved'" },
  { id: 0, question: "Neither the manager nor the employees ______ satisfied.", choices: ["is", "was", "are", "has been"], answer: 2, explanation: "Neither...nor: กริยาผันตามประธานตัวหลัง 'employees' (พหูพจน์) → 'are'" },
  { id: 0, question: "I wish I ______ a car.", choices: ["have", "had", "will have", "am having"], answer: 1, explanation: "Wish + Past Simple: ปรารถนาสิ่งตรงข้ามปัจจุบัน → 'had'" },
  { id: 0, question: "By the time you arrive, I ______ dinner.", choices: ["cook", "cooked", "will have cooked", "am cooking"], answer: 2, explanation: "'By the time + Present Simple' → Future Perfect: will have + V3" },
  { id: 0, question: "He suggested that she ______ the report.", choices: ["rewrites", "rewrite", "rewrote", "rewriting"], answer: 1, explanation: "suggest/recommend + that + S + V1 (Subjunctive mood) → 'rewrite' ไม่เติม s" },
  { id: 0, question: "The movie was ______ interesting than I expected.", choices: ["much", "more", "most", "very"], answer: 1, explanation: "เปรียบเทียบ 2 สิ่ง + than → Comparative: 'more interesting than'" },
  { id: 0, question: "______ the heavy rain, the event was carried out.", choices: ["Despite", "Because", "Although", "Since"], answer: 0, explanation: "'Despite' + noun phrase (the heavy rain)\n'Although' ต้องตามด้วยประโยค clause" },
  { id: 0, question: "She asked me where I ______.", choices: ["live", "lived", "living", "am live"], answer: 1, explanation: "Reported speech: Direct → Indirect ต้องเปลี่ยน tense ลงหนึ่งขั้น\n'Where do you live?' → 'where I lived'" },
  { id: 0, question: "The children ______ in the park when it started raining.", choices: ["play", "played", "were playing", "have played"], answer: 2, explanation: "เหตุการณ์กำลังเกิด + เหตุการณ์แทรก → Past Continuous + Past Simple\n'were playing' + 'started'" },
  { id: 0, question: "If I ______ you, I would accept the offer.", choices: ["am", "was", "were", "be"], answer: 2, explanation: "If-Clause แบบที่ 2 (สมมติไม่จริง): If + were (ใช้ 'were' กับทุกประธาน)" },
  { id: 0, question: "This is the man ______ helped me yesterday.", choices: ["who", "which", "whom", "whose"], answer: 0, explanation: "'who' ใช้แทนคน ทำหน้าที่เป็นประธาน (helped)" },
  { id: 0, question: "She ______ to the gym every morning.", choices: ["go", "goes", "going", "gone"], answer: 1, explanation: "ประธานเอกพจน์ (She) + every morning (ประจำ) → Present Simple: 'goes'" },
  { id: 0, question: "The letter ______ already ______ when I arrived.", choices: ["has...sent", "had...been sent", "was...sending", "is...sent"], answer: 1, explanation: "เหตุการณ์เกิดก่อนอดีตอีกอัน → Past Perfect Passive: 'had been sent'" },
];

// =============================================
// ภาษาอังกฤษ: Vocabulary
// =============================================
const vocabPool: Question[] = [
  { id: 0, question: "Which word is closest in meaning to 'efficient'?", choices: ["wasteful", "effective with little waste", "uncertain", "expensive"], answer: 1, explanation: "'Efficient' = มีประสิทธิภาพ ทำงานได้ดีโดยไม่สิ้นเปลือง = 'effective with little waste'" },
  { id: 0, question: "The word 'transparent' is closest in meaning to:", choices: ["hidden", "clear and open", "complicated", "expensive"], answer: 1, explanation: "'Transparent' = โปร่งใส ชัดเจน = 'clear and open'" },
  { id: 0, question: "The company decided to ______ the project due to budget constraints.", choices: ["postpone", "promote", "proceed", "produce"], answer: 0, explanation: "'budget constraints' = ข้อจำกัดด้านเงิน → 'postpone' = เลื่อนออกไป" },
  { id: 0, question: "\"The deadline has been ______ to next Friday.\"", choices: ["extended", "expanded", "exposed", "extracted"], answer: 0, explanation: "'extended' = ขยายเวลา ใช้กับ deadline\nexpanded = ขยายขนาด, exposed = เปิดเผย" },
  { id: 0, question: "Which word means 'to make something better'?", choices: ["improve", "impose", "import", "imply"], answer: 0, explanation: "'improve' = ปรับปรุงให้ดีขึ้น\nimpose = บังคับ, import = นำเข้า, imply = สื่อเป็นนัย" },
  { id: 0, question: "The ______ of the new policy led to many changes.", choices: ["implementation", "implication", "importation", "imagination"], answer: 0, explanation: "'implementation' = การนำไปปฏิบัติ ใช้กับ policy\nimplication = นัยยะ, importation = การนำเข้า" },
  { id: 0, question: "'Collaborate' is closest in meaning to:", choices: ["compete", "work together", "surrender", "disagree"], answer: 1, explanation: "'Collaborate' = ร่วมมือกัน ทำงานร่วมกัน = 'work together'" },
  { id: 0, question: "The government ______ new regulations last month.", choices: ["enacted", "enacted", "deleted", "ignored"], answer: 0, explanation: "'enacted' = ประกาศใช้ (กฎหมาย/ระเบียบ) ตรงกับ regulations" },
  { id: 0, question: "'Inevitable' means something that:", choices: ["can be avoided", "is certain to happen", "is unexpected", "is expensive"], answer: 1, explanation: "'Inevitable' = หลีกเลี่ยงไม่ได้ ต้องเกิดขึ้นแน่นอน = 'certain to happen'" },
  { id: 0, question: "She showed great ______ during the crisis.", choices: ["resilience", "resistance", "reluctance", "relevance"], answer: 0, explanation: "'resilience' = ความยืดหยุ่น ความสามารถในการฟื้นตัว\nresistance = ต่อต้าน, reluctance = ลังเล" },
];

// =============================================
// ภาษาอังกฤษ: Conversation
// =============================================
const conversationPool: Question[] = [
  { id: 0, question: "A: \"Would you mind opening the window?\"\nB: \"______\"", choices: ["Not at all.", "Yes, I would.", "No, thank you.", "I don't think so."], answer: 0, explanation: "'Would you mind...?' ถ้ายินดี → 'Not at all.' (ไม่รังเกียจเลย)" },
  { id: 0, question: "A: \"I'm terribly sorry for being late.\"\nB: \"______\"", choices: ["Never mind.", "You're right.", "Thank you.", "I disagree."], answer: 0, explanation: "ตอบรับคำขอโทษ → 'Never mind.' = ไม่เป็นไร" },
  { id: 0, question: "A: \"Could you tell me the way to the station?\"\nB: \"______\"", choices: ["Sure. Go straight and turn left.", "I'm fine, thanks.", "No, I couldn't.", "Yes, I could."], answer: 0, explanation: "ถูกถามทาง → ให้ข้อมูลบอกทาง" },
  { id: 0, question: "A: \"How about going to the movies tonight?\"\nB: \"______\"", choices: ["That sounds great!", "Yes, it was.", "No, thank you for coming.", "I'm from Bangkok."], answer: 0, explanation: "ถูกชวน → ตอบรับ: 'That sounds great!'" },
  { id: 0, question: "A: \"Congratulations on your promotion!\"\nB: \"______\"", choices: ["Thank you so much.", "I'm sorry to hear that.", "Never mind.", "You're welcome."], answer: 0, explanation: "ถูกแสดงความยินดี → ตอบขอบคุณ" },
  { id: 0, question: "A: \"Would you like some more coffee?\"\nB: \"______\"", choices: ["No, thanks. I've had enough.", "Yes, I like.", "No, I wouldn't.", "Yes, please give."], answer: 0, explanation: "'Would you like...?' → ตอบสุภาพ: 'No, thanks. I've had enough.'" },
];

// =============================================
// ภาษาอังกฤษ: Reading
// =============================================
const readingEngPool: Question[] = [
  { id: 0, question: "\"Remote work has become popular after the pandemic. Many companies found employees can be just as productive at home. However, challenges remain, such as maintaining team cohesion and preventing burnout.\"\n\nWhat is the main idea?", choices: ["Remote work has benefits but also challenges.", "Remote work is perfect.", "Companies should stop remote work.", "Employees prefer offices."], answer: 0, explanation: "บทความกล่าวถึงทั้งข้อดี (productive) และข้อเสีย (challenges) ของ remote work" },
  { id: 0, question: "\"Studies show that regular exercise can reduce the risk of heart disease by up to 30%. Even moderate activities like walking for 30 minutes a day can make a significant difference.\"\n\nWhat can be inferred?", choices: ["You don't need intense exercise to benefit.", "Only running prevents heart disease.", "Exercise increases heart disease risk.", "30 minutes is too short for exercise."], answer: 0, explanation: "'Even moderate activities like walking' → ไม่จำเป็นต้องออกกำลังกายหนัก" },
  { id: 0, question: "\"The new recycling program requires residents to separate waste into three categories: organic, recyclable, and general waste. Failure to comply may result in fines.\"\n\nHow many categories must waste be separated into?", choices: ["Two", "Three", "Four", "Five"], answer: 1, explanation: "ระบุชัดเจน: 'three categories: organic, recyclable, and general waste'" },
  { id: 0, question: "\"While social media connects people globally, excessive use has been linked to increased anxiety, depression, and sleep disorders, especially among teenagers.\"\n\nThe passage suggests that social media:", choices: ["has both positive and negative effects", "is entirely harmful", "should be banned for teenagers", "improves mental health"], answer: 0, explanation: "Positive: 'connects people globally'\nNegative: 'anxiety, depression, sleep disorders'\n→ มีทั้งข้อดีและข้อเสีย" },
];

// =============================================
// วิชาข้าราชการที่ดี
// =============================================
const civilServantPool: Question[] = [
  { id: 0, question: "ตามพระราชบัญญัติระเบียบบริหารราชการแผ่นดิน พ.ศ. 2534 การจัดระเบียบบริหารราชการแผ่นดินแบ่งออกเป็นกี่ส่วน?", choices: ["2 ส่วน", "3 ส่วน", "4 ส่วน", "5 ส่วน"], answer: 1, explanation: "แบ่งเป็น 3 ส่วน:\n1. ราชการส่วนกลาง\n2. ราชการส่วนภูมิภาค\n3. ราชการส่วนท้องถิ่น" },
  { id: 0, question: "หลักธรรมาภิบาล (Good Governance) มีกี่หลัก?", choices: ["4 หลัก", "5 หลัก", "6 หลัก", "7 หลัก"], answer: 2, explanation: "6 หลัก: นิติธรรม คุณธรรม ความโปร่งใส การมีส่วนร่วม ความรับผิดชอบ ความคุ้มค่า" },
  { id: 0, question: "ผลประโยชน์ทับซ้อน (Conflict of Interest) หมายถึงข้อใด?", choices: ["การใช้ตำแหน่งเพื่อประโยชน์ส่วนตัว", "การทำงานล่วงเวลา", "การได้เงินเดือนเพิ่ม", "การเลื่อนตำแหน่ง"], answer: 0, explanation: "Conflict of Interest = ผลประโยชน์ส่วนตัวขัดแย้งกับส่วนรวม ทำให้ตัดสินใจไม่เป็นกลาง" },
  { id: 0, question: "การบริหารกิจการบ้านเมืองที่ดี มีเป้าหมายสูงสุดคือข้อใด?", choices: ["เกิดประโยชน์สุขของประชาชน", "มุ่งเน้นกำไรสูงสุด", "เน้นการแข่งขันกับเอกชน", "ลดจำนวนข้าราชการ"], answer: 0, explanation: "ตาม พ.ร.ฎ. หลักเกณฑ์ฯบ้านเมืองที่ดี พ.ศ. 2546 เป้าหมายสูงสุดคือ 'ประโยชน์สุขของประชาชน'" },
  { id: 0, question: "'คำสั่งทางปกครอง' หมายถึงข้อใด?", choices: ["การใช้อำนาจตามกฎหมายที่มีผลสร้างนิติสัมพันธ์", "คำสั่งผู้บังคับบัญชาต่อผู้ใต้บังคับบัญชา", "ระเบียบภายในหน่วยงาน", "ประกาศรับสมัครงาน"], answer: 0, explanation: "คำสั่งทางปกครอง = การใช้อำนาจตามกฎหมายที่มีผลก่อ เปลี่ยนแปลง โอน สงวน ระงับสิทธิหรือหน้าที่ของบุคคล" },
  { id: 0, question: "ข้าราชการที่กระทำผิดวินัยอย่างร้ายแรง จะได้รับโทษสถานใด?", choices: ["ภาคทัณฑ์", "ตัดเงินเดือน", "ลดเงินเดือน", "ปลดออกหรือไล่ออก"], answer: 3, explanation: "วินัยร้ายแรง → ปลดออก หรือ ไล่ออก\nภาคทัณฑ์ ตัดเงินเดือน ลดเงินเดือน → วินัยไม่ร้ายแรง" },
  { id: 0, question: "จริยธรรมข้าราชการตามประมวลจริยธรรมข้าราชการพลเรือน ข้อใดถูกต้อง?", choices: ["ต้องยึดมั่นในความถูกต้อง เป็นธรรม ชอบด้วยกฎหมาย", "รับของขวัญจากผู้มาติดต่อได้", "ไม่จำเป็นต้องเปิดเผยข้อมูล", "เน้นผลประโยชน์ส่วนตัวก่อน"], answer: 0, explanation: "ประมวลจริยธรรมกำหนดให้ข้าราชการต้องยึดมั่นในความถูกต้อง เป็นธรรม ชอบด้วยกฎหมาย" },
  { id: 0, question: "นายกรัฐมนตรีเป็นผู้บังคับบัญชาข้าราชการฝ่ายใด?", choices: ["ฝ่ายบริหาร", "ฝ่ายนิติบัญญัติ", "ฝ่ายตุลาการ", "ทุกฝ่าย"], answer: 0, explanation: "นายกรัฐมนตรีบังคับบัญชาข้าราชการฝ่ายบริหาร ตามหลักแบ่งแยกอำนาจ" },
  { id: 0, question: "การบริหารราชการส่วนภูมิภาคประกอบด้วยหน่วยงานใด?", choices: ["กระทรวง และกรม", "จังหวัด และอำเภอ", "อบจ. เทศบาล และ อบต.", "กระทรวง จังหวัด และเทศบาล"], answer: 1, explanation: "ราชการส่วนภูมิภาค = จังหวัด + อำเภอ\nส่วนกลาง = กระทรวง/กรม, ส่วนท้องถิ่น = อบจ./เทศบาล/อบต." },
  { id: 0, question: "หลักความโปร่งใส (Transparency) หมายถึงข้อใด?", choices: ["เปิดเผยข้อมูลที่ไม่เป็นความลับให้ประชาชนทราบ", "ใช้กระจกในอาคารสำนักงาน", "บริหารงานโดยไม่ต้องมีการตรวจสอบ", "เก็บข้อมูลเป็นความลับทั้งหมด"], answer: 0, explanation: "ความโปร่งใส = เปิดเผยข้อมูลข่าวสาร ตรวจสอบได้ ประชาชนเข้าถึงข้อมูลที่ไม่เป็นความลับ" },
  { id: 0, question: "คำสั่งทางปกครองที่ไม่ถูกต้อง ผู้ได้รับผลกระทบทำอย่างไรได้?", choices: ["อุทธรณ์ภายในระยะเวลาที่กำหนด", "ไม่สามารถทำอะไรได้", "ต้องปฏิบัติตามทันที", "แจ้งตำรวจ"], answer: 0, explanation: "ตาม พ.ร.บ. วิธีปฏิบัติราชการทางปกครอง สามารถอุทธรณ์ภายใน 15 วัน" },
  { id: 0, question: "ค่านิยมหลักของข้าราชการ I AM READY ข้อใดถูกต้อง?", choices: ["ซื่อสัตย์ สุจริต มีจิตสำนึกที่ดี รับผิดชอบ", "ทำงานเร็ว ไม่สนใจกฎระเบียบ", "เน้นผลกำไรเป็นหลัก", "ทำงานตามคำสั่งอย่างเดียว"], answer: 0, explanation: "I AM READY:\nI=Integrity, A=Activeness, M=Morality\nR=Relevancy, E=Efficiency, A=Accountability, D=Democracy, Y=Yield" },
  { id: 0, question: "เจ้าหน้าที่กระทำละเมิดต่อบุคคลภายนอกในการปฏิบัติหน้าที่ ใครรับผิดชอบ?", choices: ["เจ้าหน้าที่รับผิดชอบเอง", "หน่วยงานของรัฐ", "ประชาชนรับผิดชอบเอง", "ไม่มีใครรับผิดชอบ"], answer: 1, explanation: "ตาม พ.ร.บ. ความรับผิดทางละเมิดฯ หน่วยงานของรัฐต้องรับผิด แต่อาจไล่เบี้ยเจ้าหน้าที่ได้" },
  { id: 0, question: "หลักนิติธรรม (Rule of Law) หมายถึงข้อใด?", choices: ["ปฏิบัติตามกฎหมายที่ถูกต้อง เป็นธรรม", "ออกกฎหมายให้มากที่สุด", "บังคับใช้กฎหมายเข้มงวดโดยไม่คำนึงถึงความเป็นธรรม", "ให้ข้าราชการมีอำนาจเหนือกฎหมาย"], answer: 0, explanation: "นิติธรรม = ทุกคนอยู่ใต้กฎหมาย กฎหมายต้องถูกต้อง เป็นธรรม ใช้บังคับเท่าเทียม" },
  { id: 0, question: "ข้อใดไม่ใช่โทษทางวินัยของข้าราชการพลเรือน?", choices: ["ภาคทัณฑ์", "ตัดเงินเดือน", "จำคุก", "ปลดออก"], answer: 2, explanation: "โทษทางวินัย 5 สถาน: ภาคทัณฑ์ ตัดเงินเดือน ลดเงินเดือน ปลดออก ไล่ออก\n'จำคุก' เป็นโทษทางอาญา" },
  { id: 0, question: "ผู้ว่าราชการจังหวัดเป็นหัวหน้าบริหารราชการส่วนใด?", choices: ["ส่วนกลาง", "ส่วนภูมิภาค (ระดับจังหวัด)", "ส่วนท้องถิ่น", "รัฐวิสาหกิจ"], answer: 1, explanation: "ผู้ว่าราชการจังหวัด = หัวหน้าบริหารราชการส่วนภูมิภาค ระดับจังหวัด" },
  { id: 0, question: "ข้อใดเป็นหลักการสำคัญของ พ.ร.บ. วิธีปฏิบัติราชการทางปกครอง?", choices: ["ให้ความเป็นธรรมแก่ผู้ถูกกระทบจากคำสั่งทางปกครอง", "ให้อำนาจเจ้าหน้าที่โดยไม่มีขอบเขต", "ห้ามประชาชนอุทธรณ์คำสั่งของรัฐ", "ลดจำนวนข้าราชการ"], answer: 0, explanation: "พ.ร.บ. วิธีปฏิบัติราชการทางปกครอง มุ่งให้ความเป็นธรรมแก่ผู้ถูกกระทบ กำหนดขั้นตอน สิทธิอุทธรณ์" },
  { id: 0, question: "มาตรฐานทางจริยธรรมสำหรับผู้ดำรงตำแหน่งทางการเมือง ข้อใดถูกต้อง?", choices: ["ต้องเปิดเผยทรัพย์สินและหนี้สิน", "ไม่ต้องแสดงบัญชีทรัพย์สิน", "มีสิทธิถือหุ้นในบริษัทรับสัมปทานรัฐ", "ไม่ต้องเปิดเผยรายได้"], answer: 0, explanation: "ผู้ดำรงตำแหน่งทางการเมืองต้องเปิดเผยบัญชีทรัพย์สินและหนี้สินต่อ ป.ป.ช." },
];

// =============================================
// Export all pools
// =============================================
export const questionPools: PoolCategory[] = [
  // Analytical
  { topic: "อุปมาอุปไมย",    category: "analytical", questions: analogyPool },
  { topic: "การเรียงประโยค",  category: "analytical", questions: sentenceOrderPool },
  { topic: "บทความ (ไทย)",    category: "analytical", questions: readingThaiPool },
  { topic: "การใช้ภาษาไทย",   category: "analytical", questions: thaiUsagePool },
  // English
  { topic: "Grammar",        category: "english", questions: grammarPool },
  { topic: "Vocabulary",     category: "english", questions: vocabPool },
  { topic: "Conversation",   category: "english", questions: conversationPool },
  { topic: "Reading",        category: "english", questions: readingEngPool },
  // Civil servant
  { topic: "กฎหมาย+จริยธรรม",  category: "civil-servant", questions: civilServantPool },
];
