import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import SignIn from "../Pages/Authentication/SignIn";
import SignUp from "../Pages/Authentication/SignUp";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivetRoute from "../routes/PrivetRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
        {
            index: true,
            element: <SignIn />
        } ,
        {
            path: '/signup',
            element: <SignUp />
        }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivetRoute><DashboardLayout /></PrivetRoute>
  }
]);