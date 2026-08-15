import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Check, Trophy } from "lucide-react";
import { collectMissed, generateReviewQuiz } from "@/data/quiz-manager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuestionCard } from "@/components/QuestionCard";
import { loadProgress, recordQuizAttempt, removeMissed, saveProgress } from "@/lib/progress";
import { correctCount, percent } from "@/lib/score";

type AnswerState = Record<number, number | null>;

export default function Review() {
  const initial = loadProgress();
  const [version, setVersion] = useState(0);
  const category = useMemo(() => generateReviewQuiz(loadProgress().missed, initial.degree), [version, initial.degree]);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="ฝึกข้อที่ผิด" backHref="/" />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-muted-foreground mb-4" data-testid="text-review-empty">
            ยังไม่มีข้อที่ผิดให้ทบทวน ลองทำแบบฝึกหรือสอบจำลองก่อน
          </p>
          <Link href="/">
            <Button>กลับหน้าหลัก</Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const totalQuestions = category.questions.length;
  const answeredCount = Object.keys(answers).length;
  const score = correctCount(category.questions, answers);
  const scorePercentage = submitted ? percent(score, totalQuestions) : 0;

  const selectAnswer = (questionId: number, choiceIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
  };

  const finish = () => {
    setSubmitted(true);
    const correctKeys = category.questions
      .filter((q) => answers[q.id] === q.answer && q.poolKey)
      .map((q) => q.poolKey as string);
    const stillMissed = collectMissed("review", category.questions, answers);
    let next = removeMissed(loadProgress(), correctKeys);
    next = recordQuizAttempt(next, {
      categoryId: "review",
      correct: correctCount(category.questions, answers),
      total: category.questions.length,
      percent: percent(correctCount(category.questions, answers), category.questions.length),
      missed: stillMissed,
    });
    saveProgress(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const again = () => {
    setAnswers({});
    setSubmitted(false);
    setVersion((v) => v + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={category.title} subtitle={category.subtitle} backHref="/" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {submitted && (
          <Card className="mb-6 overflow-hidden" data-testid="card-review-score">
            <div className="p-5 sm:p-6 bg-accent/40">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10">
                  <Trophy className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {score}/{totalQuestions} ข้อ ({scorePercentage}%)
                  </div>
                  <p className="text-sm text-muted-foreground">ข้อที่ถูกแล้วจะถูกนำออกจากคลังทบทวน</p>
                </div>
              </div>
              <Button className="mt-4" onClick={again} data-testid="button-review-again" type="button">
                ทบทวนอีกครั้ง
              </Button>
            </div>
          </Card>
        )}

        {!submitted && (
          <div className="mb-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              ตอบแล้ว {answeredCount}/{totalQuestions} ข้อ
            </p>
            <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
          </div>
        )}

        <div className="space-y-5">
          {category.questions.map((q, index) => (
            <QuestionCard
              key={`${version}-${q.id}`}
              question={q}
              index={index}
              selectedAnswer={answers[q.id] ?? null}
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
            <Button
              onClick={finish}
              disabled={answeredCount === 0}
              size="lg"
              className="gap-2"
              data-testid="button-review-submit"
              type="button"
            >
              <Check className="w-4 h-4" />
              ส่งคำตอบ
            </Button>
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
