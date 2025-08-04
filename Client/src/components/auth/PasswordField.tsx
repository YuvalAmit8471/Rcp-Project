/**
 * Password Input Field Component
 * Reusable password input with show/hide toggle
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export const PasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  showPassword,
  onTogglePassword,
}: PasswordFieldProps) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`pl-10 pr-12 ${error ? "border-destructive" : ""}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-2 py-2">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
