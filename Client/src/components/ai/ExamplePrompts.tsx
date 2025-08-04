/**
 * Example Prompts Component
 * Displays example prompts to inspire users
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiService } from "@/services/aiService";

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export const ExamplePrompts = ({
  onSelectPrompt,
  isGenerating,
}: ExamplePromptsProps) => {
  // TODO: Replace with prompts from API if needed
  const examplePrompts = aiService.getExamplePrompts();

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Need inspiration?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(example)}
              className="text-left w-full p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
