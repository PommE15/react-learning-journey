import { Label } from "@/components/ui/label";
import * as React from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { CourseCard } from "../components/card/course-card";
import { CategoryFilter } from "../components/category-filter";
import { CourseSort } from "../components/course-sort";
import type { CoursesLoaderData } from "./courses-route";
// import { CourseTable } from "../charts/table";
import NetworkGraph from "../charts/network";

export function Courses() {
  const { filteredCourses, categories, filters, meta, courseData } =
    useLoaderData<CoursesLoaderData>();

  const [, setSearchParams] = useSearchParams();

  // URL update helpers
  const updateSearchParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (current) => {
          const newParams = new URLSearchParams(current);

          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === "none") {
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

  // Event handlers
  const handleToggleCategory = (category: string) => {
    const current = filters.selectedCategories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];

    updateSearchParams({
      categories: updated.length > 0 ? updated.join(",") : null,
    });
  };

  const handleToggleSort = () => {
    const nextSort =
      filters.sortOrder === "none"
        ? "asc"
        : filters.sortOrder === "asc"
          ? "desc"
          : "none";

    updateSearchParams({ sort: nextSort });
  };

  // const handleSearchChange = (query: string) => {
  //   updateSearchParams({ search: query || null });
  // };
  // const handleClearSearch = () => {
  //   updateSearchParams({ search: null });
  // };

  return (
    <div className="container px-4 mx-auto max-w-7xl space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 sm:mt-8">
        <Link to="/dashboard" className="hover:underline w-[136px]">
          My Learning Journey
        </Link>
        <span>|</span>
        <span className="text-foreground">Discover</span>
      </div>
      <h1 className="sm:mb-8">
        | All Courses
        <Link to="/dashboard" className="text-foreground"></Link>
      </h1>

      <NetworkGraph
        data={courseData}
        selectedCategories={filters.selectedCategories}
      />

      {/* Search */}
      {/*<div className="grid md:grid-cols-2 lg:grid-cols-3">
        <CourseSearch
          searchQuery={filters.searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      </div>*/}

      {/* Filter, Sort Controls and Results Summary */}
      <div className="sticky-controls -mt-4 sm:pl-6">
        <CategoryFilter
          categories={categories}
          selectedCategories={filters.selectedCategories}
          onToggleCategory={handleToggleCategory}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground mt-1">
            Showing {meta.filteredCount} of {meta.totalCount} courses
          </p>
          <CourseSort
            sortOrder={filters.sortOrder}
            onToggleSort={handleToggleSort}
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Label
          htmlFor="no-results"
          className="text-sm py-12 text-muted-foreground"
        >
          No courses found
        </Label>
      )}

      {/*<CourseTable />*/}

      {/* Courses Grid */}
      {filteredCourses.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              selectedCategories={filters.selectedCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
}
