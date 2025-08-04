/**
 * Search and Filter Bar for Home page
 * Handles recipe search and category filtering
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Sparkles } from "lucide-react";

interface SearchAndFilterBarProps {
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onSurpriseMe: () => void;
}

export const SearchAndFilterBar = ({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onSurpriseMe,
}: SearchAndFilterBarProps) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 shadow-soft"
          />
        </div>
      </div>

      {/* Filters and Surprise Me */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by category:</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <Button
          onClick={onSurpriseMe}
          variant="warm"
          className="shadow-soft hover:shadow-md transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Surprise Me!
        </Button>
      </div>
    </div>
  );
};
