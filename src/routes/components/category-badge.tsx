import { Badge } from "@/components/ui/badge";
import { dummyCategories } from "../courses/courses-data";

interface CategoryBadgeProps {
  category: string;
  isSelected: boolean;
  onClick?: () => void;
  clickable?: boolean;
}

export function CategoryBadge({
  category,
  isSelected,
  onClick,
  clickable = false,
}: CategoryBadgeProps) {
  // Returns the appropriate gradient CSS class based on category position in dummyCategories array
  const getCategoryGradient = (categoryName: string): string => {
    const index = dummyCategories.indexOf(categoryName);
    // If category found, use index + 1 for gradient step (1-5)
    if (index !== -1) {
      return `bg-gradient-step-${index + 1}`;
    }
    // Fallback for unknown categories
    return "bg-gradient-step-3";
  };

  return (
    <Badge
      variant="secondary"
      className={`m-0.5 transition-all duration-300 hover:bg-gray-200 ${
        clickable ? "cursor-pointer" : ""
      } ${isSelected ? getCategoryGradient(category) : ""}`}
      onClick={onClick}
    >
      {category}
    </Badge>
  );
}
