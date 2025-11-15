import { coursesRoute } from "./courses/courses-route";
import { dashboardRoute } from "./dashboard/dashboard-route";

export const root = [
  {
    path: "/",
    element: <div>Hello World</div>,
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
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Card Title</CardTitle>
  //           <CardDescription>Card Description</CardDescription>
  //           <CardAction>Card Action</CardAction>
  //         </CardHeader>
  //         <CardContent>
  //           <Skeleton className="h-4 w-[250px]" />
  //           <p>
  //             {" "}
  //             Hello World {now}, {name}!
  //           </p>
  //         </CardContent>
  //         <CardFooter>
  //           <p>Card Footer</p>
  //         </CardFooter>
  //       </Card>
  //     );
  //   },
  // },
];
