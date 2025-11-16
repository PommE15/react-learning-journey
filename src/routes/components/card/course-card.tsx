import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CourseCardDescription } from "./card-description";
import { CourseCardFooter } from "./card-footer";
import type { Course } from "../../data/types";
import { randomText } from "../../data/random";

interface CourseCardProps {
  course: Course;
  selectedCategories: string[];
}

export function CourseCard({ course, selectedCategories }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3>{course.title}</h3>
        <CourseCardDescription course={course} />
      </CardHeader>
      <CardContent className="min-h-16">
        <p className="text-sm">{randomText()}</p>
      </CardContent>
      <CourseCardFooter
        course={course}
        selectedCategories={selectedCategories}
      />
    </Card>
  );
}
