import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MenuEditor from "./pages/MenuEditor";
import Analytics from "./pages/Analytics";
import Library from "./pages/Library";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/calendar",
    element: <Dashboard />,
  },
  {
    path: "/editor",
    element: <MenuEditor />,
  },
  {
    path: "/editor/:menuId",
    element: <MenuEditor />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
  },
  {
    path: "/library",
    element: <Library />,
  },
]);