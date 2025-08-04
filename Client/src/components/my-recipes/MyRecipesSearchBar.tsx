/**
 * My Recipes Search Bar
 * Search functionality for both saved and created recipes
 */

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MyRecipesSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const MyRecipesSearchBar = ({
  searchTerm,
  onSearchChange,
}: MyRecipesSearchBarProps) => {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search your recipes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 shadow-soft"
        />
      </div>
    </div>
  );
};
