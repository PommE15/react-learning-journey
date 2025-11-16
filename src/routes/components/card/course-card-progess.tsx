import { Card, CardHeader } from "@/components/ui/card";
import type { Course, UserCourse } from "../../data/types";
import { CourseCardDescription } from "./card-description";
import { CourseCardFooter } from "./card-footer";
import { CardProgress } from "./card-progess";

interface CourseCardProps {
  course: Course;
  userCourse?: UserCourse;
  selectedCategories: string[];
}

export function CourseCardProgress({
  course,
  userCourse = undefined,
  selectedCategories,
}: CourseCardProps) {
  return (
    <Card>
      <CardHeader className="-my-2">
        <h3>{course.title}</h3>
        <CourseCardDescription
          course={course}
          userCourse={userCourse}
          isWorkInProgress
        />
      </CardHeader>

      <CardProgress data={course} isCompleted={false} />

      <CourseCardFooter
        course={course}
        selectedCategories={selectedCategories}
      />
    </Card>
  );
}
