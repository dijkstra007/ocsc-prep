import { Link } from "wouter";
import { Brain, Globe, Landmark, BookOpen, Target, Clock, ChevronRight, Moon, Sun, Shuffle } from "lucide-react";
import { getCategoryMeta } from "@/data/quiz-manager";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { useTheme } from "@/hooks/use-theme";

const iconMap: Record<string, any> = {
  brain: Brain,
  globe: Globe,
  scale: Landmark,
};

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
};

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const categories = getCategoryMeta();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-base tracking-tight" data-testid="text-logo">เตรียมสอบ ก.พ.</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
            <Target className="w-3.5 h-3.5" />
            ภาค ก สอบวัดความรู้ความสามารถทั่วไป
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-3" data-testid="text-hero-title">
            เตรียมสอบ ก.พ. ภาค ก
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            ฝึกทำข้อสอบจำลองพร้อมเฉลยและวิธีคิดโดยละเอียด ครบทุกวิชา เพื่อเตรียมความพร้อมสู่การสอบจริง
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/15 text-xs text-primary font-medium">
            <Shuffle className="w-3.5 h-3.5" />
            โจทย์สุ่มใหม่ทุกครั้ง — ฝึกได้ไม่มีวันซ้ำ
          </div>
        </div>

        {/* Exam info cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
          <div className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border">
            <div className="text-lg sm:text-xl font-bold text-primary" data-testid="text-total-score">200</div>
            <div className="text-xs text-muted-foreground mt-0.5">คะแนนเต็ม</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border">
            <div className="text-lg sm:text-xl font-bold text-primary" data-testid="text-total-questions">3</div>
            <div className="text-xs text-muted-foreground mt-0.5">วิชา</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-primary" data-testid="text-time">3</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">ชั่วโมง</div>
          </div>
        </div>

        {/* Quiz categories */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Brain;
            const colors = colorMap[cat.color] || colorMap.blue;

            return (
              <Link key={cat.id} href={`/quiz/${cat.id}`}>
                <Card
                  className={`group cursor-pointer border ${colors.border} hover:shadow-md transition-all duration-200 overflow-hidden`}
                  data-testid={`card-quiz-${cat.id}`}
                >
                  <div className="flex items-center gap-4 p-4 sm:p-5">
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-sm sm:text-base leading-snug mb-1">{cat.title}</h2>
                      <p className="text-xs text-muted-foreground">{cat.subtitle}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={`text-xs ${colors.badge} border-0`}>
                          {cat.questionCount} ข้อ
                        </Badge>
                        <Badge variant="secondary" className={`text-xs ${colors.badge} border-0`}>
                          {cat.totalScore} คะแนน
                        </Badge>
                        <Badge variant="secondary" className="text-xs border-0">
                          ผ่าน {cat.passingPercent}%
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Exam tips */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-6 rounded-xl bg-accent/50 border border-accent">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-foreground" />
            เกณฑ์การสอบผ่าน
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. วิชาความสามารถในการคิดวิเคราะห์ — ต้องได้ไม่ต่ำกว่า 60% (ป.ตรี) หรือ 65% (ป.โท)</p>
            <p>2. วิชาภาษาอังกฤษ — ต้องได้ไม่ต่ำกว่า 50%</p>
            <p>3. วิชาความรู้และลักษณะการเป็นข้าราชการที่ดี — ต้องได้ไม่ต่ำกว่า 60%</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground mb-3">
            ข้อสอบจำลองนี้จัดทำเพื่อการฝึกฝนเท่านั้น ไม่ใช่ข้อสอบจริงจากสำนักงาน ก.พ.
          </p>
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
