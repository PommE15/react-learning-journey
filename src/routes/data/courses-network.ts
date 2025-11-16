import type {
  CourseCategory,
  CourseLink,
  CourseNode,
  UserCourses,
} from "./types";

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
    hasChild: true,
  },
  {
    id: "c10",
    title: "Introduction to Web Development",
    path: [1, 2, 3, 6],
    size: 1,
  },
  {
    id: "c11",
    title: "Introduction to Programming with Python",
    path: [1, 2, 3, 6],
    size: 1,
  },
  {
    id: "c12",
    title: "Introduction to Javascript",
    path: [1, 2, 3, 6],
    size: 1,
  },
  { id: "c13", title: "Git and GitHub", path: [1, 2, 3, 6], size: 1 },
  {
    id: "p2",
    title: "Frontend web dev",
    path: [2],
    size: 4,
    px: 1 / 2,
    hasChild: true,
  },
  { id: "c20", title: "Web Dev Fundamentals", path: [2], size: 1 },
  { id: "c21", title: "CSS/HTML", path: [2], size: 1 },
  { id: "c22", title: "JavaScript and DOM", path: [2], size: 1 },
  { id: "c23", title: "Modern dev and Optimization", path: [2], size: 1 },
  { id: "p3", title: "Backend dev with Python", path: [3], size: 5, px: 1 / 2 },
  { id: "p4", title: "iOS dev with Swift", path: [4], size: 6, px: 1 / 2 },
  { id: "p5", title: "Android Kotlin", path: [5], size: 5, px: 1 / 2 },
  { id: "p6", title: "Blockchain Dev", path: [6], size: 3, px: 1 / 2 },
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
    path: [6, 2],
    size: 3,
    px: 2.5 / 4,
    hasChild: true,
  },
  { id: "c80", title: "Object-Oriented JavaScript", path: [6, 2], size: 1 },
  { id: "c81", title: "Functional Programming", path: [6, 2], size: 1 },
  {
    id: "c82",
    title: "Asynchronous Programming with JavaScript",
    path: [6, 2],
    size: 1,
  },
  {
    id: "p9",
    title: "React",
    path: [2],
    size: 3,
    px: 3.5 / 4,
    hasChild: true,
  },
  { id: "c90", title: "React Fundamentals", size: 1, path: [2] },
  { id: "c91", title: "React and Redux", size: 1, path: [2] },
  { id: "c92", title: "React Native", size: 1, path: [2] },
];

export const courseLinks: CourseLink[] = [
  // 1. Intro to dev programming
  // { id: "l1", source: "p1", target: "c20", width: 2, path: [2] },
  // { id: "l2", source: "p1", target: "p3", width: 2, path: [3] },
  // { id: "l3", source: "p1", target: "p6", width: 2, path: [6] },
  // { id: "l4", source: "p1", target: "p7", width: 2, path: [1] },

  { id: "l5", source: "c10", target: "c11", length: 1, path: [1, 2, 3, 6] },
  { id: "l6", source: "c11", target: "c12", length: 1, path: [1, 2, 3, 6] },
  {
    id: "l7",
    source: "c12",
    target: "c13",
    length: 1,
    path: [1, 2, 3, 6],
  },

  { id: "l8", source: "c13", target: "c20", width: 2, path: [2] },
  { id: "l9", source: "c13", target: "p3", width: 2, path: [3] },
  { id: "l10", source: "c13", target: "p6", width: 2, path: [6] },
  { id: "l11", source: "c13", target: "p7", width: 2, path: [1] },

  // 6: Data Structures
  { id: "l12", source: "c23", target: "p7", width: 2, path: [2], flag: true },
  { id: "l13", source: "p3", target: "p7", width: 2, path: [3] },
  { id: "l14", source: "p4", target: "p7", width: 2, path: [4] },
  { id: "l15", source: "p5", target: "p7", width: 2, path: [5] },
  // { id: "l16", source: "p7", target: "p9", width: 2, path: [2] },

  { id: "l17", source: "p7", target: "c90", length: 1, path: [2], flag: true },

  // others
  { id: "l18", source: "p6", target: "p8", width: 2, path: [6] },

  // 2: Frontend and 9: React
  { id: "l19", source: "c20", target: "c21", length: 1, path: [2] },
  { id: "l20", source: "c21", target: "c22", length: 1, path: [2] },
  { id: "l21", source: "c22", target: "c23", length: 1, path: [2] },

  { id: "l22", source: "c90", target: "c91", length: 1, path: [2], flag: true },
  { id: "l23", source: "c91", target: "c92", length: 1, path: [2], flag: true },

  { id: "l24", source: "c80", target: "c81", length: 1, path: [6, 2] },
  {
    id: "l25",
    source: "c81",
    target: "c82",
    length: 1,
    path: [6, 2],
    flag: true,
  },

  { id: "l26", source: "c22", target: "c80", width: 1.5, path: [2] },

  // { id: "l27", source: "c12", target: "p9", width: 0.5, path: [2] },
];

export const userCourses: UserCourses = {
  completed: [
    "c10",
    "c11",
    "c12",
    "c13",
    "c20",
    "c21",
    "c22",
    "c80",
    "p1",
    "p2",
    "p8",
  ],
  inProgress: ["c23", "c81"],
};
