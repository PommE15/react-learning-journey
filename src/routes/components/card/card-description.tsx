import { CardDescription } from "@/components/ui/card";
import { formatTime, formatTimestamp } from "@/src/utils/formats";
import { BookOpen, Clock } from "lucide-react";
import type { Course, UserCourse } from "../../data/types";

interface CourseCardDescriptionProps {
  course: Course;
  userCourse?: UserCourse;
  isWorkInProgress?: boolean;
}

export function CourseCardDescription({
  course,
  userCourse = undefined,
  isWorkInProgress = false,
}: CourseCardDescriptionProps) {
  return (
    <CardDescription>
      <div className="flex items-center gap-1">
        <Clock className="size-4" />
        {formatTime(course.total_time)}
        <BookOpen className="size-4 ml-2" />
        {isWorkInProgress && (
          <span>{userCourse && userCourse.sessions.length} / </span>
        )}
        {course.sessions.length} sessions {userCourse ? "completed" : ""}
      </div>
      {userCourse && (
        <div>
          Time Spent: {formatTime(userCourse.total_time_spent)}
          <span className="mx-2">|</span>
          Last Updated:{" "}
          {formatTimestamp(
            userCourse.sessions[userCourse.sessions.length - 1].timestamp,
          )}
        </div>
      )}
    </CardDescription>
  );
}
