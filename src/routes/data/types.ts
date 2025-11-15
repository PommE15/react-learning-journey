import * as d3 from "d3";

export type Session = {
  title: string;
  tasks: number;
  questions: number;
  time: number;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  categories: string[];
  sessions: Session[];
  total_tasks: number;
  total_questions: number;
  total_time: number;
};

export type UserCourse = {
  id: number;
  progress: 100 | number;
  total_time_spent: number;
  sessions: {
    timestamp: string;
    time_spent: number;
    task_score: number;
    question_score: number | null;
  }[];
};

export type UserCourseRecommended = {
  id: number;
  score: number;
};

export type UserData = {
  user_id: number;
  completed: UserCourse[];
  in_progress: UserCourse[];
  recommended: UserCourseRecommended[];
};

export interface CourseNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  path: number[];
  size: number;
  px?: number;
}

export interface CourseLink extends d3.SimulationLinkDatum<CourseNode> {
  source: string | CourseNode;
  target: string | CourseNode;
  path: number[];
  length?: number;
  width?: number;
}

export type CourseCategory = {
  py: number;
  color: string;
  title: string;
  categories: string[];
  path: number[];
};

export type NetworkGraphProps = {
  data: {
    nodes: CourseNode[];
    links: CourseLink[];
    paths: CourseCategory[];
  };
  selectedCategories: string[];
};
