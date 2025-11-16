// import dummyData from "../data/courses.json";
import dummyData from "../data/courses-list.json";
import type { Course } from "../data/types";

export const dummyCourses = dummyData.courses satisfies Course[];
export const dummyCategories = dummyData.categories satisfies string[];
