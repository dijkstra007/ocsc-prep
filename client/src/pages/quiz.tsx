import { useState, useCallback, useMemo } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Moon,
  Sun,
  Trophy,
  Lightbulb,
  Shuffle,
} from "lucide-react";
import { generateQuiz } from "@/data/quiz-manager";
import type { Question, QuizCategory } from "@/data/questions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { useTheme } from "@/hooks/use-theme";

type AnswerState = Record<number, number | null>;
type RevealState = Record<number, boolean>;

export default function Quiz() {
  const params = useParams<{ id: string }>();
  const { theme, toggleTheme } = useTheme();

  // Generate quiz on mount; re-generate on demand
  const [quizVersion, setQuizVersion] = useState(0);
  const category = useMemo(() => {
    // quizVersion forces re-generation
    return generateQuiz(params.id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, quizVersion]);

  const [answers, setAnswers] = useState<AnswerState>({});
  const [revealed, setRevealed] = useState<RevealState>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = () => {
    setSubmitted(true);
    const newRevealed: RevealState = {};
    category.questions.forEach((q) => {
      newRevealed[q.id] = true;
    });
    setRevealed(newRevealed);
    setShowAllAnswers(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setShowAllAnswers(false);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewQuiz = () => {
    setAnswers({});
    setRevealed({});
    setShowAllAnswers(false);
    setSubmitted(false);
    setQuizVersion((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getScore = () => {
    let correct = 0;
    category.questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });
    return correct;
  };

  const scorePercentage = submitted
    ? Math.round((getScore() / totalQuestions) * 100)
    : 0;
  const passed = scorePercentage >= category.passingPercent;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/">
              <button className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-muted transition-colors" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="min-w-0">
              <h1 className="font-semibold text-sm truncate">{category.title}</h1>
              <p className="text-xs text-muted-foreground">{category.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewQuiz}
              data-testid="button-new-quiz-header"
              className="rounded-full shrink-0"
              title="สุ่มข้อสอบใหม่"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              className="rounded-full shrink-0"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Score banner */}
        {submitted && (
          <Card className="mb-6 overflow-hidden" data-testid="card-score">
            <div className={`p-5 sm:p-6 ${passed ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${passed ? "bg-emerald-100 dark:bg-emerald-900/50" : "bg-red-100 dark:bg-red-900/50"}`}>
                  <Trophy className={`w-7 h-7 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{getScore()}/{totalQuestions}</span>
                    <span className="text-sm text-muted-foreground">ข้อ ({scorePercentage}%)</span>
                  </div>
                  <p className={`text-sm font-medium mt-0.5 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {passed ? "ผ่านเกณฑ์" : "ไม่ผ่านเกณฑ์"} (ต้องได้ {category.passingPercent}%)
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

        {/* Progress + controls */}
        {!submitted && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                ตอบแล้ว {answeredCount}/{totalQuestions} ข้อ
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShowAll}
                className="gap-1.5 text-xs h-8"
                data-testid="button-toggle-all-answers"
              >
                {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showAllAnswers ? "ซ่อนเฉลยทั้งหมด" : "ดูเฉลยทั้งหมด"}
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Questions */}
        <div className="space-y-5">
          {category.questions.map((q, qIndex) => (
            <QuestionCard
              key={`${quizVersion}-${q.id}`}
              question={q}
              index={qIndex}
              selectedAnswer={answers[q.id] ?? null}
              isRevealed={!!revealed[q.id]}
              isSubmitted={submitted}
              onSelect={selectAnswer}
              onToggleReveal={toggleReveal}
            />
          ))}
        </div>

        {/* Submit / Reset / New Quiz buttons */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {!submitted ? (
            <>
              <Button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                size="lg"
                className="gap-2 px-8"
                data-testid="button-submit"
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

      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  selectedAnswer,
  isRevealed,
  isSubmitted,
  onSelect,
  onToggleReveal,
}: {
  question: Question;
  index: number;
  selectedAnswer: number | null;
  isRevealed: boolean;
  isSubmitted: boolean;
  onSelect: (qid: number, choice: number) => void;
  onToggleReveal: (qid: number) => void;
}) {
  const isCorrect = selectedAnswer === question.answer;
  const hasAnswered = selectedAnswer !== null;

  return (
    <Card className="overflow-hidden" data-testid={`card-question-${question.id}`}>
      <div className="p-4 sm:p-5">
        {/* Question header */}
        <div className="flex items-start gap-3 mb-4">
          <Badge
            variant="secondary"
            className={`shrink-0 mt-0.5 tabular-nums min-w-[2rem] justify-center ${
              isSubmitted
                ? isCorrect
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                  : hasAnswered
                  ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                  : "bg-muted text-muted-foreground"
                : ""
            }`}
          >
            {isSubmitted && hasAnswered ? (isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />) : index + 1}
          </Badge>
          <p className="text-sm leading-relaxed whitespace-pre-line" data-testid={`text-question-${question.id}`}>
            {question.question}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-2 ml-0 sm:ml-10">
          {question.choices.map((choice, i) => {
            const labels = ["ก", "ข", "ค", "ง"];
            const isSelected = selectedAnswer === i;
            const isCorrectChoice = question.answer === i;
            const showCorrectness = isRevealed || isSubmitted;

            let choiceClass =
              "border border-border/70 bg-card hover:bg-muted/50 dark:hover:bg-muted/30";

            if (isSelected && !showCorrectness) {
              choiceClass = "border-primary bg-primary/5 ring-1 ring-primary/30";
            } else if (showCorrectness && isCorrectChoice) {
              choiceClass =
                "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30";
            } else if (showCorrectness && isSelected && !isCorrectChoice) {
              choiceClass =
                "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30";
            }

            return (
              <button
                key={i}
                className={`w-full text-left rounded-lg px-3.5 py-2.5 text-sm flex items-start gap-2.5 transition-all duration-150 ${choiceClass} ${
                  isSubmitted ? "cursor-default" : "cursor-pointer"
                }`}
                onClick={() => onSelect(question.id, i)}
                disabled={isSubmitted}
                data-testid={`button-choice-${question.id}-${i}`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                    showCorrectness && isCorrectChoice
                      ? "bg-emerald-500 text-white"
                      : showCorrectness && isSelected && !isCorrectChoice
                      ? "bg-red-500 text-white"
                      : isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {showCorrectness && isCorrectChoice ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : showCorrectness && isSelected && !isCorrectChoice ? (
                    <X className="w-3.5 h-3.5" />
                  ) : (
                    labels[i]
                  )}
                </span>
                <span className="pt-0.5 leading-snug">{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Reveal toggle */}
        {!isSubmitted && (
          <div className="mt-3 ml-0 sm:ml-10">
            <button
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              onClick={() => onToggleReveal(question.id)}
              data-testid={`button-reveal-${question.id}`}
            >
              {isRevealed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  ซ่อนเฉลย
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  ดูเฉลยและวิธีคิด
                </>
              )}
            </button>
          </div>
        )}

        {/* Explanation */}
        {isRevealed && (
          <div
            className="mt-3 ml-0 sm:ml-10 p-3.5 rounded-lg bg-accent/50 border border-accent"
            data-testid={`explanation-${question.id}`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-foreground">เฉลยและวิธีคิด</span>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              <p className="font-medium text-foreground mb-1">
                คำตอบที่ถูกต้อง: {["ก", "ข", "ค", "ง"][question.answer]}) {question.choices[question.answer]}
              </p>
              {question.explanation}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
