import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/:queryName",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root2")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
