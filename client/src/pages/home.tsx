import { Link } from "wouter";
import {
  Brain,
  ChevronRight,
  Clock,
  Globe,
  Landmark,
  BookOpen,
  RotateCcw,
  Shuffle,
  Target,
  Timer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getCategoryMeta, getContentStats } from "@/data/quiz-manager";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { loadProgress, saveProgress, setDegree } from "@/lib/progress";
import type { Degree } from "@/lib/score";
import { passingPercent } from "@/lib/score";

const iconMap: Record<string, typeof Brain> = {
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
  const [progress, setProgress] = useState(() => loadProgress());
  const categories = useMemo(() => getCategoryMeta(progress.degree), [progress.degree]);
  const stats = getContentStats();

  const changeDegree = (degree: Degree) => {
    const next = setDegree(progress, degree);
    saveProgress(next);
    setProgress(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="เตรียมสอบ ก.พ." />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
            สุ่มโจทย์ใหม่ทุกครั้ง — คลัง {stats.poolCount} ข้อ + โจทย์คณิตสุ่มตัวเลข {stats.templateCount} แบบ
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border">
            <div className="text-lg sm:text-xl font-bold text-primary" data-testid="text-total-score">
              200
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">คะแนนเต็มสอบจริง</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border">
            <div className="text-lg sm:text-xl font-bold text-primary" data-testid="text-total-questions">
              3
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">วิชา</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-card border border-card-border">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-primary" data-testid="text-time">
                3
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">ชั่วโมง (สอบจำลอง)</div>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-card-border bg-card">
          <div>
            <p className="text-sm font-medium">เกณฑ์คิดวิเคราะห์</p>
            <p className="text-xs text-muted-foreground">ป.ตรี ผ่าน 60% · ป.โท ผ่าน 65%</p>
          </div>
          <div className="flex gap-2" role="group" aria-label="เลือกระดับการศึกษา">
            <Button
              type="button"
              size="sm"
              variant={progress.degree === "bachelor" ? "default" : "outline"}
              onClick={() => changeDegree("bachelor")}
              data-testid="button-degree-bachelor"
            >
              ป.ตรี
            </Button>
            <Button
              type="button"
              size="sm"
              variant={progress.degree === "master" ? "default" : "outline"}
              onClick={() => changeDegree("master")}
              data-testid="button-degree-master"
            >
              ป.โท
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <Link href="/exam">
            <Card
              className="cursor-pointer border-primary/30 hover:shadow-md transition-all p-4 sm:p-5 h-full"
              data-testid="card-mock-exam"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm">สอบจำลองเต็มชุด</h2>
                  <p className="text-xs text-muted-foreground">45 ข้อ · 200 คะแนน · จับเวลา 3 ชั่วโมง</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
          <Link href="/review">
            <Card
              className="cursor-pointer border-card-border hover:shadow-md transition-all p-4 sm:p-5 h-full"
              data-testid="card-review"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm">ฝึกข้อที่ผิด</h2>
                  <p className="text-xs text-muted-foreground">
                    {progress.missed.length > 0
                      ? `มี ${progress.missed.length} ข้อที่เคยตอบผิด`
                      : "ยังไม่มีข้อผิด — ทำแบบฝึกแล้วจะบันทึกที่นี่"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        </div>

        <h2 className="text-sm font-semibold mb-3">ฝึกทีละวิชา (15 ข้อ)</h2>
        <div className="space-y-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Brain;
            const colors = colorMap[cat.color] || colorMap.blue;
            const statsFor = progress.subjects[cat.id];

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
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className={`text-xs ${colors.badge} border-0`}>
                          {cat.questionCount} ข้อ
                        </Badge>
                        <Badge variant="secondary" className={`text-xs ${colors.badge} border-0`}>
                          {cat.totalScore} คะแนน
                        </Badge>
                        <Badge variant="secondary" className="text-xs border-0">
                          ผ่าน {passingPercent(cat.id, progress.degree)}%
                        </Badge>
                        {statsFor && statsFor.attempts > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            ล่าสุด {statsFor.lastPercent}% · สูงสุด {statsFor.bestPercent}%
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-14 p-5 sm:p-6 rounded-xl bg-accent/50 border border-accent">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-foreground" />
            เกณฑ์การสอบผ่าน
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. วิชาความสามารถในการคิดวิเคราะห์ — ต้องได้ไม่ต่ำกว่า 60% (ป.ตรี) หรือ 65% (ป.โท)</p>
            <p>2. วิชาภาษาอังกฤษ — ต้องได้ไม่ต่ำกว่า 50%</p>
            <p>3. วิชาความรู้และลักษณะการเป็นข้าราชการที่ดี — ต้องได้ไม่ต่ำกว่า 60%</p>
            <p className="pt-1">ชุดฝึก 15 ข้อใช้ดูสัดส่วนถูก/ผิด — คะแนนถ่วงน้ำหนัก 200 ใช้ในโหมดสอบจำลองเต็มชุด</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
