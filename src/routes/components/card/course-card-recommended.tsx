import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { formatStarRating } from "@/src/utils/formats";
import { Star } from "lucide-react";
import type { Course } from "../../data/types";
import { CourseCardDescription } from "./card-description";
import { CourseCardFooter } from "./card-footer";
import { randomText } from "../../data/random";

interface CourseCardProps {
  score: number;
  course: Course;
  selectedCategories: string[];
}

export function CourseCardRecommend({
  score,
  course,
  selectedCategories,
}: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3>{course.title}</h3>
        <CourseCardDescription course={course} />
        <CardAction>
          <div className="flex items-center gap-1 text-sm text-amber-400 mt-1">
            {formatStarRating(score)}
            <Star className="h-4 w-4 fill-current" />
          </div>
        </CardAction>
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
