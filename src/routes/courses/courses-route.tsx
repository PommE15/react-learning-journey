import type { LoaderFunctionArgs } from "react-router";
import { Button } from "@/components/ui/button";
import { dummyCourses, dummyCategories } from "./courses-data";
import { Courses } from "./courses-view";
import type {
  Course,
  CourseCategory,
  CourseLink,
  CourseNode,
} from "../data/types";
import {
  courseCategories,
  courseLinks,
  courseNodes,
} from "../data/courses-network";

export type SortOrder = "none" | "asc" | "desc";

export interface CoursesLoaderData {
  allCourses: Course[];
  filteredCourses: Course[];
  categories: string[];
  filters: {
    selectedCategories: string[];
    sortOrder: SortOrder;
    searchQuery: string;
  };
  meta: {
    totalCount: number;
    filteredCount: number;
  };
  courseData: {
    nodes: CourseNode[];
    links: CourseLink[];
    paths: CourseCategory[];
  };
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<CoursesLoaderData> {
  const url = new URL(request.url);

  // Parse URL parameters
  const categoriesParam = url.searchParams.get("categories");
  const sortParam = url.searchParams.get("sort") as SortOrder;
  const searchParam = url.searchParams.get("search");

  // Validate and clean parameters
  const selectedCategories = categoriesParam
    ? categoriesParam.split(",").filter((cat) => dummyCategories.includes(cat))
    : [];

  const sortOrder: SortOrder =
    sortParam && ["asc", "desc"].includes(sortParam) ? sortParam : "none";

  const searchQuery = searchParam?.trim() || "";

  // Apply filtering logic
  let filteredCourses = dummyCourses;

  // Filter by categories
  if (selectedCategories.length > 0) {
    filteredCourses = filteredCourses.filter((course) =>
      course.categories.some((cat) => selectedCategories.includes(cat)),
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredCourses = filteredCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.categories.some((cat) => cat.toLowerCase().includes(query)),
    );
  }

  // Apply sorting
  if (sortOrder !== "none") {
    filteredCourses = [...filteredCourses].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }

  return {
    allCourses: dummyCourses,
    filteredCourses,
    categories: dummyCategories,
    filters: {
      selectedCategories,
      sortOrder,
      searchQuery,
    },
    meta: {
      totalCount: dummyCourses.length,
      filteredCount: filteredCourses.length,
    },
    courseData: {
      nodes: courseNodes,
      links: courseLinks,
      paths: courseCategories,
    },
  };
}

// Route configuration
export const coursesRoute = {
  path: "/courses",
  loader,
  Component: Courses,
  ErrorBoundary: () => {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load courses. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  },
};
