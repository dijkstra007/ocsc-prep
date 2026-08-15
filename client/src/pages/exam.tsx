import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Check, Trophy } from "lucide-react";
import { collectMissed, generateAllQuizzes } from "@/data/quiz-manager";
import type { QuizCategory } from "@/data/questions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuestionCard } from "@/components/QuestionCard";
import { useCountdown } from "@/hooks/use-countdown";
import { loadProgress, recordExamAttempt, saveProgress } from "@/lib/progress";
import {
  correctCount,
  examPassed,
  EXAM_DURATION_SECONDS,
  formatClock,
  passed,
  percent,
  TOTAL_EXAM_SCORE,
  weightedPoints,
} from "@/lib/score";

type AnswerMap = Record<string, Record<number, number | null>>;

function emptyAnswers(quizzes: QuizCategory[]): AnswerMap {
  return Object.fromEntries(quizzes.map((q) => [q.id, {}]));
}

const tabLabel: Record<string, string> = {
  analytical: "คิดวิเคราะห์",
  english: "อังกฤษ",
  "civil-servant": "ข้าราชการ",
};

export default function Exam() {
  const degree = loadProgress().degree;
  const [version, setVersion] = useState(0);
  const quizzes = useMemo(() => generateAllQuizzes(degree), [degree, version]);
  const [activeId, setActiveId] = useState(quizzes[0]?.id ?? "analytical");
  const [answers, setAnswers] = useState<AnswerMap>(() => emptyAnswers(quizzes));
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const finish = () => {
    if (submitted) return;
    setSubmitted(true);
    const missed = quizzes.flatMap((quiz) => collectMissed(quiz.id, quiz.questions, answers[quiz.id] ?? {}));
    const points = quizzes.reduce((sum, quiz) => {
      const correct = correctCount(quiz.questions, answers[quiz.id] ?? {});
      return sum + weightedPoints(correct, quiz.questions.length, quiz.totalScore);
    }, 0);
    saveProgress(
      recordExamAttempt(loadProgress(), {
        percent: percent(points, TOTAL_EXAM_SCORE),
        points,
        missed,
      }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remaining = useCountdown(EXAM_DURATION_SECONDS, started && !submitted, finish);
  const active = quizzes.find((q) => q.id === activeId) ?? quizzes[0];

  useEffect(() => {
    setAnswers(emptyAnswers(quizzes));
    setActiveId(quizzes[0]?.id ?? "analytical");
  }, [version]);

  const selectAnswer = (questionId: number, choiceIndex: number) => {
    if (submitted || !active || !started) return;
    setAnswers((prev) => ({
      ...prev,
      [active.id]: { ...prev[active.id], [questionId]: choiceIndex },
    }));
  };

  const results = quizzes.map((quiz) => {
    const correct = correctCount(quiz.questions, answers[quiz.id] ?? {});
    const scorePercent = percent(correct, quiz.questions.length);
    return {
      quiz,
      correct,
      scorePercent,
      points: weightedPoints(correct, quiz.questions.length, quiz.totalScore),
      didPass: passed(scorePercent, quiz.id, degree),
    };
  });
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const allPassed = examPassed(
    results.map((r) => ({ categoryId: r.quiz.id, percent: r.scorePercent })),
    degree,
  );

  const restart = () => {
    setSubmitted(false);
    setStarted(false);
    setVersion((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!active) return null;

  const answeredInActive = Object.keys(answers[active.id] ?? {}).length;
  const showQuestions = started || submitted;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="สอบจำลองเต็มชุด"
        subtitle={started ? `${formatClock(remaining)} เหลืออยู่` : "ยังไม่เริ่มจับเวลา"}
        backHref="/"
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!started && !submitted ? (
          <Card className="p-6" data-testid="card-exam-start">
            <h2 className="font-semibold mb-2">พร้อมเริ่มสอบจำลอง</h2>
            <p className="text-sm text-muted-foreground mb-4">
              45 ข้อ ทั้ง 3 วิชา คะแนนถ่วงน้ำหนัก 200 จับเวลา 3 ชั่วโมง เมื่อหมดเวลาจะส่งคำตอบอัตโนมัติ
              ไม่แสดงเฉลยจนกว่าจะส่ง เกณฑ์ผ่านใช้ระดับ{degree === "master" ? "ป.โท" : "ป.ตรี"}
            </p>
            <Button onClick={() => setStarted(true)} data-testid="button-exam-start" type="button">
              เริ่มสอบ
            </Button>
          </Card>
        ) : null}

        {showQuestions ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-muted-foreground" data-testid="text-exam-timer">
                เวลา {formatClock(remaining)} · เกณฑ์{degree === "master" ? "ป.โท" : "ป.ตรี"}
              </p>
              {!submitted ? (
                <Button onClick={finish} size="sm" data-testid="button-exam-submit" type="button">
                  ส่งข้อสอบทั้งชุด
                </Button>
              ) : null}
            </div>

            {submitted && (
              <Card className="mb-6 overflow-hidden" data-testid="card-exam-score">
                <div className={`p-5 sm:p-6 ${allPassed ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${allPassed ? "bg-emerald-100 dark:bg-emerald-900/50" : "bg-red-100 dark:bg-red-900/50"}`}
                    >
                      <Trophy className={`w-7 h-7 ${allPassed ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {totalPoints}/{TOTAL_EXAM_SCORE} คะแนน
                      </div>
                      <p className={`text-sm font-medium ${allPassed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {allPassed ? "ผ่านทุกวิชา" : "ยังไม่ผ่านทุกวิชา — ต้องผ่านเกณฑ์รายวิชา"}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {results.map((r) => (
                      <li key={r.quiz.id} className="flex justify-between gap-3">
                        <span>{r.quiz.title}</span>
                        <span>
                          {r.correct}/{r.quiz.questions.length} · {r.points}/{r.quiz.totalScore} · {r.scorePercent}%{" "}
                          {r.didPass ? "ผ่าน" : "ไม่ผ่าน"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={restart} data-testid="button-exam-retry" type="button">
                      สอบใหม่อีกชุด
                    </Button>
                    <Link href="/review">
                      <Button variant="outline" type="button">
                        ฝึกข้อที่ผิด
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-2 mb-6 flex-wrap">
              {quizzes.map((quiz) => {
                const count = Object.keys(answers[quiz.id] ?? {}).length;
                return (
                  <Button
                    key={quiz.id}
                    type="button"
                    size="sm"
                    variant={quiz.id === active.id ? "default" : "outline"}
                    onClick={() => setActiveId(quiz.id)}
                    data-testid={`button-exam-tab-${quiz.id}`}
                  >
                    {tabLabel[quiz.id] ?? quiz.id} ({count}/{quiz.questions.length})
                  </Button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              {active.title} · ตอบแล้ว {answeredInActive}/{active.questions.length}
              {submitted ? "" : " · โหมดสอบไม่แสดงเฉลยจนกว่าจะส่ง"}
            </p>

            <div className="space-y-5">
              {active.questions.map((q, index) => (
                <QuestionCard
                  key={`${version}-${active.id}-${q.id}`}
                  question={q}
                  index={index}
                  selectedAnswer={answers[active.id]?.[q.id] ?? null}
                  isRevealed={submitted}
                  isSubmitted={submitted}
                  allowReveal={false}
                  onSelect={selectAnswer}
                  onToggleReveal={() => undefined}
                />
              ))}
            </div>

            {!submitted ? (
              <div className="mt-8 flex justify-center">
                <Button onClick={finish} size="lg" className="gap-2" data-testid="button-exam-submit-bottom" type="button">
                  <Check className="w-4 h-4" />
                  ส่งข้อสอบทั้งชุด
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
