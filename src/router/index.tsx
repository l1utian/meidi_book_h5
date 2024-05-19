import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Loading from "@/components/Loading";
import Book from "@/views/Book";
import NotFound from "@/views/NotFound";

const router = createBrowserRouter([
  {
    path: "/:code?",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Book />
      </React.Suspense>
    ),
    index: true,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
