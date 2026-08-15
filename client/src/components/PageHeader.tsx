import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function PageHeader({
  title,
  subtitle,
  backHref,
  extra,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  extra?: ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <Link href={backHref}>
              <button
                className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-muted transition-colors"
                data-testid="button-back"
                aria-label="กลับ"
                type="button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-semibold text-sm truncate" data-testid="text-logo">
              {title}
            </h1>
            {subtitle ? <p className="text-xs text-muted-foreground truncate">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {extra}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="rounded-full"
            aria-label={theme === "dark" ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด"}
            type="button"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
