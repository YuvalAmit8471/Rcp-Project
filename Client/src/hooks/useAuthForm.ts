/**
 * Custom hook for authentication forms (login/register)
 * Handles form state, validation, and submission logic
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  /**
   * Validate email format
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle input changes and clear related errors
   */
  const handleInputChange = <T extends Record<string, string>>(
    e: React.ChangeEvent<HTMLInputElement>,
    setFormData: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: T) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validate login form
   */
  const validateLoginForm = (formData: LoginFormData) => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validate register form
   */
  const validateRegisterForm = (formData: RegisterFormData) => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async (formData: LoginFormData) => {
    if (!validateLoginForm(formData)) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      navigate("/");
    } catch (error) {
      let message = "Login failed. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle register form submission
   */
  const handleRegister = async (formData: RegisterFormData) => {
    if (!validateRegisterForm(formData)) return;

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast({
        title: "Account created successfully!",
        description:
          "Welcome to Recipe Hub! You can now start exploring recipes.",
      });
      navigate("/");
    } catch (error) {
      let message = "Registration failed. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    isLoading,
    handleInputChange,
    handleLogin,
    handleRegister,
  };
};
