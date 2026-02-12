import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { FiMenu } from "react-icons/fi";
import { MdSpaceDashboard, MdLogout } from "react-icons/md";
import { NavLink, Outlet, useNavigate } from "react-router";
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
        `flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-accent/40 hover:text-black ${
            isActive ? "bg-primary/40 text-black" : "text-gray-700"
        }`;

    return (
        <div className="drawer lg:drawer-open bg-base-100 text-base-content">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col bg-gray-100">
                <div className="navbar bg-base-100 border-b border-neutral/30 lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="dashboard-drawer" className="btn btn-ghost text-primary text-xl">
                            <FiMenu />
                        </label>
                    </div>
                    <div className="flex-1">
                        <span className="text-lg font-bold text-primary">FinTrack</span>
                    </div>
                </div>
                <Outlet />
            </div>

            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

                <aside className="w-80 min-h-full flex flex-col bg-base-100">
                    
                    <div className="p-6 border-b border-primary/10">
                        <h1 className="text-2xl font-black text-primary italic">
                            FinTrack
                        </h1>
                    </div>

                    <ul className="menu p-4 w-full flex-1 gap-1">
                        <li>
                            <NavLink to="/dashboard" end className={navLinkStyles}>
                                <MdSpaceDashboard /> Dashboard
                            </NavLink>
                        </li>
                    </ul>

                    <div className="mt-auto border-t border-primary/10 p-4 space-y-2">
                        <div className="flex items-center gap-3 p-2">
                            <div className="avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100">
                                    <img src={user?.profileImage || "https://i.ibb.co/2kR2zq0/user.png"} alt="User" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-sm text-primary truncate uppercase">
                                    {user?.name || "Guest User"}
                                </h3>
                                <p className="text-[10px] text-neutral font-bold opacity-60 tracking-widest">
                                    {isAdmin ? "ADMIN PORTAL" : "USER PANEL"}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full rounded-lg px-3 py-2.5 transition text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold text-sm"
                        >
                            <MdLogout className="text-lg" />
                            Logout
                        </button>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;