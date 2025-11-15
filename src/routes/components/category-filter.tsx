import { CategoryBadge } from "./category-badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onToggleCategory,
}: CategoryFilterProps) {
  return (
    <div className="space-x-2 flex flex-wrap -mt-2 max-sm:-ml-2  ">
      <span className="mr-2 mt-0.5 text-sm font-medium hidden sm:block">
        Filter by:
      </span>
      {categories.map((category) => (
        <CategoryBadge
          key={category}
          category={category}
          isSelected={selectedCategories.includes(category)}
          onClick={() => onToggleCategory(category)}
          clickable
        />
      ))}
    </div>
  );
}
