import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import FinancialDashboard from "../Pages/Dashboard/User/FinancialDashboard";
import AdminDashboard from "../Pages/Dashboard/Admin/Admindashboard";

const DashboardIndex = () => {
  const { user } = useContext(AuthContext)
  const role = user?.role;

  if (role === 'admin') {
    return <AdminDashboard />
  }

  return <FinancialDashboard />
};

export default DashboardIndex