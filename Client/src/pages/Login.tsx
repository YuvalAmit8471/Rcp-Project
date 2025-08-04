/**
 * Login Page
 * User authentication form with validation
 * Refactored to use custom hooks and reusable components for better maintainability
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Mail } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {
    showPassword,
    setShowPassword,
    errors,
    isLoading,
    handleInputChange,
    handleLogin,
  } = useAuthForm();

  /**
   * Handle form submission
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(formData);
  };

  /**
   * Handle input change with form data update
   */
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, setFormData);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated border-0 animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to your Recipe Hub account
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email Field */}
            <TextField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onInputChange}
              error={errors.email}
              icon={Mail}
            />

            {/* Password Field */}
            <PasswordField
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onInputChange}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              variant="warm"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
