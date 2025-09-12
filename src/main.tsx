import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import React from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./AppLayout";
import { Info, Form, DeparturesLayout, PageNotFound } from "./components";
import "./scss/main.scss";
import { LanguageContextProvider } from "./context";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Form },
      {
        path: "departures",
        Component: DeparturesLayout,
        children: [
          { path: ":from/:to/:date/:time", element: <div>departures list</div> },
        ]
      },
      { path: "info", Component: Info }
    ]
  },
  {
    path: "*", Component: PageNotFound
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LanguageContextProvider>
      <RouterProvider router={router} />
    </LanguageContextProvider>
  </React.StrictMode>
);
