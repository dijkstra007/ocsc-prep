export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          ข้อสอบจำลองนี้จัดทำเพื่อการฝึกฝนเท่านั้น ไม่ใช่ข้อสอบจริงจากสำนักงาน ก.พ.
        </p>
        <p className="text-xs text-muted-foreground">
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Created with Perplexity Computer
          </a>
        </p>
      </div>
    </footer>
  );
}
