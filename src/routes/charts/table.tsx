import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { dummyCourses, dummyCategories } from "../courses/courses-data";

type SortOrder = "none" | "asc" | "desc";
type SortConfig = {
  category: string | null;
  order: SortOrder;
};

export function CourseTable() {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    category: null,
    order: "none",
  });

  // Handle category column click
  const handleCategorySort = (category: string) => {
    setSortConfig((current) => {
      if (current.category === category) {
        // Same category clicked - cycle through sort orders
        const nextOrder: SortOrder =
          current.order === "none"
            ? "desc"
            : current.order === "desc"
              ? "asc"
              : "none";

        return {
          category: nextOrder === "none" ? null : category,
          order: nextOrder,
        };
      } else {
        // Different category clicked - start with desc (X on top)
        return {
          category,
          order: "desc",
        };
      }
    });
  };

  // Sort courses based on current sort config
  const sortedCourses = React.useMemo(() => {
    if (!sortConfig.category || sortConfig.order === "none") {
      return dummyCourses;
    }

    return [...dummyCourses].sort((a, b) => {
      const aHasCategory = a.categories.includes(sortConfig.category!);
      const bHasCategory = b.categories.includes(sortConfig.category!);

      if (sortConfig.order === "desc") {
        // X on top (desc = true values first)
        if (aHasCategory && !bHasCategory) return -1;
        if (!aHasCategory && bHasCategory) return 1;
        return a.title.localeCompare(b.title); // Secondary sort by title
      } else {
        // X on bottom (asc = false values first)
        if (!aHasCategory && bHasCategory) return -1;
        if (aHasCategory && !bHasCategory) return 1;
        return a.title.localeCompare(b.title); // Secondary sort by title
      }
    });
  }, [sortConfig]);

  // Get sort icon for a category
  const getSortIcon = (category: string) => {
    if (sortConfig.category !== category) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }

    switch (sortConfig.order) {
      case "desc":
        return <ArrowDown className="h-3 w-3" />;
      case "asc":
        return <ArrowUp className="h-3 w-3" />;
      default:
        return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
  };

  // Calculate totals
  const totalQuestions = dummyCourses.reduce(
    (sum, course) => sum + course.total_questions,
    0,
  );
  const totalTasks = dummyCourses.reduce(
    (sum, course) => sum + course.total_tasks,
    0,
  );

  return (
    <div className="w-full">
      {/* Sort Status Indicator */}
      {sortConfig.category && (
        <div className="mb-4 text-sm text-muted-foreground">
          Sorted by <strong>{sortConfig.category}</strong> -
          {sortConfig.order === "desc" ? " X on top" : " X on bottom"}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortConfig({ category: null, order: "none" })}
            className="ml-2 h-6 px-2"
          >
            Clear sort
          </Button>
        </div>
      )}

      <Table>
        <TableCaption>
          A list of all courses with their categories. Click on category headers
          to sort.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            {dummyCategories.map((category) => (
              <TableHead key={category} className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategorySort(category)}
                  className="h-8 flex items-center gap-1 font-medium hover:bg-muted"
                >
                  <span className="text-xs">{category}</span>
                  {getSortIcon(category)}
                </Button>
              </TableHead>
            ))}
            <TableHead className="text-center">Questions</TableHead>
            <TableHead className="text-center">Tasks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCourses.map((course) => (
            <TableRow
              key={course.id}
              className={
                sortConfig.category &&
                course.categories.includes(sortConfig.category)
                  ? "bg-muted/50"
                  : ""
              }
            >
              <TableCell className="font-medium max-w-[200px]">
                <div className="truncate" title={course.title}>
                  {course.title}
                </div>
              </TableCell>
              {dummyCategories.map((category) => (
                <TableCell key={category} className="text-center">
                  <span
                    className={
                      course.categories.includes(category)
                        ? "font-bold text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {course.categories.includes(category) ? "✓" : "—"}
                  </span>
                </TableCell>
              ))}
              <TableCell className="text-center">
                {course.total_questions}
              </TableCell>
              <TableCell className="text-center">
                {course.total_tasks}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={dummyCategories.length + 1}
              className="font-medium"
            >
              Total ({sortedCourses.length} courses)
            </TableCell>
            <TableCell className="text-center font-medium">
              {totalQuestions}
            </TableCell>
            <TableCell className="text-center font-medium">
              {totalTasks}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
