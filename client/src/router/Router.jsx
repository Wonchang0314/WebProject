import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../components/home/Home";
import NewAnswer from "../components/newAnswer/NewAnswer";
import NewQuestion from "../components/newQuestion/NewQuestion";
import TagPage from "../components/tags/Tags";
import Layout from "../components/Layout";
import Answer from "../components/answer/Answer";

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/question/:id/answers",
      element: (
        <Layout>
          <NewAnswer />
        </Layout>
      ),
    },
    {
      path: "/newQuestion",
      element: (
        <Layout>
          <NewQuestion />
        </Layout>
      ),
    },
    {
      path: "/tag",
      element: (
        <Layout>
          <TagPage />
        </Layout>
      ),
    },
    {
      path: "/question/:id",
      element: (
        <Layout>
          <Answer />
        </Layout>
      ),
    },
    {
      path: "/tag/:tagName",
      element: <HomePage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
