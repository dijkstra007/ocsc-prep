# เตรียมสอบ ก.พ. ภาค ก (ocsc-prep)

เว็บฝึกข้อสอบจำลอง **ก.พ. ภาค ก** สามวิชา: คิดวิเคราะห์ ภาษาอังกฤษ และความรู้ลักษณะข้าราชการที่ดี พร้อมเฉลย โหมดสอบเต็มชุด 200 คะแนน และทบทวนข้อที่ผิด

ข้อสอบในเว็บเป็นแบบฝึกฝน ไม่ใช่ข้อสอบจริงจากสำนักงาน ก.พ.

## วิธีรัน

```bash
npm install
npm run dev
```

เปิดที่ URL ที่ Vite แสดง (ค่าเริ่มต้น `http://localhost:5173`) แอปใช้ hash routing (`#/`, `#/quiz/english`, `#/exam`) เพื่อให้ deploy บน GitHub Pages ได้

คำสั่งอื่น:

```bash
npm run check      # TypeScript
npm run test:run   # Vitest
npm run build      # ไฟล์สแตติกใน dist/
npm run preview    # ดูผล build
```

## Deploy (GitHub Pages)

1. `npm run build`
2. นำเนื้อหาใน `dist/` ขึ้น branch `gh-pages` (หรือ GitHub Actions Pages จาก `dist/`)

`vite.config.ts` ตั้ง `base: "./"` แล้ว จึงใช้ path แบบ relative ได้

## โครงสร้างหลัก

- `client/src/data/quiz-manager.ts` — ประกอบชุดข้อ 15 ข้อ / สอบ 45 ข้อ
- `client/src/data/template-engine.ts` — โจทย์คณิต/อนุกรมสุ่มตัวเลข
- `client/src/data/pools/` — คลังข้อที่ไม่ใช่คำนวณ
- `client/src/lib/score.ts` — คะแนนร้อยละ คะแนนถ่วงน้ำหนัก เกณฑ์ ป.ตรี/ป.โท
- `client/src/lib/progress.ts` — บันทึกความคืบหน้าใน `localStorage`

## เกณฑ์ผ่าน (จำลอง)

| วิชา | ป.ตรี | ป.โท |
| --- | --- | --- |
| คิดวิเคราะห์ | 60% | 65% |
| ภาษาอังกฤษ | 50% | 50% |
| ข้าราชการที่ดี | 60% | 60% |
