import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import SignIn from "../Pages/Authentication/SignIn";
import SignUp from "../Pages/Authentication/SignUp";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivetRoute from "../routes/PrivetRoute";
import Transactions from "../Pages/Dashboard/User/Transaction";
import ManageCategory from "../Pages/Dashboard/Admin/ManageCategory";
import BudgetPlanner from "../Pages/Dashboard/User/BudgetPlanner";

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
    element: <PrivetRoute><DashboardLayout /></PrivetRoute>,
    children: [
      {
        path: 'transaction',
        element: <Transactions />
      },
      {
        path: 'manage-categories',
        element: <ManageCategory />
      },
      {
        path: 'budget-planner',
        element: <BudgetPlanner />
      }
    ]
  }
]);