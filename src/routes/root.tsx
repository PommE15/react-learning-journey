import { redirect } from "react-router";
import { coursesRoute } from "./courses/courses-route";
import { dashboardRoute } from "./dashboard/dashboard-route";

export const root = [
  {
    path: "/",
    loader: () => redirect("/dashboard"),
  },
  coursesRoute,
  dashboardRoute,
  // {
  //   path: "/:name",
  //   ErrorBoundary: () => {
  //     return <div>oops</div>;
  //   },
  //   loader: ({ params }) => {
  //     return { name: params.name, now: Date.now() };
  //   },
  //   Component: () => {
  //     const { name, now } = useLoaderData();
  //     return (
  //       <div>
  //         <h1>Hello {name}</h1>
  //         <p>Current time: {now}</p>
  //       </div>
  //     );
  //   },
  // },
];
