import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import SignIn from "../Pages/Authentication/SignIn";
import SignUp from "../Pages/Authentication/SignUp";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivetRoute from "../routes/PrivetRoute";
import Transactions from "../Pages/Dashboard/User/Transaction";
import ManageCategory from "../Pages/Dashboard/Admin/ManageCategory";
import BudgetPlanner from "../Pages/Dashboard/User/BudgetPlanner";
import Analytics from "../Pages/Dashboard/User/Analytics";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import DashboardIndex from "../Components/DashboardIndex";
import Forbidden from "../Components/Forbidden";
import AdminRoute from "../routes/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
        {
            index: true,
            element: <SignIn />
        },
        {
            path: '/signup',
            element: <SignUp />
        },
        {
          path: '/forbidden',
          element: <Forbidden />
        }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivetRoute><DashboardLayout /></PrivetRoute>,
    children: [
      {
        index: true,
        element: <DashboardIndex />
      },
      {
        path: 'transaction',
        element: <Transactions />
      },
      {
        path: 'manage-categories',
        element: <AdminRoute><ManageCategory /></AdminRoute>
      },
      {
        path: 'budget-planner',
        element: <BudgetPlanner />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'manage-users',
        element: <AdminRoute><ManageUsers /></AdminRoute>
      }
    ]
  }
]);