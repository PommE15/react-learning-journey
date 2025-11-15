import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// Move this type to the route file
export type SortOrder = "none" | "asc" | "desc";

interface CourseSortProps {
  sortOrder: SortOrder;
  onToggleSort: () => void;
}

export function CourseSort({ sortOrder, onToggleSort }: CourseSortProps) {
  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const getSortLabel = () => {
    if (sortOrder === "asc") return "Name A-Z";
    if (sortOrder === "desc") return "Name Z-A";
    return "Sort by Name";
  };

  return (
    <Button
      size="sm"
      variant={sortOrder !== "none" ? "secondary" : "outline"}
      onClick={onToggleSort}
      className="flex items-center gap-2 w-36 hover:bg-gray-200 mt-1.5"
    >
      {getSortLabel()} {getSortIcon()}
    </Button>
  );
}
