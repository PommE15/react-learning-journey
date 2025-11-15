import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CategoryBadge } from "../category-badge";
import type { Course } from "../../data/types";
import { dummyCategories } from "../../courses/courses-data";

interface CourseCardFooterProps {
  course: Course;
  selectedCategories: string[];
}

export function CourseCardFooter({
  course,
  selectedCategories,
}: CourseCardFooterProps) {
  // Use imported categories for ordering
  const sortedCategories = course.categories.sort((a: string, b: string) => {
    const indexA = dummyCategories.indexOf(a);
    const indexB = dummyCategories.indexOf(b);

    // If both categories are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one category is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither category is in the order array, maintain original order
    return 0;
  });

  return (
    <>
      <Separator />
      <CardFooter className="-my-2.5 -ml-2.5">
        <div>
          {sortedCategories.map((category: string) => (
            <CategoryBadge
              key={category}
              category={category}
              isSelected={selectedCategories.includes(category)}
            />
          ))}
        </div>
      </CardFooter>
    </>
  );
}
