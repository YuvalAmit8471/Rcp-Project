/**
 * Recipe Placeholder Component
 * Shows when no recipe has been generated yet
 */

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const RecipePlaceholder = () => {
  return (
    <Card className="shadow-soft border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">
          Your AI-generated recipe will appear here
        </h3>
        <p className="text-muted-foreground text-sm">
          Enter your cooking preferences and let our AI create something
          amazing!
        </p>
      </CardContent>
    </Card>
  );
};
