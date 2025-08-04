# AI Recipe Generator Components

This directory contains the components and logic for the AI Recipe Generator feature.

## Components

### `RecipeInput.tsx`

- Handles user input for recipe generation prompts
- Includes textarea for description and generate button
- Manages loading states during generation

### `ExamplePrompts.tsx`

- Displays predefined example prompts to inspire users
- Allows users to quickly select common recipe types
- Responsive grid layout for prompt buttons

### `GeneratedRecipeDisplay.tsx`

- Displays the complete AI-generated recipe
- Shows ingredients, instructions, metadata (cook time, servings, etc.)
- Includes copy and save functionality
- Responsive design with proper spacing

### `RecipePlaceholder.tsx`

- Shows when no recipe has been generated yet
- Provides visual feedback and instructions
- Maintains consistent layout with generated recipe display

## Services

### `aiService.ts`

- Handles AI recipe generation API calls
- Currently uses mock data but can be easily replaced with real AI API
- Provides example prompts data
- Exports GeneratedRecipe interface

## Hooks

### `useAIGenerator.ts`

- Manages state for AI recipe generation
- Handles prompt input, loading states, and generated recipes
- Provides actions for generating and clearing recipes
- Includes error handling and toast notifications

### `useRecipeActions.ts`

- Provides common recipe utility actions
- Handles copying recipes to clipboard
- Manages recipe saving logic (placeholder for future implementation)
- Reusable across different components

## Features

- **Responsive Design**: All components work well on mobile and desktop
- **Loading States**: Proper feedback during AI generation
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Copy to Clipboard**: Easy sharing of generated recipes
- **Example Prompts**: Inspiration for users who need ideas

## Usage

```tsx
import AIGenerator from "@/pages/AIGenerator";

// The main page component that orchestrates all AI functionality
<AIGenerator />;
```

## Future Enhancements

1. **Real AI Integration**: Replace mock service with actual AI API
2. **Recipe Saving**: Implement saving generated recipes to database
3. **Recipe Customization**: Allow users to edit generated recipes
4. **Social Sharing**: Add sharing capabilities
5. **Recipe History**: Keep track of previously generated recipes
6. **Advanced Prompts**: Support for dietary restrictions, cuisine types, etc.
