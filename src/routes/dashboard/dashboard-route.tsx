import { type LoaderFunctionArgs } from "react-router";
import { dummyCategories, dummyCourses } from "../courses/courses-data";
import { courseNodes, userCourses } from "../data/courses-network";
import type { Course } from "../data/types";
import { generateRecommended } from "../data/users";
import { Dashboard } from "./dashboard-view";

export interface DashboardLoaderData {
  completedCourses: Course[];
  inProgressCourses: Course[];
  recommendedCourses: Course[];
  categories: string[]; // Add categories
  filters: {
    selectedCategories: string[];
  };
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<DashboardLoaderData> {
  const url = new URL(request.url);

  // Parse URL parameters for filtering
  const categoriesParam = url.searchParams.get("categories");
  const selectedCategories = categoriesParam
    ? categoriesParam.split(",").filter((cat) => dummyCategories.includes(cat))
    : ["Frontend"];

  const { completed, inProgress } = userCourses;

  function getCourseTitleByIds(ids: string[]) {
    const courseMap = Object.fromEntries(
      courseNodes.map((c) => [c.id, c.title]),
    );

    return ids.map((id) => courseMap[id]).filter(Boolean);
  }

  const completedTitles = getCourseTitleByIds(completed);
  const inProgressTitles = getCourseTitleByIds(inProgress);
  const RecommendedTitles = getCourseTitleByIds(
    generateRecommended(completed, inProgress),
  );

  const completedCourses = dummyCourses.filter((course) =>
    completedTitles.includes(course.title),
  );
  const inProgressCourses = dummyCourses.filter((course) =>
    inProgressTitles.includes(course.title),
  );
  const recommendedCourses = dummyCourses.filter((course) =>
    RecommendedTitles.includes(course.title),
  );
  return {
    completedCourses,
    inProgressCourses,
    recommendedCourses,
    categories: dummyCategories,
    filters: {
      selectedCategories,
    },
  };
}

export const dashboardRoute = {
  path: "/dashboard/:userId?",
  // loader: () => redirect("/dashboard/Apple_CF"),
  loader,
  Component: Dashboard,
};
