/**
 * Custom hook for managing recipe creation form state and logic
 * Handles form data, validation, and submission
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { recipeApi } from "@/services/recipeApi";

export interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  image: string;
}

export const useRecipeForm = () => {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    cookTime: "",
    prepTime: "",
    servings: "",
    ingredients: [""],
    instructions: [""],
    tags: [],
    image: "",
  });

  const [currentTag, setCurrentTag] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * Update form field value and clear any related errors
   */
  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  /**
   * Add a new empty ingredient field
   */
  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  /**
   * Update specific ingredient value
   */
  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? value : ing
      ),
    }));
  };

  /**
   * Remove ingredient at specific index
   */
  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  /**
   * Add a new empty instruction field
   */
  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  /**
   * Update specific instruction value
   */
  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === index ? value : inst
      ),
    }));
  };

  /**
   * Remove instruction at specific index
   */
  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index),
      }));
    }
  };

  /**
   * Add a new tag to the form
   */
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  /**
   * Remove tag from the form
   */
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  /**
   * Validate form data and return validation errors
   */
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!formData.cookTime.trim()) newErrors.cookTime = "Cook time is required";
    if (!formData.servings.trim()) newErrors.servings = "Servings is required";

    const validIngredients = formData.ingredients.filter((ing) => ing.trim());
    if (validIngredients.length === 0)
      newErrors.ingredients = "At least one ingredient is required";

    const validInstructions = formData.instructions.filter((inst) =>
      inst.trim()
    );
    if (validInstructions.length === 0)
      newErrors.instructions = "At least one instruction is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit the recipe form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a recipe.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Filter out empty ingredients and instructions
      const validIngredients = formData.ingredients.filter((ing) => ing.trim());
      const validInstructions = formData.instructions.filter((inst) =>
        inst.trim()
      );

      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        cookTime: formData.cookTime.trim(),
        prepTime: formData.prepTime.trim(),
        servings: parseInt(formData.servings),
        ingredients: validIngredients,
        instructions: validInstructions,
        tags: formData.tags,
        image:
          formData.image ||
          "https://via.placeholder.com/400x300?text=Recipe+Image",
      };

      await recipeApi.createRecipe(recipeData);

      toast({
        title: "Recipe created successfully!",
        description:
          "Your recipe has been published and is now visible to the community.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        difficulty: "",
        cookTime: "",
        prepTime: "",
        servings: "",
        ingredients: [""],
        instructions: [""],
        tags: [],
        image: "",
      });

      // Navigate to MyRecipes page
      navigate("/my-recipes");
    } catch (error) {
      let message = "Failed to create recipe. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      toast({
        title: "Failed to create recipe",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    currentTag,
    setCurrentTag,
    errors,
    isSaving,
    handleInputChange,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    addTag,
    removeTag,
    handleSubmit,
  };
};
