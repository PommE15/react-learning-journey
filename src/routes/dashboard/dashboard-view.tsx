import { Accordion } from "@/components/ui/accordion";
import { arraysHaveCommonItem } from "@/src/utils/helper";
import { Book, Clock } from "lucide-react";
import React from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import NetworkGraph from "../charts/network";
import { CourseCardCompleted } from "../components/card/course-card-completed";
import { CourseCardProgress } from "../components/card/course-card-progess";
import { CourseCardRecommend } from "../components/card/course-card-recommended";
import { CategoryFilter } from "../components/category-filter";
import { SectionAccordion } from "../components/section-accordion";
import {
  courseCategories,
  courseLinks,
  courseNodes,
} from "../data/courses-network";
import type { CourseCategory, CourseLink, CourseNode } from "../data/types";
import type { DashboardLoaderData } from "./dashboard-route";

export function Dashboard() {
  const {
    completedCourses,
    inProgressCourses,
    recommendedCourses,
    categories,
    filters,
  } = useLoaderData<DashboardLoaderData>();

  const courseData: {
    nodes: CourseNode[];
    links: CourseLink[];
    paths: CourseCategory[];
  } = {
    nodes: courseNodes,
    links: courseLinks,
    paths: courseCategories,
  };

  const totalTimeSpent = completedCourses.reduce(
    (acc, course) => acc + course.hours,
    0,
  );

  // Control which sections are open by default
  const [openSections, setOpenSections] = React.useState<string[]>([
    "in-progress", // Open in-progress by default
    "recommended", // Open recommended by default
  ]);

  // URL update helper
  const [, setSearchParams] = useSearchParams();
  const updateSearchParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (current) => {
          const newParams = new URLSearchParams(current);

          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
              newParams.delete(key);
            } else {
              newParams.set(key, value);
            }
          });
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Category filter handler
  const handleToggleCategory = (category: string) => {
    const current = filters.selectedCategories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];

    updateSearchParams({
      categories: updated.length > 0 ? updated.join(",") : null,
    });
  };

  // Clear all filters
  const hasActiveFilters = filters.selectedCategories.length > 0;

  const filteredCategories = filters.selectedCategories;
  const filteredCompletedCourses = completedCourses.filter((course) =>
    arraysHaveCommonItem(course.categories, filteredCategories),
  );
  const filteredInProgressCourses = inProgressCourses.filter((course) =>
    arraysHaveCommonItem(course.categories, filteredCategories),
  );
  const filteredRecommendedCourses = recommendedCourses.filter((course) =>
    arraysHaveCommonItem(course.categories, filteredCategories),
  );

  return (
    <div className="container px-4 mx-auto max-w-7xl space-y-4 ">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 sm:mt-8">
        <span className="text-foreground  w-[136px]">My Learning Journey</span>
        <span>|</span>
        <Link to="/courses" className="hover:underline">
          Discover
        </Link>
      </div>

      {/* Header with Stats */}
      <h1 className="sm:mb-8">
        | I'm on my <u>Frontend</u> learning way
      </h1>

      {/*<div className="p3">
        I have background in {user.background}, I'm taking courses of{" "}
        {user.learning}, and I'd like to learn more about {user.learning}, or
        give me suggestions on how to improve my learning journey.
      </div>*/}
      {/*<CategoryCompletionRadar
        completedCourses={user.completed}
        allCategories={categories}
      />*/}

      <NetworkGraph
        data={courseData}
        selectedCategories={filters.selectedCategories}
        isUser={true}
      />

      {/* Filter andand Summary */}
      <div className="sticky-controls -mt-4">
        <CategoryFilter
          categories={categories}
          selectedCategories={filters.selectedCategories}
          onToggleCategory={handleToggleCategory}
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground -ml-0.5 mt-3">
          <Book className="size-4" />
          <span>
            {completedCourses.length + inProgressCourses.length} courses visited
          </span>
          <Clock className="ml-2 size-4" />
          <span>{totalTimeSpent} hours spent</span>
        </div>
      </div>

      {/* Course Sections Accordion */}
      <Accordion
        type="multiple"
        value={openSections}
        defaultValue={["in-progress"]}
        onValueChange={setOpenSections}
        className="w-full"
      >
        {/* Completed */}
        <SectionAccordion
          id="completed"
          title="Completed"
          items={filteredCompletedCourses}
          total={completedCourses.length}
          hasActiveFilters={hasActiveFilters}
          render={(course) => (
            <CourseCardCompleted
              key={course.id}
              course={course}
              selectedCategories={filters.selectedCategories}
            />
          )}
        />

        {/* In Progress */}
        <SectionAccordion
          id="in-progress"
          title="Continue Learning"
          items={filteredInProgressCourses}
          total={inProgressCourses.length}
          hasActiveFilters={hasActiveFilters}
          render={(course) => (
            <CourseCardProgress
              key={course.id}
              course={course}
              selectedCategories={filters.selectedCategories}
            />
          )}
        />

        {/* Recommended */}
        <SectionAccordion
          id="recommended"
          title="Recommended for You"
          items={filteredRecommendedCourses}
          total={recommendedCourses.length}
          hasActiveFilters={hasActiveFilters}
          render={(course) => (
            <CourseCardRecommend
              key={course.id}
              course={course}
              selectedCategories={filters.selectedCategories}
            />
          )}
        />
      </Accordion>

      <footer className="flex justify-center items-center h-16 ">
        <p className="text-gray-500">
          © 2025 React Learning Journey By Apple C.F |{" "}
          <Link to="https://github.com/PommE15/react-learning-journey">
            GitHub Repo
          </Link>
        </p>
      </footer>
    </div>
  );
}
