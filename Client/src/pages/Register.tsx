/**
 * Register Page
 * User registration form with validation
 * Refactored to use custom hooks and reusable components for better maintainability
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Mail, User } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    isLoading,
    handleInputChange,
    handleRegister,
  } = useAuthForm();

  /**
   * Handle form submission
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(formData);
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
            <CardTitle className="text-2xl font-bold">Join Recipe Hub</CardTitle>
            <p className="text-muted-foreground mt-2">
              Create your account to start sharing recipes
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name Field */}
            <TextField
              id="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={onInputChange}
              error={errors.name}
              icon={User}
            />

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
              placeholder="Create a password"
              value={formData.password}
              onChange={onInputChange}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password Field */}
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={onInputChange}
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
