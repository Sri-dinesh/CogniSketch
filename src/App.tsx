import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import Landing from "@/screens/landing";
import Drawing from "@/screens/drawing";

import "@/index.css";

const paths = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/drawing",
    element: <Drawing />,
  },
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />
    </MantineProvider>
  );
};

export default App;
