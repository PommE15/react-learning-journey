import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import { CourseCardDescription } from "./card-description";
import { CourseCardFooter } from "./card-footer";
import type { Course, UserCourse } from "../../data/types";

interface CourseCardProps {
  course: Course;
  userCourse: UserCourse;
  selectedCategories: string[];
}

export function CourseCardCompleted({
  course,
  userCourse,
  selectedCategories,
}: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3>{course.title}</h3>
        <CourseCardDescription course={course} userCourse={userCourse} />
      </CardHeader>
      <CardContent className="min-h-16 space-y-2">
        <div className="flex justify-between gap-2">
          Completed
          <CircleCheckBig className="size-8 text-blue-600 font-bold -mt-2" />
        </div>
        <div>
          <p>X% Question Accuracy</p>
          <p>X% Task Success</p>
        </div>
      </CardContent>
      <CourseCardFooter
        course={course}
        selectedCategories={selectedCategories}
      />
    </Card>
  );
}
