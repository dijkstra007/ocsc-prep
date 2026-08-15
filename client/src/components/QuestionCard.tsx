import { Check, ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react";
import type { Question } from "@/data/questions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const LABELS = ["ก", "ข", "ค", "ง"];

export function QuestionCard({
  question,
  index,
  selectedAnswer,
  isRevealed,
  isSubmitted,
  allowReveal,
  onSelect,
  onToggleReveal,
}: {
  question: Question;
  index: number;
  selectedAnswer: number | null;
  isRevealed: boolean;
  isSubmitted: boolean;
  allowReveal: boolean;
  onSelect: (qid: number, choice: number) => void;
  onToggleReveal: (qid: number) => void;
}) {
  const isCorrect = selectedAnswer === question.answer;
  const hasAnswered = selectedAnswer !== null;

  return (
    <Card className="overflow-hidden" data-testid={`card-question-${question.id}`}>
      <div className="p-4 sm:p-5">
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

        <div className="space-y-2 ml-0 sm:ml-10" role="radiogroup" aria-label={`ตัวเลือกข้อ ${index + 1}`}>
          {question.choices.map((choice, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrectChoice = question.answer === i;
            const showCorrectness = isRevealed || isSubmitted;

            let choiceClass = "border border-border/70 bg-card hover:bg-muted/50 dark:hover:bg-muted/30";
            if (isSelected && !showCorrectness) {
              choiceClass = "border-primary bg-primary/5 ring-1 ring-primary/30";
            } else if (showCorrectness && isCorrectChoice) {
              choiceClass = "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30";
            } else if (showCorrectness && isSelected && !isCorrectChoice) {
              choiceClass = "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30";
            }

            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
                    LABELS[i]
                  )}
                </span>
                <span className="pt-0.5 leading-snug">{choice}</span>
              </button>
            );
          })}
        </div>

        {allowReveal && !isSubmitted && (
          <div className="mt-3 ml-0 sm:ml-10">
            <button
              type="button"
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
                คำตอบที่ถูกต้อง: {LABELS[question.answer]}) {question.choices[question.answer]}
              </p>
              {question.explanation}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
