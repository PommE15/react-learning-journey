import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./styles/globals.css";

import { root } from "./routes/root";

// Determine basename dynamically
const basename = import.meta.env.DEV // dev server
  ? "/" // local
  : "/react-learning-journey"; // GitHub Pages

const router = createBrowserRouter(root, { basename });

const appRoot = document.getElementById("root")!;

ReactDOM.createRoot(appRoot).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
