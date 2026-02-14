import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { FiMenu } from "react-icons/fi";
import { MdSpaceDashboard, MdLogout, MdTrendingUp, MdRestaurantMenu, MdCategory, MdOutlineStar, MdKitchen, MdCalendarMonth, MdPayment, MdAccountBalanceWallet, MdAnalytics } from "react-icons/md";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FaBook, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

const DashboardLayout = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        Swal.fire({
            title: "Sign Out?",
            text: "Are you sure you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#cbd5e1",
            confirmButtonText: "Yes, Logout",
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser().then(() => {
                    navigate("/");
                    Swal.fire({
                        title: "Logged Out",
                        icon: "success",
                        timer: 1000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                });
            }
        });
    };

    const navLinkStyles = ({ isActive }) => 
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group relative ${
            isActive 
            ? "bg-primary text-white shadow-md shadow-primary/20" 
            : "text-gray-500 hover:bg-primary/10 hover:text-primary"
        }`;

    return (
        <div className="drawer lg:drawer-open bg-slate-100 min-h-screen">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                <div className="navbar bg-white/80 backdrop-blur-md border-b border-slate-200 lg:hidden sticky top-0 z-40">
                    <div className="flex-none">
                        <label htmlFor="dashboard-drawer" className="btn btn-ghost text-primary text-xl">
                            <FiMenu />
                        </label>
                    </div>
                    <div className="flex-1 px-2">
                        <span className="text-xl font-black text-primary italic">FinTrack</span>
                    </div>
                </div>

                <main className="p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>

            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

                <aside className="w-72 min-h-full flex flex-col bg-white border-r border-slate-200 shadow-xl shadow-slate-200/50">
                    
                    <div className="p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-transparent">
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
                                <MdTrendingUp className="text-white text-xl" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight italic">
                                <span className="text-primary">Fin</span>
                                <span className="text-accent">Track</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-[1px] w-4 bg-primary/40"></span>
                            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400">
                                Smart Money Management
                            </span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-4">Main Menu</p>
                        <ul className="space-y-2">
                            <li>
                                <NavLink to="/dashboard" end className={navLinkStyles}>
                                    <MdSpaceDashboard className="text-xl" /> 
                                    <span className="font-semibold">Dashboard</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/analytics" end className={navLinkStyles}>
                                    <MdAnalytics className="text-xl" /> 
                                    <span className="font-semibold">Analytics</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/transaction" end className={navLinkStyles}>
                                    <MdPayment className="text-xl" /> 
                                    <span className="font-semibold">Transaction</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manage-categories" end className={navLinkStyles}>
                                    <MdCategory className="text-xl" /> 
                                    <span className="font-semibold">Manage Category</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/budget-planner" end className={navLinkStyles}>
                                    <MdAccountBalanceWallet className="text-xl" /> 
                                    <span className="font-semibold">Budget Planner</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm mb-3">
                            <div className="avatar">
                                <div className="w-10 rounded-xl ring-2 ring-primary/10">
                                    <img src={user?.profileImage || "https://i.ibb.co/2kR2zq0/user.png"} alt="User" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-bold text-sm text-slate-800 truncate uppercase tracking-tight">
                                    {user?.name || "Guest User"}
                                </h3>
                                <p className="text-[9px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    {isAdmin ? "Admin" : "Member"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full rounded-xl px-3 py-3 transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-500 font-bold text-sm cursor-pointer group"
                        >
                            <MdLogout className="text-lg group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;