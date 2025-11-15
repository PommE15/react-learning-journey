import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Book, Clock } from "lucide-react";
import React from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { CategoryFilter } from "../components/category-filter";
import { CourseCardCompleted } from "../components/card/course-card-completed";
import { CourseCardProgress } from "../components/card/course-card-progess";
import { CourseCardRecommend } from "../components/card/course-card-recommended";
import type {
  Course,
  CourseCategory,
  CourseLink,
  CourseNode,
  UserCourse,
} from "../data/types";
import type { DashboardLoaderData } from "./dashboard-route";
import { formatTime } from "@/src/utils/formats";
import NetworkGraph from "../charts/network";
import {
  courseCategories,
  courseLinks,
  courseNodes,
} from "../data/courses-network";

export function Dashboard() {
  const {
    user,
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

  const [, setSearchParams] = useSearchParams();

  const totalTimeSpent = [...user.completed, ...user.in_progress].reduce(
    (total, course) => total + course.total_time_spent,
    0,
  );

  // Control which sections are open by default
  const [openSections, setOpenSections] = React.useState<string[]>([
    "in-progress", // Open in-progress by default
    "recommended", // Open recommended by default
  ]);

  // URL update helper
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

  // Get user courses that match current filters (for counting)
  const getFilteredUserCourses = (
    userCourses: UserCourse[],
    allCourses: Course[],
  ) => {
    return userCourses.filter((userCourse) =>
      allCourses.some((course) => course.id === userCourse.id),
    );
  };

  const filteredInProgressUser = getFilteredUserCourses(
    user.in_progress,
    inProgressCourses,
  );
  const filteredCompletedUser = getFilteredUserCourses(
    user.completed,
    completedCourses,
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
        | Hi, I'm ID {user.user_id}. This is my Learning Journey
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
          <span>{user.completed.length + user.in_progress.length} courses</span>
          <Clock className="ml-2 size-4" />
          <span>{formatTime(totalTimeSpent)} total</span>
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
        <AccordionItem value="completed">
          <AccordionTrigger>
            <h2>
              Completed ({filteredCompletedUser.length}
              {hasActiveFilters && ` of ${user.completed.length}`})
            </h2>
          </AccordionTrigger>
          <AccordionContent className="pb-16">
            {completedCourses.length === 0 && hasActiveFilters ? (
              <div className="py-8 text-muted-foreground">
                <p>No completed courses match your selected categories.</p>
              </div>
            ) : completedCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {completedCourses.map((course) => {
                  const userCourse = filteredCompletedUser.find(
                    (uc) => uc.id === course.id,
                  );
                  if (!userCourse) return null;

                  return (
                    <CourseCardCompleted
                      key={course.id}
                      course={course}
                      userCourse={userCourse}
                      selectedCategories={filters.selectedCategories}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-muted-foreground">
                <p>No completed courses yet</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="in-progress">
          <AccordionTrigger>
            <h2>
              Continue Learning ({filteredInProgressUser.length}
              {hasActiveFilters && ` of ${user.in_progress.length}`})
            </h2>
          </AccordionTrigger>
          <AccordionContent className="pb-16">
            {inProgressCourses.length === 0 && hasActiveFilters ? (
              <div className="py-8 text-muted-foreground">
                <p>No in-progress courses match your selected categories.</p>
              </div>
            ) : inProgressCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {inProgressCourses.map((course) => {
                  const userCourse = filteredInProgressUser.find(
                    (uc) => uc.id === course.id,
                  );
                  if (!userCourse) return null;
                  return (
                    <CourseCardProgress
                      key={course.id}
                      course={course}
                      userCourse={userCourse}
                      selectedCategories={filters.selectedCategories}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-muted-foreground">
                <p>No courses in progress</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Recommended courses */}
        <AccordionItem value="recommended">
          <AccordionTrigger>
            <h2>
              Recommended for You ({recommendedCourses.length}
              {hasActiveFilters && ` of ${user.recommended.length}`})
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            {recommendedCourses.length === 0 && hasActiveFilters ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recommended courses match your selected categories.</p>
              </div>
            ) : recommendedCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {recommendedCourses.map((course) => {
                  const recommendation = user.recommended.find(
                    (r) => r.id === course.id,
                  );
                  if (!recommendation) return null;

                  return (
                    <CourseCardRecommend
                      key={course.id}
                      course={course}
                      score={recommendation.score}
                      selectedCategories={filters.selectedCategories}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recommendations available</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
