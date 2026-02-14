import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Admindashboard from "../Pages/Dashboard/Admin/Admindashboard";
import FinancialDashboard from "../Pages/Dashboard/User/FinancialDashboard";

const DashboardIndex = () => {
  const { user } = useContext(AuthContext)
  const role = user?.role;

  if (role === 'admin') {
    return <Admindashboard />
  }

  return <FinancialDashboard />
};

export default DashboardIndex