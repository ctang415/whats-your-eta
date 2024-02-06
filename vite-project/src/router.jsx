import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import App from "./App";
import Home from "./components/home";
import Train from "./components/train";
import Trains from "./components/trains";

const Router = () => {
    const router = createBrowserRouter([
    {
      element: <App/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/trains",
          element: <Trains/>
        },
        {
          path: "/trains/:trainid",
          element: <Train/>
        }
      ]
    }
  ])
  return <RouterProvider router={router}/>
}

  export default Router