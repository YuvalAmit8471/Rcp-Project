/**
 * Text Input Field Component
 * Reusable text input with icon and error handling
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LucideIcon } from "lucide-react";

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: LucideIcon;
}

export const TextField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
}: TextFieldProps) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`pl-10 ${error ? "border-destructive" : ""}`}
        />
      </div>
      {error && (
        <Alert variant="destructive" className="mt-2 py-2">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
