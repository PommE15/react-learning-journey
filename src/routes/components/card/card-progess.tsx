import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { randomIntRanged, randomIntSmallerThan } from "../../data/random";
import type { Course } from "../../data/types";

interface CardProgressProps {
  data: Course;
  isCompleted?: boolean;
}

export function CardProgress({ data, isCompleted = false }: CardProgressProps) {
  const { sessions } = data;
  const sessionCompleted = randomIntSmallerThan(sessions);
  const sessionProgress = Math.ceil((sessionCompleted * 100) / sessions);
  const quiz = randomIntRanged(5, 15);
  const quizCompleted = isCompleted
    ? quiz
    : randomIntRanged(quiz / 2, quiz - 1);
  const quizProgress = isCompleted
    ? 100
    : Math.ceil((quizCompleted * 100) / quiz);
  const quizCorrect = Math.ceil(
    randomIntRanged(quizCompleted / 2, quizCompleted - 1),
  );
  const quizAccuracy = quizCorrect / quizCompleted;

  return (
    <CardContent className="min-h-16 space-y-1 opacity-80">
      <div className={`${isCompleted ? "hidden" : ""}`}>
        <div className="flex justify-between text-sm">
          <span>
            Session: {sessionCompleted} / {sessions} done
          </span>
          <span>{sessionProgress}%</span>
        </div>
        <Progress
          value={sessionProgress}
          className="h-2 [&>div]:bg-linear-to-r [&>div]:from-sky-200 [&>div]:to-blue-500 bg-gray-100"
        />
        <div></div>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          <span>
            Quiz: {quizCorrect} / {quizCompleted} correct
          </span>
          <span className={`${isCompleted ? "hidden" : ""}`}>
            , {quizCompleted} / {quiz} done
          </span>
        </div>
        <span>{Math.round(quizProgress)}%</span>
      </div>
      <Progress
        value={quizProgress}
        className={`h-2 [&>div]:bg-linear-to-r [&>div]:from-sky-200 [&>div]:to-blue-400 bg-gray-100 ${isCompleted ? "hidden" : ""}`}
      />
      <Progress
        value={quizProgress * quizAccuracy}
        className="h-2 [&>div]:bg-linear-to-r [&>div]:from-amber-400 [&>div]:to-yellow-200 -mt-1 opacity-75 bg-gray-100"
      />
      <div className="grid grid-cols-8  -mt-0.5">
        <span className="text-xs col-span-2 col-start-2">
          Accuracy: {Math.ceil(quizAccuracy * 100)}%
        </span>
      </div>
    </CardContent>
  );
}
