import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import { CourseCardDescription } from "./card-description";
import { CourseCardFooter } from "./card-footer";
import type { Course, UserCourse } from "../../data/types";
import { CardProgress } from "./card-progess";

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
        <CardAction>
          <CircleCheckBig className="h-4 w-4 text-blue-600 font-bold mt-2" />
        </CardAction>
        <CourseCardDescription course={course} userCourse={userCourse} />
      </CardHeader>
      <CardContent className="-mb-4">Completed</CardContent>
      <CardProgress data={course} isCompleted={true} />
      <CourseCardFooter
        course={course}
        selectedCategories={selectedCategories}
      />
    </Card>
  );
}
