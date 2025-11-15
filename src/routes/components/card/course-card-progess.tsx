import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CourseCardDescription } from "./card-description";
import { CourseCardFooter } from "./card-footer";
import type { Course, UserCourse } from "../../data/types";

interface CourseCardProps {
  course: Course;
  userCourse: UserCourse;
  selectedCategories: string[];
}

export function CourseCardProgress({
  course,
  userCourse,
  selectedCategories,
}: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3>{course.title}</h3>
        <CourseCardDescription
          course={course}
          userCourse={userCourse}
          isWorkInProgress
        />
      </CardHeader>
      <CardContent className="min-h-16 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{userCourse.progress}%</span>
        </div>
        <Progress
          value={userCourse.progress}
          className="h-2 [&>div]:bg-linear-to-r [&>div]:from-sky-200 [&>div]:to-blue-500"
        />
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
