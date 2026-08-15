import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { Check, Eye, EyeOff, RotateCcw, Shuffle, Timer, Trophy } from "lucide-react";
import { collectMissed, generateQuiz } from "@/data/quiz-manager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuestionCard } from "@/components/QuestionCard";
import { useCountdown } from "@/hooks/use-countdown";
import { loadProgress, recordQuizAttempt, saveProgress } from "@/lib/progress";
import { correctCount, formatClock, passed, percent, PRACTICE_TIMER_SECONDS } from "@/lib/score";

type AnswerState = Record<number, number | null>;
type RevealState = Record<number, boolean>;

export default function Quiz() {
  const params = useParams<{ id: string }>();
  const degree = loadProgress().degree;
  const [quizVersion, setQuizVersion] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const category = useMemo(() => generateQuiz(params.id!, degree), [params.id, quizVersion, degree]);

  const [answers, setAnswers] = useState<AnswerState>({});
  const [revealed, setRevealed] = useState<RevealState>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const finish = () => {
    if (!category || submitted) return;
    setSubmitted(true);
    const newRevealed: RevealState = {};
    category.questions.forEach((q) => {
      newRevealed[q.id] = true;
    });
    setRevealed(newRevealed);
    setShowAllAnswers(true);
    const correct = correctCount(category.questions, answers);
    const scorePercent = percent(correct, category.questions.length);
    const missed = collectMissed(category.id, category.questions, answers);
    saveProgress(recordQuizAttempt(loadProgress(), {
      categoryId: category.id,
      correct,
      total: category.questions.length,
      percent: scorePercent,
      missed,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remaining = useCountdown(PRACTICE_TIMER_SECONDS, timerOn && !submitted, finish);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">ไม่พบหมวดข้อสอบ</p>
          <Link href="/">
            <Button variant="outline">กลับหน้าหลัก</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = category.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const selectAnswer = (questionId: number, choiceIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
  };

  const toggleReveal = (questionId: number) => {
    setRevealed((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleShowAll = () => {
    const newState = !showAllAnswers;
    setShowAllAnswers(newState);
    const newRevealed: RevealState = {};
    category.questions.forEach((q) => {
      newRevealed[q.id] = newState;
    });
    setRevealed(newRevealed);
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setShowAllAnswers(false);
    setSubmitted(false);
    setTimerOn(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewQuiz = () => {
    setAnswers({});
    setRevealed({});
    setShowAllAnswers(false);
    setSubmitted(false);
    setTimerOn(false);
    setQuizVersion((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const score = correctCount(category.questions, answers);
  const scorePercentage = submitted ? percent(score, totalQuestions) : 0;
  const didPass = submitted && passed(scorePercentage, category.id, degree);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={category.title}
        subtitle={category.subtitle}
        backHref="/"
        extra={
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewQuiz}
            data-testid="button-new-quiz-header"
            className="rounded-full shrink-0"
            title="สุ่มข้อสอบใหม่"
            aria-label="สุ่มข้อสอบใหม่"
            type="button"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        }
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {submitted && (
          <Card className="mb-6 overflow-hidden" data-testid="card-score">
            <div className={`p-5 sm:p-6 ${didPass ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${didPass ? "bg-emerald-100 dark:bg-emerald-900/50" : "bg-red-100 dark:bg-red-900/50"}`}
                >
                  <Trophy className={`w-7 h-7 ${didPass ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {score}/{totalQuestions}
                    </span>
                    <span className="text-sm text-muted-foreground">ข้อ ({scorePercentage}%)</span>
                  </div>
                  <p
                    className={`text-sm font-medium mt-0.5 ${didPass ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {didPass ? "ผ่านเกณฑ์" : "ไม่ผ่านเกณฑ์"} (ต้องได้ {category.passingPercent}%)
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5" data-testid="button-reset">
                  <RotateCcw className="w-3.5 h-3.5" />
                  ทำใหม่ (โจทย์เดิม)
                </Button>
                <Button onClick={handleNewQuiz} size="sm" className="gap-1.5" data-testid="button-new-quiz">
                  <Shuffle className="w-3.5 h-3.5" />
                  สุ่มข้อสอบใหม่
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!submitted && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm gap-2 flex-wrap">
              <span className="text-muted-foreground">
                ตอบแล้ว {answeredCount}/{totalQuestions} ข้อ
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant={timerOn ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimerOn((v) => !v)}
                  className="gap-1.5 text-xs h-8"
                  data-testid="button-practice-timer"
                  type="button"
                >
                  <Timer className="w-3.5 h-3.5" />
                  {timerOn ? formatClock(remaining) : "จับเวลา 20 นาที"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleShowAll}
                  className="gap-1.5 text-xs h-8"
                  data-testid="button-toggle-all-answers"
                  type="button"
                >
                  {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showAllAnswers ? "ซ่อนเฉลยทั้งหมด" : "ดูเฉลยทั้งหมด"}
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="space-y-5">
          {category.questions.map((q, qIndex) => (
            <QuestionCard
              key={`${quizVersion}-${q.id}`}
              question={q}
              index={qIndex}
              selectedAnswer={answers[q.id] ?? null}
              isRevealed={!!revealed[q.id]}
              isSubmitted={submitted}
              allowReveal
              onSelect={selectAnswer}
              onToggleReveal={toggleReveal}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {!submitted ? (
            <>
              <Button
                onClick={finish}
                disabled={answeredCount === 0}
                size="lg"
                className="gap-2 px-8"
                data-testid="button-submit"
                type="button"
              >
                <Check className="w-4 h-4" />
                ส่งคำตอบ ({answeredCount}/{totalQuestions})
              </Button>
              <Button
                onClick={handleNewQuiz}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                data-testid="button-new-quiz-bottom"
                type="button"
              >
                <Shuffle className="w-3.5 h-3.5" />
                สุ่มข้อสอบใหม่
              </Button>
            </>
          ) : (
            <div className="flex gap-3 flex-wrap justify-center">
              <Button onClick={handleReset} variant="outline" size="lg" className="gap-2 px-6" data-testid="button-reset-bottom">
                <RotateCcw className="w-4 h-4" />
                ทำใหม่ (โจทย์เดิม)
              </Button>
              <Button onClick={handleNewQuiz} size="lg" className="gap-2 px-6" data-testid="button-new-quiz-bottom-2">
                <Shuffle className="w-4 h-4" />
                สุ่มข้อสอบใหม่
              </Button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
