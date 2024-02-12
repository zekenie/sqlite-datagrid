import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page, { loader } from "./components/Page";
import { DbProvider } from "./DbProvider";

const router = createBrowserRouter([
  {
    path: "/:page/tabs/:tab",
    element: <Page />,
    loader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DbProvider>
      <RouterProvider router={router} />
    </DbProvider>
  </React.StrictMode>
);
