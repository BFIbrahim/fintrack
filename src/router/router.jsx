import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import SignIn from "../Pages/Authentication/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
        {
            index: true,
            element: <SignIn />
        } 
    ]
  },
]);