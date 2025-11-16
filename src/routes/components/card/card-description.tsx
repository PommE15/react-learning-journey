import { CardDescription } from "@/components/ui/card";
import { BookOpen, Clock, ClipboardList, FileQuestionMark } from "lucide-react";
import type { Course, UserCourse } from "../../data/types";
import {
  randomDatePastSixMonths,
  randomHoursIntBaseOn,
  randomIntSmallerThan,
} from "../../data/random";
import { formatTimestamp } from "@/src/utils/formats";

interface CourseCardDescriptionProps {
  course: Course;
  userCourse?: UserCourse;
  isWorkInProgress?: boolean;
}

export function CourseCardDescription({
  course,
  userCourse = undefined,
}: CourseCardDescriptionProps) {
  return (
    <CardDescription>
      <div className="flex items-center gap-1">
        <BookOpen className="size-4" />
        {course.sessions} Sessions
        <FileQuestionMark className="size-4 ml-1" />
        {course.sessions} Quiz
        {course.tasks > 0 && (
          <>
            <ClipboardList className="size-4 ml-1" />
            {course.tasks} Tasks
          </>
        )}
      </div>

      {userCourse && (
        <div className="flex items-center gap-1">
          <Clock className="size-4" />
          {course.hours} h |
          <span>spent: {randomHoursIntBaseOn(course.hours)}</span> -
          <span>updated: {formatTimestamp(randomDatePastSixMonths())}</span>
        </div>
      )}
    </CardDescription>
  );
}
