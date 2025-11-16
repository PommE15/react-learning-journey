import { redirect, type LoaderFunctionArgs } from "react-router";
import { dummyCategories, dummyCourses } from "../courses/courses-data";
import type { Course, UserData } from "../data/types";
import { generateUserData, userData } from "../data/users";
import { Dashboard } from "./dashboard-view";

export interface DashboardLoaderData {
  user: UserData;
  completedCourses: Course[];
  inProgressCourses: Course[];
  recommendedCourses: Course[];
  categories: string[]; // Add categories
  filters: {
    selectedCategories: string[];
  };
}

export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<DashboardLoaderData> {
  const url = new URL(request.url);

  // Parse URL parameters for filtering
  const categoriesParam = url.searchParams.get("categories");
  const selectedCategories = categoriesParam
    ? categoriesParam.split(",").filter((cat) => dummyCategories.includes(cat))
    : [];

  // In a real app, you'd get the user ID from authentication
  const userId = params.userId ? parseInt(params.userId) : 1;

  // Generate or get user data
  const user = userId === 1 ? userData : generateUserData(userId);

  // Get course details for each category and apply filtering
  const getFilteredCourses = (courseIds: number[]) => {
    return courseIds
      .map((id) => dummyCourses.find((c) => c.id === id))
      .filter(Boolean)
      .filter(
        (course) =>
          selectedCategories.length === 0 ||
          course!.categories.some((cat) => selectedCategories.includes(cat)),
      ) as Course[];
  };

  const completedCourses = getFilteredCourses(user.completed.map((c) => c.id));
  const inProgressCourses = getFilteredCourses(
    user.in_progress.map((c) => c.id),
  );
  const recommendedCourses = getFilteredCourses(
    user.recommended.map((c) => c.id),
  );

  return {
    user,
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
