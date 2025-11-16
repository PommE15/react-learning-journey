import { dummyCourses } from "../courses/courses-data";
import type { UserCourse, UserCourseRecommended, UserData } from "./types";
import { courseNodes } from "./courses-network";

export const generateRecommended = (
  completed: string[],
  inProgress: string[],
) => {
  // Get paths that have both completed and inProgress courses
  const completedPaths = new Set<number>();
  const inProgressPaths = new Set<number>();

  // Collect all paths from completed courses
  completed.forEach((courseId) => {
    const node = courseNodes.find((n) => n.id === courseId);
    if (node) {
      node.path.forEach((pathId) => completedPaths.add(pathId));
    }
  });

  // Collect all paths from inProgress courses
  inProgress.forEach((courseId) => {
    const node = courseNodes.find((n) => n.id === courseId);
    if (node) {
      node.path.forEach((pathId) => inProgressPaths.add(pathId));
    }
  });

  // Find intersection of paths (paths that have both completed and inProgress courses)
  const sharedPaths = [...completedPaths].filter((path) =>
    inProgressPaths.has(path),
  );

  // Get recommended courses: nodes in shared paths that aren't completed or inProgress
  const recommended = courseNodes
    .filter(
      (node) =>
        node.path.some((pathId) => sharedPaths.includes(pathId)) &&
        !completed.includes(node.id) &&
        !inProgress.includes(node.id),
    )
    .map((node) => node.id);

  return recommended;
};

// --- Old version ---
// --- Helpers ---
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomTimestamp(daysBack: number = 60): string {
  const now = new Date();
  const past = new Date(
    now.getTime() - randomInt(0, daysBack) * 24 * 60 * 60 * 1000,
  );
  past.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59), 0);
  return past.toISOString();
}

function generateSessionProgress() {
  // Generate realistic time spent (5-45 minutes per session)
  const timeSpent = randomInt(5, 45);

  // Task score: 0-100 (higher scores more likely for completed sessions)
  const taskScore = randomInt(60, 100);

  // Question score: null for some sessions, 0-100 for others
  const hasQuestions = Math.random() > 0.3; // 70% chance of having questions
  const questionScore = hasQuestions ? randomInt(40, 100) : null;

  return {
    timestamp: randomTimestamp(),
    time_spent: timeSpent,
    task_score: taskScore,
    question_score: questionScore,
  };
}

function generateUserCourse(
  courseId: number,
  status: "completed" | "in_progress",
): UserCourse {
  const course = dummyCourses.find((c) => c.id === courseId);
  if (!course) {
    throw new Error(`Course with id ${courseId} not found`);
  }

  const totalSessions = course.sessions;

  let completedSessions: number;
  let progress: number;

  if (status === "completed") {
    completedSessions = totalSessions;
    progress = 100;
  } else {
    // In progress: 10-90% complete
    progress = randomInt(10, 90);
    completedSessions = Math.ceil((progress / 100) * totalSessions);
  }

  // Generate sessions data
  const sessions = Array.from({ length: completedSessions }, () =>
    generateSessionProgress(),
  );

  const totalTimeSpent = sessions.reduce(
    (sum, session) => sum + session.time_spent,
    0,
  );

  return {
    id: courseId,
    progress,
    total_time_spent: totalTimeSpent,
    sessions,
  };
}

function generateRecommendedCourse(courseId: number): UserCourseRecommended {
  // Score between 60-95 (realistic recommendation scores)
  const score = randomFloat(60, 95);

  return {
    id: courseId,
    score,
  };
}

function getRandomCourseIds(
  excludeIds: number[] = [],
  count: number,
): number[] {
  const availableCourses = dummyCourses.filter(
    (course) => !excludeIds.includes(course.id),
  );

  if (availableCourses.length < count) {
    return availableCourses.map((c) => c.id);
  }

  const selected: number[] = [];
  const available = [...availableCourses];

  for (let i = 0; i < count; i++) {
    const randomIndex = randomInt(0, available.length - 1);
    const course = available.splice(randomIndex, 1)[0];
    selected.push(course.id);
  }

  return selected;
}

function generateUserData(userId: number = 1): UserData {
  // Generate realistic numbers
  const numCompleted = randomInt(2, 8);
  const numInProgress = randomInt(1, 4);
  const numRecommended = randomInt(5, 10);

  // Generate completed courses
  const completedIds = getRandomCourseIds([], numCompleted);
  const completed = completedIds.map((id) =>
    generateUserCourse(id, "completed"),
  );

  // Generate in-progress courses (exclude completed)
  const inProgressIds = getRandomCourseIds(completedIds, numInProgress);
  const in_progress = inProgressIds.map((id) =>
    generateUserCourse(id, "in_progress"),
  );

  // Generate recommended courses (exclude completed and in-progress)
  const excludeIds = [...completedIds, ...inProgressIds];
  const recommendedIds = getRandomCourseIds(excludeIds, numRecommended);
  const recommended = recommendedIds.map((id) => generateRecommendedCourse(id));

  return {
    user_id: userId,
    completed,
    in_progress,
    recommended,
  };
}

// Generate and export user data
export const userData: UserData = generateUserData(1);

// Export the generator function for creating multiple users
export { generateUserData };

// Export some sample data for testing
export const sampleUsers = {
  user1: generateUserData(1),
  user2: generateUserData(2),
  user3: generateUserData(3),
};
