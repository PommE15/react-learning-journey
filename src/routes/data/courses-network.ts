import type { CourseCategory, CourseLink, CourseNode } from "./types";

// course categories
export const courseCategories: CourseCategory[] = [
  {
    py: 1 / 2,
    color: "var(--color-muted-foreground)",
    title: "Dev Programming",
    categories: ["Programming"],
    path: [1],
  },
  {
    py: 2 / 8,
    color: "#ffd131",
    title: "Frontend Web",
    categories: ["Frontend"],
    path: [2],
  },
  {
    py: 3 / 8,
    color: "#ff9f7a",
    title: "Backend Python",
    categories: ["Backend"],
    path: [3],
  },
  {
    py: 5 / 8,
    color: "#f19ad6",
    title: "iOS Swift",
    categories: ["iOS"],
    path: [4],
  },
  {
    py: 6 / 8,
    color: "#e485d1",
    title: "Android Kotlin",
    categories: ["Android"],
    path: [5],
  },
  {
    py: 7 / 8,
    color: "#eba5ff",
    title: "Blockchain",
    categories: ["Blockchain"],
    path: [6],
  },
];

// course programs and courses
export const courseNodes: CourseNode[] = [
  {
    id: "p1",
    title: "Intro to dev programming",
    path: [1, 2, 3, 6],
    size: 4,
    px: 1 / 4,
  },
  // { id: "p2", ti: "Frontend web dev", path: [2], size: 4, px: 1 / 2 },
  { id: "p3", title: "Backend dev with Python", path: [3], size: 5, px: 1 / 2 },
  { id: "p4", title: "iOS dev with Swift", path: [4], size: 6, px: 1 / 2 },
  { id: "p5", title: "Android Kotlin", path: [5], size: 5, px: 1 / 2 },
  { id: "p6", title: "Blockchain dev", path: [6], size: 3, px: 1 / 2 },
  {
    id: "p7",
    title: "Data Structures and Algo",
    path: [1, 2, 3, 4, 5],
    size: 1,
    px: 3 / 4,
  },
  {
    id: "p8",
    title: "Intermediate Javascript",
    path: [6],
    size: 3,
    px: 2.5 / 4,
  },
  { id: "p9", title: "React", path: [2], size: 3, px: 3.5 / 4 },
  { id: "c20", title: "Web dev fundamentals", path: [2], size: 1 },
  { id: "c21", title: "CSS/HTML", path: [2], size: 1 },
  { id: "c22", title: "JavaScript and DOM", path: [2], size: 1 },
  { id: "c23", title: "Modern dev and optimizations", path: [2], size: 1 },
];

export const courseLinks: CourseLink[] = [
  // 1. Intro to dev programming
  { source: "p1", target: "c20", width: 2, path: [2] },
  { source: "p1", target: "p3", width: 2, path: [3] },
  { source: "p1", target: "p6", width: 2, path: [6] },
  { source: "p1", target: "p7", width: 2, path: [1] },
  // 6: Data Structures
  { source: "c23", target: "p7", width: 2, path: [2] },
  { source: "p3", target: "p7", width: 2, path: [3] },
  { source: "p4", target: "p7", width: 2, path: [4] },
  { source: "p5", target: "p7", width: 2, path: [5] },
  // others
  { source: "p6", target: "p8", width: 2, path: [6] },
  { source: "p7", target: "p9", width: 2, path: [2] },
  { source: "c20", target: "c21", length: 1, path: [2] },
  { source: "c21", target: "c22", length: 1, path: [2] },
  { source: "c22", target: "c23", length: 1, path: [2] },
];
