import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">ไม่พบหน้านี้</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            หน้าที่คุณเปิดไม่มีในเว็บเตรียมสอบ ก.พ. ภาค ก
          </p>
          <Link href="/">
            <Button className="mt-6" data-testid="button-404-home">
              กลับหน้าหลัก
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
