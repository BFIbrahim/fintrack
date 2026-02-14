import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { HiOutlineUsers, HiOutlineDatabase, HiOutlineCurrencyDollar, HiOutlineShieldCheck } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    const axiosInstance = useAxiosSecure();

    const { data: adminData, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosInstance.get('/admin-stats');
            return res.data;
        }
    });

    if (isLoading) return <div className="p-20 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    const { stats, recentUsers } = adminData || {};

    const chartData = [
        { name: 'Admins', value: stats?.adminCount || 0 },
        { name: 'Users', value: stats?.memberCount || 0 },
    ];
    const COLORS = ['#6366f1', '#f43f5e'];

    return (
        <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatCard icon={<HiOutlineUsers />} label="Total Members" value={stats?.totalUsers} color="bg-blue-500" />
                <StatCard icon={<HiOutlineDatabase />} label="Transactions" value={stats?.totalTransactions} color="bg-purple-500" />
                <StatCard icon={<HiOutlineCurrencyDollar />} label="Total Volume" value={`৳${stats?.totalVolume.toLocaleString()}`} color="bg-emerald-500" />
                <StatCard icon={<HiOutlineShieldCheck />} label="Admins" value={stats?.adminCount} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-4">Role Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-6">Recently Joined</h3>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-slate-400 uppercase text-xs">
                                    <th>User</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers?.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img className="w-10 h-10 rounded-xl" src={user.profileImage} alt="" />
                                                <div className="font-bold text-slate-700 text-sm">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td><span className="badge badge-success badge-sm text-white">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
        <div className={`p-4 ${color} text-white rounded-2xl text-2xl shadow-lg shadow-gray-200`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase">{label}</p>
            <h2 className="text-2xl font-black text-slate-800">{value}</h2>
        </div>
    </div>
);

export default AdminDashboard;